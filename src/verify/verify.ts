// 교수법 검증기. 브라우저(검증 보고서 화면)와 CLI(npm run verify) 양쪽에서 같은 코드가 돈다.
//
// 이 검증기가 보장하는 것: "정의 그래프의 무결성"
//   - 정의되지 않은 용어를 쓰지 않았다, 왜? 칩이 앞쪽(이미 읽은 곳)만 가리킨다, 이름이 두 뜻을 갖지 않는다 …
// 이 검증기가 보장하지 못하는 것: "설명의 충분성"
//   - 풀어 쓴 표현("늘어나는 비율")이 사실상 정의 전의 개념을 쓰는 경우, 증명에 빈틈이 있는 경우.
//   이 한계는 검증 보고서 화면에도 그대로 적어 둔다.
import type { Book, NodeDef, TermDecl, Predict } from '../content/schema';
import { eig2 } from '../la/eig';
import { parseBlocks, parseInline, walkInlines, walkInlineList, walkBlocks, type Block, type Inline } from '../content/markup';

export type Level = 'error' | 'warn' | 'info';

export interface Issue {
  rule: string;
  level: Level;
  node: string;
  msg: string;
}

export interface Edge {
  /** 기대는 쪽(뒤 노드) */
  from: string;
  /** 기대어지는 쪽(앞 노드) */
  to: string;
  kind: 'requires' | 'why' | 'link' | 'term';
}

export interface VerifyResult {
  issues: Issue[];
  edges: Edge[];
  order: Map<string, number>;
  termHome: Map<string, { node: string; decl: TermDecl }>;
  /** 노드별로 파싱한 결과(렌더러가 다시 파싱하지 않도록) */
  parsed: Map<string, ParsedNode>;
}

export interface ParsedNode {
  body: Block[];
  proof: Block[] | null;
  checks: { q: Inline[]; choices: Inline[][]; answer: number; explain: Block[] }[];
  predicts: Map<string, ParsedPredict>;
}

export interface ParsedPredict {
  def: Predict;
  q: Inline[];
  choices: Inline[][];
  why: (Block[] | null)[];
  reveal: Block[] | null;
  hints: Block[][];
}

export const RULES: Record<string, { level: Level; text: string }> = {
  P000: { level: 'error', text: '구조 오류(문법, 중복 id)' },
  P001: { level: 'error', text: '용어를 정의하기 전에 사용함 (t:)' },
  P003: { level: 'error', text: '왜?/링크가 없는 노드나 뒤쪽 노드를 가리킴' },
  P004: { level: 'error', text: '용어 또는 기호를 두 번 정의함' },
  P005: { level: 'error', text: 'requires가 없는 노드나 뒤쪽 노드를 가리킴' },
  P006: { level: 'info', text: '아무도 기대지 않는 노드(고아)' },
  P007: { level: 'warn', text: '답이 없는 왜?' },
  P008: { level: 'warn', text: '정의 전의 용어가 표시 없이 본문에 등장함(원문 어휘 스캔)' },
  P010: { level: 'error', text: '등록되지 않은 장면' },
  P012: { level: 'warn', text: '증명도 탐구 링크도 없는 명제' },
  P014: { level: 'info', text: '정의하고 한 번도 쓰지 않은 용어' },
  P015: { level: 'error', text: 'def: 표시와 introduces 선언이 어긋남' },
  P016: { level: 'warn', text: 'fwd:가 이미 정의된 용어를 가리킴(t:로 바꿀 것)' },
  P017: { level: 'error', text: '존재하지 않는 코드 함수를 참조함' },
  P018: { level: 'info', text: '뒤에서 답하기로 미룬 왜?' },
  P019: { level: 'info', text: '본문이 아직 계획 단계인 노드(stub)' },
  P020: { level: 'error', text: '예측 관문의 배치 오류(정의 없음, 배치 안 됨, 두 번 배치, 상자 안에 배치)' },
  P022: { level: 'error', text: '예측의 정답 번호가 보기 범위를 벗어남' },
  P023: { level: 'error', text: '그림 예측의 행렬이 문제에 맞지 않음(2×2 아님, 실수 고유 방향 없음, 입력 없음)' },
  P024: { level: 'warn', text: '힌트가 3개를 넘음' },
};

