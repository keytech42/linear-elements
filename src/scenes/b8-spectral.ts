// 8장 장면: 대칭 행렬의 고유벡터는 수직이고, 단위원은 그 축의 타원이 된다 (prop.spectral, prop.sym-ellipse)
// 대칭 고정을 켜 두면 s₁₂를 바꿀 때 s₂₁도 같이 바뀐다. 끄면 대칭이 아닌 행렬과 비교할 수 있다.
// 대칭이 아니면 고유 방향은 서로 수직이 아니고, 타원의 축(흰 점선)도 고유 방향과 어긋난다(9장의 질문).
// 타원의 축은 src/la/svd.ts 의 svd2로 계산한다(9장에서 증명하는 방법). 여기서는 비교용 그림으로만 쓴다.
//
// 매개변수
//   S:       처음 행렬 (행 우선). 기본 [[2,1],[1,2]]
//   mirror:  대칭 고정을 처음에 켤지 (기본 true)
//   probe:   단위원 위의 탐침 𝐱와 S𝐱를 보일지 (기본 true)
//   theta:   탐침의 처음 각(도). 기본 70
//   axes:    타원의 축을 늘 보일지 (기본: 대칭이 아닐 때만)
//   presets: 보기 행렬 단추 (기본 true)
// 동기화 키
//   v1, v2  단위 고유벡터 𝐪₁, 𝐪₂ 와 그 상 λ𝐪 (하늘, 연두) · lam1, lam2  고윳값
//   x  탐침 (노랑) · Ax  S𝐱 (분홍) · ellipse  단위원의 상 · axes  타원의 축 · quad  𝐱·(S𝐱)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { dot, scale, type Vec } from '../la/vec';
import { svd2 } from '../la/svd';
import { matrixEditor, fmt, chip, buttons, toggle } from '../ui/widgets';
import { eigenDirs, clone, deg, rad, type EigenInfo } from './_lib/b8-util';

const SYM_PRESETS: { label: string; S: Mat }[] = [
  { label: '[2 1; 1 2]', S: [[2, 1], [1, 2]] },
  { label: '[5 2; 2 2]', S: [[5, 2], [2, 2]] },
  { label: '[1 2; 2 1]', S: [[1, 2], [2, 1]] },
  { label: '[1 2; 2 4]', S: [[1, 2], [2, 4]] },
  { label: '2I', S: [[2, 0], [0, 2]] },
];
const ASYM_PRESETS: { label: string; S: Mat }[] = [
  { label: '[3 1; 0 2]', S: [[3, 1], [0, 2]] },
  { label: '전단 [1 1; 0 1]', S: [[1, 1], [0, 1]] },
];

