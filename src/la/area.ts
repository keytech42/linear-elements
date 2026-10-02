// 넓이와 각을 재는 작은 도구들 (3권·4권 장면이 쓴다).
import { type Vec, dot, norm } from './vec';

/**
 * prop.det-uniform — 다각형의 부호 있는 넓이(신발끈 공식).
 * 꼭짓점을 시계 반대 방향으로 돌면 양수, 시계 방향으로 돌면 음수다.
 * 원점과 이웃한 두 꼭짓점이 만드는 삼각형들의 부호 있는 넓이를 모두 더한 것이다.
 * 각 삼각형의 부호 있는 넓이는 2×2 행렬식의 절반: (p₁q₂ − p₂q₁) / 2.
 */
export function polygonArea(pts: Vec[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    s += p[0] * q[1] - p[1] * q[0];
  }
  return s / 2;
}

/** 점 q가 다각형 pts 안에 있는가(짝홀 규칙). prop.det-uniform 장면에서 도형 안의 작은 정사각형을 셀 때 쓴다. */
export function insidePolygon(q: Vec, pts: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > q[1] !== yj > q[1] && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** prop.dot-geometric — 두 벡터 사이 각의 코사인: u·v / (‖u‖‖v‖). 영벡터가 끼면 각이 없으므로 NaN. */
export function cosBetween(u: Vec, v: Vec): number {
  const d = norm(u) * norm(v);
  if (d === 0) return NaN;
  return Math.max(-1, Math.min(1, dot(u, v) / d));
}

/** 두 벡터 사이의 각(라디안, 0 이상 π 이하). */
export function angleBetween(u: Vec, v: Vec): number {
  return Math.acos(cosBetween(u, v));
}
