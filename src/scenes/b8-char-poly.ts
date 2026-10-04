// 8장 장면: 특성방정식 det(A − λI) = 0 (prop.char-poly, prop.no-real-eigen)
// 위: A − λI 가 격자와 단위 정사각형을 어디로 보내는지. 아래: λ ↦ det(A − λI) 의 그래프(포물선).
// λ를 움직여 포물선이 λ축과 만나는 자리에 오면, A − λI 가 평면을 직선으로 누르고(넓이 0),
// 눌려 사라지는 방향이 바로 A의 고유 방향이다.
//
// 매개변수
//   A:       처음 행렬 (행 우선). 기본 [[2,1],[1,2]]
//   lambda:  처음 λ. 기본 0
//   presets: 보기 행렬 단추 (기본 true)
//   lockA:   행렬을 못 바꾸게 (기본 false)
// 동기화 키
//   lam   움직이는 λ (아래 그래프의 점) · p  포물선 det(A − λI)
//   lam1, lam2  근 = 고윳값 (하늘, 연두) · v1, v2  고유 방향 직선 (하늘, 연두)
//   det   (A − λI)가 단위 정사각형을 보낸 평행사변형의 넓이
//   col1, col2  A − λI 의 열 (주황, 청록)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matAdd, matScale, identity, det2, trace, col, type Mat } from '../la/mat';
import { add } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, slider } from '../ui/widgets';
import { eigenDirs, plotMap, plotLines, plotFrame, PRESETS, clone, type EigenInfo } from './_lib/b8-util';

