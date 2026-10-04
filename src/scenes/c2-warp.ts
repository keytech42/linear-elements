// 변환 = 평면의 모든 점을 어딘가로 옮기는 규칙 (def.transformation, prop.linear-grid)
//
// 고른 변환 T로 격자 전체를 옮겨 그린다. 노란 점 x를 끌면 분홍 점 T(x)가 따라 움직인다.
// "진행" 슬라이더는 제자리(0%)에서 T(100%)까지 평면이 움직이는 모습을 보여 준다: F_s(v) = (1 − s)v + sT(v).
//
// 매개변수
//   map:    처음 변환. 'linear' | 'translate' | 'bend' | 'twist' (기본 'bend')
//   maps:   단추로 보여 줄 변환 목록 (기본 네 개 모두)
//   A:      'linear'에 쓸 행렬 (기본 [[1,1],[0,1]], 행 우선)
//   x:      입력 점의 처음 값 (기본 [1.5, 1])
//   line:   true면 x를 지나는 직선과 그 위에 같은 간격으로 놓인 점들, 그리고 그 상을 그린다 (기본 false)
//   d:      line일 때 직선의 방향 (기본 [1, 0.5])
//   range:  보이는 범위 (기본 4)
// 동기화 키: x (입력), Tx (출력), origin (원점의 도착지), line (입력 직선), tline (그 상), d (방향 손잡이)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { add, scale, sub, norm, type Vec } from '../la/vec';
import type { Mat } from '../la/mat';
import { translateBy, bend, twist, linearMap, blendMap, type Map2 } from '../la/warp';
import { fmt, chip, buttons, animate, slider } from '../ui/widgets';

type Key = 'linear' | 'translate' | 'bend' | 'twist';

