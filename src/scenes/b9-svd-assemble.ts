// 세 다이얼로 행렬 조립하기 (exp.svd-assemble)
// 학습자가 θ_V(입력 쪽 회전), σ₁, σ₂(늘이기), θ_U(출력 쪽 회전), 뒤집기를 직접 맞춰 목표 행렬 A를 만든다.
// 타원 모양만 맞으면 안 된다. 주황·청록 화살표(e₁, e₂의 도착지)까지 겹쳐야 "같은 행렬"이다.
//
// 매개변수
//   target: 목표 행렬 (생략하면 무작위)
// 동기화 키: col1, col2 (지금 조립한 행렬의 열), t1, t2 (목표 행렬의 열)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, col, rotation, frobenius, matAdd, matScale, det2, type Mat } from '../la/mat';
import { svd2 } from '../la/svd';
import { fmt, chip, buttons, slider, toggle, matrixEditor } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  const randomTarget = (): Mat => {
    const r = () => Math.round((Math.random() * 3 - 1.5) * 2) / 2;
    let M: Mat;
    do M = [[r(), r()], [r(), r()]];
    while (Math.abs(det2(M)) < 0.5);
    return M;
  };
  let T: Mat = params.target ?? randomTarget();
  let thV = 0, thU = 0, s1 = 1, s2 = 1, flip = false;
  const built = (): Mat => {
    const U = matMul(rotation(thU), [[1, 0], [0, flip ? -1 : 1]]);
    return matMul(matMul(U, [[s1, 0], [0, s2]]), rotation(-thV));
  };

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3, bus, height: 400 });
  p.draw = (p) => {
    p.grid(0.5);
    const M = built();
    p.curve((a) => matVec(T, [Math.cos(a), Math.sin(a)]), 0, 2 * Math.PI, 120, { color: C.dim, width: 2, dash: [6, 5] });
    p.arrow([0, 0], col(T, 0), { color: C.c1, width: 1.5, dash: [6, 4], alpha: 0.6, key: 't1' });
    p.arrow([0, 0], col(T, 1), { color: C.c2, width: 1.5, dash: [6, 4], alpha: 0.6, key: 't2' });
    p.curve((a) => matVec(M, [Math.cos(a), Math.sin(a)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 2 });
    p.arrow([0, 0], col(M, 0), { color: C.c1, key: 'col1', label: 'Ae₁' });
    p.arrow([0, 0], col(M, 1), { color: C.c2, key: 'col2', label: 'Ae₂' });
    p.hud([{ text: '점선 = 목표, 실선 = 지금 조립한 행렬' }], 'bl');
  };

  const deg = (a: number) => `${Math.round((a * 180) / Math.PI)}°`;
  const sl = [
    slider(panel, { label: 'θ_V', min: -180, max: 180, step: 1, get: () => (thV * 180) / Math.PI, set: (v) => ((thV = (v * Math.PI) / 180), sync()), format: (v) => `${Math.round(v)}°` }),
    slider(panel, { label: 'σ₁', min: 0, max: 3, step: 0.01, get: () => s1, set: (v) => ((s1 = v), sync()) }),
    slider(panel, { label: 'σ₂', min: 0, max: 3, step: 0.01, get: () => s2, set: (v) => ((s2 = v), sync()) }),
    slider(panel, { label: 'θ_U', min: -180, max: 180, step: 1, get: () => (thU * 180) / Math.PI, set: (v) => ((thU = (v * Math.PI) / 180), sync()), format: (v) => `${Math.round(v)}°` }),
  ];
  const fl = toggle(panel, 'U에 뒤집기 넣기 (det < 0)', () => flip, (v) => ((flip = v), sync()));
  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const tEd = matrixEditor(eds, { name: '목표', get: () => T, prefix: 'T', colColors: true });
  const ro = readout(panel);
  buttons(panel, [
    {
      label: '정답 보기',
      on: () => {
        const r = svd2(T);
        thV = Math.atan2(r.V[1][0], r.V[0][0]);
        thU = Math.atan2(r.U[1][0], r.U[0][0]);
        flip = det2(r.U) < 0;
        [s1, s2] = r.S;
        sync();
      },
    },
    { label: '새 목표', on: () => ((T = randomTarget()), tEd.refresh(), sync()) },
    { label: '처음으로', on: () => ((thV = thU = 0), (s1 = s2 = 1), (flip = false), sync()) },
  ]);
  hint(panel, '순서 힌트: 먼저 σ₁, σ₂로 타원의 두 반지름을 맞추고, θ_U로 타원을 돌려 겹친 뒤, 마지막에 θ_V로 화살표를 맞춰 보세요. 목표의 행렬식이 음수라면 뒤집기가 필요합니다.');

  function sync() {
    sl.forEach((s) => s.refresh());
    fl.refresh();
    const M = built();
    const err = frobenius(matAdd(M, matScale(-1, T)));
    const ok = err < 0.08;
    ro.set(
      `<div>지금 = [${fmt(M[0][0])}, ${fmt(M[0][1])}; ${fmt(M[1][0])}, ${fmt(M[1][1])}]</div>` +
        `<div>목표와의 거리 ‖지금 − 목표‖ = ${fmt(err, 3)} <span class="verdict ${ok ? 'ok' : ''}">${ok ? '— 같은 행렬입니다' : ''}</span></div>` +
        `<div class="dim">${chip('θ_V', C.v)} ${deg(thV)} · ${chip('σ', C.u)} ${fmt(s1)}, ${fmt(s2)} · ${chip('θ_U', C.u)} ${deg(thU)}${flip ? ' · 뒤집기' : ''}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
