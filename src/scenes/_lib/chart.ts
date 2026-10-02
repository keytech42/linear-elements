// 작은 그래프 캔버스(곡선, 막대, 기준선). 장면 패널이나 그림 아래에 붙여 쓴다.
import { C } from '../../render/colors';

export class Chart {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  w = 0;
  h = 0;
  private dpr = 1;
  private ro: ResizeObserver;
  draw: (c: Chart) => void = () => {};
  private req = 0;
  /** 그래프 영역의 안쪽 여백(px) */
  pad = { l: 34, r: 10, t: 10, b: 22 };
  xr: [number, number] = [0, 1];
  yr: [number, number] = [0, 1];

  constructor(host: HTMLElement, height = 140) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'chart';
    this.canvas.style.width = '100%';
    this.canvas.style.height = `${height}px`;
    this.canvas.style.display = 'block';
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.canvas);
    this.resize();
  }
  destroy() {
    this.ro.disconnect();
    cancelAnimationFrame(this.req);
    this.canvas.remove();
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
    if (this.req) return;
    this.req = requestAnimationFrame(() => {
      this.req = 0;
      const { ctx } = this;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.w, this.h);
      this.draw(this);
    });
  }
  X(x: number) {
    const { l, r } = this.pad;
    return l + ((x - this.xr[0]) / (this.xr[1] - this.xr[0])) * (this.w - l - r);
  }
  Y(y: number) {
    const { t, b } = this.pad;
    return this.h - b - ((y - this.yr[0]) / (this.yr[1] - this.yr[0])) * (this.h - t - b);
  }
  frame(xlabel = '', ylabel = '', yticks: number[] = []) {
    const { ctx } = this;
    ctx.strokeStyle = C.gridStrong;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.pad.l, this.pad.t);
    ctx.lineTo(this.pad.l, this.h - this.pad.b);
    ctx.lineTo(this.w - this.pad.r, this.h - this.pad.b);
    ctx.stroke();
    ctx.fillStyle = C.dim;
    ctx.font = '11px "Pretendard", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (const y of yticks) {
      ctx.fillText(fmtTick(y), this.pad.l - 4, this.Y(y));
      ctx.strokeStyle = C.grid;
      ctx.beginPath();
      ctx.moveTo(this.pad.l, this.Y(y));
      ctx.lineTo(this.w - this.pad.r, this.Y(y));
      ctx.stroke();
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    if (xlabel) ctx.fillText(xlabel, this.w - this.pad.r, this.h - 5);
    ctx.textAlign = 'left';
    if (ylabel) ctx.fillText(ylabel, this.pad.l + 4, this.pad.t + 8);
  }
  line(xs: ArrayLike<number>, ys: ArrayLike<number>, color: string = C.ink, width = 2) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) {
      const x = this.X(xs[i]), y = this.Y(ys[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  vline(x: number, color: string, label = '', dash: number[] = []) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(this.X(x), this.pad.t);
    ctx.lineTo(this.X(x), this.h - this.pad.b);
    ctx.stroke();
    ctx.setLineDash([]);
    if (label) {
      ctx.fillStyle = color;
      ctx.font = '11px "Pretendard", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, this.X(x), this.h - this.pad.b + 13);
    }
  }
  hline(y: number, color: string, label = '', dash: number[] = [4, 4]) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(this.pad.l, this.Y(y));
    ctx.lineTo(this.w - this.pad.r, this.Y(y));
    ctx.stroke();
    ctx.setLineDash([]);
    if (label) {
      ctx.fillStyle = color;
      ctx.font = '11px "Pretendard", system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, this.w - this.pad.r - 2, this.Y(y) - 5);
    }
  }
  bar(x: number, y: number, wUnits: number, color: string) {
    const { ctx } = this;
    const x0 = this.X(x - wUnits / 2), x1 = this.X(x + wUnits / 2);
    const y0 = this.Y(Math.max(this.yr[0], 0)), y1 = this.Y(y);
    ctx.fillStyle = color;
    ctx.fillRect(x0, Math.min(y0, y1), Math.max(1, x1 - x0 - 1), Math.abs(y1 - y0));
  }
  dot(x: number, y: number, color: string, r = 4) {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.X(x), this.Y(y), r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function fmtTick(v: number): string {
  if (Math.abs(v) >= 1000) return `${Math.round(v / 100) / 10}k`;
  return String(Math.round(v * 100) / 100);
}
