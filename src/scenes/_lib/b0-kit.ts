// 0장(출발점) 장면들이 같이 쓰는 작은 도구: 눈금 있는 수직선, 축 눈금 숫자, 조각을 굳은 채로 옮기기.
import type { Plane } from '../../render/plane';
import type { Vec } from '../../la/vec';
import { C } from '../../render/colors';
import { fmt } from '../../ui/widgets';

/** 높이 y에 가로로 놓인 수직선: 정수 눈금과 숫자. 0의 눈금을 조금 길게. */
export function numberLine(p: Plane, o: { y?: number; labels?: boolean; every?: number } = {}) {
  const y = o.y ?? 0;
  const { x0, x1 } = p.bounds;
  p.seg([x0, y], [x1, y], { color: C.axis, width: 1.5 });
  const tick = 6 / p.unit;
  const every = o.every ?? 1;
  for (let k = Math.ceil(x0); k <= Math.floor(x1); k++) {
    const big = k === 0;
    p.seg([k, y - (big ? 1.6 : 1) * tick], [k, y + (big ? 1.6 : 1) * tick], { color: big ? C.ink : C.axis, width: big ? 2 : 1 });
    if (o.labels !== false && k % every === 0) p.text([k, y], fmt(k), { color: big ? C.ink : C.dim, dy: 16, align: 'center', size: 12 });
  }
}

/** 좌표축의 정수 눈금 숫자(가로축 아래, 세로축 왼쪽). */
export function axisLabels(p: Plane, every = 1) {
  const { x0, x1, y0, y1 } = p.bounds;
  for (let k = Math.ceil(x0); k <= Math.floor(x1); k++) if (k !== 0 && k % every === 0) p.text([k, 0], fmt(k), { color: C.dim, dy: 13, align: 'center', size: 11 });
  for (let k = Math.ceil(y0); k <= Math.floor(y1); k++) if (k !== 0 && k % every === 0) p.text([0, k], fmt(k), { color: C.dim, dx: -7, align: 'right', size: 11 });
  p.text([0, 0], '0', { color: C.dim, dx: -7, dy: 12, align: 'right', size: 11 });
}

/** 다각형의 무게중심(꼭짓점 평균) */
export function centerOf(P: Vec[]): Vec {
  let x = 0, y = 0;
  for (const v of P) (x += v[0]), (y += v[1]);
  return [x / P.length, y / P.length];
}

/**
 * 조각 P를 모양 그대로(늘이거나 찌그러뜨리지 않고) 옮긴다.
 * 중심 c를 축으로 phi만큼 돌린 뒤 중심을 c + shift 로 보낸다. s(0~1)는 진행 정도.
 */
export function rigid(P: Vec[], phi: number, shift: Vec, s: number): Vec[] {
  const c = centerOf(P);
  const a = phi * s, co = Math.cos(a), si = Math.sin(a);
  return P.map(([x, y]) => {
    const dx = x - c[0], dy = y - c[1];
    return [c[0] + co * dx - si * dy + shift[0] * s, c[1] + si * dx + co * dy + shift[1] * s];
  });
}

/** 각 phi만큼 원점을 축으로 돌린 뒤 t만큼 민 조각의 최종 위치를, 중심 기준의 (phi, shift)로 바꾼다. */
export function poseFrom(P: Vec[], phi: number, t: Vec): { phi: number; shift: Vec } {
  const c = centerOf(P);
  const co = Math.cos(phi), si = Math.sin(phi);
  const c2: Vec = [co * c[0] - si * c[1] + t[0], si * c[0] + co * c[1] + t[1]];
  return { phi, shift: [c2[0] - c[0], c2[1] - c[1]] };
}
