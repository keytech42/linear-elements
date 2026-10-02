// 소거, 랭크, 영공간, 해의 분류 검증 (5–7권). ml-matrix는 심판으로만 쓴다.
import { describe, it, expect } from 'vitest';
import { Matrix, inverse as mlInverse } from 'ml-matrix';
import { matMul, matVec, identity, transpose, det2, det3, frobenius, matAdd, matScale, type Mat } from './mat';
import { dot } from './vec';
import { elementary, applyRowOp, eliminationSteps, rank, nullBasis, colBasis, rowBasis, solve, inverse, coords, orthonormalize, projectOntoSpan, type RowOp } from './solve';

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(7);
const rand = (m: number, n: number): Mat => Array.from({ length: m }, () => Array.from({ length: n }, () => Math.round((R() * 6 - 3) * 2) / 2));
const close = (A: Mat, B: Mat, tol = 1e-9) => expect(frobenius(matAdd(A, matScale(-1, B)))).toBeLessThan(tol);
const zero = (v: number[], tol = 1e-9) => v.forEach((x) => expect(Math.abs(x)).toBeLessThan(tol));

describe('행 연산 = 기본 행렬 곱 (prop.elimination)', () => {
  it('세 종류 모두', () => {
    const A = rand(3, 4);
    const ops: RowOp[] = [
      { kind: 'add', target: 2, source: 0, c: -1.5 },
      { kind: 'swap', i: 0, j: 2 },
      { kind: 'scale', i: 1, c: 3 },
    ];
    for (const op of ops) close(applyRowOp(A, op), matMul(elementary(3, op), A));
  });
  it('전단의 행렬식은 1, 맞바꿈은 −1, 늘림은 c', () => {
    expect(det2(elementary(2, { kind: 'add', target: 1, source: 0, c: 5 }))).toBe(1);
    expect(det2(elementary(2, { kind: 'swap', i: 0, j: 1 }))).toBe(-1);
    expect(det3(elementary(3, { kind: 'scale', i: 2, c: 4 }))).toBe(4);
  });
  it('기본 행렬들을 모두 곱하면 A⁻¹ (가역일 때)', () => {
    for (let t = 0; t < 30; t++) {
      const A = rand(3, 3);
      if (Math.abs(det3(A)) < 1e-6) continue;
      const steps = eliminationSteps(A);
      let E = identity(3);
      for (const s of steps) E = matMul(s.E, E);
      close(matMul(E, A), identity(3));
      close(E, mlInverse(new Matrix(A)).to2DArray(), 1e-8);
    }
  });
  it('본문의 예: 2x₁ + x₂ = 5, x₁ − x₂ = 1', () => {
    const steps = eliminationSteps([[2, 1], [1, -1]], [5, 1]);
    expect(steps[0].op).toEqual({ kind: 'add', target: 1, source: 0, c: -0.5 });
    expect(steps[0].A).toEqual([[2, 1], [0, -1.5]]);
    expect(steps[steps.length - 1].b).toEqual([2, 1]);
  });
  it('본문의 예: 피벗이 0이면 맞바꾼다', () => {
    const steps = eliminationSteps([[0, 2], [3, 1]], [4, 5]);
    expect(steps[0].op.kind).toBe('swap');
    const last = steps[steps.length - 1];
    last.b.forEach((v, i) => expect(v).toBeCloseTo([1, 2][i], 12));
  });
});

