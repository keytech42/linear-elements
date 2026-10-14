// 노드별 검토 기록. 저자가 노드를 검토하고 나면 그때의 내용 지문을 src/content/reviews.json에 적는다.
//   npm run review                      검토 상태 목록(검토함 / 검토 뒤 바뀜 / 초안)
//   npm run review -- mark <id...>      지금 내용으로 검토했다고 기록 (장 전체: c0, c1 …)
//   npm run review -- mark --changed    다시 검토한 것만: "검토 뒤 바뀜"인 노드를 모두 다시 기록 (-a도 같다. git commit -a처럼
//                                       이미 검토한 노드만 다루고 초안은 건드리지 않는다). id나 장을 함께 주면 그 안에서만.
//   npm run review -- unmark <id...>    기록을 지운다
//   npm run review -- diff [id...]      검토한 뒤 바뀐 부분. 구역(본문, 증명, 관문 …)과 문장 단위로 보인다(scripts/review-diff.ts).
//                                       id를 주지 않으면 "검토 뒤 바뀜"인 노드 전부.
//        --context=N  바뀐 문장 앞뒤로 보일 문장 수(기본 1)   --full  고친 문장을 줄이지 않는다
//        --no-color   색 대신 [-지운 말-] {+넣은 말+}         --raw   노드 파일의 git diff를 그대로
//        --since=<커밋>  검토 기록 대신 이 커밋과 비교한다(검토 기록이 없는 초안도 된다)
// 기록에 남는 것: 검토한 때(시간대가 붙은 시각), 내용 지문, 그때의 HEAD 커밋, 노드 파일에 커밋하지 않은 수정이 있었는지.
// 수정 감지는 지문으로 한다. 시각과 커밋은 "언제부터, 무엇이 바뀌었나"를 보여 주는 데만 쓴다.
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { BOOKS, NODE_BY_ID } from "../src/content/index";
import {
  nodeHash,
  reviewState,
  isoLocal,
  stampLabel,
  type ReviewStamp,
} from "../src/content/review";
import type { NodeDef } from "../src/content/schema";
import { renderNodeDiff } from "./review-diff";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src/content/reviews.json");
const reviews: Record<string, ReviewStamp> = JSON.parse(
  readFileSync(file, "utf8"),
);
const [cmd, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith("-")));
const opt = (name: string) =>
  rest.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const args = rest.filter((a) => !a.startsWith("-"));
// 잘못 친 선택 사항을 조용히 무시하지 않는다
const KNOWN: Record<string, string[]> = {
  mark: ["--changed", "-a"],
  diff: ["--full", "--no-color", "--raw", "--context", "--since"],
};
for (const f of flags) {
  if (!(KNOWN[cmd] ?? []).includes(f.split("=")[0])) {
    console.error(
      `모르는 선택 사항: ${f}${KNOWN[cmd] ? ` (${cmd}에서 쓸 수 있는 것: ${KNOWN[cmd].join(" ")})` : ""}`,
    );
    process.exit(1);
  }
}
// 장 id(c0 …)를 주면 그 장의 노드 전부
const named = args.flatMap(
  (a) => BOOKS.find((b) => b.id === a)?.nodes.map((n) => n.id) ?? [a],
);
const ALL = BOOKS.flatMap((b) => b.nodes);
/** "검토 뒤 바뀜"인 노드. id나 장을 주었으면 그 안에서만 */
const changedOnly = () =>
  ALL.filter(
    (n) =>
      reviewState(n) === "changed" && (!named.length || named.includes(n.id)),
  ).map((n) => n.id);

const git = (...a: string[]) =>
  execFileSync("git", a, { cwd: root, encoding: "utf8" }).trim();

/** 노드 파일의 저장소 기준 경로: src/content/cNN-…/<id>.ts */
function nodeFile(id: string): string | null {
  const dir = join(root, "src/content");
  for (const d of readdirSync(dir)) {
    if (!/^c\d\d-/.test(d)) continue;
    const f = join(dir, d, `${id}.ts`);
    if (existsSync(f)) return relative(root, f);
  }
  return null;
}

let loaded = 0;
/** 검토할 때의 노드: 그 커밋의 노드 파일을 임시 파일로 꺼내 읽는다(노드 파일은 타입만 import하므로 따로 읽을 수 있다). 파일이 옮겨졌으면 그 커밋에서 같은 이름을 찾는다. */
async function nodeAt(
  commit: string,
  id: string,
  f: string,
): Promise<NodeDef | null> {
  const path = (() => {
    try {
      git("cat-file", "-e", `${commit}:${f}`);
      return f;
    } catch {
      return (
        git("ls-tree", "-r", "--name-only", commit, "src/content")
          .split("\n")
          .find((p) => p.endsWith(`/${id}.ts`)) ?? null
      );
    }
  })();
  if (!path) return null;
  // import는 주소마다 한 번만 읽으므로(캐시), 꺼낼 때마다 다른 이름을 쓴다
  const tmp = join(
    tmpdir(),
    `le-review-${process.pid}-${id}-${commit.slice(0, 7)}-${++loaded}.ts`,
  );
  writeFileSync(tmp, git("show", `${commit}:${path}`));
  try {
    return (await import(pathToFileURL(tmp).href)).default as NodeDef;
  } finally {
    unlinkSync(tmp);
  }
}

function need(id: string) {
  const n = NODE_BY_ID.get(id);
  if (!n) {
    console.error(`없는 노드: ${id}`);
    process.exit(1);
  }
  return n;
}