const L0 = -3, L1 = 7;

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = clone(params.A ?? [[2, 1], [1, 2]]);
  let lam: number = params.lambda ?? 0;
  let info: EigenInfo = eigenDirs(A);

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.2, bus, height: 320 });
  const g = new Plane(stage, { range: 1, bus, height: 190, noZoom: true });

  const shifted = (l: number): Mat => matAdd(A, matScale(-l, identity(2))); // A − λI
  const poly = (l: number) => det2(shifted(l));
  const roots = (): number[] => (info.kind === 'none' ? [] : info.kind === 'two' ? [...info.values] : [info.values[0]]);
  const yRange = (): [number, number] => {
    const t = trace(A);
    const vertex = poly(t / 2); // 꼭짓점의 높이 = −(판별식)/4
    return [Math.min(-2, vertex - 1), Math.max(6, vertex + 9)];
  };
  const gmap = () => plotMap(g, [L0, L1], yRange());

  function setLam(l: number) {
    for (const r of roots()) if (Math.abs(l - r) < 0.08) l = r; // 근 가까이 오면 붙인다
    lam = Math.min(L1, Math.max(L0, l));
    sync();
  }

  g.handles.push({ key: 'lam', get: () => gmap().to(lam, Math.min(gmap().yr[1], Math.max(gmap().yr[0], poly(lam)))), set: (v) => setLam(gmap().invX(v[0])), snap: 0 });

  p.draw = (p) => {
    const B = shifted(lam);
    const d = det2(B);
    const a1 = col(B, 0), a2 = col(B, 1);
    p.grid();
    p.tgrid(B);
    p.poly([[0, 0], a1, add(a1, a2), a2], { fill: d >= 0 ? C.area : C.areaNeg, key: 'det' });
    const hot = [bus.is('v1', 'lam1'), bus.is('v2', 'lam2')];
    if (info.kind === 'two' || info.kind === 'one') {
      info.dirs.forEach((v, i) => p.line([0, 0], v, { color: i ? C.v : C.u, width: hot[i] ? 3.5 : 1.5, dash: [9, 6], key: i ? 'v2' : 'v1' }));
    }
    p.arrow([0, 0], a1, { color: C.c1, label: '(A−λI)e₁', key: 'col1' });
    p.arrow([0, 0], a2, { color: C.c2, label: '(A−λI)e₂', key: 'col2' });
    const near = roots().find((r) => Math.abs(r - lam) < 1e-9);
    if (near !== undefined) {
      const msg = info.kind === 'all' ? 'A − λI = O: 평면 전체가 원점으로. 모든 방향이 고유 방향' : '넓이 0: A − λI 가 평면을 직선으로 눌렀다. 점선 방향이 통째로 0이 된다';
      p.hud([{ text: msg, color: C.ok }], 'tl');
    } else p.hud([{ text: `넓이 det(A − λI) = ${fmt(d)}` }], 'tl');
  };

  g.draw = (g) => {
    const m = gmap();
    const [y0, y1] = m.yr;
    const step = y1 - y0 > 24 ? 10 : y1 - y0 > 10 ? 5 : 2;
    const yt: number[] = [];
    for (let v = Math.ceil(y0 / step) * step; v <= y1; v += step) yt.push(v);
    const xt: number[] = [];
    for (let v = L0; v <= L1; v++) xt.push(v);
    plotFrame(g, m, { xticks: xt, yticks: yt, color: C.grid, axisColor: C.axis });
    const pts = [];
    for (let k = 0; k <= 400; k++) {
      const l = L0 + ((L1 - L0) * k) / 400;
      pts.push({ x: l, y: poly(l) });
    }
    plotLines(g, m, pts, { color: C.ink, width: 2, key: 'p' });
    const rs = roots();
    rs.forEach((r, i) => {
      const key = i ? 'lam2' : 'lam1';
      g.dot(m.to(r, 0), { color: i ? C.v : C.u, r: 6, key });
      g.text(m.to(r, 0), rs.length === 1 ? 'λ (중근)' : i ? 'λ₂' : 'λ₁', { color: i ? C.v : C.u, dy: -14, align: 'center', bold: true });
    });
    const pv = poly(lam);
    const pc = Math.min(y1, Math.max(y0, pv));
    g.seg(m.to(lam, 0), m.to(lam, pc), { color: C.ink, width: 1, dash: [3, 3], alpha: 0.6 });
    g.dot(m.to(lam, pc), { color: C.ink, r: 6, key: 'lam' });
    g.hud([{ text: info.kind === 'none' ? '포물선이 λ축과 만나지 않는다: 실수 고윳값 없음' : '가로: λ, 세로: det(A − λI)', color: info.kind === 'none' ? C.bad : C.dim }], 'tr');
  };

  // ── 오른쪽 패널 ──
  const med = matrixEditor(panel, { name: 'A', get: () => A, set: params.lockA ? undefined : (B) => setA(B) });
  const sl = slider(panel, { label: 'λ', min: L0, max: L1, step: 0.01, get: () => lam, set: setLam, key: 'lam' });
  const ro = readout(panel);
  const jump = buttons(panel, [
    { label: 'λ₁로', on: () => roots()[0] !== undefined && setLam(roots()[0]) },
    { label: 'λ₂로', on: () => roots()[1] !== undefined && setLam(roots()[1]) },
    { label: 'λ = 0', on: () => setLam(0) },
  ]);
  if (params.presets !== false && !params.lockA) buttons(panel, PRESETS.map((q) => ({ label: q.label, title: q.title, on: () => setA(clone(q.A)) })));
  hint(panel, '아래 그래프의 흰 점을 좌우로 끌어 λ를 바꿀 수 있습니다. 근 가까이 가면 근에 달라붙습니다.');

  function setA(B: Mat) {
    A = B;
    info = eigenDirs(A);
    sync();
  }

  const signed = (v: number, unit: string) => `${v < 0 ? '+' : '−'} ${fmt(Math.abs(v))}${unit}`;
  function sync() {
    med.refresh();
    sl.refresh();
    const t = trace(A), d = det2(A);
    const disc = t * t - 4 * d;
    const rs = roots();
    (jump.children[1] as HTMLElement).style.display = rs.length > 1 ? '' : 'none';
    (jump.children[0] as HTMLElement).style.display = rs.length ? '' : 'none';
    let html =
      `<div>${chip('det(A − λI)', C.ink, 'p')} = λ² ${signed(t, 'λ')} ${signed(-d, '')}</div>` +
      `<div class="dim">tr A = ${fmt(t)}, det A = ${fmt(d)}, 판별식 = ${fmt(disc)}</div>` +
      `<div>${chip(`λ = ${fmt(lam)}`, C.ink, 'lam')} → ${chip(`det = ${fmt(poly(lam))}`, C.x, 'det')}</div>`;
    if (info.kind === 'none') html += `<div style="color:${C.bad}">실근 없음 (판별식 &lt; 0)</div>`;
    else if (rs.length === 1)
      html += `<div>${chip(`중근 λ = ${fmt(rs[0])}`, C.u, 'lam1')} <span class="dim">${info.kind === 'all' ? '모든 방향' : '고유 방향 하나'}</span></div>`;
    else html += `<div>${chip(`λ₁ = ${fmt(rs[0])}`, C.u, 'lam1')}, ${chip(`λ₂ = ${fmt(rs[1])}`, C.v, 'lam2')}</div><div class="dim">합 ${fmt(rs[0] + rs[1])} = tr A, 곱 ${fmt(rs[0] * rs[1])} = det A</div>`;
    ro.set(html);
    p.invalidate();
    g.invalidate();
  }
  sync();
  return () => {
    p.destroy();
    g.destroy();
  };
};

export default scene;
