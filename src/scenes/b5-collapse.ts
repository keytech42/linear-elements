// 납작해지는 변환은 되돌릴 수 없다: 한 직선 위의 입력이 모두 같은 출력으로 간다 (prop.inverse-exists)
//
// 매개변수
//   A:   처음 행렬 (기본 [[1,2],[2,4]], 행렬식 0)
//   x:   입력 벡터 (기본 [1,1]). 끌 수 있다
// 그림: 노란 점선 = x와 같은 출력으로 가는 입력 전부(x + t·n, n은 Ax = 0 의 해 방향)
//       노란 점들이 진행 막대를 따라 분홍 점 하나(Ax)로 모인다. 옅은 분홍 직선 = 출력이 닿을 수 있는 곳.
// 동기화 키: col1, col2, x, Ax, pre (같은 출력으로 가는 입력들), det
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, det2, identity, type Mat } from '../la/mat';
import { nullBasis, colBasis } from '../la/solve';
import { add, scale, type Vec } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, animate, lerpMat, slider } from '../ui/widgets';
import { vecTxt } from './_lib/b5-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 2],
    [2, 4],
  ];
  let x: Vec = params.x ?? [1, 1];
  let t = 0;
  const T = [-2, -1, 1, 2, 3];

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 5, bus, height: 380 });
  p.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()), enabled: () => t === 0 });

  p.draw = (p) => {
    const M = lerpMat(identity(2), A, t);
    p.grid();
    p.tgrid(M);
    const N = nullBasis(A);
    const Cb = colBasis(A);
    if (Cb.length === 1) p.line([0, 0], Cb[0], { color: C.y, width: 6, alpha: 0.16 });
    p.arrow([0, 0], col(M, 0), { color: C.c1, key: 'col1' });
    p.arrow([0, 0], col(M, 1), { color: C.c2, key: 'col2' });
    const y = matVec(A, x);
    if (N.length === 1) {
      const n = N[0];
      if (t === 0) p.line(x, n, { color: C.x, width: 1.5, dash: [6, 5], alpha: 0.8, key: 'pre' });
      for (const k of T) {
        const q = add(x, scale(k, n));
        const at = matVec(M, q);
        p.seg(q, at, { color: C.x, width: 1, alpha: 0.25 });
        p.dot(at, { color: C.x, r: 4, key: 'pre' });
      }
    }
    p.arrow([0, 0], matVec(M, x), { color: C.x, width: 2, alpha: 0.6, label: t === 0 ? 'x' : '', key: 'x' });
    p.dot(y, { color: C.y, r: 6, key: 'Ax' });
    p.text(y, 'Ax', { color: C.y, dx: 10, dy: -12 });
    p.hud([{ text: t === 0 ? '노란 점 x를 끌어 보세요' : '' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  const ro = readout(panel);
  const sl = slider(panel, { label: 'A 하기', min: 0, max: 1, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  let stop: (() => void) | null = null;
  buttons(panel, [
    { label: '▶ A 하기', on: () => ((stop?.(), (stop = animate(1400, (u) => ((t = u), sync()), () => (stop = null))))) },
    { label: '처음으로', on: () => ((stop?.(), (t = 0)), sync()) },
  ]);
  hint(panel, 'det A ≠ 0 이 되도록 칸을 바꾸면 노란 점선이 사라집니다. 그때는 출력 하나에 입력이 하나뿐입니다.');

  function sync() {
    med.refresh();
    sl.refresh();
    const d = det2(A);
    const y = matVec(A, x);
    const N = nullBasis(A);
    let html = `<div>${chip('det A', C.ink, 'det')} = ${fmt(d)}</div>`;
    html += `<div>${chip('x', C.x, 'x')} = ${vecTxt(x)} → ${chip('Ax', C.y, 'Ax')} = ${vecTxt(y)}</div>`;
    if (N.length === 1) {
      const n = N[0];
      const q = add(x, n);
      html += `<div>A·${vecTxt(n)} = ${vecTxt(matVec(A, n))}</div>`;
      html += `<div>그래서 ${chip(vecTxt(q), C.x, 'pre')} 도 → ${chip(vecTxt(matVec(A, q)), C.y, 'Ax')}</div>`;
      html += `<div class="dim">점선 위의 입력은 모두 같은 출력으로 간다. 출력만 보고는 어느 입력이었는지 알 수 없다.</div>`;
    } else if (N.length === 2) html += `<div class="dim">A = 0: 모든 입력이 원점으로 간다.</div>`;
    else html += `<div class="dim">det A ≠ 0: Ax = 0 이 되는 입력은 0뿐이다. 서로 다른 입력은 서로 다른 출력으로 간다.</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
