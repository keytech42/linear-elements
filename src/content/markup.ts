// 본문 마크업 파서. 의존성 없이 직접 짰다(검증기의 신뢰 근거이므로 markup.test.ts로 고정한다).
//
// ── 블록 문법 (빈 줄로 구분) ─────────────────────────────────────────
//   $$ … $$                      가운데 정렬 수식 (여러 줄 가능)
//   ::scene 장면id {json}         살아 있는 그림
//   ::predict 예측id              예측 관문 (노드의 predicts 에 정의, 맨 위 단계에만)
//   ### 제목                      소제목
//   - 항목                        목록 (연속된 줄)
//   1. 항목                       번호 목록 (연속된 줄)
//   > [!비유] …                   상자. 종류: 비유, 주의, 직관, 질문, 코드, 참고(기본)
//   그 밖                         문단
//
// ── 인라인 문법 ────────────────────────────────────────────────────
//   $…$                 수식. 수식 안의 \h{키}{식} 은 동기화 고리(그림/행렬과 함께 빛남)
//   **…**               굵게
//   \`…\`               인라인 코드 (String.raw 템플릿 안이므로 백틱 앞에 역슬래시)
//   [표면형](def:용어id)  이 노드가 그 용어를 "정의하는" 자리
//   [표면형](t:용어id)    이미 정의된 용어를 쓰는 자리 (P001)
//   [표면형](fwd:용어id)  아직 정의되지 않은 용어를 "예고"하는 자리 (뒤쪽만 허용)
//   [질문?](why:노드id)   왜? 칩. 답이 있는 앞쪽 노드를 가리킨다 (P003)
//   [글](n:노드id)        노드 링크 (앞쪽만 허용)
//   [글](sync:키)         동기화 고리가 걸린 글 조각

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'b'; c: Inline[] }
  | { t: 'math'; tex: string }
  | { t: 'code'; v: string }
  | { t: 'def' | 'term' | 'fwd'; id: string; c: Inline[] }
  | { t: 'why'; to: string; q: string }
  | { t: 'link'; to: string; c: Inline[] }
  | { t: 'sync'; key: string; c: Inline[] };

export type NoteKind = '비유' | '주의' | '직관' | '질문' | '코드' | '참고';

export type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'h'; c: Inline[] }
  | { t: 'ul'; items: Inline[][]; ordered?: boolean }
  | { t: 'math'; tex: string }
  | { t: 'scene'; id: string; params: Record<string, unknown> }
  | { t: 'predict'; id: string }
  | { t: 'note'; kind: NoteKind; blocks: Block[] };

const NOTE_KINDS: NoteKind[] = ['비유', '주의', '직관', '질문', '코드', '참고'];

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: Block[] = [];
  let i = 0;
  const isBlank = (s: string) => s.trim() === '';
  while (i < lines.length) {
    const line = lines[i];
    const tl = line.trim();
    if (isBlank(line)) {
      i++;
      continue;
    }
    if (tl.startsWith('$$')) {
      // 같은 줄에서 닫힐 수도, 여러 줄에 걸칠 수도 있다.
      const rest = tl.slice(2);
      if (rest.endsWith('$$') && rest.length >= 2) {
        out.push({ t: 'math', tex: rest.slice(0, -2).trim() });
        i++;
        continue;
      }
      const buf = [rest];
      i++;
      while (i < lines.length && !lines[i].trim().endsWith('$$')) buf.push(lines[i++]);
      if (i < lines.length) buf.push(lines[i++].trim().slice(0, -2));
      out.push({ t: 'math', tex: buf.join('\n').trim() });
      continue;
    }
    if (tl.startsWith('::scene')) {
      const m = /^::scene\s+([\w.-]+)\s*(\{.*\})?\s*$/.exec(tl);
      if (!m) throw new Error(`장면 문법 오류: ${tl}`);
      out.push({ t: 'scene', id: m[1], params: m[2] ? JSON.parse(m[2]) : {} });
      i++;
      continue;
    }
    if (tl.startsWith('::predict')) {
      const m = /^::predict\s+([\w.-]+)\s*$/.exec(tl);
      if (!m) throw new Error(`예측 문법 오류: ${tl}`);
      out.push({ t: 'predict', id: m[1] });
      i++;
      continue;
    }
    if (tl.startsWith('### ')) {
      out.push({ t: 'h', c: parseInline(tl.slice(4)) });
      i++;
      continue;
    }
    const bullet = /^(- |\d+\. )/;
    if (bullet.test(tl)) {
      const ordered = !tl.startsWith('- ');
      const same = (s: string) => (ordered ? /^\d+\. /.test(s) : s.startsWith('- '));
      const items: Inline[][] = [];
      while (i < lines.length && same(lines[i].trim())) {
        // 다음 줄이 들여쓰기로 이어지면 같은 항목이다.
        let text = lines[i].trim().replace(bullet, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !bullet.test(lines[i].trim())) text += ' ' + lines[i++].trim();
        items.push(parseInline(text));
      }
      out.push({ t: 'ul', items, ordered });
      continue;
    }
    if (tl.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) buf.push(lines[i++].trim().replace(/^>\s?/, ''));
      let kind: NoteKind = '참고';
      const km = /^\[!(\S+?)\]\s*/.exec(buf[0]);
      if (km) {
        if (!NOTE_KINDS.includes(km[1] as NoteKind)) throw new Error(`알 수 없는 상자 종류: ${km[1]}`);
        kind = km[1] as NoteKind;
        buf[0] = buf[0].slice(km[0].length);
      }
      out.push({ t: 'note', kind, blocks: parseBlocks(buf.join('\n')) });
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && !isBlank(lines[i]) && !/^\s*(\$\$|::|### |- |\d+\. |>)/.test(lines[i])) buf.push(lines[i++].trim());
    out.push({ t: 'p', c: parseInline(buf.join(' ')) });
  }
  return out;
}

