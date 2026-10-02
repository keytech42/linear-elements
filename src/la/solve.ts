// 연립방정식과 부분공간 (5권, 6권, 7권).
// 핵심은 가우스 소거 하나다. 행 연산 하나 = 기본 행렬 하나를 왼쪽에 곱하는 일(prop.elimination).
// 랭크, 영공간의 기저, 열공간의 기저, 해의 분류가 모두 이 소거의 결과(피벗)에서 나온다(prop.rank-nullity).
import type { Vec } from './vec';
import { dot, scale, sub, norm } from './vec';
import { shape, col, identity, matVec, type Mat } from './mat';

const TOL = 1e-10;

/** 행 연산 하나. 기본 행렬 E를 왼쪽에 곱하면 같은 일이 일어난다. (번호는 0부터) */
export type RowOp =
  | { kind: 'add'; target: number; source: number; c: number } // target행 += c × source행 (전단)
  | { kind: 'swap'; i: number; j: number } // 두 행 맞바꾸기
  | { kind: 'scale'; i: number; c: number }; // i행 × c (c ≠ 0)

/** prop.elimination — 행 연산 하나를 행렬 하나로: 항등 행렬에 같은 행 연산을 한 것. */
export function elementary(m: number, op: RowOp): Mat {
  const E = identity(m);
  if (op.kind === 'add') E[op.target][op.source] = op.c;
  else if (op.kind === 'swap') {
    E[op.i][op.i] = 0;
    E[op.j][op.j] = 0;
    E[op.i][op.j] = 1;
    E[op.j][op.i] = 1;
  } else E[op.i][op.i] = op.c;
  return E;
}

/** 행 연산을 행렬(과 오른쪽 벡터)에 직접 한다. 결과는 elementary(m, op)를 왼쪽에 곱한 것과 같다(테스트가 확인). */
export function applyRowOp(A: Mat, op: RowOp): Mat {
  const R = A.map((r) => r.slice());
  if (op.kind === 'add') R[op.target] = R[op.target].map((v, k) => v + op.c * A[op.source][k]);
  else if (op.kind === 'swap') [R[op.i], R[op.j]] = [R[op.j], R[op.i]];
  else R[op.i] = R[op.i].map((v) => op.c * v);
  return R;
}

export interface ElimStep {
  op: RowOp;
  /** 이 연산의 기본 행렬 */
  E: Mat;
  /** 연산을 한 뒤의 행렬과 오른쪽 벡터 */
  A: Mat;
  b: Vec;
}

/**
 * prop.elimination — 가우스–조르당 소거를 한 단계씩 기록한다.
 *  1) 앞으로: 왼쪽 열부터, 피벗 아래를 0으로 (피벗이 0이면 아래 행과 맞바꾼다)
 *  2) 뒤로: 아래 피벗부터, 피벗 위를 0으로
 *  3) 피벗을 1로
 * 마지막 단계의 A가 기약 계단꼴(rref)이다.
 */
export function eliminationSteps(A0: Mat, b0?: Vec, tol = TOL): ElimStep[] {
  const [m, n] = shape(A0);
  let A = A0.map((r) => r.slice());
  let b = b0 ? b0.slice() : new Array(m).fill(0);
  const steps: ElimStep[] = [];
  const doOp = (op: RowOp) => {
    const E = elementary(m, op);
    A = applyRowOp(A, op);
    b = matVec(E, b);
    // 반올림 찌꺼기를 지운다(그림에서 0이 −0.00으로 보이지 않도록)
    A = A.map((r) => r.map((v) => (Math.abs(v) < tol ? 0 : v)));
    b = b.map((v) => (Math.abs(v) < tol ? 0 : v));
    steps.push({ op, E, A: A.map((r) => r.slice()), b: b.slice() });
  };
  const pivots: [number, number][] = [];
  let r = 0;
  for (let j = 0; j < n && r < m; j++) {
    let p = -1;
    for (let i = r; i < m; i++)
      if (Math.abs(A[i][j]) > tol) {
        p = i;
        break;
      }
    if (p < 0) continue; // 이 열에는 피벗이 없다(자유 열)
    if (p !== r) doOp({ kind: 'swap', i: r, j: p });
    for (let i = r + 1; i < m; i++) if (Math.abs(A[i][j]) > tol) doOp({ kind: 'add', target: i, source: r, c: -A[i][j] / A[r][j] });
    pivots.push([r, j]);
    r++;
  }
  for (let k = pivots.length - 1; k >= 0; k--) {
    const [pr, pc] = pivots[k];
    for (let i = 0; i < pr; i++) if (Math.abs(A[i][pc]) > tol) doOp({ kind: 'add', target: i, source: pr, c: -A[i][pc] / A[pr][pc] });
  }
  for (const [pr, pc] of pivots) if (Math.abs(A[pr][pc] - 1) > tol) doOp({ kind: 'scale', i: pr, c: 1 / A[pr][pc] });
  return steps;
}

