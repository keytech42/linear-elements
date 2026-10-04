// 선형 결합: 손잡이 두 개로 섞기 (def.linear-combination)
//
// 𝐮(하늘)와 𝐰(연두)를 c₁배, c₂배 해서 이어 붙인다: c₁𝐮(하늘 점선) 다음 c₂𝐰(연두 점선), 결과 c₁𝐮 + c₂𝐰(흰색).
// target이 있으면 목표 점(흰 고리)을 두고, 결과가 목표에 닿으면 알려 준다.
//
// 매개변수
//   u, w:   처음 두 벡터 (기본 [2, 1], [-1, 1])
//   c1, c2: 처음 계수 (기본 1, 1)
//   target: 목표 점 (기본 없음). 예: [1, 4]
// 동기화 키: u, w, c1, c2, c1u, c2w, combo, target
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { scale, add, sub, norm, linComb, type Vec } from '../la/vec';
import { reachCoeffs } from '../la/ground';
import { fmt, chip, vectorEditor, slider, buttons } from '../ui/widgets';
import { vtxt } from './_lib/c1-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [2, 1];
  let w: Vec = params.w ?? [-1, 1];
  let c1: number = params.c1 ?? 1;
  let c2: number = params.c2 ?? 1;
  let target: Vec | null = params.target ?? null;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 4.5, bus, height: 400 });
  p.handles.push(
    { key: 'u', get: () => u, set: (v) => ((u = v), sync()) },
    { key: 'w', get: () => w, set: (v) => ((w = v), sync()) },
  );

  const hit = () => !!target && norm(sub(linComb([c1, c2], [u, w]), target)) < 0.12;

  p.draw = (p) => {
    p.grid();
    const a = scale(c1, u);
    const r = linComb([c1, c2], [u, w]);
    if (target) {
      p.dot(target, { color: hit() ? C.ok : C.ink, r: 9, alpha: 0.25 });
      p.dot(target, { color: hit() ? C.ok : C.ink, r: 3, key: 'target' });
      p.text(target, '목표', { color: hit() ? C.ok : C.ink, dx: 12, dy: -12, size: 13 });
    }
    p.arrow([0, 0], a, { color: C.u, width: 2, dash: [5, 4], key: 'c1u' });
    p.arrow(a, add(a, scale(c2, w)), { color: C.w, width: 2, dash: [5, 4], key: 'c2w' });
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.arrow([0, 0], w, { color: C.w, label: 'w', key: 'w' });
    p.arrow([0, 0], r, { color: C.ink, label: 'c₁u + c₂w', key: 'combo' });
    p.hud([{ text: target ? (hit() ? '목표에 닿았다' : '손잡이 c₁, c₂로 목표에 닿아 보세요') : 'u, w 끝을 끌고, 오른쪽에서 c₁, c₂를 바꿔 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (v) => ((u = v), sync()) });
  const ew = vectorEditor(eds, { name: 'w', key: 'w', color: C.w, get: () => w, set: (v) => ((w = v), sync()) });
  const s1 = slider(panel, { label: 'c₁', key: 'c1', min: -3, max: 3, step: 0.05, get: () => c1, set: (x) => ((c1 = x), sync()) });
  const s2 = slider(panel, { label: 'c₂', key: 'c2', min: -3, max: 3, step: 0.05, get: () => c2, set: (x) => ((c2 = x), sync()) });
  if (target !== null || params.challenge) {
    buttons(panel, [
      {
        label: '새 목표',
        on: () => {
          // 격자 위의 점 하나를 고른다(원점 제외)
          do target = [Math.round(Math.random() * 6 - 3), Math.round(Math.random() * 6 - 3)];
          while (target[0] === 0 && target[1] === 0);
          sync();
        },
      },
      {
        label: '계수 알려 주기',
        on: () => {
          if (!target) return;
          const k = reachCoeffs(u, w, target);
          if (k) ((c1 = k[0]), (c2 = k[1]));
          sync();
        },
      },
    ]);
  }
  const ro = readout(panel);
  hint(panel, '막대는 0.05 간격으로 움직입니다. 목표에 정확히 닿는 계수가 그 간격에 맞지 않으면 "계수 알려 주기"로 확인하세요.');

  function sync() {
    eu.refresh();
    ew.refresh();
    s1.refresh();
    s2.refresh();
    const r = linComb([c1, c2], [u, w]);
    let html =
      `<div>${chip(fmt(c1), C.u, 'c1')}·${chip('u', C.u, 'u')} + ${chip(fmt(c2), C.w, 'c2')}·${chip('w', C.w, 'w')}</div>` +
      `<div>= ${chip(vtxt(scale(c1, u)), C.u, 'c1u')} + ${chip(vtxt(scale(c2, w)), C.w, 'c2w')} = ${chip(vtxt(r), C.ink, 'combo')}</div>`;
    if (target) {
      const k = reachCoeffs(u, w, target);
      html += `<div>${chip('목표', C.ink, 'target')} ${vtxt(target)}까지 남은 이동: ${vtxt(sub(target, r))}</div>`;
      if (!k) html += `<div class="dim">지금 u와 w는 평행하다. 이 둘로는 한 직선 위의 점에만 닿는다.</div>`;
      else if (hit()) html += `<div style="color:${C.ok}">닿았다: c₁ = ${fmt(c1)}, c₂ = ${fmt(c2)}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
