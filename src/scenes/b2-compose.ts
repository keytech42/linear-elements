// 합성과 행렬 곱: "B를 먼저, 그다음 A" = AB (def.composition, prop.matmul-columns, prop.noncommutative)
// 진행 0 → 1: 항등에서 B까지. 진행 1 → 2: B에서 AB까지. 순서 바꾸기를 누르면 BA(= A를 먼저)를 같은 방식으로 보인다.
// 단계마다 𝐞₁, 𝐞₂의 도착지(주황, 청록)와 입력 𝐱(노랑)의 도착지(분홍)를 그린다.
//
// 매개변수: A (기본 90° 회전), B (기본 전단 [[1,1],[0,1]]), x (기본 [1, 1]), swap (기본 false)
// 동기화 키: col1, col2 (지금 단계 행렬의 열), x, Ax, A.col1 A.col2 B.col1 B.col2 (두 편집기의 열)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matMul, matVec, col, identity, type Mat } from '../la/mat';
import type { Vec } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, slider, animate, lerpMat } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [[0, -1], [1, 0]];
  let B: Mat = params.B ?? [[1, 1], [0, 1]];
  let x: Vec = params.x ?? [1, 1];
  let swap: boolean = params.swap ?? false;
  let t = 0;
  // 먼저 하는 것 F, 나중에 하는 것 G. 합성 = G·F
  const first = () => (swap ? A : B);
  const second = () => (swap ? B : A);
  const at = (t: number): Mat => (t <= 1 ? lerpMat(identity(2), first(), t) : matMul(lerpMat(identity(2), second(), t - 1), first()));

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.5, bus, height: 380 });
  p.draw = (p) => {
    p.grid();
    const M = at(t);
    p.tgrid(M);
    p.arrow([0, 0], col(M, 0), { color: C.c1, key: 'col1', label: t > 1.99 ? (swap ? 'BAe₁' : 'ABe₁') : '' });
    p.arrow([0, 0], col(M, 1), { color: C.c2, key: 'col2', label: t > 1.99 ? (swap ? 'BAe₂' : 'ABe₂') : '' });
    p.arrow([0, 0], x, { color: C.x, alpha: 0.5, width: 1.5, label: 'x', key: 'x' });
    p.arrow([0, 0], matVec(M, x), { color: C.y, key: 'Ax' });
    const stageName = t <= 1 ? `① ${swap ? 'A' : 'B'}를 먼저` : `② 이어서 ${swap ? 'B' : 'A'}`;
    p.hud([{ text: stageName, color: C.ink }], 'tl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eA = matrixEditor(eds, { name: 'A', prefix: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  const eB = matrixEditor(eds, { name: 'B', prefix: 'B', get: () => B, set: (M) => ((B = M), sync()) });
  const ts = slider(panel, { label: '진행', min: 0, max: 2, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${fmt(v, 2)} / 2` });
  let stop: (() => void) | null = null;
  buttons(panel, [
    { label: '▶ 처음부터', on: () => (stop?.(), (stop = animate(2400, (u) => ((t = 2 * u), sync())))) },
    { label: '순서 바꾸기', on: () => ((swap = !swap), (t = 0), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, '행렬 곱 AB는 오른쪽의 B를 먼저 한다. "순서 바꾸기"로 BA와 비교해 보세요. 마지막 단계의 주황·청록 화살표가 곱한 행렬의 두 열입니다.');

  function sync() {
    eA.refresh();
    eB.refresh();
    ts.refresh();
    const P = swap ? matMul(B, A) : matMul(A, B);
    const name = swap ? 'BA' : 'AB';
    const F = first();
    ro.set(
      `<div><b>${name}</b> = [${fmt(P[0][0])}, ${fmt(P[0][1])}; ${fmt(P[1][0])}, ${fmt(P[1][1])}]</div>` +
        `<div>${chip(`${name}의 1열`, C.c1, 'col1')} = ${swap ? 'B' : 'A'} × (${swap ? 'A' : 'B'}의 1열 (${fmt(F[0][0])}, ${fmt(F[1][0])}))</div>` +
        `<div>${chip(`${name}의 2열`, C.c2, 'col2')} = ${swap ? 'B' : 'A'} × (${swap ? 'A' : 'B'}의 2열 (${fmt(F[0][1])}, ${fmt(F[1][1])}))</div>` +
        `<div class="dim">AB와 BA${JSON.stringify(matMul(A, B)) === JSON.stringify(matMul(B, A)) ? '가 같다' : '는 다르다'}</div>`,
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
