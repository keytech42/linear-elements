// 2차원 평면 렌더러 (Canvas2D, 의존성 없음).
// 좌표 약속: 수학 좌표(오른쪽이 x+, 위쪽이 y+). 화면 좌표는 아래쪽이 y+ 이므로 S()에서 y 부호를 뒤집는다.
// 그리기 방식: 상태가 바뀌면 invalidate() → 다음 animation frame에서 draw()를 처음부터 다시 실행한다(즉시 모드).
import type { Vec } from '../la/vec';
import type { Mat } from '../la/mat';
import { matVec } from '../la/mat';
import { C } from './colors';
import type { SyncBus } from '../sync/bus';

export interface Handle {
  key: string;
  get(): Vec;
  set(v: Vec): void;
  /** 이 간격의 격자점 근처에서 달라붙는다. 0이면 달라붙지 않는다. 기본 0.5. Alt를 누르면 해제. */
  snap?: number;
  /** 드래그 가능 여부를 동적으로 */
  enabled?: () => boolean;
}

interface Hit {
  key: string;
  d: (px: number, py: number) => number; // 화면 픽셀 거리
}

export interface Style {
  color?: string;
  width?: number;
  dash?: number[];
  key?: string; // 동기화 키: 가리켜지면 빛나고, 마우스를 올리면 버스에 알린다
  alpha?: number;
}

export interface PlaneOpts {
  /** 짧은 변의 절반이 몇 단위인가 */
  range?: number;
  /** 캔버스 높이(px). 너비는 부모를 채운다. */
  height?: number;
  bus?: SyncBus;
  /** 확대·축소 단추를 숨길지 */
  noZoom?: boolean;
}

export class Plane {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly wrap: HTMLDivElement;
  handles: Handle[] = [];
  draw: (p: Plane) => void = () => {};
  /** 드래그가 끝났을 때 */
  onDragEnd: () => void = () => {};
  bus?: SyncBus;
  range: number;
  private baseRange: number;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private center: Vec = [0, 0];
  private hits: Hit[] = [];
  private frameReq = 0;
  private drag: Handle | null = null;
  private hoverHandle: Handle | null = null;
  private ro: ResizeObserver;
  private offBus?: () => void;

