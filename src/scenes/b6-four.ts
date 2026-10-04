// 네 기본 부분공간 지도 (2×2): 입력 평면 = 행공간 + 영공간, 출력 평면 = 열공간 + 좌영공간 (exp.four-subspaces)
//
// 매개변수
//   A:  2×2 행렬 (기본 [[1,2],[3,6]], 랭크 1)
//   x:  입력 벡터 (기본 [3,1]). 왼쪽 그림에서 끌 수 있다
// 왼쪽(입력 평면): 하늘 직선 = 행공간, 연두 직선 = 영공간. 노란 x를 두 조각으로 나눈다:
//   하늘 점선 = 행공간 조각 x_r, 연두 점선 = 영공간 조각 x_n.
// 오른쪽(출력 평면): 분홍 띠 = 열공간, 회색 점선 = 좌영공간. 분홍 화살표 = Ax = A x_r.
// 동기화 키: rowspace, null, colspace, leftnull, x, xr, xn, Ax
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, transpose, type Mat } from '../la/mat';
import { rank, nullBasis, colBasis, rowBasis, orthonormalize, projectOntoSpan } from '../la/solve';
import { sub, type Vec } from '../la/vec';
import { matrixEditor, chip, buttons } from '../ui/widgets';
import { twoStages, vecTxt } from './_lib/b5-kit';

const PRESETS: { label: string; A: Mat }[] = [
  { label: '랭크 1', A: [[1, 2], [3, 6]] },
  { label: '랭크 2', A: [[2, 1], [1, 1]] },
  { label: '랭크 0', A: [[0, 0], [0, 0]] },
];

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? PRESETS[0].A;
  let x: Vec = params.x ?? [3, 1];

  const { stage, panel } = layout(host);
  const [sl, sr] = twoStages(stage, ['입력 평면 ℝ²: 행공간 + 영공간', '출력 평면 ℝ²: 열공간 + 좌영공간']);
  const L = new Plane(sl, { range: params.range ?? 4, bus, height: 340, noZoom: true });
  const R = new Plane(sr, { range: params.rangeR ?? 8, bus, height: 340, noZoom: true });
  L.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) });

  const parts = () => {
    const qr = orthonormalize(rowBasis(A));
    const xr = projectOntoSpan(qr, x);
    return { xr, xn: sub(x, xr) };
  };

  /** 부분공간을 그린다: 차원 1이면 직선, 2이면 평면 전체를 옅게 칠한다, 0이면 원점 */
  function sub2(p: Plane, basis: Vec[], color: string, key: string, dash?: number[]) {
    if (basis.length === 1) p.line([0, 0], basis[0], { color, width: 2.5, alpha: 0.8, key, dash });
    else if (basis.length === 2) {
      const { x0, x1, y0, y1 } = p.bounds;
      p.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], { fill: color, alpha: 0.07, key });
    } else p.dot([0, 0], { color, r: 6, key });
  }

  L.draw = (p) => {
    p.grid();
    sub2(p, rowBasis(A), C.u, 'rowspace');
    sub2(p, nullBasis(A), C.v, 'null');
    const { xr } = parts();
    p.arrow([0, 0], xr, { color: C.u, width: 1.8, dash: [5, 4], label: 'x_r', key: 'xr' });
    p.arrow(xr, x, { color: C.v, width: 1.8, dash: [5, 4], label: 'x_n', key: 'xn' });
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
  };
  R.draw = (p) => {
    p.grid();
    const cb = colBasis(A);
    if (cb.length === 1) p.line([0, 0], cb[0], { color: C.y, width: 7, alpha: 0.2, key: 'colspace' });
    else sub2(p, cb, C.y, 'colspace');
    sub2(p, nullBasis(transpose(A)), C.dim, 'leftnull', [6, 5]);
    p.arrow([0, 0], matVec(A, x), { color: C.y, label: 'Ax', key: 'Ax' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  buttons(panel, PRESETS.map((q) => ({ label: q.label, on: () => ((A = q.A.map((r) => r.slice())), sync()) })));
  const ro = readout(panel);
  hint(panel, '왼쪽의 노란 x를 끌어 보세요. 연두 조각 x_n을 아무리 바꿔도 오른쪽의 Ax는 움직이지 않습니다.');

  function sync() {
    med.refresh();
    const r = rank(A);
    const dn = nullBasis(A).length, dl = nullBasis(transpose(A)).length;
    const { xr, xn } = parts();
    let html = `<div>입력: 2 = ${chip(`행공간 ${r}`, C.u, 'rowspace')} + ${chip(`영공간 ${dn}`, C.v, 'null')}</div>`;
    html += `<div>출력: 2 = ${chip(`열공간 ${r}`, C.y, 'colspace')} + ${chip(`좌영공간 ${dl}`, C.dim, 'leftnull')}</div>`;
    html += `<div>${chip('x', C.x, 'x')} = ${chip(vecTxt(xr), C.u, 'xr')} + ${chip(vecTxt(xn), C.v, 'xn')}</div>`;
    html += `<div>A·x_r = ${vecTxt(matVec(A, xr))}, A·x_n = ${vecTxt(matVec(A, xn))}</div>`;
    html += `<div>${chip('Ax', C.y, 'Ax')} = ${vecTxt(matVec(A, x))}</div>`;
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
