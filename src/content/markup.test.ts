// 마크업 파서 고정 테스트. 검증기는 이 파서를 믿으므로, 파서가 틀리면 검증기도 틀린다.
import { describe, it, expect, vi } from "vitest";
import {
  parseBlocks,
  parseInline,
  syncKeysInTex,
  expandSyncMacros,
  plainText,
  type Inline,
} from "./markup";

// 이 파일의 검증기 테스트는 가짜 노드로 돈다. 실제 검토 기록(reviews.json)을 읽으면, 저자가 노드를 검토할 때마다
// 가짜 책에 없는 id가 P027로 잡혀 테스트가 깨진다. 그래서 검토 기록을 빈 것으로 바꿔 끼운다.
vi.mock("./reviews.json", () => ({ default: {} }));
import { verify } from "../verify/verify";
import type { Book } from "./schema";

describe("인라인", () => {
  it("용어/왜?/링크/수식/굵게/코드", () => {
    const r = parseInline(
      String.raw`a [벡터](t:t.vector) $x_1$ **굵게 [b](def:t.b)** [왜?](why:n.a) [보기](n:n.b) \`f()\` [x](fwd:t.c)`,
    );
    expect(r.map((x) => x.t)).toEqual([
      "text",
      "term",
      "text",
      "math",
      "text",
      "b",
      "text",
      "why",
      "text",
      "link",
      "text",
      "code",
      "text",
      "fwd",
    ]);
  });
  it("수식 안의 대괄호는 링크로 읽지 않는다", () => {
    const r = parseInline(String.raw`[$[a]$ 이다](t:t.x)`);
    expect(r[0].t).toBe("term");
  });
  it("일반 대괄호는 글자 그대로", () => {
    expect(parseInline("[참고] 끝")).toEqual([{ t: "text", v: "[참고] 끝" }]);
  });
  it("\\$ 는 달러 글자", () => {
    expect(parseInline(String.raw`가격 \$5`)).toEqual([
      { t: "text", v: "가격 $5" },
    ]);
  });
});

describe("블록", () => {
  it("문단/수식/장면/목록/상자", () => {
    const b = parseBlocks(String.raw`첫 문단
이어지는 줄

$$a = b$$

::scene transform-grid {"A": [[1,0],[0,1]]}

- 하나
- 둘

> [!비유] 수도꼭지
> 둘째 줄`);
    expect(b.map((x) => x.t)).toEqual(["p", "math", "scene", "ul", "note"]);
    expect(b[2]).toMatchObject({
      t: "scene",
      id: "transform-grid",
      params: {
        A: [
          [1, 0],
          [0, 1],
        ],
      },
    });
    expect(b[4]).toMatchObject({ t: "note", kind: "비유" });
  });
  it("여러 줄 수식", () => {
    const b = parseBlocks("$$\na\n+ b\n$$");
    expect(b).toEqual([{ t: "math", tex: "a\n+ b" }]);
  });
  it("등식 줄: 첫 관계 기호에서 가르고, ∵ 뒤는 근거", () => {
    const b = parseBlocks(
      "::chain\n0a = (0 + 0)a ∵ 0의 공리\n= 0a + 0a ∵ [명제 1](n:x)\n\\le 3\n\n뒤",
    );
    expect(b[0]).toMatchObject({
      t: "chain",
      rows: [
        { lhs: "0a", rhs: "= (0 + 0)a", why: [{ t: "text", v: "0의 공리" }] },
        { lhs: "", rhs: "= 0a + 0a", why: [{ t: "link", to: "x" }] },
        { lhs: "", rhs: "\\le 3" },
      ],
    });
    expect(b[1]).toMatchObject({ t: "p" });
    // 중괄호 안의 = 는 가르지 않는다
    expect(parseBlocks("::chain\n\\tfrac{a=b}{2} = c")[0]).toMatchObject({
      rows: [{ lhs: "\\tfrac{a=b}{2}", rhs: "= c" }],
    });
    // 둘째 줄부터 왼쪽 변이 있으면 오류
    expect(() => parseBlocks("::chain\na = b\nc = d")).toThrow();
  });
});

