// 스칼라 곱: 늘이고, 줄이고, 뒤집기 (def.scalar-mul)
//
// 𝐯(연두)와 c𝐯(흰색)를 함께 그린다. c를 바꾸면 c𝐯는 언제나 𝐯가 놓인 직선(점선) 위에 머문다.
// trail이 켜져 있으면 지금까지 지나간 c𝐯의 끝점을 남겨, c를 모든 수로 바꿀 때 무엇이 그려지는지 보인다.
//
// 매개변수
//   v:     처음 벡터 (기본 [2, 1])
//   c:     처음 스칼라 (기본 1.5)
//   line:  𝐯가 놓인 직선을 점선으로 보일지 (기본 true)
//   trail: c𝐯의 끝점 자국을 남길지 (기본 false)
// 동기화 키: v, cv, c
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { scale, type Vec } from '../la/vec';
import { fmt, chip, vectorEditor, slider, buttons } from '../ui/widgets';
import { colHtml } from './_lib/b1-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let v: Vec = params.v ?? [2, 1];
  let c: number = params.c ?? 1.5;
  const showLine = params.line !== false;
  const trailOn = params.trail ?? false;
  const trail: number[] = [];

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4, bus, height: 360 });
  p.handles.push({ key: 'v', get: () => v, set: (w) => ((v = w), (trail.length = 0), sync()) });

  p.draw = (p) => {
    p.grid();
    if (showLine && (v[0] !== 0 || v[1] !== 0)) p.line([0, 0], v, { color: C.dim, width: 1, dash: [4, 5] });
    for (const t of trail) p.dot(scale(t, v), { color: C.ink, r: 2, alpha: 0.45 });
    const cv = scale(c, v);
    p.arrow([0, 0], cv, { color: C.ink, label: `${fmt(c)}v`, key: 'cv' });
    p.arrow([0, 0], v, { color: C.v, width: 2, alpha: 0.85, label: 'v', key: 'v' });
    p.hud([{ text: '연두 화살표 끝을 끌고, 오른쪽에서 c를 바꿔 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.v, get: () => v, set: (w) => ((v = w), (trail.length = 0), sync()) });
  const sl = slider(panel, { label: 'c', key: 'c', min: -3, max: 3, step: 0.05, get: () => c, set: (x) => setC(x) });
  buttons(panel, [
    { label: 'c = 2', on: () => setC(2) },
    { label: 'c = 0.5', on: () => setC(0.5) },
    { label: 'c = −1', on: () => setC(-1) },
    { label: 'c = 0', on: () => setC(0) },
  ]);
  const ro = readout(panel);
  hint(panel, trailOn ? '막대를 끝에서 끝까지 천천히 밀어 보세요. 흰 점이 c𝐯의 끝점이 지나간 자리입니다.' : 'c가 음수이면 화살표가 반대쪽을 가리킵니다. 길이는 |c|배가 됩니다.');

  function setC(x: number) {
    c = x;
    if (trailOn && !trail.some((t) => Math.abs(t - x) < 0.02)) trail.push(x);
    sync();
  }

  function sync() {
    ev.refresh();
    sl.refresh();
    const cv = scale(c, v);
    const what = c === 0 ? '영벡터가 된다(원점에 멈춘다)' : c < 0 ? `뒤집히고, 길이가 ${fmt(Math.abs(c))}배가 된다` : c === 1 ? '그대로다' : c > 1 ? `같은 방향으로 ${fmt(c)}배 늘어난다` : `같은 방향으로 ${fmt(c)}배로 줄어든다`;
    ro.set(
      `<div>${chip(fmt(c), C.ink, 'c')} · ${colHtml(v, { color: C.v, key: 'v' })} = ${colHtml(cv, { key: 'cv' })}</div>` +
        `<div>성분마다: ${fmt(c)} × ${fmt(v[0])} = ${fmt(cv[0])}, &nbsp;${fmt(c)} × ${fmt(v[1])} = ${fmt(cv[1])}</div>` +
        `<div class="dim">화살표가 ${what}.</div>`,
    );
    p.invalidate();
  }
  if (trailOn) trail.push(c);
  sync();
  return () => p.destroy();
};

export default scene;
