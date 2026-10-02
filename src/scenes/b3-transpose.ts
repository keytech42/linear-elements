// 전치의 정체: (A𝐱)·𝐰 = 𝐱·(Aᵀ𝐰) (prop.transpose-dot)
//   왼쪽 = 출력 쪽: A𝐱(분홍)와 출력 쪽 벡터 𝐰(하늘). 두 벡터의 내적을 잰다.
//   오른쪽 = 입력 쪽: 𝐱(노랑)와 Aᵀ𝐰(하늘 점선). 두 벡터의 내적을 잰다.
//   어떻게 끌어도 두 내적이 같다. A는 𝐱를 출력 쪽으로 보내고, Aᵀ는 𝐰를 입력 쪽으로 보낸다.
//
// 매개변수
//   A: 처음 행렬 (기본 [[1, 2], [0, 1]])
//   x: 처음 입력 (기본 [1, 1]),  w: 출력 쪽 벡터 (기본 [2, -1])
// 동기화 키: x, Ax, w, ATw, dotL (왼쪽 내적), dotR (오른쪽 내적), col1, col2 (A의 열)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, transpose, type Mat } from '../la/mat';
import { dot, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip } from '../ui/widgets';
import { twin } from './_lib/b3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 2],
    [0, 1],
  ];
  let x: Vec = params.x ?? [1, 1];
  let w: Vec = params.w ?? [2, -1];
  const { stage, panel } = layout(host);
  const [L, R] = twin(stage, ['출력 쪽: A𝐱 와 𝐰', '입력 쪽: 𝐱 와 Aᵀ𝐰']);
  const pl = new Plane(L, { range: 4, bus, height: 330 });
  const pr = new Plane(R, { range: 4, bus, height: 330 });
  pl.handles.push({ key: 'w', get: () => w, set: (v) => ((w = v), sync()) });
  pr.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) });

  pl.draw = (p) => {
    p.grid();
    p.tgrid(A, { color: 'rgba(120,170,255,0.18)' });
    p.arrow([0, 0], matVec(A, x), { color: C.y, label: 'Ax', key: 'Ax' });
    p.arrow([0, 0], w, { color: C.u, label: 'w', key: 'w' });
  };
  pr.draw = (p) => {
    p.grid();
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    p.arrow([0, 0], matVec(transpose(A), w), { color: C.u, dash: [6, 4], label: 'Aᵀw', key: 'ATw' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ted = matrixEditor(eds, { name: 'Aᵀ', prefix: 'T', get: () => transpose(A), colColors: false });
  const eds2 = panel.appendChild(document.createElement('div'));
  eds2.className = 'eds';
  const ex = vectorEditor(eds2, { name: 'x', key: 'x', color: C.x, get: () => x, set: (v) => ((x = v), sync()) });
  const ew = vectorEditor(eds2, { name: 'w', key: 'w', color: C.u, get: () => w, set: (v) => ((w = v), sync()) });
  const ro = readout(panel);
  hint(panel, '오른쪽에서 𝐱를, 왼쪽에서 𝐰를 끌어 보세요. 행렬 A의 칸을 바꿔도 두 내적은 언제나 같습니다.');

  function sync() {
    med.refresh();
    ted.refresh();
    ex.refresh();
    ew.refresh();
    const y = matVec(A, x), z = matVec(transpose(A), w);
    const l = dot(y, w), r = dot(x, z);
    ro.set(
      `<div>${chip('Ax', C.y, 'Ax')} = (${fmt(y[0])}, ${fmt(y[1])}), ${chip('Aᵀw', C.u, 'ATw')} = (${fmt(z[0])}, ${fmt(z[1])})</div>` +
        `<div class="eq">${chip('(Ax)·w', C.ink, 'dotL')} = ${fmt(y[0])}·${fmt(w[0])} + ${fmt(y[1])}·${fmt(w[1])} = <b>${fmt(l, 3)}</b></div>` +
        `<div>${chip('x·(Aᵀw)', C.ink, 'dotR')} = ${fmt(x[0])}·${fmt(z[0])} + ${fmt(x[1])}·${fmt(z[1])} = <b>${fmt(r, 3)}</b></div>` +
        `<div style="color:${Math.abs(l - r) < 1e-9 ? C.ok : C.bad}">${Math.abs(l - r) < 1e-9 ? '두 내적이 같다' : '다르다'}</div>`,
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