const scene: SceneFn = (host, { bus, params }) => {
  let S: Mat = clone(params.S ?? [[2, 1], [1, 2]]);
  let mirror = params.mirror !== false;
  const showProbe = params.probe !== false;
  let th = rad(params.theta ?? 70);
  let info: EigenInfo = eigenDirs(S);
  const isSym = () => Math.abs(S[0][1] - S[1][0]) < 1e-12;

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 3.6, bus, height: 400 });
  const probe = (): Vec => [Math.cos(th), Math.sin(th)];
  if (showProbe) p.handles.push({ key: 'x', get: probe, set: (v) => ((th = Math.atan2(v[1], v[0])), sync()), snap: 0 });

  p.draw = (p) => {
    p.grid();
    const circ = (t: number): Vec => [Math.cos(t), Math.sin(t)];
    p.curve(circ, 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
    p.curve((t) => matVec(S, circ(t)), 0, 2 * Math.PI, 160, { color: C.ink, width: 2.2, key: 'ellipse' });
    const sym = isSym();
    if (params.axes || !sym) {
      const { U, S: sig } = svd2(S);
      [0, 1].forEach((i) => {
        const u = scale(sig[i], col(U, i));
        if (sig[i] > 1e-9) p.seg(scale(-1, u), u, { color: C.ink, width: 1.2, dash: [2, 5], alpha: 0.9, key: 'axes' });
      });
      if (!sym) p.text(scale(sig[0], col(U, 0)), '타원의 축', { color: C.ink, dx: 8, dy: 12, size: 12 });
    }
    if (info.kind !== 'none') {
      info.dirs.forEach((q, i) => {
        const c = i ? C.v : C.u, key = i ? 'v2' : 'v1';
        const hot = bus.is(key, i ? 'lam2' : 'lam1');
        p.line([0, 0], q, { color: c, width: hot ? 2.5 : 1, dash: [9, 6], alpha: 0.8, key });
        const lam = info.kind === 'none' ? 0 : info.values[i];
        p.arrow([0, 0], scale(lam, q), { color: c, width: 2, dash: [5, 3], alpha: 0.85, key });
        p.arrow([0, 0], q, { color: c, label: i ? 'q₂' : 'q₁', key });
      });
      if (info.dirs.length === 2) {
        const [q1, q2] = info.dirs;
        if (Math.abs(dot(q1, q2)) < 1e-9) {
          const r = 0.22;
          p.poly([[0, 0], scale(r, q1), [r * (q1[0] + q2[0]), r * (q1[1] + q2[1])], scale(r, q2)], { color: C.ok });
        }
      }
    }
    if (showProbe) {
      const x = probe();
      p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
      p.arrow([0, 0], matVec(S, x), { color: C.y, label: 'Sx', key: 'Ax' });
    }
    if (info.kind === 'none') p.hud([{ text: '실수 고유 방향 없음', color: C.bad }], 'tl');
    else if (info.kind === 'all') p.hud([{ text: 'S = λI: 모든 방향이 고유 방향, 상은 원', color: C.ok }], 'tl');
    p.hud([{ text: showProbe ? '노란 화살표 끝을 끌어 단위원을 돌려 보세요' : '' }], 'bl');
  };

  // ── 오른쪽 패널 ──
  const med = matrixEditor(panel, {
    name: 'S',
    get: () => S,
    set: (B) => {
      if (mirror) {
        if (B[0][1] !== S[0][1]) B[1][0] = B[0][1];
        else if (B[1][0] !== S[1][0]) B[0][1] = B[1][0];
      }
      setS(B);
    },
  });
  const tg = toggle(panel, '대칭 고정 (s₁₂ = s₂₁)', () => mirror, (v) => {
    mirror = v;
    if (v) setS([[S[0][0], S[0][1]], [S[0][1], S[1][1]]]);
  });
  const ro = readout(panel);
  buttons(panel, SYM_PRESETS.map((q) => ({ label: q.label, on: () => ((mirror = true), tg.refresh(), setS(clone(q.S))) })));
  if (params.presets !== false)
    buttons(panel, ASYM_PRESETS.map((q) => ({ label: q.label, title: '대칭이 아닌 행렬 (대칭 고정이 꺼진다)', on: () => ((mirror = false), tg.refresh(), setS(clone(q.S))) })));
  hint(panel, '점선 화살표는 λ𝐪, 곧 S가 고유벡터를 보낸 자리입니다. 대칭이면 이 두 점이 타원의 가장 먼 점과 가장 가까운 점입니다.');

  function setS(B: Mat) {
    S = B;
    info = eigenDirs(S);
    sync();
  }

  function sync() {
    med.refresh();
    tg.refresh();
    const sym = isSym();
    const { S: sig } = svd2(S);
    let html = `<div class="dim">${sym ? 'Sᵀ = S (대칭)' : '대칭이 아님'}</div>`;
    if (info.kind === 'none') html += `<div style="color:${C.bad}">실수 고윳값 없음</div>`;
    else if (info.kind === 'one') html += `<div>${chip(`λ = ${fmt(info.values[0])} (중근)`, C.u, 'lam1')}: 고유 방향 하나뿐</div>`;
    else {
      const [q1, q2] = info.dirs;
      const ang = deg(Math.acos(Math.min(1, Math.abs(dot(q1, q2)))));
      html +=
        `<div>${chip(`λ₁ = ${fmt(info.values[0])}`, C.u, 'lam1')}, ${chip(`λ₂ = ${fmt(info.values[1])}`, C.v, 'lam2')}</div>` +
        `<div>${chip(`q₁ = (${fmt(q1[0])}, ${fmt(q1[1])})`, C.u, 'v1')}, ${chip(`q₂ = (${fmt(q2[0])}, ${fmt(q2[1])})`, C.v, 'v2')}</div>` +
        `<div>q₁·q₂ = ${fmt(dot(q1, q2), 3)} <span class="dim">(두 직선 사이 각 ${fmt(ang, 1)}°)</span></div>`;
    }
    html += `<div>${chip('타원의 반지름', C.ink, 'axes')} ${fmt(sig[0])}, ${fmt(sig[1])}</div>`;
    if (showProbe) {
      const x = probe();
      html += `<div>${chip('x·(Sx)', C.y, 'quad')} = ${fmt(dot(x, matVec(S, x)))}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
