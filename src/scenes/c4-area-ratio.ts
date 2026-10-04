// 모든 도형의 넓이가 같은 배율 |det A|로 변한다 (prop.det-uniform)
//
// 노랑 = 입력 도형, 분홍 = A로 보낸 상. 읽기 칸은 두 넓이와 그 비를 det A와 나란히 보인다.
// "작은 정사각형" 상자를 켜면 도형 안에 완전히 들어가는 한 변 h짜리 정사각형들과,
// 그 정사각형들이 옮겨 간 평행사변형들(모두 똑같은 모양)을 함께 그린다.
//
// 매개변수
//   A:     처음 행렬 (기본 [[1.5, 0.5], [-0.3, 1]])
//   shape: 'circle' | 'blob' | 'F' (기본 'blob')
//   cells: 작은 정사각형을 처음부터 보일지 (기본 false)
//   h:     작은 정사각형의 한 변 (기본 0.25)
// 동기화 키: col1, col2 (열), shape (입력 도형), image (상), cells (작은 정사각형), det
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, det2, matVec, type Mat } from '../la/mat';
import { type Vec } from '../la/vec';
import { polygonArea, insidePolygon } from '../la/area';
import { matrixEditor, fmt, chip, buttons, toggle } from '../ui/widgets';

const SHAPES: Record<string, Vec[]> = {
  circle: Array.from({ length: 120 }, (_, i) => {
    const t = (2 * Math.PI * i) / 120;
    return [0.4 + Math.cos(t), 0.3 + Math.sin(t)];
  }),
  blob: Array.from({ length: 150 }, (_, i) => {
    const t = (2 * Math.PI * i) / 150;
    const r = 1 + 0.28 * Math.cos(3 * t) + 0.12 * Math.sin(2 * t);
    return [0.3 + r * Math.cos(t), 0.4 + r * Math.sin(t)];
  }),
  F: [
    [-0.6, -1], [-0.1, -1], [-0.1, 0.1], [0.8, 0.1], [0.8, 0.5], [-0.1, 0.5], [-0.1, 1.1], [1.1, 1.1], [1.1, 1.5], [-0.6, 1.5],
  ],
};

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1.5, 0.5],
    [-0.3, 1],
  ];
  let shapeName: string = params.shape ?? 'blob';
  let showCells = !!params.cells;
  const h: number = params.h ?? 0.25;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3, bus, height: 400 });
  const setCol = (j: number, v: Vec) => {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  };
  p.handles.push({ key: 'col1', get: () => col(A, 0), set: (v) => setCol(0, v) }, { key: 'col2', get: () => col(A, 1), set: (v) => setCol(1, v) });

  // 도형 안에 완전히 들어가는 작은 정사각형들(왼쪽 아래 꼭짓점 목록)
  let cells: Vec[] = [];
  const findCells = () => {
    const S = SHAPES[shapeName];
    cells = [];
    for (let i = -16; i < 16; i++)
      for (let j = -16; j < 16; j++) {
        const q: Vec[] = [[i * h, j * h], [(i + 1) * h, j * h], [(i + 1) * h, (j + 1) * h], [i * h, (j + 1) * h]];
        // 네 꼭짓점과 가운데가 모두 안에 있으면 안에 든 것으로 센다
        if (q.every((c) => insidePolygon(c, S)) && insidePolygon([(i + 0.5) * h, (j + 0.5) * h], S)) cells.push(q[0]);
      }
  };
  const sq = (c: Vec): Vec[] => [c, [c[0] + h, c[1]], [c[0] + h, c[1] + h], [c[0], c[1] + h]];

  p.draw = (p) => {
    p.grid();
    p.tgrid(A, { color: 'rgba(120,170,255,0.2)' });
    const S = SHAPES[shapeName];
    p.poly(S, { fill: 'rgba(245,197,66,0.12)', color: C.x, width: 1.5, key: 'shape' });
    p.poly(S.map((q) => matVec(A, q)), { fill: 'rgba(255,107,213,0.14)', color: C.y, width: 2, key: 'image' });
    if (showCells) {
      for (const c of cells) {
        p.poly(sq(c), { color: 'rgba(245,197,66,0.55)', width: 0.8, key: 'cells' });
        p.poly(sq(c).map((q) => matVec(A, q)), { color: 'rgba(255,107,213,0.6)', width: 0.8, key: 'cells' });
      }
    }
    p.arrow([0, 0], col(A, 0), { color: C.c1, width: 2, key: 'col1' });
    p.arrow([0, 0], col(A, 1), { color: C.c2, width: 2, key: 'col2' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  buttons(panel, [
    { label: '원', on: () => ((shapeName = 'circle'), findCells(), sync()) },
    { label: '얼룩', on: () => ((shapeName = 'blob'), findCells(), sync()) },
    { label: 'F', on: () => ((shapeName = 'F'), findCells(), sync()) },
  ]);
  const tg = toggle(panel, `한 변 ${fmt(h)}짜리 작은 정사각형으로 채우기`, () => showCells, (b) => ((showCells = b), sync()));
  const ro = readout(panel);
  hint(panel, '작은 정사각형 하나하나가 모두 똑같은 평행사변형으로 갑니다. 그래서 정사각형으로 채운 넓이도, 도형 전체의 넓이도 같은 배율로 변합니다.');

  function sync() {
    med.refresh();
    tg.refresh();
    const S = SHAPES[shapeName];
    const a0 = Math.abs(polygonArea(S));
    const a1 = Math.abs(polygonArea(S.map((q) => matVec(A, q))));
    const d = det2(A);
    let html =
      `<div>${chip('도형의 넓이', C.x, 'shape')} = ${fmt(a0, 3)}</div>` +
      `<div>${chip('상의 넓이', C.y, 'image')} = ${fmt(a1, 3)}</div>` +
      `<div class="eq">비 = ${fmt(a1, 3)} ÷ ${fmt(a0, 3)} = <b>${fmt(a1 / a0, 3)}</b></div>` +
      `<div>${chip('|det A|', C.ink, 'det')} = ${fmt(Math.abs(d), 3)}</div>`;
    if (showCells) {
      const one = Math.abs(polygonArea(sq([0, 0]).map((q) => matVec(A, q))));
      html +=
        `<div class="eq">${chip('작은 정사각형', C.x, 'cells')} ${cells.length}개 × ${fmt(h * h, 4)} = ${fmt(cells.length * h * h, 3)}</div>` +
        `<div>그 상: 평행사변형 하나의 넓이 = ${fmt(one, 4)} (= ${fmt(h * h, 4)} × ${fmt(Math.abs(d), 3)})</div>` +
        `<div>${cells.length}개 × ${fmt(one, 4)} = ${fmt(cells.length * one, 3)}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  findCells();
  sync();
  return () => p.destroy();
};

export default scene;