/** prop.elimination — 기약 계단꼴 R과 피벗 열의 번호들. */
export function rref(A: Mat, tol = TOL): { R: Mat; pivots: number[] } {
  const steps = eliminationSteps(A, undefined, tol);
  const R = steps.length ? steps[steps.length - 1].A : A.map((r) => r.map((v) => (Math.abs(v) < tol ? 0 : v)));
  const pivots: number[] = [];
  for (const row of R) {
    const j = row.findIndex((v) => Math.abs(v) > tol);
    if (j >= 0) pivots.push(j);
  }
  return { R, pivots };
}

/** def.rank — 랭크 = 피벗의 개수 = 열공간의 차원 (prop.rank-nullity). */
export function rank(A: Mat, tol = TOL): number {
  return rref(A, tol).pivots.length;
}

/**
 * def.null-space, prop.rank-nullity — 영공간의 기저(특수해).
 * 자유 열 f마다: xf = 1, 다른 자유 성분 = 0 으로 두고, 피벗 성분은 R의 f열에서 부호를 바꿔 읽는다.
 */
export function nullBasis(A: Mat, tol = TOL): Vec[] {
  const [, n] = shape(A);
  const { R, pivots } = rref(A, tol);
  const free = [...Array(n).keys()].filter((j) => !pivots.includes(j));
  return free.map((f) => {
    const x: Vec = new Array(n).fill(0);
    x[f] = 1;
    pivots.forEach((pc, i) => (x[pc] = -R[i][f] + 0)); // + 0: −0을 0으로 (화면에 "−0"이 뜨지 않게)
    return x;
  });
}

/** def.column-space — 열공간의 기저: A의 피벗 열들(소거한 R의 열이 아니라 원래 A의 열). */
export function colBasis(A: Mat, tol = TOL): Vec[] {
  return rref(A, tol).pivots.map((j) => col(A, j));
}

/** prop.row-null-perp — 행공간의 기저: 기약 계단꼴의 0이 아닌 행들. */
export function rowBasis(A: Mat, tol = TOL): Vec[] {
  const { R, pivots } = rref(A, tol);
  return R.slice(0, pivots.length).map((r) => r.slice());
}

export type Solution =
  | { kind: 'unique'; x: Vec }
  | { kind: 'none' }
  /** 해가 무수히 많다: x + (dirs의 선형 결합) 전부 */
  | { kind: 'infinite'; x: Vec; dirs: Vec[] };

/** def.linear-system — Ax = b를 소거로 풀고, 해가 하나 / 없음 / 무수히 많음으로 나눈다. */
export function solve(A: Mat, b: Vec, tol = 1e-9): Solution {
  const [, n] = shape(A);
  const aug = A.map((r, i) => [...r, b[i]]);
  const { R, pivots } = rref(aug, tol);
  if (pivots.includes(n)) return { kind: 'none' }; // 0 = (0이 아닌 수) 꼴의 행이 생겼다
  const x: Vec = new Array(n).fill(0);
  pivots.forEach((pc, i) => (x[pc] = R[i][n]));
  const dirs = nullBasis(A, tol);
  return dirs.length ? { kind: 'infinite', x, dirs } : { kind: 'unique', x };
}

/** n×n 역행렬을 가우스–조르당 소거로 구한다: [A | I] → [I | A⁻¹]. 가역이 아니면 null. */
export function inverse(A: Mat, tol = 1e-10): Mat | null {
  const [m, n] = shape(A);
  if (m !== n) return null;
  const aug = A.map((r, i) => [...r, ...identity(n)[i]]);
  const { R, pivots } = rref(aug, tol);
  for (let j = 0; j < n; j++) if (pivots[j] !== j) return null;
  return R.map((r) => r.slice(n));
}

/** def.change-of-basis — 표준 좌표 v를 새 기저(P의 열)에 대한 좌표 c로: Pc = v 를 푼다. 곧 c = P⁻¹v. */
export function coords(P: Mat, v: Vec): Vec {
  const s = solve(P, v);
  if (s.kind !== 'unique') throw new Error('P의 열이 기저가 아니다');
  return s.x;
}

/** 그림용: 벡터들을 서로 수직인 단위벡터들로 바꾼다(그람–슈미트). 0에 가까운 것은 버린다. */
export function orthonormalize(vs: Vec[], tol = 1e-9): Vec[] {
  const out: Vec[] = [];
  for (const v of vs) {
    let w = v.slice();
    for (const q of out) w = sub(w, scale(dot(q, w), q));
    const L = norm(w);
    if (L > tol) out.push(scale(1 / L, w));
  }
  return out;
}

/** prop.row-null-perp — 정규직교 기저 qs가 생성하는 부분공간 위로 v를 정사영한다: Σ (q·v) q */
export function projectOntoSpan(qs: Vec[], v: Vec): Vec {
  let p: Vec = new Array(v.length).fill(0);
  for (const q of qs) p = p.map((x, i) => x + dot(q, v) * q[i]);
  return p;
}
