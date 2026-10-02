// 코사인 법칙: 직각이 아닌 삼각형에서 피타고라스 정리가 틀리는 만큼 (prop.law-of-cosines)
//
// 꼭짓점 O(원점), U, V로 된 삼각형. 끼인각 θ는 O에 있다. 두 변 OU, OV의 끝을 끌 수 있다.
//   a = OU의 길이, b = OV의 길이, c = UV(θ의 맞은편 변)의 길이
// 읽기 칸은 c²과 a² + b²을 나란히 보이고, 그 차이가 −2ab cos θ와 같음을 보인다.
//
// 매개변수
//   u: 점 U의 처음 좌표 (기본 [3, 0])
//   v: 점 V의 처음 좌표 (기본 [1, 2])
//   foot: V에서 OU 직선으로 내린 수선을 보일지 (기본 false)
// 동기화 키: a (변 OU), b (변 OV), c (맞은편 변 UV), theta (끼인각), corr (보정항 −2ab cos θ)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { sub, norm, scale, dot, type Vec } from '../la/vec';
import { cosBetween } from '../la/area';
import { fmt, chip } from '../ui/widgets';
import { arc, heading, turn } from './_lib/b3-twin';

const scene: SceneFn = (host, { bus, params }) => {
  let u: Vec = params.u ?? [3, 0];
  let v: Vec = params.v ?? [1, 2];
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 3.6, bus, height: 380 });
  p.handles.push({ key: 'a', get: () => u, set: (w) => ((u = w), sync()) }, { key: 'b', get: () => v, set: (w) => ((v = w), sync()) });

  p.draw = (p) => {
    p.grid();
    const h0 = heading(u), d = turn(h0, heading(v));
    const r = Math.min(0.7, 0.4 * Math.min(norm(u), norm(v)));
    arc(p, h0, h0 + d, r, { color: C.ink, key: 'theta' });
    const mid = h0 + d / 2;
    p.text([(r + 0.25) * Math.cos(mid), (r + 0.25) * Math.sin(mid)], 'θ', { color: C.ink, align: 'center' });
    if (params.foot && norm(u) > 0) {
      const f = scale(dot(u, v) / dot(u, u), u);
      p.line([0, 0], u, { color: C.dim, width: 1, dash: [3, 5] });
      p.seg(v, f, { color: C.dim, width: 1.2, dash: [5, 4] });
    }
    p.seg([0, 0], u, { color: C.u, width: 3, key: 'a' });
    p.seg([0, 0], v, { color: C.v, width: 3, key: 'b' });
    p.seg(u, v, { color: C.ink, width: 3, key: 'c' });
    for (const q of [[0, 0], u, v] as Vec[]) p.dot(q, { color: C.ink, r: 3.5 });
    p.text(scale(0.5, u), 'a', { color: C.u, dx: 8, dy: 12, bold: true });
    p.text(scale(0.5, v), 'b', { color: C.v, dx: -16, dy: -6, bold: true });
    p.text(scale(0.5, [u[0] + v[0], u[1] + v[1]]), 'c', { color: C.ink, dx: 10, dy: -8, bold: true });
    p.text([0, 0], 'O', { color: C.dim, dx: -14, dy: 12 });
    p.text(u, 'U', { color: C.dim, dx: 10, dy: 12 });
    p.text(v, 'V', { color: C.dim, dx: 10, dy: -12 });
    p.hud([{ text: '점 U, V를 끌어 보세요' }], 'bl');
  };

  const ro = readout(panel);
  hint(panel, '각 θ가 90°일 때만 보정항이 0이 되어 피타고라스 정리로 돌아갑니다. 각이 90°보다 작으면 c²이 더 작고, 크면 더 큽니다.');

  function sync() {
    const a = norm(u), b = norm(v), c = norm(sub(u, v));
    const cs = cosBetween(u, v);
    const corr = -2 * a * b * cs;
    const deg = (Math.acos(cs) * 180) / Math.PI;
    const kind = Math.abs(cs) < 1e-9 ? '직각' : cs > 0 ? '예각 (90°보다 작음)' : '둔각 (90°보다 큼)';
    ro.set(
      `<div>${chip('a', C.u, 'a')} = ${fmt(a)}, ${chip('b', C.v, 'b')} = ${fmt(b)}, ${chip('c', C.ink, 'c')} = ${fmt(c)}</div>` +
        `<div>${chip('θ', C.ink, 'theta')} ≈ ${fmt(deg, 1)}° <span class="dim">· ${kind}</span>, cos θ = ${fmt(cs, 3)}</div>` +
        `<div class="eq">${chip('c²', C.ink, 'c')} = ${fmt(c * c, 3)}</div>` +
        `<div>${chip('a²', C.u, 'a')} + ${chip('b²', C.v, 'b')} = ${fmt(a * a + b * b, 3)}</div>` +
        `<div class="eq">차이 c² − (a² + b²) = ${fmt(c * c - a * a - b * b, 3)}</div>` +
        `<div>${chip('−2ab cos θ', C.ink, 'corr')} = ${fmt(corr, 3)}</div>`,
    );
    p.invalidate();
  }
  sync();
  return () => p.destroy();
};

export default scene;
