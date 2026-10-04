// SVD가 네 기본 부분공간에 좌표를 준다 (prop.svd-four-subspaces)
// 왼쪽 = 입력 공간 ℝ³, 오른쪽 = 출력 공간 ℝ³. 랭크 2인 3×3 행렬.
//   입력:  𝐯₁, 𝐯₂ (행공간을 펼치는 평면) · 𝐯₃ (영공간: 0으로 사라지는 방향)
//   출력:  𝐮₁, 𝐮₂ (열공간 평면) · 𝐮₃ (좌영공간: 어떤 입력으로도 닿지 않는 방향)
// 입력의 단위 구(위도선 몇 개)가 출력에서는 열공간 안의 납작한 타원판이 된다.
//
// 매개변수: A (3×3, 기본 [[1,1,0],[0,1,1],[1,2,1]] — 셋째 행 = 첫째 행 + 둘째 행)
// 동기화 키: v1 v2 v3 u1 u2 u3
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { scale, add, type Vec } from '../la/vec';
import { svd } from '../la/svd';
import { fmt, chip, matrixEditor, el } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 1, 0],
    [0, 1, 1],
    [1, 2, 1],
  ];
  const root = el('div', 'scene-grid stacked');
  host.appendChild(root);
  const row = el('div', 'two-space');
  root.appendChild(row);
  const L = el('div'), Rt = el('div');
  row.append(L, Rt);
  L.appendChild(el('div', 'space-cap', '입력 공간 ℝ³'));
  Rt.appendChild(el('div', 'space-cap', '출력 공간 ℝ³'));
  const sIn = new Space(L, { range: 2.2, height: 340, bus });
  const sOut = new Space(Rt, { range: 3.2, height: 340, bus });
  // 두 시점을 같이 돌린다(같은 ℝ³을 보는 것이므로)
  sIn.onView = () => {
    if (sOut.yaw !== sIn.yaw || sOut.pitch !== sIn.pitch) {
      sOut.yaw = sIn.yaw;
      sOut.pitch = sIn.pitch;
      sOut.invalidate();
    }
  };
  sOut.onView = () => {
    if (sOut.yaw !== sIn.yaw || sOut.pitch !== sIn.pitch) {
      sIn.yaw = sOut.yaw;
      sIn.pitch = sOut.pitch;
      sIn.invalidate();
    }
  };

  const tol = () => 1e-9 * Math.max(1, svd(A).S[0]);
  const lat = (z: number, n = 48): Vec[] => {
    const rr = Math.sqrt(1 - z * z);
    return Array.from({ length: n + 1 }, (_, i) => [rr * Math.cos((2 * Math.PI * i) / n), rr * Math.sin((2 * Math.PI * i) / n), z]);
  };
  const lon = (a: number, n = 48): Vec[] => Array.from({ length: n + 1 }, (_, i) => {
    const t = (Math.PI * i) / n;
    return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)];
  });
  const polyline = (s: Space, pts: Vec[], color: string, alpha = 0.5) => {
    for (let i = 1; i < pts.length; i++) s.seg(pts[i - 1], pts[i], { color, width: 1, alpha });
  };
  const disk = (s: Space, a: Vec, b: Vec, R: number, fill: string) => {
    const pts: Vec[] = Array.from({ length: 40 }, (_, i) => add(scale(R * Math.cos((2 * Math.PI * i) / 40), a), scale(R * Math.sin((2 * Math.PI * i) / 40), b)));
    s.poly(pts, { fill, alpha: 0.5 });
  };

  sIn.draw = (s) => {
    s.axes(2);
    const r = svd(A);
    const rk = r.S.filter((x) => x > tol()).length;
    for (const z of [-0.6, 0, 0.6]) polyline(s, lat(z), C.x, 0.35);
    for (const a of [0, Math.PI / 3, (2 * Math.PI) / 3]) polyline(s, lon(a), C.x, 0.35);
    const v = [0, 1, 2].map((k) => col(r.V, k));
    if (rk >= 2) disk(s, v[0], v[1], 1.6, 'rgba(166,227,106,0.10)');
    v.forEach((vk, k) => {
      const isNull = k >= rk;
      if (isNull) s.seg(scale(-2, vk), scale(2, vk), { color: C.v, width: 1, dash: [4, 4] });
      s.arrow([0, 0, 0], vk, { color: C.v, label: `v${'₁₂₃'[k]}${isNull ? ' (영공간)' : ''}`, key: `v${k + 1}` });
    });
  };
  sOut.draw = (s) => {
    s.axes(3);
    const r = svd(A);
    const rk = r.S.filter((x) => x > tol()).length;
    for (const z of [-0.6, 0, 0.6]) polyline(s, lat(z).map((p) => matVec(A, p)), C.y, 0.45);
    for (const a of [0, Math.PI / 3, (2 * Math.PI) / 3]) polyline(s, lon(a).map((p) => matVec(A, p)), C.y, 0.45);
    const u = [0, 1, 2].map((k) => col(r.U, k));
    if (rk >= 2) disk(s, u[0], u[1], 2.6, 'rgba(124,196,255,0.10)');
    u.forEach((uk, k) => {
      const isLeftNull = k >= rk;
      if (isLeftNull) s.seg(scale(-2.5, uk), scale(2.5, uk), { color: C.u, width: 1, dash: [4, 4] });
      s.arrow([0, 0, 0], isLeftNull ? uk : scale(r.S[k], uk), { color: C.u, label: isLeftNull ? `u${'₁₂₃'[k]} (좌영공간)` : `σ${'₁₂₃'[k]}u${'₁₂₃'[k]}`, key: `u${k + 1}` });
    });
  };

  const panel = el('div', 'scene-panel');
  panel.style.borderLeft = '0';
  panel.style.borderTop = '1px solid var(--line)';
  root.appendChild(panel);
  const eds = el('div', 'eds');
  panel.appendChild(eds);
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ro = readout(panel);
  hint(panel, '어느 쪽 그림이든 끌면 두 그림이 함께 돕니다. 노란 단위 구가 분홍 납작한 판이 되는 것을 보세요. 판의 평면이 열공간, 판에 수직인 점선이 좌영공간입니다. 셋째 행을 첫째 행 + 둘째 행이 아니게 바꾸면 랭크가 3이 되어 판이 부풀어 오릅니다.');

  function sync() {
    med.refresh();
    const r = svd(A);
    const rk = r.S.filter((x) => x > tol()).length;
    ro.set(
      `<div>특이값 σ = ${r.S.map((s) => fmt(s, 3)).join(', ')} → 랭크 ${rk}</div>` +
        `<div>${chip('행공간', C.v, 'v1')} = span(v₁…v${'₀₁₂₃'[rk]}) · 차원 ${rk}</div>` +
        `<div>${chip('영공간', C.v, 'v3')} 차원 ${3 - rk} <span class="dim">(3 = ${rk} + ${3 - rk})</span></div>` +
        `<div>${chip('열공간', C.u, 'u1')} = span(u₁…u${'₀₁₂₃'[rk]}) · 차원 ${rk}</div>` +
        `<div>${chip('좌영공간', C.u, 'u3')} 차원 ${3 - rk}</div>`,
    );
    sIn.invalidate();
    sOut.invalidate();
  }
  sync();
  return () => {
    sIn.destroy();
    sOut.destroy();
  };
};

export default scene;
