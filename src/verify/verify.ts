// 교수법 검증기. 브라우저(검증 보고서 화면)와 CLI(npm run verify) 양쪽에서 같은 코드가 돈다.
//
// 이 검증기가 보장하는 것: "정의 그래프의 무결성"
//   - 정의되지 않은 용어를 쓰지 않았다, 왜? 칩이 앞쪽(이미 읽은 곳)만 가리킨다, 이름이 두 뜻을 갖지 않는다 …
// 이 검증기가 보장하지 못하는 것: "설명의 충분성"
//   - 풀어 쓴 표현("늘어나는 비율")이 사실상 정의 전의 개념을 쓰는 경우, 증명에 빈틈이 있는 경우.
//   이 한계는 검증 보고서 화면에도 그대로 적어 둔다.
import type { Book, NodeDef, TermDecl, Predict } from '../content/schema';
import { eig2 } from '../la/eig';
import { REVIEWS, reviewState, stampLabel } from '../content/review';
import { parseBlocks, parseInline, walkInlines, walkInlineList, walkBlocks, plainText, type Block, type Inline } from '../content/markup';

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
  /** 노드별로 파싱한 결과(렌더러가 다시 파싱하지 않도록). 첫 등장 자동 링크가 이미 들어 있다. */
  parsed: Map<string, ParsedNode>;
  /** 첫 등장 자동 링크로 바꾼 자리의 수 */
  autoLinked: number;
  /** 이름표(공리 5, 명제 2 …). 키는 "노드id#이름표키". 참조의 미리보기가 이 글을 보여 준다. */
  labels: Map<string, Label>;
  /** 이름표마다 그것을 가리키는 뒤쪽 노드들(교재 순서). 명제 아래의 "뒤에서 쓰이는 곳"이 이것을 보여 준다. */
  uses: Map<string, string[]>;
}

export interface Label {
  node: string;
  key: string;
  /** 이름표에 적힌 이름(예: "공리 5") */
  name: string;
  /** 그 이름이 붙은 항목의 글(미리보기용) */
  text: Inline[];
  /** 공리 노드의 이름표는 책 전체에서 그 이름 하나로 통한다. 명제는 장마다 번호를 새로 세므로, 다른 장에서 가리킬 때는 "0장 명제 13"처럼 장을 붙인다. */
  global: boolean;
  /** 이름표가 있는 장 */
  chapter: number;
}

/** 참조하는 자리에서 보이는 이름표의 이름. 같은 장이거나 책 전체에서 통하는 이름이면 그대로, 다른 장의 명제면 장을 붙인다. */
export function refName(l: Label, fromChapter: number): string {
  return l.global || l.chapter === fromChapter ? l.name : `${l.chapter}장 ${l.name}`;
}