if (cmd === "mark" || cmd === "unmark") {
  const head = cmd === "mark" ? git("rev-parse", "--short=12", "HEAD") : "";
  const now = isoLocal(new Date());
  const again = cmd === "mark" && (flags.has("--changed") || flags.has("-a"));
  const ids = again ? changedOnly() : named;
  if (again && !ids.length)
    console.log(
      '다시 기록할 노드가 없습니다. "검토 뒤 바뀜"인 노드가 없습니다.',
    );
  if (!again && !ids.length)
    console.log(
      "노드 id나 장(c0 …)을 주세요. 다시 검토한 것만 기록하려면: npm run review -- mark --changed",
    );
  for (const id of ids) {
    const n = need(id);
    if (cmd === "mark") {
      const f = nodeFile(id);
      const dirty = !!f && git("status", "--porcelain", "--", f) !== "";
      reviews[id] = {
        on: now,
        hash: nodeHash(n),
        commit: head,
        ...(dirty ? { dirty: true } : {}),
      };
      console.log(`${again ? "다시 검토함" : "검토함"}  ${id}  ${n.title}`);
      if (dirty)
        console.log(
          `  ⚠ ${f}에 커밋하지 않은 수정이 있는 채로 기록했습니다. 나중에 diff를 보면 이 수정도 "검토 뒤 바뀐 것"처럼 섞여 나옵니다. 커밋한 뒤 다시 mark하면 정확합니다.`,
        );
    } else {
      delete reviews[id];
      console.log(`기록 지움  ${id}  ${n.title}`);
    }
  }
  // 교재 순서대로 적어 두면 diff가 읽기 쉽다
  const ordered = Object.fromEntries(
    BOOKS.flatMap((b) => b.nodes)
      .filter((n) => reviews[n.id])
      .map((n) => [n.id, reviews[n.id]]),
  );
  writeFileSync(file, JSON.stringify(ordered, null, 2) + "\n");
} else if (cmd === "diff") {
  const label = {
    reviewed: "검토함, 바뀐 것 없음",
    changed: "검토 뒤 바뀜",
    draft: "초안",
  } as const;
  const color = process.stdout.isTTY && !flags.has("--no-color");
  const ids = named.length ? named : changedOnly();
  if (!ids.length) console.log('"검토 뒤 바뀜"인 노드가 없습니다.');
  for (const id of ids) {
    const n = need(id);
    const r = reviews[id];
    const f = nodeFile(id);
    console.log(`\n=== ${id}  ${n.title}  (${label[reviewState(n)]})`);
    const since = opt("since");
    if (since && f) {
      const old = await nodeAt(git("rev-parse", since), id, f);
      if (!old) console.log(`  커밋 ${since}에는 이 노드가 없습니다.`);
      else {
        const d = renderNodeDiff(old, n, {
          color,
          context: +(opt("context") ?? 1),
          full: flags.has("--full"),
        });
        console.log(
          `  기준: 커밋 ${since} → 지금 작업 트리\n  ${d.changed ? `바뀐 곳: ${d.summary.join(" · ")}${d.text}` : "(바뀐 것이 없다)"}`,
        );
      }
      continue;
    }
    if (!r) continue;
    if (!r.commit || !f) {
      console.log(
        `  검토 기록에 커밋이 없습니다(${stampLabel(r)}에 기록). 대신: git log --since="${r.on}" -p -- ${f ?? "<노드 파일>"}`,
      );
      continue;
    }
    console.log(
      `  기준: ${stampLabel(r)}에 검토할 때의 커밋 ${r.commit.slice(0, 7)} → 지금 작업 트리${r.dirty ? "\n  ⚠ 그때 노드 파일에 커밋하지 않은 수정이 있었으므로, 아래에는 검토 전 수정도 섞여 있을 수 있다" : ""}`,
    );
    if (flags.has("--raw")) {
      console.log(
        git("diff", r.commit, "--", f) || "  (노드 파일에는 바뀐 것이 없다)",
      );
      continue;
    }
    const old = await nodeAt(r.commit, id, f);
    if (!old) {
      console.log(
        `  검토할 때의 노드 파일을 커밋 ${r.commit.slice(0, 7)}에서 찾지 못했습니다. --raw로 보세요.`,
      );
      continue;
    }
    const d = renderNodeDiff(old, n, {
      color,
      context: +(opt("context") ?? 1),
      full: flags.has("--full"),
    });
    console.log(
      d.changed
        ? `  바뀐 곳: ${d.summary.join(" · ")}${d.text}`
        : "  (내용에서 바뀐 것을 찾지 못했다. 지문만 달라졌다면 --raw로 보세요)",
    );
  }
  if (
    !opt("since") &&
    ids.some(
      (id) =>
        NODE_BY_ID.get(id) && reviewState(NODE_BY_ID.get(id)!) === "changed",
    )
  )
    console.log(
      `\n다시 검토했으면: npm run review -- mark --changed${named.length ? ` ${args.join(" ")}` : ""}`,
    );
} else {
  const mark = { reviewed: "✓", changed: "△", draft: "·" } as const;
  const count = { reviewed: 0, changed: 0, draft: 0 };
  const changed: string[] = [];
  for (const b of BOOKS) {
    console.log(`\n${b.num}장 ${b.title}`);
    for (const n of b.nodes) {
      const s = reviewState(n);
      count[s]++;
      if (s === "changed") changed.push(n.id);
      console.log(
        `  ${mark[s]} ${n.id.padEnd(30)} ${n.title}${s !== "draft" ? `  (${stampLabel(reviews[n.id])})` : ""}`,
      );
    }
  }
  console.log(
    `\n✓ 검토함 ${count.reviewed} · △ 검토 뒤 바뀜 ${count.changed} · 초안 ${count.draft}`,
  );
  if (changed.length)
    console.log(
      `바뀐 부분 보기: npm run review -- diff   ·   다시 검토했으면: npm run review -- mark --changed`,
    );
}
