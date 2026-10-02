// 같은 A𝐱를 두 가지로 읽는다 (prop.row-picture)
//   왼쪽 = 열의 관점: A𝐱 = x₁𝐚₁ + x₂𝐚₂ (열들을 이어 붙여 출력에 닿는다)
//   오른쪽 = 행의 관점: (A𝐱)ᵢ = (i행)·𝐱 (입력 𝐱를 각 행과 내적해서 출력의 성분을 하나씩 얻는다)
//   오른쪽의 두 점선은 "i행과의 내적이 지금 값과 같은 점들"의 직선이다. 둘 다 𝐱를 지나고, 각 행에 수직이다.
//
// 매개변수
//   A: 처음 행렬 (기본 [[2, 1], [-1, 1]])
//   x: 처음 입력 (기본 [1, 2])
// 동기화 키: col1, col2 (열), row1, row2 (행), x (입력), Ax (출력), x1a1, x2a2 (열의 관점의 두 조각), Ax1, Ax2 (출력의 두 성분)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matVecRows, col, row, type Mat } from '../la/mat';
import { dot, scale, perp2, project, norm, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip } from '../ui/widgets';
import { twin } from './_lib/b3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [2, 1],
    [-1, 1],
  ];
  let x: Vec = params.x ?? [1, 2];
  const { stage, panel } = layout(host);
  const [L, R] = twin(stage, ['열의 관점: 열들을 x₁, x₂만큼 섞는다', '행의 관점: 𝐱를 각 행과 내적한다']);
  const pl = new Plane(L, { range: 4, bus, height: 340 });
  const pr = new Plane(R, { range: 4, bus, height: 340 });

  const setCol = (j: number, v: Vec) => {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  };
  pl.handles.push({ key: 'col1', get: () => col(A, 0), set: (v) => setCol(0, v) }, { key: 'col2', get: () => col(A, 1), set: (v) => setCol(1, v) });
  const setRow = (i: number, v: Vec) => {
    A = A.map((r, k) => (k === i ? v.slice() : r));
    sync();
  };
  pr.handles.push(
    { key: 'x', get: () => x, set: (v) => ((x = v), sync()) },
    { key: 'row1', get: () => row(A, 0), set: (v) => setRow(0, v) },
    { key: 'row2', get: () => row(A, 1), set: (v) => setRow(1, v) },
  );

  pl.draw = (p) => {
    p.grid();
    const a1 = col(A, 0), a2 = col(A, 1), y = matVec(A, x);
    const s1 = scale(x[0], a1);
    p.arrow([0, 0], a1, { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: 'a₂', key: 'col2' });
    p.arrow([0, 0], s1, { color: C.c1, width: 1.5, dash: [5, 4], key: 'x1a1' });
    p.arrow(s1, y, { color: C.c2, width: 1.5, dash: [5, 4], key: 'x2a2' });
    p.arrow([0, 0], y, { color: C.y, label: 'Ax', key: 'Ax' });
  };
  pr.draw = (p) => {
    p.grid();
    const y = matVecRows(A, x);
    const rows = [row(A, 0), row(A, 1)];
    const cols = [C.u, C.v];
    rows.forEach((r, i) => {
      if (norm(r) < 1e-9) return;
      p.line(x, perp2(r), { color: cols[i], width: 1.2, dash: [6, 5], alpha: 0.8, key: `Ax${i + 1}` });
      const f = project(x, r);
      p.seg(x, f, { color: cols[i], width: 1, dash: [2, 4], alpha: 0.7 });
      p.seg([0, 0], f, { color: cols[i], width: 5, alpha: 0.35, key: `Ax${i + 1}` });
      p.arrow([0, 0], r, { color: cols[i], label: `${i + 1}행`, key: `row${i + 1}` });
    });
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    p.hud(
      [
        { text: `하늘 점선: 1행과의 내적이 ${fmt(y[0])}인 점들`, color: C.u },
        { text: `연두 점선: 2행과의 내적이 ${fmt(y[1])}인 점들`, color: C.v },
      ],
      'bl',
    );
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ved = vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x, set: (v) => ((x = v), sync()) });
  const ro = readout(panel);
  hint(panel, '왼쪽에서는 열(주황·청록)을, 오른쪽에서는 행(하늘·연두)과 입력 𝐱(노랑)를 끌 수 있습니다. 두 그림은 같은 행렬과 같은 𝐱를 씁니다.');

  function sync() {
    med.refresh();
    ved.refresh();
    const yc = matVec(A, x), yr = matVecRows(A, x);
    const r1 = row(A, 0), r2 = row(A, 1);
    const X = (s: string) => chip(s, C.x, 'x');
    ro.set(
      `<div><b>열의 관점</b></div>` +
        `<div>${chip('Ax', C.y, 'Ax')} = ${X(fmt(x[0]))}·${chip(`(${fmt(A[0][0])}, ${fmt(A[1][0])})`, C.c1, 'col1')} + ${X(fmt(x[1]))}·${chip(`(${fmt(A[0][1])}, ${fmt(A[1][1])})`, C.c2, 'col2')}</div>` +
        `<div>&nbsp;&nbsp;= ${chip(`(${fmt(yc[0])}, ${fmt(yc[1])})`, C.y, 'Ax')}</div>` +
        `<div class="eq"><b>행의 관점</b></div>` +
        `<div>${chip('(Ax)₁', C.u, 'Ax1')} = ${chip('1행', C.u, 'row1')}·${X('x')} = ${fmt(r1[0])}·${fmt(x[0])} + ${fmt(r1[1])}·${fmt(x[1])} = ${fmt(dot(r1, x))}</div>` +
        `<div>${chip('(Ax)₂', C.v, 'Ax2')} = ${chip('2행', C.v, 'row2')}·${X('x')} = ${fmt(r2[0])}·${fmt(x[0])} + ${fmt(r2[1])}·${fmt(x[1])} = ${fmt(dot(r2, x))}</div>` +
        `<div>&nbsp;&nbsp;→ ${chip(`(${fmt(yr[0])}, ${fmt(yr[1])})`, C.y, 'Ax')}</div>`,
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
