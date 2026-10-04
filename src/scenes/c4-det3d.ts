// 3차원: 단위 정육면체 → 평행육면체, det = 부호 있는 부피 배율 (exp.det-3d)
//
// 점선 = 단위 정육면체. 칠한 상자 = 세 열 𝐚₁(주황), 𝐚₂(청록), 𝐚₃(보라)가 만드는 평행육면체.
// 단추로 부피가 0이 되는 세 가지 방식을 불러올 수 있다: 한 열이 영벡터 / 두 열이 한 직선 위 / 세 열이 한 평면 위.
// 그림을 끌면 돌려 볼 수 있다.
//
// 매개변수
//   A: 처음 행렬 (기본 [[1.5, 0.3, 0.2], [0.2, 1.2, 0.4], [0, 0.3, 1.3]])
// 동기화 키: col1, col2, col3 (세 열), det (평행육면체/부피)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { C } from '../render/colors';
import { col, det3, matVec, identity, type Mat } from '../la/mat';
import { type Vec } from '../la/vec';
import { rank } from '../la/solve';
import { matrixEditor, fmt, chip, buttons, animate, slider, lerpMat } from '../ui/widgets';

// 단위 정육면체의 꼭짓점(0/1 세 개)과 면(꼭짓점 번호 넷)
const V: Vec[] = [];
for (let i = 0; i < 8; i++) V.push([i & 1, (i >> 1) & 1, (i >> 2) & 1]);
const FACES = [
  [0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5],
];
const EDGES: [number, number][] = [];
for (let i = 0; i < 8; i++) for (let b = 0; b < 3; b++) if (!(i & (1 << b))) EDGES.push([i, i | (1 << b)]);

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1.5, 0.3, 0.2],
    [0.2, 1.2, 0.4],
    [0, 0.3, 1.3],
  ];
  let t = 1;
  const shown = (): Mat => lerpMat(identity(3), A, t);
  const { stage, panel } = layout(host);
  const s = new Space(stage, { range: 2.6, bus, height: 400 });
  s.draw = (s) => {
    s.axes(2);
    for (const [i, j] of EDGES) s.seg(V[i], V[j], { color: C.dim, width: 1, dash: [3, 4] });
    const M = shown();
    const d = det3(M);
    const W = V.map((v) => matVec(M, v));
    const fill = Math.abs(d) < 1e-9 ? 'rgba(160,175,200,0.18)' : d > 0 ? 'rgba(245,197,66,0.13)' : 'rgba(255,93,108,0.15)';
    for (const f of FACES) s.poly(f.map((k) => W[k]), { fill, color: d >= 0 ? C.x : C.bad, width: 1, key: 'det' });
    s.arrow([0, 0, 0], col(M, 0), { color: C.c1, label: 'a₁', key: 'col1' });
    s.arrow([0, 0, 0], col(M, 1), { color: C.c2, label: 'a₂', key: 'col2' });
    s.arrow([0, 0, 0], col(M, 2), { color: C.c3, label: 'a₃', key: 'col3' });
    s.hud([{ text: '그림을 끌어 돌려 보세요' }]);
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), (t = 1), sync()) });
  const presets: [string, Mat][] = [
    ['기울인 상자', [[1.5, 0.3, 0.2], [0.2, 1.2, 0.4], [0, 0.3, 1.3]]],
    ['거울(z 뒤집기)', [[1, 0, 0], [0, 1, 0], [0, 0, -1]]],
    ['① 한 열이 0', [[1.5, 0.3, 0], [0.2, 1.2, 0], [0, 0.3, 0]]],
    ['② 두 열이 한 직선', [[1, 2, 0.2], [0.5, 1, 0.3], [0.2, 0.4, 1.2]]],
    ['③ 세 열이 한 평면', [[1, 0, 1], [0, 1, 1], [0.5, 0.5, 1]]],
  ];
  let stop: (() => void) | null = null;
  const load = (M: Mat) => {
    A = M.map((r) => r.slice());
    stop?.();
    stop = animate(1200, (u) => ((t = u), sync()), () => (stop = null));
  };
  buttons(panel, presets.map(([label, M]) => ({ label, on: () => load(M) })));
  const sl = slider(panel, { label: 'I에서 A로', min: 0, max: 1, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  const ro = readout(panel);
  hint(panel, '③의 셋째 열은 첫째 열과 둘째 열을 더한 것입니다. 그래서 세 열이 모두 한 평면 위에 놓이고, 상자가 판처럼 납작해집니다.');

  function sync() {
    med.refresh();
    sl.refresh();
    const M = shown(), d = det3(M), r = rank(M);
    const what = r === 3 ? '공간 전체' : r === 2 ? '평면 하나' : r === 1 ? '직선 하나' : '점 하나';
    ro.set(
      `<div>${chip('det A', C.x, 'det')} = ${fmt(d, 3)} <span class="dim">(부호 있는 부피)</span></div>` +
        `<div>부피 = ${fmt(Math.abs(d), 3)}, 향: ${Math.abs(d) < 1e-9 ? '말할 수 없음' : d > 0 ? '유지' : '뒤집힘'}</div>` +
        `<div class="eq">세 열이 스팬하는 것: ${what}</div>`,
    );
    s.invalidate();
  }
  sync();
  return () => {
    stop?.();
    s.destroy();
  };
};

export default scene;
