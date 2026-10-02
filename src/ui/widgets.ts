// 장면에서 쓰는 작은 조작 도구들: 행렬 편집기, 벡터 편집기, 슬라이더, 단추.
// 행렬 편집기의 DOM은 일부러 "열 우선"으로 짠다. 화면의 한 열 = DOM의 한 상자 = 기저 벡터 하나의 도착지.
import type { Mat } from '../la/mat';
import type { Vec } from '../la/vec';
import { C } from '../render/colors';

export const COL_COLORS = [C.c1, C.c2, C.c3, C.ink];

/** 수를 짧게: 소수 둘째 자리까지, 뒤의 0은 지우고, 빼기 기호는 진짜 빼기 기호(−)로 */
export function fmt(n: number, digits = 2): string {
  if (!isFinite(n)) return n > 0 ? '∞' : n < 0 ? '−∞' : '?';
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  const s = (Object.is(r, -0) ? 0 : r).toFixed(digits).replace(/\.?0+$/, '');
  return s.replace('-', '−');
}

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

interface ScrubOpts {
  get: () => number;
  set: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

/** 숫자를 좌우로 끌어서 바꾸는 칸. 끌지 않고 누르면 직접 입력. 위/아래 화살표 키로도 바뀐다. */
export function scrub(span: HTMLElement, o: ScrubOpts) {
  const step = o.step ?? 0.1;
  const clamp = (v: number) => Math.min(o.max ?? 99, Math.max(o.min ?? -99, v));
  const round = (v: number) => Math.round(v / step) * step;
  span.tabIndex = 0;
  span.classList.add('scrub');
  span.title = '좌우로 끌기 · 눌러서 입력 · ↑↓ 키';
  let start: { x: number; v: number; moved: boolean } | null = null;
  span.addEventListener('pointerdown', (e) => {
    if (span.querySelector('input')) return;
    start = { x: e.clientX, v: o.get(), moved: false };
    span.setPointerCapture(e.pointerId);
  });
  span.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 3) start.moved = true;
    if (start.moved) o.set(clamp(round(start.v + Math.round(dx / 6) * step)));
  });
  span.addEventListener('pointerup', () => {
    if (start && !start.moved) edit();
    start = null;
  });
  span.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') o.set(clamp(round(o.get() + step)));
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') o.set(clamp(round(o.get() - step)));
    else if (e.key === 'Enter') edit();
    else return;
    e.preventDefault();
  });
  const edit = () => {
    const inp = el('input', 'scrub-input');
    inp.value = String(Math.round(o.get() * 1000) / 1000);
    span.textContent = '';
    span.appendChild(inp);
    inp.focus();
    inp.select();
    const done = () => {
      const v = parseFloat(inp.value.replace('−', '-'));
      inp.remove();
      if (isFinite(v)) o.set(clamp(v));
      else o.set(o.get());
    };
    inp.addEventListener('blur', done);
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') inp.blur();
      if (e.key === 'Escape') {
        inp.value = 'x';
        inp.blur();
      }
    });
  };
}

export interface MatrixEditor {
  el: HTMLElement;
  refresh(): void;
}

/**
 * 행렬 편집기. 칸의 동기화 키: {prefix}a{i}{j} (1부터 셈), 열 상자: {prefix}col{j}
 * 예: prefix 없이 2×2 → a11 a21 / a12 a22, col1 / col2
 */
export function matrixEditor(
  host: HTMLElement,
  o: {
    get: () => Mat;
    set?: (A: Mat) => void;
    name?: string;
    prefix?: string;
    step?: number;
    colColors?: boolean;
    digits?: number;
  },
): MatrixEditor {
  const root = el('div', 'mat-ed');
  if (o.name) root.appendChild(el('span', 'mat-name', `${o.name} =`));
  const br = el('div', 'mat');
  root.appendChild(br);
  host.appendChild(root);
  const p = o.prefix ? `${o.prefix}.` : '';
  const A0 = o.get();
  const m = A0.length, n = A0[0].length;
  const cells: HTMLElement[][] = [];
  for (let j = 0; j < n; j++) {
    const colEl = el('div', 'mcol');
    colEl.dataset.sync = `${p}col${j + 1}`;
    if (o.colColors !== false) colEl.style.color = COL_COLORS[j % COL_COLORS.length];
    br.appendChild(colEl);
    for (let i = 0; i < m; i++) {
      const c = el('span', 'cell');
      c.dataset.sync = `${p}a${i + 1}${j + 1}`;
      colEl.appendChild(c);
      (cells[i] ??= [])[j] = c;
      if (o.set) {
        scrub(c, {
          get: () => o.get()[i][j],
          set: (v) => {
            const A = o.get().map((r) => r.slice());
            A[i][j] = v;
            o.set!(A);
          },
          step: o.step ?? 0.1,
        });
      }
    }
  }
  const refresh = () => {
    const A = o.get();
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (!cells[i][j].querySelector('input')) cells[i][j].textContent = fmt(A[i][j], o.digits ?? 2);
  };
  refresh();
  return { el: root, refresh };
}

