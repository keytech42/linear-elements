import { describe, it, expect } from 'vitest';
import { polygonArea, cosBetween, angleBetween } from './area';
import { matVec, det2, type Mat } from './mat';

describe('부호 있는 넓이 (prop.det-uniform)', () => {
  it('단위 정사각형: 시계 반대 = 1, 시계 = −1', () => {
    expect(polygonArea([[0, 0], [1, 0], [1, 1], [0, 1]])).toBeCloseTo(1);
    expect(polygonArea([[0, 0], [0, 1], [1, 1], [1, 0]])).toBeCloseTo(-1);
  });
  it('어떤 다각형이든 A로 보내면 넓이가 det A 배', () => {
    const shape = [[0.2, 0.1], [1.3, -0.4], [1.8, 0.9], [0.7, 1.6], [-0.5, 0.8]];
    const As: Mat[] = [
      [[2, 0], [0, 3]],
      [[1, 1], [0, 1]],
      [[0.5, -1.2], [0.7, 0.3]],
      [[1, 2], [3, 4]],
      [[1, 2], [2, 4]],
    ];
    const a0 = polygonArea(shape);
    for (const A of As) expect(polygonArea(shape.map((p) => matVec(A, p)))).toBeCloseTo(det2(A) * a0, 10);
  });
});

describe('각', () => {
  it('직각, 평행, 반대', () => {
    expect(cosBetween([1, 0], [0, 2])).toBeCloseTo(0);
    expect(angleBetween([1, 1], [2, 2])).toBeCloseTo(0);
    expect(angleBetween([1, 0], [-3, 0])).toBeCloseTo(Math.PI);
    expect(angleBetween([1, 0], [1, 1])).toBeCloseTo(Math.PI / 4);
    expect(Number.isNaN(cosBetween([0, 0], [1, 0]))).toBe(true);
  });
});