describe("번호 목록", () => {
  it("4. 로 시작하면 4부터 센다", () => {
    expect(parseBlocks("4. 넷\n5. 다섯")[0]).toMatchObject({
      t: "ul",
      ordered: true,
      start: 4,
    });
    expect(parseBlocks("1. 하나")[0]).not.toHaveProperty("start");
  });
  it("1. 2. 는 ol, 문단과 섞이지 않는다", () => {
    const b = parseBlocks("앞 문단\n1. 하나\n2. 둘\n\n뒤");
    expect(b.map((x) => x.t)).toEqual(["p", "ul", "p"]);
    expect(b[1]).toMatchObject({ ordered: true });
    expect((b[1] as { items: unknown[] }).items.length).toBe(2);
  });
});

describe("동기화 매크로", () => {
  it("키 추출과 확장", () => {
    expect(syncKeysInTex(String.raw`\h{col1}{a} + \h{x}{b}`)).toEqual([
      "col1",
      "x",
    ]);
    expect(expandSyncMacros(String.raw`\h{col1}{a}`)).toBe(
      String.raw`\htmlData{sync=col1}{a}`,
    );
  });
});

describe("검증기 규칙", () => {
  const mk = (nodes: Book["nodes"]): Book[] => [
    { id: "b", num: 0, title: "", subtitle: "", nodes },
  ];
  const rules = (books: Book[]) =>
    verify(books, new Set(["s"]), new Map()).issues.map((i) => i.rule);
  const T = { id: "t.a", ko: "가나다", gloss: "" };
  it("P001 정의 전 사용", () => {
    expect(
      rules(
        mk([
          {
            id: "n1",
            kind: "def",
            title: "",
            status: "written",
            body: "[가나다](t:t.a)",
          },
          {
            id: "n2",
            kind: "def",
            title: "",
            status: "written",
            introduces: { terms: [T] },
            body: "[가나다](def:t.a)",
          },
        ]),
      ),
    ).toContain("P001");
  });
  it("P003 뒤쪽을 가리키는 왜?", () => {
    expect(
      rules(
        mk([
          {
            id: "n1",
            kind: "def",
            title: "",
            status: "written",
            body: "[왜?](why:n2)",
          },
          { id: "n2", kind: "def", title: "", status: "written", body: "x" },
        ]),
      ),
    ).toContain("P003");
  });
  it("P008 표시 없는 언급", () => {
    expect(
      rules(
        mk([
          {
            id: "n1",
            kind: "def",
            title: "",
            status: "written",
            body: "가나다를 쓴다",
          },
          {
            id: "n2",
            kind: "def",
            title: "",
            status: "written",
            introduces: { terms: [T] },
            body: "[가나다](def:t.a)",
          },
        ]),
      ),
    ).toContain("P008");
  });
  it("P015 선언했지만 def: 자리가 없음", () => {
    expect(
      rules(
        mk([
          {
            id: "n1",
            kind: "def",
            title: "",
            status: "written",
            introduces: { terms: [T] },
            body: "가나다",
          },
        ]),
      ),
    ).toContain("P015");
  });
  it("P020 예측 배치 오류, P022 정답 범위, P023 그림 예측 행렬", () => {
    const r = rules(
      mk([
        {
          id: "n1",
          kind: "exp",
          title: "",
          status: "written",
          body: "::predict a\n\n::predict ghost\n\n> 상자\n> ::predict b",
          predicts: [
            { id: "a", kind: "choice", q: "?", choices: ["x"], answer: 3 },
            { id: "b", kind: "choice", q: "?", choices: ["x"], answer: 0 },
            {
              id: "c",
              kind: "point",
              q: "?",
              A: [
                [0, -1],
                [1, 0],
              ],
              target: "eig",
            },
          ],
        },
      ]),
    );
    expect(r.filter((x) => x === "P020").length).toBeGreaterThanOrEqual(3); // ghost 없음, 상자 안, c 배치 안 됨
    expect(r).toContain("P022");
    expect(r).toContain("P023"); // 회전에는 실수 고유 방향이 없다
  });
  it("P010 없는 장면", () => {
    expect(
      rules(
        mk([
          {
            id: "n1",
            kind: "exp",
            title: "",
            status: "written",
            body: "::scene nope",
          },
        ]),
      ),
    ).toContain("P010");
  });
  it("P029 미뤄 둔 질문과 답 표지의 짝", () => {
    const ask = {
      id: "n1",
      kind: "exp" as const,
      title: "",
      status: "written" as const,
      body: "질문을 남긴다",
      openWhys: [{ q: "왜?", answeredBy: "n2" }],
    };
    // 짝이 맞으면 조용하다
    expect(
      rules(
        mk([
          ask,
          {
            id: "n2",
            kind: "exp",
            title: "",
            status: "written",
            body: "::answers n1\n\n답이다.",
          },
        ]),
      ),
    ).not.toContain("P029");
    // 답한다고 했는데 표지가 없다
    expect(
      rules(
        mk([
          ask,
          {
            id: "n2",
            kind: "exp",
            title: "",
            status: "written",
            body: "답이다.",
          },
        ]),
      ),
    ).toContain("P029");
    // 표지가 미뤄 둔 질문이 없는 노드를 가리킨다
    expect(
      rules(
        mk([
          { ...ask, openWhys: [] },
          {
            id: "n2",
            kind: "exp",
            title: "",
            status: "written",
            body: "::answers n1",
          },
        ]),
      ),
    ).toContain("P029");
  });
  it("이름표와 참조: label/ref 파싱", () => {
    expect(parseInline("[](label:neg) 덧셈 역원")[0]).toMatchObject({
      t: "label",
      key: "neg",
      c: [],
    });
    expect(parseInline("[공리 5](ref:ax.x#neg)")[0]).toMatchObject({
      t: "ref",
      node: "ax.x",
      key: "neg",
    });
    expect(parseInline("[명제 2](ref:two)")[0]).toMatchObject({
      t: "ref",
      key: "two",
    });
    expect(parseInline("[명제 2](ref:two)")[0]).not.toHaveProperty("node");
  });
  it("P030 이름표·참조: 번호는 자동으로 매기고, 다른 장의 명제에는 장을 붙인다", () => {
    const ax = {
      id: "ax.x",
      kind: "ax" as const,
      title: "",
      status: "written" as const,
      body: "- [](label:one) 하나\n- [](label:two) 둘\n- [0의 공리](label:z) 영",
    };
    const p1 = {
      id: "p.y",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "- [](label:m1) 가\n- [](label:m2) 나\n\n[](ref:ax.x#two)와 [](ref:m2)를 쓴다.",
      proof: "::proves m1\n\n가\n\n::proves m2\n\n나",
    };
    const p2 = {
      id: "p.z",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "[](label:main). [](ref:p.y#m2)을 쓴다.",
      proof: "증명",
    };
    const two: Book[] = [
      { id: "c0", num: 0, title: "", subtitle: "", nodes: [ax, p1] },
      { id: "c1", num: 1, title: "", subtitle: "", nodes: [p2] },
    ];
    const r = verify(two, new Set(), new Map());
    expect(
      r.issues.filter((i) => i.rule === "P030" || i.rule === "P031"),
    ).toEqual([]);
    // 공리는 책 전체에서, 명제는 장마다 센다
    expect(
      ["ax.x#one", "ax.x#two", "ax.x#z", "p.y#m1", "p.y#m2", "p.z#main"].map(
        (k) => r.labels.get(k)!.name,
      ),
    ).toEqual(["공리 1", "공리 2", "0의 공리", "명제 1", "명제 2", "명제 1"]);
    // 참조의 글: 같은 장은 그대로, 다른 장은 장을 붙이고, 뒤의 조사도 번호에 맞춘다("명제 2을" → "명제 2를")
    const shown = (id: string) =>
      plainText(
        r.parsed.get(id)!.body.at(-1)!.t === "p"
          ? (r.parsed.get(id)!.body.at(-1) as { c: Inline[] }).c
          : [],
      );
    expect(shown("p.y")).toBe("공리 2와 명제 2를 쓴다.");
    expect(shown("p.z")).toContain("0장 명제 2를 쓴다.");
    // 번호를 손으로 적으면, 또는 글자가 이름과 다르면 P030
    expect(
      rules(mk([{ ...ax, body: "- [공리 1](label:one) 하나" }])),
    ).toContain("P030");
    expect(
      rules(
        mk([
          ax,
          {
            ...p1,
            body: "- [](label:m1) 가\n- [](label:m2) 나\n\n[공리 3](ref:ax.x#two)",
          },
        ]),
      ),
    ).toContain("P030");
    // 번호 이름표는 공리·명제 노드에만
    expect(
      rules(
        mk([
          {
            id: "d.q",
            kind: "def",
            title: "",
            status: "written",
            body: "[](label:q) 뜻",
          },
        ]),
      ),
    ).toContain("P030");
    // 표시 없는 번호. 횟수를 말하는 "12번 곱한"은 잡지 않는다
    expect(
      rules(
        mk([
          ax,
          {
            ...p1,
            body: "- [](label:m1) 가\n- [](label:m2) 나\n\n공리 2와 0의 공리로, 1번을 쓴다.",
          },
        ]),
      ).filter((x) => x === "P031").length,
    ).toBe(3);
    expect(
      rules(
        mk([
          {
            id: "e.r",
            kind: "exp",
            title: "",
            status: "written",
            body: "30°씩 12번 곱한다.",
          },
        ]),
      ),
    ).not.toContain("P031");
    // 목록 번호를 잇는 "1 ⇔ 2"는 잡고, 이름을 드러낸 "(가) ⇔ (나)"와 수식 속 화살표는 잡지 않는다
    expect(
      rules(
        mk([
          {
            id: "e.s",
            kind: "exp",
            title: "",
            status: "written",
            body: "**1 ⇔ 2.** 증명",
          },
        ]),
      ),
    ).toContain("P031");
    expect(
      rules(
        mk([
          {
            id: "e.t",
            kind: "exp",
            title: "",
            status: "written",
            body: "**(가) ⇔ (나).** $x \\Rightarrow 2$",
          },
        ]),
      ),
    ).not.toContain("P031");
    // 참조 뒤에 손으로 이어 적은 번호는 잡고, 참조 뒤의 개수·배수 같은 수는 잡지 않는다
    const tail = (t: string) =>
      rules(
        mk([
          ax,
          { ...p1, body: `- [](label:m1) 가\n- [](label:m2) 나\n\n${t}` },
        ]),
      ).filter((x) => x === "P031").length;
    expect(tail("[](ref:ax.x#one), 2 그대로다.")).toBe(1);
    expect(tail("[](ref:ax.x#one)와 2를 쓴다.")).toBe(1);
    expect(tail("[](ref:ax.x#one), 3개의 수를 쓴다.")).toBe(0);
  });
  it("앞질러 가기 ahead: 뒤 노드의 이름표를 가리키고, 근거로 쓰는 자리에는 둘 수 없다", () => {
    expect(parseInline("[](ahead:p.y#m2)")).toEqual([
      { t: "ref", node: "p.y", key: "m2", c: [], ahead: true },
    ]);
    const ax = {
      id: "ax.x",
      kind: "ax" as const,
      title: "",
      status: "written" as const,
      body: "- [](label:one) 하나\n\n그것이 하나뿐임은 [](ahead:p.z#u)을 본다.",
    };
    const p1 = {
      id: "p.y",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "[](label:m1) 가",
      proof: "증명",
    };
    const p2 = {
      id: "p.z",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "[](label:t) 다\n\n[](label:u) 라",
      proof: "::proves t\n\n가\n\n::proves u\n\n나",
    };
    const two: Book[] = [
      { id: "c0", num: 0, title: "", subtitle: "", nodes: [ax, p1] },
      { id: "c1", num: 1, title: "", subtitle: "", nodes: [p2] },
    ];
    const r = verify(two, new Set(), new Map());
    expect(
      r.issues.filter((i) => i.rule === "P030" || i.rule === "P031"),
    ).toEqual([]);
    // 뒤 노드의 번호는 끝에서 채워지고, 다른 장이면 장을 붙이며, 뒤의 조사도 번호에 맞춘다("명제 2을" → "명제 2를")
    const p = r.parsed.get("ax.x")!.body.at(-1) as { c: Inline[] };
    expect(plainText(p.c)).toBe("그것이 하나뿐임은 1장 명제 2를 본다.");
    // 앞질러 가리킨 것은 "뒤에서 쓰이는 곳"이 아니고, 의존 간선도 만들지 않는다
    expect(r.uses.get("p.z#u")).toBeUndefined();
    expect(r.edges.some((e) => e.from === "ax.x" && e.to === "p.z")).toBe(
      false,
    );
    const p030 = (books: Book[]) =>
      verify(books, new Set(), new Map())
        .issues.filter((i) => i.rule === "P030")
        .map((i) => i.msg);
    const withAx = (body: string, proof?: string) => [
      {
        ...two[0],
        nodes: [
          {
            ...ax,
            body: `- [](label:one) 하나\n\n${body}`,
            ...(proof ? { kind: "prop" as const, proof } : {}),
          },
          p1,
        ],
      },
      two[1],
    ];
    // 앞 노드는 ref:로
    expect(p030(withAx("[](ahead:ax.x#one)")).join()).toContain(
      "뒤 노드의 이름표만",
    );
    // 증명 안, 등식 줄의 근거 칸에는 둘 수 없다
    expect(
      p030([
        {
          ...two[0],
          nodes: [ax, { ...p1, proof: "[](ahead:p.z#u)로 끝난다." }],
        },
        two[1],
      ]).join(),
    ).toContain("근거 칸");
    expect(p030(withAx("::chain\na = b ∵ [](ahead:p.z#u)")).join()).toContain(
      "근거 칸",
    );
    // 없는 이름표, 그리고 ref:로 뒤를 가리키면 ahead:를 쓰라고 알린다
    expect(p030(withAx("[](ahead:p.z#none)")).join()).toContain("없는 이름표");
    expect(p030(withAx("[](ref:p.z#u)")).join()).toContain("ahead:");
  });
  it("의의 칩: 파싱과 P033", () => {
    expect(parseInline("[왜 알아야 하나](sig:why)")[0]).toMatchObject({
      t: "sig",
      key: "why",
    });
    const n = {
      id: "d.s",
      kind: "def" as const,
      title: "",
      status: "written" as const,
      body: "뜻이다. [왜 알아야 하나](sig:why)",
      significance: { why: "쓰임이 많다." },
    };
    expect(rules(mk([n]))).not.toContain("P033");
    expect(rules(mk([{ ...n, significance: {} }]))).toContain("P033"); // 내용 없는 칩
    expect(rules(mk([{ ...n, body: "뜻이다." }]))).toContain("P033"); // 칩 없는 내용
  });
  it("결론 ∴: 새 줄로 시작하면 문단 안에서 줄을 바꾸고, 앞 문장에 이어 쓰면 P034", () => {
    expect(parseBlocks("가는 나다.\n∴ 다는 라다.")).toEqual([
      {
        t: "p",
        c: [
          { t: "text", v: "가는 나다." },
          { t: "br" },
          { t: "text", v: "∴ 다는 라다." },
        ],
      },
    ]);
    // 보통 줄은 그대로 공백으로 잇는다
    expect(parseBlocks("가는\n나다.")).toEqual([
      { t: "p", c: [{ t: "text", v: "가는 나다." }] },
    ]);
    const p034 = (body: string) =>
      rules(
        mk([{ id: "e.c", kind: "exp", title: "", status: "written", body }]),
      ).filter((x) => x === "P034").length;
    expect(p034("가는 나다. ∴ 다는 라다.")).toBe(1);
    expect(
      p034(
        "가는 나다([](ref:e.c#x)). ∴ 다는 라다.".replace(
          "[](ref:e.c#x)",
          "근거",
        ),
      ),
    ).toBe(1);
    expect(p034("가는 나다.\n∴ 다는 라다.")).toBe(0);
    // 기호 자체를 말하는 자리는 잡지 않는다
    expect(p034('결론 문장 맨 앞의 ∴는 "그러므로"라고 읽는다.')).toBe(0);
  });
  it("증명 표지와 키가 달린 왜? 칩", () => {
    expect(parseBlocks("::proves two\n\n증명")[0]).toEqual({
      t: "proves",
      key: "two",
    });
    expect(parseInline("[왜?](why:p.y#m1)")[0]).toMatchObject({
      t: "why",
      to: "p.y",
      key: "m1",
    });
    expect(parseInline("[왜?](why:p.y)")[0]).not.toHaveProperty("key");
  });
  it("P032 명제와 증명의 짝, 뒤에서 쓰이는 곳", () => {
    const one = {
      id: "p.a",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "[](label:main). 가",
      proof: "증명",
    };
    const two = {
      id: "p.b",
      kind: "prop" as const,
      title: "",
      status: "written" as const,
      body: "- [](label:x) 가\n- [](label:y) 나",
      proof: "::proves x\n\n가의 증명\n\n::proves y\n\n나의 증명",
    };
    const user = {
      id: "e.c",
      kind: "exp" as const,
      title: "",
      status: "written" as const,
      body: "[왜?](why:p.a) [왜?](why:p.b#y)",
    };
    const r = verify(mk([one, two, user]), new Set(), new Map());
    expect(r.issues.filter((i) => i.rule === "P032")).toEqual([]);
    // 명제가 하나면 노드를 가리키는 왜? 칩도 그 명제가 쓰인 곳이다. 여럿이면 키가 달린 칩만 센다.
    expect(r.uses.get("p.a#main")).toEqual(["e.c"]);
    expect(r.uses.get("p.b#y")).toEqual(["e.c"]);
    expect(r.uses.get("p.b#x")).toBeUndefined();
    // 이름표 없는 명제, 명제가 여럿인데 표지가 빠짐, 없는 명제를 가리키는 표지
    expect(rules(mk([{ ...one, body: "**명제.** 가" }]))).toContain("P032");
    expect(rules(mk([{ ...two, proof: "::proves x\n\n가의 증명" }]))).toContain(
      "P032",
    );
    expect(rules(mk([{ ...one, proof: "::proves nope\n\n증명" }]))).toContain(
      "P032",
    );
  });
  it("fwd: 예고는 허용", () => {
    const r = rules(
      mk([
        {
          id: "n1",
          kind: "def",
          title: "",
          status: "written",
          body: "[가나다](fwd:t.a)",
        },
        {
          id: "n2",
          kind: "def",
          title: "",
          status: "written",
          introduces: { terms: [T] },
          body: "[가나다](def:t.a)",
        },
      ]),
    );
    expect(r.filter((x) => x !== "P014" && x !== "P006")).toEqual([]);
  });
});