export interface ParsedNode {
  body: Block[];
  proof: Block[] | null;
  checks: { q: Inline[]; choices: Inline[][]; answer: number; explain: Block[] }[];
  predicts: Map<string, ParsedPredict>;
  /** 의의(significance[키])를 파싱한 것 */
  sig: Map<string, Block[]>;
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
  P026: { level: 'warn', text: '저자가 검토한 뒤 내용이 바뀐 노드(다시 검토 필요)' },
  P027: { level: 'error', text: '검토 기록(reviews.json)에 없는 노드 id' },
  P030: { level: 'error', text: '이름표(label)·참조(ref) 오류(없는 이름표, 두 번 선언, 뒤쪽 노드, 글과 이름이 다름, 번호를 손으로 적음, 번호 이름표를 공리·명제 노드 밖에 둠)' },
  P032: { level: 'error', text: '명제와 그 증명의 짝이 맞지 않음(증명이 있는 명제 노드에 명제 이름표가 없음, 명제가 여럿인데 ::proves가 빠짐, 없는 명제를 가리키는 ::proves)' },
  P033: { level: 'error', text: '의의 칩과 내용의 짝이 맞지 않음([..](sig:키)의 키가 significance에 없음, 또는 significance의 키를 아무 칩도 쓰지 않음)' },
  P031: { level: 'error', text: '참조 표시 없이 "공리 n", "명제 n", "증명 n", "규칙 n", "n번", "0의 공리", "1 ⇔ 2"처럼 적음([](ref:…)로 적거나, 항목 앞에 이름을 드러내 적을 것)' },
  P029: { level: 'error', text: '뒤에서 답한다는 질문(openWhys)과 답하는 자리의 표지(::answers)가 짝이 맞지 않음' },
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
  const chapterOf = new Map<string, number>();
  for (const b of books) for (const n of b.nodes) chapterOf.set(n.id, b.num);

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
  //    한 글자 표면형은 다른 낱말 속에 섞이기 쉬워서(향 ⊂ 방향, 영향, 편향) 낱말 경계(boundary)를 켠 용어만 넣는다.
  const lexicon: LexEntry[] = [];
  for (const [id, { decl }] of termHome) {
    if (decl.everyday) continue;
    for (const s of new Set([decl.ko, ...(decl.surfaces ?? [])]))
      if (s.length >= 2 || decl.boundary) lexicon.push({ surface: s, id, boundary: decl.boundary, every: decl.everyMention });
  }
  lexicon.sort((a, b) => b.surface.length - a.surface.length);

  const termUse = new Map<string, number>();
  let autoLinked = 0;
  const parsed = new Map<string, ParsedNode>();
  const labels = new Map<string, Label>();
  let axiomCount = 0; // 공리 번호는 책 전체에서 이어진다
  const propCount = new Map<number, number>(); // 명제 번호는 장마다 1부터 센다
  const inlinesOf = new Map<string, Inline[]>();
  const blocksOf = new Map<string, Block[]>();
  // 앞질러 가기는 뒤 노드의 이름표를 가리키므로, 그 번호는 모든 노드를 읽은 뒤에야 정해진다. 이름 채우기는 끝에서 한다.
  const aheadRefs: { x: Extract<Inline, { t: 'ref' }>; from: string; ch: number }[] = [];
  /** 참조의 글: 글자 없이 쓴 참조에는 이 자리에서 보이는 이름을 채우고, 글자를 적었으면 그 이름이 들어 있는지 본다(낡은 번호를 잡는다). */
  const nameRef = (x: Extract<Inline, { t: 'ref' }>, l: Label, ch: number, from: string) => {
    const shown = refName(l, ch);
    const said = plainText(x.c).trim();
    if (!said) {
      x.c = [{ t: 'text', v: shown }];
      x.auto = true;
    } else if (!said.includes(shown)) push('P030', from, `"${said}"가 가리키는 이름표는 이 자리에서 '${shown}'로 불린다`);
  };
  const singleStmt = new Map<string, string>(); // 명제가 하나뿐인 노드 → 그 명제의 이름표 키

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
        sig: new Map(Object.entries(n.significance ?? {}).map(([k, v]) => [k, parseBlocks(v)])),
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
    const allBlocks: Block[] = [...pn.body, ...(pn.proof ?? []), ...pn.checks.flatMap((c) => c.explain), ...predictBlocks, ...[...pn.sig.values()].flat()];
    const inlines: Inline[] = [...walkInlines(allBlocks), ...pn.checks.flatMap((c) => [...walkInlineList(c.q), ...c.choices.flatMap((ch) => [...walkInlineList(ch)])])];

    const defined = new Set<string>();
    const addEdge = (to: string, kind: Edge['kind']) => {
      if (to !== n.id && !edges.some((e) => e.from === n.id && e.to === to && e.kind === kind)) edges.push({ from: n.id, to, kind });
    };

