// 점 배열로 보는 곱셈의 규칙 (ax.arith)
//
// 가로 n개씩 m줄로 놓은 점 배열. 개수는 m × n 이다.
//  · "¼바퀴 돌리기": 배열을 통째로 돌리면 가로 m개씩 n줄이 된다. 점은 하나도 생기거나 없어지지 않는다 → m × n = n × m (교환법칙의 경험)
//  · 나누기 선: 각 줄을 앞의 k개와 뒤의 n − k개로 가르면 m × n = m × k + m × (n − k) (분배법칙의 경험)
//    나누기 선을 보일 때는 돌리기 단추를 두지 않는다. 한 장면에 한 법칙만 보이기 위해서다.
//    (돌린 그림은 오른쪽 분배법칙 (b + c)a = ba + ca 를 보여 주는데, 그것은 그림이 아니라 prop.arith-first에서 증명한다.)
//
// 매개변수
//   m:     줄 수 (기본 3)
//   n:     한 줄의 점 수 (기본 4)
//   split: 나누기 선을 보일지, 보인다면 처음 k (예: 3). 생략하면 숨김
// 동기화 키: left (앞쪽 k개 묶음), right (뒤쪽 n − k개 묶음), all (배열 전체)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { chain } from '../la/ground';
import { fmt, chip, buttons, animate, slider } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let m: number = params.m ?? 3;
  let n: number = params.n ?? 4;
  let k: number | null = params.split ?? null;
  let turn = 0; // 0 = 처음, 1 = ¼바퀴 돈 뒤
  const gap = 0.8;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4, bus, height: 320 });

  p.draw = (p) => {
    const phi = (turn * Math.PI) / 2;
    const co = Math.cos(phi), si = Math.sin(phi);
    // 배열의 가운데를 원점에 둔다
    const cx = ((n - 1) * gap) / 2, cy = ((m - 1) * gap) / 2;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const x = j * gap - cx + (k !== null && j >= k ? 0.35 * (1 - turn) : 0) - (k !== null ? 0.175 * (1 - turn) : 0);
        const y = cy - i * gap;
        const q = [co * x - si * y, si * x + co * y];
        const left = k !== null && j < k;
        const color = k === null ? C.ink : left ? C.u : C.v;
        p.dot(q, { color, r: 7, key: k === null ? 'all' : left ? 'left' : 'right' });
      }
    }
    if (k !== null && turn === 0 && k > 0 && k < n) {
      const xs = (k - 0.5) * gap - cx;
      p.seg([xs, cy + 0.6], [xs, -cy - 0.6], { color: C.dim, width: 1.5, dash: [5, 4] });
    }
    if (k === null) p.hud([{ text: turn === 1 ? '¼바퀴 돌린 뒤' : '처음 배열' }], 'tl');
  };

  const ro = readout(panel);
  let stop: (() => void) | null = null;
  if (k === null) buttons(panel, [{ label: '↻ ¼바퀴 돌리기', on: () => go(turn < 0.5 ? 1 : 0) }]);
  const go = (to: number) => {
    stop?.();
    const from = turn;
    stop = animate(1000, (u) => ((turn = from + (to - from) * u), sync()), () => (stop = null));
  };
  const sm = slider(panel, { label: '줄 수 m', min: 1, max: 6, step: 1, get: () => m, set: (v) => ((m = v), sync()) });
  const sn = slider(panel, {
    label: '한 줄 n',
    min: 1,
    max: 7,
    step: 1,
    get: () => n,
    set: (v) => {
      n = v;
      if (k !== null) k = Math.min(k, n);
      sync();
    },
  });
  const sk = k !== null ? slider(panel, { label: '나누기 k', min: 0, max: 7, step: 1, get: () => k!, set: (v) => ((k = Math.min(v, n)), sync()) }) : null;
  hint(panel, k === null ? '배열을 돌려도 점은 하나도 생기거나 없어지지 않습니다. 돌린 뒤에는 줄 수와 한 줄의 개수가 서로 바뀝니다.' : '점선이 각 줄을 앞의 k개와 뒤의 n − k개로 가릅니다. 왼쪽 묶음과 오른쪽 묶음을 따로 세어 더해도 전체 개수와 같습니다.');

  function sync() {
    sm.refresh();
    sn.refresh();
    sk?.refresh();
    // 개수는 한 줄씩 더해서 센다(곱셈 = 같은 수를 거듭 더하기)
    const rows = (len: number, cnt: number) => chain(0, new Array(cnt).fill(len));
    const total = rows(n, m);
    const after = turn > 0.99;
    let html = after
      ? `<div>가로 ${fmt(m)}개씩 ${fmt(n)}줄: ${chip(`${fmt(n)} × ${fmt(m)}`, C.ink, 'all')} = ${fmt(rows(m, n))}</div><div class="dim">처음: ${fmt(m)} × ${fmt(n)} = ${fmt(total)}</div>`
      : `<div>가로 ${fmt(n)}개씩 ${fmt(m)}줄: ${chip(`${fmt(m)} × ${fmt(n)}`, C.ink, 'all')} = ${fmt(total)}</div>`;
    if (k !== null) {
      const L = rows(k, m), R = rows(n - k, m);
      html +=
        `<div class="eq">${fmt(m)} × (${chip(fmt(k), C.u, 'left')} + ${chip(fmt(n - k), C.v, 'right')}) = ${chip(`${fmt(m)} × ${fmt(k)}`, C.u, 'left')} + ${chip(`${fmt(m)} × ${fmt(n - k)}`, C.v, 'right')}</div>` +
        `<div>${fmt(total)} = ${fmt(L)} + ${fmt(R)}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
