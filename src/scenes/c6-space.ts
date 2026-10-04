// 3차원에서 보는 열공간, 영공간, 행공간 (def.column-space, def.rank, def.null-space, prop.rank-nullity, prop.row-null-perp)
//
// 매개변수
//   A:     행렬 (행 우선). 'col' 'null' 'both' 모드는 3×3, 'row' 모드는 m×3 (m = 1, 2, 3)
//   mode:  'col'  열공간(분홍 면/선)과 열 세 개
//          'null' 영공간(연두)이 원점으로 납작해지는 모습
//          'both' 둘 다 + 차원 세기
//          'row'  행(하늘 화살표), 행공간(하늘 면/선), 영공간(연두). 변형 막대 없음
//   x:     따라가 볼 입력 벡터 (기본 [1, 0.5, 1]). 생략하려면 false
//   range: 보이는 범위 (기본 3.5)
// 색: 주황·청록·보라 = A의 1·2·3열, 분홍 면 = 열공간(출력이 닿는 곳), 연두 = 영공간, 하늘 = 행과 행공간,
//     노랑 = 입력 x, 분홍 화살표 = 출력 Ax, 파란 선 = 단위 정육면체의 상.
// 동기화 키: col1, col2, col3, colspace, null, rowspace, row1, row2, row3, x, Ax, rank
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { C } from '../render/colors';
import { matVec, col, row, identity, shape, type Mat } from '../la/mat';
import { rank, nullBasis, colBasis, rowBasis, orthonormalize } from '../la/solve';
import { add, scale, dot, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, chip, buttons, animate, lerpMat, slider, fmt } from '../ui/widgets';
import { vecTxt } from './_lib/c5-kit';

const PRESETS: Record<string, { label: string; A: Mat }[]> = {
  square: [
    { label: '랭크 3', A: [[2, 0, 0], [0, 1, 0], [1, 0, 1]] },
    { label: '랭크 2', A: [[1, 0, 1], [0, 1, 1], [1, 1, 2]] },
    { label: '랭크 1', A: [[1, 2, -1], [1, 2, -1], [1, 2, -1]] },
  ],
  row: [
    { label: '2×3, 랭크 2', A: [[1, 0, 1], [0, 1, 1]] },
    { label: '3×3, 랭크 2', A: [[1, 0, 1], [0, 1, 1], [1, 1, 2]] },
    { label: '1×3', A: [[1, 2, -1]] },
  ],
};

