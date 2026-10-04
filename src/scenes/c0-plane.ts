// 좌표평면: 수 두 개로 위치 하나 (def.plane)
//
// 흰 점 P를 끌면, P에서 두 축으로 수직으로 내린 점선과 함께 가로 좌표 x(주황, 가로축 위)와 세로 좌표 y(청록, 세로축 위)가 읽힌다.
//
// 매개변수
//   P:    처음 점 (기본 [2, 3])
//   swap: 두 좌표의 순서를 바꾼 점 Q = (y, x)와 대각선 y = x를 함께 그릴지 (기본 false)
//   move: 이동 (Δx, Δy)를 화살표로 그릴지, 그린다면 처음 값 (예: [3, −4]). 생략하면 숨김
// 동기화 키: P, x (가로 좌표), y (세로 좌표), Q (순서를 바꾼 점), move (이동), diag (대각선)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { axisLabels } from './_lib/c0-kit';
import { chain, displacement } from '../la/ground';
import { fmt, chip, toggle } from '../ui/widgets';
import type { Vec } from '../la/vec';

const scene: SceneFn = (host, { bus, params }) => {
  let P: Vec = params.P ?? [2, 3];
  let swap: boolean = params.swap ?? false;
  let d: Vec | null = params.move ?? null;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 5, bus, height: 380 });
  const to = (): Vec => [chain(P[0], [d![0]]), chain(P[1], [d![1]])];

  p.handles.push({ key: 'P', get: () => P, set: (v) => ((P = v), sync()), snap: 1 });
  if (d) p.handles.push({ key: 'move', get: to, set: (v) => ((d = [displacement(P[0], v[0]), displacement(P[1], v[1])]), sync()), snap: 1 });

  const drops = (Q: Vec, cx: string, cy: string, alpha = 1) => {
    p.seg(Q, [Q[0], 0], { color: C.dim, width: 1, dash: [4, 4], alpha });
    p.seg(Q, [0, Q[1]], { color: C.dim, width: 1, dash: [4, 4], alpha });
    p.seg([0, 0], [Q[0], 0], { color: cx, width: 4, alpha, key: 'x' });
    p.seg([0, 0], [0, Q[1]], { color: cy, width: 4, alpha, key: 'y' });
  };

  p.draw = (p) => {
    p.grid();
    axisLabels(p);
    p.text([p.bounds.x1, 0], 'x', { color: C.ink, dx: -14, dy: -12, bold: true });
    p.text([0, p.bounds.y1], 'y', { color: C.ink, dx: 10, dy: 14, bold: true });
    if (swap) {
      p.line([0, 0], [1, 1], { color: C.dim, width: 1, dash: [6, 5], key: 'diag' });
      const Q: Vec = [P[1], P[0]];
      p.seg(Q, [Q[0], 0], { color: C.dim, width: 1, dash: [2, 4] });
      p.seg(Q, [0, Q[1]], { color: C.dim, width: 1, dash: [2, 4] });
      p.dot(Q, { color: C.u, r: 6, key: 'Q' });
      p.text(Q, `Q (${fmt(Q[0])}, ${fmt(Q[1])})`, { color: C.u, dx: 10, dy: 14 });
    }
    drops(P, C.c1, C.c2);
    p.text([P[0] / 2, 0], `x = ${fmt(P[0])}`, { color: C.c1, dy: P[1] >= 0 ? 26 : -26, align: 'center' });
    p.text([0, P[1] / 2], `y = ${fmt(P[1])}`, { color: C.c2, dx: P[0] >= 0 ? -30 : 30, align: P[0] >= 0 ? 'right' : 'left' });
    if (d) {
      const T = to();
      p.arrow(P, T, { color: C.u, key: 'move' });
      p.dot(T, { color: C.ink, r: 4 });
      p.text(T, `(${fmt(T[0])}, ${fmt(T[1])})`, { color: C.ink, dx: 10, dy: 14 });
    }
    p.dot(P, { color: C.ink, r: 6, key: 'P' });
    p.text(P, `P (${fmt(P[0])}, ${fmt(P[1])})`, { color: C.ink, dx: 10, dy: -12, bold: true });
    p.hud([{ text: d ? '흰 점 P와 화살표 끝을 끌어 보세요' : '흰 점 P를 끌어 보세요' }], 'bl');
  };

  const ro = readout(panel);
  if (params.swap !== undefined) toggle(panel, '순서를 바꾼 점 Q = (y, x) 보기', () => swap, (v) => ((swap = v), sync()));
  hint(panel, '점에서 가로축으로 수직으로 내려가 닿는 눈금이 가로 좌표, 세로축으로 수직으로 건너가 닿는 눈금이 세로 좌표입니다.');

  function sync() {
    let html = `<div>${chip('P', C.ink, 'P')} = (${chip(fmt(P[0]), C.c1, 'x')}, ${chip(fmt(P[1]), C.c2, 'y')})</div>`;
    if (swap) html += `<div>${chip('Q', C.u, 'Q')} = (${fmt(P[1])}, ${fmt(P[0])}) ${P[0] === P[1] ? '<span class="dim">= P (두 좌표가 같을 때만)</span>' : '<span class="dim">≠ P</span>'}</div>`;
    if (d) {
      const T = to();
      html += `<div class="eq">이동 ${chip(`(${fmt(d[0])}, ${fmt(d[1])})`, C.u, 'move')}: 가로 ${fmt(P[0])} + (${fmt(d[0])}) = ${fmt(T[0])}, 세로 ${fmt(P[1])} + (${fmt(d[1])}) = ${fmt(T[1])}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
