// −1을 곱하기 = 수직선을 0을 축으로 뒤집기 (prop.neg-times-neg)
//
// 수직선 위에 점 몇 개를 찍어 두고 "× (−1)"을 누르면 모든 점이 0을 축으로 반 바퀴 돌아 반대쪽으로 간다.
// 두 번 누르면 모든 점이 제자리로 돌아온다: (−1) × (−1) × a = a.
//
// 매개변수
//   points: 처음 점들 (기본 [1, 2.5, −1.5])
// 동기화 키: p0, p1, p2 … (점마다)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { numberLine } from './_lib/c0-kit';
import { fmt, chip, buttons, animate } from '../ui/widgets';

const COLORS = [C.ink, C.u, C.v, C.dim];

const scene: SceneFn = (host, { bus, params }) => {
  const pts: number[] = params.points ?? [1, 2.5, -1.5];
  let flips = 0; // 지금까지 뒤집은 횟수
  let phi = 0; // 애니메이션 중의 회전각
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3, bus, height: 260 });

  p.draw = (p) => {
    numberLine(p);
    // 반 바퀴 도는 길을 옅게
    if (phi % Math.PI !== 0) p.curve((t) => [Math.cos(t) * 2.5, Math.sin(t) * 2.5], 0, Math.PI, 60, { color: C.grid, width: 1 });
    const sign = flips % 2 === 0 ? 1 : -1;
    pts.forEach((a, i) => {
      const r = sign * a;
      const q = [r * Math.cos(phi), r * Math.sin(phi)];
      p.dot(q, { color: COLORS[i % COLORS.length], r: 7, key: `p${i}` });
      if (phi === 0) p.text(q, fmt(r), { color: COLORS[i % COLORS.length], dy: -16, align: 'center', bold: true });
    });
  };

  const ro = readout(panel);
  let stop: (() => void) | null = null;
  const flip = (times: number) => {
    stop?.();
    let done = 0;
    const one = () => {
      stop = animate(
        900,
        (u) => ((phi = Math.PI * u), p.invalidate()),
        () => {
          phi = 0;
          flips++;
          done++;
          sync();
          if (done < times) one();
          else stop = null;
        },
      );
    };
    one();
  };
  buttons(panel, [
    { label: '× (−1)', on: () => flip(1) },
    { label: '× (−1) 두 번', on: () => flip(2) },
    { label: '처음으로', on: () => ((flips = 0), sync()) },
  ]);
  hint(panel, '× (−1)은 모든 점을 0을 축으로 반 바퀴 돌려 반대쪽 같은 거리에 놓습니다. 두 번 하면 어떻게 될지 먼저 생각해 보세요.');

  function sync() {
    const sign = flips % 2 === 0 ? 1 : -1;
    const rows = pts
      .map((a, i) => `<div>${chip(fmt(a), COLORS[i % COLORS.length], `p${i}`)} → ${chip(fmt(sign * a), COLORS[i % COLORS.length], `p${i}`)}</div>`)
      .join('');
    ro.set(`<div>× (−1)을 ${flips}번 했다</div>${rows}<div class="eq dim">${flips % 2 === 0 ? '짝수 번: 모두 제자리' : '홀수 번: 모두 반대쪽'}</div>`);
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
