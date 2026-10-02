// 행렬 = 랭크 1 층들의 합 (prop.svd-sum)
// A𝐱 = σ₁(𝐯₁·𝐱)𝐮₁ + σ₂(𝐯₂·𝐱)𝐮₂ : 층 i는 "𝐯ᵢ 방향으로 읽고(내적), σᵢ배 해서, 𝐮ᵢ 방향으로 쓴다".
// 층 하나만 켜면 평면 전체가 직선 하나(𝐮ᵢ 방향)로 납작해진다: 랭크 1.
//
// 매개변수
//   A: 행렬 (기본 [[1.2, 0.9], [0.3, 1.1]]),  x: 입력 (기본 [1, 0.6])
// 동기화 키: x, Ax, v1, v2, L1, L2 (각 층의 출력)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, outer, matAdd, matScale, matVec, type Mat } from '../la/mat';
import { dot, scale, add, type Vec } from '../la/vec';
import { svd2 } from '../la/svd';
import { fmt, chip, toggle, matrixEditor } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1.2, 0.9],
    [0.3, 1.1],
  ];
  let x: Vec = params.x ?? [1, 0.6];
  let on = [true, true];
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 2.6, bus, height: 400 });
  p.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) });

  const layer = (k: number): Mat => {
    const r = svd2(A);
    return matScale(r.S[k], outer(col(r.U, k), col(r.V, k)));
  };
  const sum = (): Mat => {
    let M: Mat = [[0, 0], [0, 0]];
    on.forEach((o, k) => o && (M = matAdd(M, layer(k))));
    return M;
  };

  p.draw = (p) => {
    p.grid(0.5);
    const r = svd2(A);
    const M = sum();
    p.tgrid(M, { color: 'rgba(120,170,255,0.25)', extent: 5 });
    const v = [col(r.V, 0), col(r.V, 1)], u = [col(r.U, 0), col(r.U, 1)];
    // 입력 쪽: x를 v₁, v₂ 방향으로 읽기
    for (const k of [0, 1]) {
      p.line([0, 0], v[k], { color: C.v, width: 1, dash: [2, 6], alpha: 0.6 });
      const c = dot(v[k], x);
      p.seg(x, scale(c, v[k]), { color: C.v, width: 1, dash: [3, 3], alpha: 0.7 });
      p.dot(scale(c, v[k]), { color: C.v, r: 3.5, key: `v${k + 1}` });
    }
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    // 출력 쪽: 켜진 층들의 출력을 이어 붙이기
    let tip: Vec = [0, 0];
    for (const k of [0, 1]) {
      if (!on[k]) continue;
      const out = scale(r.S[k] * dot(v[k], x), u[k]);
      p.arrow(tip, add(tip, out), { color: C.u, width: 2, dash: [6, 3], key: `L${k + 1}`, label: `층${k + 1}` });
      tip = add(tip, out);
    }
    p.arrow([0, 0], matVec(M, x), { color: C.y, label: on[0] && on[1] ? 'Ax' : '근사', key: 'Ax' });
    p.hud([{ text: on[0] && on[1] ? '두 층을 모두 더하면 A 그대로' : on[0] || on[1] ? '층 하나 = 랭크 1: 평면 전체가 직선 하나로' : '층이 없으면 모든 것이 원점으로' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  toggle(panel, '층 1: σ₁ u₁ v₁ᵀ', () => on[0], (b) => ((on[0] = b), sync()));
  toggle(panel, '층 2: σ₂ u₂ v₂ᵀ', () => on[1], (b) => ((on[1] = b), sync()));
  const ro = readout(panel);
  hint(panel, '노란 x를 끌어 보세요. 초록 점은 x를 v₁, v₂ 방향으로 읽은 값(내적)입니다. 층 i는 그 값에 σᵢ를 곱해 uᵢ 방향으로 내보냅니다.');

  function sync() {
    med.refresh();
    const r = svd2(A);
    const c = [dot(col(r.V, 0), x), dot(col(r.V, 1), x)];
    ro.set(
      `<div>${chip('v₁·x', C.v, 'v1')} = ${fmt(c[0])} → ${chip(`σ₁(v₁·x) = ${fmt(r.S[0] * c[0])}`, C.u, 'L1')} 만큼 u₁ 방향</div>` +
        `<div>${chip('v₂·x', C.v, 'v2')} = ${fmt(c[1])} → ${chip(`σ₂(v₂·x) = ${fmt(r.S[1] * c[1])}`, C.u, 'L2')} 만큼 u₂ 방향</div>` +
        `<div class="dim">층 1 = [${layer(0).map((row) => row.map((v) => fmt(v)).join(', ')).join('; ')}]</div>` +
        `<div class="dim">층 2 = [${layer(1).map((row) => row.map((v) => fmt(v)).join(', ')).join('; ')}]</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
