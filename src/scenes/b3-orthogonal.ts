// 직교 행렬은 길이와 각도를 지킨다 (def.orthogonal-matrix, prop.orthogonal-preserves)
//
// 비대칭 글자 "F"(노랑 = 입력)와 그 상(분홍 = 출력), 두 벡터 𝐮, 𝐯(점선)와 그 상 Q𝐮, Q𝐯(실선)를 그린다.
// 각 θ와 "반사" 상자로 Q = R_θ 또는 Q = R_θ·diag(1, −1)를 만든다. 행렬 칸을 직접 바꾸면 직교가 깨지고,
// 그 순간 길이와 각도도 깨지는 것을 읽기 칸이 보여 준다.
//
// 매개변수
//   theta:   처음 각(도) (기본 30)
//   reflect: 반사를 섞을지 (기본 false)
//   Q:       처음 행렬을 직접 줄 때 (주면 theta/reflect보다 우선)
// 동기화 키: col1, col2 (Q의 열), u, v, Qu, Qv, QTQ (QᵀQ), shape (도형)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, transpose, rotation, col, identity, frobenius, matAdd, matScale, type Mat } from '../la/mat';
import { dot, norm, type Vec } from '../la/vec';
import { angleBetween } from '../la/area';
import { matrixEditor, fmt, chip, slider, toggle } from '../ui/widgets';

const F: Vec[] = [
  [0.3, 0.2], [0.55, 0.2], [0.55, 0.8], [1.0, 0.8], [1.0, 1.0], [0.55, 1.0], [0.55, 1.3], [1.15, 1.3], [1.15, 1.5], [0.3, 1.5],
];

const scene: SceneFn = (host, { bus, params }) => {
  let th = ((params.theta ?? 30) * Math.PI) / 180;
  let refl = !!params.reflect;
  const build = (): Mat => (refl ? matMul(rotation(th), [[1, 0], [0, -1]]) : rotation(th));
  let Q: Mat = params.Q ?? build();
  const u: Vec = [2, 0.5], v: Vec = [0.5, 1.5];
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 2.6, bus, height: 380 });

  p.draw = (p) => {
    p.grid();
    p.tgrid(Q);
    p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
    p.poly(F, { fill: 'rgba(245,197,66,0.10)', color: C.x, width: 1, alpha: 1, key: 'shape' });
    p.poly(F.map((q) => matVec(Q, q)), { fill: 'rgba(255,107,213,0.22)', color: C.y, width: 1.5, key: 'shape' });
    p.arrow([0, 0], u, { color: C.u, width: 1.5, dash: [5, 4], label: 'u', key: 'u' });
    p.arrow([0, 0], v, { color: C.v, width: 1.5, dash: [5, 4], label: 'v', key: 'v' });
    p.arrow([0, 0], matVec(Q, u), { color: C.u, label: 'Qu', key: 'Qu' });
    p.arrow([0, 0], matVec(Q, v), { color: C.v, label: 'Qv', key: 'Qv' });
    p.arrow([0, 0], col(Q, 0), { color: C.c1, width: 2, key: 'col1' });
    p.arrow([0, 0], col(Q, 1), { color: C.c2, width: 2, key: 'col2' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'Q', get: () => Q, set: (B) => ((Q = B), sync()), digits: 3, step: 0.05 });
  const sl = slider(panel, { label: '각 θ', min: -180, max: 180, step: 1, get: () => Math.round((th * 180) / Math.PI), set: (d) => ((th = (d * Math.PI) / 180), (Q = build()), sync()), format: (d) => `${fmt(d, 0)}°` });
  const tg = toggle(panel, '반사를 섞기: Q = R_θ · diag(1, −1)', () => refl, (b) => ((refl = b), (Q = build()), sync()));
  const ro = readout(panel);
  hint(panel, '각과 반사 상자로 만든 Q는 언제나 직교 행렬입니다. 행렬 칸을 직접 바꿔 직교를 깨 보세요.');

  function sync() {
    med.refresh();
    sl.refresh();
    tg.refresh();
    const G = matMul(transpose(Q), Q);
    const ok = frobenius(matAdd(G, matScale(-1, identity(2)))) < 1e-6;
    const Qu = matVec(Q, u), Qv = matVec(Q, v);
    const deg = (r: number) => `${fmt((r * 180) / Math.PI, 1)}°`;
    const same = (a: number, b: number) => (Math.abs(a - b) < 1e-6 ? `<span style="color:${C.ok}">같다</span>` : `<span style="color:${C.bad}">다르다</span>`);
    ro.set(
      `<div>${chip('QᵀQ', C.ink, 'QTQ')} = [${fmt(G[0][0], 3)}, ${fmt(G[0][1], 3)}; ${fmt(G[1][0], 3)}, ${fmt(G[1][1], 3)}] <span style="color:${ok ? C.ok : C.bad}">${ok ? '= I · 직교 행렬' : '≠ I · 직교 행렬이 아님'}</span></div>` +
        `<div class="eq">‖${chip('u', C.u, 'u')}‖ = ${fmt(norm(u), 3)}, ‖${chip('Qu', C.u, 'Qu')}‖ = ${fmt(norm(Qu), 3)} · ${same(norm(u), norm(Qu))}</div>` +
        `<div>‖${chip('v', C.v, 'v')}‖ = ${fmt(norm(v), 3)}, ‖${chip('Qv', C.v, 'Qv')}‖ = ${fmt(norm(Qv), 3)} · ${same(norm(v), norm(Qv))}</div>` +
        `<div>u·v = ${fmt(dot(u, v), 3)}, (Qu)·(Qv) = ${fmt(dot(Qu, Qv), 3)} · ${same(dot(u, v), dot(Qu, Qv))}</div>` +
        `<div>u와 v의 각 = ${deg(angleBetween(u, v))}, Qu와 Qv의 각 = ${deg(angleBetween(Qu, Qv))}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
