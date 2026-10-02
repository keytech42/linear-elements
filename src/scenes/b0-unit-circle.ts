// 단위원 위의 점: 각 θ = 호의 길이, (cos θ, sin θ) = 그 점의 좌표 (def.angle-trig, prop.cos-sin-identity)
//
// 흰 점을 원 위에서 끌면, (1, 0)에서 시계 반대 방향으로 잰 호(노랑)의 길이가 θ다.
// 점에서 가로축으로 내린 발까지가 cos θ(주황), 세로축으로 건넌 발까지가 sin θ(청록)다.
//
// 매개변수
//   theta:    처음 각(라디안) (기본 0.8)
//   identity: 원점, 가로축 위의 발, 점이 이루는 직각삼각형과 cos²θ + sin²θ를 보일지 (기본 false)
//   level:    수를 주면 높이 y = level인 가로선과 그 선이 원과 만나는 점들을 그린다 (예: 0.5)
// 동기화 키: P (원 위의 점), theta (호), cos, sin, one (반지름 1)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { axisLabels } from './_lib/b0-kit';
import { circlePoint, angleOf, distance } from '../la/ground';
import { fmt, chip } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let th: number = params.theta ?? 0.8;
  const showId: boolean = params.identity ?? false;
  const level: number | null = params.level ?? null;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 1.45, bus, height: 380 });
  p.handles.push({ key: 'P', get: () => circlePoint(th), set: (v) => ((th = angleOf(v)), sync()), snap: 0 });

  p.draw = (p) => {
    p.grid(0.5);
    axisLabels(p);
    p.curve(circlePoint, 0, 2 * Math.PI, 160, { color: C.ink, width: 1.5 });
    const P = circlePoint(th);
    // θ: 원 위의 호와 원점 근처의 작은 호
    p.curve(circlePoint, 0, th, Math.max(2, Math.ceil(th * 30)), { color: C.x, width: 5, key: 'theta' });
    p.curve((t) => [0.18 * Math.cos(t), 0.18 * Math.sin(t)], 0, th, 40, { color: C.x, width: 1.5 });
    p.text(circlePoint(th / 2).map((c) => c * 1.12), 'θ', { color: C.x, align: 'center', bold: true });
    if (level !== null && Math.abs(level) <= 1) {
      p.seg([-1.6 * 2, level], [1.6 * 2, level], { color: C.u, width: 1, dash: [6, 4] });
      const s = Math.asin(level);
      for (const t of [s, Math.PI - s]) p.dot(circlePoint(t), { color: C.u, r: 5 });
    }
    p.seg([0, 0], P, { color: C.dim, width: 1.5, key: 'one' });
    p.seg(P, [P[0], 0], { color: C.dim, width: 1, dash: [4, 4] });
    p.seg(P, [0, P[1]], { color: C.dim, width: 1, dash: [4, 4] });
    p.seg([0, 0], [P[0], 0], { color: C.c1, width: 5, key: 'cos' });
    p.seg([0, 0], [0, P[1]], { color: C.c2, width: 5, key: 'sin' });
    p.text([P[0] / 2, 0], 'cos θ', { color: C.c1, dy: P[1] >= 0 ? 16 : -16, align: 'center' });
    p.text([0, P[1] / 2], 'sin θ', { color: C.c2, dx: P[0] >= 0 ? -8 : 8, align: P[0] >= 0 ? 'right' : 'left' });
    if (showId) {
      p.seg([P[0], 0], P, { color: C.c2, width: 3, alpha: 0.7 });
      p.seg([0, 0], P, { color: C.ink, width: 2.5, key: 'one' });
      p.text([P[0] / 2, P[1] / 2], '1', { color: C.ink, dx: -10 * Math.sign(P[1] || 1), dy: -10, bold: true });
    }
    p.dot(P, { color: C.ink, r: 6, key: 'P' });
    p.hud([{ text: '흰 점을 원을 따라 끌어 보세요' }], 'bl');
  };

  const ro = readout(panel);
  hint(panel, showId ? '가로 이동 cos θ와 세로 이동 sin θ는 서로 수직이고, 빗변은 반지름 1입니다.' : 'θ는 각의 크기를 "원 위에서 걸어간 길이"로 잰 것입니다. 한 바퀴는 2π ≈ 6.28입니다.');

  function sync() {
    const [c, s] = circlePoint(th);
    let html =
      `<div>${chip('θ', C.x, 'theta')} = ${fmt(th, 3)} <span class="dim">(라디안) ≈ ${fmt((th * 180) / Math.PI, 1)}°</span></div>` +
      `<div>${chip('cos θ', C.c1, 'cos')} ≈ ${fmt(c, 3)}</div>` +
      `<div>${chip('sin θ', C.c2, 'sin')} ≈ ${fmt(s, 3)}</div>`;
    if (showId) {
      html +=
        `<div class="eq">cos²θ + sin²θ ≈ ${fmt(c * c, 3)} + ${fmt(s * s, 3)} = ${fmt(c * c + s * s, 6)}</div>` +
        `<div class="dim">원점에서의 거리 = ${fmt(distance([0, 0], [c, s]), 6)}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
