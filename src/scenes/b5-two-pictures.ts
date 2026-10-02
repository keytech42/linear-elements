// A𝐱 = 𝐛 를 두 눈으로: 왼쪽 = 열의 관점, 오른쪽 = 행의 관점 (def.linear-system)
//
// 매개변수
//   A:  2×2 행렬 (기본 [[2,1],[1,-1]])
//   b:  오른쪽 벡터 (기본 [5,1])
//   x:  처음 시도해 볼 x (기본 [1,1])
// 왼쪽(출력 평면): 주황 a₁, 청록 a₂, 분홍 고리 = 목표 b. 점선 = x₁a₁ 다음 x₂a₂, 끝의 분홍 화살표 = 지금의 Ax.
//                열이 한 직선 위에 있으면 옅은 분홍 띠 = 닿을 수 있는 곳 전부.
// 오른쪽(입력 평면): 하늘 직선 = 1번 방정식, 연두 직선 = 2번 방정식, 노란 점 = 지금의 x. 두 직선의 교점이 해.
// 동기화 키: col1, col2, b, x, Ax, row1, row2
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, row, type Mat } from '../la/mat';
import { solve, colBasis } from '../la/solve';
import { scale, dot, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, buttons } from '../ui/widgets';
import { twoStages, eqLine, vecTxt, near } from './_lib/b5-kit';

const PRESETS: { label: string; A: Mat; b: Vec }[] = [
  { label: '해 하나', A: [[2, 1], [1, -1]], b: [5, 1] },
  { label: '해 없음', A: [[1, 2], [2, 4]], b: [3, 1] },
  { label: '해 무수히', A: [[1, 2], [2, 4]], b: [3, 6] },
];

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? PRESETS[0].A;
  let b: Vec = params.b ?? PRESETS[0].b;
  let x: Vec = params.x ?? [1, 1];

  const { stage, panel } = layout(host);
  const [sl, sr] = twoStages(stage, ['열의 관점: b를 열들로 만들기', '행의 관점: 직선들의 교점']);
  const L = new Plane(sl, { range: params.range ?? 6, bus, height: 340, noZoom: true });
  const R = new Plane(sr, { range: params.rangeR ?? 4, bus, height: 340, noZoom: true });
  L.handles.push({ key: 'b', get: () => b, set: (v) => ((b = v), sync()) });
  R.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) });

  L.draw = (p) => {
    p.grid();
    const a1 = col(A, 0), a2 = col(A, 1);
    const cb = colBasis(A);
    if (cb.length === 1) p.line([0, 0], cb[0], { color: C.y, width: 7, alpha: 0.15 });
    p.arrow([0, 0], a1, { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: 'a₂', key: 'col2' });
    const s1 = scale(x[0], a1), y = matVec(A, x);
    p.arrow([0, 0], s1, { color: C.c1, width: 1.5, dash: [5, 4], alpha: 0.9 });
    p.arrow(s1, y, { color: C.c2, width: 1.5, dash: [5, 4], alpha: 0.9 });
    p.arrow([0, 0], y, { color: C.y, width: 2, alpha: 0.7, key: 'Ax' });
    p.dot(b, { color: C.y, r: 8, alpha: 0.35, key: 'b' });
    p.dot(b, { color: C.bg, r: 4 });
    p.text(b, 'b', { color: C.y, dx: 10, dy: -12 });
  };
  R.draw = (p) => {
    p.grid();
    const cols = [C.u, C.v];
    for (let i = 0; i < 2; i++) eqLine(p, row(A, i), b[i], { color: cols[i], width: 2, key: `row${i + 1}` });
    const s = solve(A, b);
    if (s.kind === 'unique') p.dot(s.x, { color: C.ink, r: 5 });
    p.dot(x, { color: C.x, r: 5, key: 'x' });
    p.text(x, 'x', { color: C.x, dx: 9, dy: -11 });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  const ved = vectorEditor(eds, { name: 'b', key: 'b', color: C.y, get: () => b, set: (v) => ((b = v), sync()) });
  const xed = vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x, set: (v) => ((x = v), sync()) });
  buttons(panel, PRESETS.map((q) => ({ label: q.label, on: () => ((A = q.A.map((r) => r.slice())), (b = q.b.slice()), sync()) })));
  buttons(panel, [{ label: '해로 맞추기', on: () => {
    const s = solve(A, b);
    if (s.kind !== 'none') ((x = s.x.slice()), sync());
  } }]);
  const ro = readout(panel);
  hint(panel, '왼쪽에서 분홍 고리 b를, 오른쪽에서 노란 점 x를 끌 수 있습니다.');

  function sync() {
    med.refresh();
    ved.refresh();
    xed.refresh();
    const y = matVec(A, x);
    const eq = (i: number) => {
      const r = row(A, i);
      return `${fmt(r[0])}·x₁ + ${fmt(r[1])}·x₂ = ${fmt(b[i])} <span class="dim">(지금 왼쪽 = ${fmt(dot(r, x))})</span>`;
    };
    let html = `<div>${chip('1번', C.u, 'row1')} ${eq(0)}</div><div>${chip('2번', C.v, 'row2')} ${eq(1)}</div>`;
    html += `<div>${chip('Ax', C.y, 'Ax')} = ${fmt(x[0])}${chip('a₁', C.c1, 'col1')} + ${fmt(x[1])}${chip('a₂', C.c2, 'col2')} = ${vecTxt(y)}${near(y, b, 1e-6) ? ' = b' : ''}</div>`;
    const s = solve(A, b);
    if (s.kind === 'unique') html += `<div style="color:${C.ok}">해가 하나: x = ${vecTxt(s.x)}</div>`;
    else if (s.kind === 'none') html += `<div style="color:${C.bad}">해가 없다: b가 열들이 닿는 곳 밖에 있다. 두 직선은 만나지 않는다.</div>`;
    else html += `<div style="color:${C.x}">해가 무수히 많다: ${vecTxt(s.x)} + t·${vecTxt(s.dirs[0] ?? [0, 0])}${s.dirs.length > 1 ? ' + …' : ''}</div>`;
    ro.set(html);
    L.invalidate();
    R.invalidate();
  }
  sync();
  return () => {
    L.destroy();
    R.destroy();
  };
};

export default scene;
