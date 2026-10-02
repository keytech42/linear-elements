// 특이값 분해 A = U Σ Vᵀ.
//  svd2   — 2×2 전용. 교재의 증명(prop.svd-ata)을 그대로 따른다: AᵀA의 고유벡터가 V, 고윳값의 제곱근이 σ.
//  svd    — m×n 일반. 한쪽 야코비(one-sided Jacobi, Hestenes) 방법. 열 두 개씩 골라 서로 수직이 되도록 돌린다.
import type { Mat } from './mat';
import { transpose, matMul, matVec, fromCols } from './mat';
import { type Vec, scale, norm, dot, sub, perp2 } from './vec';
import { symEig } from './eig';

export interface SVD {
  U: Mat; // m×k, 열 = 왼쪽 특이벡터 u₁…u_k (도착 공간의 방향)
  S: number[]; // k개, 내림차순, σ₁ ≥ σ₂ ≥ … ≥ 0
  V: Mat; // n×k, 열 = 오른쪽 특이벡터 v₁…v_k (출발 공간의 방향)
}

/**
 * prop.svd-ata — 2×2 SVD를 증명 순서 그대로 계산한다.
 *  1. AᵀA는 대칭이다 → 스펙트럼 정리로 수직인 고유벡터 v₁, v₂를 얻는다.
 *  2. ‖Avᵢ‖² = vᵢᵀAᵀAvᵢ = λᵢ  → σᵢ = √λᵢ
 *  3. uᵢ = Avᵢ / σᵢ  (σᵢ = 0 이면 u₁에 수직인 방향으로 채운다)
 * V가 회전(det V = +1)이 되도록 부호를 맞춘다. 그래서 "회전 → 늘림 → 회전/반사" 애니메이션이 자연스럽다.
 */
export function svd2(A: Mat): SVD {
  const { values, vectors } = symEig(matMul(transpose(A), A));
  let v1 = vectors[0];
  let v2 = vectors[1];
  if (v1[0] * v2[1] - v1[1] * v2[0] < 0) v2 = scale(-1, v2);
  const s1 = Math.sqrt(Math.max(values[0], 0));
  const s2 = Math.sqrt(Math.max(values[1], 0));
  const eps = 1e-10 * Math.max(1, s1);
  let u1: Vec, u2: Vec;
  if (s1 < eps) {
    u1 = [1, 0];
    u2 = [0, 1];
  } else {
    u1 = scale(1 / s1, matVec(A, v1));
    if (s2 < eps) {
      // 납작해진 경우: 도착 공간의 둘째 방향은 무엇이든 u₁에 수직이기만 하면 된다.
      // det(A)의 부호와 무관하게 U를 회전으로 고른다.
      u2 = perp2(u1);
    } else {
      u2 = scale(1 / s2, matVec(A, v2));
    }
  }
  return { U: fromCols([u1, u2]), S: [s1, s2], V: fromCols([v1, v2]) };
}

/**
 * 한쪽 야코비 SVD (얇은 SVD, k = min(m, n)).
 * 생각의 흐름: A에 오른쪽에서 회전을 곱하면(AJ) 열들이 섞인다. 열 i, j가 서로 수직이 되는 회전을 고르고,
 * 모든 열 쌍이 수직이 될 때까지 반복한다. 그러면 AV = [σ₁u₁ … σₖuₖ] 이고 V는 회전들의 곱이다.
 */
export function svd(A: Mat, tol = 1e-12, maxSweeps = 80): SVD {
  const m = A.length;
  const n = A[0].length;
  if (m < n) {
    // 가로로 긴 행렬은 전치해서 풀고 U, V를 맞바꾼다: Aᵀ = V Σ Uᵀ
    const r = svd(transpose(A), tol, maxSweeps);
    return { U: r.V, S: r.S, V: r.U };
  }
  // 열 우선 배열(열 j = W[j])로 다룬다. 계산이 전부 "열 두 개"에 대한 것이기 때문이다.
  const W: Float64Array[] = [];
  const Vc: Float64Array[] = [];
  for (let j = 0; j < n; j++) {
    const c = new Float64Array(m);
    for (let i = 0; i < m; i++) c[i] = A[i][j];
    W.push(c);
    const e = new Float64Array(n);
    e[j] = 1;
    Vc.push(e);
  }
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let rotated = false;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const wp = W[p];
        const wq = W[q];
        let alpha = 0, beta = 0, gamma = 0;
        for (let i = 0; i < m; i++) {
          alpha += wp[i] * wp[i];
          beta += wq[i] * wq[i];
          gamma += wp[i] * wq[i];
        }
        if (Math.abs(gamma) <= tol * Math.sqrt(alpha * beta) || gamma === 0) continue;
        rotated = true;
        const zeta = (beta - alpha) / (2 * gamma);
        const t = Math.sign(zeta || 1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = c * t;
        for (let i = 0; i < m; i++) {
          const a = wp[i], b = wq[i];
          wp[i] = c * a - s * b;
          wq[i] = s * a + c * b;
        }
        const vp = Vc[p], vq = Vc[q];
        for (let i = 0; i < n; i++) {
          const a = vp[i], b = vq[i];
          vp[i] = c * a - s * b;
          vq[i] = s * a + c * b;
        }
      }
    }
    if (!rotated) break;
  }
  const sig = W.map((w) => Math.sqrt(w.reduce((s, x) => s + x * x, 0)));
  const order = sig.map((_, i) => i).sort((i, j) => sig[j] - sig[i]);
  const S = order.map((i) => sig[i]);
  const cutoff = 1e-12 * Math.max(1, S[0] ?? 0);
  const ucols: Vec[] = [];
  for (const i of order) {
    if (sig[i] > cutoff) ucols.push(Array.from(W[i], (x) => x / sig[i]));
    else ucols.push(completeOrthonormal(ucols, m));
  }
  const vcols: Vec[] = order.map((i) => Array.from(Vc[i]));
  return { U: fromCols(ucols), S, V: fromCols(vcols) };
}

/** 이미 있는 정규직교 벡터들에 수직인 단위벡터 하나를 표준 기저에서 그람-슈미트로 만든다. */
function completeOrthonormal(basis: Vec[], m: number): Vec {
  let best: Vec = new Array(m).fill(0);
  let bestNorm = -1;
  for (let k = 0; k < m; k++) {
    let v: Vec = new Array(m).fill(0);
    v[k] = 1;
    for (const b of basis) v = sub(v, scale(dot(b, v), b));
    const nv = norm(v);
    if (nv > bestNorm) {
      best = v;
      bestNorm = nv;
    }
  }
  return scale(1 / bestNorm, best);
}

/**
 * prop.svd-sum / prop.eckart-young — 앞의 k개 층만 더한 근사: A_k = Σ_{i<k} σᵢ uᵢ vᵢᵀ
 * 결과를 평평한 배열(행 우선)로 돌려준다. 이미지 슬라이더가 프레임마다 부르므로 할당을 줄였다.
 */
export function lowRankInto(out: Float64Array, r: SVD, k: number, m: number, n: number): void {
  out.fill(0);
  for (let l = 0; l < k; l++) {
    const s = r.S[l];
    if (s === 0) continue;
    for (let i = 0; i < m; i++) {
      const su = s * r.U[i][l];
      if (su === 0) continue;
      const base = i * n;
      for (let j = 0; j < n; j++) out[base + j] += su * r.V[j][l];
    }
  }
}
