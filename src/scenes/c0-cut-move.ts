// 넓이의 규칙을 손으로: 자르고 옮기기 (ax.area)
//
// mode
//   'shear': 가로 w, 세로 h인 직사각형에서 왼쪽 삼각형을 잘라 오른쪽으로 옮기면 밑변 w, 높이 h인 평행사변형이 된다.
//            윗변의 왼쪽 끝(손잡이)을 끌어 기울기를 바꾼다.
//   'curry': 8×8 정사각형을 네 조각(삼각형 둘, 사다리꼴 둘)으로 잘라 5×13 직사각형처럼 다시 놓는다.
//            두 배치의 넓이(64와 65)가 왜 다른지: 조각이 정확히 맞물리지 않아 가운데에 넓이 1의 틈이 생긴다.
//   'tile':  단위 정사각형을 가로 1/q, 세로 1/r인 작은 직사각형으로 빈틈없이 덮는다.
//
// 매개변수
//   mode: 위의 셋 중 하나 (기본 'shear')
//   w, h, s: 'shear'의 가로, 세로, 처음 기울기(윗변이 오른쪽으로 밀린 거리) (기본 4, 2, 1.5)
//   q, r: 'tile'의 분모 (기본 2, 3)
//   step: 처음 진행 0~1 (기본 0)
// 동기화 키: rect (처음 도형), piece (옮기는 조각), result (옮긴 뒤 도형), gap (curry의 틈), cell (tile의 작은 직사각형 하나)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { polygonArea } from '../la/area';
import { rigid, poseFrom } from './_lib/c0-kit';
import { fmt, chip, buttons, animate, slider } from '../ui/widgets';
import type { Vec } from '../la/vec';

const shift = (P: Vec[], d: Vec): Vec[] => P.map((v) => [v[0] + d[0], v[1] + d[1]]);

