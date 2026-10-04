// 8권 장면: 자기 방향을 지키는 벡터 찾기 (exp.eigen-hunt, def.eigen, prop.no-real-eigen)
// 단위원 위의 탐침 벡터 𝐱를 돌리며 A𝐱를 본다. 아래 그래프는 "𝐱에서 A𝐱까지 돌아간 각"을 𝐱의 각에 대해 그린 것.
// 그래프가 0°(같은 방향) 또는 ±180°(반대 방향)를 지나는 자리가 A𝐱가 𝐱의 직선 위에 놓이는 방향이다.
//
// 매개변수
//   A:         처음 행렬 (행 우선). 기본 [[2,1],[1,2]]
//   theta:     탐침 벡터의 처음 각(도). 기본 20
//   showEigen: 평행 방향(고유 방향) 직선을 처음부터 보일지 (기본 false, 단추로 켠다)
//   circle:    단위원의 상을 옅게 그릴지 (기본 false)
//   rot:       주면 A = R_θ 로 두고 이 값(도)을 처음 회전각으로 쓰며, 회전각 슬라이더를 보인다
//   presets:   보기 행렬 단추 (기본 true)
//   lockA:     행렬을 못 바꾸게 (기본 false)
//   range:     보이는 범위 (기본 3.2)
// 동기화 키
//   x  탐침 𝐱 (노랑) · Ax  출력 A𝐱 (분홍) · v1, v2  고유 방향 직선 (하늘, 연두) · angle  돌아간 각(아래 그래프)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, det2, fromCols, rotation, type Mat } from '../la/mat';
import { dot, norm, type Vec } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, animate, slider } from '../ui/widgets';
import { eigenDirs, plotMap, plotLines, plotFrame, PRESETS, clone, deg, rad, type EigenInfo } from './_lib/b8-util';

const PAR = Math.sin(rad(1.6)); // 이 정도 안쪽이면 "같은 직선 위"로 본다