describe('랭크, 영공간, 열공간 (prop.rank-nullity)', () => {
  it('n = rank + dim N(A), 그리고 영공간 벡터는 정말 0으로 간다', () => {
    for (let t = 0; t < 60; t++) {
      const m = 1 + Math.floor(R() * 4), n = 1 + Math.floor(R() * 4), k = 1 + Math.floor(R() * 3);
      // 일부러 랭크가 모자란 행렬도 만든다
      const A = t % 2 ? rand(m, n) : matMul(rand(m, k), rand(k, n));
      const N = nullBasis(A);
      expect(rank(A) + N.length).toBe(n);
      for (const x of N) zero(matVec(A, x));
      const oracle = new Matrix(A).transpose().mmul(new Matrix(A));
      void oracle;
    }
  });
  it('랭크는 오라클(특이값 개수)과 같다', () => {
    for (let t = 0; t < 40; t++) {
      const A = matMul(rand(4, 2), rand(2, 3));
      const s = new Matrix(A).transpose().mmul(new Matrix(A));
      const ev = new (require('ml-matrix').EigenvalueDecomposition)(s).realEigenvalues as number[];
      expect(rank(A)).toBe(ev.filter((x) => x > 1e-8).length);
    }
  });
  it('행 랭크 = 열 랭크, 행공간 ⟂ 영공간 (prop.row-null-perp)', () => {
    for (let t = 0; t < 40; t++) {
      const A = matMul(rand(3, 2), rand(2, 3));
      expect(rank(A)).toBe(rank(transpose(A)));
      expect(rowBasis(A).length).toBe(colBasis(A).length);
      for (const r of rowBasis(A)) for (const x of nullBasis(A)) expect(dot(r, x)).toBeCloseTo(0, 9);
    }
  });
  it('본문의 예들', () => {
    expect(rank([[1, 2], [2, 4]])).toBe(1);
    expect(nullBasis([[1, 2], [2, 4]])).toEqual([[-2, 1]]);
    expect(rank([[1, 0, 1], [0, 1, 1], [0, 0, 0]])).toBe(2);
    expect(nullBasis([[1, 0, 1], [0, 1, 1], [0, 0, 0]])).toEqual([[-1, -1, 1]]);
    expect(rank([[1, 2, 3], [2, 4, 6], [1, 2, 3]])).toBe(1);
    expect(nullBasis([[1, 2, 3], [2, 4, 6], [1, 2, 3]]).length).toBe(2);
    const F = [[1, 2, 3], [2, 4, 6], [1, 1, 1]];
    expect(rank(F)).toBe(2);
    expect(nullBasis(F)).toEqual([[1, -2, 1]]);
    expect(nullBasis(transpose(F))).toEqual([[-2, 1, 0]]);
    expect(nullBasis([[1, 0, 2], [0, 1, 3]])).toEqual([[-2, -3, 1]]);
  });
});

describe('연립방정식의 해 (def.linear-system)', () => {
  it('하나 / 없음 / 무수히', () => {
    const u = solve([[2, 1], [1, -1]], [5, 1]);
    expect(u.kind === 'unique' && u.x.map((v) => Math.round(v * 1e9) / 1e9)).toEqual([2, 1]);
    expect(solve([[1, 2], [2, 4]], [3, 1]).kind).toBe('none');
    const inf = solve([[1, 2], [2, 4]], [3, 6]);
    expect(inf.kind).toBe('infinite');
    if (inf.kind === 'infinite') {
      zero(matVec([[1, 2], [2, 4]], inf.x).map((v, i) => v - [3, 6][i]));
      expect(inf.dirs.length).toBe(1);
    }
  });
  it('3×3 예: 해 (1, 2, 3)', () => {
    const s = solve([[1, 1, 1], [2, 3, 1], [1, 3, 4]], [6, 11, 19]);
    expect(s.kind).toBe('unique');
    if (s.kind === 'unique') s.x.forEach((v, i) => expect(v).toBeCloseTo([1, 2, 3][i], 12));
  });
  it('무작위 가역 행렬: A x = b', () => {
    for (let t = 0; t < 50; t++) {
      const A = rand(3, 3), b = rand(1, 3)[0];
      if (Math.abs(det3(A)) < 1e-6) continue;
      const s = solve(A, b);
      expect(s.kind).toBe('unique');
      if (s.kind === 'unique') zero(matVec(A, s.x).map((v, i) => v - b[i]), 1e-8);
    }
  });
});

describe('역행렬과 좌표 (def.inverse, def.change-of-basis)', () => {
  it('inverse: A A⁻¹ = I, 특이 행렬은 null', () => {
    close(matMul([[1, 2], [3, 4]], inverse([[1, 2], [3, 4]])!), identity(2));
    expect(inverse([[1, 2], [2, 4]])).toBeNull();
  });
  it('coords: P c = v', () => {
    expect(coords([[2, 1], [1, 1]], [3, 2]).map((v) => Math.round(v * 1e9) / 1e9)).toEqual([1, 1]);
    expect(coords([[0.5, 0.5], [0.5, -0.5]], [3, 1]).map((v) => Math.round(v * 1e9) / 1e9)).toEqual([4, 2]);
  });
  it('정규직교화와 정사영', () => {
    const qs = orthonormalize([[1, 0, 1], [0, 1, 1]]);
    expect(dot(qs[0], qs[1])).toBeCloseTo(0, 12);
    const p = projectOntoSpan(qs, [-1, -1, 1]); // 영공간 방향은 행공간에 그림자가 없다
    zero(p);
  });
});
