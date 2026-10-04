// 0권·1권(출발점, 벡터)의 작은 도구들. 각 함수 위 주석의 노드 id가 그 수학적 근거가 있는 자리다.
import { type Vec, linComb } from './vec';
import { fromCols } from './mat';
import { rank } from './solve';

/** def.numberline — 수직선 위에서 p에서 q로 가는 변위(이동): 도착점 − 출발점. */
export function displacement(p: number, q: number): number {
  return q - p;
}

/** def.numberline — 출발점 start에서 이동들을 차례로 이어 붙였을 때의 도착점. 이동 하나하나는 출발점과 무관하다. */
export function chain(start: number, moves: number[]): number {
  let at = start;
  for (const m of moves) at = at + m;
  return at;
}

/** prop.pythagoras — 두 직각변이 a, b인 직각삼각형의 빗변: h² = a² + b² 에서 h = √(a² + b²). */
export function hypotenuse(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

/** def.distance — 두 점 사이의 거리: 가로 차이 Δx와 세로 차이 Δy를 두 직각변으로 보고 피타고라스 정리를 쓴다. */
export function distance(p: Vec, q: Vec): number {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  return hypotenuse(dx, dy);
}

/** def.angle-trig — 단위원 위에서 (1, 0)부터 시계 반대 방향으로 호의 길이 θ만큼 간 점 = (cos θ, sin θ). */
export function circlePoint(theta: number): Vec {
  return [Math.cos(theta), Math.sin(theta)];
}

/** def.angle-trig — 점 p가 (1, 0)에서 시계 반대 방향으로 몇 라디안 돈 자리에 있는가(0 이상 2π 미만). 원점이면 0. */
export function angleOf(p: Vec): number {
  if (p[0] === 0 && p[1] === 0) return 0;
  const a = Math.atan2(p[1], p[0]);
  return a < 0 ? a + 2 * Math.PI : a;
}

/**
 * def.span, def.dimension — 벡터들의 스팬이 몇 차원인가: 0 = 원점 한 점, 1 = 직선, 2 = 평면, 3 = 공간.
 * (6권의 랭크로 센다. 1권에서는 그림으로만 쓴다.)
 */
export function spanDim(vs: Vec[], tol = 1e-9): number {
  if (!vs.length) return 0;
  return rank(fromCols(vs), tol);
}

/**
 * def.span — 평면의 두 벡터 𝐮, 𝐰가 평행한지 가리는 수 u₁w₂ − u₂w₁.
 * 0이면 평행하고(한쪽이 다른 쪽의 스칼라 배이거나 영벡터가 끼어 있고), 0이 아니면 둘이 평면 전체를 스팬한다.
 */
export function cross2(u: Vec, w: Vec): number {
  return u[0] * w[1] - u[1] * w[0];
}

/**
 * def.span — 평행하지 않은 𝐮, 𝐰로 목표 𝐭에 닿는 계수 (c₁, c₂).
 * c₁𝐮 + c₂𝐰 = 𝐭 의 두 식에서 한 미지수를 지워 얻은 공식이다. 평행하면 null.
 */
export function reachCoeffs(u: Vec, w: Vec, t: Vec, tol = 1e-12): [number, number] | null {
  const D = cross2(u, w);
  if (Math.abs(D) < tol) return null;
  return [cross2(t, w) / D, cross2(u, t) / D];
}

/** def.linear-combination — 계수 두 개로 두 벡터를 섞는다(linComb의 2개짜리). */
export function mix2(c1: number, u: Vec, c2: number, w: Vec): Vec {
  return linComb([c1, c2], [u, w]);
}