const scene: SceneFn = (host, { bus, params }) => {
  const A: Mat = params.A ?? [
    [1, 1],
    [0, 1],
  ];
  const shift: Vec = [1, 0.5];
  const MAPS: Record<Key, { label: string; f: Map2; formula: string; note: string }> = {
    linear: {
      label: '전단(선형)',
      f: linearMap(A),
      formula: `T(x, y) = (${fmt(A[0][0])}x + ${fmt(A[0][1])}y, ${fmt(A[1][0])}x + ${fmt(A[1][1])}y)`,
      note: '격자선이 곧고, 평행하고, 고른 간격을 유지합니다. 원점도 제자리입니다.',
    },
    translate: {
      label: '평행 이동',
      f: translateBy(shift),
      formula: `T(x, y) = (x + ${fmt(shift[0])}, y + ${fmt(shift[1])})`,
      note: '격자는 곧지만 원점이 움직였습니다.',
    },
    bend: {
      label: '휘기',
      f: bend,
      formula: 'T(x, y) = (x, y + x²/4)',
      note: '원점은 제자리지만 가로 격자선이 포물선으로 휩니다.',
    },
    twist: {
      label: '소용돌이',
      f: (v) => twist(v),
      formula: 'T(x) = x를 0.3 × (x의 길이) 라디안만큼 돌린 것',
      note: '원점은 제자리지만 멀리 있는 점일수록 더 많이 돌아서 격자선이 휩니다.',
    },
  };
  const list: Key[] = params.maps ?? ['linear', 'translate', 'bend', 'twist'];
  let key: Key = params.map ?? 'bend';
  let x: Vec = params.x ?? [1.5, 1];
  let d: Vec = params.d ?? [1, 0.5];
  const showLine = !!params.line;
  let s = 1; // 진행 0~1
  const T = (): Map2 => blendMap(MAPS[key].f, s);

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 380 });
  p.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) });
  if (showLine) p.handles.push({ key: 'd', get: () => add(x, d), set: (v) => (norm(sub(v, x)) > 0.2 && (d = sub(v, x)), sync()) });

  p.draw = (p) => {
    const F = T();
    p.grid();
    p.tgrid([[1, 0], [0, 1]], { fn: F, samples: 80 });
    if (showLine) {
      // 입력 직선 x + t·d 와 그 위의 점 x + k·d (k = −3 … 3), 그리고 그 상
      p.line(x, d, { color: C.u, width: 1.5, dash: [6, 5], alpha: 0.8, key: 'line' });
      p.curve((t) => F(add(x, scale(t, d))), -8, 8, 200, { color: C.y, width: 2.2, key: 'tline' });
      for (let k = -3; k <= 3; k++) {
        p.dot(add(x, scale(k, d)), { color: C.u, r: 3, alpha: 0.8 });
        p.dot(F(add(x, scale(k, d))), { color: C.y, r: 3.5 });
      }
      p.arrow(x, add(x, d), { color: C.u, width: 2, key: 'd', label: 'd' });
    }
    const o = F([0, 0]);
    p.dot([0, 0], { color: C.dim, r: 3 });
    if (norm(o) > 1e-9) p.arrow([0, 0], o, { color: C.bad, width: 1.5, dash: [4, 3], key: 'origin' });
    p.dot(o, { color: C.bad, r: 4.5, key: 'origin' });
    const y = F(x);
    p.seg(x, y, { color: C.dim, width: 1, dash: [3, 4] });
    p.dot(x, { color: C.x, r: 5, key: 'x' });
    p.text(x, 'x', { color: C.x, dx: 9, dy: -11 });
    p.dot(y, { color: C.y, r: 5, key: 'Tx' });
    p.text(y, 'T(x)', { color: C.y, dx: 9, dy: -11 });
    p.hud([{ text: showLine ? '노란 점과 하늘색 화살표 끝을 끌어 보세요' : '노란 점 x를 끌어 보세요' }], 'bl');
  };

  // ── 오른쪽 패널 ──
  const row = buttons(
    panel,
    list.map((k) => ({ label: MAPS[k].label, on: () => choose(k) })),
  );
  const btns = [...row.querySelectorAll('button')];
  const ro = readout(panel);
  buttons(panel, [{ label: '▶ 제자리에서 T로', on: () => play(), title: '아무것도 하지 않는 변환에서 T까지 천천히' }]);
  const sl = slider(panel, { label: '진행', min: 0, max: 1, step: 0.01, get: () => s, set: (v) => ((s = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  hint(panel, '진행을 0%에서 100%로 옮기면 평면의 모든 점이 제자리에서 T가 정한 자리로 함께 움직입니다. 파란 격자는 원래 격자선이 옮겨 간 모습입니다.');

  let stop: (() => void) | null = null;
  function play() {
    stop?.();
    stop = animate(1400, (u) => ((s = u), sync()), () => (stop = null));
  }
  function choose(k: Key) {
    key = k;
    sync();
  }

  function sync() {
    sl.refresh();
    btns.forEach((b, i) => b.classList.toggle('on', list[i] === key));
    const F = T();
    const y = F(x), o = F([0, 0]);
    const m = MAPS[key];
    let html =
      `<div class="dim">${m.formula}</div>` +
      `<div>${chip('x', C.x, 'x')} = (${fmt(x[0])}, ${fmt(x[1])}) → ${chip('T(x)', C.y, 'Tx')} = (${fmt(y[0])}, ${fmt(y[1])})</div>` +
      `<div>${chip('원점', C.bad, 'origin')} (0, 0) → (${fmt(o[0])}, ${fmt(o[1])})</div>`;
    if (showLine) {
      // 상에서 이웃한 점 사이의 간격: 같은 간격이면 고른 것
      const gaps: string[] = [];
      for (let k = -1; k <= 1; k++) gaps.push(fmt(norm(sub(F(add(x, scale(k + 1, d))), F(add(x, scale(k, d))))), 2));
      html += `<div>${chip('상', C.y, 'tline')}에서 이웃한 점 사이 거리: ${gaps.join(', ')}</div>`;
    }
    if (s === 1) html += `<div class="eq">${m.note}</div>`;
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
