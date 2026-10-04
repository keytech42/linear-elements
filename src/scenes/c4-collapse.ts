// det → 0 : 평면이 직선으로 납작해진다 (prop.det-zero)
//
// 진행 s를 0에서 1로 올리면 둘째 열 𝐚₂가 처음 자리에서 k𝐚₁(첫째 열의 k배)로 곧게 옮겨 간다.
// 그동안 평행사변형의 넓이(= det)가 줄어들고, s = 1에서 격자 전체가 𝐚₁ 방향 직선 하나로 눌린다.
//
// 매개변수
//   a1: 첫째 열 (기본 [2, 1]),  a2: 둘째 열의 처음 자리 (기본 [-0.5, 1.5])
//   k:  끝에서 𝐚₂ = k𝐚₁ (기본 0.75)
// 동기화 키: col1, col2, det (평행사변형), line (납작해진 직선)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { fromCols, det2, type Mat } from '../la/mat';
import { add, scale, type Vec } from '../la/vec';
import { rank } from '../la/solve';
import { fmt, chip, slider, buttons, animate, matrixEditor } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  const a1: Vec = params.a1 ?? [2, 1];
  const a20: Vec = params.a2 ?? [-0.5, 1.5];
  const k: number = params.k ?? 0.75;
  let s = 0;
  const a2 = (): Vec => add(scale(1 - s, a20), scale(s, scale(k, a1)));
  const M = (): Mat => fromCols([a1, a2()]);
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.4, bus, height: 380 });

  p.draw = (p) => {
    p.grid();
    const A = M(), d = det2(A);
    p.tgrid(A, { color: 'rgba(120,170,255,0.3)' });
    if (Math.abs(d) < 1e-9) p.line([0, 0], a1, { color: C.y, width: 2.5, key: 'line' });
    const b = a2();
    p.poly([[0, 0], a1, add(a1, b), b], { fill: C.area, color: C.x, width: 1.3, key: 'det' });
    p.arrow([0, 0], a1, { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], b, { color: C.c2, label: 'a₂', key: 'col2' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => M() });
  let stop: (() => void) | null = null;
  buttons(panel, [
    {
      label: '▶ 납작하게',
      on: () => {
        stop?.();
        const from = s;
        stop = animate(1600, (u) => ((s = from + (1 - from) * u), sync()), () => (stop = null));
      },
    },
    { label: '처음으로', on: () => (stop?.(), (s = 0), sync()) },
  ]);
  const sl = slider(panel, { label: '진행 s', min: 0, max: 1, step: 0.01, get: () => s, set: (v) => ((s = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  const ro = readout(panel);
  hint(panel, `s = 1에서 둘째 열은 첫째 열의 ${fmt(k)}배가 됩니다. 그 순간 모든 출력 A𝐱 = x₁𝐚₁ + x₂𝐚₂가 𝐚₁ 방향 직선 위에 놓입니다.`);

  function sync() {
    med.refresh();
    sl.refresh();
    const A = M(), d = det2(A), r = rank(A);
    ro.set(
      `<div>${chip('det A', C.x, 'det')} = ${fmt(d, 3)}</div>` +
        `<div>열들이 스팬하는 것: ${r === 2 ? '평면 전체' : r === 1 ? chip('직선 하나', C.y, 'line') : '점 하나(원점)'}</div>` +
        `<div class="eq">${r === 2 ? '두 열은 선형 독립' : `<span style="color:${C.bad}">두 열은 선형 종속: a₂ = ${fmt(k)}·a₁</span>`}</div>`,
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
