// 행렬은 "행의 목록"으로 저장한다(row-major): A[i][j] = i번째 행, j번째 열.
// 그러나 계산은 일부러 "열의 관점"으로 쓴다. 이 교재에서 행렬의 정의가 열(기저의 도착지)이기 때문이다.
import { type Vec, linComb, dot } from './vec';

export type Mat = number[][];

/** def.shape — 모양 (행 개수 m, 열 개수 n). 이 행렬은 ℝⁿ의 벡터를 받아 ℝᵐ의 벡터를 내놓는다. */
export function shape(A: Mat): [m: number, n: number] {
  return [A.length, A[0]?.length ?? 0];
}

/** def.matrix — j번째 열 = j번째 표준 기저 벡터 eⱼ가 도착하는 자리. */
export function col(A: Mat, j: number): Vec {
  return A.map((row) => row[j]);
}

/** i번째 행. prop.row-picture 에서 쓴다. */
export function row(A: Mat, i: number): Vec {
  return A[i].slice();
}

/** 열 벡터들을 나란히 세워 행렬을 만든다. def.matrix 의 정의를 그대로 코드로 옮긴 것. */
export function fromCols(cols: Vec[]): Mat {
  const m = cols[0].length;
  const A: Mat = [];
  for (let i = 0; i < m; i++) A.push(cols.map((c) => c[i]));
  return A;
}

/**
 * def.matvec — 행렬-벡터 곱의 "정의": Ax = x₁a₁ + x₂a₂ + … + xₙaₙ
 * (x의 성분을 계수로 삼아 A의 열들을 선형 결합한다.)
 */
export function matVec(A: Mat, x: Vec): Vec {
  const [, n] = shape(A);
  if (x.length !== n) throw new Error(`모양 불일치: A는 ${n}개 성분을 받는데 x는 ${x.length}개`);
  const cols: Vec[] = [];
  for (let j = 0; j < n; j++) cols.push(col(A, j));
  return linComb(x, cols);
}

/**
 * prop.row-picture — 같은 결과를 "행의 관점"으로 계산한다: (Ax)ᵢ = (i번째 행)·x
 * matVec 와 결과가 항상 같아야 한다(테스트가 이를 확인한다).
 */
export function matVecRows(A: Mat, x: Vec): Vec {
  return A.map((r) => dot(r, x));
}

/**
 * def.composition — 행렬 곱 AB = "B를 먼저, 그다음 A"를 한 번에 하는 변환.
 * prop.matmul-columns: AB의 j번째 열 = A(B의 j번째 열).
 */
export function matMul(A: Mat, B: Mat): Mat {
  const [, nA] = shape(A);
  const [mB, nB] = shape(B);
  if (nA !== mB) throw new Error(`모양 불일치: A는 ${nA}개 성분을 받는데 B는 ${mB}개 성분을 내놓는다`);
  const cols: Vec[] = [];
  for (let j = 0; j < nB; j++) cols.push(matVec(A, col(B, j)));
  return fromCols(cols);
}

/** def.identity — 항등 행렬: 모든 벡터를 제자리에 둔다. 열 = 표준 기저 그대로. */
export function identity(n: number): Mat {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
}

/** def.transpose — 전치: 행과 열을 맞바꾼다. (Aᵀ)ᵢⱼ = Aⱼᵢ */
export function transpose(A: Mat): Mat {
  const [m, n] = shape(A);
  const T: Mat = [];
  for (let j = 0; j < n; j++) {
    const r: number[] = [];
    for (let i = 0; i < m; i++) r.push(A[i][j]);
    T.push(r);
  }
  return T;
}

export function matAdd(A: Mat, B: Mat): Mat {
  return A.map((r, i) => r.map((v, j) => v + B[i][j]));
}

export function matScale(c: number, A: Mat): Mat {
  return A.map((r) => r.map((v) => c * v));
}

/** prop.det-formula — 2×2 행렬식: ad − bc (부호 있는 넓이 배율). */
export function det2(A: Mat): number {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

/** exp.det-3d — 3×3 행렬식(부호 있는 부피 배율). 첫 행을 따라 펼친 식. */
export function det3(A: Mat): number {
  const [a, b, c] = A[0];
  const [d, e, f] = A[1];
  const [g, h, i] = A[2];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/** prop.inverse-exists — 2×2 역행렬. det = 0 이면 납작해져서 되돌릴 수 없다. */
export function inverse2(A: Mat): Mat {
  const d = det2(A);
  if (Math.abs(d) < 1e-12) throw new Error('행렬식이 0이다: 평면이 납작해져서 되돌릴 수 없다');
  const [[a, b], [c, e]] = A;
  return [
    [e / d, -b / d],
    [-c / d, a / d],
  ];
}

/** def.trace — 대각합: 대각선 성분의 합. */
export function trace(A: Mat): number {
  let s = 0;
  for (let i = 0; i < Math.min(...shape(A)); i++) s += A[i][i];
  return s;
}

/** 회전 행렬 R(θ): e₁ → (cos θ, sin θ), e₂ → (−sin θ, cos θ). exp.gallery 참고. */
export function rotation(theta: number): Mat {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s],
    [s, c],
  ];
}

/** def.outer-product — 바깥곱 u vᵀ: 모양 (len u)×(len v), 계수(rank) 1. */
export function outer(u: Vec, v: Vec): Mat {
  return u.map((ui) => v.map((vj) => ui * vj));
}

/** 프로베니우스 노름: 모든 성분의 제곱합의 제곱근(행렬을 긴 벡터로 보고 잰 길이). */
export function frobenius(A: Mat): number {
  let s = 0;
  for (const r of A) for (const v of r) s += v * v;
  return Math.sqrt(s);
}
