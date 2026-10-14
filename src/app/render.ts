// 파싱된 마크업(Block/Inline)을 DOM으로. 수식은 KaTeX, 장면은 화면에 들어올 때 불러온다.
import katex from 'katex';
import type { Block, Inline } from '../content/markup';
import { expandSyncMacros } from '../content/markup';
import { KATEX_MACROS } from '../content/katex-macros';
import { SCENES, V, NODE_BY_ID, BOOK_OF } from './data';
import { progress } from './state';
import type { SyncBus } from '../sync/bus';

const cache = new Map<string, string>();
export function tex(src: string, display = false): string {
  const k = (display ? 'D' : 'I') + src;
  let html = cache.get(k);
  if (html === undefined) {
    html = katex.renderToString(expandSyncMacros(src), {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: (ctx) => ctx.command === '\\htmlData',
      macros: { ...KATEX_MACROS },
    });
    cache.set(k, html);
  }
  return html;
}

export interface RenderCtx {
  bus: SyncBus;
  /** 장면 정리 함수 모음(노드를 떠날 때 부른다) */
  cleanups: (() => void)[];
  /** 장면을 그리지 않는다(팝오버 미리보기) */
  noScenes?: boolean;
  /** 지금 그리는 노드의 id (답 표지가 이 노드에서 답하는 질문만 고르는 데 쓴다) */
  node?: string;
}

export function renderBlocks(blocks: Block[], ctx: RenderCtx): DocumentFragment {
  const f = document.createDocumentFragment();
  for (const b of blocks) f.appendChild(renderBlock(b, ctx));
  return f;
}

