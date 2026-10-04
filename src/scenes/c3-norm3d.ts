// 3차원 벡터의 길이: 피타고라스 정리를 두 번 (def.norm)
//
// 첫째 직각삼각형: 바닥(z = 0)에서 가로 v₁(주황)과 세로 v₂(청록) → 바닥 대각선 d, d² = v₁² + v₂²
// 둘째 직각삼각형: 바닥 대각선 d와 높이 v₃(보라) → 빗변 𝐯, ‖𝐯‖² = d² + v₃² = v₁² + v₂² + v₃²
// 그림을 끌면 돌려 볼 수 있다.
//
// 매개변수
//   v: 처음 벡터 (기본 [2, 1.5, 2])
// 동기화 키: v (벡터), v1, v2, v3 (세 직각변), d (바닥 대각선)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Space } from '../render/space';
import { C } from '../render/colors';
import { norm, type Vec } from '../la/vec';
import { fmt, chip, vectorEditor } from '../ui/widgets';

const scene: SceneFn = (host, { bus, params }) => {
  let v: Vec = params.v ?? [2, 1.5, 2];
  const { stage, panel } = layout(host);
  const s = new Space(stage, { range: 3.2, bus, height: 380 });
  s.draw = (s) => {
    s.axes(3);
    const f: Vec = [v[0], v[1], 0];
    s.seg([0, 0, 0], [v[0], 0, 0], { color: C.c1, width: 3, key: 'v1' });
    s.seg([v[0], 0, 0], f, { color: C.c2, width: 3, key: 'v2' });
    s.seg([0, 0, 0], f, { color: C.ink, width: 2, dash: [6, 4], key: 'd' });
    s.seg(f, v, { color: C.c3, width: 3, key: 'v3' });
    s.text([v[0] / 2, v[1] / 2, 0], 'd', C.ink);
    s.arrow([0, 0, 0], v, { color: C.v, label: 'v', key: 'v' });
    s.hud([{ text: '그림을 끌어 돌려 보세요' }]);
  };
  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const ev = vectorEditor(eds, { name: 'v', key: 'v', color: C.v, get: () => v, set: (w) => ((v = w), sync()) });
  const ro = readout(panel);
  hint(panel, '바닥 위의 점선 d는 첫째 직각삼각형의 빗변이자, 둘째 직각삼각형(d와 보라 높이)의 한 직각변입니다.');
  function sync() {
    ev.refresh();
    const d = norm([v[0], v[1]]);
    ro.set(
      `<div>${chip('d', C.ink, 'd')}² = ${chip(fmt(v[0]), C.c1, 'v1')}² + ${chip(fmt(v[1]), C.c2, 'v2')}² = ${fmt(d * d, 3)}</div>` +
        `<div>‖${chip('v', C.v, 'v')}‖² = ${chip('d', C.ink, 'd')}² + ${chip(fmt(v[2]), C.c3, 'v3')}² = ${fmt(d * d + v[2] * v[2], 3)}</div>` +
        `<div class="eq">‖v‖ = √${fmt(d * d + v[2] * v[2], 3)} ≈ ${fmt(norm(v), 3)}</div>`,
    );
    s.invalidate();
  }
  sync();
  return () => s.destroy();
};

export default scene;
