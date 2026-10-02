// 수치 코어 검증. 원칙: "공식 ↔ 코드" 동기화를 주장하려면 성질(property)로 확인해야 한다.
// ml-matrix는 개발 의존성으로만 두고, 정답을 판정하는 심판(oracle)으로만 쓴다.
import { describe, it, expect } from 'vitest';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';
import { matVec, matVecRows, matMul, transpose, det2, det3, inverse2, identity, rotation, outer, frobenius, matAdd, matScale, type Mat } from './mat';
import { dot, norm } from './vec';
import { eig2, symEig } from './eig';
import { svd2, svd, lowRankInto } from './svd';

// 재현 가능한 의사 난수 (mulberry32)
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(42);
const rand = (m: number, n: number): Mat => Array.from({ length: m }, () => Array.from({ length: n }, () => R() * 4 - 2));
const close = (A: Mat, B: Mat, tol = 1e-9) => expect(frobenius(matAdd(A, matScale(-1, B)))).toBeLessThan(tol);
const diag = (s: number[]): Mat => s.map((v, i) => s.map((_, j) => (i === j ? v : 0)));

describe('행렬-벡터 곱: 열의 관점 = 행의 관점 (prop.row-picture)', () => {
  it('무작위 100개', () => {
    for (let t = 0; t < 100; t++) {
      const m = 1 + Math.floor(R() * 4), n = 1 + Math.floor(R() * 4);
      const A = rand(m, n), x = rand(1, n)[0];
      const a = matVec(A, x), b = matVecRows(A, x);
      a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 12));
    }
  });
});

describe('행렬 곱 = 합성 (def.composition)', () => {
  it('(AB)x = A(Bx)', () => {
    for (let t = 0; t < 50; t++) {
      const A = rand(3, 2), B = rand(2, 4), x = rand(1, 4)[0];
      const l = matVec(matMul(A, B), x), r = matVec(A, matVec(B, x));
      l.forEach((v, i) => expect(v).toBeCloseTo(r[i], 12));
    }
  });
  it('오라클과 일치', () => {
    const A = rand(3, 5), B = rand(5, 2);
    close(matMul(A, B), new Matrix(A).mmul(new Matrix(B)).to2DArray());
  });
  it('(AB)ᵀ = BᵀAᵀ', () => {
    const A = rand(3, 2), B = rand(2, 4);
    close(transpose(matMul(A, B)), matMul(transpose(B), transpose(A)));
  });
});

describe('전치와 내적 (prop.transpose-adjoint)', () => {
  it('(Ax)·y = x·(Aᵀy)', () => {
    for (let t = 0; t < 50; t++) {
      const A = rand(3, 2), x = rand(1, 2)[0], y = rand(1, 3)[0];
      expect(dot(matVec(A, x), y)).toBeCloseTo(dot(x, matVec(transpose(A), y)), 12);
    }
  });
});

describe('행렬식', () => {
  it('det(AB) = det A · det B (prop.det-product)', () => {
    for (let t = 0; t < 50; t++) {
      const A = rand(2, 2), B = rand(2, 2);
      expect(det2(matMul(A, B))).toBeCloseTo(det2(A) * det2(B), 10);
      const C = rand(3, 3), D = rand(3, 3);
      expect(det3(matMul(C, D))).toBeCloseTo(det3(C) * det3(D), 9);
    }
  });
  it('회전은 넓이를 바꾸지 않는다', () => expect(det2(rotation(0.7))).toBeCloseTo(1, 14));
  it('역행렬: A A⁻¹ = I', () => close(matMul([[2, 1], [1, 3]], inverse2([[2, 1], [1, 3]])), identity(2)));
});

