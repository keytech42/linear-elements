// 8권 장면: 대각화 A = P D P⁻¹ 를 세 단계로 (prop.diagonalization, prop.sym-ellipse)
// 오른쪽부터 읽는다. ① P⁻¹: 고유벡터 𝐯₁, 𝐯₂ 를 𝐞₁, 𝐞₂ 자리로 옮긴다(고유 좌표로 읽기).
// ② D: 가로로 λ₁배, 세로로 λ₂배 늘인다. ③ P: 다시 고유 방향으로 되돌린다. 세 단계를 마치면 A를 한 번 한 것과 같다.
// 파란 격자는 고유벡터로 만든 격자(k𝐯₁ + s𝐯₂ 꼴의 직선들)를 지금까지의 단계로 보낸 모양이다.
//
// 매개변수
//   A:       처음 행렬 (행 우선). 기본 [[4,-2],[1,1]]
//   x:       입력 벡터를 함께 보일지, 보인다면 처음 값 (예: [1,2])
//   circle:  단위원과 그 상을 그릴지 (기본 false)
//   orth:    대칭 행렬용 이름(Q, Λ, Qᵀ)으로 보이고, P⁻¹ 대신 전치 Qᵀ로 계산한다 (기본 false)
//   stage:   처음 단계 0~3 (기본 0)
//   lockA:   행렬을 못 바꾸게 (기본 false)
// 동기화 키
//   v1, v2  고유벡터와 그 상 (하늘, 연두) · x  입력 (노랑) · Ax  지금 단계까지 보낸 상 (분홍)
//   P, D, Pinv  세 인자 (orth일 때도 같은 키)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matMul, matVec, fromCols, inverse2, transpose, identity, det2, type Mat } from '../la/mat';
import { scale, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, buttons, animate, slider, lerpMat } from '../ui/widgets';
import { eigenDirs, clone, type EigenInfo } from './_lib/b8-util';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = clone(params.A ?? [[4, -2], [1, 1]]);
  let x: Vec | null = params.x ?? null;
  const orth = !!params.orth;
  let s: number = params.stage ?? 0; // 0 ~ 3
  const N = orth ? { P: 'Q', D: 'Λ', Pi: 'Qᵀ' } : { P: 'P', D: 'D', Pi: 'P⁻¹' };

  let info: EigenInfo;
  let ok = false;
  let P: Mat = identity(2), D: Mat = identity(2), Pi: Mat = identity(2);
  let v1: Vec = [1, 0], v2: Vec = [0, 1];
  function factor() {
    info = eigenDirs(A);
    ok = info.kind === 'two' || info.kind === 'all';
    if (!ok) return;
    const e = info as Extract<EigenInfo, { kind: 'two' | 'all' }>;
    v1 = e.dirs[0];
    v2 = e.dirs[1];
    if (det2(fromCols([v1, v2])) < 0) v2 = scale(-1, v2); // P가 뒤집기를 하지 않도록 𝐯₂의 부호를 고른다(여전히 고유벡터)
    P = fromCols([v1, v2]);
    D = [
      [e.values[0], 0],
      [0, e.values[1]],
    ];
    Pi = orth ? transpose(P) : inverse2(P);
  }
  factor();

  /** 단계 s(0~3)까지 보낸 변환. 정수 사이에서는 한 단계를 I에서 그 단계 행렬까지 고르게 섞는다. */
  const stageMat = (): Mat => {
    if (!ok) return identity(2);
    const steps = [Pi, D, P];
    let M = identity(2);
    const k = Math.min(2, Math.floor(s));
    for (let i = 0; i < k; i++) M = matMul(steps[i], M);
    return matMul(lerpMat(identity(2), steps[k], s - k), M);
  };

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 400 });
  if (x) p.handles.push({ key: 'x', get: () => x!, set: (v) => ((x = v), sync()), enabled: () => s === 0 });

  const LABEL = ['x', `${N.Pi}x`, `${N.D}${N.Pi}x`, 'Ax'];
  p.draw = (p) => {
    p.grid();
    if (!ok) {
      p.tgrid(A);
      if (info.kind === 'one') p.line([0, 0], info.dirs[0], { color: C.u, width: 2, dash: [9, 6], key: 'v1' });
      p.hud([{ text: info.kind === 'one' ? '고유 방향이 하나뿐: 고유벡터로 기저를 만들 수 없다' : '실수 고유벡터가 없다: 대각화할 수 없다', color: C.bad }], 'tl');
      return;
    }
    const M = stageMat();
    p.tgrid(matMul(M, P)); // 고유 격자의 상
    if (params.circle) {
      p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
      p.curve((t) => matVec(M, [Math.cos(t), Math.sin(t)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 2.2 });
    }
    const w1 = matVec(M, v1), w2 = matVec(M, v2);
    p.arrow([0, 0], w1, { color: C.u, label: Math.abs(s - Math.round(s)) < 1e-9 ? ['v₁', 'e₁', `${fmt(D[0][0])}e₁`, `${fmt(D[0][0])}v₁`][s] : '', key: 'v1' });
    p.arrow([0, 0], w2, { color: C.v, label: Math.abs(s - Math.round(s)) < 1e-9 ? ['v₂', 'e₂', `${fmt(D[1][1])}e₂`, `${fmt(D[1][1])}v₂`][s] : '', key: 'v2' });
    if (x) {
      p.arrow([0, 0], x, { color: C.x, width: 2, alpha: s === 0 ? 1 : 0.4, label: s === 0 ? 'x' : '', key: 'x' });
      if (s > 0) p.arrow([0, 0], matVec(M, x), { color: C.y, label: Number.isInteger(s) ? LABEL[s] : '', key: 'Ax' });
    }
    const what = [
      '처음: 파란 격자 = 고유벡터로 만든 격자',
      `① ${N.Pi}: v₁ → e₁, v₂ → e₂ (고유 좌표로 읽기)`,
      `② ${N.D}: 가로 ${fmt(D[0][0])}배, 세로 ${fmt(D[1][1])}배`,
      `③ ${N.P}: 고유 방향으로 되돌리기 = A`,
    ];
    p.hud([{ text: what[Math.min(3, Math.round(s))], color: C.ink }], 'tl');
  };

  // ── 오른쪽 패널 ──
  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: params.lockA ? undefined : (B) => ((A = B), factor(), sync()) });
  const ved = x ? vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x!, set: (v) => ((x = v), sync()) }) : null;
  const sl = slider(panel, { label: '단계', min: 0, max: 3, step: 0.01, get: () => s, set: (v) => ((s = v), sync()), format: (v) => `${fmt(v, 1)} / 3` });
  let stop: (() => void) | null = null;
  const go = (to: number, ms: number) => {
    stop?.();
    const from = s;
    stop = animate(ms, (u) => ((s = from + (to - from) * u), sync()), () => ((s = to), (stop = null), sync()));
  };
  buttons(panel, [
    { label: '▶ 차례로', on: () => ((s = 0), go(3, 4200)) },
    { label: '한 단계 ▶', on: () => go(Math.min(3, Math.floor(s + 1e-9) + 1), 1300) },
    { label: '처음으로', on: () => (stop?.(), (s = 0), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, `세 단계를 거친 결과(③)는 A를 곧바로 한 것과 같습니다. 행렬 A를 바꾸면 ${N.P}, ${N.D}, ${N.Pi}가 다시 계산됩니다.`);

  const m2 = (M: Mat) => `[${fmt(M[0][0])}, ${fmt(M[0][1])}; ${fmt(M[1][0])}, ${fmt(M[1][1])}]`;
  function sync() {
    med.refresh();
    ved?.refresh();
    sl.refresh();
    if (!ok) {
      ro.set(`<div style="color:${C.bad}">${info.kind === 'one' ? '고유벡터 두 개로 기저를 만들 수 없다' : '실수 고윳값이 없다'}</div><div class="dim">그래서 A = PDP⁻¹ 꼴로 쓸 수 없다.</div>`);
    } else {
      const back = matMul(matMul(P, D), Pi);
      ro.set(
        `<div>${chip(N.P, C.ink, 'P')} = [ ${chip(`(${fmt(v1[0])}, ${fmt(v1[1])})`, C.u, 'v1')} | ${chip(`(${fmt(v2[0])}, ${fmt(v2[1])})`, C.v, 'v2')} ]</div>` +
          `<div>${chip(N.D, C.ink, 'D')} = ${m2(D)}</div>` +
          `<div>${chip(N.Pi, C.ink, 'Pinv')} = ${m2(Pi)}</div>` +
          `<div class="dim">${N.P}${N.D}${N.Pi} = ${m2(back)}</div>`,
      );
    }
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
