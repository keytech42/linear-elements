// 생성: 선형 결합으로 닿을 수 있는 모든 곳 (def.span, def.independence)
//
// 계수 c₁, c₂를 무작위로 골라 c₁𝐮 + c₂𝐰의 끝점을 찍는다. 많이 찍을수록 생성의 모양이 드러난다.
// 찍은 점은 계수로 기억하므로, 𝐮나 𝐰를 끌면 점들이 함께 움직인다.
//
// 매개변수
//   u, w:   처음 두 벡터 (기본 [1, 2], [2, -1])
//   one:    𝐰를 빼고 𝐮 하나만 쓸지 (기본 false)
//   fill:   처음에 찍어 둘 점의 개수 (기본 0)
//   presets: 보기 단추(하나, 나란한 둘, 나란하지 않은 둘, 영벡터)를 보일지 (기본 true)
// 동기화 키: u, w, span, cross
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { linComb, type Vec } from '../la/vec';
import { spanDim, cross2 } from '../la/ground';
import { fmt, chip, vectorEditor, buttons, toggle } from '../ui/widgets';

const MAX = 4000;

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [1, 2];
  let w: Vec = params.w ?? [2, -1];
  let useW = !params.one;
  const coeffs: [number, number][] = [];

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4.5, bus, height: 400 });
  p.handles.push(
    { key: 'u', get: () => u, set: (v) => ((u = v), sync()) },
    { key: 'w', get: () => w, set: (v) => ((w = v), sync()), enabled: () => useW },
  );

  const vecs = (): Vec[] => (useW ? [u, w] : [u]);

  function sprinkle(n: number) {
    // 계수는 −4 ~ 4에서 고르게. 화면 밖으로 나가는 점도 계수로는 기억한다.
    for (let k = 0; k < n && coeffs.length < MAX; k++) coeffs.push([Math.random() * 8 - 4, Math.random() * 8 - 4]);
    sync();
  }

  p.draw = (p) => {
    p.grid();
    const vs = vecs();
    const d = spanDim(vs);
    if (d === 1) {
      const dir = vs.find((v) => v[0] !== 0 || v[1] !== 0)!;
      p.line([0, 0], dir, { color: C.ink, width: 1, alpha: 0.25, key: 'span' });
    }
    for (const [a, b] of coeffs) p.dot(linComb(useW ? [a, b] : [a], vs), { color: C.ink, r: 1.8, alpha: 0.55 });
    if (useW) p.arrow([0, 0], w, { color: C.v, label: 'w', key: 'w' });
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.dot([0, 0], { color: C.ink, r: 3 });
    p.hud([{ text: `찍은 점 ${coeffs.length}개` }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (v) => ((u = v), sync()) });
  const ew = vectorEditor(eds, { name: 'w', key: 'w', color: C.v, get: () => w, set: (v) => ((w = v), sync()) });
  const tg = toggle(panel, 'w도 쓰기', () => useW, (b) => ((useW = b), (ew.el.style.opacity = b ? '1' : '0.35'), sync()));
  ew.el.style.opacity = useW ? '1' : '0.35';
  buttons(panel, [
    { label: '점 200개 찍기', on: () => sprinkle(200) },
    { label: '지우기', on: () => ((coeffs.length = 0), sync()) },
  ]);
  if (params.presets !== false) {
    const set = (a: Vec, b: Vec | null) => {
      u = a;
      if (b) w = b;
      useW = !!b;
      ew.el.style.opacity = useW ? '1' : '0.35';
      tg.refresh();
      sync();
    };
    buttons(panel, [
      { label: '하나', on: () => set([1, 2], null) },
      { label: '나란한 둘', on: () => set([1, 2], [-2, -4]) },
      { label: '나란하지 않은 둘', on: () => set([1, 2], [2, -1]) },
      { label: '영벡터', on: () => set([0, 0], null) },
    ]);
  }
  const ro = readout(panel);
  hint(panel, '점을 찍은 뒤 화살표 끝을 끌어 보세요. 점들은 같은 계수를 유지한 채 함께 움직입니다.');

  function sync() {
    eu.refresh();
    ew.refresh();
    const vs = vecs();
    const d = spanDim(vs);
    const names = ['원점 한 점', '원점을 지나는 직선 하나', '평면 전체'];
    let html = `<div>${chip(useW ? 'span(u, w)' : 'span(u)', C.ink, 'span')} = <b>${names[d]}</b></div>`;
    if (useW) html += `<div>${chip('u₁w₂ − u₂w₁', C.ink, 'cross')} = ${fmt(u[0])}·${fmt(w[1])} − ${fmt(u[1])}·${fmt(w[0])} = ${fmt(cross2(u, w))}</div>`;
    if (useW) html += `<div class="dim">${d === 2 ? '0이 아니다: 두 벡터가 나란하지 않다.' : '0이다: 두 벡터가 나란하거나 영벡터가 끼어 있다.'}</div>`;
    ro.set(html);
    p.invalidate();
  }
  if (params.fill) sprinkle(params.fill);
  else sync();
  return () => p.destroy();
};

export default scene;
