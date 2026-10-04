// 2장(def.transformation, def.linear-map, prop.linear-grid)의 장면이 쓰는 변환들.
// 대부분은 일부러 "선형이 아닌" 변환이다. 선형 변환이 무엇인지는 선형이 아닌 것과 나란히 볼 때 또렷해진다.
import { type Vec, add, scale, norm } from './vec';
import { matVec, rotation, type Mat } from './mat';

export type Map2 = (v: Vec) => Vec;

/** def.transformation — 평행 이동: 모든 점을 같은 벡터 t만큼 옮긴다. 원점도 움직이므로 선형이 아니다. */
export function translateBy(t: Vec): Map2 {
  return (v) => add(v, t);
}

/** def.transformation — 휘기: (x, y) ↦ (x, y + x²/4). 세로선은 곧게 남지만 가로선은 포물선으로 휜다. */
export function bend(v: Vec): Vec {
  return [v[0], v[1] + (v[0] * v[0]) / 4];
}

/**
 * def.transformation — 소용돌이: 원점에서 멀수록 더 많이 돌린다.
 * 벡터 v를 각 k·(v의 길이) 라디안만큼 시계 반대 방향으로 돌린다. 원점은 제자리지만 선형이 아니다.
 */
export function twist(v: Vec, k = 0.3): Vec {
  return matVec(rotation(k * norm(v)), v);
}

/** 행렬이 나타내는 변환 x ↦ Ax (def.matvec). 위의 변환들과 같은 모양의 함수로 쓰기 위한 감싸개. */
export function linearMap(A: Mat): Map2 {
  return (v) => matVec(A, v);
}

/**
 * 장면의 "천천히 움직이기"용: 아무것도 하지 않는 변환에서 T까지 섞는다.
 * F_s(v) = (1 − s)v + s·T(v). s = 0이면 제자리, s = 1이면 T.
 */
export function blendMap(T: Map2, s: number): Map2 {
  return (v) => add(scale(1 - s, v), scale(s, T(v)));
}

/**
 * def.linear-map — 덧셈을 지키는지 재 보기: T(u + w)와 T(u) + T(w)를 함께 돌려준다.
 * 선형 변환이면 두 값이 언제나 같다.
 */
export function additivityPair(T: Map2, u: Vec, w: Vec): { ofSum: Vec; sumOf: Vec } {
  return { ofSum: T(add(u, w)), sumOf: add(T(u), T(w)) };
}

/**
 * def.linear-map — 스칼라 곱을 지키는지 재 보기: T(cv)와 cT(v)를 함께 돌려준다.
 * 선형 변환이면 두 값이 언제나 같다.
 */
export function homogeneityPair(T: Map2, c: number, v: Vec): { ofScaled: Vec; scaledOf: Vec } {
  return { ofScaled: T(scale(c, v)), scaledOf: scale(c, T(v)) };
}
