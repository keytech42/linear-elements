// 8장 장면: 대각합 (def.trace)
// a₁₁ = 𝐞₁·(A𝐞₁): A𝐞₁ 가운데 𝐞₁ 방향으로 남은 몫. a₂₂ = 𝐞₂·(A𝐞₂): A𝐞₂ 가운데 𝐞₂ 방향으로 남은 몫.
// 대각합은 이 두 몫의 합이다. nudge를 켜면 "A를 조금만(t배) 더한 변환" I + tA 의 넓이 배율이
// 1 + t·tr A + t²·det A 와 같음을 단위 정사각형으로 보인다.
//
// 매개변수
//   A:      처음 행렬 (행 우선). 기본 [[3,1],[0,2]]
//   nudge:  I + tA 보기 (기본 false). 주면 t 슬라이더가 생긴다
//   t:      처음 t (기본 0.2)
// 동기화 키
//   col1, col2  A의 열 (주황, 청록) · a11, a22  대각 성분 = 그림자 · tr  대각합 · det  I + tA 의 넓이
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { col, trace, det2, matAdd, matScale, identity, type Mat } from '../la/mat';
import { add, dot, type Vec } from '../la/vec';
import { matrixEditor, fmt, chip, slider } from '../ui/widgets';
import { clone } from './_lib/c8-util';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = clone(params.A ?? [[3, 1], [0, 2]]);
  const nudge = !!params.nudge;
  let t: number = params.t ?? 0.2;
  const e1: Vec = [1, 0], e2: Vec = [0, 1];

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: nudge ? 2.2 : 3.6, bus, height: 380 });
  p.handles.push(
    { key: 'col1', get: () => col(A, 0), set: (v) => setCol(0, v), enabled: () => !nudge },
    { key: 'col2', get: () => col(A, 1), set: (v) => setCol(1, v), enabled: () => !nudge },
  );
  function setCol(j: number, v: Vec) {
    A = A.map((r, i) => r.map((a, k) => (k === j ? v[i] : a)));
    sync();
  }
  const M = (): Mat => matAdd(identity(2), matScale(t, A)); // I + tA

  p.draw = (p) => {
    p.grid();
    if (nudge) {
      const B = M();
      const b1 = col(B, 0), b2 = col(B, 1);
      p.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { color: C.dim, dash: [4, 4] });
      p.tgrid(B);
      p.poly([[0, 0], b1, add(b1, b2), b2], { fill: det2(B) >= 0 ? C.area : C.areaNeg, color: C.x, key: 'det' });
      p.arrow([0, 0], b1, { color: C.c1, label: '(I+tA)e₁', key: 'col1' });
      p.arrow([0, 0], b2, { color: C.c2, label: '(I+tA)e₂', key: 'col2' });
      p.hud([{ text: `넓이 배율 det(I + tA) = ${fmt(det2(B), 4)}` }], 'tl');
      return;
    }
    const a1 = col(A, 0), a2 = col(A, 1);
    const s1 = dot(e1, a1), s2 = dot(e2, a2); // a₁₁, a₂₂
    // 수선: A𝐞₁ 끝에서 가로축으로, A𝐞₂ 끝에서 세로축으로
    p.seg(a1, [s1, 0], { color: C.c1, width: 1, dash: [3, 4], alpha: 0.7 });
    p.seg(a2, [0, s2], { color: C.c2, width: 1, dash: [3, 4], alpha: 0.7 });
    p.seg([0, 0], [s1, 0], { color: C.c1, width: 6, alpha: 0.55, key: 'a11' });
    p.seg([0, 0], [0, s2], { color: C.c2, width: 6, alpha: 0.55, key: 'a22' });
    p.text([s1, 0], `a₁₁ = ${fmt(s1)}`, { color: C.c1, dy: 16, align: 'center' });
    p.text([0, s2], `a₂₂ = ${fmt(s2)}`, { color: C.c2, dx: -8, align: 'right' });
    p.arrow([0, 0], a1, { color: C.c1, label: 'Ae₁', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: 'Ae₂', key: 'col2' });
    p.hud([{ text: '굵은 막대: 각 화살표가 자기 축 방향으로 남긴 몫' }, { text: '주황·청록 화살표 끝을 끌어 보세요' }], 'bl');
  };

  const med = matrixEditor(panel, { name: 'A', get: () => A, set: (B) => ((A = B), sync()) });
  const ts = nudge ? slider(panel, { label: 't', min: -0.5, max: 0.5, step: 0.01, get: () => t, set: (v) => ((t = v), sync()) }) : null;
  const ro = readout(panel);
  hint(panel, nudge ? 't를 0 가까이 줄일수록 t²·det A 항이 작아져 넓이 배율이 1 + t·tr A 에 가까워집니다.' : '대각합은 대각선 성분만 더합니다. 대각선 밖의 성분 a₁₂, a₂₁은 대각합에 영향을 주지 않습니다.');

  function sync() {
    med.refresh();
    ts?.refresh();
    const tr = trace(A), d = det2(A);
    let html =
      `<div>${chip('tr A', C.ink, 'tr')} = ${chip(fmt(A[0][0]), C.c1, 'a11')} + ${chip(fmt(A[1][1]), C.c2, 'a22')} = ${fmt(tr)}</div>`;
    if (nudge) {
      const B = M();
      html +=
        `<div>${chip('det(I + tA)', C.x, 'det')} = ${fmt(det2(B), 4)}</div>` +
        `<div class="dim">1 + t·tr A + t²·det A = 1 + ${fmt(t)}·${fmt(tr)} + ${fmt(t * t, 4)}·${fmt(d)} = ${fmt(1 + t * tr + t * t * d, 4)}</div>` +
        `<div class="dim">1 + t·tr A 만 = ${fmt(1 + t * tr, 4)}</div>`;
    } else html += `<div class="dim">det A = ${fmt(d)} (대각합과는 다른 수)</div>`;
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