    // 이름표와 참조: 이 노드의 이름표를 먼저 모은다(같은 노드 안에서는 앞뒤 상관없이 가리킬 수 있다). 그다음 참조를 확인한다.
    // 글자 없이 쓴 이름표 [](label:키)에는 번호를 매긴다: 공리 노드는 "공리 n"(책 전체에서 이어 셈), 명제 노드는 "명제 n"(장마다 셈).
    // 번호를 원고에 손으로 적지 않으므로, 명제를 끼워 넣어도 번호와 참조가 저절로 맞는다.
    const ch = chapterOf.get(n.id)!;
    for (const { x, text } of labelSites(allBlocks, pn)) {
      const id = `${n.id}#${x.key}`;
      let name = plainText(x.c).trim();
      if (!name) {
        if (n.kind === 'ax') name = `공리 ${++axiomCount}`;
        else if (n.kind === 'prop') {
          propCount.set(ch, (propCount.get(ch) ?? 0) + 1);
          name = `명제 ${propCount.get(ch)}`;
        } else push('P030', n.id, `[](label:${x.key}): 번호를 매기는 이름표는 공리 노드와 명제 노드에만 둔다`);
        x.c = [{ t: 'text', v: name }]; // 렌더러가 그대로 그리도록 채워 둔다
        x.auto = true;
      } else if (/^(공리|명제) ?\d+$/.test(name)) push('P030', n.id, `[${name}](label:${x.key}): 번호를 손으로 적지 않는다. [](label:${x.key})로 적으면 번호가 매겨진다`);
      if (labels.has(id)) push('P030', n.id, `이름표 '${x.key}'를 두 번 선언함`);
      const clash = n.kind === 'ax' ? [...labels.values()].find((l) => l.global && l.name === name) : undefined;
      if (clash) push('P030', n.id, `책 전체에서 쓰는 이름 '${name}'가 ${clash.node}에도 있음`);
      labels.set(id, { node: n.id, key: x.key, name, text, global: n.kind === 'ax', chapter: ch });
    }
    // 근거로 쓰는 자리(증명, 등식 줄의 근거 칸)의 글. 앞질러 가기는 여기에 둘 수 없다: 뒤의 명제를 근거로 쓰면 순서가 무너진다.
    const reasoning = new Set<Inline>(walkInlines(pn.proof ?? []));
    for (const b of walkBlocks(allBlocks)) if (b.t === 'chain') for (const r of b.rows) for (const x of walkInlineList(r.why ?? [])) reasoning.add(x);
    for (const x of inlines) {
      if (x.t !== 'ref') continue;
      const target = x.node ?? n.id;
      x.node = target; // 렌더러가 어느 노드의 이름표인지 알도록 채워 둔다
      const o = order.get(target);
      const kind = x.ahead ? 'ahead' : 'ref';
      if (o === undefined) push('P030', n.id, `${kind}:${target}#${x.key}: 없는 노드`);
      else if (x.ahead) {
        if (o <= here) push('P030', n.id, `ahead:${target}#${x.key}: 앞질러 가기는 뒤 노드의 이름표만 가리킨다. 이 노드나 앞 노드는 ref:로 가리킨다`);
        else if (reasoning.has(x)) push('P030', n.id, `ahead:${target}#${x.key}: 증명과 등식 줄의 근거 칸에는 뒤의 명제를 둘 수 없다`);
        else aheadRefs.push({ x, from: n.id, ch });
      } else {
        const l = labels.get(`${target}#${x.key}`);
        if (o > here) push('P030', n.id, `ref:${target}#${x.key}: 뒤쪽 노드의 이름표. 증명하는 자리를 가리키려면 ahead:를 쓴다`);
        else if (!l) push('P030', n.id, `ref:${target}#${x.key}: 없는 이름표`);
        else nameRef(x, l, ch, n.id);
        if (l && target !== n.id) addEdge(target, 'link');
      }
    }
    fixJosaAfterNames(allBlocks, pn);
    for (const m of unmarkedNumbers(allBlocks, pn)) push('P031', n.id, `"${m}"`);
    // 의의 칩과 그 내용
    const sigUsed = new Set(inlines.flatMap((x) => (x.t === 'sig' ? [x.key] : [])));
    for (const k of sigUsed) if (!pn.sig.has(k)) push('P033', n.id, `sig:${k}: significance에 없는 키`);
    for (const k of pn.sig.keys()) if (!sigUsed.has(k)) push('P033', n.id, `significance.${k}: 이것을 놓은 칩이 없음`);
    for (const x of inlines) {
      if ((x.t !== 'why' && x.t !== 'link') || !x.key) continue;
      if (order.has(x.to) && order.get(x.to)! < here && !labels.has(`${x.to}#${x.key}`)) push('P030', n.id, `${x.t === 'why' ? 'why' : 'n'}:${x.to}#${x.key}: 없는 이름표`);
    }
    inlinesOf.set(n.id, inlines);
    blocksOf.set(n.id, allBlocks);