const scene: SceneFn = (host, { bus, params }) => {
  let rotDeg: number | null = typeof params.rot === 'number' ? params.rot : null;
  let A: Mat = rotDeg !== null ? rotation(rad(rotDeg)) : clone(params.A ?? [[2, 1], [1, 2]]);
  let th = rad(params.theta ?? 20);
  let showEigen = !!params.showEigen;
  let info: EigenInfo = eigenDirs(A);

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 3.2, bus, height: 330 });
  const g = new Plane(stage, { range: 1, bus, height: 160, noZoom: true });

  const probe = (t: number): Vec => [Math.cos(t), Math.sin(t)];
  /** 𝐱에서 A𝐱까지 시계 반대 방향으로 잰 각(라디안, −π~π). A𝐱 = 𝟎 이면 null. */
  const turn = (x: Vec): number | null => {
    const y = matVec(A, x);
    if (norm(y) < 1e-9) return null;
    return Math.atan2(det2(fromCols([x, y])), dot(x, y));
  };
  const dirsOf = (e: EigenInfo): Vec[] => (e.kind === 'none' ? [] : e.dirs);
  const gmap = () => plotMap(g, [0, 360], [-180, 180]);

  /** 끌다가 고유 방향 가까이 오면 정확히 그 방향에 붙인다 */
  function setTheta(t: number) {
    for (const d of dirsOf(info)) {
      for (const s of [1, -1]) {
        const a = Math.atan2(s * d[1], s * d[0]);
        const diff = Math.atan2(Math.sin(t - a), Math.cos(t - a));
        if (Math.abs(diff) < rad(2)) t = a;
      }
    }
    th = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    sync();
  }

  p.handles.push({ key: 'x', get: () => probe(th), set: (v) => setTheta(Math.atan2(v[1], v[0])), snap: 0 });
  g.handles.push({
    key: 'x',
    get: () => {
      const a = turn(probe(th));
      return gmap().to(deg(th), a === null ? 0 : deg(a));
    },
    set: (v) => setTheta(rad(Math.min(360, Math.max(0, gmap().invX(v[0]))))),
    snap: 0,
  });

  p.draw = (p) => {
    p.grid();
    const x = probe(th);
    const y = matVec(A, x);
    const a = turn(x);
    const flat = a === null;
    const par = flat || Math.abs(Math.sin(a!)) < PAR;
    p.curve((t) => probe(t), 0, 2 * Math.PI, 90, { color: C.dim, width: 1, dash: [4, 4] });
    if (params.circle) p.curve((t) => matVec(A, probe(t)), 0, 2 * Math.PI, 120, { color: C.ink, width: 1.5, alpha: 0.45 });
    if (showEigen) {
      if (info.kind === 'all') p.hud([{ text: '모든 직선이 평행 방향이다 (A = λI)', color: C.u }], 'tr');
      else dirsOf(info).forEach((d, i) => p.line([0, 0], d, { color: i ? C.v : C.u, width: 1.5, dash: [9, 6], key: i ? 'v2' : 'v1' }));
    }
    // 𝐱가 놓인 직선(스팬)
    p.line([0, 0], x, { color: par ? C.ok : C.x, width: par ? 3 : 1, dash: par ? [] : [3, 6], alpha: par ? 0.75 : 0.5 });
    if (!flat) {
      const r = 0.42;
      p.curve((t) => [r * Math.cos(t), r * Math.sin(t)], th, th + a!, 30, { color: C.dim, width: 1.5, key: 'angle' });
    }
    p.arrow([0, 0], x, { color: C.x, label: 'x', key: 'x' });
    if (!flat) p.arrow([0, 0], y, { color: C.y, label: 'Ax', key: 'Ax' });
    else p.dot([0, 0], { color: C.y, r: 6, key: 'Ax' });
    if (par) {
      const lam = dot(x, y); // ‖𝐱‖ = 1 이므로 A𝐱 = λ𝐱 의 λ = 𝐱·A𝐱
      p.hud([{ text: flat ? 'Ax = 0: 0배로 줄었다' : `Ax가 x의 직선 위에 있다: Ax = ${fmt(lam)}·x`, color: C.ok }], 'tl');
    }
    p.hud([{ text: '노란 화살표 끝을 끌어 단위원을 돌려 보세요' }], 'bl');
  };

  g.draw = (g) => {
    const m = gmap();
    plotFrame(g, m, { xticks: [0, 90, 180, 270, 360], yticks: [-180, -90, 0, 90, 180], xfmt: (v) => `${v}°`, yfmt: (v) => `${v}°`, color: C.grid, axisColor: C.axis });
    if (showEigen && info.kind !== 'all') {
      dirsOf(info).forEach((d, i) => {
        for (const s of [1, -1]) {
          let t = deg(Math.atan2(s * d[1], s * d[0]));
          if (t < 0) t += 360;
          g.seg(m.to(t, -180), m.to(t, 180), { color: i ? C.v : C.u, width: 1.5, dash: [5, 4], key: i ? 'v2' : 'v1' });
        }
      });
    }
    const pts: { x: number; y: number | null }[] = [];
    for (let k = 0; k <= 720; k++) {
      const t = k / 2;
      const a = turn(probe(rad(t)));
      pts.push({ x: t, y: a === null ? null : deg(a) });
    }
    plotLines(g, m, pts, { color: C.ink, width: 2, key: 'angle' }, 180);
    const a = turn(probe(th));
    const par = a === null || Math.abs(Math.sin(a)) < PAR;
    g.seg(m.to(deg(th), -180), m.to(deg(th), 180), { color: C.x, width: 1, alpha: 0.35 });
    if (a !== null) g.dot(m.to(deg(th), deg(a)), { color: par ? C.ok : C.x, r: par ? 7 : 5, key: 'x' });
    g.hud([{ text: 'x에서 Ax까지 돌아간 각 (가로: x의 각)' }], 'tr');
  };

  // ── 오른쪽 패널 ──
  let med: ReturnType<typeof matrixEditor> | null = null;
  if (rotDeg === null) {
    med = matrixEditor(panel, { name: 'A', get: () => A, set: params.lockA ? undefined : (B) => setA(B) });
  }
  const rs =
    rotDeg !== null
      ? slider(panel, { label: '회전각', min: -180, max: 180, step: 1, get: () => rotDeg!, set: (v) => ((rotDeg = v), setA(rotation(rad(v)))), format: (v) => `${fmt(v, 0)}°` })
      : null;
  const ro = readout(panel);
  let stop: (() => void) | null = null;
  const eyeBtn = buttons(panel, [
    {
      label: '▶ 한 바퀴',
      on: () => {
        stop?.();
        const t0 = th;
        stop = animate(7000, (u) => ((th = t0 + 2 * Math.PI * u), sync()), () => (stop = null));
      },
    },
    { label: showEigen ? '답 숨기기' : '답 보기', on: () => ((showEigen = !showEigen), refreshEye(), sync()), title: '평행이 되는 방향을 모두 직선으로' },
  ]);
  const refreshEye = () => ((eyeBtn.children[1] as HTMLElement).textContent = showEigen ? '답 숨기기' : '답 보기');
  if (params.presets !== false && rotDeg === null && !params.lockA) {
    buttons(panel, PRESETS.map((q) => ({ label: q.label, title: q.title, on: () => setA(clone(q.A)) })));
  }
  hint(panel, '아래 그래프의 점도 좌우로 끌 수 있습니다. 그래프가 0° 또는 ±180°를 지나는 자리에서 A𝐱가 𝐱와 같은 직선 위에 놓입니다.');

  function setA(B: Mat) {
    A = B;
    info = eigenDirs(A);
    sync();
  }

  function sync() {
    med?.refresh();
    rs?.refresh();
    const x = probe(th);
    const y = matVec(A, x);
    const a = turn(x);
    let html =
      `<div>${chip('x', C.x, 'x')} = (${fmt(x[0])}, ${fmt(x[1])}) <span class="dim">각 ${fmt(deg(th), 0)}°</span></div>` +
      `<div>${chip('Ax', C.y, 'Ax')} = (${fmt(y[0])}, ${fmt(y[1])})</div>` +
      `<div>${chip('돌아간 각', C.ink, 'angle')} = ${a === null ? '없음 (A𝐱 = 𝟎)' : `${fmt(deg(a), 1)}°`}</div>`;
    if (showEigen) {
      if (info.kind === 'none') html += `<div class="dim">평행한 방향 없음: 모든 𝐱가 돌아간다</div>`;
      else if (info.kind === 'all') html += `<div>모든 방향이 평행: A𝐱 = ${fmt(info.values[0])}𝐱</div>`;
      else if (info.kind === 'one') html += `<div>${chip('평행 방향 하나뿐', C.u, 'v1')}: 배율 ${fmt(info.values[0])}</div>`;
      else
        html +=
          `<div>${chip(`방향 1: 배율 ${fmt(info.values[0])}`, C.u, 'v1')}</div>` +
          `<div>${chip(`방향 2: 배율 ${fmt(info.values[1])}`, C.v, 'v2')}</div>`;
    }
    ro.set(html);
    p.invalidate();
    g.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
    g.destroy();
  };
};

export default scene;
