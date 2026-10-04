// 9장의 중심 장면: 단위원 → 타원. 가장 많이/적게 늘어나는 입력 방향(𝐯₁, 𝐯₂)은 서로 수직이고,
// 그 출력이 타원의 두 축(σ₁𝐮₁, σ₂𝐮₂)이 된다. (exp.circle-to-ellipse, prop.svd-ata)
//
// 매개변수
//   A:      처음 행렬 (기본 대칭이 아닌 [[1.2, 0.9], [0.3, 1.1]])
//   svd:    특이벡터/특이값을 그릴지 (기본 true). false면 "찾아보라" 모드
//   eig:    A의 고유벡터 방향(있다면)을 점선으로 겹쳐 그릴지 (기본 false) — 축과 고유 방향이 다르다는 것을 보이려고
//   probe:  탐침 각도(도, 기본 30)
// 동기화 키: col1, col2 (A의 열), x (탐침 입력), Ax (탐침 출력), v1, v2 (오른쪽 특이벡터), u1, u2 (σᵢ𝐮ᵢ)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Chart } from './_lib/chart';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { norm, scale, dot, type Vec } from '../la/vec';
import { svd2 } from '../la/svd';
import { eig2 } from '../la/eig';
import { matrixEditor, fmt, chip, toggle } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1.2, 0.9],
    [0.3, 1.1],
  ];
  let th = ((params.probe ?? 30) * Math.PI) / 180;
  let showSvd = params.svd ?? true;
  let showEig = params.eig ?? false;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 2.6, bus, height: 380 });
  const chartBox = document.createElement('div');
  chartBox.className = 'chart-box';
  stage.appendChild(chartBox);
  const chart = new Chart(chartBox, 120);

  const probe = (): Vec => [Math.cos(th), Math.sin(th)];
  p.handles.push(
    { key: 'col1', get: () => col(A, 0), set: (v) => ((A = [[v[0], A[0][1]], [v[1], A[1][1]]]), sync()) },
    { key: 'col2', get: () => col(A, 1), set: (v) => ((A = [[A[0][0], v[0]], [A[1][0], v[1]]]), sync()) },
    { key: 'x', get: probe, set: (v) => ((th = Math.atan2(v[1], v[0])), sync()), snap: 0 },
  );

  p.draw = (p) => {
    p.grid(0.5);
    const r = svd2(A);
    p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 100, { color: C.dim, width: 1.2, dash: [4, 4] });
    p.curve((t) => matVec(A, [Math.cos(t), Math.sin(t)]), 0, 2 * Math.PI, 160, { color: C.ink, width: 2 });
    p.arrow([0, 0], col(A, 0), { color: C.c1, width: 1.5, alpha: 0.55, key: 'col1', label: 'Ae₁' });
    p.arrow([0, 0], col(A, 1), { color: C.c2, width: 1.5, alpha: 0.55, key: 'col2', label: 'Ae₂' });
    if (showEig) {
      const e = eig2(A);
      if (e.kind === 'real') for (const v of e.vectors) p.line([0, 0], v, { color: C.dim, width: 1, dash: [2, 5] });
    }
    if (showSvd) {
      const v1 = col(r.V, 0), v2 = col(r.V, 1);
      p.arrow([0, 0], v1, { color: C.v, label: 'v₁', key: 'v1' });
      p.arrow([0, 0], v2, { color: C.v, label: 'v₂', key: 'v2', dash: [5, 3] });
      p.arrow([0, 0], scale(r.S[0], col(r.U, 0)), { color: C.u, label: 'σ₁u₁', key: 'u1' });
      p.arrow([0, 0], scale(r.S[1], col(r.U, 1)), { color: C.u, label: 'σ₂u₂', key: 'u2', dash: [5, 3] });
    }
    const x = probe();
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    p.arrow([0, 0], matVec(A, x), { color: C.y, label: 'Ax', key: 'Ax' });
    p.hud([{ text: '노란 점(x)을 단위원을 따라 돌려 보세요' }], 'bl');
  };

  // 아래 그래프: 탐침 각도 θ에 따른 늘어난 길이 ‖A(cos θ, sin θ)‖
  const N = 361;
  const xs = new Float64Array(N), ys = new Float64Array(N);
  chart.draw = (c) => {
    const r = svd2(A);
    for (let i = 0; i < N; i++) {
      const t = (i / (N - 1)) * 2 * Math.PI;
      xs[i] = (t * 180) / Math.PI;
      ys[i] = norm(matVec(A, [Math.cos(t), Math.sin(t)]));
    }
    c.xr = [0, 360];
    c.yr = [0, Math.max(1, r.S[0] * 1.15)];
    c.frame('입력 방향의 각 θ (도)', '늘어난 길이 ‖Ax‖', [0, r.S[1], r.S[0]].filter((v, i, a) => a.indexOf(v) === i));
    if (showSvd) {
      c.hline(r.S[0], C.u, 'σ₁');
      c.hline(r.S[1], C.u, 'σ₂');
      for (const k of [0, 1]) {
        const v = col(r.V, k);
        for (const s of [1, -1]) {
          let a = (Math.atan2(s * v[1], s * v[0]) * 180) / Math.PI;
          if (a < 0) a += 360;
          c.vline(a, C.v, k === 0 ? 'v₁' : 'v₂', k === 0 ? [] : [4, 3]);
        }
      }
    }
    c.line(xs, ys, C.ink, 2);
    let pa = (th * 180) / Math.PI;
    if (pa < 0) pa += 360;
    c.dot(pa, norm(matVec(A, probe())), C.x, 5);
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ro = readout(panel);
  toggle(panel, '특이벡터와 특이값 보기', () => showSvd, (v) => ((showSvd = v), sync()));
  toggle(panel, 'A의 고유 방향 겹쳐 보기', () => showEig, (v) => ((showEig = v), sync()));
  hint(panel, '타원의 가장 긴 반지름과 가장 짧은 반지름을 만드는 입력 방향을 찾아보세요. 두 방향은 언제나 서로 수직입니다.');

  function sync() {
    med.refresh();
    const r = svd2(A);
    const x = probe();
    const Ax = matVec(A, x);
    const v1 = col(r.V, 0), v2 = col(r.V, 1);
    let html = `<div>${chip('x', C.x, 'x')} = (${fmt(x[0])}, ${fmt(x[1])}) → ${chip('‖Ax‖', C.y, 'Ax')} = ${fmt(norm(Ax), 3)}</div>`;
    if (showSvd) {
      html +=
        `<div>${chip('σ₁', C.u, 'u1')} = ${fmt(r.S[0], 3)} <span class="dim">(가장 많이 늘어난 길이)</span></div>` +
        `<div>${chip('σ₂', C.u, 'u2')} = ${fmt(r.S[1], 3)} <span class="dim">(가장 적게 늘어난 길이)</span></div>` +
        `<div>${chip('v₁', C.v, 'v1')}·${chip('v₂', C.v, 'v2')} = ${fmt(dot(v1, v2), 3)} <span class="dim">(입력 쪽 두 방향이 수직)</span></div>` +
        `<div>${chip('u₁', C.u, 'u1')}·${chip('u₂', C.u, 'u2')} = ${fmt(dot(col(r.U, 0), col(r.U, 1)), 3)} <span class="dim">(출력 쪽 두 축도 수직)</span></div>`;
    }
    ro.set(html);
    p.invalidate();
    chart.invalidate();
  }
  sync();
  return () => {
    p.destroy();
    chart.destroy();
  };
};

export default scene;
