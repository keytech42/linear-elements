// 고윳값·고유벡터. 두 가지 길을 둔다.
//  1) eig2: 2×2 일반 행렬. 특성방정식 λ² − (대각합)λ + (행렬식) = 0 을 근의 공식으로 푼다. (prop.char-poly)
//  2) symEig: n×n 대칭 행렬. 야코비(Jacobi) 회전을 되풀이해 대각 행렬로 만든다. (prop.spectral)
import type { Mat } from './mat';
import { trace, det2, identity } from './mat';
import { type Vec, normalize } from './vec';

export type Eig2 =
  | { kind: 'real'; values: [number, number]; vectors: [Vec, Vec] | [Vec]; }
  | { kind: 'complex'; re: number; im: number };

/**
 * prop.char-poly — det(A − λI) = 0 을 풀어 2×2 행렬의 고윳값을 구한다.
 * (A − λI)v = 0 이므로 v는 (A − λI)의 두 행과 모두 수직이다. 그래서 0이 아닌 행 하나를 90° 돌리면 v가 된다.
 */
export function eig2(A: Mat): Eig2 {
  const t = trace(A);
  const d = det2(A);
  const disc = t * t - 4 * d;
  if (disc < -1e-12) return { kind: 'complex', re: t / 2, im: Math.sqrt(-disc) / 2 };
  const r = Math.sqrt(Math.max(disc, 0));
  const l1 = (t + r) / 2;
  const l2 = (t - r) / 2;
  const v1 = eigvecFor(A, l1);
  if (Math.abs(l1 - l2) < 1e-12) {
    // 중근: A = λI 이면 모든 방향이 고유 방향이고, 아니면(예: 전단) 고유 방향이 하나뿐이다.
    const isScalar = Math.abs(A[0][1]) < 1e-12 && Math.abs(A[1][0]) < 1e-12;
    return isScalar
      ? { kind: 'real', values: [l1, l2], vectors: [[1, 0], [0, 1]] }
      : { kind: 'real', values: [l1, l2], vectors: [v1] };
  }
  return { kind: 'real', values: [l1, l2], vectors: [v1, eigvecFor(A, l2)] };
}

function eigvecFor(A: Mat, l: number): Vec {
  const r0: Vec = [A[0][0] - l, A[0][1]];
  const r1: Vec = [A[1][0], A[1][1] - l];
  const n0 = Math.hypot(r0[0], r0[1]);
  const n1 = Math.hypot(r1[0], r1[1]);
  const r = n0 >= n1 ? r0 : r1;
  if (Math.max(n0, n1) < 1e-12) return [1, 0];
  return normalize([-r[1], r[0]]);
}

/**
 * prop.spectral — 대칭 행렬 S의 고유분해 S = Q Λ Qᵀ.
 * 야코비 방법: 비대각 성분 하나를 0으로 만드는 회전을 반복한다. 회전들을 모두 곱한 것이 Q다.
 * 반환: values는 내림차순, vectors[k]는 values[k]의 단위 고유벡터.
 */
export function symEig(S: Mat, tol = 1e-13, maxSweeps = 60): { values: number[]; vectors: Vec[] } {
  const n = S.length;
  const a = S.map((r) => r.slice());
  const Q = identity(n);
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < tol * tol) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        // a[p][q]를 0으로 만드는 회전각 θ: tan 2θ = 2a_pq / (a_qq − a_pp)
        const theta = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]);
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const qkp = Q[k][p];
          const qkq = Q[k][q];
          Q[k][p] = c * qkp - s * qkq;
          Q[k][q] = s * qkp + c * qkq;
        }
      }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[j][j] - a[i][i]);
  return {
    values: order.map((i) => a[i][i]),
    vectors: order.map((i) => Q.map((r) => r[i])),
  };
}
