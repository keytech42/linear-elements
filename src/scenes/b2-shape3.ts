// 모양 m×n: 몇 차원에서 몇 차원으로 (def.shape)
//  mode '3x2': 3×2 행렬 — 평면(ℝ²)의 격자를 3차원 공간(ℝ³) 안의 기울어진 평면으로 보낸다. 열 2개 = 3차원 화살표 2개.
//  mode '2x3': 2×3 행렬 — 3차원의 단위 정육면체를 평면으로 납작하게 누른다. 열 3개 = 평면 위의 화살표 3개.
// 매개변수: mode (기본 '3x2'), A (모드에 맞는 모양)
// 동기화 키: col1 col2 col3 (열), a11… (칸)
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, shape, type Mat } from '../la/mat';
import type { Vec } from '../la/vec';
import { matrixEditor, el } from '../ui/widgets';

const COLS = [C.c1, C.c2, C.c3];

const scene: SceneFn = (host, { bus, params }) => {
  const mode: '3x2' | '2x3' = params.mode ?? '3x2';
  let A: Mat = params.A ?? (mode === '3x2' ? [[1, 0], [0, 1], [0.8, 0.5]] : [[1, 0, 0.6], [0, 1, 0.8]]);
  const root = el('div', 'scene-grid stacked');
  host.appendChild(root);
  const row = el('div', 'two-space');
  root.appendChild(row);
  const L = el('div'), R = el('div');
  row.append(L, R);
  L.appendChild(el('div', 'space-cap', mode === '3x2' ? '입력: 평면 ℝ² (열 2개 = 입력 성분 2개)' : '입력: 공간 ℝ³ (열 3개 = 입력 성분 3개)'));
  R.appendChild(el('div', 'space-cap', mode === '3x2' ? '출력: 공간 ℝ³ (행 3개 = 출력 성분 3개)' : '출력: 평면 ℝ² (행 2개 = 출력 성분 2개)'));

  let destroyers: (() => void)[] = [];
  let redraw: () => void = () => {};
  if (mode === '3x2') {
    const pin = new Plane(L, { range: 2.5, bus, height: 320 });
    const sout = new Space(R, { range: 2.6, height: 320, bus });
    pin.draw = (p) => {
      p.grid(0.5);
      p.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { fill: 'rgba(245,197,66,0.16)' });
      p.arrow([0, 0], [1, 0], { color: C.c1, label: 'e₁', key: 'col1' });
      p.arrow([0, 0], [0, 1], { color: C.c2, label: 'e₂', key: 'col2' });
    };
    sout.draw = (s) => {
      s.axes(2);
      for (let k = -2; k <= 2; k++) {
        s.seg(matVec(A, [k, -2]), matVec(A, [k, 2]), { color: C.tgrid, width: 1 });
        s.seg(matVec(A, [-2, k]), matVec(A, [2, k]), { color: C.tgrid, width: 1 });
      }
      s.poly([[0, 0], [1, 0], [1, 1], [0, 1]].map((v) => matVec(A, v)), { fill: 'rgba(245,197,66,0.25)' });
      s.arrow([0, 0, 0], col(A, 0), { color: C.c1, label: 'Ae₁', key: 'col1' });
      s.arrow([0, 0, 0], col(A, 1), { color: C.c2, label: 'Ae₂', key: 'col2' });
    };
    redraw = () => (pin.invalidate(), sout.invalidate());
    destroyers = [() => pin.destroy(), () => sout.destroy()];
  } else {
    const sin = new Space(L, { range: 2, height: 320, bus });
    const pout = new Plane(R, { range: 2.5, bus, height: 320 });
    const cube: Vec[] = [];
    for (const a of [0, 1]) for (const b of [0, 1]) for (const c of [0, 1]) cube.push([a, b, c]);
    const edges: [number, number][] = [];
    cube.forEach((p, i) => cube.forEach((q, j) => {
      if (i < j && p.reduce((s, v, k) => s + Math.abs(v - q[k]), 0) === 1) edges.push([i, j]);
    }));
    sin.draw = (s) => {
      s.axes(2);
      for (const [i, j] of edges) s.seg(cube[i], cube[j], { color: C.x, width: 1.2, alpha: 0.6 });
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((e, k) => s.arrow([0, 0, 0], e, { color: COLS[k], label: `e${'₁₂₃'[k]}`, key: `col${k + 1}` }));
    };
    pout.draw = (p) => {
      p.grid(0.5);
      for (const [i, j] of edges) p.seg(matVec(A, cube[i]), matVec(A, cube[j]), { color: C.y, width: 1.2, alpha: 0.6 });
      [0, 1, 2].forEach((k) => p.arrow([0, 0], col(A, k), { color: COLS[k], label: `Ae${'₁₂₃'[k]}`, key: `col${k + 1}` }));
    };
    redraw = () => (sin.invalidate(), pout.invalidate());
    destroyers = [() => sin.destroy(), () => pout.destroy()];
  }

  const panel = el('div', 'scene-panel');
  panel.style.borderLeft = '0';
  panel.style.borderTop = '1px solid var(--line)';
  root.appendChild(panel);
  const eds = el('div', 'eds');
  panel.appendChild(eds);
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), sync()) });
  const ro = readout(panel);
  hint(panel, mode === '3x2' ? '평면 전체가 공간 안의 평면 하나로 간다. 3×2 행렬은 공간 전체를 채울 수 없다(열이 2개뿐이므로). 3차원 그림은 끌어서 돌려 볼 수 있다.' : '공간의 정육면체가 평면 위로 납작하게 눌린다. 열 세 개가 평면 위의 화살표 세 개다. 셋은 평면에서 선형 독립일 수 없다.');

  function sync() {
    med.refresh();
    const [m, n] = shape(A);
    ro.set(`<div>모양 ${m}×${n}: 입력 ℝ<sup>${n}</sup>(열 ${n}개) → 출력 ℝ<sup>${m}</sup>(행 ${m}개)</div><div class="dim">열 하나 = 입력 기저 벡터 하나의 도착지 = 출력 공간의 벡터(성분 ${m}개)</div>`);
    redraw();
  }
  sync();
  return () => destroyers.forEach((f) => f());
};

export default scene;
