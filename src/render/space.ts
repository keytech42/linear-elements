// 3차원 공간 렌더러 (Canvas2D 위의 직교 투영, 의존성 없음).
//
// 이 렌더러 자체가 선형대수다: 화면에 그린다는 것은 ℝ³의 점을 ℝ²로 보내는 2×3 행렬 P를 곱하는 일이다.
//   1) z축을 중심으로 yaw만큼 돌리고  2) x축을 중심으로 pitch만큼 기울인 다음  3) 깊이 성분을 버린다.
// P의 계수(rank)는 2다: 시선 방향의 직선 하나가 통째로 한 점으로 납작해진다(그 직선이 P의 영공간).
// 장면 아래의 "투영 행렬 보기"가 지금 이 순간의 P를 그대로 보여 준다.
import type { Vec } from '../la/vec';
import type { Mat } from '../la/mat';
import { C } from './colors';
import type { SyncBus } from '../sync/bus';

type Item = { depth: number; draw: (ctx: CanvasRenderingContext2D) => void };

export interface Style3 {
  color?: string;
  width?: number;
  dash?: number[];
  key?: string;
  alpha?: number;
}

export class Space {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly wrap: HTMLDivElement;
  draw: (s: Space) => void = () => {};
  onView: (P: Mat) => void = () => {};
  yaw = -0.6;
  pitch = 0.45;
  range: number;
  bus?: SyncBus;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private items: Item[] = [];
  private frameReq = 0;
  private dragging: { x: number; y: number } | null = null;
  private ro: ResizeObserver;
  private offBus?: () => void;

