// 내적 = (𝐮의 길이) × (𝐯가 𝐮 방향 직선에 드리운 그림자의 부호 있는 길이)
// (def.dot, prop.dot-geometric, def.orthogonal, prop.orth-projection)
//
// 𝐯의 끝에서 𝐮 방향 직선으로 수선을 내린다. 원점에서 수선의 발까지가 그림자다.
// 그림자가 𝐮와 같은 쪽이면 초록, 반대쪽이면 빨강으로 칠한다(내적의 부호).
//
// 매개변수
//   u, v:  처음 벡터 (기본 [3, 1], [1, 2])
//   mode:  'dot'  (기본) 내적의 값과 그림자
//          'proj' 정사영 𝐩 = (𝐮·𝐯 / 𝐮·𝐮)𝐮 와 나머지 𝐯 − 𝐩, 직각 표시
//          'sign' 그림자와 각만(식 없이) — 부호와 각의 관계를 볼 때
// 동기화 키: u, v, shadow (그림자/정사영 𝐩), perp (수선 𝐯 − 𝐩), theta (끼인각), dot (내적 값)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { dot, norm, project, sub, scale, normalize, add, type Vec } from '../la/vec';
import { cosBetween } from '../la/area';
import { fmt, chip, vectorEditor } from '../ui/widgets';
import { arc, heading, turn } from './_lib/b3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [3, 1];
  let v: Vec = params.v ?? [1, 2];
  const mode: 'dot' | 'proj' | 'sign' = params.mode ?? 'dot';
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 3.6, bus, height: 380 });
  p.handles.push({ key: 'u', get: () => u, set: (w) => ((u = w), sync()) }, { key: 'v', get: () => v, set: (w) => ((v = w), sync()) });

  p.draw = (p) => {
    p.grid();
    const nu = norm(u), nv = norm(v);
    if (nu > 1e-9) {
      p.line([0, 0], u, { color: C.dim, width: 1, dash: [3, 5] });
      const f = project(v, u);
      const d = dot(u, v);
      const sc = Math.abs(d) < 1e-9 ? C.dim : d > 0 ? C.ok : C.bad;
      p.seg(v, f, { color: C.dim, width: 1.4, dash: [5, 4], key: 'perp' });
      // 직각 표시
      if (norm(sub(v, f)) > 0.15 && norm(f) > 0.15) {
        const e = scale(0.18, normalize(u)), n = scale(0.18, normalize(sub(v, f)));
        p.poly([f, add(f, n), add(add(f, n), scale(Math.sign(-d) || 1, e)), add(f, scale(Math.sign(-d) || 1, e))], { color: C.dim, width: 1 });
      }
      if (mode === 'proj') p.arrow([0, 0], f, { color: sc, width: 4, key: 'shadow', label: 'p' });
      else p.seg([0, 0], f, { color: sc, width: 6, alpha: 0.85, key: 'shadow' });
      if (mode === 'proj') p.arrow(f, v, { color: C.dim, width: 1.6, key: 'perp', label: 'v − p' });
      if (nv > 1e-9) {
        const h0 = heading(u), dd = turn(h0, heading(v));
        const r = Math.min(0.6, 0.35 * Math.min(nu, nv));
        arc(p, h0, h0 + dd, r, { color: C.ink, key: 'theta' });
        const mid = h0 + dd / 2;
        p.text([(r + 0.22) * Math.cos(mid), (r + 0.22) * Math.sin(mid)], 'θ', { color: C.ink, align: 'center' });
      }
    }
    p.arrow([0, 0], u, { color: C.u, label: 'u', key: 'u' });
    p.arrow([0, 0], v, { color: C.v, label: 'v', key: 'v' });
    p.hud([{ text: '두 화살표의 끝을 끌어 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const eu = vectorEditor(eds, { name: 'u', key: 'u', color: C.u, get: () => u, set: (w) => ((u = w), sync()) });
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.v, get: () => v, set: (w) => ((v = w), sync()) });
  const ro = readout(panel);
  hint(
    panel,
    mode === 'proj'
      ? '𝐩는 𝐯에서 𝐮 방향 직선으로 수직으로 내린 발입니다. 𝐯 − 𝐩는 언제나 𝐮와 직교합니다.'
      : '그림자가 𝐮와 같은 쪽이면 초록(내적이 양수), 반대쪽이면 빨강(음수), 그림자가 한 점으로 줄어들면 내적이 0입니다.',
  );

  function sync() {
    eu.refresh();
    ev.refresh();
    const d = dot(u, v), nu = norm(u), nv = norm(v);
    const U = chip('u', C.u, 'u'), V = chip('v', C.v, 'v');
    let html = '';
    if (mode !== 'sign') {
      html += `<div>${U}·${V} = ${fmt(u[0])}·${fmt(v[0])} + ${fmt(u[1])}·${fmt(v[1])} = ${chip(fmt(d, 3), C.ink, 'dot')}</div>`;
    }
    if (nu < 1e-9 || nv < 1e-9) {
      html += `<div class="dim">영벡터는 방향이 없어 각을 잴 수 없습니다.</div>`;
      ro.set(html);
      p.invalidate();
      return;
    }
    const cs = cosBetween(u, v);
    const deg = (Math.acos(cs) * 180) / Math.PI;
    const sh = d / nu;
    const sc = Math.abs(d) < 1e-9 ? C.dim : d > 0 ? C.ok : C.bad;
    html += `<div>${chip('θ', C.ink, 'theta')} ≈ ${fmt(deg, 1)}°, cos θ = ${fmt(cs, 3)}</div>`;
    if (mode === 'dot') {
      html +=
        `<div>‖u‖ = ${fmt(nu, 3)}, ‖v‖ = ${fmt(nv, 3)}</div>` +
        `<div class="eq">‖u‖‖v‖cos θ = ${fmt(nu * nv * cs, 3)}</div>` +
        `<div>${chip('그림자', sc, 'shadow')}의 부호 있는 길이 = ‖v‖cos θ = ${fmt(sh, 3)}</div>` +
        `<div>‖u‖ × 그림자 = ${fmt(nu, 3)} × ${fmt(sh, 3)} = ${fmt(nu * sh, 3)}</div>`;
    }
    if (mode === 'proj') {
      const f = project(v, u);
      const r = sub(v, f);
      html +=
        `<div class="eq">${chip('p', sc, 'shadow')} = (${U}·${V} / ${U}·${U}) ${U} = (${fmt(d, 3)} / ${fmt(dot(u, u), 3)}) ${U}</div>` +
        `<div>&nbsp;&nbsp;= ${chip(`(${fmt(f[0])}, ${fmt(f[1])})`, sc, 'shadow')}</div>` +
        `<div>${chip('v − p', C.dim, 'perp')} = (${fmt(r[0])}, ${fmt(r[1])})</div>` +
        `<div>(${chip('v − p', C.dim, 'perp')})·${U} = ${fmt(dot(r, u), 6)}</div>`;
    }
    const verdict = Math.abs(d) < 1e-9 ? '내적 = 0 · 직각 (직교)' : d > 0 ? '내적 > 0 · 예각 (같은 쪽을 봄)' : '내적 < 0 · 둔각 (반대쪽을 봄)';
    html += `<div class="eq" style="color:${sc}">${verdict}</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