export function verify(books: Book[], sceneIds: Set<string>, codeIndex: Map<string, string>): VerifyResult {
  const issues: Issue[] = [];
  const edges: Edge[] = [];
  const push = (rule: string, node: string, msg: string) => issues.push({ rule, level: RULES[rule].level, node, msg });

  // 1. 전체 순서
  const nodes: NodeDef[] = books.flatMap((b) => b.nodes);
  const order = new Map<string, number>();
  nodes.forEach((n, i) => {
    if (order.has(n.id)) push('P000', n.id, `노드 id 중복: ${n.id}`);
    order.set(n.id, i);
  });

  // 2. 용어와 기호의 집
  const termHome = new Map<string, { node: string; decl: TermDecl }>();
  const symHome = new Map<string, { node: string; meaning: string }>();
  for (const n of nodes) {
    for (const t of n.introduces?.terms ?? []) {
      const prev = termHome.get(t.id);
      if (prev) push('P004', n.id, `용어 '${t.ko}'(${t.id})는 이미 ${prev.node}에서 정의됨`);
      else termHome.set(t.id, { node: n.id, decl: t });
    }
    for (const s of n.introduces?.symbols ?? []) {
      const prev = symHome.get(s.tex);
      if (prev) push('P004', n.id, `기호 ${s.tex}는 이미 ${prev.node}에서 '${prev.meaning}'(으)로 정의됨`);
      else symHome.set(s.tex, { node: n.id, meaning: s.meaning });
    }
  }

  // 3. 원문 어휘 스캔 준비: (표면형, 용어id) 를 긴 것부터
  const lexicon: { surface: string; id: string }[] = [];
  for (const [id, { decl }] of termHome) {
    if (decl.everyday) continue;
    for (const s of new Set([decl.ko, ...(decl.surfaces ?? [])])) if (s.length >= 2) lexicon.push({ surface: s, id });
  }
  lexicon.sort((a, b) => b.surface.length - a.surface.length);

  const termUse = new Map<string, number>();
  const parsed = new Map<string, ParsedNode>();

  for (const n of nodes) {
    const here = order.get(n.id)!;
    let pn: ParsedNode;
    try {
      pn = {
        body: parseBlocks(n.body),
        proof: n.proof ? parseBlocks(n.proof) : null,
        checks: (n.checks ?? []).map((c) => ({ q: parseInline(c.q), choices: c.choices.map(parseInline), answer: c.answer, explain: parseBlocks(c.explain) })),
        predicts: new Map(
          (n.predicts ?? []).map((d) => [
            d.id,
            {
              def: d,
              q: parseInline(d.q),
              choices: d.kind === 'choice' ? d.choices.map(parseInline) : [],
              why: d.kind === 'choice' ? (d.why ?? []).map((w) => (w ? parseBlocks(w) : null)) : [],
              reveal: d.reveal ? parseBlocks(d.reveal) : null,
              hints: (d.hints ?? []).map(parseBlocks),
            },
          ]),
        ),
      };
    } catch (e) {
      push('P000', n.id, `마크업 문법 오류: ${(e as Error).message}`);
      continue;
    }
    parsed.set(n.id, pn);

    // 예측의 글도 본문과 같은 규칙(정의 전 사용 금지 등)으로 검사하려고, 가짜 블록으로 펼쳐 넣는다.
    const predictBlocks: Block[] = [...pn.predicts.values()].flatMap((pp) => [
      { t: 'p', c: pp.q } as Block,
      ...(pp.choices.length ? [{ t: 'ul', items: pp.choices } as Block] : []),
      ...pp.why.flatMap((w) => w ?? []),
      ...(pp.reveal ?? []),
      ...pp.hints.flat(),
    ]);
    const allBlocks: Block[] = [...pn.body, ...(pn.proof ?? []), ...pn.checks.flatMap((c) => c.explain), ...predictBlocks];
    const inlines: Inline[] = [...walkInlines(allBlocks), ...pn.checks.flatMap((c) => [...walkInlineList(c.q), ...c.choices.flatMap((ch) => [...walkInlineList(ch)])])];

    const defined = new Set<string>();
    const addEdge = (to: string, kind: Edge['kind']) => {
      if (to !== n.id && !edges.some((e) => e.from === n.id && e.to === to && e.kind === kind)) edges.push({ from: n.id, to, kind });
    };

    for (const x of inlines) {
      if (x.t === 'def') {
        if (!(n.introduces?.terms ?? []).some((t) => t.id === x.id)) push('P015', n.id, `def:${x.id} 를 표시했지만 introduces에 선언하지 않음`);
        defined.add(x.id);
      } else if (x.t === 'term') {
        const home = termHome.get(x.id);
        termUse.set(x.id, (termUse.get(x.id) ?? 0) + 1);
        if (!home) push('P001', n.id, `없는 용어 t:${x.id}`);
        else if (order.get(home.node)! > here) push('P001', n.id, `'${home.decl.ko}'는 뒤쪽 ${home.node}에서 정의되는데 여기서 t:로 씀 (예고라면 fwd:)`);
        else addEdge(home.node, 'term');
      } else if (x.t === 'fwd') {
        const home = termHome.get(x.id);
        if (!home) push('P001', n.id, `없는 용어 fwd:${x.id}`);
        else if (order.get(home.node)! <= here) push('P016', n.id, `'${home.decl.ko}'는 이미 ${home.node}에서 정의됨`);
      } else if (x.t === 'why' || x.t === 'link') {
        const o = order.get(x.to);
        if (o === undefined) push('P003', n.id, `없는 노드를 가리킴: ${x.to}`);
        else if (o >= here) push('P003', n.id, `뒤쪽(또는 자기 자신) 노드를 가리킴: ${x.to}`);
        else addEdge(x.to, x.t === 'why' ? 'why' : 'link');
      }
    }

    for (const b of walkBlocks(allBlocks)) if (b.t === 'scene' && !sceneIds.has(b.id)) push('P010', n.id, `장면 '${b.id}'가 등록되지 않음`);

    // 예측 관문
    const placed = pn.body.filter((b) => b.t === 'predict').map((b) => (b as { id: string }).id);
    for (const b of walkBlocks(pn.body)) if (b.t === 'note' && b.blocks.some((x) => x.t === 'predict')) push('P020', n.id, '예측은 상자 안에 놓을 수 없다');
    for (const id of placed) if (!pn.predicts.has(id)) push('P020', n.id, `정의되지 않은 예측 ::predict ${id}`);
    for (const id of new Set(placed)) if (placed.filter((x) => x === id).length > 1) push('P020', n.id, `예측 ${id}를 두 번 배치함`);
    for (const [id, pp] of pn.predicts) {
      if (!placed.includes(id)) push('P020', n.id, `예측 ${id}를 본문에 배치하지 않음`);
      const d: Predict = pp.def;
      if ((d.hints?.length ?? 0) > 3) push('P024', n.id, `예측 ${id}의 힌트 ${d.hints!.length}개`);
      if (d.kind === 'choice' && (d.answer < 0 || d.answer >= d.choices.length)) push('P022', n.id, `예측 ${id}의 정답 번호 ${d.answer}`);
      if (d.kind === 'point') {
        if (d.A.length !== 2 || d.A.some((r) => r.length !== 2)) push('P023', n.id, `예측 ${id}: 2×2 행렬이 아님`);
        else if (d.target === 'Ax' && !d.x) push('P023', n.id, `예측 ${id}: 입력 x가 없음`);
        else if (d.target === 'eig' && eig2(d.A).kind !== 'real') push('P023', n.id, `예측 ${id}: 실수 고유 방향이 없는 행렬`);
      }
    }

    if (n.status === 'written') {
      for (const t of n.introduces?.terms ?? []) if (!defined.has(t.id)) push('P015', n.id, `'${t.ko}'를 introduces에 선언했지만 본문에 def: 자리가 없음`);
    } else {
      push('P019', n.id, '본문 미완성(계획만 있음)');
    }

    for (const r of n.requires ?? []) {
      const o = order.get(r);
      if (o === undefined) push('P005', n.id, `requires에 없는 노드: ${r}`);
      else if (o >= here) push('P005', n.id, `requires가 뒤쪽 노드를 가리킴: ${r}`);
      else addEdge(r, 'requires');
    }

    for (const w of n.openWhys ?? []) {
      if (w.answeredBy === null) push('P007', n.id, `"${w.q}"`);
      else {
        const o = order.get(w.answeredBy);
        if (o === undefined) push('P003', n.id, `openWhys가 없는 노드를 가리킴: ${w.answeredBy}`);
        else if (o > here) push('P018', n.id, `"${w.q}" → ${w.answeredBy}에서 답함`);
      }
    }

    for (const fn of n.code ?? []) if (!codeIndex.has(fn)) push('P017', n.id, `코드 함수 '${fn}'가 src/la에 없음`);

    if (n.kind === 'prop' && n.status === 'written' && !n.proof) {
      const hasExp = edges.some((e) => e.from === n.id && nodes[order.get(e.to)!]?.kind === 'exp') || pn.body.some((b) => b.t === 'scene');
      if (!hasExp) push('P012', n.id, '증명도, 탐구 장면도 없음');
    }

    // 원문 어휘 스캔 (P008): 표시 없는 텍스트에서 아직 정의되지 않은 용어의 표면형을 찾는다.
    // 계획 단계(stub) 노드는 본문이 질문 목록이므로 검사하지 않는다.
    const reported = new Set<string>();
    for (const x of n.status === 'written' ? plainTextRuns(allBlocks, pn) : []) {
      const consumed = new Array(x.length).fill(false);
      for (const { surface, id } of lexicon) {
        let from = 0;
        for (;;) {
          const k = x.indexOf(surface, from);
          if (k < 0) break;
          from = k + 1;
          if (consumed.slice(k, k + surface.length).some(Boolean)) continue;
          for (let q = k; q < k + surface.length; q++) consumed[q] = true;
          const home = termHome.get(id)!;
          if (order.get(home.node)! > here && !reported.has(id)) {
            reported.add(id);
            push('P008', n.id, `'${surface}'(${id})가 표시 없이 등장. 정의는 뒤쪽 ${home.node}. 예고라면 [..](fwd:${id})`);
          }
        }
      }
    }
  }

  // 4. 죽은 정의, 고아
  for (const [id, { node, decl }] of termHome) if (!termUse.get(id)) push('P014', node, `'${decl.ko}'(${id})`);
  const incoming = new Set(edges.map((e) => e.to));
  const last = books[books.length - 1];
  for (const n of nodes) if (!incoming.has(n.id) && n.kind !== 'exp' && !last.nodes.includes(n)) push('P006', n.id, n.title);

  return { issues, edges, order, termHome, parsed };
}

/** 표시(def/term/fwd/링크) 밖에 있는 순수 텍스트 조각들 */
function plainTextRuns(blocks: Block[], pn: ParsedNode): string[] {
  const runs: string[] = [];
  const visit = (list: Inline[]) => {
    for (const x of list) {
      if (x.t === 'text') runs.push(x.v);
      else if (x.t === 'b' || x.t === 'sync') visit(x.c);
    }
  };
  for (const b of walkBlocks(blocks)) {
    if (b.t === 'p' || b.t === 'h') visit(b.c);
    else if (b.t === 'ul') b.items.forEach(visit);
  }
  for (const c of pn.checks) {
    visit(c.q);
    c.choices.forEach(visit);
  }
  return runs;
}
