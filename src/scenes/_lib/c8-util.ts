// 8장 장면 공용 도우미.
//  - eigenDirs: eig2(src/la/eig.ts)의 결과를 장면이 쓰기 좋은 모양(고유 방향 목록)으로 정리한다.
//  - plotMap / plotLines: Plane 위에 가로·세로 배율이 다른 작은 그래프를 그린다.
//    (Plane은 가로·세로 1단위를 같은 픽셀로 그리므로, 그래프 좌표를 Plane 좌표로 옮기는 지도가 필요하다.)
//  - PRESETS: 8장 장면들이 함께 쓰는 보기 행렬.
import type { Plane } from '../../render/plane';
import type { Mat } from '../../la/mat';
import type { Vec } from '../../la/vec';
import { eig2 } from '../../la/eig';
import { C } from '../../render/colors';

export type EigenInfo =
  | { kind: 'two'; values: [number, number]; dirs: [Vec, Vec] } // 서로 다른 두 고유 방향
  | { kind: 'all'; values: [number, number]; dirs: [Vec, Vec] } // A = λI: 모든 방향 (대표로 e₁, e₂)
  | { kind: 'one'; values: [number, number]; dirs: [Vec] } // 중근인데 고유 방향이 하나뿐 (전단류)
  | { kind: 'none'; re: number; im: number }; // 실수 고윳값 없음

/** 방향의 부호를 하나로 정한다: 각이 (−90°, 90°] 에 오도록. 같은 직선이므로 고유벡터임은 변하지 않는다. */
export function canonical(v: Vec): Vec {
  return v[0] < -1e-12 || (Math.abs(v[0]) <= 1e-12 && v[1] < 0) ? [-v[0], -v[1]] : [v[0], v[1]];
}

export function eigenDirs(A: Mat): EigenInfo {
  const e = eig2(A);
  if (e.kind === 'complex') return { kind: 'none', re: e.re, im: e.im };
  if (e.vectors.length === 1) return { kind: 'one', values: e.values, dirs: [canonical(e.vectors[0])] };
  const all = Math.abs(e.values[0] - e.values[1]) < 1e-12;
  return { kind: all ? 'all' : 'two', values: e.values, dirs: [canonical(e.vectors[0]), canonical(e.vectors[1] as Vec)] };
}

export const clone = (A: Mat): Mat => A.map((r) => r.slice());
export const deg = (rad: number) => (rad * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;

export interface PlotMap {
  to(x: number, y: number): Vec;
  /** Plane 좌표의 가로 성분 → 그래프의 x */
  invX(px: number): number;
  xr: [number, number];
  yr: [number, number];
}

/** 그래프 범위 xr × yr 를 Plane의 보이는 영역(여백 px 제외)에 맞춘다. */
export function plotMap(p: Plane, xr: [number, number], yr: [number, number], pad = { l: 44, r: 14, t: 14, b: 22 }): PlotMap {
  const b = p.bounds;
  const u = p.unit || 1;
  const X0 = b.x0 + pad.l / u, X1 = b.x1 - pad.r / u;
  const Y0 = b.y0 + pad.b / u, Y1 = b.y1 - pad.t / u;
  const sx = (X1 - X0) / (xr[1] - xr[0] || 1);
  const sy = (Y1 - Y0) / (yr[1] - yr[0] || 1);
  return {
    to: (x, y) => [X0 + (x - xr[0]) * sx, Y0 + (y - yr[0]) * sy],
    invX: (px) => xr[0] + (px - X0) / sx,
    xr,
    yr,
  };
}

/**
 * 표본점 (x, y) 목록을 꺾은선으로 그린다. y가 null이거나 범위를 벗어나거나, 이웃한 두 점의 y 차이가 jump보다 크면 선을 끊는다.
 */
export function plotLines(
  p: Plane,
  m: PlotMap,
  pts: { x: number; y: number | null }[],
  st: { color?: string; width?: number; dash?: number[]; key?: string; alpha?: number },
  jump = Infinity,
) {
  const [y0, y1] = m.yr;
  const runs: Vec[][] = [];
  let cur: Vec[] = [];
  let prev: number | null = null;
  for (const q of pts) {
    const ok = q.y !== null && q.y >= y0 - 1e-9 && q.y <= y1 + 1e-9;
    if (!ok || (prev !== null && Math.abs(q.y! - prev) > jump)) {
      if (cur.length > 1) runs.push(cur);
      cur = [];
    }
    if (ok) cur.push(m.to(q.x, q.y!));
    prev = ok ? q.y : null;
  }
  if (cur.length > 1) runs.push(cur);
  for (const r of runs) p.curve((t) => r[Math.round(t)], 0, r.length - 1, r.length - 1, st);
}

/** 그래프 틀: 가로축(y = 0) 또는 아래 경계, 눈금과 이름 */
export function plotFrame(
  p: Plane,
  m: PlotMap,
  o: { xticks: number[]; yticks: number[]; xfmt?: (v: number) => string; yfmt?: (v: number) => string; color: string; axisColor: string },
) {
  const [x0, x1] = m.xr, [y0, y1] = m.yr;
  for (const t of o.yticks) {
    p.seg(m.to(x0, t), m.to(x1, t), { color: t === 0 ? o.axisColor : o.color, width: 1 });
    p.text(m.to(x0, t), (o.yfmt ?? String)(t), { color: C.dim, dx: -6, align: 'right', size: 11 });
  }
  for (const t of o.xticks) {
    const base = y0 <= 0 && y1 >= 0 ? 0 : y0;
    p.seg(m.to(t, y0), m.to(t, y1), { color: o.color, width: 1 });
    p.text(m.to(t, base), (o.xfmt ?? String)(t), { color: C.dim, dy: 10, align: 'center', size: 11 });
  }
}

export const PRESETS: { label: string; A: Mat; title: string }[] = [
  { label: '대칭', A: [[2, 1], [1, 2]], title: '고유 방향 둘, 서로 수직 (λ = 3, 1)' },
  { label: '위삼각', A: [[3, 1], [0, 2]], title: '고유 방향 둘, 수직이 아님 (λ = 3, 2)' },
  { label: '뒤집힘', A: [[1, 2], [2, 1]], title: '음수 고윳값 (λ = 3, −1)' },
  { label: '납작', A: [[1, 2], [2, 4]], title: '고윳값 0 (λ = 5, 0)' },
  { label: '전단', A: [[1, 1], [0, 1]], title: '중근, 고유 방향 하나뿐 (λ = 1)' },
  { label: '회전 90°', A: [[0, -1], [1, 0]], title: '실수 고윳값 없음' },
  { label: '2I', A: [[2, 0], [0, 2]], title: '모든 방향이 고유 방향 (λ = 2)' },
];
