// 1권(벡터) 장면들이 같이 쓰는 작은 도구: 세로 벡터를 읽기 칸에 그리기, 가로로 짧게 적기.
// (공유 CSS를 고치지 않도록 모양은 인라인 스타일로 준다.)
import type { Vec } from '../../la/vec';
import { fmt } from '../../ui/widgets';
import { C } from '../../render/colors';

/** 읽기 칸에 넣는 세로 벡터(HTML 문자열). 성분마다 색을 줄 수 있다. */
export function colHtml(v: Vec, o: { color?: string; colors?: string[]; key?: string } = {}): string {
  const cells = v.map((x, i) => `<span style="text-align:center;color:${o.colors?.[i] ?? o.color ?? 'inherit'}">${fmt(x)}</span>`).join('');
  return (
    `<span${o.key ? ` data-sync="${o.key}"` : ''} style="display:inline-grid;grid-template-columns:auto;` +
    `border-left:1.5px solid ${C.dim};border-right:1.5px solid ${C.dim};border-radius:4px;padding:0 6px;vertical-align:middle;line-height:1.3;font-weight:600">${cells}</span>`
  );
}

/** 세로 벡터를 가로로 짧게: (a, b) */
export function vtxt(v: Vec): string {
  return `(${v.map((x) => fmt(x)).join(', ')})`;
}

/** 0에 아주 가까운지 */
export function near0(x: number, tol = 1e-9): boolean {
  return Math.abs(x) < tol;
}
