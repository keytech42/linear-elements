// 기저와 좌표: 기울어진 자로 점의 위치를 읽기 (def.basis, prop.coords-unique)
//
// 기저 벡터 두 개(하늘 𝐮, 연두 𝐰)가 만드는 비스듬한 격자(파란 선) 위에서 점(흰 점)의 좌표 (c₁, c₂)를 읽는다.
// 점 = c₁𝐮 + c₂𝐰 를 하늘 점선(c₁𝐮) 다음 연두 점선(c₂𝐰)으로 이어 그린다.
// 계수는 src/la/ground.ts의 reachCoeffs로 계산한다(def.span에서 유도한 공식).
//
// 매개변수
//   u, w:  처음 기저 벡터 (기본 [2, 1], [1, 2])
//   p:     처음 점 (기본 [3, 0])
//   grid:  비스듬한 격자를 보일지 (기본 true)
// 동기화 키: u, w, p, c1u, c2w, coords
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { fromCols } from '../la/mat';
import { scale, type Vec } from '../la/vec';
import { reachCoeffs } from '../la/ground';
import { fmt, chip, vectorEditor, buttons, toggle } from '../ui/widgets';
import { vtxt } from './_lib/c1-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [2, 1];
  let w: Vec = params.w ?? [1, 2];
  let P: Vec = params.p ?? [3, 0];
  let grid: boolean = params.grid ?? true;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4.5, bus, height: 400 });
  p.handles.push(
    { key: 'u', get: () => u, set: (v) => ((u = v), sync()) },
    { key: 'w', get: () => w, set: (v) => ((w = v), sync()) },
    { key: 'p', get: () => P, set: (v) => ((P = v), sync()) },
  );

  p.draw = (p) => {
    p.grid();
    const k = reachCoeffs(u, w, P);
    if (grid && k) p.tgrid(fromCols([u, w]));
    if (k) {
      const a = scale(k[0], u);
      p.arrow([0, 0], a, { color: C.u, width: 2, dash: [5, 4], key: 'c1u' });
      p.arrow(a, P, { color: C.w, width: 2, dash: [5, 4], key: 'c2w' });
    }
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.arrow([0, 0], w, { color: C.w, label: 'w', key: 'w' });
    p.dot(P, { color: C.ink, r: 5, key: 'p' });
    p.text(P, '점', { color: C.ink, dx: 10, dy: -12 });
    p.hud([{ text: k ? 'u, w 끝과 흰 점을 끌어 보세요' : 'u와 w가 평행하다: 기저가 아니다' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (v) => ((u = v), sync()) });
  const ew = vectorEditor(eds, { name: 'w', key: 'w', color: C.w, get: () => w, set: (v) => ((w = v), sync()) });
  const ep = vectorEditor(eds, { name: '점', key: 'p', color: C.ink, get: () => P, set: (v) => ((P = v), sync()) });
  toggle(panel, '기울어진 격자 보기', () => grid, (b) => ((grid = b), sync()));
  buttons(panel, [
    { label: '표준 기저', on: () => ((u = [1, 0]), (w = [0, 1]), sync()), title: 'u = e₁, w = e₂' },
    { label: '기울어진 기저', on: () => ((u = [2, 1]), (w = [1, 2]), sync()) },
    { label: '평행한 둘', on: () => ((u = [1, 1]), (w = [2, 2]), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, '파란 격자의 한 칸은 𝐮 방향으로 한 걸음, 𝐰 방향으로 한 걸음입니다. 흰 점이 격자의 어느 칸에 있는지 세는 것이 좌표를 읽는 것입니다.');

  function sync() {
    eu.refresh();
    ew.refresh();
    ep.refresh();
    const k = reachCoeffs(u, w, P);
    let html = `<div>표준 좌표: ${chip('점', C.ink, 'p')} = ${vtxt(P)}</div>`;
    if (k)
      html +=
        `<div>이 기저에 대한 ${chip('좌표', C.ink, 'coords')}: (${chip(fmt(k[0]), C.u, 'c1u')}, ${chip(fmt(k[1]), C.w, 'c2w')})</div>` +
        `<div class="eq">${chip(fmt(k[0]), C.u, 'c1u')}·${vtxt(u)} + ${chip(fmt(k[1]), C.w, 'c2w')}·${vtxt(w)} = ${vtxt(P)}</div>`;
    else html += `<div class="dim">𝐮와 𝐰가 평행해서 평면 전체를 스팬하지 못한다. 점이 그 직선 위에 있으면 좌표를 매기는 방법이 끝없이 많고, 아니면 하나도 없다.</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
