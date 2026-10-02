// 벡터의 길이: 성분을 두 직각변으로 하는 직각삼각형의 빗변 (def.norm)
//
// 𝐯 = v₁𝐞₁ + v₂𝐞₂ 를 가로 이동 v₁(주황)과 세로 이동 v₂(청록)로 나눠 그린다. 두 이동은 서로 수직이므로
// 피타고라스 정리로 빗변의 길이가 나온다. 단위원과 단위벡터 𝐯/‖𝐯‖도 함께 보인다.
//
// 매개변수
//   v:    처음 벡터 (기본 [3, 2])
//   unit: 단위원과 단위벡터를 보일지 (기본 true)
// 동기화 키: v (벡터), v1 (가로 직각변), v2 (세로 직각변), unit (단위벡터)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { norm, normalize, type Vec } from '../la/vec';
import { fmt, chip, vectorEditor } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let v: Vec = params.v ?? [3, 2];
  const showUnit = params.unit !== false;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.6, bus, height: 360 });
  p.handles.push({ key: 'v', get: () => v, set: (w) => ((v = w), sync()) });

  p.draw = (p) => {
    p.grid();
    if (showUnit) p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
    p.seg([0, 0], [v[0], 0], { color: C.c1, width: 3, key: 'v1' });
    p.seg([v[0], 0], v, { color: C.c2, width: 3, key: 'v2' });
    if (Math.abs(v[0]) > 0.2 && Math.abs(v[1]) > 0.2) {
      const sx = -Math.sign(v[0]) * 0.18, sy = Math.sign(v[1]) * 0.18;
      p.poly([[v[0], 0], [v[0] + sx, 0], [v[0] + sx, sy], [v[0], sy]], { color: C.dim, width: 1 });
    }
    p.text([v[0] / 2, 0], `v₁ = ${fmt(v[0])}`, { color: C.c1, dy: v[1] >= 0 ? 14 : -14, align: 'center' });
    p.text([v[0], v[1] / 2], `v₂ = ${fmt(v[1])}`, { color: C.c2, dx: v[0] >= 0 ? 10 : -10, align: v[0] >= 0 ? 'left' : 'right' });
    p.arrow([0, 0], v, { color: C.v, label: 'v', key: 'v' });
    if (showUnit && norm(v) > 1e-9) p.arrow([0, 0], normalize(v), { color: C.ink, width: 2, key: 'unit' });
    p.hud([{ text: '화살표 끝을 끌어 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.v, get: () => v, set: (w) => ((v = w), sync()) });
  const ro = readout(panel);
  hint(panel, '가로 이동과 세로 이동은 서로 수직이므로, 두 이동을 직각변으로 하는 직각삼각형이 생깁니다. 화살표 𝐯가 그 빗변입니다.');

  function sync() {
    ev.refresh();
    const n = norm(v);
    let html =
      `<div>‖${chip('v', C.v, 'v')}‖ = √(${chip(fmt(v[0]), C.c1, 'v1')}² + ${chip(fmt(v[1]), C.c2, 'v2')}²)</div>` +
      `<div>&nbsp;&nbsp;= √${fmt(v[0] * v[0] + v[1] * v[1], 3)} ≈ ${fmt(n, 3)}</div>`;
    if (showUnit) {
      if (n > 1e-9) {
        const w = normalize(v);
        html += `<div class="eq">${chip('v/‖v‖', C.ink, 'unit')} = (${fmt(w[0], 3)}, ${fmt(w[1], 3)})</div><div>그 길이 = ${fmt(norm(w), 6)}</div>`;
      } else html += `<div class="eq dim">영벡터는 방향이 없어 단위벡터로 만들 수 없습니다.</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
