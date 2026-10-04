// 벡터 덧셈 = 이어 붙이기 (def.vector-add, prop.add-componentwise)
//
// 𝐮(하늘)를 원점에서 출발시키고, 𝐰(연두)를 𝐮의 끝에서 출발시킨다. 원점에서 마지막 끝까지가 𝐮 + 𝐰(흰색)다.
// par가 켜져 있으면 반대 순서(𝐰 다음 𝐮)도 점선으로 그려 평행사변형을 보인다.
// comp가 켜져 있으면 가로 이동(주황)과 세로 이동(청록)을 따로 이어 그려 "성분끼리 더하기"를 보인다.
//
// 매개변수
//   u:    처음 𝐮 (기본 [2, 1])
//   w:    처음 𝐰 (기본 [-1, 2])
//   par:  반대 순서와 평행사변형을 보일지 (기본 false)
//   parToggle: 반대 순서 토글을 둘지 (기본 true). 교환법칙을 묻는 관문 앞의 장면에서는 false로 둔다(답 누설 방지).
//   comp: 가로·세로 이동을 따로 보일지 (기본 false)
// 동기화 키: u, w, sum, wu (반대 순서), h (가로 이동의 합), vv (세로 이동의 합)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { add, sub, type Vec } from '../la/vec';
import { fmt, chip, vectorEditor, toggle } from '../ui/widgets';
import { colHtml } from './_lib/b1-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [2, 1];
  let w: Vec = params.w ?? [-1, 2];
  let par: boolean = params.par ?? false;
  let comp: boolean = params.comp ?? false;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4, bus, height: 380 });
  p.handles.push(
    { key: 'u', get: () => u, set: (v) => ((u = v), sync()) },
    { key: 'w', get: () => add(u, w), set: (v) => ((w = sub(v, u)), sync()) },
  );

  p.draw = (p) => {
    p.grid();
    const s = add(u, w);
    if (par) {
      p.poly([[0, 0], u, s, w], { fill: 'rgba(231,235,243,0.06)' });
      p.arrow([0, 0], w, { color: C.w, width: 1.5, dash: [5, 4], alpha: 0.7, key: 'wu' });
      p.arrow(w, s, { color: C.u, width: 1.5, dash: [5, 4], alpha: 0.7, key: 'wu' });
    }
    if (comp) {
      // 가로 이동 u₁ 다음 w₁ (주황), 세로 이동 u₂ 다음 w₂ (청록): 바닥 쪽에 따로 그린다
      const y0 = Math.min(0, u[1], s[1]) - 0.6;
      p.seg([0, y0], [u[0], y0], { color: C.c1, width: 3, key: 'h' });
      p.seg([u[0], y0 - 0.12], [s[0], y0 - 0.12], { color: C.c1, width: 3, dash: [4, 3], key: 'h' });
      const x0 = Math.min(0, u[0], s[0]) - 0.6;
      p.seg([x0, 0], [x0, u[1]], { color: C.c2, width: 3, key: 'vv' });
      p.seg([x0 - 0.12, u[1]], [x0 - 0.12, s[1]], { color: C.c2, width: 3, dash: [4, 3], key: 'vv' });
    }
    p.arrow([0, 0], s, { color: C.ink, label: 'u + w', key: 'sum' });
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.arrow(u, s, { color: C.w, label: 'w', key: 'w' });
    p.hud([{ text: '하늘 화살표 끝과 연두 화살표 끝을 끌어 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (v) => ((u = v), sync()) });
  const ew = vectorEditor(eds, { name: 'w', key: 'w', color: C.w, get: () => w, set: (v) => ((w = v), sync()) });
  if (params.parToggle ?? true) toggle(panel, '반대 순서(w 다음 u)도 보기', () => par, (b) => ((par = b), sync()));
  toggle(panel, '가로 이동과 세로 이동을 따로 보기', () => comp, (b) => ((comp = b), sync()));
  const ro = readout(panel);
  hint(panel, '연두 화살표의 손잡이는 끝점에 있습니다. 끌면 𝐰가 바뀌고, 𝐮의 끝에서 출발하는 모양은 그대로 유지됩니다.');

  function sync() {
    eu.refresh();
    ew.refresh();
    const s = add(u, w);
    let html =
      `<div>${chip('u', C.u, 'u')} + ${chip('w', C.w, 'w')} = ${colHtml(u, { color: C.u })} + ${colHtml(w, { color: C.w })} = ${colHtml(s, { key: 'sum' })}</div>` +
      `<div>가로: ${chip(`${fmt(u[0])} + ${fmt(w[0])} = ${fmt(s[0])}`, C.c1, 'h')}</div>` +
      `<div>세로: ${chip(`${fmt(u[1])} + ${fmt(w[1])} = ${fmt(s[1])}`, C.c2, 'vv')}</div>`;
    if (par) html += `<div class="dim">점선(${chip('w 다음 u', C.ink, 'wu')})도 같은 점 ${'(' + fmt(s[0]) + ', ' + fmt(s[1]) + ')'}에 도착한다.</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
