// 같은 평면 위의 두 격자, 같은 점의 두 이름 (def.change-of-basis)
//
// 매개변수
//   P:       새 기저를 열로 세운 행렬 (기본 [[2,1],[1,1]])
//   v:       점(벡터) (기본 [3,2]). 끌 수 있다
//   names:   이름표 {e1, e2, p1, p2, std, new} (예: 수도꼭지 — e1 '온수', e2 '냉수', p1 '합', p2 '차')
//   lockP:   P를 못 바꾸게
// 그림: 회색 격자 = 표준 좌표, 파란 격자 = 새 기저 p₁(주황), p₂(청록)가 만드는 격자.
//       노란 v. 주황·청록 점선 = c₁p₁ + c₂p₂ (새 이름으로 찾아가는 길), 회색 점선 = v₁e₁ + v₂e₂ (표준 이름으로 찾아가는 길).
// 동기화 키: col1, col2 (= p₁, p₂), x (= v), std, new
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { coords, inverse } from '../la/solve';
import { scale, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip } from '../ui/widgets';
import { matHtml } from './_lib/b5-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let P: Mat = params.P ?? [
    [2, 1],
    [1, 1],
  ];
  let v: Vec = params.v ?? [3, 2];
  const nm = { e1: 'e₁', e2: 'e₂', p1: 'p₁', p2: 'p₂', std: '표준 좌표', new: '새 좌표', ...(params.names ?? {}) };
  const ok = () => inverse(P) !== null;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 380 });
  p.handles.push({ key: 'x', get: () => v, set: (w) => ((v = w), sync()) });
  if (!params.lockP)
    p.handles.push(
      { key: 'col1', get: () => col(P, 0), set: (w) => ((P = P.map((r, i) => [w[i], r[1]])), sync()) },
      { key: 'col2', get: () => col(P, 1), set: (w) => ((P = P.map((r, i) => [r[0], w[i]])), sync()) },
    );

  p.draw = (p) => {
    p.grid();
    if (ok()) p.tgrid(P);
    // 표준 이름으로 가는 길: v₁e₁ 다음 v₂e₂
    p.arrow([0, 0], [v[0], 0], { color: C.dim, width: 1.4, dash: [3, 4], key: 'std' });
    p.arrow([v[0], 0], v, { color: C.dim, width: 1.4, dash: [3, 4], key: 'std' });
    const p1 = col(P, 0), p2 = col(P, 1);
    p.arrow([0, 0], p1, { color: C.c1, label: nm.p1, key: 'col1' });
    p.arrow([0, 0], p2, { color: C.c2, label: nm.p2, key: 'col2' });
    if (ok()) {
      const c = coords(P, v);
      const s1 = scale(c[0], p1);
      p.arrow([0, 0], s1, { color: C.c1, width: 1.6, dash: [6, 4], alpha: 0.9, key: 'new' });
      p.arrow(s1, matVec(P, c), { color: C.c2, width: 1.6, dash: [6, 4], alpha: 0.9, key: 'new' });
    }
    p.arrow([0, 0], v, { color: C.x, label: 'v', key: 'x' });
    p.text([p.bounds.x1, 0], nm.e1, { color: C.dim, dx: -8, dy: -12, align: 'right' });
    p.text([0, p.bounds.y1], nm.e2, { color: C.dim, dx: 8, dy: 14 });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'P', get: () => P, set: params.lockP ? undefined : (M) => ((P = M), sync()) });
  const ved = vectorEditor(eds, { name: 'v', key: 'x', color: C.x, get: () => v, set: (w) => ((v = w), sync()) });
  const ro = readout(panel);
  hint(panel, params.lockP ? '노란 v의 끝을 끌어 보세요. 같은 점에 이름이 두 개 붙습니다.' : '노란 v, 주황 p₁, 청록 p₂의 끝을 끌 수 있습니다.');

  function sync() {
    med.refresh();
    ved.refresh();
    let html = `<div>${chip(nm.std, C.dim, 'std')}: (${fmt(v[0])}, ${fmt(v[1])}) <span class="dim">= ${fmt(v[0])}·${nm.e1} + ${fmt(v[1])}·${nm.e2}</span></div>`;
    const Pi = inverse(P);
    if (!Pi) html += `<div style="color:${C.bad}">p₁, p₂가 한 직선 위에 있다: 기저가 아니라서 새 이름을 붙일 수 없다.</div>`;
    else {
      const c = coords(P, v);
      html += `<div>${chip(nm.new, C.ink, 'new')}: (${fmt(c[0])}, ${fmt(c[1])}) <span class="dim">= ${fmt(c[0])}·${chip('p₁', C.c1, 'col1')} + ${fmt(c[1])}·${chip('p₂', C.c2, 'col2')}</span></div>`;
      const back = matVec(P, c);
      html += `<div class="dim">P × (새 좌표) = (${fmt(back[0])}, ${fmt(back[1])}) = 표준 좌표</div>`;
      html += `<div>P⁻¹ = ${matHtml(Pi)} <span class="dim">: 표준 좌표 → 새 좌표</span></div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
