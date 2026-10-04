// 벡터 = 이동. 어디서 출발하든 같은 이동이면 같은 벡터다 (def.vector)
//
// 원점에서 출발한 화살표 𝐯(연두)와, 다른 출발점에서 출발한 같은 화살표를 함께 그린다.
// 출발점을 옮겨도 화살표의 가로 이동 v₁(주황 점선)과 세로 이동 v₂(청록 점선)는 그대로다.
// 도착점의 좌표 − 출발점의 좌표 = 𝐯의 성분.
//
// 매개변수
//   v:      처음 벡터 (기본 [3, 1])
//   tail:   둘째 화살표의 출발점 (기본 [-2, -1.5])
//   ghosts: 다른 출발점에 옅은 사본을 몇 개 더 그릴지 (기본 true)
// 동기화 키: v (벡터), v1 (가로 이동), v2 (세로 이동), tail (출발점), head (도착점)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { add, sub, type Vec } from '../la/vec';
import { fmt, chip, vectorEditor, buttons } from '../ui/widgets';
import { colHtml, vtxt } from './_lib/c1-kit';

const GHOST_TAILS: Vec[] = [
  [-3.2, 1.6],
  [0.6, -2.8],
  [-0.5, 2.2],
];

const scene: SceneFn = (host, { bus, params }) => {
  let v: Vec = params.v ?? [3, 1];
  let P: Vec = params.tail ?? [-2, -1.5];
  const ghosts = params.ghosts !== false;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4, bus, height: 380 });
  p.handles.push(
    { key: 'v', get: () => v, set: (w) => ((v = w), sync()) },
    { key: 'tail', get: () => P, set: (w) => ((P = w), sync()) },
    { key: 'head', get: () => add(P, v), set: (w) => ((v = sub(w, P)), sync()) },
  );

  p.draw = (p) => {
    p.grid();
    if (ghosts) for (const g of GHOST_TAILS) p.arrow(g, add(g, v), { color: C.v, width: 1.5, alpha: 0.3 });
    // 원점에서 출발한 대표 화살표
    p.dot([0, 0], { color: C.dim, r: 3 });
    p.arrow([0, 0], v, { color: C.v, label: 'v', key: 'v' });
    // P에서 출발한 같은 화살표와 그 가로·세로 이동
    const Q = add(P, v);
    const corner: Vec = [Q[0], P[1]];
    p.seg(P, corner, { color: C.c1, width: 2, dash: [5, 4], key: 'v1' });
    p.seg(corner, Q, { color: C.c2, width: 2, dash: [5, 4], key: 'v2' });
    p.arrow(P, Q, { color: C.v, key: 'v' });
    p.dot(P, { color: C.ink, r: 4, key: 'tail' });
    p.text(P, `출발 ${vtxt(P)}`, { color: C.ink, dx: -8, dy: 14, align: 'right', size: 13 });
    p.text(Q, `도착 ${vtxt(Q)}`, { color: C.ink, dx: 10, dy: 12, size: 13 });
    p.hud([{ text: '화살표 끝, 출발점, 도착점을 끌어 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.v, get: () => v, set: (w) => ((v = w), sync()) });
  buttons(panel, [
    { label: '영벡터', on: () => ((v = [0, 0]), sync()), title: '움직이지 않는 이동' },
    { label: '처음으로', on: () => ((v = (params.v ?? [3, 1]).slice()), (P = (params.tail ?? [-2, -1.5]).slice()), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, '출발점을 어디로 옮겨도 연두 화살표의 가로 이동과 세로 이동은 바뀌지 않습니다. 바뀌는 것은 출발점과 도착점의 좌표뿐입니다.');

  function sync() {
    ev.refresh();
    const Q = add(P, v);
    const d = sub(Q, P);
    let html =
      `<div>${chip('v', C.v, 'v')} = ${colHtml(v, { colors: [C.c1, C.c2], key: 'v' })} <span class="dim">가로 ${chip(fmt(v[0]), C.c1, 'v1')}, 세로 ${chip(fmt(v[1]), C.c2, 'v2')}</span></div>` +
      `<div>${chip('도착점', C.ink, 'head')} − ${chip('출발점', C.ink, 'tail')} = ${vtxt(Q)} − ${vtxt(P)} = ${vtxt(d)}</div>`;
    html += v[0] === 0 && v[1] === 0 ? `<div class="dim">영벡터: 어디서 출발해도 제자리에 있다. 화살표가 점 하나로 줄어든다.</div>` : `<div class="dim">출발점이 어디에 있든 (도착점 − 출발점)은 언제나 𝐯의 성분과 같다.</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