describe("첫 등장 자동 링크", () => {
  const mk = (nodes: Book["nodes"]): Book[] => [
    { id: "b", num: 0, title: "", subtitle: "", nodes },
  ];
  const T = { id: "t.a", ko: "가나다", gloss: "" };
  const def = {
    id: "n1",
    kind: "def" as const,
    title: "",
    status: "written" as const,
    introduces: { terms: [T] },
    body: "[가나다](def:t.a)",
  };
  const terms = (xs: { t: string; id?: string }[]) =>
    xs.filter((x) => x.t === "term").map((x) => x.id);

  it("뒤 노드의 첫 등장만 링크가 된다. 소제목은 건너뛴다", () => {
    const r = verify(
      mk([
        def,
        {
          id: "n2",
          kind: "def",
          title: "",
          status: "written",
          body: "### 가나다\n\n가나다는 둘째 가나다다.",
        },
      ]),
      new Set(),
      new Map(),
    );
    const [h, p] = r.parsed.get("n2")!.body as {
      c: { t: string; id?: string }[];
    }[];
    expect(terms(h.c)).toEqual([]);
    expect(terms(p.c)).toEqual(["t.a"]);
    expect(r.autoLinked).toBe(1);
  });
  it("보기 단추에는 달지 않고, 힌트 안의 링크는 본문의 첫 등장을 대신하지 않는다", () => {
    const r = verify(
      mk([
        def,
        {
          id: "n2",
          kind: "def",
          title: "",
          status: "written",
          predicts: [
            {
              id: "p",
              kind: "choice",
              q: "물음",
              choices: ["가나다", "아님"],
              answer: 0,
              hints: ["가나다를 보라"],
            },
          ],
          body: "::predict p\n\n답은 가나다다.",
        },
      ]),
      new Set(),
      new Map(),
    );
    const pn = r.parsed.get("n2")!;
    const pp = pn.predicts.get("p")!;
    expect(terms(pp.choices[0] as { t: string }[])).toEqual([]);
    expect(terms((pp.hints[0][0] as { c: { t: string }[] }).c)).toEqual([
      "t.a",
    ]);
    expect(terms((pn.body[1] as { c: { t: string }[] }).c)).toEqual(["t.a"]);
  });
  it("정의한 노드 안에서는 자기 자신에게 링크를 달지 않는다", () => {
    const r = verify(
      mk([
        { ...def, body: "가나다를 먼저 말하고 [가나다](def:t.a)를 정의한다." },
      ]),
      new Set(),
      new Map(),
    );
    expect(r.autoLinked).toBe(0);
  });
  it("word: 로 가리킨 낱말은 용어로 읽지 않는다: 자동 링크도 P008도 없다", () => {
    expect(parseInline("[가나다](word:)라 부른다")).toEqual([
      { t: "word", v: "가나다" },
      { t: "text", v: "라 부른다" },
    ]);
    // 다른 종류는 여전히 대상이 있어야 링크다
    expect(parseInline("[가](n:)")).toEqual([{ t: "text", v: "[가](n:)" }]);
    const before = {
      id: "n0",
      kind: "def" as const,
      title: "",
      status: "written" as const,
      body: "다른 문서는 [가나다](word:)라 부른다.",
    };
    const after = {
      id: "n2",
      kind: "def" as const,
      title: "",
      status: "written" as const,
      body: "어떤 문서는 [가나다](word:)라 부른다. 이 교재의 가나다는 앞에서 정의했다.",
    };
    const r = verify(mk([before, def, after]), new Set(), new Map());
    expect(r.issues.map((i) => i.rule)).not.toContain("P008");
    const p = r.parsed.get("n2")!.body[0] as {
      c: { t: string; id?: string }[];
    };
    expect(p.c[1]).toEqual({ t: "word", v: "가나다" });
    expect(terms(p.c)).toEqual(["t.a"]);
  });
});

