import { describe, it, expect } from "vitest";
import {
  sentences,
  diffWords,
  diffUnits,
  fields,
  renderNodeDiff,
} from "./review-diff";
import type { NodeDef } from "../src/content/schema";

const node = (over: Partial<NodeDef>): NodeDef => ({
  id: "n",
  kind: "prop",
  title: "제목",
  status: "written",
  body: "",
  ...over,
});

describe("검토 diff", () => {
  it("문장으로 자르되, 수식과 코드 안의 마침표에서는 자르지 않는다", () => {
    expect(
      sentences(
        "첫 문장이다. $1.5 \\times 2. 3$은 수식이다. \\`a. b\\`는 코드다.",
      ),
    ).toEqual([
      "첫 문장이다.",
      "$1.5 \\times 2. 3$은 수식이다.",
      "\\`a. b\\`는 코드다.",
    ]);
  });
  it("번호 목록의 앞머리에서는 자르지 않는다", () => {
    expect(sentences("1. 첫 항목이다. 둘째 문장이다.")).toEqual([
      "1. 첫 항목이다.",
      "둘째 문장이다.",
    ]);
    expect(sentences("(가). 조건이다.")).toEqual(["(가). 조건이다."]);
  });
  it("용어의 표시와 그림 관문의 설정이 바뀌어도 잡힌다", () => {
    const t = (everyMention: boolean) =>
      node({
        introduces: {
          terms: [{ id: "t.x", ko: "향", gloss: "뜻", everyMention }],
        },
      });
    const d = renderNodeDiff(t(false), t(true), {
      color: false,
      context: 0,
      full: false,
    });
    expect(d.summary[0]).toMatch(/^용어·기호 1곳/);
    expect(d.text).toContain("[모든 등장 링크]");
    const g = (tol: number) =>
      node({
        predicts: [
          {
            id: "g",
            kind: "point",
            q: "끌어 놓기",
            A: [
              [1, 0],
              [0, 1],
            ],
            target: "Ax",
            tol,
          },
        ],
      });
    expect(
      renderNodeDiff(g(0.3), g(0.5), { color: false, context: 0, full: false })
        .summary,
    ).toEqual(["관문 g 1곳"]);
  });
  it("한 문장 안에서 지운 말과 넣은 말", () => {
    expect(
      diffWords("다음 노드에서 증명한다.", "다음 노드의 명제 5에서 증명한다."),
    ).toEqual([
      { t: "same", s: "다음 노드" },
      { t: "add", s: "의 명제 5" },
      { t: "same", s: "에서 증명한다." },
    ]);
  });
  it("닮은 문장은 고침으로, 다른 문장은 지움과 넣음으로", () => {
    const u = (s: string) => ({ crumb: "", s, key: s });
    const ops = diffUnits(
      [u("가는 나다."), u("A는 B를 공리로 증명한다.")],
      [u("가는 나다."), u("A는 B를 공리에서 증명한다."), u("완전히 새 문장.")],
    );
    expect(ops.map((o) => o.t)).toEqual(["same", "edit", "add"]);
  });
  it("관문의 정답이 바뀌면 보기의 (정답) 표시가 바뀐 것으로 잡힌다", () => {
    const p = (answer: number) =>
      node({
        predicts: [
          { id: "p", kind: "choice", q: "물음", choices: ["가", "나"], answer },
        ],
      });
    const f = fields(p(1)).find((x) => x.label === "관문 p")!;
    expect(f.units.map((x) => x.crumb)).toEqual([
      "질문",
      "보기 1",
      "보기 2 (정답)",
    ]);
    const d = renderNodeDiff(p(0), p(1), {
      color: false,
      context: 1,
      full: false,
    });
    expect(d.summary).toEqual(["관문 p 1곳(문장 2개)"]);
    // 글은 그대로이고 자리 이름만 바뀐 것을 보여 준다
    expect(d.text).toContain("(보기 1 (정답) → 보기 1)");
    expect(d.text).toContain("(보기 2 → 보기 2 (정답))");
  });
  it("소제목이 바뀌어도 그 아래 문장은 바뀐 것으로 세지 않는다. 상자 제목은 바뀌면 잡힌다", () => {
    const a = node({
      body: "### 옛 소제목\n같은 문장이다.\n\n> [!주의] 옛 제목\n> 상자 글이다.",
    });
    const b = node({
      body: "### 새 소제목\n같은 문장이다.\n\n> [!주의] 새 제목\n> 상자 글이다.",
    });
    const d = renderNodeDiff(a, b, { color: false, context: 0, full: false });
    expect(d.summary).toEqual(["본문 2곳"]);
    expect(d.text).toContain("~ ### [-옛-]{+새+} 소제목");
    expect(d.text).toContain("[!주의] [-옛-]{+새+} 제목");
  });
  it("바뀐 것이 없으면 0곳", () => {
    const a = node({ body: "한 문장. 두 문장." });
    expect(
      renderNodeDiff(a, a, { color: false, context: 1, full: false }).changed,
    ).toBe(0);
  });
});