  constructor(host: HTMLElement, opts: PlaneOpts = {}) {
    this.range = this.baseRange = opts.range ?? 4;
    this.bus = opts.bus;
    this.wrap = document.createElement('div');
    this.wrap.className = 'plane';
    this.canvas = document.createElement('canvas');
    this.canvas.style.height = `${opts.height ?? 360}px`;
    this.wrap.appendChild(this.canvas);
    host.appendChild(this.wrap);
    this.ctx = this.canvas.getContext('2d')!;
    if (!opts.noZoom) this.addZoom();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.canvas);
    this.resize();
    this.canvas.addEventListener('pointerdown', this.onDown);
    this.canvas.addEventListener('pointermove', this.onMove);
    this.canvas.addEventListener('pointerup', this.onUp);
    this.canvas.addEventListener('pointercancel', this.onUp);
    this.canvas.addEventListener('pointerleave', () => {
      if (!this.drag) this.bus?.set(null);
    });
    if (this.bus) this.offBus = this.bus.on(() => this.invalidate());
  }

  destroy() {
    cancelAnimationFrame(this.frameReq);
    this.ro.disconnect();
    this.offBus?.();
    this.wrap.remove();
  }

  private addZoom() {
    const bar = document.createElement('div');
    bar.className = 'plane-zoom';
    const mk = (label: string, title: string, f: () => void) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.title = title;
      b.onclick = f;
      bar.appendChild(b);
    };
    mk('−', '멀리 보기', () => this.setRange(this.range * 1.25));
    mk('+', '가까이 보기', () => this.setRange(this.range / 1.25));
    mk('⟲', '처음 크기로', () => this.setRange(this.baseRange));
    this.wrap.appendChild(bar);
  }

  setRange(r: number) {
    this.range = Math.min(40, Math.max(0.5, r));
    this.invalidate();
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.invalidate();
  }

  invalidate() {
    if (this.frameReq) return;
    this.frameReq = requestAnimationFrame(() => {
      this.frameReq = 0;
      this.render();
    });
  }

  private render() {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    this.hits = [];
    this.draw(this);
    // 드래그할 수 있는 손잡이 표시
    for (const hd of this.handles) {
      if (hd.enabled && !hd.enabled()) continue;
      const [x, y] = this.S(hd.get());
      const active = hd === this.drag || hd === this.hoverHandle;
      ctx.beginPath();
      ctx.arc(x, y, active ? 9 : 6, 0, Math.PI * 2);
      ctx.strokeStyle = active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ── 좌표 변환 ──────────────────────────────────────────────
  /** 1단위가 몇 픽셀인가 */
  get unit(): number {
    return Math.min(this.w, this.h) / 2 / this.range;
  }
  /** 수학 좌표 → 화면 픽셀 */
  S(v: Vec): [number, number] {
    const u = this.unit;
    return [this.w / 2 + (v[0] - this.center[0]) * u, this.h / 2 - (v[1] - this.center[1]) * u];
  }
  /** 화면 픽셀 → 수학 좌표 */
  W(px: number, py: number): Vec {
    const u = this.unit;
    return [(px - this.w / 2) / u + this.center[0], -(py - this.h / 2) / u + this.center[1]];
  }
  /** 화면에 보이는 수학 좌표 범위 */
  get bounds() {
    const [x0, y1] = this.W(0, 0);
    const [x1, y0] = this.W(this.w, this.h);
    return { x0, x1, y0, y1 };
  }
  get width() {
    return this.w;
  }
  get height() {
    return this.h;
  }

  hot(key?: string): boolean {
    return !!key && !!this.bus?.is(key);
  }

  // ── 그리기 도구 ────────────────────────────────────────────
  private stroke(st: Style, defColor: string, defWidth: number) {
    const { ctx } = this;
    const hot = this.hot(st.key);
    ctx.strokeStyle = st.color ?? defColor;
    ctx.lineWidth = (st.width ?? defWidth) + (hot ? 2 : 0);
    ctx.setLineDash(st.dash ?? []);
    ctx.globalAlpha = st.alpha ?? 1;
    if (hot) {
      ctx.shadowColor = st.color ?? defColor;
      ctx.shadowBlur = 12;
    }
  }
  private reset() {
    const { ctx } = this;
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  /** 배경 격자와 축 */
  grid(step = 1) {
    const { ctx } = this;
    const { x0, x1, y0, y1 } = this.bounds;
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) {
      ctx.strokeStyle = Math.abs(gx) < 1e-9 ? C.axis : C.grid;
      const [sx] = this.S([gx, 0]);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, this.h);
      ctx.stroke();
    }
    for (let gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) {
      ctx.strokeStyle = Math.abs(gy) < 1e-9 ? C.axis : C.grid;
      const [, sy] = this.S([0, gy]);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(this.w, sy);
      ctx.stroke();
    }
  }

  /**
   * 변환된 격자: 원래 격자선 x = k, y = k 를 A로 보낸 직선들.
   * 선형 변환이므로 직선은 직선으로 간다(prop.linear-grid). 그래서 양 끝점 두 개만 보내면 된다.
   */
  tgrid(A: Mat, opts: { color?: string; extent?: number; fn?: (v: Vec) => Vec; samples?: number } = {}) {
    const { ctx } = this;
    const ext = opts.extent ?? Math.ceil(this.range * 2.5);
    ctx.lineWidth = 1;
    const map = opts.fn ?? ((v: Vec) => matVec(A, v));
    // 비선형 변환(fn이 주어진 경우)은 직선이 휘므로 잘게 나눠서 그린다.
    const n = opts.fn ? (opts.samples ?? 60) : 1;
    for (let k = -ext; k <= ext; k++) {
      for (const dir of [0, 1]) {
        ctx.strokeStyle = k === 0 ? 'rgba(150,190,255,0.85)' : (opts.color ?? C.tgrid);
        ctx.lineWidth = k === 0 ? 1.6 : 1;
        ctx.beginPath();
        for (let s = 0; s <= n; s++) {
          const t = -ext + (2 * ext * s) / n;
          const p = dir === 0 ? map([k, t]) : map([t, k]);
          const [sx, sy] = this.S(p);
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    }
  }

  seg(a: Vec, b: Vec, st: Style = {}) {
    const { ctx } = this;
    const [ax, ay] = this.S(a);
    const [bx, by] = this.S(b);
    this.stroke(st, C.ink, 2);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    this.reset();
    if (st.key) this.hits.push({ key: st.key, d: (px, py) => segDist(px, py, ax, ay, bx, by) });
  }

  /** 점 p를 지나고 방향이 d인 직선(화면 끝까지) */
  line(p: Vec, d: Vec, st: Style = {}) {
    const L = this.range * 6;
    const n = Math.hypot(d[0], d[1]) || 1;
    this.seg([p[0] - (d[0] / n) * L, p[1] - (d[1] / n) * L], [p[0] + (d[0] / n) * L, p[1] + (d[1] / n) * L], st);
  }

  arrow(from: Vec, to: Vec, st: Style & { label?: string; head?: number } = {}) {
    const { ctx } = this;
    const [ax, ay] = this.S(from);
    const [bx, by] = this.S(to);
    const len = Math.hypot(bx - ax, by - ay);
    const color = st.color ?? C.ink;
    this.stroke(st, color, 2.5);
    const hl = Math.min(st.head ?? 11, len * 0.45);
    const ang = Math.atan2(by - ay, bx - ax);
    // 몸통은 머리 밑까지만 그린다(머리 끝이 뭉툭해지지 않도록)
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx - Math.cos(ang) * hl * 0.8, by - Math.sin(ang) * hl * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - hl * Math.cos(ang - 0.42), by - hl * Math.sin(ang - 0.42));
    ctx.lineTo(bx - hl * Math.cos(ang + 0.42), by - hl * Math.sin(ang + 0.42));
    ctx.closePath();
    if (len > 0.5) ctx.fill();
    this.reset();
    if (st.label) this.text(to, st.label, { color, dx: 10, dy: -10 });
    if (st.key) this.hits.push({ key: st.key, d: (px, py) => segDist(px, py, ax, ay, bx, by) });
  }

  poly(pts: Vec[], st: Style & { fill?: string } = {}) {
    const { ctx } = this;
    if (pts.length < 2) return;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const [x, y] = this.S(p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    const hot = this.hot(st.key);
    if (st.fill) {
      ctx.globalAlpha = hot ? 1 : (st.alpha ?? 1);
      ctx.fillStyle = st.fill;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (hot) {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();
      }
    }
    if (st.color) {
      this.stroke(st, st.color, 1.5);
      ctx.stroke();
      this.reset();
    }
    if (st.key) {
      const sp = pts.map((p) => this.S(p));
      this.hits.push({ key: st.key, d: (px, py) => (pointInPoly(px, py, sp) ? 0 : 1e9) });
    }
  }

  /** 매개변수 곡선 t ↦ f(t) */
  curve(f: (t: number) => Vec, t0: number, t1: number, n: number, st: Style = {}) {
    const { ctx } = this;
    this.stroke(st, C.ink, 2);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = this.S(f(t0 + ((t1 - t0) * i) / n));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    this.reset();
  }

  dot(p: Vec, st: Style & { r?: number } = {}) {
    const { ctx } = this;
    const [x, y] = this.S(p);
    const hot = this.hot(st.key);
    ctx.beginPath();
    ctx.arc(x, y, (st.r ?? 4) + (hot ? 2 : 0), 0, Math.PI * 2);
    ctx.fillStyle = st.color ?? C.ink;
    ctx.globalAlpha = st.alpha ?? 1;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (st.key) this.hits.push({ key: st.key, d: (px, py) => Math.hypot(px - x, py - y) - 4 });
  }

  text(p: Vec, s: string, o: { color?: string; dx?: number; dy?: number; align?: CanvasTextAlign; size?: number; bold?: boolean } = {}) {
    const { ctx } = this;
    const [x, y] = this.S(p);
    ctx.font = `${o.bold ? '600 ' : ''}${o.size ?? 14}px "Pretendard", system-ui, sans-serif`;
    ctx.textAlign = o.align ?? 'left';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(14,17,22,0.85)';
    ctx.strokeText(s, x + (o.dx ?? 0), y + (o.dy ?? 0));
    ctx.fillStyle = o.color ?? C.ink;
    ctx.fillText(s, x + (o.dx ?? 0), y + (o.dy ?? 0));
  }

  /** 화면 고정 위치(픽셀)의 글 — 범례, 측정값 */
  hud(lines: { text: string; color?: string }[], corner: 'tl' | 'tr' | 'bl' | 'br' = 'tl') {
    const { ctx } = this;
    ctx.font = '13px "Pretendard", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const lh = 19;
    const right = corner[1] === 'r';
    const bottom = corner[0] === 'b';
    lines.forEach((ln, i) => {
      const y = bottom ? this.h - 14 - (lines.length - 1 - i) * lh : 16 + i * lh;
      ctx.textAlign = right ? 'right' : 'left';
      const x = right ? this.w - 12 : 12;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(14,17,22,0.9)';
      ctx.strokeText(ln.text, x, y);
      ctx.fillStyle = ln.color ?? C.dim;
      ctx.fillText(ln.text, x, y);
    });
  }

  // ── 포인터 ─────────────────────────────────────────────────
  private local(e: PointerEvent): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  private pickHandle(px: number, py: number): Handle | null {
    let best: Handle | null = null;
    let bd = 16;
    for (const hd of this.handles) {
      if (hd.enabled && !hd.enabled()) continue;
      const [x, y] = this.S(hd.get());
      const d = Math.hypot(px - x, py - y);
      if (d < bd) {
        bd = d;
        best = hd;
      }
    }
    return best;
  }
  private onDown = (e: PointerEvent) => {
    const [px, py] = this.local(e);
    const hd = this.pickHandle(px, py);
    if (!hd) return;
    e.preventDefault();
    this.drag = hd;
    this.canvas.setPointerCapture(e.pointerId);
    this.bus?.set(hd.key);
    this.invalidate();
  };
  private onMove = (e: PointerEvent) => {
    const [px, py] = this.local(e);
    if (this.drag) {
      let v = this.W(px, py);
      const step = this.drag.snap ?? 0.5;
      if (step > 0 && !e.altKey) {
        const thr = 0.12 * Math.max(1, this.range / 4);
        v = v.map((c) => {
          const r = Math.round(c / step) * step;
          return Math.abs(r - c) < thr ? r : c;
        });
      }
      this.drag.set(v);
      this.invalidate();
      return;
    }
    const hd = this.pickHandle(px, py);
    if (hd !== this.hoverHandle) {
      this.hoverHandle = hd;
      this.invalidate();
    }
    this.canvas.style.cursor = hd ? 'grab' : 'default';
    if (hd) {
      this.bus?.set(hd.key);
      return;
    }
    // 그려진 대상 중 가장 가까운 것
    let best: string | null = null;
    let bd = 8;
    for (const h of this.hits) {
      const d = h.d(px, py);
      if (d < bd) {
        bd = d;
        best = h.key;
      }
    }
    this.bus?.set(best);
  };
  private onUp = (e: PointerEvent) => {
    if (!this.drag) return;
    this.canvas.releasePointerCapture(e.pointerId);
    this.drag = null;
    this.invalidate();
    this.onDragEnd();
  };
}

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy;
  const t = L === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function pointInPoly(x: number, y: number, pts: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
