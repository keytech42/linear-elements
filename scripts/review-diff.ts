// 검토 기록의 diff(npm run review -- diff)를 사람이 읽기 좋게 만든다.
// 노드 파일의 줄 단위 diff는 읽기 어렵다. 본문은 문단 하나가 한 줄이라, 낱말 하나만 바뀌어도 수백 자짜리 줄이 통째로 바뀐 것처럼 보인다.
// 그래서 검토할 때의 노드와 지금 노드를 구역(머리, 용어, 본문, 증명, 관문, 점검, 미뤄 둔 질문)으로 나누고, 구역 안을 문장으로 잘라 비교한다.
// 바뀐 문장만 앞뒤 문맥과 함께 보이고, 조금 고친 문장은 한 줄 안에서 지운 말과 넣은 말을 표시한다.
import type { NodeDef } from "../src/content/schema";

/** 비교 단위: 구역 안 어느 자리(소제목, 보기 번호 …)의 문장 하나. key가 같으면 같은 문장으로 본다. */
export interface Unit {
  crumb: string;
  s: string;
  key: string;
}

/** 줄을 문장으로 자른다. 수식($…$)과 코드(\`…\`) 안의 마침표에서는 자르지 않는다. */
export function sentences(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let math = false;
  let code = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "\\" && (line[i + 1] === "`" || line[i + 1] === "$")) {
      if (line[i + 1] === "`") code = !code;
      cur += c + line[i + 1];
      i++;
      continue;
    }
    cur += c;
    if (c === "$" && !code) math = !math;
    // 문장 끝에서 자른다. 단 "1. 항목", "(가). "처럼 번호만 있는 앞머리에서는 자르지 않는다.
    if (
      !math &&
      !code &&
      ".?!".includes(c) &&
      /\s/.test(line[i + 1] ?? "") &&
      !/^(-\s*)?(\d+|\([^)]*\))\.$/.test(cur.trim())
    ) {
      out.push(cur.trim());
      cur = "";
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** 블록 마크업 글(본문, 증명)을 문장 단위로. 소제목(###)과 상자(> [!주의] …)가 자리 이름이 되고, 소제목 줄도 비교한다. */
function prose(text: string | undefined): Unit[] {
  const out: Unit[] = [];
  let heading = "";
  let box = "";
  for (const raw of (text ?? "").split("\n")) {
    let line = raw.trim();
    if (line.startsWith(">")) {
      line = line.replace(/^>\s?/, "");
      const t = /^\[!(\S+?)\]\s*(.*)$/.exec(line);
      if (t) {
        box = `[${t[1]}]${t[2] ? ` ${t[2]}` : ""}`;
        // 상자 제목도 비교한다(바뀌지 않았으면 자리 이름에 이미 보이므로 숨긴다)
        const crumb = [heading, box].filter(Boolean).join(" › ");
        out.push({
          crumb,
          s: `[!${t[1]}] ${t[2]}`.trim(),
          key: `[!${t[1]}] ${t[2]}`.trim(),
        });
        continue;
      }
    } else box = "";
    if (!line) continue;
    const h = /^#{2,4}\s+(.*)$/.exec(line);
    if (h) heading = h[1];
    const crumb = [heading, box].filter(Boolean).join(" › ");
    // 소제목이 바뀌어도 그 아래 문장이 모두 바뀐 것처럼 보이지 않도록, 본문의 key에는 자리 이름을 넣지 않는다.
    for (const s of h ? [line] : sentences(line))
      out.push({ crumb, s, key: s });
  }
  return out;
}

/** 자리 이름이 고정된 글(보기, 해설, 힌트 …). 같은 문장이 다른 보기로 옮겨 가면 바뀐 것이므로 key에 자리 이름을 넣는다. */
function part(crumb: string, text: string | undefined | null): Unit[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .flatMap(sentences)
    .map((s) => ({ crumb, s, key: `${crumb}\u0001${s}` }));
}

/** 노드를 구역으로 나눈다. 구역 이름이 같으면 서로 비교한다. */
export function fields(n: NodeDef): { label: string; units: Unit[] }[] {
  const out: { label: string; units: Unit[] }[] = [];
  const add = (label: string, units: Unit[]) =>
    units.length && out.push({ label, units });
  add("머리", [
    ...part("제목", n.title),
    ...part("종류", n.kind),
    ...part("선행", n.requires?.join(", ")),
    ...part("코드", n.code?.join(", ")),
  ]);
  add("용어·기호", [
    ...(n.introduces?.terms ?? []).flatMap((t) => {
      // 지문에 들어가는 표시도 함께 적는다. 이것만 바뀌어도 "검토 뒤 바뀜"이 되기 때문이다.
      const marks = [
        t.surfaces?.length && `다른 표기 ${t.surfaces.join(", ")}`,
        t.everyday && "일상어",
        t.boundary && "낱말 경계",
        t.everyMention && "모든 등장 링크",
      ]
        .filter(Boolean)
        .join(", ");
      return part(
        `용어 ${t.id}`,
        `${t.ko}${t.en ? ` (${t.en})` : ""}${marks ? ` [${marks}]` : ""}: ${t.gloss}`,
      );
    }),
    ...(n.introduces?.symbols ?? []).flatMap((s) =>
      part(`기호 ${s.tex}`, `${s.meaning}${s.note ? ` (${s.note})` : ""}`),
    ),
  ]);
  add("본문", prose(n.body));
  add("증명", prose(n.proof));
  for (const p of n.predicts ?? []) {
    const units = [...part("질문", p.q)];
    if (p.kind === "choice") {
      p.choices.forEach((c, i) =>
        units.push(
          ...part(`보기 ${i + 1}${i === p.answer ? " (정답)" : ""}`, c),
        ),
      );
      (p.why ?? []).forEach((w, i) => units.push(...part(`해설 ${i + 1}`, w)));
    } else {
      // 그림 관문: 글 말고 지문에 들어가는 설정을 모두 적는다
      const { id: _id, kind: _kind, q: _q, hints: _h, reveal: _r, ...rest } = p;
      units.push(...part("설정", JSON.stringify(rest)));
    }
    (p.hints ?? []).forEach((h, i) => units.push(...part(`힌트 ${i + 1}`, h)));
    units.push(...part("드러냄", p.reveal));
    add(`관문 ${p.id}`, units);
  }
  (n.checks ?? []).forEach((c, i) => {
    add(`점검 ${i + 1}`, [
      ...part("질문", c.q),
      ...c.choices.flatMap((ch, k) =>
        part(`보기 ${k + 1}${k === c.answer ? " (정답)" : ""}`, ch),
      ),
      ...part("해설", c.explain),
    ]);
  });
  add(
    "미뤄 둔 질문",
    (n.openWhys ?? []).flatMap((w, i) =>
      part(
        `질문 ${i + 1}`,
        `${w.q} → ${w.answeredBy ?? "이 교재에서는 답하지 않음"}`,
      ),
    ),
  );
  return out;
}

/** 두 배열의 최장 공통 부분열: 짝지은 자리 (i, j)의 목록 */
function lcs<T>(
  a: T[],
  b: T[],
  eq: (x: T, y: T) => boolean,
): [number, number][] {
  const dp = Array.from(
    { length: a.length + 1 },
    () => new Int32Array(b.length + 1),
  );
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = eq(a[i], b[j])
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (eq(a[i], b[j])) {
      out.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

export type Seg = { t: "same" | "del" | "add"; s: string };

/** 낱말 조각: 수식, 링크 마크업, 코드는 한 덩어리로, 한글·영숫자는 이어진 만큼, 나머지는 한 글자씩 */
function tokens(s: string): string[] {
  return (
    s.match(
      /\$[^$]*\$|\[[^\]]*\]\([^)]*\)|\\`[^`]*\\`|[가-힣]+|[A-Za-z0-9_.]+|\s+|./gu,
    ) ?? []
  );
}

/** 한 문장 안에서 지운 말과 넣은 말 */
export function diffWords(a: string, b: string): Seg[] {
  const ta = tokens(a);
  const tb = tokens(b);
  const m = lcs(ta, tb, (x, y) => x === y);
  const out: Seg[] = [];
  const push = (t: Seg["t"], s: string) => {
    if (!s) return;
    const last = out[out.length - 1];
    if (last?.t === t) last.s += s;
    else out.push({ t, s });
  };
  let i = 0;
  let j = 0;
  for (const [mi, mj] of [...m, [ta.length, tb.length] as [number, number]]) {
    push("del", ta.slice(i, mi).join(""));
    push("add", tb.slice(j, mj).join(""));
    if (mi < ta.length) push("same", ta[mi]);
    i = mi + 1;
    j = mj + 1;
  }
  // 지움·넣음 사이에 공백만 같은 채로 끼어 있으면, 그 덩어리 전체를 지움 하나와 넣음 하나로 묶는다(읽을 때 한 곳으로 보이게)
  const raw = merge(out);
  const segs: Seg[] = [];
  for (let k = 0; k < raw.length;) {
    let e = k;
    while (
      e < raw.length &&
      (raw[e].t !== "same" ||
        (/^\s+$/.test(raw[e].s) &&
          e > k &&
          raw[e + 1] &&
          raw[e + 1].t !== "same"))
    )
      e++;
    const run = raw.slice(k, e);
    if (
      run.some((x) => x.t === "del") &&
      run.some((x) => x.t === "add") &&
      run.some((x) => x.t === "same")
    ) {
      segs.push(
        {
          t: "del",
          s: run
            .filter((x) => x.t !== "add")
            .map((x) => x.s)
            .join(""),
        },
        {
          t: "add",
          s: run
            .filter((x) => x.t !== "del")
            .map((x) => x.s)
            .join(""),
        },
      );
    } else segs.push(...run);
    if (e === k) segs.push(raw[e++]);
    k = e;
  }
  // 지움 바로 뒤에 넣음이 오면 둘의 같은 앞부분·뒷부분을 떼어 낸다: "노드에서" → "노드의 명제 5에서"는 "노드{+의 명제 5+}에서"
  const fine: Seg[] = [];
  for (let k = 0; k < segs.length; k++) {
    const d = segs[k];
    const a2 = segs[k + 1];
    if (d.t === "del" && a2?.t === "add") {
      let p = 0;
      while (p < d.s.length && p < a2.s.length && d.s[p] === a2.s[p]) p++;
      let q = 0;
      while (
        q < d.s.length - p &&
        q < a2.s.length - p &&
        d.s[d.s.length - 1 - q] === a2.s[a2.s.length - 1 - q]
      )
        q++;
      fine.push(
        { t: "same", s: d.s.slice(0, p) },
        { t: "del", s: d.s.slice(p, d.s.length - q) },
        { t: "add", s: a2.s.slice(p, a2.s.length - q) },
        { t: "same", s: d.s.slice(d.s.length - q) },
      );
      k++;
    } else fine.push(d);
  }
  return merge(fine);
}

/** 빈 조각을 빼고, 이웃한 같은 종류를 하나로 */
function merge(list: Seg[]): Seg[] {
  const out: Seg[] = [];
  for (const x of list) {
    if (!x.s) continue;
    const last = out[out.length - 1];
    if (last?.t === x.t) last.s += x.s;
    else out.push({ ...x });
  }
  return out;
}

/** 두 문장이 얼마나 같은가(같은 글자 수의 비율). 고친 문장인지, 지우고 새로 쓴 문장인지 가른다. */
function similarity(a: string, b: string): number {
  const segs = diffWords(a, b);
  const same = segs
    .filter((x) => x.t === "same")
    .reduce((n, x) => n + x.s.length, 0);
  return (2 * same) / (a.length + b.length || 1);
}

export type Op =
  | { t: "same" | "del" | "add"; u: Unit }
  | { t: "edit"; a: Unit; b: Unit; segs: Seg[] };

/** 구역 하나의 비교. 같은 문장 사이에 낀 지움과 넣음은, 충분히 닮았으면 "고침"으로 짝짓는다. */
export function diffUnits(a: Unit[], b: Unit[]): Op[] {
  const m = lcs(a, b, (x, y) => x.key === y.key);
  const out: Op[] = [];
  let i = 0;
  let j = 0;
  for (const [mi, mj] of [...m, [a.length, b.length] as [number, number]]) {
    const dels = a.slice(i, mi);
    const adds = b.slice(j, mj);
    let k = 0;
    for (const d of dels) {
      const found = adds.findIndex(
        (x, idx) => idx >= k && similarity(d.s, x.s) >= 0.45,
      );
      if (found < 0) {
        out.push({ t: "del", u: d });
        continue;
      }
      for (; k < found; k++) out.push({ t: "add", u: adds[k] });
      out.push({
        t: "edit",
        a: d,
        b: adds[found],
        segs: diffWords(d.s, adds[found].s),
      });
      k = found + 1;
    }
    for (; k < adds.length; k++) out.push({ t: "add", u: adds[k] });
    if (mi < a.length) out.push({ t: "same", u: b[mj] });
    i = mi + 1;
    j = mj + 1;
  }
  return out;
}

export interface RenderOpt {
  color: boolean;
  /** 바뀐 문장 앞뒤로 보일 같은 문장 수 */
  context: number;
  /** 고친 문장에서 바뀌지 않은 긴 부분을 줄이지 않는다 */
  full: boolean;
}

const ANSI = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  dim: "\x1b[2m",
  strike: "\x1b[9m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

/** 검토할 때의 노드와 지금 노드의 차이를 사람이 읽는 글로. 바뀐 구역이 없으면 changed = 0. */
export function renderNodeDiff(
  old: NodeDef,
  now: NodeDef,
  opt: RenderOpt,
): { text: string; changed: number; summary: string[] } {
  const c = (k: keyof typeof ANSI, s: string) =>
    opt.color ? ANSI[k] + s + ANSI.reset : s;
  const del = (s: string) =>
    opt.color ? c("red", ANSI.strike + s) : `[-${s}-]`;
  const add = (s: string) => (opt.color ? c("green", s) : `{+${s}+}`);
  // 고친 문장에서 바뀌지 않은 긴 부분은 앞뒤만 남긴다. 마크업 한가운데서 자르지 않도록 공백 경계에서 자른다.
  const shorten = (s: string) => {
    if (opt.full || s.length <= 80) return s;
    const head = s.slice(0, 32);
    const tail = s.slice(-32);
    const h = head.lastIndexOf(" ");
    const t = tail.indexOf(" ");
    return `${h > 8 ? head.slice(0, h) : head} … ${t >= 0 && t < 24 ? tail.slice(t + 1) : tail}`;
  };
  const A = new Map(fields(old).map((f) => [f.label, f.units]));
  const B = new Map(fields(now).map((f) => [f.label, f.units]));
  const labels = [...B.keys(), ...[...A.keys()].filter((k) => !B.has(k))];
  const lines: string[] = [];
  const summary: string[] = [];
  let changed = 0;
  for (const label of labels) {
    const ops = diffUnits(A.get(label) ?? [], B.get(label) ?? []);
    const hot = ops.map((o) => o.t !== "same");
    const unit = (o: Op) => (o.t === "edit" ? o.b : o.u);
    // 바뀐 자리: 이어서 바뀐 문장들을 한 자리로 센다
    const spots = hot.filter((h, k) => h && !hot[k - 1]).length;
    if (!spots) continue;
    const sents = hot.filter(Boolean).length;
    changed += spots;
    summary.push(
      `${label} ${spots}곳${sents > spots ? `(문장 ${sents}개)` : ""}`,
    );
    // 바뀐 곳과 그 앞뒤 context개만 보인다. 문맥은 같은 자리(소제목, 보기 …) 안에서만 잡는다.
    const show = ops.map((o, k) =>
      ops.some(
        (p, j) =>
          hot[j] &&
          Math.abs(j - k) <= opt.context &&
          unit(p).crumb === unit(o).crumb,
      ),
    );
    let crumb: string | null = null;
    let gap = false;
    ops.forEach((o, k) => {
      if (!show[k]) {
        gap = true;
        return;
      }
      const u = unit(o);
      if (u.crumb !== crumb) {
        lines.push(
          "",
          c("cyan", `  ── ${label}${u.crumb ? ` › ${u.crumb}` : ""}`),
        );
        crumb = u.crumb;
      } else if (gap) lines.push(c("dim", "     ⋯"));
      gap = false;
      // 바뀌지 않은 소제목 줄과 상자 제목은 머리에 이미 보인다
      if (o.t === "same" && /^(#{2,4}\s|\[!)/.test(o.u.s)) return;
      if (o.t !== "edit") {
        if (o.t === "same") lines.push(c("dim", `     ${o.u.s}`));
        else if (o.t === "del") lines.push(c("red", `   - `) + del(o.u.s));
        else lines.push(c("green", `   + `) + add(o.u.s));
      } else
        lines.push(
          c("bold", "   ~ ") +
            (o.a.crumb !== o.b.crumb && !/^(#{2,4}\s|\[!)/.test(o.b.s)
              ? c("cyan", `(${o.a.crumb} → ${o.b.crumb}) `)
              : "") +
            o.segs
              .map((x) =>
                x.t === "same"
                  ? shorten(x.s)
                  : x.t === "del"
                    ? del(x.s)
                    : add(x.s),
              )
              .join(""),
        );
    });
  }
  return { text: lines.join("\n"), changed, summary };
}
