// 세 번째 손잡이: 3차원에서 벡터 셋의 생성 (exp.space3)
//
// 𝐮(하늘)와 𝐰(연두)가 생성하는 평면을 옅은 면으로 칠하고, 셋째 벡터 𝐯(흰색)가 그 평면 안에 있는지 밖에 있는지 보인다.
// 밖에 있으면 𝐯의 끝에서 평면까지 점선을 내려 "평면에서 벗어난 만큼"을 보인다.
// "점 찍기"는 c₁𝐮 + c₂𝐰 + c₃𝐯의 끝점을 무작위 계수로 찍는다. 셋이 독립이면 점이 공간으로 퍼지고, 아니면 평면에 붙는다.
// 차원은 src/la/ground.ts의 spanDim, 평면 안의 계수는 src/la/solve.ts의 solve로 계산한다.
//
// 매개변수
//   u, w, v: 처음 세 벡터 (기본 [1, 0, 0], [0, 1, 1], [2, 3, 3])
//   third:   셋째 벡터를 보일지 (기본 true)
// 동기화 키: u, w, v, plane, out
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { C } from '../render/colors';
import { fromCols } from '../la/mat';
import { add, scale, linComb, type Vec } from '../la/vec';
import { orthonormalize, projectOntoSpan, solve } from '../la/solve';
import { spanDim } from '../la/ground';
import { fmt, chip, vectorEditor, buttons, toggle } from '../ui/widgets';
import { vtxt } from './_lib/b1-kit';

const L = 2.8;
const MAX = 3000;

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [1, 0, 0];
  let w: Vec = params.w ?? [0, 1, 1];
  let v: Vec = params.v ?? [2, 3, 3];
  let third: boolean = params.third ?? true;
  const coeffs: Vec[] = [];

  const { stage, panel } = layout(host);
  const s = new Space(stage, { range: 3.6, bus, height: 400 });

  s.draw = (s) => {
    s.axes(3);
    const q = orthonormalize([u, w]);
    if (q.length === 2) {
      const c = [
        add(scale(L, q[0]), scale(L, q[1])),
        add(scale(-L, q[0]), scale(L, q[1])),
        add(scale(-L, q[0]), scale(-L, q[1])),
        add(scale(L, q[0]), scale(-L, q[1])),
      ];
      s.poly(c, { fill: C.u, alpha: 0.14, color: C.u, width: 1, key: 'plane' });
    } else if (q.length === 1) s.seg(scale(-L, q[0]), scale(L, q[0]), { color: C.u, width: 4, alpha: 0.5, key: 'plane' });
    const vs = third ? [u, w, v] : [u, w];
    for (const k of coeffs) s.dot(linComb(third ? k : k.slice(0, 2), vs), { color: C.ink, r: 1.8, alpha: 0.6 });
    s.arrow([0, 0, 0], u, { color: C.u, label: 'u', key: 'u' });
    s.arrow([0, 0, 0], w, { color: C.v, label: 'w', key: 'w' });
    if (third) {
      s.arrow([0, 0, 0], v, { color: C.ink, label: 'v', key: 'v' });
      if (q.length >= 1) {
        const foot = projectOntoSpan(q, v);
        if (spanDim([u, w, v]) > spanDim([u, w])) s.seg(v, foot, { color: C.ink, width: 1.5, dash: [4, 4], key: 'out' });
      }
    }
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (x) => ((u = x), sync()) });
  const ew = vectorEditor(eds, { name: 'w', key: 'w', color: C.v, get: () => w, set: (x) => ((w = x), sync()) });
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.ink, get: () => v, set: (x) => ((v = x), sync()) });
  const tg = toggle(panel, '셋째 벡터 v 쓰기', () => third, (b) => ((third = b), (ev.el.style.opacity = b ? '1' : '0.35'), sync()));
  buttons(panel, [
    { label: 'v가 평면 안', on: () => preset([1, 0, 0], [0, 1, 1], [2, 3, 3]) },
    { label: 'v가 평면 밖', on: () => preset([1, 0, 0], [0, 1, 1], [0, 0, 2]) },
    { label: 'u, w가 나란함', on: () => preset([1, 1, 0], [-2, -2, 0], [0, 0, 2]) },
  ]);
  buttons(panel, [
    { label: '점 300개 찍기', on: () => sprinkle(300) },
    { label: '지우기', on: () => ((coeffs.length = 0), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, '그림을 끌면 공간이 돌아갑니다. 점을 찍은 뒤 옆에서 보면, 점들이 얇은 판에 붙어 있는지 두껍게 퍼져 있는지 보입니다.');

  function preset(a: Vec, b: Vec, c: Vec) {
    u = a;
    w = b;
    v = c;
    third = true;
    ev.el.style.opacity = '1';
    tg.refresh();
    sync();
  }
  function sprinkle(n: number) {
    for (let k = 0; k < n && coeffs.length < MAX; k++) coeffs.push([Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5]);
    sync();
  }

  function sync() {
    eu.refresh();
    ew.refresh();
    ev.refresh();
    const names = ['원점 한 점', '원점을 지나는 직선', '원점을 지나는 평면', '공간 전체'];
    const d2 = spanDim([u, w]);
    let html = `<div>${chip('span(u, w)', C.u, 'plane')} = <b>${names[d2]}</b></div>`;
    if (third) {
      const d3 = spanDim([u, w, v]);
      html += `<div>span(u, w, ${chip('v', C.ink, 'v')}) = <b>${names[d3]}</b></div>`;
      if (d3 === d2) {
        const sol = solve(fromCols([u, w]), v);
        if (sol.kind !== 'none') html += `<div class="dim">v는 이미 닿을 수 있던 곳에 있다: v = ${fmt(sol.x[0])}·u + ${fmt(sol.x[1])}·w${sol.kind === 'infinite' ? ' (다른 계수도 가능)' : ''}</div>`;
        html += `<div class="dim">셋째 손잡이가 새 방향을 보태지 못한다.</div>`;
      } else html += `<div class="dim">v는 ${chip('평면 밖', C.ink, 'out')}에 있다: 새 방향을 하나 보탠다.</div>`;
    }
    html += `<div class="dim">u = ${vtxt(u)}, w = ${vtxt(w)}${third ? `, v = ${vtxt(v)}` : ''}</div>`;
    ro.set(html);
    s.invalidate();
  }
  sync();
  return () => s.destroy();
};

export default scene;
