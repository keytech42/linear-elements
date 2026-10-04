// 선형성 시험: T(𝐮 + 𝐰)와 T(𝐮) + T(𝐰)가 같은가? T(c𝐯)와 cT(𝐯)가 같은가? (def.linear-map)
// 왼쪽 단추로 변환을 고른다. 선형 변환이면 두 분홍 점이 언제나 겹치고, 아니면 벌어진다(빨간 선 = 어긋난 거리).
//
// 매개변수
//   map:  'linear' | 'translate' | 'bend' | 'twist' (기본 'bend')
//   A:    'linear'의 행렬 (기본 [[1,1],[0,1]])
//   u, w: 두 입력 (기본 [1.5, 0.5], [0.5, 1.5]),  c: 스칼라 (기본 2)
// 동기화 키: u, w (두 입력), sumOf (T(𝐮)+T(𝐰)), ofSum (T(𝐮+𝐰)), gap (어긋남)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { add, norm, sub, type Vec } from '../la/vec';
import type { Mat } from '../la/mat';
import { translateBy, bend, twist, linearMap, additivityPair, homogeneityPair, type Map2 } from '../la/warp';
import { fmt, chip, buttons, slider } from '../ui/widgets';

const NAMES: Record<string, string> = { linear: '행렬 곱', translate: '평행 이동', bend: '휘기', twist: '소용돌이' };

const scene: SceneFn = (host, { bus, params }) => {
  const A: Mat = params.A ?? [[1, 1], [0, 1]];
  const maps: Record<string, Map2> = { linear: linearMap(A), translate: translateBy([1, 0.5]), bend, twist: (v) => twist(v) };
  let key: string = params.map ?? 'bend';
  let u: Vec = params.u ?? [1.5, 0.5];
  let w: Vec = params.w ?? [0.5, 1.5];
  let c: number = params.c ?? 2;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4, bus, height: 380 });
  p.handles.push({ key: 'u', get: () => u, set: (v) => ((u = v), sync()) }, { key: 'w', get: () => w, set: (v) => ((w = v), sync()) });

  p.draw = (p) => {
    p.grid();
    const T = maps[key];
    const s = add(u, w);
    // 입력 쪽(옅게): 𝐮, 𝐰, 𝐮 + 𝐰
    p.arrow([0, 0], u, { color: C.u, width: 1.5, alpha: 0.6, label: 'u', key: 'u' });
    p.arrow([0, 0], w, { color: C.w, width: 1.5, alpha: 0.6, label: 'w', key: 'w' });
    p.seg(u, s, { color: C.dim, dash: [3, 4], width: 1 });
    p.seg(w, s, { color: C.dim, dash: [3, 4], width: 1 });
    p.dot(s, { color: C.dim, r: 3 });
    // 출력 쪽: T(𝐮), T(𝐰)를 이어 붙인 평행사변형의 끝 vs T(𝐮 + 𝐰)
    const { ofSum, sumOf } = additivityPair(T, u, w);
    const Tu = T(u), Tw = T(w);
    p.seg(Tu, sumOf, { color: C.y, dash: [5, 4], width: 1.2, alpha: 0.7 });
    p.seg(Tw, sumOf, { color: C.y, dash: [5, 4], width: 1.2, alpha: 0.7 });
    p.dot(Tu, { color: C.u, r: 4 });
    p.dot(Tw, { color: C.w, r: 4 });
    p.text(Tu, 'T(u)', { color: C.u, dx: 8, dy: -8 });
    p.text(Tw, 'T(w)', { color: C.w, dx: 8, dy: -8 });
    p.dot(sumOf, { color: C.y, r: 6, key: 'sumOf' });
    p.text(sumOf, 'T(u)+T(w)', { color: C.y, dx: 10, dy: 12 });
    p.dot(ofSum, { color: C.ink, r: 5, key: 'ofSum' });
    p.text(ofSum, 'T(u+w)', { color: C.ink, dx: 10, dy: -12 });
    if (norm(sub(ofSum, sumOf)) > 1e-6) p.seg(ofSum, sumOf, { color: C.bad, width: 2.5, key: 'gap' });
    // 원점의 도착지
    const T0 = T([0, 0]);
    if (norm(T0) > 1e-9) {
      p.dot(T0, { color: C.bad, r: 4 });
      p.text(T0, 'T(0)', { color: C.bad, dx: 8, dy: 10 });
    }
    p.hud([{ text: `지금 변환: ${NAMES[key]}` , color: C.ink }], 'tl');
  };

  buttons(panel, Object.keys(maps).map((k) => ({ label: NAMES[k], on: () => ((key = k), sync()) })));
  slider(panel, { label: 'c', min: -2, max: 3, step: 0.5, get: () => c, set: (v) => ((c = v), sync()) });
  const ro = readout(panel);
  hint(panel, '하늘·연두 점을 끌어 보세요. 노란 점(먼저 보내고 더하기)과 흰 점(먼저 더하고 보내기)이 언제나 겹치는 변환만 선형입니다. 빨간 선이 어긋난 거리입니다.');

  function sync() {
    const T = maps[key];
    const a = additivityPair(T, u, w);
    const h = homogeneityPair(T, c, u);
    const gapA = norm(sub(a.ofSum, a.sumOf));
    const gapH = norm(sub(h.ofScaled, h.scaledOf));
    const T0 = T([0, 0]);
    ro.set(
      `<div>${chip('T(u+w)', C.ink, 'ofSum')} = (${fmt(a.ofSum[0])}, ${fmt(a.ofSum[1])})</div>` +
        `<div>${chip('T(u)+T(w)', C.y, 'sumOf')} = (${fmt(a.sumOf[0])}, ${fmt(a.sumOf[1])})</div>` +
        `<div>덧셈 어긋남 ${chip(fmt(gapA, 3), gapA > 1e-6 ? C.bad : C.ok, 'gap')}</div>` +
        `<div>T(${fmt(c)}u) − ${fmt(c)}T(u)의 길이 = <b style="color:${gapH > 1e-6 ? C.bad : C.ok}">${fmt(gapH, 3)}</b></div>` +
        `<div class="dim">T(0) = (${fmt(T0[0])}, ${fmt(T0[1])})${norm(T0) > 1e-9 ? ' — 원점이 움직였다' : ''}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