function renderBlock(b: Block, ctx: RenderCtx): Node {
  switch (b.t) {
    case 'p': {
      const p = document.createElement('p');
      p.appendChild(renderInlines(b.c));
      return p;
    }
    case 'h': {
      const h = document.createElement('h3');
      h.appendChild(renderInlines(b.c));
      return h;
    }
    case 'ul': {
      const ul = document.createElement(b.ordered ? 'ol' : 'ul');
      if (b.start) (ul as HTMLOListElement).start = b.start;
      for (const it of b.items) {
        const li = document.createElement('li');
        li.appendChild(renderInlines(it));
        ul.appendChild(li);
      }
      return ul;
    }
    case 'math': {
      const d = document.createElement('div');
      d.className = 'math-block';
      d.innerHTML = tex(b.tex, true);
      return d;
    }
    case 'note': {
      const a = document.createElement('aside');
      a.className = `note note-${b.kind}`;
      const lab = document.createElement('div');
      lab.className = 'note-label';
      lab.textContent = b.kind;
      a.appendChild(lab);
      if (b.title) {
        const t = document.createElement('div');
        t.className = 'note-title';
        t.appendChild(renderInlines(b.title));
        a.appendChild(t);
      }
      a.appendChild(renderBlocks(b.blocks, ctx));
      return a;
    }
    case 'chain': {
      // 등식 줄: 왼쪽 변 | 관계 기호와 오른쪽 변 | ∵ 근거. 관계 기호가 한 세로줄에 서서, 무엇이 무엇과 같은지가 한눈에 보인다.
      const g = document.createElement('div');
      g.className = 'chain';
      for (const r of b.rows) {
        const l = document.createElement('div');
        l.className = 'chain-lhs';
        l.innerHTML = r.lhs ? tex(`\\displaystyle ${r.lhs}`) : '';
        const m = document.createElement('div');
        m.className = 'chain-rhs';
        m.innerHTML = tex(`\\displaystyle {}${r.rhs}`);
        const w = document.createElement('div');
        w.className = 'chain-why';
        if (r.why) {
          const mark = document.createElement('span');
          mark.className = 'chain-because';
          mark.textContent = '∵ ';
          w.append(mark, renderInlines(r.why));
        }
        g.append(l, m, w);
      }
      return g;
    }
    case 'proves': {
      // 증명의 한 부분이 어느 명제의 증명인지 밝히는 머리. 명제 쪽의 "증명 ↓"이 여기로 오고, "↑"는 명제로 돌아간다.
      const l = V.labels.get(`${ctx.node}#${b.key}`);
      const name = l?.name ?? b.key;
      const d = document.createElement('div');
      d.className = 'proves';
      d.id = `proof-${b.key}`;
      const h = document.createElement('strong');
      h.textContent = `${name}의 증명`;
      const back = document.createElement('a');
      back.className = 'ref proves-back';
      back.href = `#/n/${ctx.node ?? ''}`;
      back.dataset.ref = `${ctx.node}#${b.key}`;
      back.textContent = `↑ ${name}`;
      d.append(h, ' ', back);
      return d;
    }
    case 'answers': {
      // 앞 노드가 "아직 여기서 답하지 않은 질문"으로 미뤄 둔 질문에, 바로 아래에서 답한다는 표지.
      const from = NODE_BY_ID.get(b.from);
      const a = document.createElement('aside');
      a.className = 'answers-box';
      a.id = `answers-${b.from}`;
      const lab = document.createElement('div');
      lab.className = 'answers-label';
      lab.append('앞에서 미뤄 둔 질문 · ');
      const back = document.createElement('a');
      back.className = 'nlink';
      back.href = `#/n/${b.from}`;
      back.textContent = `${BOOK_OF.get(b.from)?.num}장 · ${from?.title ?? b.from}`;
      lab.appendChild(back);
      a.appendChild(lab);
      for (const w of from?.openWhys ?? []) {
        if (!w.answeredBy || (ctx.node && w.answeredBy !== ctx.node)) continue;
        const q = document.createElement('div');
        q.className = 'answers-q';
        q.textContent = w.q;
        a.appendChild(q);
      }
      const hint = document.createElement('div');
      hint.className = 'answers-hint dim';
      hint.textContent = '아래가 그 답이다.';
      a.appendChild(hint);
      return a;
    }
    case 'predict': {
      // 관문은 읽기 화면(reader.ts)이 직접 그린다. 다른 곳(미리보기 등)에서는 표시만 남긴다.
      const d = document.createElement('div');
      d.className = 'predict-placeholder';
      d.textContent = '[예측]';
      return d;
    }
    case 'scene': {
      const d = document.createElement('div');
      d.className = 'scene';
      if (ctx.noScenes) {
        d.classList.add('scene-placeholder');
        d.textContent = `[살아 있는 그림: ${b.id}]`;
        return d;
      }
      d.dataset.scene = b.id;
      mountWhenVisible(d, b.id, b.params, ctx);
      return d;
    }
  }
}

