// 2권 변환들(warp.ts)의 성질 검증: 선형인 것은 두 등식을 지키고, 선형이 아닌 것은 어긋난다.
import { describe, it, expect } from 'vitest';
import { translateBy, bend, twist, linearMap, blendMap, additivityPair, homogeneityPair } from './warp';
import { sub, norm } from './vec';
import { matMul, matVec, rotation, type Mat } from './mat';

const gap = (a: number[], b: number[]) => norm(sub(a, b));

describe('선형 변환은 두 등식을 지킨다 (def.linear-map)', () => {
  const A: Mat = [
    [1, 1],
    [0, 1],
  ];
  const T = linearMap(A);
  it('덧셈', () => {
    const { ofSum, sumOf } = additivityPair(T, [1, 2], [2, -1]);
    expect(ofSum).toEqual([4, 1]);
    expect(sumOf).toEqual([4, 1]);
  });
  it('스칼라 곱', () => {
    const { ofScaled, scaledOf } = homogeneityPair(T, -1.5, [2, 3]);
    expect(gap(ofScaled, scaledOf)).toBeLessThan(1e-12);
  });
});

describe('선형이 아닌 변환은 어긋난다 (def.linear-map 본문의 수치 예)', () => {
  it('평행 이동: 원점이 움직이고, 덧셈이 이동 벡터만큼 어긋난다', () => {
    const T = translateBy([1, 0]);
    expect(T([0, 0])).toEqual([1, 0]);
    const { ofSum, sumOf } = additivityPair(T, [1, 0], [0, 1]);
    expect(ofSum).toEqual([2, 1]);
    expect(sumOf).toEqual([3, 1]);
  });
  it('휘기: 원점은 제자리지만 2배가 지켜지지 않는다', () => {
    expect(bend([0, 0])).toEqual([0, 0]);
    expect(bend([2, 0])).toEqual([2, 1]);
    const { ofScaled, scaledOf } = homogeneityPair(bend, 2, [2, 0]);
    expect(ofScaled).toEqual([4, 4]);
    expect(scaledOf).toEqual([4, 2]);
    const { ofSum, sumOf } = additivityPair(bend, [2, 0], [2, 0]);
    expect(ofSum).toEqual([4, 4]);
    expect(sumOf).toEqual([4, 2]);
  });
  it('소용돌이: 원점은 제자리, 길이는 지키지만 2배가 지켜지지 않는다', () => {
    expect(twist([0, 0])).toEqual([0, 0]);
    expect(Math.abs(norm(twist([3, 1])) - norm([3, 1]))).toBeLessThan(1e-12);
    const { ofScaled, scaledOf } = homogeneityPair(twist, 2, [1, 0]);
    expect(gap(ofScaled, scaledOf)).toBeGreaterThan(0.1);
  });
  it('휘기에서 기저의 도착지만으로 예측하면 틀린다 (prop.basis-determines)', () => {
    // T(e₁) = (1, 1/4), T(e₂) = (0, 1) 로 선형인 척 예측하면 (2, 0) ↦ (2, 0.5) 이지만 실제는 (2, 1)
    expect(bend([1, 0])).toEqual([1, 0.25]);
    expect(bend([0, 1])).toEqual([0, 1]);
    expect(bend([2, 0])).toEqual([2, 1]);
  });
});

describe('섞기', () => {
  it('s = 0 이면 제자리, s = 1 이면 T', () => {
    expect(blendMap(bend, 0)([2, 3])).toEqual([2, 3]);
    expect(blendMap(bend, 1)([2, 3])).toEqual(bend([2, 3]));
  });
});

describe('2권 본문의 수치 (회전, 합성)', () => {
  it('R(90°) = [[0,−1],[1,0]], R(30°)(2,0) = (√3, 1)', () => {
    const R = rotation(Math.PI / 2);
    expect(gap(R[0], [0, -1]) + gap(R[1], [1, 0])).toBeLessThan(1e-12);
    expect(gap(matVec(rotation(Math.PI / 6), [2, 0]), [Math.sqrt(3), 1])).toBeLessThan(1e-12);
  });
  it('두 회전은 순서와 상관없고 각이 더해진다', () => {
    const a = matMul(rotation(Math.PI / 6), rotation(Math.PI / 3));
    const b = matMul(rotation(Math.PI / 3), rotation(Math.PI / 6));
    const c = rotation(Math.PI / 2);
    for (let i = 0; i < 2; i++) {
      expect(gap(a[i], c[i])).toBeLessThan(1e-12);
      expect(gap(b[i], c[i])).toBeLessThan(1e-12);
    }
  });
});
