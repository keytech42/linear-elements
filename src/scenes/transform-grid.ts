// 이 교재의 중심 장면: 행렬 = 기저 벡터의 도착지 (def.matrix, def.matvec, prop.linear-grid, prop.basis-determines)
//
// 매개변수
//   A:        처음 행렬 (기본 [[1,1],[0,1]] 처럼 행 우선)
//   x:        입력 벡터를 보여 줄지, 보여 준다면 처음 값 (예: [2,1]). 생략하면 숨김
//   decompose: Ax = x₁a₁ + x₂a₂ 를 화살표 이어 붙이기로 보여 줄지 (기본 true)
//   ghost:    원래 격자를 옅게 남길지 (기본 true)
//   lockA:    행렬을 못 바꾸게 (기본 false)
//   morph:    "I에서 A로" 애니메이션 단추를 보일지 (기본 true)
//   square:   단위 정사각형을 칠할지 (기본 false)
//   circle:   단위원과 그 상을 그릴지 (기본 false)
//   presets:  변환 도감 단추(회전, 늘이기, 전단, 반사, 사영)를 보일지 (기본 false). 누르면 지금 행렬에서 그 행렬로 천천히 바뀐다
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, det2, identity, type Mat } from '../la/mat';
import { scale, add, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, buttons, animate, lerpMat, slider } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 1],
    [0, 1],
  ];
  const A0 = A.map((r) => r.slice());
  let x: Vec | null = params.x ?? null;
  const decompose = params.decompose ?? true;
  let t = 1; // 0 = 항등, 1 = A. 애니메이션 중에만 0~1 사이
  const shown = (): Mat => lerpMat(identity(2), A, t);

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 380 });

  p.handles.push(
    { key: 'col1', get: () => col(shown(), 0), set: (v) => setCol(0, v), enabled: () => !params.lockA && t === 1 },
    { key: 'col2', get: () => col(shown(), 1), set: (v) => setCol(1, v), enabled: () => !params.lockA && t === 1 },
  );
  if (x) p.handles.push({ key: 'x', get: () => x!, set: (v) => ((x = v), sync()) });

  function setCol(j: number, v: Vec) {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  }

  p.draw = (p) => {
    const M = shown();
    if (params.ghost !== false) p.grid();
    p.tgrid(M);
    const a1 = col(M, 0), a2 = col(M, 1);
    if (params.square) {
      const d = det2(M);
      p.poly([[0, 0], a1, add(a1, a2), a2], { fill: d >= 0 ? C.area : C.areaNeg, key: 'det' });
    }
    if (params.circle) {
      p.curve((th) => [Math.cos(th), Math.sin(th)], 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
      p.curve((th) => matVec(M, [Math.cos(th), Math.sin(th)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 2 });
    }
    p.arrow([0, 0], a1, { color: C.c1, label: t === 1 ? 'Ae₁' : '', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: t === 1 ? 'Ae₂' : '', key: 'col2' });
    if (x) {
      const y = matVec(M, x);
      if (decompose) {
        // Ax = x₁a₁ + x₂a₂ : a₁을 x₁배 한 화살표에 a₂를 x₂배 한 화살표를 이어 붙인다
        const s1 = scale(x[0], a1);
        p.arrow([0, 0], s1, { color: C.c1, width: 1.5, dash: [5, 4], alpha: 0.9, key: 'x1a1' });
        p.arrow(s1, y, { color: C.c2, width: 1.5, dash: [5, 4], alpha: 0.9, key: 'x2a2' });
      }
      p.arrow([0, 0], x, { color: C.x, width: 2, alpha: 0.55, label: 'x', key: 'x' });
      p.arrow([0, 0], y, { color: C.y, label: 'Ax', key: 'Ax' });
    }
    p.hud([{ text: params.lockA ? '' : '주황·청록 화살표 끝을 끌어 보세요' }], 'bl');
  };

  // ── 오른쪽 패널 ──
  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, {
    name: 'A',
    get: () => A,
    set: params.lockA ? undefined : (B) => ((A = B), sync()),
  });
  const ved = x ? vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x!, set: (v) => ((x = v), sync()) }) : null;
  const ro = readout(panel);
  if (params.morph !== false) {
    buttons(panel, [
      { label: '▶ I에서 A로', on: () => play(), title: '아무것도 하지 않는 변환에서 A까지 천천히' },
      ...(params.lockA ? [] : [{ label: '처음 행렬로', on: () => ((A = A0.map((r: number[]) => r.slice())), sync()) }]),
    ]);
  }
  if (params.presets) {
    const c = Math.cos(Math.PI / 6), s6 = Math.sin(Math.PI / 6);
    const P: [string, Mat][] = [
      ['30° 회전', [[c, -s6], [s6, c]]],
      ['가로 2배', [[2, 0], [0, 1]]],
      ['전단', [[1, 1], [0, 1]]],
      ['y = x 반사', [[0, 1], [1, 0]]],
      ['가로축 사영', [[1, 0], [0, 0]]],
      ['아무것도 안 함', [[1, 0], [0, 1]]],
    ];
    buttons(panel, P.map(([label, M]) => ({
      label,
      on: () => {
        stop?.();
        const from = A.map((r) => r.slice());
        stop = animate(900, (u) => ((A = lerpMat(from, M, u)), sync()), () => ((A = M.map((r) => r.slice())), sync(), (stop = null)));
      },
    })));
  }
  let tSlider: ReturnType<typeof slider> | null = null;
  if (params.morph !== false) tSlider = slider(panel, { label: '진행', min: 0, max: 1, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  hint(panel, '행렬의 칸을 좌우로 끌거나 눌러서 바꿀 수 있습니다. 칸에 마우스를 올리면 그림의 해당 화살표가 빛납니다.');

  let stop: (() => void) | null = null;
  function play() {
    stop?.();
    stop = animate(1400, (u) => ((t = u), sync()), () => (stop = null));
  }

  function sync() {
    med.refresh();
    ved?.refresh();
    tSlider?.refresh();
    const M = shown();
    const a1 = col(M, 0), a2 = col(M, 1);
    let html =
      `<div>${chip('e₁', C.c1, 'col1')} → ${chip(`(${fmt(a1[0])}, ${fmt(a1[1])})`, C.c1, 'col1')} <span class="dim">= A의 1열</span></div>` +
      `<div>${chip('e₂', C.c2, 'col2')} → ${chip(`(${fmt(a2[0])}, ${fmt(a2[1])})`, C.c2, 'col2')} <span class="dim">= A의 2열</span></div>`;
    if (x) {
      const y = matVec(M, x);
      html +=
        `<div class="eq">${chip('Ax', C.y, 'Ax')} = ${chip(fmt(x[0]), C.x, 'x')}·${chip('a₁', C.c1, 'x1a1')} + ${chip(fmt(x[1]), C.x, 'x')}·${chip('a₂', C.c2, 'x2a2')}` +
        ` = ${chip(`(${fmt(y[0])}, ${fmt(y[1])})`, C.y, 'Ax')}</div>`;
    }
    if (params.square) html += `<div>${chip('넓이 배율', C.x, 'det')} = ${fmt(det2(M))}</div>`;
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