function mountWhenVisible(host: HTMLElement, id: string, params: Record<string, unknown>, ctx: RenderCtx) {
  host.style.minHeight = '380px';
  let disposed = false;
  let cleanup: (() => void) | void;
  const io = new IntersectionObserver(
    async (ents) => {
      if (!ents.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const load = SCENES.get(id);
      if (!load) {
        host.textContent = `장면 '${id}'를 찾을 수 없음`;
        return;
      }
      const fn = await load();
      if (disposed) return;
      host.style.minHeight = '';
      try {
        cleanup = fn(host, { bus: ctx.bus, params: structuredClone(params) });
      } catch (e) {
        host.textContent = `장면 오류: ${(e as Error).message}`;
        console.error(e);
      }
    },
    { rootMargin: '300px' },
  );
  io.observe(host);
  ctx.cleanups.push(() => {
    disposed = true;
    io.disconnect();
    cleanup?.();
  });
}

export function renderInlines(list: Inline[]): DocumentFragment {
  const f = document.createDocumentFragment();
  for (const x of list) f.appendChild(renderInline(x));
  return f;
}

function renderInline(x: Inline): Node {
  switch (x.t) {
    case 'text':
      return document.createTextNode(x.v);
    case 'b': {
      const s = document.createElement('strong');
      s.appendChild(renderInlines(x.c));
      return s;
    }
    case 'code': {
      const c = document.createElement('code');
      c.textContent = x.v;
      return c;
    }
    case 'word': {
      const w = document.createElement('span');
      w.className = 'word';
      w.textContent = `“${x.v}”`;
      return w;
    }
    case 'math': {
      const s = document.createElement('span');
      s.className = 'math-inline';
      s.innerHTML = tex(x.tex);
      return s;
    }
    case 'def': {
      const d = document.createElement('dfn');
      d.className = 'term-def';
      d.dataset.term = x.id;
      d.appendChild(renderInlines(x.c));
      // 영어 표준 용어는 정의하는 자리에만 위첨자로 붙인다. 뒤에서 다시 나올 때는 용어 링크의 미리보기에 뜬다.
      const en = V.termHome.get(x.id)?.decl.en;
      if (en) {
        const sup = document.createElement('sup');
        sup.className = 'term-en';
        sup.textContent = en;
        d.appendChild(sup);
      }
      return d;
    }
    case 'term': {
      const home = V.termHome.get(x.id);
      const a = document.createElement('a');
      a.className = 'term';
      a.dataset.term = x.id;
      if (home) {
        a.href = `#/n/${home.node}`;
        if (!progress.isDone(home.node)) a.classList.add('unlearned');
      }
      a.appendChild(renderInlines(x.c));
      return a;
    }
    case 'fwd': {
      const s = document.createElement('span');
      s.className = 'term-fwd';
      s.dataset.term = x.id;
      s.appendChild(renderInlines(x.c));
      const sup = document.createElement('sup');
      sup.textContent = '예고';
      s.appendChild(sup);
      return s;
    }
    case 'why': {
      const a = document.createElement('a');
      a.className = 'why';
      a.href = `#/n/${x.to}`;
      a.dataset.to = x.to;
      if (x.key) a.dataset.ref = `${x.to}#${x.key}`; // 그 노드의 이름표 하나(명제 3 …)를 가리키는 왜? 칩
      a.dataset.q = x.q;
      const badge = document.createElement('span');
      badge.className = 'why-badge';
      badge.textContent = '왜?';
      a.append(badge, document.createTextNode(' ' + x.q.replace(/^왜\??\s*/, '')));
      if (/^왜\??$/.test(x.q.trim())) a.lastChild!.textContent = '';
      return a;
    }
    case 'label': {
      // 이름표 선언: 공리·명제의 이름을 굵게 적고, 참조가 찾아올 앵커를 둔다.
      const s = document.createElement('strong');
      s.className = 'lbl';
      s.id = `lbl-${x.key}`;
      s.appendChild(renderInlines(x.c));
      return s;
    }
    case 'ref': {
      // 이름표 참조: 마우스를 올리면 그 항목의 글이 뜨고(popover.ts), 누르면 그 자리로 간다(reader.ts).
      const a = document.createElement('a');
      a.className = 'ref';
      a.href = `#/n/${x.node ?? ''}`;
      a.dataset.ref = `${x.node}#${x.key}`;
      a.appendChild(renderInlines(x.c));
      return a;
    }
    case 'link': {
      const a = document.createElement('a');
      a.className = 'nlink';
      a.href = `#/n/${x.to}`;
      a.dataset.to = x.to;
      if (x.key) a.dataset.ref = `${x.to}#${x.key}`; // 그 노드의 이름표 하나로 가는 링크
      a.appendChild(renderInlines(x.c));
      return a;
    }
    case 'sync': {
      const s = document.createElement('span');
      s.className = 'sync';
      s.dataset.sync = x.key;
      s.appendChild(renderInlines(x.c));
      return s;
    }
  }
}

/** 노드의 첫 문단(미리보기용) */
export function firstParagraph(id: string): Inline[] {
  const pn = V.parsed.get(id);
  const p = pn?.body.find((b) => b.t === 'p');
  return p && p.t === 'p' ? p.c : [];
}

export function nodeExists(id: string) {
  return NODE_BY_ID.has(id);
}
