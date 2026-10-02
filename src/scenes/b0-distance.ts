// 두 점 사이의 거리 = 가로 차이와 세로 차이를 두 직각변으로 하는 직각삼각형의 빗변 (def.distance)
//
// 흰 점 P와 Q를 끈다. P에서 가로로 Δx(주황), 이어서 세로로 Δy(청록) 가면 Q에 닿는다. 두 이동은 서로 수직이므로
// P, (Q의 가로 좌표, P의 세로 좌표), Q가 직각삼각형을 이루고, 선분 PQ가 그 빗변이다.
//
// 매개변수
//   P, Q:    처음 두 점 (기본 [1, 1], [4, 5])
//   lattice: 수를 주면, 원점에서 거리가 정확히 그 수인 정수 좌표의 점들과 그 원을 함께 그린다 (예: 5)
// 동기화 키: P, Q, dx (가로 차이), dy (세로 차이), d (거리)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { axisLabels } from './_lib/b0-kit';
import { distance, displacement } from '../la/ground';
import { fmt, chip } from '../ui/widgets';
import type { Vec } from '../la/vec';

/** 음수의 제곱은 괄호로 감싼다: (−3)² 와 −3² 는 다르다 */
const sq = (v: number) => (v < 0 ? `(${fmt(v)})²` : `${fmt(v)}²`);

const scene: SceneFn = (host, { bus, params }) => {
  let P: Vec = params.P ?? [1, 1];
  let Q: Vec = params.Q ?? [4, 5];
  const R: number | null = params.lattice ?? null;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: R ? R + 1.2 : 5, bus, height: 400 });
  p.handles.push({ key: 'P', get: () => P, set: (v) => ((P = v), sync()), snap: 1 }, { key: 'Q', get: () => Q, set: (v) => ((Q = v), sync()), snap: 1 });

  // 원점에서 거리가 정확히 R인 정수 좌표 점들 (거리는 distance로 잰다)
  const ring: Vec[] = [];
  if (R) for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) if (Math.abs(distance([0, 0], [x, y]) - R) < 1e-9) ring.push([x, y]);

  p.draw = (p) => {
    p.grid();
    axisLabels(p);
    if (R) {
      p.curve((t) => [R * Math.cos(t), R * Math.sin(t)], 0, 2 * Math.PI, 120, { color: C.dim, width: 1, dash: [4, 4] });
      for (const v of ring) p.dot(v, { color: C.u, r: 5 });
    }
    const corner: Vec = [Q[0], P[1]];
    p.seg(P, corner, { color: C.c1, width: 3, key: 'dx' });
    p.seg(corner, Q, { color: C.c2, width: 3, key: 'dy' });
    const dx = displacement(P[0], Q[0]), dy = displacement(P[1], Q[1]);
    if (Math.abs(dx) > 0.3 && Math.abs(dy) > 0.3) {
      const sx = -Math.sign(dx) * 0.22, sy = Math.sign(dy) * 0.22;
      p.poly([corner, [corner[0] + sx, corner[1]], [corner[0] + sx, corner[1] + sy], [corner[0], corner[1] + sy]], { color: C.dim, width: 1 });
    }
    p.seg(P, Q, { color: C.ink, width: 2.5, key: 'd' });
    p.text([(P[0] + Q[0]) / 2, P[1]], `Δx = ${fmt(dx)}`, { color: C.c1, dy: dy >= 0 ? 14 : -14, align: 'center' });
    p.text([Q[0], (P[1] + Q[1]) / 2], `Δy = ${fmt(dy)}`, { color: C.c2, dx: dx >= 0 ? 10 : -10, align: dx >= 0 ? 'left' : 'right' });
    p.dot(P, { color: C.ink, r: 6, key: 'P' });
    p.dot(Q, { color: C.ink, r: 6, key: 'Q' });
    p.text(P, `P (${fmt(P[0])}, ${fmt(P[1])})`, { color: C.ink, dx: -10, dy: -14, align: 'right' });
    p.text(Q, `Q (${fmt(Q[0])}, ${fmt(Q[1])})`, { color: C.ink, dx: 10, dy: -14 });
    p.hud([{ text: '흰 점 P, Q를 끌어 보세요' }], 'bl');
  };

  const ro = readout(panel);
  hint(panel, R ? `하늘색 점: 두 좌표가 모두 정수이고 원점에서 거리가 정확히 ${R}인 점 ${ring.length}개.` : 'Δx, Δy가 음수여도 제곱하면 0 이상이 됩니다. 그래서 어느 쪽에서 재도 거리는 같습니다.');

  function sync() {
    const dx = displacement(P[0], Q[0]), dy = displacement(P[1], Q[1]);
    ro.set(
      `<div>${chip('Δx', C.c1, 'dx')} = ${fmt(Q[0])} − (${fmt(P[0])}) = ${fmt(dx)}</div>` +
        `<div>${chip('Δy', C.c2, 'dy')} = ${fmt(Q[1])} − (${fmt(P[1])}) = ${fmt(dy)}</div>` +
        `<div class="eq">${chip('거리', C.ink, 'd')} = √(${sq(dx)} + ${sq(dy)}) = √${fmt(dx * dx + dy * dy, 3)} ≈ ${fmt(distance(P, Q), 3)}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