describe('고윳값 (prop.char-poly)', () => {
  it('Av = λv', () => {
    for (let t = 0; t < 100; t++) {
      const A = rand(2, 2);
      const e = eig2(A);
      if (e.kind !== 'real') continue;
      e.vectors.forEach((v, k) => {
        const Av = matVec(A, v);
        Av.forEach((x, i) => expect(x).toBeCloseTo(e.values[k] * v[i], 9));
      });
    }
  });
  it('회전은 실수 고유벡터가 없다 (prop.no-real-eigen)', () => expect(eig2(rotation(1)).kind).toBe('complex'));
  it('전단은 고유 방향이 하나뿐이다', () => {
    const e = eig2([[1, 1], [0, 1]]);
    expect(e.kind === 'real' && e.vectors.length).toBe(1);
  });
  it('대칭 야코비: S = QΛQᵀ, Q는 직교 (prop.spectral)', () => {
    for (const n of [2, 3, 5]) {
      const B = rand(n, n);
      const S = matAdd(B, transpose(B));
      const { values, vectors } = symEig(S);
      const Q = transpose(vectors); // 열 = 고유벡터
      close(matMul(transpose(Q), Q), identity(n), 1e-10);
      close(matMul(matMul(Q, diag(values)), transpose(Q)), S, 1e-9);
      for (let i = 1; i < n; i++) expect(values[i - 1]).toBeGreaterThanOrEqual(values[i]);
    }
  });
});

describe('SVD', () => {
  const check = (A: Mat, r: ReturnType<typeof svd>) => {
    close(matMul(matMul(r.U, diag(r.S)), transpose(r.V)), A, 1e-9);
    close(matMul(transpose(r.U), r.U), identity(r.S.length), 1e-9);
    close(matMul(transpose(r.V), r.V), identity(r.S.length), 1e-9);
    for (let i = 1; i < r.S.length; i++) expect(r.S[i - 1]).toBeGreaterThanOrEqual(r.S[i] - 1e-12);
  };
  it('svd2: 무작위 + 퇴화(rank 1, 0, 회전, 반사)', () => {
    const cases: Mat[] = [...Array.from({ length: 50 }, () => rand(2, 2)), [[1, 2], [2, 4]], [[0, 0], [0, 0]], rotation(0.3), [[1, 0], [0, -1]], [[3, 0], [0, 3]]];
    for (const A of cases) {
      const r = svd2(A);
      check(A, r);
      expect(det2(r.V)).toBeCloseTo(1, 9); // V는 회전으로 고정
    }
  });
  it('svd: 직사각 행렬, 오라클과 특이값 일치', () => {
    for (const [m, n] of [[5, 3], [3, 5], [8, 8], [40, 25]]) {
      const A = rand(m, n);
      const r = svd(A);
      check(A, r);
      const oracle = new SingularValueDecomposition(new Matrix(A)).diagonal;
      r.S.forEach((s, i) => expect(s).toBeCloseTo(oracle[i], 8));
    }
  });
  it('svd: 계수 부족(rank 2인 6×4)', () => {
    const A = matMul(rand(6, 2), rand(2, 4));
    const r = svd(A);
    check(A, r);
    expect(r.S[2]).toBeLessThan(1e-10);
  });
  it('Eckart–Young: rank-k 오차의 프로베니우스 노름² = 버린 σ²의 합', () => {
    const m = 12, n = 9, A = rand(m, n), r = svd(A);
    const out = new Float64Array(m * n);
    for (let k = 0; k <= n; k++) {
      lowRankInto(out, r, k, m, n);
      let err = 0;
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) err += (A[i][j] - out[i * n + j]) ** 2;
      const tail = r.S.slice(k).reduce((s, x) => s + x * x, 0);
      expect(err).toBeCloseTo(tail, 8);
    }
  });
  it('σ₁ = 단위원 위에서 가장 많이 늘어난 길이', () => {
    const A = rand(2, 2), r = svd2(A);
    let best = 0;
    for (let k = 0; k < 20000; k++) {
      const th = (k / 20000) * 2 * Math.PI;
      best = Math.max(best, norm(matVec(A, [Math.cos(th), Math.sin(th)])));
    }
    expect(best).toBeCloseTo(r.S[0], 6);
  });
  it('바깥곱은 계수 1', () => {
    const r = svd(outer([1, 2, 3], [4, 5]));
    expect(r.S[1]).toBeLessThan(1e-12);
  });
});
