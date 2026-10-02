// 전단은 넓이를 바꾸지 않는다: 𝐚₂를 𝐚₁ 방향으로 밀어도 평행사변형의 넓이가 그대로다 (prop.det-formula)
//
// 평행사변형 (𝐚₁, 𝐚₂ + t𝐚₁)은 밑변이 언제나 𝐚₁이고, 윗변은 𝐚₂의 끝을 지나며 𝐚₁에 평행한 직선(점선) 위를 미끄러진다.
// 밑변과 높이가 그대로이므로 넓이도 그대로다. 한쪽에서 잘려 나간 삼각형(빨강 테두리)과 반대쪽에 붙은 삼각형(초록 테두리)은
// 서로를 평행 이동한 것이다.
//
// 매개변수
//   A: 처음 행렬 (기본 [[2, 0.5], [0.5, 1.5]]), 1열 = 𝐚₁, 2열 = 𝐚₂
//   t: 처음 미는 양 (기본 0)
// 동기화 키: col1, col2 (𝐚₁, 밀린 𝐚₂), base (밑변), height (높이), det (넓이), cut (잘린 삼각형), paste (붙은 삼각형)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, det2, fromCols, type Mat } from '../la/mat';
import { add, scale, sub, norm, project } from '../la/vec';
import { fmt, chip, slider } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  const A: Mat = params.A ?? [
    [2, 0.5],
    [0.5, 1.5],
  ];
  const a1 = col(A, 0), a2 = col(A, 1);
  let t: number = params.t ?? 0;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.2, bus, height: 360 });
  const b2 = () => add(a2, scale(t, a1));

  p.draw = (p) => {
    p.grid();
    const w = b2();
    p.line([0, 0], a1, { color: C.dim, width: 1, dash: [3, 5] });
    p.line(a2, a1, { color: C.dim, width: 1, dash: [3, 5] });
    // 처음 평행사변형(점선)과 지금 평행사변형(칠함)
    p.poly([[0, 0], a1, add(a1, a2), a2], { color: C.dim, width: 1, dash: [4, 4] });
    p.poly([[0, 0], a1, add(a1, w), w], { fill: C.area, color: C.x, width: 1.4, key: 'det' });
    // 잘린 삼각형 (0, a₂, w) 과 붙은 삼각형 (a₁, a₁+a₂, a₁+w): 서로 a₁만큼 평행 이동한 것
    if (Math.abs(t) > 1e-3) {
      p.poly([[0, 0], a2, w], { fill: 'rgba(255,93,108,0.12)', color: C.bad, width: 1.2, key: 'cut' });
      p.poly([a1, add(a1, a2), add(a1, w)], { fill: 'rgba(95,211,141,0.14)', color: C.ok, width: 1.2, key: 'paste' });
    }
    const f = project(w, a1);
    p.seg(f, w, { color: C.ink, width: 1.4, dash: [2, 3], key: 'height' });
    p.arrow([0, 0], a1, { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], w, { color: C.c2, label: t === 0 ? 'a₂' : 'a₂ + t a₁', key: 'col2' });
  };

  const sl = slider(panel, { label: '미는 양 t', min: -2, max: 2, step: 0.01, get: () => t, set: (v) => ((t = v), sync()) });
  const ro = readout(panel);
  hint(panel, '빨강 테두리 삼각형을 잘라 𝐚₁만큼 옮기면 초록 테두리 삼각형과 꼭 겹칩니다. 그래서 넓이가 그대로입니다. (t가 크면 삼각형이 평행사변형 밖으로 나가지만, 그때도 잘라 붙이기를 여러 번 하면 같은 결론입니다.)');

  function sync() {
    sl.refresh();
    const w = b2();
    const M = fromCols([a1, w]);
    const base = norm(a1);
    const height = norm(sub(w, project(w, a1)));
    ro.set(
      `<div>${chip('밑변', C.c1, 'col1')} ‖a₁‖ = ${fmt(base, 3)}</div>` +
        `<div>${chip('높이', C.ink, 'height')} = ${fmt(height, 3)}</div>` +
        `<div class="eq">밑변 × 높이 = ${fmt(base * height, 3)}</div>` +
        `<div>${chip('a₁₁a₂₂ − a₁₂a₂₁', C.x, 'det')} (밀린 열로) = ${fmt(det2(M), 3)}</div>` +
        `<div class="dim">t = ${fmt(t)}: 2열 = (${fmt(w[0])}, ${fmt(w[1])})</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
