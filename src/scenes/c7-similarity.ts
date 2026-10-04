// 같은 변환, 두 언어: 왼쪽은 표준 좌표로 본 A, 오른쪽은 새 좌표로 본 B = P⁻¹AP (prop.similarity)
//
// 매개변수
//   A:      변환 (표준 좌표로 적은 행렬, 기본 [[1,1],[0,1]])
//   P:      새 기저를 열로 세운 행렬 (기본 [[2,1],[1,1]])
//   c:      새 좌표로 적은 입력 (기본 [1,1])
//   names:  {p1, p2, std, new} 이름표
// 왼쪽(표준 좌표): 회색 = 표준 격자, 파란 격자 = 새 기저의 격자를 A로 보낸 것. 주황·청록 = A p₁, A p₂.
//                 노랑 v = Pc, 분홍 = A v.
// 오른쪽(새 좌표): 같은 일을 새 좌표로 다시 그린 것. 파란 격자 = B로 보낸 격자, 주황·청록 = B의 열.
//                 노랑 c, 분홍 = B c.
// 진행 막대 t: 왼쪽은 (I에서 A로 가는 중간) × P, 오른쪽은 I에서 B로 가는 중간. 두 그림은 매 순간 같은 움직임이다.
// 동기화 키: col1, col2 (왼쪽 A p₁, A p₂ / 오른쪽 B의 열), x (입력), Ax (출력), P.*, B.*, det
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, col, identity, det2, type Mat } from '../la/mat';
import { inverse } from '../la/solve';
import type { Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, buttons, animate, lerpMat, slider } from '../ui/widgets';
import { twoStages, vecTxt, matHtml } from './_lib/c5-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 1],
    [0, 1],
  ];
  let P: Mat = params.P ?? [
    [2, 1],
    [1, 1],
  ];
  let c: Vec = params.c ?? [1, 1];
  let t = 1;
  const nm = { p1: 'p₁', p2: 'p₂', std: '표준 좌표', new: '새 좌표', ...(params.names ?? {}) };
  const Bm = (): Mat | null => {
    const Pi = inverse(P);
    return Pi ? matMul(matMul(Pi, A), P) : null;
  };

  const { stage, panel } = layout(host);
  const [sl, sr] = twoStages(stage, [`${nm.std}로 본 A`, `${nm.new}로 본 B = P⁻¹AP`]);
  const L = new Plane(sl, { range: params.range ?? 5, bus, height: 340, noZoom: true });
  const R = new Plane(sr, { range: params.rangeR ?? 4, bus, height: 340, noZoom: true });
  R.handles.push({ key: 'x', get: () => c, set: (v) => ((c = v), sync()), enabled: () => t === 0 || t === 1 });

  L.draw = (p) => {
    const M = lerpMat(identity(2), A, t);
    p.grid();
    const MP = matMul(M, P);
    if (inverse(P)) p.tgrid(MP);
    p.arrow([0, 0], col(MP, 0), { color: C.c1, label: t > 0.99 ? `A${nm.p1}` : nm.p1, key: 'col1' });
    p.arrow([0, 0], col(MP, 1), { color: C.c2, label: t > 0.99 ? `A${nm.p2}` : nm.p2, key: 'col2' });
    const v = matVec(P, c);
    p.arrow([0, 0], v, { color: C.x, width: 2, alpha: 0.55, label: 'v', key: 'x' });
    p.arrow([0, 0], matVec(M, v), { color: C.y, label: t > 0.99 ? 'Av' : '', key: 'Ax' });
  };
  R.draw = (p) => {
    const B = Bm();
    p.grid();
    if (!B) return;
    const M = lerpMat(identity(2), B, t);
    p.tgrid(M);
    p.arrow([0, 0], col(M, 0), { color: C.c1, key: 'col1' });
    p.arrow([0, 0], col(M, 1), { color: C.c2, key: 'col2' });
    p.arrow([0, 0], c, { color: C.x, width: 2, alpha: 0.55, label: 'c', key: 'x' });
    p.arrow([0, 0], matVec(M, c), { color: C.y, label: t > 0.99 ? 'Bc' : '', key: 'Ax' });
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ea = matrixEditor(eds, { name: 'A', get: () => A, set: params.lockA ? undefined : (M) => ((A = M), sync()) });
  const ep = matrixEditor(eds, { name: 'P', prefix: 'P', colColors: false, get: () => P, set: params.lockP ? undefined : (M) => ((P = M), sync()) });
  const ec = vectorEditor(eds, { name: 'c', key: 'x', color: C.x, get: () => c, set: (v) => ((c = v), sync()) });
  const ts = slider(panel, { label: '진행', min: 0, max: 1, step: 0.01, get: () => t, set: (v) => ((t = v), sync()), format: (v) => `${Math.round(v * 100)}%` });
  let stop: (() => void) | null = null;
  buttons(panel, [{ label: '▶ 변환하기', on: () => (stop?.(), (stop = animate(1500, (u) => ((t = u), sync()), () => (stop = null)))) }]);
  const ro = readout(panel);
  hint(panel, '진행 막대를 움직이면 두 그림이 같은 움직임을 보입니다. 오른쪽 격자는 왼쪽의 파란 격자를 새 좌표로 다시 그린 것입니다.');

  function sync() {
    ea.refresh();
    ep.refresh();
    ec.refresh();
    ts.refresh();
    const B = Bm();
    const Pi = inverse(P);
    let html = '';
    if (!B || !Pi) html = `<div style="color:${C.bad}">P의 열이 기저가 아니다(det P = 0). 새 좌표를 쓸 수 없다.</div>`;
    else {
      const v = matVec(P, c), Av = matVec(A, v), back = matVec(Pi, Av), Bc = matVec(B, c);
      html += `<div>B = P⁻¹AP = ${matHtml(B, { colColors: true })}</div>`;
      html += `<div>${chip('c', C.x, 'x')} = ${vecTxt(c)} <span class="dim">─P→</span> v = ${vecTxt(v)}</div>`;
      html += `<div><span class="dim">─A→</span> ${chip('Av', C.y, 'Ax')} = ${vecTxt(Av)} <span class="dim">─P⁻¹→</span> ${vecTxt(back)}</div>`;
      html += `<div>${chip('Bc', C.y, 'Ax')} = ${vecTxt(Bc)} <span class="dim">(한 번에)</span></div>`;
      html += `<div>${chip('det A', C.ink, 'det')} = ${fmt(det2(A))}, ${chip('det B', C.ink, 'det')} = ${fmt(det2(B))}</div>`;
    }
    ro.set(html);
    L.invalidate();
    R.invalidate();
  }
  sync();
  return () => {
    stop?.();
    L.destroy();
    R.destroy();
  };
};

export default scene;
