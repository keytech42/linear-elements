// 행렬식 = 단위 정사각형이 옮겨 간 평행사변형의 부호 있는 넓이 (def.det, prop.det-sign)
//
// 단위 정사각형(점선)은 A에 의해 𝐚₁, 𝐚₂가 만드는 평행사변형으로 간다. 넓이는 노랑(향 유지) 또는 빨강(향 뒤집힘)으로 칠한다.
// 원점 근처의 작은 호: 𝐞₁에서 𝐞₂로 도는 쪽(점선, 언제나 시계 반대 방향)과, 𝐚₁에서 𝐚₂로 짧게 도는 쪽(실선).
// 두 호가 같은 쪽으로 돌면 향이 유지되고, 반대쪽으로 돌면 뒤집힌다.
//
// 매개변수
//   A:    처음 행렬 (기본 [[2, 1], [0.5, 1.5]])
//   grid: 변환된 격자를 보일지 (기본 true)
//   perp: 𝐚₁을 시계 반대 방향으로 90° 돌린 벡터를 보일지 (기본 false, prop.det-sign 용)
// 동기화 키: col1, col2 (열), det (평행사변형/넓이), orient (향의 호), perp (90° 돌린 𝐚₁)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, det2, type Mat } from '../la/mat';
import { add, perp2, dot, type Vec } from '../la/vec';
import { matrixEditor, fmt, chip, buttons } from '../ui/widgets';
import { arc, heading, turn } from './_lib/c3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [2, 1],
    [0.5, 1.5],
  ];
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.2, bus, height: 380 });
  const setCol = (j: number, v: Vec) => {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  };
  p.handles.push({ key: 'col1', get: () => col(A, 0), set: (v) => setCol(0, v) }, { key: 'col2', get: () => col(A, 1), set: (v) => setCol(1, v) });

  p.draw = (p) => {
    p.grid();
    if (params.grid !== false) p.tgrid(A, { color: 'rgba(120,170,255,0.22)' });
    const a1 = col(A, 0), a2 = col(A, 1), d = det2(A);
    p.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { color: C.dim, width: 1, dash: [4, 4] });
    p.poly([[0, 0], a1, add(a1, a2), a2], { fill: Math.abs(d) < 1e-9 ? C.area : d > 0 ? C.area : C.areaNeg, color: d >= 0 ? C.x : C.bad, width: 1.2, key: 'det' });
    // 향: e₁→e₂ (언제나 시계 반대 방향 90°)
    arc(p, 0, Math.PI / 2, 0.32, { color: C.dim, dash: [3, 3], arrow: true, key: 'orient' });
    if (Math.abs(d) > 1e-9) {
      const h1 = heading(a1), t = turn(h1, heading(a2));
      arc(p, h1, h1 + t, 0.55, { color: d > 0 ? C.ok : C.bad, width: 2.2, arrow: true, key: 'orient' });
    }
    if (params.perp) p.arrow([0, 0], perp2(a1), { color: C.c1, width: 1.5, dash: [5, 4], label: 'a₁ 를 90° 돌림', key: 'perp' });
    p.arrow([0, 0], a1, { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: 'a₂', key: 'col2' });
    p.hud([{ text: '주황·청록 화살표 끝을 끌어 보세요. 청록을 주황 너머로 넘겨 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const presets: [string, Mat][] = [
    ['늘이기', [[2, 0], [0, 1.5]]],
    ['전단', [[1, 1], [0, 1]]],
    ['회전 90°', [[0, -1], [1, 0]]],
    ['거울', [[1, 0], [0, -1]]],
    ['납작', [[1, 2], [0.5, 1]]],
  ];
  buttons(panel, presets.map(([label, M]) => ({ label, on: () => ((A = M.map((r) => r.slice())), sync()) })));
  const ro = readout(panel);
  hint(panel, '점선 호(𝐞₁ → 𝐞₂)는 언제나 시계 반대 방향입니다. 실선 호(𝐚₁ → 𝐚₂)가 같은 쪽이면 초록, 반대쪽이면 빨강입니다.');

  function sync() {
    med.refresh();
    const d = det2(A);
    const a1 = col(A, 0), a2 = col(A, 1);
    const o = Math.abs(d) < 1e-9 ? '납작해짐 (넓이 0, 향을 말할 수 없음)' : d > 0 ? '시계 반대 방향 · 향 유지' : '시계 방향 · 향 뒤집힘';
    let html =
      `<div>${chip('평행사변형의 넓이', C.x, 'det')} = ${fmt(Math.abs(d), 3)}</div>` +
      `<div>${chip('a₁ → a₂', d >= 0 ? C.ok : C.bad, 'orient')}: ${o}</div>` +
      `<div class="eq">${chip('det A', C.x, 'det')} = ${d > 1e-9 ? '+' : d < -1e-9 ? '−' : ''}${fmt(Math.abs(d), 3)}</div>`;
    if (params.perp) {
      const q = perp2(a1);
      html += `<div class="eq">${chip('a₁을 90° 돌린 벡터', C.c1, 'perp')} = (${fmt(q[0])}, ${fmt(q[1])})</div><div>(돌린 a₁)·${chip('a₂', C.c2, 'col2')} = ${fmt(dot(q, a2), 3)}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
