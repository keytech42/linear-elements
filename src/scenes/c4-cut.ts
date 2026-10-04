// 2×2 행렬식의 공식을 잘라 내기로 보기 (prop.det-formula)
//
// 𝐚₁ = (a₁₁, a₂₁), 𝐚₂ = (a₁₂, a₂₂)가 만드는 평행사변형을 가로 a₁₁ + a₁₂, 세로 a₂₁ + a₂₂ 인 상자에 넣는다.
// 상자에서 직각삼각형 네 개(넓이 a₁₁a₂₁/2 두 개, a₁₂a₂₂/2 두 개)와 직사각형 두 개(넓이 a₁₂a₂₁ 두 개)를 떼어 내면
// 평행사변형만 남는다: (a₁₁ + a₁₂)(a₂₁ + a₂₂) − a₁₁a₂₁ − a₁₂a₂₂ − 2a₁₂a₂₁ = a₁₁a₂₂ − a₁₂a₂₁.
// 이 그림은 네 성분이 모두 0 이상이고 𝐚₂가 𝐚₁의 시계 반대 방향 쪽에 있을 때의 그림이다. 그 밖의 경우는 본문의 전단 논증이 맡는다.
//
// 매개변수
//   A:    처음 행렬 (기본 [[3, 1], [1, 2]])
//   step: 처음 단계 0~2 (기본 0)
// 동기화 키: col1, col2, box (상자), tri1 (a₁₁a₂₁/2 삼각형 둘), tri2 (a₁₂a₂₂/2 삼각형 둘), rect (a₁₂a₂₁ 직사각형 둘), det (평행사변형)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, det2, type Mat } from '../la/mat';
import { add, sub, scale, norm, type Vec } from '../la/vec';
import { polygonArea } from '../la/area';
import { matrixEditor, fmt, chip, buttons, animate, slider } from '../ui/widgets';

function pieces(A: Mat) {
  const [p, q] = col(A, 0), [r, s] = col(A, 1);
  const W = p + r, H = q + s;
  return {
    box: [[0, 0], [W, 0], [W, H], [0, H]] as Vec[],
    tri1: [
      [[0, 0], [p, 0], [p, q]],
      [[r, s], [W, H], [r, H]],
    ] as Vec[][],
    tri2: [
      [[p, q], [W, q], [W, H]],
      [[0, 0], [r, s], [0, s]],
    ] as Vec[][],
    rect: [
      [[p, 0], [W, 0], [W, q], [p, q]],
      [[0, s], [r, s], [r, H], [0, H]],
    ] as Vec[][],
    par: [[0, 0], [p, q], [W, H], [r, s]] as Vec[],
  };
}

const centroid = (P: Vec[]) => scale(1 / P.length, P.reduce((a, b) => add(a, b), [0, 0]));

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [3, 1],
    [1, 2],
  ];
  let t: number = params.step ?? 0;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.4, bus, height: 400 });
  const setCol = (j: number, v: Vec) => {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  };
  p.handles.push({ key: 'col1', get: () => col(A, 0), set: (v) => setCol(0, v) }, { key: 'col2', get: () => col(A, 1), set: (v) => setCol(1, v) });

  p.draw = (p) => {
    const P = pieces(A);
    const mid = centroid(P.box);
    p.grid();
    const off = (poly: Vec[], amt: number) => {
      const c = sub(centroid(poly), mid);
      const n = norm(c) || 1;
      const d = scale((0.9 * amt) / n, c);
      return poly.map((v) => add(v, d));
    };
    const k1 = Math.min(1, Math.max(0, t)), k2 = Math.min(1, Math.max(0, t - 1));
    p.poly(P.box, { color: C.ink, width: 1.2, dash: [6, 4], key: 'box' });
    p.poly(P.par, { fill: C.area, color: C.x, width: 1.5, key: 'det' });
    for (const T of P.tri1) p.poly(off(T, k1), { fill: 'rgba(255,122,89,0.28)', color: C.c1, width: 1, key: 'tri1' });
    for (const T of P.tri2) p.poly(off(T, k1), { fill: 'rgba(53,201,180,0.28)', color: C.c2, width: 1, key: 'tri2' });
    for (const R of P.rect) p.poly(off(R, k2), { fill: 'rgba(160,175,200,0.25)', color: C.dim, width: 1, key: 'rect' });
    p.arrow([0, 0], col(A, 0), { color: C.c1, label: 'a₁', key: 'col1' });
    p.arrow([0, 0], col(A, 1), { color: C.c2, label: 'a₂', key: 'col2' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  let stop: (() => void) | null = null;
  const go = (from: number, to: number) => {
    stop?.();
    stop = animate(1100, (u) => ((t = from + (to - from) * u), sync()), () => (stop = null));
  };
  buttons(panel, [
    { label: '① 상자만', on: () => go(t, 0) },
    { label: '② 삼각형 넷 떼기', on: () => go(t, 1) },
    { label: '③ 직사각형 둘 떼기', on: () => go(t, 2) },
  ]);
  const sl = slider(panel, { label: '진행', min: 0, max: 2, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${fmt(v, 1)}` });
  const ro = readout(panel);
  hint(panel, '떼어 낸 조각의 넓이를 모두 더해 상자의 넓이에서 빼면, 남은 평행사변형의 넓이가 나옵니다.');

  function sync() {
    med.refresh();
    sl.refresh();
    const P = pieces(A);
    const [a11, a21] = col(A, 0), [a12, a22] = col(A, 1);
    const box = polygonArea(P.box);
    const t1 = P.tri1.reduce((s, T) => s + polygonArea(T), 0);
    const t2 = P.tri2.reduce((s, T) => s + polygonArea(T), 0);
    const rc = P.rect.reduce((s, R) => s + polygonArea(R), 0);
    const left = box - t1 - t2 - rc;
    const fits = a11 >= 0 && a21 >= 0 && a12 >= 0 && a22 >= 0 && det2(A) > 0;
    ro.set(
      `<div>${chip('상자', C.ink, 'box')} = (${fmt(a11)} + ${fmt(a12)}) × (${fmt(a21)} + ${fmt(a22)}) = ${fmt(box, 3)}</div>` +
        `<div>− ${chip('삼각형 둘', C.c1, 'tri1')} 2 × ${fmt(a11)}·${fmt(a21)}/2 = ${fmt(t1, 3)}</div>` +
        `<div>− ${chip('삼각형 둘', C.c2, 'tri2')} 2 × ${fmt(a12)}·${fmt(a22)}/2 = ${fmt(t2, 3)}</div>` +
        `<div>− ${chip('직사각형 둘', C.dim, 'rect')} 2 × ${fmt(a12)}·${fmt(a21)} = ${fmt(rc, 3)}</div>` +
        `<div class="eq">남은 넓이 = ${fmt(left, 3)}</div>` +
        `<div>${chip('a₁₁a₂₂ − a₁₂a₂₁', C.x, 'det')} = ${fmt(a11)}·${fmt(a22)} − ${fmt(a12)}·${fmt(a21)} = ${fmt(det2(A), 3)}</div>` +
        (fits ? '' : `<div class="eq" style="color:${C.bad}">지금 모양은 이 그림의 조건(네 성분 ≥ 0, a₂가 a₁의 시계 반대 방향 쪽)을 벗어났습니다. 조각들이 겹치거나 상자 밖으로 나갑니다.</div>`),
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