const scene: SceneFn = (host, { bus, params }) => {
  const mode: 'shear' | 'curry' | 'tile' = params.mode ?? 'shear';
  let t: number = params.step ?? 0;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: mode === 'curry' ? 5.2 : mode === 'tile' ? 1.4 : 3, bus, height: 360 });
  const ro = readout(panel);
  let stop: (() => void) | null = null;
  const go = (to: number) => {
    stop?.();
    const from = t;
    stop = animate(1200, (u) => ((t = from + (to - from) * u), sync()), () => (stop = null));
  };
  let sync = () => {};

  if (mode === 'shear') {
    const w: number = params.w ?? 4, h: number = params.h ?? 2;
    let s: number = params.s ?? 1.5;
    const off: Vec = [-w / 2 - 0.6, -h / 2];
    const O = (P: Vec[]) => shift(P, off);
    p.handles.push({
      key: 'piece',
      get: () => [off[0] + s, off[1] + h],
      set: (v) => ((s = Math.max(0, Math.min(w, v[0] - off[0]))), sync()),
      snap: 0.5,
      enabled: () => t === 0 || t === 1,
    });
    p.draw = (p) => {
      p.grid();
      const rect: Vec[] = [[0, 0], [w, 0], [w, h], [0, h]];
      const tri: Vec[] = [[0, 0], [s, h], [0, h]];
      const rest: Vec[] = [[0, 0], [w, 0], [w, h], [s, h]];
      p.poly(O(rect), { color: C.dim, width: 1, dash: [5, 4], key: 'rect' });
      p.poly(O(rest), { fill: C.area, color: C.x, width: 1.5, key: 'result' });
      p.poly(O(shift(tri, [w * t, 0])), { fill: C.u, alpha: 0.35, color: C.u, width: 1.5, key: 'piece' });
      if (t === 1) p.poly(O([[0, 0], [w, 0], [w + s, h], [s, h]]), { color: C.ink, width: 2, key: 'result' });
      p.text(O([[w / 2, 0]])[0], `밑변 ${fmt(w)}`, { color: C.ink, dy: 14, align: 'center' });
      p.seg(O([[w + s + 0.3, 0]])[0], O([[w + s + 0.3, h]])[0], { color: C.dim, width: 1 });
      p.text(O([[w + s + 0.3, h / 2]])[0], `높이 ${fmt(h)}`, { color: C.dim, dx: 8 });
      p.hud([{ text: '윗변 왼쪽 끝의 손잡이를 끌어 기울기를 바꿔 보세요' }], 'bl');
    };
    buttons(panel, [
      { label: '① 직사각형', on: () => go(0) },
      { label: '② 삼각형을 오른쪽으로', on: () => go(1) },
    ]);
    hint(panel, '파란 삼각형을 잘라 오른쪽 끝으로 옮깁니다. 조각을 옮기기만 했으므로 넓이는 바뀌지 않습니다.');
    sync = () => {
      const rect: Vec[] = [[0, 0], [w, 0], [w, h], [0, h]];
      const para: Vec[] = [[0, 0], [w, 0], [w + s, h], [s, h]];
      const tri: Vec[] = [[0, 0], [s, h], [0, h]];
      ro.set(
        `<div>${chip('직사각형', C.dim, 'rect')} = ${fmt(w)} × ${fmt(h)} = ${fmt(polygonArea(rect), 3)}</div>` +
          `<div>${chip('옮긴 삼각형', C.u, 'piece')} = ${fmt(polygonArea(tri), 3)}</div>` +
          `<div class="eq">${chip('평행사변형', C.x, 'result')} = ${fmt(polygonArea(para), 3)}</div>` +
          `<div class="dim">옆변은 기울수록 길어지지만, 넓이는 그대로다.</div>`,
      );
      p.invalidate();
    };
  } else if (mode === 'curry') {
    // 8×8 정사각형의 네 조각 (왼쪽 띠 3×8을 대각선으로 자른 삼각형 둘, 오른쪽 5×8을 자른 사다리꼴 둘)
    const tri1: Vec[] = [[0, 0], [3, 0], [0, 8]];
    const tri2: Vec[] = [[3, 0], [3, 8], [0, 8]];
    const trap1: Vec[] = [[3, 0], [8, 0], [8, 5], [3, 3]];
    const trap2: Vec[] = [[3, 3], [8, 5], [8, 8], [3, 8]];
    // 5×13으로 옮긴 자리: 삼각형은 ¼바퀴 돌리고 밀기, 사다리꼴은 밀기만
    const poses = [poseFrom(tri1, Math.PI / 2, [8, 0]), poseFrom(tri2, Math.PI / 2, [13, 2]), poseFrom(trap1, 0, [5, 0]), poseFrom(trap2, 0, [-3, -3])];
    const pieces = [tri1, tri2, trap1, trap2];
    const fills = [C.c1, C.c1, C.c2, C.c2];
    const at = (k: number, s: number) => rigid(pieces[k], poses[k].phi, poses[k].shift, s);
    // 그림 전체를 화면 가운데로
    const off = (s: number): Vec => [-4 - 2.5 * s, -4 + 1.5 * s];
    const gap: Vec[] = [[0, 0], [8, 3], [13, 5], [5, 2]];
    p.draw = (p) => {
      p.grid();
      const o = off(t);
      if (t < 0.02) p.poly(shift([[0, 0], [8, 0], [8, 8], [0, 8]], o), { color: C.ink, width: 1, dash: [5, 4], key: 'rect' });
      if (t > 0.98) {
        p.poly(shift([[0, 0], [13, 0], [13, 5], [0, 5]], o), { color: C.ink, width: 1, dash: [5, 4], key: 'result' });
        p.poly(shift(gap, o), { fill: C.bad, alpha: 0.85, key: 'gap' });
      }
      for (let k = 0; k < 4; k++) p.poly(shift(at(k, t), o), { fill: fills[k], alpha: 0.3, color: fills[k], width: 1.2, key: 'piece' });
      p.hud([{ text: t > 0.98 ? '빨간 선: 조각 사이의 틈 (확대해 보세요)' : '조각 넷: 삼각형 둘(주황), 사다리꼴 둘(청록)' }], 'bl');
    };
    buttons(panel, [
      { label: '① 8×8', on: () => go(0) },
      { label: '② 5×13으로 다시 놓기', on: () => go(1) },
    ]);
    hint(panel, '다시 놓은 뒤 가운데 대각선 부분을 확대(+)해 보세요. 두 "빗변"이 한 직선이 아닙니다.');
    sync = () => {
      const sum = pieces.reduce((acc, P) => acc + Math.abs(polygonArea(P)), 0);
      ro.set(
        `<div>${chip('8 × 8', C.ink, 'rect')} = ${fmt(polygonArea([[0, 0], [8, 0], [8, 8], [0, 8]]))}</div>` +
          `<div>${chip('조각 넷의 합', C.c1, 'piece')} = ${fmt(sum)}</div>` +
          `<div>${chip('5 × 13', C.ink, 'result')} = ${fmt(polygonArea([[0, 0], [13, 0], [13, 5], [0, 5]]))}</div>` +
          `<div class="eq">${chip('틈', C.bad, 'gap')} = ${fmt(Math.abs(polygonArea(gap)), 3)}</div>` +
          `<div class="dim">삼각형 빗변의 기울기 3/8 = ${fmt(3 / 8, 3)}, 사다리꼴 윗변의 기울기 2/5 = ${fmt(2 / 5, 3)}</div>`,
      );
      p.invalidate();
    };
  } else {
    let q: number = params.q ?? 2, r: number = params.r ?? 3;
    const off: Vec = [-0.5, -0.5];
    p.draw = (p) => {
      const sq: Vec[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
      for (let i = 0; i < q; i++)
        for (let j = 0; j < r; j++) {
          const cell: Vec[] = [[i / q, j / r], [(i + 1) / q, j / r], [(i + 1) / q, (j + 1) / r], [i / q, (j + 1) / r]];
          const first = i === 0 && j === 0;
          p.poly(shift(cell, off), { fill: first ? C.x : C.gridStrong, alpha: first ? 0.55 : 1, color: C.dim, width: 1, key: first ? 'cell' : undefined });
        }
      p.poly(shift(sq, off), { color: C.ink, width: 2, key: 'rect' });
      p.text([0, -0.5], '1', { color: C.ink, dy: 14, align: 'center' });
      p.text([-0.5, 0], '1', { color: C.ink, dx: -12, align: 'center' });
    };
    const sq = slider(panel, { label: '가로 1/q의 q', min: 1, max: 6, step: 1, get: () => q, set: (v) => ((q = v), sync()) });
    const sr = slider(panel, { label: '세로 1/r의 r', min: 1, max: 6, step: 1, get: () => r, set: (v) => ((r = v), sync()) });
    hint(panel, '단위 정사각형(넓이 1)을 똑같은 작은 직사각형으로 빈틈없이, 겹치지 않게 덮었습니다. 작은 것 하나의 넓이는 1을 그 개수로 나눈 것입니다.');
    sync = () => {
      sq.refresh();
      sr.refresh();
      const cell = polygonArea([[0, 0], [1 / q, 0], [1 / q, 1 / r], [0, 1 / r]]);
      ro.set(
        `<div>작은 직사각형 개수 = ${fmt(q)} × ${fmt(r)} = ${fmt(q * r)}</div>` +
          `<div class="eq">${chip('하나의 넓이', C.x, 'cell')} = 1 ÷ ${fmt(q * r)} ≈ ${fmt(cell, 4)}</div>` +
          `<div class="dim">(1/${fmt(q)}) × (1/${fmt(r)}) ≈ ${fmt((1 / q) * (1 / r), 4)}</div>`,
      );
      p.invalidate();
    };
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
