// 수직선: 수는 위치이자 이동이다 (def.numberline)
//
// 흰 점 = 출발 위치 p. 하늘색 화살표 = 첫째 이동 a, 연두 화살표 = 둘째 이동 b.
// 출발점을 끌면 두 화살표가 길이와 방향을 그대로 지닌 채 따라 움직인다(이동은 출발점과 무관하다).
// 화살표 끝을 끌면 이동의 크기와 방향이 바뀐다. 도착점 = p + a + b.
//
// 매개변수
//   p:    출발점 (기본 −2)
//   a:    첫째 이동 (기본 5)
//   b:    둘째 이동. null이면 이동 하나만 (기본 −3)
//   swap: 순서를 바꾼 이어 붙이기(b 먼저, 그다음 a)를 수직선 아래에 함께 그릴지 (기본 false)
// 동기화 키: p (출발점), a (첫째 이동), b (둘째 이동), end (도착점)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { numberLine } from './_lib/b0-kit';
import { chain, displacement } from '../la/ground';
import { fmt, chip, toggle } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let p0: number = params.p ?? -2;
  let a: number = params.a ?? 5;
  let b: number | null = params.b === undefined ? -3 : params.b;
  let swap: boolean = params.swap ?? false;
  const clamp = (v: number) => Math.max(-12, Math.min(12, v));
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 2.4, bus, height: 240 });
  const ya = 0.55, yb = 1.0;

  p.handles.push(
    { key: 'p', get: () => [p0, 0], set: (v) => ((p0 = clamp(v[0])), sync()), snap: 1 },
    { key: 'a', get: () => [p0 + a, ya], set: (v) => ((a = displacement(p0, clamp(v[0]))), sync()), snap: 1 },
  );
  if (b !== null) p.handles.push({ key: 'b', get: () => [chain(p0, [a, b!]), yb], set: (v) => ((b = displacement(p0 + a, clamp(v[0]))), sync()), snap: 1 });

  p.draw = (p) => {
    numberLine(p);
    const mid = chain(p0, [a]);
    const end = b === null ? mid : chain(p0, [a, b]);
    // 위쪽 길: a 다음 b
    p.seg([p0, 0], [p0, ya], { color: C.grid, width: 1, dash: [3, 3] });
    p.arrow([p0, ya], [mid, ya], { color: C.u, label: `a = ${fmt(a)}`, key: 'a' });
    if (b !== null) {
      p.seg([mid, ya], [mid, yb], { color: C.grid, width: 1, dash: [3, 3] });
      p.arrow([mid, yb], [end, yb], { color: C.v, label: `b = ${fmt(b)}`, key: 'b' });
      p.seg([end, yb], [end, 0], { color: C.dim, width: 1, dash: [3, 3] });
    } else p.seg([mid, ya], [mid, 0], { color: C.dim, width: 1, dash: [3, 3] });
    // 아래쪽 길: b 다음 a
    if (swap && b !== null) {
      const midB = chain(p0, [b]);
      p.arrow([p0, -ya], [midB, -ya], { color: C.v, width: 2, alpha: 0.8, key: 'b' });
      p.arrow([midB, -yb], [chain(p0, [b, a]), -yb], { color: C.u, width: 2, alpha: 0.8, key: 'a' });
      p.seg([p0, 0], [p0, -ya], { color: C.grid, width: 1, dash: [3, 3] });
      p.seg([midB, -ya], [midB, -yb], { color: C.grid, width: 1, dash: [3, 3] });
      p.seg([end, -yb], [end, 0], { color: C.dim, width: 1, dash: [3, 3] });
      p.dot([midB, 0], { color: C.v, r: 3, alpha: 0.7 });
    }
    p.dot([mid, 0], { color: C.u, r: 3, alpha: 0.7 });
    p.dot([end, 0], { color: C.ink, r: 5, key: 'end' });
    p.text([end, 0], '도착', { color: C.ink, dy: -14, dx: 4, size: 12 });
    p.dot([p0, 0], { color: C.ink, r: 7, key: 'p' });
    p.text([p0, 0], '출발', { color: C.ink, dy: -14, dx: -4, align: 'right', size: 12 });
    p.hud([{ text: '흰 점(출발점)과 화살표 끝을 끌어 보세요' }], 'bl');
  };

  const ro = readout(panel);
  if (b !== null) toggle(panel, '순서를 바꾼 길도 보기 (b 먼저)', () => swap, (v) => ((swap = v), sync()));
  hint(panel, '출발점을 옮겨도 화살표의 길이와 방향은 그대로입니다. 이동은 "어디서"가 아니라 "어느 쪽으로 얼마나"만 담습니다.');

  function sync() {
    const end = b === null ? chain(p0, [a]) : chain(p0, [a, b]);
    let html = `<div>${chip('출발', C.ink, 'p')} ${fmt(p0)}</div>`;
    if (b === null) html += `<div class="eq">${fmt(p0)} + ${chip(`(${fmt(a)})`, C.u, 'a')} = ${chip(fmt(end), C.ink, 'end')}</div>`;
    else {
      html += `<div class="eq">${fmt(p0)} + ${chip(`(${fmt(a)})`, C.u, 'a')} + ${chip(`(${fmt(b)})`, C.v, 'b')} = ${chip(fmt(end), C.ink, 'end')}</div>`;
      if (swap) html += `<div class="eq">${fmt(p0)} + ${chip(`(${fmt(b)})`, C.v, 'b')} + ${chip(`(${fmt(a)})`, C.u, 'a')} = ${chip(fmt(chain(p0, [b, a])), C.ink, 'end')}</div><div class="dim">중간에 들르는 곳: 위 ${fmt(chain(p0, [a]))}, 아래 ${fmt(chain(p0, [b]))}</div>`;
    }
    html += `<div class="dim">출발점에서 도착점까지의 변위 = ${fmt(end)} − (${fmt(p0)}) = ${fmt(displacement(p0, end))}</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