    // 명제와 그 증명의 짝 (P032). 본문의 이름표가 명제의 이름이고, 명제가 여럿이면 증명의 각 부분 앞에 ::proves 키를 둔다.
    const stmtKeys = [...walkInlines(pn.body)].flatMap((x) => (x.t === 'label' ? [x.key] : []));
    const proves = [...walkBlocks(pn.proof ?? [])].flatMap((b) => (b.t === 'proves' ? [b.key] : []));
    if ([...walkBlocks([...pn.body, ...pn.checks.flatMap((c) => c.explain), ...predictBlocks])].some((b) => b.t === 'proves')) push('P032', n.id, '::proves는 증명 안에만 둔다');
    for (const k of new Set(proves)) {
      if (!stmtKeys.includes(k)) push('P032', n.id, `::proves ${k}: 본문에 그런 명제 이름표가 없음`);
      if (proves.filter((x) => x === k).length > 1) push('P032', n.id, `::proves ${k}를 두 번 둠`);
    }
    if (n.kind === 'prop' && n.status === 'written' && pn.proof) {
      if (!stmtKeys.length) push('P032', n.id, '명제에 이름표가 없음. 명제를 적은 자리에 [명제](label:main)를 둔다');
      else if (stmtKeys.length > 1) for (const k of stmtKeys) if (!proves.includes(k)) push('P032', n.id, `명제 '${k}'의 증명 앞에 ::proves ${k}가 없음`);
    }
    if (n.kind === 'prop' && stmtKeys.length === 1) singleStmt.set(n.id, stmtKeys[0]);

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
      for (const e of lexicon) {
        const { surface, id } = e;
        for (const k of occurrences(x, e)) {
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

    // 첫 등장 자동 링크: 위키백과처럼, 앞쪽 노드에서 정의한 용어가 이 노드에서 처음 나오는 자리를 용어 링크로 바꾼다.
    // 그래서 한참 뒤의 노드에서도 용어에 마우스를 올리면 정의가 뜬다. 렌더러는 이 parsed를 그대로 그린다.
    if (n.status === 'written') autoLinked += autoLinkFirstMentions(pn, lexicon, (id) => order.get(termHome.get(id)!.node)! < here, (id) => termUse.set(id, (termUse.get(id) ?? 0) + 1));
  }

  // 3-0. 앞질러 가기: 이제 모든 이름표에 번호가 있으므로 이름을 채우고, 그 뒤의 조사를 다시 맞춘다.
  for (const { x, from, ch } of aheadRefs) {
    const l = labels.get(`${x.node}#${x.key}`);
    if (!l) push('P030', from, `ahead:${x.node}#${x.key}: 없는 이름표`);
    else nameRef(x, l, ch, from);
  }
  for (const from of new Set(aheadRefs.map((a) => a.from))) fixJosaAfterNames(blocksOf.get(from)!, parsed.get(from)!);

  // 3-1. 미뤄 둔 질문과 답하는 자리: "뒤에서 답함"이라고 적었으면 그 노드에 ::answers 표지가 있어야 하고, 표지는 실제로 미뤄 둔 질문을 가리켜야 한다.
  const answersIn = new Map<string, Set<string>>();
  for (const n of nodes) {
    const pn = parsed.get(n.id);
    if (!pn) continue;
    const froms = new Set<string>();
    for (const b of walkBlocks([...pn.body, ...(pn.proof ?? [])])) if (b.t === 'answers') froms.add(b.from);
    answersIn.set(n.id, froms);
    for (const from of froms) {
      const src = nodes.find((x) => x.id === from);
      if (!src) push('P029', n.id, `::answers ${from}: 없는 노드`);
      else if (!src.openWhys?.some((w) => w.answeredBy === n.id)) push('P029', n.id, `::answers ${from}: ${from}의 openWhys에 이 노드에서 답한다는 질문이 없음`);
    }
  }
  for (const n of nodes)
    for (const w of n.openWhys ?? [])
      if (w.answeredBy && order.has(w.answeredBy) && !answersIn.get(w.answeredBy)?.has(n.id)) push('P029', n.id, `"${w.q}" → ${w.answeredBy}에 ::answers ${n.id} 표지가 없음`);

  // 3-2. 이름표마다 뒤에서 쓰이는 곳: 이름표를 가리키는 참조와 키가 달린 왜? 칩. 명제가 하나뿐인 노드는 그 노드를 가리키는 왜?·링크·선행도 그 명제가 쓰인 곳으로 센다.
  const uses = new Map<string, string[]>();
  const addUse = (lid: string, from: string) => {
    if (!labels.has(lid) || lid.startsWith(`${from}#`)) return;
    const l = uses.get(lid) ?? [];
    if (!l.includes(from)) l.push(from);
    uses.set(lid, l);
  };
  for (const [from, list] of inlinesOf)
    for (const x of list) {
      if (x.t === 'ref' && x.node && !x.ahead) addUse(`${x.node}#${x.key}`, from); // 앞질러 가리킨 것은 쓴 것이 아니다
      else if ((x.t === 'why' || x.t === 'link') && x.key) addUse(`${x.to}#${x.key}`, from);
    }
  for (const e of edges) {
    const k = singleStmt.get(e.to);
    if (k && (e.kind === 'why' || e.kind === 'link' || e.kind === 'requires')) addUse(`${e.to}#${k}`, e.from);
  }
  for (const l of uses.values()) l.sort((a, b) => order.get(a)! - order.get(b)!);

  // 4. 검토 기록
  for (const n of nodes) if (reviewState(n) === 'changed') push('P026', n.id, `${stampLabel(REVIEWS[n.id])}에 검토한 뒤 바뀜. 바뀐 부분: npm run review -- diff ${n.id} · 다시 검토했으면 npm run review -- mark ${n.id}`);
  for (const id of Object.keys(REVIEWS)) if (!order.has(id)) push('P027', id, `reviews.json의 '${id}'`);

  // 5. 죽은 정의, 고아
  for (const [id, { node, decl }] of termHome) if (!termUse.get(id)) push('P014', node, `'${decl.ko}'(${id})`);
  const incoming = new Set(edges.map((e) => e.to));
  const last = books[books.length - 1];
  for (const n of nodes) if (!incoming.has(n.id) && n.kind !== 'exp' && !last.nodes.includes(n)) push('P006', n.id, n.title);

  return { issues, edges, order, termHome, parsed, autoLinked, labels, uses };
}

export interface LexEntry {
  surface: string;
  id: string;
  /** 낱말 경계에서만 찾는다(TermDecl.boundary) */
  boundary?: boolean;
  /** 첫 등장만이 아니라 모든 등장을 링크한다(TermDecl.everyMention) */
  every?: boolean;
}

// 낱말 경계: 앞에 한글이 붙어 있지 않고, 뒤에는 조사·공백·문장 부호가 오거나 글이 끝난다.
// 그래서 "향이", "향을"은 잡고 "방향", "편향", "향하다", "향후"는 잡지 않는다.
const HANGUL = /[가-힣]/;
const AFTER_OK = /^(?:$|[\s.,;:!?·()\[\]'"’”…\-—–]|이|가|은|는|을|를|의|에|도|과|와|만|으로|로|까지|부터|처럼|보다)/;

/** 글 s 안에서 표면형이 나오는 자리들(경계 조건을 지키는 것만) */
export function* occurrences(s: string, e: LexEntry): Generator<number> {
  for (let k = s.indexOf(e.surface); k >= 0; k = s.indexOf(e.surface, k + 1)) {
    if (e.boundary && ((k > 0 && HANGUL.test(s[k - 1])) || !AFTER_OK.test(s.slice(k + e.surface.length)))) continue;
    yield k;
  }
}

/**
 * 노드를 독자가 읽는 순서(본문 → 관문은 놓인 자리에서 → 증명 → 점검)로 훑으며,
 * 아직 링크가 없는 용어의 첫 등장을 { t: 'term' } 으로 바꾼다. 바꾼 개수를 돌려준다.
 * 건너뛰는 자리: 소제목(링크를 달지 않는 자리), 보기 단추(누르면 링크로 떠나 버린다), 수식과 코드, 이미 표시된 글.
 */
export function autoLinkFirstMentions(
  pn: ParsedNode,
  lexicon: LexEntry[],
  eligible: (id: string) => boolean,
  onLink: (id: string) => void,
): number {
  const marked = new Set<string>();
  // 모든 등장을 링크하는 용어는, 그 용어를 정의하는 노드 안에서도 정의한 자리 뒤부터 링크한다.
  const definedHere = new Set<string>();
  let count = 0;
  const inl = (list: Inline[], link: boolean) => {
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      if (x.t === 'b' || x.t === 'sync') inl(x.c, link);
      else if (x.t === 'def' || x.t === 'term' || x.t === 'fwd') {
        marked.add(x.id);
        if (x.t === 'def') definedHere.add(x.id);
      }
      else if (x.t === 'text' && link) {
        const s = x.v;
        const consumed = new Array(s.length).fill(false);
        const hits: { k: number; len: number; id: string }[] = [];
        for (const e of lexicon) {
          const { surface, id } = e;
          for (const k of occurrences(s, e)) {
            if (consumed.slice(k, k + surface.length).some(Boolean)) continue;
            for (let q = k; q < k + surface.length; q++) consumed[q] = true;
            const ok = e.every ? eligible(id) || definedHere.has(id) : !marked.has(id) && !hits.some((h) => h.id === id) && eligible(id);
            if (ok) hits.push({ k, len: surface.length, id });
          }
        }
        if (!hits.length) continue;
        hits.sort((a, b) => a.k - b.k);
        const out: Inline[] = [];
        let at = 0;
        for (const h of hits) {
          if (h.k > at) out.push({ t: 'text', v: s.slice(at, h.k) });
          out.push({ t: 'term', id: h.id, c: [{ t: 'text', v: s.slice(h.k, h.k + h.len) }] });
          marked.add(h.id);
          onLink(h.id);
          at = h.k + h.len;
        }
        if (at < s.length) out.push({ t: 'text', v: s.slice(at) });
        list.splice(i, 1, ...out);
        i += out.length - 1;
        count += hits.length;
      }
    }
  };
  const blk = (list: Block[]) => {
    for (const b of list) {
      if (b.t === 'p') inl(b.c, true);
      else if (b.t === 'h') inl(b.c, false);
      else if (b.t === 'ul') for (const it of b.items) inl(it, true);
      else if (b.t === 'chain') {
        for (const r of b.rows) if (r.why) inl(r.why, true);
      }
      else if (b.t === 'note') {
        if (b.title) inl(b.title, false);
        blk(b.blocks);
      }
      else if (b.t === 'predict') {
        const pp = pn.predicts.get(b.id);
        if (!pp) continue;
        inl(pp.q, true);
        for (const c of pp.choices) inl(c, false);
        // 힌트와 보기별 해설은 펼쳐 볼 때만 보이므로, 그 안의 링크가 본문의 첫 등장 링크를 대신하지 않게 한다.
        const before = [...marked];
        const restore = () => (marked.clear(), before.forEach((id) => marked.add(id)));
        for (const h of pp.hints) blk(h);
        restore();
        for (const w of pp.why) if (w) (blk(w), restore());
        if (pp.reveal) blk(pp.reveal);
      }
    }
  };
  blk(pn.body);
  if (pn.proof) blk(pn.proof);
  for (const c of pn.checks) {
    inl(c.q, true);
    for (const ch of c.choices) inl(ch, false);
    blk(c.explain);
  }
  return count;
}

/** 이름표가 선언된 자리와, 미리보기에 보여 줄 그 항목의 글. 이름표가 항목 맨 앞에 있으면 이름표를 뺀 나머지를, 중간에 있으면 항목 전체를 보여 준다. */
function labelSites(blocks: Block[], pn: ParsedNode): { x: Extract<Inline, { t: 'label' }>; text: Inline[] }[] {
  const out: { x: Extract<Inline, { t: 'label' }>; text: Inline[] }[] = [];
  const scan = (top: Inline[], list: Inline[]) => {
    for (const x of list) {
      if (x.t === 'label') {
        if (top[0] !== x) out.push({ x, text: top });
        else {
          const rest = top.slice(1);
          if (rest[0]?.t === 'text') rest[0] = { t: 'text', v: rest[0].v.replace(/^\s+/, '') };
          out.push({ x, text: rest });
        }
      } else if ('c' in x) scan(top, x.c);
    }
  };
  for (const b of walkBlocks(blocks)) {
    if (b.t === 'p' || b.t === 'h') scan(b.c, b.c);
    else if (b.t === 'ul') b.items.forEach((it) => scan(it, it));
    else if (b.t === 'note' && b.title) scan(b.title, b.title);
    else if (b.t === 'chain') for (const r of b.rows) if (r.why) scan(r.why, r.why);
  }
  for (const c of pn.checks) {
    scan(c.q, c.q);
    c.choices.forEach((ch) => scan(ch, ch));
  }
  return out;
}

/** 숫자를 읽은 소리의 끝에 받침이 있는가, 그 받침이 ㄹ인가. 1 일, 7 칠, 8 팔은 ㄹ. 10 십, 100 백, 1000 천. */
export function numberFinal(n: number): { batchim: boolean; rieul: boolean } {
  const last = n % 10;
  if (last !== 0) return { batchim: [1, 3, 6, 7, 8].includes(last), rieul: [1, 7, 8].includes(last) };
  return { batchim: true, rieul: false }; // 영·십·백·천은 모두 받침이 있고 ㄹ이 아니다
}

/** 짝을 이루는 조사를 앞말의 받침에 맞춘다. "이다", "이므로"처럼 뒤에 말이 이어지면 조사가 아니므로 건드리지 않는다. */
export function fitJosa(after: string, n: number): string {
  const { batchim, rieul } = numberFinal(n);
  const m = /^(을|를|이|가|은|는|과|와|으로|로)(?=[\s.,)·:;!?]|$)/.exec(after);
  if (!m) return after;
  const pick: Record<string, [string, string]> = { 을: ['을', '를'], 를: ['을', '를'], 이: ['이', '가'], 가: ['이', '가'], 은: ['은', '는'], 는: ['은', '는'], 과: ['과', '와'], 와: ['과', '와'], 으로: ['으로', '로'], 로: ['으로', '로'] };
  const [withB, without] = pick[m[1]];
  const right = m[1] === '으로' || m[1] === '로' ? (batchim && !rieul ? withB : without) : batchim ? withB : without;
  return right + after.slice(m[1].length);
}

/** 번호를 자동으로 채운 이름("명제 7") 바로 뒤의 조사를 그 번호에 맞춘다. 번호가 바뀌어도 "명제 7을"/"명제 9를"이 맞게 된다. */
function fixJosaAfterNames(blocks: Block[], pn: ParsedNode) {
  const visit = (list: Inline[]) => {
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      if ((x.t === 'ref' || x.t === 'label') && x.auto) {
        const num = /(\d+)$/.exec(plainText(x.c));
        const next = list[i + 1];
        if (num && next?.t === 'text') next.v = fitJosa(next.v, +num[1]);
      } else if ('c' in x) visit(x.c);
    }
  };
  for (const b of walkBlocks(blocks)) {
    if (b.t === 'p' || b.t === 'h') visit(b.c);
    else if (b.t === 'ul') b.items.forEach(visit);
    else if (b.t === 'note' && b.title) visit(b.title);
    else if (b.t === 'chain') for (const r of b.rows) if (r.why) visit(r.why);
  }
  for (const c of pn.checks) {
    visit(c.q);
    c.choices.forEach(visit);
  }
}