/** 세로 벡터 편집기. 칸의 동기화 키: {key}{i} 가 아니라 {key} 하나(벡터 전체)로 묶는다. */
export function vectorEditor(
  host: HTMLElement,
  o: { get: () => Vec; set?: (v: Vec) => void; name?: string; key?: string; color?: string; step?: number },
): MatrixEditor {
  const root = el('div', 'mat-ed');
  if (o.name) root.appendChild(el('span', 'mat-name', `${o.name} =`));
  const br = el('div', 'mat');
  const colEl = el('div', 'mcol');
  if (o.key) colEl.dataset.sync = o.key;
  colEl.style.color = o.color ?? C.ink;
  br.appendChild(colEl);
  root.appendChild(br);
  host.appendChild(root);
  const cells = o.get().map((_, i) => {
    const c = el('span', 'cell');
    colEl.appendChild(c);
    if (o.set)
      scrub(c, {
        get: () => o.get()[i],
        set: (v) => {
          const x = o.get().slice();
          x[i] = v;
          o.set!(x);
        },
        step: o.step ?? 0.1,
      });
    return c;
  });
  const refresh = () => {
    o.get().forEach((v, i) => {
      if (!cells[i].querySelector('input')) cells[i].textContent = fmt(v);
    });
  };
  refresh();
  return { el: root, refresh };
}

export function slider(
  host: HTMLElement,
  o: { label: string; min: number; max: number; step: number; get: () => number; set: (v: number) => void; format?: (v: number) => string; key?: string },
) {
  const row = el('label', 'slider');
  const lab = el('span', 'slider-label', o.label);
  if (o.key) lab.dataset.sync = o.key;
  const inp = el('input');
  inp.type = 'range';
  inp.min = String(o.min);
  inp.max = String(o.max);
  inp.step = String(o.step);
  const out = el('span', 'slider-val');
  row.append(lab, inp, out);
  host.appendChild(row);
  inp.addEventListener('input', () => o.set(parseFloat(inp.value)));
  const refresh = () => {
    inp.value = String(o.get());
    out.textContent = (o.format ?? fmt)(o.get());
  };
  refresh();
  return { el: row, refresh };
}

export function buttons(host: HTMLElement, list: { label: string; on: () => void; title?: string }[], cls = 'btn-row') {
  const row = el('div', cls);
  for (const b of list) {
    const btn = el('button', 'btn', b.label);
    if (b.title) btn.title = b.title;
    btn.onclick = b.on;
    row.appendChild(btn);
  }
  host.appendChild(row);
  return row;
}

export function toggle(host: HTMLElement, label: string, get: () => boolean, set: (v: boolean) => void) {
  const row = el('label', 'toggle');
  const inp = el('input');
  inp.type = 'checkbox';
  inp.checked = get();
  inp.addEventListener('change', () => set(inp.checked));
  row.append(inp, el('span', '', label));
  host.appendChild(row);
  return { el: row, refresh: () => (inp.checked = get()) };
}

/** 색이 칠해진 글 조각 (동기화 키 포함) */
export function chip(text: string, color: string, key?: string): string {
  return `<span class="chip-txt" style="color:${color}"${key ? ` data-sync="${key}"` : ''}>${text}</span>`;
}

/** 0 → 1 로 부드럽게 (애니메이션용) */
export function animate(ms: number, f: (t: number) => void, done?: () => void): () => void {
  let raf = 0;
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / ms);
    f(t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    if (t < 1) raf = requestAnimationFrame(step);
    else done?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

export function lerpMat(A: Mat, B: Mat, t: number): Mat {
  return A.map((r, i) => r.map((v, j) => v + (B[i][j] - v) * t));
}
