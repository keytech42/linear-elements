// A = UΣVᵀ 를 오른쪽부터 한 단계씩 실행한다: ① Vᵀ(회전) → ② Σ(축 방향 늘이기) → ③ U(회전 또는 반사)  (prop.svd)
// 반사(det U < 0)는 회전을 이어서 만들 수 없으므로 ③에서 한 축이 0을 지나 뒤집히는 모습으로 보인다(정직한 애니메이션).
//
// 매개변수
//   A: 처음 행렬 (기본 [[1.2, 0.9], [0.3, 1.1]])
//   t: 처음 진행 단계 0~3 (기본 0)
// 동기화 키: s1, s2, s3 (세 단계), col1, col2, v1, v2, u1, u2
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, col, rotation, det2, type Mat } from '../la/mat';
import { scale, type Vec } from '../la/vec';
import { svd2 } from '../la/svd';
import { matrixEditor, fmt, chip, buttons, animate, slider } from '../ui/widgets';

// 비대칭 글자 "F": 회전과 반사를 눈으로 구별하게 해 준다
const F: Vec[] = [
  [-0.35, -0.6], [-0.15, -0.6], [-0.15, -0.05], [0.25, -0.05], [0.25, 0.12], [-0.15, 0.12],
  [-0.15, 0.42], [0.4, 0.42], [0.4, 0.6], [-0.35, 0.6],
];

export function svdStages(A: Mat) {
  const r = svd2(A);
  const thV = Math.atan2(r.V[1][0], r.V[0][0]); // V = R(thV)  (svd2가 det V = +1로 맞춘다)
  const thU = Math.atan2(r.U[1][0], r.U[0][0]);
  const flip = det2(r.U) < 0; // U = R(thU)·diag(1, −1)
  /** 진행 t(0~3)에서의 부분 곱 */
  const at = (t: number): Mat => {
    const s1 = Math.min(1, Math.max(0, t));
    const s2 = Math.min(1, Math.max(0, t - 1));
    const s3 = Math.min(1, Math.max(0, t - 2));
    let M = rotation(-thV * s1);
    M = matMul([[1 + (r.S[0] - 1) * s2, 0], [0, 1 + (r.S[1] - 1) * s2]], M);
    const Up = matMul(rotation(thU * s3), [[1, 0], [0, flip ? 1 - 2 * s3 : 1]]);
    return matMul(Up, M);
  };
  return { r, thV, thU, flip, at };
}

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1.2, 0.9],
    [0.3, 1.1],
  ];
  let t = params.t ?? 0;
  let st = svdStages(A);
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 2.4, bus, height: 400 });

  p.draw = (p) => {
    p.grid(0.5);
    const M = st.at(t);
    p.tgrid(M, { color: 'rgba(120,170,255,0.22)', extent: 6 });
    p.curve((a) => [Math.cos(a), Math.sin(a)], 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [3, 5] });
    p.curve((a) => matVec(M, [Math.cos(a), Math.sin(a)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 2 });
    p.poly(F.map((v) => matVec(M, v)), { fill: 'rgba(245,197,66,0.22)', color: C.x, width: 1.2 });
    // 오른쪽 특이벡터를 따라가 보면: v₁ → e₁ → σ₁e₁ → σ₁u₁
    const v1 = col(st.r.V, 0), v2 = col(st.r.V, 1);
    p.arrow([0, 0], matVec(M, v1), { color: C.v, label: t < 0.02 ? 'v₁' : '', key: 'v1' });
    p.arrow([0, 0], matVec(M, v2), { color: C.v, label: t < 0.02 ? 'v₂' : '', key: 'v2', dash: [5, 3] });
    p.arrow([0, 0], matVec(M, [1, 0]), { color: C.c1, width: 1.5, alpha: 0.7, key: 'col1' });
    p.arrow([0, 0], matVec(M, [0, 1]), { color: C.c2, width: 1.5, alpha: 0.7, key: 'col2' });
    if (t > 2.98) {
      p.text(scale(st.r.S[0], col(st.r.U, 0)), 'σ₁u₁', { color: C.u, dx: 8, dy: 12 });
      p.text(scale(st.r.S[1], col(st.r.U, 1)), 'σ₂u₂', { color: C.u, dx: 8, dy: 12 });
    }
    const stageName = t < 1 ? '① Vᵀ: 회전' : t < 2 ? '② Σ: 축 방향으로 늘이기' : st.flip ? '③ U: 반사 + 회전' : '③ U: 회전';
    p.hud([{ text: stageName, color: C.ink }], 'tl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), (st = svdStages(A)), sync()) });
  const formula = readout(panel);
  const ts = slider(panel, { label: '진행', min: 0, max: 3, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${fmt(v, 2)} / 3` });
  let stop: (() => void) | null = null;
  const go = (from: number, to: number) => {
    stop?.();
    stop = animate(900 * Math.abs(to - from) + 200, (u) => ((t = from + (to - from) * u), sync()), () => (stop = null));
  };
  buttons(panel, [
    { label: '▶ 처음부터', on: () => go(0, 3) },
    { label: '① 회전', on: () => go(0, 1) },
    { label: '② 늘이기', on: () => go(1, 2) },
    { label: '③ 회전', on: () => go(2, 3) },
  ]);
  const ro = readout(panel);
  hint(panel, '노란 F와 초록 화살표(v₁, v₂)를 따라가 보세요. ①이 끝나면 v₁, v₂가 정확히 가로축과 세로축에 놓이고, ②는 그 두 축을 따로 늘이기만 합니다.');

  function sync() {
    med.refresh();
    ts.refresh();
    const on = (k: number) => (t > k && t <= k + 1) || (k === 0 && t === 0) ? 'on-stage' : '';
    formula.set(
      `<div class="svd-formula"><span>A</span> = <span class="stg ${on(2)}" data-sync="s3">U</span><span class="stg ${on(1)}" data-sync="s2">Σ</span><span class="stg ${on(0)}" data-sync="s1">Vᵀ</span></div>`,
    );
    const { r } = st;
    const deg = (a: number) => `${fmt((a * 180) / Math.PI, 1)}°`;
    ro.set(
      `<div>${chip('Vᵀ', C.v, 's1')}: ${deg(-st.thV)} 회전 <span class="dim">(v₁을 가로축으로)</span></div>` +
        `<div>${chip('Σ', C.u, 's2')}: 가로 ×${fmt(r.S[0], 3)}, 세로 ×${fmt(r.S[1], 3)}</div>` +
        `<div>${chip('U', C.u, 's3')}: ${st.flip ? '세로축 뒤집기, 그다음 ' : ''}${deg(st.thU)} 회전</div>` +
        `<div class="dim">검산: UΣVᵀ = [${fmt(st.at(3)[0][0])}, ${fmt(st.at(3)[0][1])}; ${fmt(st.at(3)[1][0])}, ${fmt(st.at(3)[1][1])}]</div>`,
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
