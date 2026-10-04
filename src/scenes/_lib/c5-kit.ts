// 5–7장 장면이 같이 쓰는 작은 도구: 읽기 칸용 작은 행렬, 그림 두 장 나란히, 직선 그리기.
// (공유 CSS를 고치지 않도록 모양은 인라인 스타일로 준다.)
import type { Mat } from '../../la/mat';
import type { Vec } from '../../la/vec';
import { fmt, el } from '../../ui/widgets';
import { C } from '../../render/colors';
import type { Plane, Style } from '../../render/plane';

/** 읽기 칸에 넣는 작은 행렬(HTML 문자열). colColors면 열마다 주황/청록/보라. */
export function matHtml(M: Mat, o: { colColors?: boolean; color?: string; key?: string } = {}): string {
  const n = M[0]?.length ?? 0;
  const cc = [C.c1, C.c2, C.c3];
  const cells = M.flatMap((r) =>
    r.map((v, j) => `<span style="text-align:center;color:${o.colColors ? cc[j % 3] : (o.color ?? 'inherit')}">${fmt(v)}</span>`),
  ).join('');
  return (
    `<span${o.key ? ` data-sync="${o.key}"` : ''} style="display:inline-grid;grid-template-columns:repeat(${n},auto);column-gap:9px;` +
    `border-left:1.5px solid ${C.dim};border-right:1.5px solid ${C.dim};border-radius:4px;padding:0 6px;vertical-align:middle;line-height:1.35;font-weight:600">${cells}</span>`
  );
}

/** 세로 벡터를 가로로 짧게: (a, b, c) */
export function vecTxt(v: Vec): string {
  return `(${v.map((x) => fmt(x)).join(', ')})`;
}

/** 그림 자리(stage)를 둘로 나눈다. 각 칸 위에 작은 제목을 단다. 좁은 화면에서는 위아래로 쌓인다. */
export function twoStages(stage: HTMLElement, titles: [string, string]): [HTMLElement, HTMLElement] {
  const g = el('div');
  g.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));';
  stage.appendChild(g);
  return titles.map((t, i) => {
    const cell = el('div');
    cell.style.cssText = `position:relative;min-width:0;${i === 1 ? `border-left:1px solid rgba(160,175,200,0.18);` : ''}`;
    const cap = el('div', '', t);
    cap.style.cssText = `position:absolute;left:12px;top:8px;z-index:1;font-size:12.5px;color:${C.dim};pointer-events:none;`;
    cell.appendChild(cap);
    g.appendChild(cell);
    return cell;
  }) as unknown as [HTMLElement, HTMLElement];
}

/**
 * 방정식 r·x = β 가 나타내는 직선을 그린다(행의 관점).
 * r = 0 이면: β = 0 은 평면 전체(그리지 않음), β ≠ 0 은 점 하나도 없음. 그린 경우 true.
 */
export function eqLine(p: Plane, r: Vec, beta: number, st: Style): boolean {
  const rr = r[0] * r[0] + r[1] * r[1];
  if (rr < 1e-12) return false;
  const p0: Vec = [(beta * r[0]) / rr, (beta * r[1]) / rr];
  p.line(p0, [-r[1], r[0]], st);
  return true;
}

export const near = (a: Vec, b: Vec, tol = 1e-6) => a.every((v, i) => Math.abs(v - b[i]) < tol);
export const isIdentity = (M: Mat, tol = 1e-6) => M.every((r, i) => r.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < tol));