const LINK_KINDS = ['def', 't', 'fwd', 'why', 'n', 'sync'] as const;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let text = '';
  const flush = () => {
    if (text) out.push({ t: 'text', v: text });
    text = '';
  };
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\' && src[i + 1] === '`') {
      // 인라인 코드. 본문이 String.raw 템플릿이라 백틱은 \` 로 적는다.
      const end = src.indexOf('\\`', i + 2);
      if (end < 0) throw new Error(`닫히지 않은 코드: ${src.slice(i, i + 30)}`);
      flush();
      out.push({ t: 'code', v: src.slice(i + 2, end) });
      i = end + 2;
      continue;
    }
    if (ch === '\\' && src[i + 1] === '$') {
      text += '$';
      i += 2;
      continue;
    }
    if (ch === '$') {
      const end = findMathEnd(src, i + 1);
      if (end < 0) throw new Error(`닫히지 않은 $: ${src.slice(i, i + 30)}`);
      flush();
      out.push({ t: 'math', tex: src.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    if (ch === '*' && src[i + 1] === '*') {
      const end = src.indexOf('**', i + 2);
      if (end < 0) throw new Error(`닫히지 않은 **: ${src.slice(i, i + 30)}`);
      flush();
      out.push({ t: 'b', c: parseInline(src.slice(i + 2, end)) });
      i = end + 2;
      continue;
    }
    if (ch === '[') {
      const close = matchBracket(src, i);
      if (close > 0 && src[close + 1] === '(') {
        const pend = src.indexOf(')', close + 2);
        const target = src.slice(close + 2, pend);
        const m = /^(\w+):(.+)$/.exec(target);
        if (pend > 0 && m && (LINK_KINDS as readonly string[]).includes(m[1])) {
          flush();
          const inner = src.slice(i + 1, close);
          const [, kind, id] = m;
          if (kind === 'why') out.push({ t: 'why', to: id, q: inner });
          else if (kind === 'n') out.push({ t: 'link', to: id, c: parseInline(inner) });
          else if (kind === 'sync') out.push({ t: 'sync', key: id, c: parseInline(inner) });
          else out.push({ t: kind === 't' ? 'term' : (kind as 'def' | 'fwd'), id, c: parseInline(inner) });
          i = pend + 1;
          continue;
        }
      }
    }
    text += ch;
    i++;
  }
  flush();
  return out;
}

function findMathEnd(s: string, from: number): number {
  for (let k = from; k < s.length; k++) {
    if (s[k] === '\\') {
      k++;
      continue;
    }
    if (s[k] === '$') return k;
  }
  return -1;
}

function matchBracket(s: string, open: number): number {
  let depth = 0;
  for (let k = open; k < s.length; k++) {
    if (s[k] === '$') {
      const e = findMathEnd(s, k + 1);
      if (e < 0) return -1;
      k = e;
      continue;
    }
    if (s[k] === '[') depth++;
    else if (s[k] === ']' && --depth === 0) return k;
  }
  return -1;
}

/** 수식 안의 \h{키}{식} 을 KaTeX의 \htmlData{sync=키}{식} 으로 바꾼다. */
export function expandSyncMacros(tex: string): string {
  return tex.replace(/\\h\{([\w.-]+)\}\{/g, (_, k) => `\\htmlData{sync=${k}}{`);
}

/** 수식 안의 동기화 키를 모두 뽑는다(검증기용). */
export function syncKeysInTex(tex: string): string[] {
  return [...tex.matchAll(/\\h\{([\w.-]+)\}/g)].map((m) => m[1]);
}

// ── 트리 걷기 도우미 ────────────────────────────────────────────────
export function* walkInlines(blocks: Block[]): Generator<Inline> {
  for (const b of blocks) {
    if (b.t === 'p' || b.t === 'h') yield* walkInlineList(b.c);
    else if (b.t === 'ul') for (const it of b.items) yield* walkInlineList(it);
    else if (b.t === 'note') yield* walkInlines(b.blocks);
    else if (b.t === 'math') yield { t: 'math', tex: b.tex };
  }
}

export function* walkInlineList(list: Inline[]): Generator<Inline> {
  for (const x of list) {
    yield x;
    if ('c' in x) yield* walkInlineList(x.c);
  }
}

export function* walkBlocks(blocks: Block[]): Generator<Block> {
  for (const b of blocks) {
    yield b;
    if (b.t === 'note') yield* walkBlocks(b.blocks);
  }
}

/** 인라인 목록을 순수 텍스트로 (팝오버 미리보기, 검색용) */
export function plainText(list: Inline[]): string {
  return list
    .map((x) => {
      if (x.t === 'text') return x.v;
      if (x.t === 'math') return x.tex;
      if (x.t === 'why') return x.q;
      return 'c' in x ? plainText(x.c) : '';
    })
    .join('');
}
