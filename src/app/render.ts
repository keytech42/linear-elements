// 파싱된 마크업(Block/Inline)을 DOM으로. 수식은 KaTeX, 장면은 화면에 들어올 때 불러온다.
import katex from 'katex';
import type { Block, Inline } from '../content/markup';
import { expandSyncMacros } from '../content/markup';
import { KATEX_MACROS } from '../content/katex-macros';
import { SCENES, V, NODE_BY_ID } from './data';
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
      a.appendChild(renderBlocks(b.blocks, ctx));
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
      a.dataset.q = x.q;
      const badge = document.createElement('span');
      badge.className = 'why-badge';
      badge.textContent = '왜?';
      a.append(badge, document.createTextNode(' ' + x.q.replace(/^왜\??\s*/, '')));
      if (/^왜\??$/.test(x.q.trim())) a.lastChild!.textContent = '';
      return a;
    }
    case 'link': {
      const a = document.createElement('a');
      a.className = 'nlink';
      a.href = `#/n/${x.to}`;
      a.dataset.to = x.to;
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
