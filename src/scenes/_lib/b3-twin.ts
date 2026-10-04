// 3장·4장 장면 보조: 그림 칸을 좌우 두 쪽으로 나눈다(두 관점을 나란히 보여 줄 때).
// 좁은 화면에서는 위아래로 쌓인다. styles.css를 고치지 않도록 모양은 인라인으로 준다.
import { el } from '../../ui/widgets';
import type { Plane } from '../../render/plane';
import type { Vec } from '../../la/vec';

export function twin(stage: HTMLElement, titles: [string, string]): [HTMLElement, HTMLElement] {
  const row = el('div');
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  const mk = (title: string) => {
    const box = el('div');
    box.style.flex = '1 1 260px';
    box.style.minWidth = '0';
    const cap = el('div', 'dim', title);
    cap.style.fontSize = '12.5px';
    cap.style.padding = '6px 10px 0';
    box.appendChild(cap);
    row.appendChild(box);
    return box;
  };
  const a = mk(titles[0]);
  const b = mk(titles[1]);
  b.style.borderLeft = '1px solid rgba(160,175,200,0.18)';
  stage.appendChild(row);
  return [a, b];
}

/** 그림 방향각(화면에 그리기 위한 값일 뿐, 읽기 칸에 보이는 수가 아니다) */
export const heading = (v: Vec) => Math.atan2(v[1], v[0]);

/**
 * 점 c를 중심으로 각 a0 → a1 로 도는 호(반지름 r, 수학 단위).
 * arrow가 참이면 도는 쪽을 보이도록 끝에 화살촉을 붙인다.
 */
export function arc(p: Plane, a0: number, a1: number, r: number, st: { color: string; width?: number; key?: string; arrow?: boolean; c?: Vec; dash?: number[] }) {
  const c = st.c ?? [0, 0];
  const at = (t: number): Vec => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
  if (Math.abs(a1 - a0) < 1e-6) return;
  p.curve(at, a0, a1, 48, { color: st.color, width: st.width ?? 1.6, key: st.key, dash: st.dash });
  if (st.arrow) {
    const d = a1 > a0 ? -1 : 1;
    const back = Math.min(Math.abs(a1 - a0) * 0.5, 0.25 / Math.max(r, 0.2));
    p.arrow(at(a1 + d * back), at(a1), { color: st.color, width: st.width ?? 1.6, head: 9 });
  }
}

/** a0에서 a1로 가는 각을 (−π, π] 안의 차이로 */
export function turn(a0: number, a1: number): number {
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d <= -Math.PI) d += 2 * Math.PI;
  return d;
}
