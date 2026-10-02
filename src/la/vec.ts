// 벡터 = 숫자 n개의 순서 있는 목록. 이 파일의 함수들은 [정의]와 한 줄씩 대응하도록 썼다.
// 각 함수 위 주석의 노드 id(def.…, prop.…)가 그 수학적 근거가 있는 자리다.

export type Vec = number[];

/** def.vector-add — 벡터 덧셈: 같은 자리 성분끼리 더한다 (prop.add-componentwise). */
export function add(u: Vec, v: Vec): Vec {
  if (u.length !== v.length) throw new Error(`차원이 다르다: ${u.length} vs ${v.length}`);
  const out: Vec = new Array(u.length);
  for (let i = 0; i < u.length; i++) out[i] = u[i] + v[i];
  return out;
}

/** u − v = u + (−1)v */
export function sub(u: Vec, v: Vec): Vec {
  return add(u, scale(-1, v));
}

/** def.scalar-mul — 스칼라 곱: 모든 성분에 같은 수 c를 곱한다. */
export function scale(c: number, v: Vec): Vec {
  const out: Vec = new Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = c * v[i];
  return out;
}

/** def.linear-combination — 선형 결합: c₁v₁ + c₂v₂ + … */
export function linComb(coeffs: number[], vectors: Vec[]): Vec {
  if (coeffs.length !== vectors.length) throw new Error('계수 개수와 벡터 개수가 다르다');
  let acc: Vec = new Array(vectors[0].length).fill(0);
  for (let k = 0; k < vectors.length; k++) acc = add(acc, scale(coeffs[k], vectors[k]));
  return acc;
}

/** def.dot — 내적: 같은 자리 성분끼리 곱해서 모두 더한다. */
export function dot(u: Vec, v: Vec): number {
  if (u.length !== v.length) throw new Error(`차원이 다르다: ${u.length} vs ${v.length}`);
  let s = 0;
  for (let i = 0; i < u.length; i++) s += u[i] * v[i];
  return s;
}

/** def.norm — 길이: 피타고라스 정리를 n개 성분으로 늘린 것. ‖v‖ = √(v·v) */
export function norm(v: Vec): number {
  return Math.sqrt(dot(v, v));
}

/** 길이를 1로 맞춘다(방향만 남긴다). 영벡터는 방향이 없으므로 거부한다. */
export function normalize(v: Vec): Vec {
  const n = norm(v);
  if (n === 0) throw new Error('영벡터는 방향이 없어 정규화할 수 없다');
  return scale(1 / n, v);
}

/** prop.projection-length — b를 a 방향 직선 위로 정사영한 벡터: (a·b / a·a) a */
export function project(b: Vec, a: Vec): Vec {
  return scale(dot(a, b) / dot(a, a), a);
}

/** 2D 전용: 시계 반대 방향으로 90° 돌린 벡터. 직교 보완을 만들 때 쓴다. */
export function perp2(v: Vec): Vec {
  return [-v[1], v[0]];
}
