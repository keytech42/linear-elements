// det(AB) = det A · det B : 넓이 배율은 이어서 곱해진다 (prop.det-product)
//
// 진행 0 → 1: 항등에서 B까지. 단위 정사각형이 넓이 det B 인 평행사변형이 된다.
// 진행 1 → 2: B에서 AB까지. 그 평행사변형에 다시 A가 작용해 넓이가 det A 배가 된다.
// 단계마다 칠한 도형의 부호 있는 넓이를 읽기 칸에 보인다.
//
// 매개변수
//   A, B: 처음 행렬 (기본 A = [[1, 1], [0, 2]], B = [[1.5, 0], [0.5, 1]])
//   t:    처음 진행 0~2 (기본 0)
// 동기화 키: col1, col2 (지금 그림의 두 열), a11… (A의 칸), B.a11… B.col1… (B의 칸과 열), detA, detB, detAB, det (지금 넓이)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, det2, matMul, identity, type Mat } from '../la/mat';
import { add } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, animate, slider, lerpMat } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 1],
    [0, 2],
  ];
  let B: Mat = params.B ?? [
    [1.5, 0],
    [0.5, 1],
  ];
  let t: number = params.t ?? 0;
  const shown = (): Mat => (t <= 1 ? lerpMat(identity(2), B, t) : matMul(lerpMat(identity(2), A, t - 1), B));
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.6, bus, height: 380 });

  p.draw = (p) => {
    p.grid();
    const M = shown();
    p.tgrid(M, { color: 'rgba(120,170,255,0.25)' });
    p.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { color: C.dim, width: 1, dash: [4, 4] });
    if (t > 1) {
      const b1 = col(B, 0), b2 = col(B, 1);
      p.poly([[0, 0], b1, add(b1, b2), b2], { color: C.dim, width: 1, dash: [2, 3], key: 'detB' });
    }
    const m1 = col(M, 0), m2 = col(M, 1), d = det2(M);
    p.poly([[0, 0], m1, add(m1, m2), m2], { fill: d >= 0 ? C.area : C.areaNeg, color: d >= 0 ? C.x : C.bad, width: 1.4, key: 'det' });
    p.arrow([0, 0], m1, { color: C.c1, key: 'col1' });
    p.arrow([0, 0], m2, { color: C.c2, key: 'col2' });
    p.hud([{ text: t <= 1 ? `① B를 하는 중 (${Math.round(t * 100)}%)` : `② 이어서 A를 하는 중 (${Math.round((t - 1) * 100)}%)` }], 'tl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ea = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  const eb = matrixEditor(eds, { name: 'B', prefix: 'B', get: () => B, set: (M) => ((B = M), sync()) });
  let stop: (() => void) | null = null;
  const go = (to: number) => {
    stop?.();
    const from = t;
    stop = animate(1300, (u) => ((t = from + (to - from) * u), sync()), () => (stop = null));
  };
  buttons(panel, [
    { label: '처음', on: () => go(0) },
    { label: '① B', on: () => go(1) },
    { label: '② 이어서 A', on: () => go(2) },
  ]);
  const sl = slider(panel, { label: '진행', min: 0, max: 2, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => fmt(v, 2) });
  const ro = readout(panel);
  hint(panel, '①이 끝나면 넓이가 det B, ②가 끝나면 그 넓이가 다시 det A 배가 됩니다. A와 B의 칸을 바꿔 보세요(음수 행렬식도).');

  function sync() {
    ea.refresh();
    eb.refresh();
    sl.refresh();
    const dA = det2(A), dB = det2(B), dAB = det2(matMul(A, B));
    ro.set(
      `<div>${chip('지금 넓이(부호 있음)', C.x, 'det')} = ${fmt(det2(shown()), 3)}</div>` +
        `<div class="eq">${chip('det B', C.ink, 'detB')} = ${fmt(dB, 3)}</div>` +
        `<div>${chip('det A', C.ink, 'detA')} = ${fmt(dA, 3)}</div>` +
        `<div>det A · det B = ${fmt(dA * dB, 3)}</div>` +
        `<div class="eq">${chip('det(AB)', C.ink, 'detAB')} = ${fmt(dAB, 3)}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
