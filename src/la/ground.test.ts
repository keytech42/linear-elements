import { describe, it, expect } from 'vitest';
import { distance, circlePoint, angleOf, spanDim, cross2, reachCoeffs, mix2, displacement, chain, hypotenuse } from './ground';

describe('0장·1장 도구', () => {
  it('수직선: 변위는 출발점과 무관하고, 이어 붙이기는 순서와 무관하다', () => {
    expect(displacement(3, -1)).toBe(-4);
    expect(chain(-6, [displacement(3, -1)])).toBe(-10);
    expect(chain(-2, [5, -7])).toBe(-4);
    expect(chain(1, [5, -8])).toBe(chain(1, [-8, 5]));
  });
  it('빗변', () => {
    expect(hypotenuse(3, 4)).toBe(5);
    expect(hypotenuse(5, 12)).toBe(13);
    expect(hypotenuse(1, 1)).toBeCloseTo(Math.SQRT2);
    expect(hypotenuse(-3, 0)).toBe(3);
  });
  it('거리: 3-4-5 삼각형', () => {
    expect(distance([1, 1], [4, 5])).toBeCloseTo(5);
    expect(distance([-2, 3], [1, -1])).toBeCloseTo(5);
    expect(distance([0, 0], [1, 1])).toBeCloseTo(Math.SQRT2);
    expect(distance([-1, 2], [2, -2])).toBe(5);
    expect(distance([2, 5], [2, -1])).toBe(6);
  });
  it('단위원 위의 점과 각', () => {
    const p = circlePoint(Math.PI / 2);
    expect(p[0]).toBeCloseTo(0);
    expect(p[1]).toBeCloseTo(1);
    expect(angleOf([0, -1])).toBeCloseTo((3 * Math.PI) / 2);
    expect(angleOf(circlePoint(2))).toBeCloseTo(2);
    const q = circlePoint(2);
    expect(q[0] ** 2 + q[1] ** 2).toBeCloseTo(1);
    // 본문의 수치: cos 2 ≈ −0.416, sin 2 ≈ 0.909, 45°의 점 ≈ (0.707, 0.707)
    expect(q[0]).toBeCloseTo(-0.4161, 4);
    expect(q[1]).toBeCloseTo(0.9093, 4);
    expect(circlePoint(Math.PI / 4)[0]).toBeCloseTo(Math.sqrt(0.5));
    // 단위원 위의 점은 원점에서 거리 1 (prop.cos-sin-identity)
    for (const t of [0.3, 1, 2.5, 4, 5.9]) expect(distance([0, 0], circlePoint(t))).toBeCloseTo(1);
  });
  it('스팬의 차원', () => {
    expect(spanDim([[0, 0]])).toBe(0);
    expect(spanDim([[1, 2], [2, 4]])).toBe(1);
    expect(spanDim([[2, 1], [-1, 1]])).toBe(2);
    expect(spanDim([[1, 0, 0], [0, 1, 0], [1, 1, 0]])).toBe(2);
    expect(spanDim([[1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(3);
  });
  it('평행함 판정과 계수 공식', () => {
    expect(cross2([1, 2], [2, 4])).toBe(0);
    expect(cross2([2, 1], [-1, 1])).toBe(3);
    expect(reachCoeffs([2, 1], [-1, 1], [1, 2])).toEqual([1, 1]);
    expect(reachCoeffs([2, 1], [-1, 1], [3, 0])).toEqual([1, -1]);
    expect(reachCoeffs([1, 2], [2, 4], [1, 0])).toBeNull();
    const c = reachCoeffs([1.3, -0.4], [0.7, 2.1], [-2.5, 3.3])!;
    const back = mix2(c[0], [1.3, -0.4], c[1], [0.7, 2.1]);
    expect(back[0]).toBeCloseTo(-2.5);
    expect(back[1]).toBeCloseTo(3.3);
  });
});
