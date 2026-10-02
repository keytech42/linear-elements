// 8권 장면: 대칭 행렬의 기하 (S𝐱)·𝐲 = 𝐱·(S𝐲) (def.symmetric)
// 두 벡터 𝐱, 𝐲를 끌며 "𝐱를 보낸 뒤 𝐲와 내적한 값"과 "𝐲를 보낸 뒤 𝐱와 내적한 값"을 비교한다.
// 대칭 고정을 켜 두면 s₁₂를 바꿀 때 s₂₁도 같이 바뀐다(대각선을 거울로 삼아 비친 자리).
//
// 매개변수
//   S:     처음 행렬 (행 우선). 기본 [[2,1],[1,0]]
//   x, y:  처음 두 벡터. 기본 [1,1], [-1,1]
//   mirror: 대칭 고정을 처음에 켤지 (기본 true)
// 동기화 키
//   x  𝐱 (노랑) · Ax  S𝐱 (분홍) · y  𝐲 (흰색) · Sy  S𝐲 (흰 점선) · a12, a21  비대각 성분
//   lhs  (S𝐱)·𝐲 · rhs  𝐱·(S𝐲)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, transpose, type Mat } from '../la/mat';
import { dot, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, toggle } from '../ui/widgets';
import { clone } from './_lib/b8-util';

const scene: SceneFn = (host, { bus, params }) => {
  let S: Mat = clone(params.S ?? [[2, 1], [1, 0]]);
  let x: Vec = params.x ?? [1, 1];
  let y: Vec = params.y ?? [-1, 1];
  let mirror = params.mirror !== false;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.4, bus, height: 380 });
  p.handles.push({ key: 'x', get: () => x, set: (v) => ((x = v), sync()) }, { key: 'y', get: () => y, set: (v) => ((y = v), sync()) });

  p.draw = (p) => {
    p.grid();
    p.tgrid(S);
    const Sx = matVec(S, x), Sy = matVec(S, y);
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    p.arrow([0, 0], Sx, { color: C.y, label: 'Sx', key: 'Ax' });
    p.arrow([0, 0], y, { color: C.ink, label: 'y', key: 'y' });
    p.arrow([0, 0], Sy, { color: C.ink, dash: [6, 4], label: 'Sy', key: 'Sy' });
    p.hud([{ text: '노란 화살표와 흰 화살표의 끝을 끌어 보세요' }], 'bl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, {
    name: 'S',
    get: () => S,
    set: (B) => {
      if (mirror) {
        // 바뀐 칸이 비대각이면 거울 자리도 같이 바꾼다
        if (B[0][1] !== S[0][1]) B[1][0] = B[0][1];
        else if (B[1][0] !== S[1][0]) B[0][1] = B[1][0];
      }
      S = B;
      sync();
    },
  });
  const vx = vectorEditor(eds, { name: 'x', key: 'x', color: C.x, get: () => x, set: (v) => ((x = v), sync()) });
  const vy = vectorEditor(eds, { name: 'y', key: 'y', color: C.ink, get: () => y, set: (v) => ((y = v), sync()) });
  toggle(panel, '대칭 고정 (s₁₂ = s₂₁)', () => mirror, (v) => {
    mirror = v;
    if (v) S = [[S[0][0], S[0][1]], [S[0][1], S[1][1]]];
    sync();
  });
  const ro = readout(panel);
  hint(panel, '대칭 고정을 끄고 s₂₁만 바꿔 보세요. 두 값이 갈라집니다.');

  function sync() {
    med.refresh();
    vx.refresh();
    vy.refresh();
    const l = dot(matVec(S, x), y);
    const r = dot(x, matVec(S, y));
    const St = transpose(S);
    const sym = St[0][1] === S[0][1];
    const same = Math.abs(l - r) < 1e-9;
    ro.set(
      `<div>${chip('(Sx)·y', C.y, 'lhs')} = ${fmt(l)}</div>` +
        `<div>${chip('x·(Sy)', C.ink, 'rhs')} = ${fmt(r)}</div>` +
        `<div style="color:${same ? C.ok : C.bad}">${same ? '같다' : `다르다 (차이 ${fmt(l - r)})`}</div>` +
        `<div class="dim">${sym ? 'Sᵀ = S: 대칭' : `대칭 아님: ${chip(`s₁₂ = ${fmt(S[0][1])}`, C.c2, 'a12')}, ${chip(`s₂₁ = ${fmt(S[1][0])}`, C.c1, 'a21')}`}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
