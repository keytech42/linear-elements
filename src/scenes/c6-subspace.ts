// 부분공간 시험: 직선 위의 두 벡터를 더하고 늘여도 직선 위에 남는가? (def.subspace)
//
// 매개변수
//   d:       직선의 방향 (기본 [2,1])
//   offset:  직선을 원점에서 얼마나 띄울지(직선에 수직인 거리, 기본 0)
//   c:       스칼라 곱의 c (기본 −1.5)
// 그림: 회색 직선 = 시험할 모임. 하늘 u, 연두 w = 직선 위의 두 벡터(끝을 끌면 직선을 따라 움직인다).
//       흰 화살표 = u + w, 점선 화살표 = c·u. 끝점이 직선 위에 있으면 초록 점, 밖이면 빨간 점.
// 동기화 키: u, w, sum, cu, zero
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { add, scale, dot, sub, normalize, perp2, type Vec } from '../la/vec';
import { fmt, chip, slider } from '../ui/widgets';
import { vecTxt } from './_lib/c5-kit';

const scene: SceneFn = (host, { bus, params }) => {
  const d: Vec = normalize(params.d ?? [2, 1]);
  const nrm = perp2(d);
  let off: number = params.offset ?? 0;
  let c: number = params.c ?? -1.5;
  let su = 1.2, sw = 0.8; // 직선 위의 위치(방향 d로 잰 거리)
  const base = (): Vec => scale(off, nrm);
  const at = (s: number): Vec => add(base(), scale(s, d));
  const onLine = (v: Vec) => Math.abs(dot(sub(v, base()), nrm)) < 1e-9;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 360 });
  p.handles.push(
    { key: 'u', get: () => at(su), set: (v) => ((su = dot(sub(v, base()), d)), sync()), snap: 0 },
    { key: 'w', get: () => at(sw), set: (v) => ((sw = dot(sub(v, base()), d)), sync()), snap: 0 },
  );

  p.draw = (p) => {
    p.grid();
    p.line(base(), d, { color: C.ink, width: 2, alpha: 0.55 });
    const u = at(su), w = at(sw), s = add(u, w), cu = scale(c, u);
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.arrow([0, 0], w, { color: C.w, label: 'w', key: 'w' });
    p.arrow(u, s, { color: C.w, width: 1.2, dash: [4, 4], alpha: 0.6 });
    p.arrow([0, 0], s, { color: C.ink, label: 'u + w', key: 'sum' });
    p.arrow([0, 0], cu, { color: C.u, width: 1.8, dash: [6, 4], label: `${fmt(c)}u`, key: 'cu' });
    for (const [v, key] of [[s, 'sum'], [cu, 'cu']] as [Vec, string][]) p.dot(v, { color: onLine(v) ? C.ok : C.bad, r: 5, key });
    p.dot([0, 0], { color: onLine([0, 0]) ? C.ok : C.bad, r: 5, key: 'zero' });
  };

  const ro = readout(panel);
  const so = slider(panel, { label: '원점에서 띄우기', min: -2, max: 2, step: 0.1, get: () => off, set: (v) => ((off = v), sync()) });
  const sc = slider(panel, { label: 'c', min: -3, max: 3, step: 0.1, get: () => c, set: (v) => ((c = v), sync()) });
  hint(panel, 'u, w의 끝을 끌어 보세요. 직선을 원점에서 띄우면 무엇이 깨지는지 보세요.');

  function sync() {
    so.refresh();
    sc.refresh();
    const u = at(su), w = at(sw), s = add(u, w), cu = scale(c, u);
    const yes = (v: Vec) => (onLine(v) ? `<span style="color:${C.ok}">직선 위</span>` : `<span style="color:${C.bad}">직선 밖</span>`);
    let html = `<div>${chip('u', C.u, 'u')} = ${vecTxt(u)}, ${chip('w', C.w, 'w')} = ${vecTxt(w)}</div>`;
    html += `<div>${chip('u + w', C.ink, 'sum')} = ${vecTxt(s)} → ${yes(s)}</div>`;
    html += `<div>${chip(`${fmt(c)}u`, C.u, 'cu')} = ${vecTxt(cu)} → ${yes(cu)}</div>`;
    html += `<div>${chip('𝟎', C.ink, 'zero')} → ${yes([0, 0])}</div>`;
    html += `<div class="dim">${Math.abs(off) < 1e-9 ? '원점을 지나는 직선: 덧셈과 스칼라 곱을 해도 밖으로 나가지 않는다.' : '원점을 지나지 않는 직선: 더하거나 늘이면 밖으로 나간다.'}</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
