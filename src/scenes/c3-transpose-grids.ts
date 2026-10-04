// 전치: A의 행이 Aᵀ의 열이 된다 (def.transpose)
//   왼쪽 = A가 만드는 격자와 A의 두 열(주황·청록). A의 두 행은 하늘·연두 점선 화살표.
//   오른쪽 = Aᵀ가 만드는 격자와 Aᵀ의 두 열. Aᵀ의 열은 A의 행과 정확히 같은 화살표다.
//
// 매개변수
//   A: 처음 행렬 (기본 [[1, 2], [0, 1]])
// 동기화 키: row1, row2 (A의 행 = Aᵀ의 열), col1, col2 (A의 열), a11 … (A의 칸)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { transpose, col, row, type Mat } from '../la/mat';
import { matrixEditor, fmt, chip } from '../ui/widgets';
import { twin } from './_lib/c3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 2],
    [0, 1],
  ];
  const { stage, panel } = layout(host);
  const [L, R] = twin(stage, ['A: 열 = 𝐞₁, 𝐞₂의 도착지', 'Aᵀ: 열 = A의 행']);
  const pl = new Plane(L, { range: 3.5, bus, height: 320 });
  const pr = new Plane(R, { range: 3.5, bus, height: 320 });

  pl.draw = (p) => {
    p.grid();
    p.tgrid(A);
    p.arrow([0, 0], col(A, 0), { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], col(A, 1), { color: C.c2, label: 'a₂', key: 'col2' });
    p.arrow([0, 0], row(A, 0), { color: C.u, width: 1.6, dash: [5, 4], label: '1행', key: 'row1' });
    p.arrow([0, 0], row(A, 1), { color: C.v, width: 1.6, dash: [5, 4], label: '2행', key: 'row2' });
  };
  pr.draw = (p) => {
    p.grid();
    const T = transpose(A);
    p.tgrid(T);
    p.arrow([0, 0], col(T, 0), { color: C.u, label: 'Aᵀ의 1열', key: 'row1' });
    p.arrow([0, 0], col(T, 1), { color: C.v, label: 'Aᵀ의 2열', key: 'row2' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ted = matrixEditor(eds, { name: 'Aᵀ', prefix: 'T', get: () => transpose(A), colColors: false });
  const ro = readout(panel);
  hint(panel, 'A의 칸을 바꿔 보세요. 오른쪽 그림의 두 열은 언제나 왼쪽 그림의 두 행(점선)과 같습니다.');

  function sync() {
    med.refresh();
    ted.refresh();
    const T = transpose(A);
    ro.set(
      `<div>${chip('A의 1행', C.u, 'row1')} = (${fmt(A[0][0])}, ${fmt(A[0][1])}) = ${chip('Aᵀ의 1열', C.u, 'row1')} (${fmt(T[0][0])}, ${fmt(T[1][0])})</div>` +
        `<div>${chip('A의 2행', C.v, 'row2')} = (${fmt(A[1][0])}, ${fmt(A[1][1])}) = ${chip('Aᵀ의 2열', C.v, 'row2')} (${fmt(T[0][1])}, ${fmt(T[1][1])})</div>`,
    );
    pl.invalidate();
    pr.invalidate();
  }
  sync();
  return () => {
    pl.destroy();
    pr.destroy();
  };
};

export default scene;