/** 참조 표시 없이 적은 "공리 5", "명제 2", "증명 1", "0의 공리", 목록 번호를 잇는 "1 ⇔ 2" (P031). 이름표와 참조 안의 글은 보지 않는다. */
function unmarkedNumbers(blocks: Block[], pn: ParsedNode): string[] {
  const found: string[] = [];
  // "n번"은 목록의 n째 항목을 가리킬 때만 잡는다("2번은", "1번(", "(1번)", "1번 식"). "12번 곱한"처럼 횟수를 말할 때는 잡지 않는다.
  const re = /(공리|명제|증명|규칙) ?\d+|[01]의 공리|\d+번(?=[은는이가을를의에과와(),.~]|\s*식|$)|(?<!\d|\d\.)\d ?[⇔⇒] ?\d(?!\d|\.\d)/g;
  // 참조 바로 뒤에 손으로 이어 적은 번호("[](ref:…), 6, 4 그대로다")도 잡는다.
  const afterRef = /^\s*(?:,|와|과|및|또는)\s*\d+(?:\s*,\s*\d+)*(?=\s|$|[,)은는이가을를의에과와로도])/;
  const visit = (list: Inline[]) => {
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      if (x.t === 'ref' || x.t === 'label') continue;
      if (x.t === 'text' && list[i - 1]?.t === 'ref') {
        const m = afterRef.exec(x.v);
        if (m) found.push(m[0].trim());
      }
      if (x.t === 'text') found.push(...(x.v.match(re) ?? []));
      else if (x.t === 'why') found.push(...(x.q.match(re) ?? []));
      else if ('c' in x) visit(x.c);
    }
  };
  for (const b of walkBlocks(blocks)) {
    if (b.t === 'p' || b.t === 'h') visit(b.c);
    else if (b.t === 'ul') b.items.forEach(visit);
    else if (b.t === 'note' && b.title) visit(b.title);
    else if (b.t === 'chain') for (const r of b.rows) if (r.why) visit(r.why);
  }
  for (const c of pn.checks) {
    visit(c.q);
    c.choices.forEach(visit);
  }
  return found;
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
    else if (b.t === 'note' && b.title) visit(b.title);
    else if (b.t === 'ul') b.items.forEach(visit);
    else if (b.t === 'chain') {
      for (const r of b.rows) if (r.why) visit(r.why);
    }
  }
  for (const c of pn.checks) {
    visit(c.q);
    c.choices.forEach(visit);
  }
  return runs;
}