  constructor(host: HTMLElement, opts: { range?: number; height?: number; bus?: SyncBus } = {}) {
    this.range = opts.range ?? 3;
    this.bus = opts.bus;
    this.wrap = document.createElement('div');
    this.wrap.className = 'plane space';
    this.canvas = document.createElement('canvas');
    this.canvas.style.height = `${opts.height ?? 380}px`;
    this.canvas.title = '끌어서 돌려 보기';
    this.wrap.appendChild(this.canvas);
    host.appendChild(this.wrap);
    this.ctx = this.canvas.getContext('2d')!;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.canvas);
    this.resize();
    this.canvas.addEventListener('pointerdown', (e) => {
      this.dragging = { x: e.clientX, y: e.clientY };
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      this.yaw -= (e.clientX - this.dragging.x) * 0.008;
      this.pitch = Math.max(0.05, Math.min(Math.PI - 0.05, this.pitch - (e.clientY - this.dragging.y) * 0.008));
      this.dragging = { x: e.clientX, y: e.clientY };
      this.invalidate();
    });
    const up = () => (this.dragging = null);
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
    if (this.bus) this.offBus = this.bus.on(() => this.invalidate());
  }

  destroy() {
    cancelAnimationFrame(this.frameReq);
    this.ro.disconnect();
    this.offBus?.();
    this.wrap.remove();
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

  /** 지금 시점의 투영 행렬 P (2×3). 화면 가로 = 1행, 화면 세로 = 2행. */
  projection(): Mat {
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    // z축 회전 Rz(yaw) 다음 x축 회전 Rx(pitch)를 하고, 1행(가로)과 3행(세로)만 남긴 것
    return [
      [cy, -sy, 0],
      [sp * sy, sp * cy, cp],
    ];
  }
  /** 시선 방향(깊이) 성분: 화면에서 버려지는 축. 클수록 멀다. */
  private depthRow(): Vec {
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    return [cp * sy, cp * cy, -sp];
  }

  P(v: Vec): [number, number, number] {
    const M = this.projection();
    const d = this.depthRow();
    const u = Math.min(this.w, this.h) / 2 / this.range;
    const X = M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2];
    const Y = M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2];
    const D = d[0] * v[0] + d[1] * v[1] + d[2] * v[2];
    return [this.w / 2 + X * u, this.h / 2 - Y * u, D];
  }

  hot(key?: string) {
    return !!key && !!this.bus?.is(key);
  }

  private render() {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    this.items = [];
    this.draw(this);
    // 화가 알고리즘: 먼 것부터 그린다
    this.items.sort((a, b) => b.depth - a.depth);
    for (const it of this.items) it.draw(ctx);
    this.onView(this.projection());
  }

  seg(a: Vec, b: Vec, st: Style3 = {}) {
    const pa = this.P(a), pb = this.P(b);
    const hot = this.hot(st.key);
    this.items.push({
      depth: (pa[2] + pb[2]) / 2,
      draw: (ctx) => {
        ctx.strokeStyle = st.color ?? C.ink;
        ctx.lineWidth = (st.width ?? 1.5) + (hot ? 2 : 0);
        ctx.globalAlpha = st.alpha ?? 1;
        ctx.setLineDash(st.dash ?? []);
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      },
    });
  }

  arrow(from: Vec, to: Vec, st: Style3 & { label?: string } = {}) {
    const pa = this.P(from), pb = this.P(to);
    const hot = this.hot(st.key);
    const color = st.color ?? C.ink;
    this.items.push({
      depth: pb[2] - 0.01,
      draw: (ctx) => {
        const len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
        const ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]);
        const hl = Math.min(11, len * 0.45);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = (st.width ?? 2.5) + (hot ? 2 : 0);
        if (hot) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0] - Math.cos(ang) * hl * 0.8, pb[1] - Math.sin(ang) * hl * 0.8);
        ctx.stroke();
        if (len > 0.5) {
          ctx.beginPath();
          ctx.moveTo(pb[0], pb[1]);
          ctx.lineTo(pb[0] - hl * Math.cos(ang - 0.42), pb[1] - hl * Math.sin(ang - 0.42));
          ctx.lineTo(pb[0] - hl * Math.cos(ang + 0.42), pb[1] - hl * Math.sin(ang + 0.42));
          ctx.closePath();
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        if (st.label) label(ctx, pb[0] + 9, pb[1] - 9, st.label, color);
      },
    });
  }

  poly(pts: Vec[], st: Style3 & { fill?: string } = {}) {
    const ps = pts.map((p) => this.P(p));
    const hot = this.hot(st.key);
    this.items.push({
      depth: ps.reduce((s, p) => s + p[2], 0) / ps.length,
      draw: (ctx) => {
        ctx.beginPath();
        ps.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.closePath();
        if (st.fill) {
          ctx.fillStyle = st.fill;
          ctx.globalAlpha = hot ? 1 : (st.alpha ?? 1);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (st.color) {
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.width ?? 1;
          ctx.stroke();
        }
      },
    });
  }

  dot(p: Vec, st: Style3 & { r?: number } = {}) {
    const q = this.P(p);
    this.items.push({
      depth: q[2] - 0.02,
      draw: (ctx) => {
        ctx.beginPath();
        ctx.arc(q[0], q[1], st.r ?? 3.5, 0, Math.PI * 2);
        ctx.fillStyle = st.color ?? C.ink;
        ctx.globalAlpha = st.alpha ?? 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      },
    });
  }

  text(p: Vec, s: string, color: string = C.ink) {
    const q = this.P(p);
    this.items.push({ depth: q[2] - 1, draw: (ctx) => label(ctx, q[0], q[1], s, color) });
  }

  /** 축 세 개와 바닥(z = 0) 격자 */
  axes(n = 3) {
    for (let k = -n; k <= n; k++) {
      this.seg([k, -n, 0], [k, n, 0], { color: C.grid, width: 1 });
      this.seg([-n, k, 0], [n, k, 0], { color: C.grid, width: 1 });
    }
    this.seg([-n, 0, 0], [n, 0, 0], { color: C.axis, width: 1 });
    this.seg([0, -n, 0], [0, n, 0], { color: C.axis, width: 1 });
    this.seg([0, 0, -n], [0, 0, n], { color: C.axis, width: 1 });
    this.text([n + 0.3, 0, 0], 'x', C.dim);
    this.text([0, n + 0.3, 0], 'y', C.dim);
    this.text([0, 0, n + 0.3], 'z', C.dim);
  }

  hud(lines: { text: string; color?: string }[]) {
    this.items.push({
      depth: -1e9,
      draw: (ctx) => {
        ctx.font = '13px "Pretendard", system-ui, sans-serif';
        ctx.textAlign = 'left';
        lines.forEach((ln, i) => label(ctx, 12, 16 + i * 19, ln.text, ln.color ?? C.dim, false));
      },
    });
  }
}

function label(ctx: CanvasRenderingContext2D, x: number, y: number, s: string, color: string, setFont = true) {
  if (setFont) ctx.font = '14px "Pretendard", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(14,17,22,0.85)';
  ctx.strokeText(s, x, y);
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
}
