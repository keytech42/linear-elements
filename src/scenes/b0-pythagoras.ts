// 피타고라스 정리: 같은 상자, 같은 네 조각, 두 가지 배치 (prop.pythagoras)
//
// 한 변이 a + b인 정사각형 상자 안에, 두 직각변이 a(주황), b(청록)인 직각삼각형 네 개를 놓는다.
//  배치 1: 네 삼각형을 네 귀퉁이에 → 가운데에 빗변 h를 한 변으로 하는 기울어진 정사각형(노랑)이 남는다.
//  배치 2: 삼각형 둘씩 붙여 직사각형 두 개로 → 한 변 a인 정사각형과 한 변 b인 정사각형이 남는다.
// 네 삼각형은 밀기만 해서(돌리지 않고) 배치 1에서 배치 2로 간다.
//
// 매개변수
//   a, b:    두 직각변 (기본 2.5, 1.5)
//   step:    처음 배치 0(배치 1) 또는 1(배치 2) (기본 0)
//   numbers: 넓이 수치를 보일지 (기본 true). 예측 전에는 false로 둔다
// 동기화 키: box (상자), tri (삼각형 넷), h2 (가운데 정사각형), a2, b2 (배치 2의 두 정사각형), a, b (직각변)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { polygonArea } from '../la/area';
import { fmt, chip, buttons, animate, slider } from '../ui/widgets';
import type { Vec } from '../la/vec';

const shift = (P: Vec[], d: Vec): Vec[] => P.map((v) => [v[0] + d[0], v[1] + d[1]]);

/** 배치 1의 네 삼각형(꼭짓점 순서: 직각, a쪽 끝, b쪽 끝)과 배치 2로 가는 밀기 */
function layoutOf(a: number, b: number) {
  const s = a + b;
  const tris: Vec[][] = [
    [[0, 0], [a, 0], [0, b]],
    [[s, 0], [s, a], [a, 0]],
    [[s, s], [b, s], [s, a]],
    [[0, s], [0, b], [b, s]],
  ];
  const moves: Vec[] = [[0, a], [0, 0], [-b, 0], [a, -b]];
  return {
    s,
    tris,
    moves,
    box: [[0, 0], [s, 0], [s, s], [0, s]] as Vec[],
    inner: [[a, 0], [s, a], [b, s], [0, b]] as Vec[],
    sqA: [[0, 0], [a, 0], [a, a], [0, a]] as Vec[],
    sqB: [[a, a], [s, a], [s, s], [a, s]] as Vec[],
  };
}

const scene: SceneFn = (host, { bus, params }) => {
  let a: number = params.a ?? 2.5;
  let b: number = params.b ?? 1.5;
  let t: number = params.step ?? 0;
  const numbers = params.numbers !== false;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.3, bus, height: 400 });

  p.draw = (p) => {
    const L = layoutOf(a, b);
    const o: Vec = [-L.s / 2, -L.s / 2];
    const O = (P: Vec[]) => shift(P, o);
    p.poly(O(L.box), { color: C.ink, width: 1.5, key: 'box' });
    if (t < 0.02) p.poly(O(L.inner), { fill: C.area, color: C.x, width: 2, key: 'h2' });
    if (t > 0.98) {
      p.poly(O(L.sqA), { fill: C.c1, alpha: 0.22, color: C.c1, width: 1.5, key: 'a2' });
      p.poly(O(L.sqB), { fill: C.c2, alpha: 0.22, color: C.c2, width: 1.5, key: 'b2' });
    }
    L.tris.forEach((T, k) => {
      const P = O(shift(T, [L.moves[k][0] * t, L.moves[k][1] * t]));
      p.poly(P, { fill: C.gridStrong, color: C.dim, width: 1, key: 'tri' });
      p.seg(P[0], P[1], { color: C.c1, width: 3, key: 'a' });
      p.seg(P[0], P[2], { color: C.c2, width: 3, key: 'b' });
      p.seg(P[1], P[2], { color: C.x, width: 2, alpha: 0.9 });
    });
    if (t < 0.02) {
      const c = O([[L.s / 2, L.s / 2]])[0];
      p.text(c, 'h × h', { color: C.x, align: 'center', bold: true });
      p.text(O([[a / 2, 0]])[0], 'a', { color: C.c1, dy: 14, align: 'center', bold: true });
      p.text(O([[a + b / 2, 0]])[0], 'b', { color: C.c2, dy: 14, align: 'center', bold: true });
      p.text(O([[a / 2 + 0.15, b / 2 + 0.15]])[0], 'h', { color: C.x, bold: true });
    }
    if (t > 0.98) {
      p.text(O([[a / 2, a / 2]])[0], 'a × a', { color: C.c1, align: 'center', bold: true });
      p.text(O([[a + b / 2, a + b / 2]])[0], 'b × b', { color: C.c2, align: 'center', bold: true });
    }
  };

  let stop: (() => void) | null = null;
  const go = (to: number) => {
    stop?.();
    const from = t;
    stop = animate(1400, (u) => ((t = from + (to - from) * u), sync()), () => (stop = null));
  };
  buttons(panel, [
    { label: '배치 1', on: () => go(0) },
    { label: '배치 2', on: () => go(1) },
  ]);
  const sa = slider(panel, { label: '직각변 a', min: 0.3, max: 3, step: 0.1, get: () => a, set: (v) => ((a = v), sync()), key: 'a' });
  const sb = slider(panel, { label: '직각변 b', min: 0.3, max: 3, step: 0.1, get: () => b, set: (v) => ((b = v), sync()), key: 'b' });
  const ro = readout(panel);
  hint(panel, '두 배치 모두 같은 상자 안에 같은 삼각형 네 개를 겹치지 않게 놓았습니다. 남은 부분을 비교해 보세요.');

  function sync() {
    sa.refresh();
    sb.refresh();
    const L = layoutOf(a, b);
    const box = polygonArea(L.box);
    const tri = L.tris.reduce((s, T) => s + polygonArea(T), 0);
    if (!numbers) {
      ro.set(`<div>${chip('상자', C.ink, 'box')}: 한 변 a + b = ${fmt(L.s)}</div><div>${chip('삼각형 넷', C.dim, 'tri')}: 두 배치에서 같은 조각</div><div class="dim">넓이 비교는 예측한 뒤에 봅니다.</div>`);
    } else {
      ro.set(
        `<div>${chip('상자', C.ink, 'box')} = (${fmt(a)} + ${fmt(b)})² = ${fmt(box, 3)}</div>` +
          `<div>− ${chip('삼각형 넷', C.dim, 'tri')} = ${fmt(tri, 3)}</div>` +
          `<div class="eq">= 남은 넓이 ${fmt(box - tri, 3)}</div>` +
          `<div>배치 1: ${chip('h × h', C.x, 'h2')} = ${fmt(polygonArea(L.inner), 3)}</div>` +
          `<div>배치 2: ${chip('a × a', C.c1, 'a2')} + ${chip('b × b', C.c2, 'b2')} = ${fmt(polygonArea(L.sqA), 3)} + ${fmt(polygonArea(L.sqB), 3)} = ${fmt(polygonArea(L.sqA) + polygonArea(L.sqB), 3)}</div>`,
      );
    }
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