const scene: SceneFn = (host, { bus, params }) => {
  const mode: 'col' | 'null' | 'both' | 'row' = params.mode ?? 'col';
  const rowMode = mode === 'row';
  let A: Mat = params.A ?? (rowMode ? PRESETS.row[0].A : PRESETS.square[1].A);
  let x: Vec | null = params.x === false ? null : (params.x ?? [1, 0.5, 1]);
  let t = rowMode ? 0 : (params.t ?? 0);
  const L = 2.6;

  const { stage, panel } = layout(host);
  const s = new Space(stage, { range: params.range ?? 3.5, bus, height: 400 });

  /** 부분공간 하나(기저 vs)를 M으로 보낸 모습: 0차원은 점, 1차원은 선분, 2차원은 평행사변형 */
  function drawSub(s: Space, vs: Vec[], M: Mat, color: string, key: string, fillAlpha = 0.18) {
    const q = orthonormalize(vs);
    const f = (v: Vec) => matVec(M, v);
    if (q.length === 1) {
      s.seg(f(scale(-L, q[0])), f(scale(L, q[0])), { color, width: 4, alpha: 0.75, key });
    } else if (q.length === 2) {
      const c = [add(scale(L, q[0]), scale(L, q[1])), add(scale(-L, q[0]), scale(L, q[1])), add(scale(-L, q[0]), scale(-L, q[1])), add(scale(L, q[0]), scale(-L, q[1]))].map(f);
      s.poly(c, { fill: color, alpha: fillAlpha, color, width: 1, key });
    }
  }

  s.draw = (s) => {
    s.axes(3);
    const [m] = shape(A);
    if (rowMode) {
      drawSub(s, rowBasis(A), identity(3), C.u, 'rowspace', 0.16);
      drawSub(s, nullBasis(A), identity(3), C.v, 'null');
      for (let i = 0; i < m; i++) s.arrow([0, 0, 0], row(A, i), { color: C.u, label: `${i + 1}행`, key: `row${i + 1}` });
      const nb = nullBasis(A);
      if (nb.length === 1) s.text(scale(1.15, nb[0]), 'N(A)', C.v);
      if (x) s.arrow([0, 0, 0], x, { color: C.x, label: 'x', key: 'x' });
      return;
    }
    const M = lerpMat(identity(3), A, t);
    // 단위 정육면체의 상
    const corner = (i: number): Vec => matVec(M, [i & 1, (i >> 1) & 1, (i >> 2) & 1]);
    for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) s.seg(corner(i), corner(i | bit), { color: C.tgrid, width: 1.2 });
    if (mode === 'col' || mode === 'both') {
      const cb = colBasis(A);
      if (cb.length < 3) drawSub(s, cb, identity(3), C.y, 'colspace', 0.1 + 0.12 * t);
      s.arrow([0, 0, 0], col(M, 0), { color: C.c1, label: t > 0.99 ? 'a₁' : '', key: 'col1' });
      s.arrow([0, 0, 0], col(M, 1), { color: C.c2, label: t > 0.99 ? 'a₂' : '', key: 'col2' });
      s.arrow([0, 0, 0], col(M, 2), { color: C.c3, label: t > 0.99 ? 'a₃' : '', key: 'col3' });
    }
    if (mode === 'null' || mode === 'both') {
      const nb = nullBasis(A);
      drawSub(s, nb, M, C.v, 'null', 0.22);
      if (nb.length === 1 && t < 0.9) s.text(matVec(M, scale(1.2, orthonormalize(nb)[0])), 'N(A)', C.v);
      if (nb.length > 0) s.dot([0, 0, 0], { color: C.v, r: 4 + 3 * t });
    }
    if (x) {
      s.arrow([0, 0, 0], x, { color: C.x, width: 2, alpha: 0.5, label: 'x', key: 'x' });
      s.arrow([0, 0, 0], matVec(M, x), { color: C.y, label: t > 0.99 ? 'Ax' : '', key: 'Ax' });
    }
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()), digits: 2 });
  const ved = x ? vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x!, set: (v) => ((x = v), sync()) }) : null;
  buttons(panel, (rowMode ? PRESETS.row : PRESETS.square).map((q) => ({ label: q.label, on: () => rebuild(q.A) })));
  let sl: ReturnType<typeof slider> | null = null;
  let stop: (() => void) | null = null;
  if (!rowMode) {
    sl = slider(panel, { label: 'A 하기', min: 0, max: 1, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
    buttons(panel, [
      { label: '▶ I에서 A로', on: () => (stop?.(), (stop = animate(1600, (u) => ((t = u), sync()), () => (stop = null)))) },
      { label: '처음으로', on: () => (stop?.(), (t = 0), sync()) },
    ]);
  }
  const ro = readout(panel);
  hint(panel, '그림을 끌면 공간이 돌아갑니다. 행렬의 칸은 좌우로 끌어 바꿀 수 있습니다.');

  // 행렬의 모양이 바뀌면 편집기를 다시 만든다
  let medRef = med;
  function rebuild(B: Mat) {
    const same = B.length === A.length;
    A = B.map((r) => r.slice());
    if (!same) {
      const fresh = document.createElement('div');
      medRef.el.replaceWith(fresh);
      medRef = matrixEditor(fresh, { name: 'A', get: () => A, set: (M) => ((A = M), sync()), digits: 2 });
      fresh.replaceWith(medRef.el);
    }
    sync();
  }

  function sync() {
    medRef.refresh();
    ved?.refresh();
    sl?.refresh();
    const [m, n] = shape(A);
    const r = rank(A);
    const N = nullBasis(A);
    let html = '';
    if (rowMode) {
      html += `<div>${chip('행공간', C.u, 'rowspace')}의 차원 = ${rowBasis(A).length} <span class="dim">(= 랭크)</span></div>`;
      html += `<div>${chip('N(A)', C.v, 'null')}의 차원 = ${N.length}</div>`;
      if (N.length) {
        const nv = N[0];
        html += `<div>영공간 벡터 n = ${vecTxt(nv)}</div>`;
        for (let i = 0; i < m; i++) html += `<div>${chip(`${i + 1}행`, C.u, `row${i + 1}`)}·n = ${fmt(dot(row(A, i), nv))}</div>`;
      } else html += `<div class="dim">영공간은 𝟎 하나뿐이다.</div>`;
    } else {
      const names = ['공간 전체가 점 하나로', '직선', '평면', 'ℝ³ 전체'];
      if (mode !== 'null') html += `<div>${chip('열공간', C.y, 'colspace')}: ${names[r]} <span class="dim">· ${chip('랭크', C.ink, 'rank')} = ${r}</span></div>`;
      if (mode !== 'col') html += `<div>${chip('영공간', C.v, 'null')}: ${N.length === 0 ? '𝟎 하나' : names[N.length]} <span class="dim">· 차원 ${N.length}</span>${N.length ? ` · 기저 ${N.map(vecTxt).join(', ')}` : ''}</div>`;
      if (mode === 'both') html += `<div class="eq">n = ${n} = ${chip(String(r), C.y, 'colspace')} + ${chip(String(N.length), C.v, 'null')}</div>`;
      if (x) html += `<div>${chip('x', C.x, 'x')} = ${vecTxt(x)} → ${chip('Ax', C.y, 'Ax')} = ${vecTxt(matVec(A, x))}</div>`;
    }
    ro.set(html);
    s.invalidate();
  }
  sync();
  return () => {
    stop?.();
    s.destroy();
  };
};

export default scene;