describe("상자 제목", () => {
  it("첫 줄의 나머지는 제목이고, 본문에 이어 붙지 않는다", () => {
    const [b] = parseBlocks(
      "> [!주의] 경험과 증명\n> 그림은 한 경우다.\n>\n> 둘째 문단.",
    );
    expect(b.t).toBe("note");
    if (b.t !== "note") return;
    expect(b.kind).toBe("주의");
    expect(b.title).toEqual([{ t: "text", v: "경험과 증명" }]);
    expect(b.blocks.map((x) => x.t)).toEqual(["p", "p"]);
  });
  it("제목이 없으면 title도 없다", () => {
    const [b] = parseBlocks("> [!참고]\n> 내용");
    expect(b.t === "note" && "title" in b).toBe(false);
  });
});

describe("낱말 경계와 모든 등장 링크 (한 글자 용어)", () => {
  const mk = (nodes: Book["nodes"]): Book[] => [
    { id: "b", num: 0, title: "", subtitle: "", nodes },
  ];
  const H = {
    id: "t.h",
    ko: "향",
    gloss: "",
    boundary: true,
    everyMention: true,
  };
  const links = (r: ReturnType<typeof verify>, id: string) =>
    (r.parsed.get(id)!.body[0] as { c: { t: string; c?: { v: string }[] }[] }).c
      .filter((x) => x.t === "term")
      .map((x) => x.c![0].v);

  it("향이·향을은 잡고 방향·편향·향하다·향후는 잡지 않는다", () => {
    const r = verify(
      mk([
        {
          id: "n1",
          kind: "def",
          title: "",
          status: "written",
          introduces: { terms: [H] },
          body: "[향](def:t.h)",
        },
        {
          id: "n2",
          kind: "def",
          title: "",
          status: "written",
          body: "방향과 편향은 다르다. 향이 뒤집히면 향을 되돌린다. 위로 향하는 화살표, 향후의 일.",
        },
      ]),
      new Set(),
      new Map(),
    );
    expect(links(r, "n2")).toEqual(["향", "향"]);
  });
  it("모든 등장 링크는 정의한 노드 안에서도 정의한 자리 뒤부터 단다", () => {
    const r = verify(
      mk([
        {
          id: "n1",
          kind: "def",
          title: "",
          status: "written",
          introduces: { terms: [H] },
          body: "향이 먼저. [향](def:t.h)을 정한다. 향은 뒤집힌다.",
        },
      ]),
      new Set(),
      new Map(),
    );
    expect(links(r, "n1")).toEqual(["향"]);
  });
});

describe("검토 지문", () => {
  it("같은 내용이면 같은 지문, 본문 한 글자가 바뀌면 다른 지문", async () => {
    const { nodeHash } = await import("./review");
    const n = {
      id: "n",
      kind: "def" as const,
      title: "t",
      status: "written" as const,
      body: "가나다",
    };
    expect(nodeHash(n)).toBe(nodeHash({ ...n }));
    expect(nodeHash(n)).not.toBe(nodeHash({ ...n, body: "가나라" }));
    expect(nodeHash(n)).toBe(nodeHash({ ...n, status: "stub" as const })); // 상태 표시는 지문에 넣지 않는다
  });
});
