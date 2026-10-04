// 되돌리기: A를 한 다음 A⁻¹을 하면 격자가 제자리로 온다 (def.inverse, prop.inverse-product, prop.orthogonal-inverse)
//
// 매개변수
//   A:      처음 행렬 (행 우선). 기본 [[1,1],[0,1]]
//   B:      주면 "곱의 역행렬" 모드: B → A → A⁻¹ → B⁻¹ 순서로 한다(오른쪽 행렬 B가 먼저).
//           "순서를 틀리게" 상자를 켜면 B → A → B⁻¹ → A⁻¹.
//   x:      따라가 볼 입력 벡터 (기본 [2,1])
//   showT:  읽기 칸에 Aᵀ도 보여 주고 A⁻¹과 비교한다 (직교 행렬용)
//   lockA:  행렬을 못 바꾸게
// 동기화 키: col1, col2 (지금까지 한 일의 1열·2열), x (입력), Ax (지금 위치), inv (A⁻¹ 표시), tr (Aᵀ 표시)
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, col, identity, transpose, det2, type Mat } from '../la/mat';
import { inverse } from '../la/solve';
import type { Vec } from '../la/vec';
import { matrixEditor, fmt, chip, buttons, animate, lerpMat, slider, toggle } from '../ui/widgets';
import { matHtml, vecTxt, isIdentity, near } from './_lib/c5-kit';

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? [
    [1, 1],
    [0, 1],
  ];
  const B: Mat | null = params.B ?? null;
  const x: Vec = params.x ?? [2, 1];
  let wrong = false;
  let s = 0; // 진행: 단계 k에서 k+1로 가는 중이면 k ≤ s ≤ k+1

  interface Stage {
    M: Mat;
    name: string;
  }
  function stages(): Stage[] {
    const Ai = inverse(A);
    if (!B) return Ai ? [{ M: A, name: 'A' }, { M: Ai, name: 'A⁻¹' }] : [{ M: A, name: 'A' }];
    const Bi = inverse(B);
    const list: Stage[] = [{ M: B, name: 'B' }, { M: A, name: 'A' }];
    if (!Ai || !Bi) return list;
    return wrong ? [...list, { M: Bi, name: 'B⁻¹' }, { M: Ai, name: 'A⁻¹' }] : [...list, { M: Ai, name: 'A⁻¹' }, { M: Bi, name: 'B⁻¹' }];
  }
  /** 진행 s에서 지금까지 한 일 전체(행렬 하나). 단계 안에서는 다음 행렬을 I에서 조금씩 키운다. */
  function current(): { M: Mat; done: string[] } {
    const st = stages();
    const k = Math.min(Math.floor(s), st.length);
    let M = identity(2);
    const done: string[] = [];
    for (let i = 0; i < k; i++) {
      M = matMul(st[i].M, M);
      done.push(st[i].name);
    }
    const u = s - k;
    if (k < st.length && u > 0) M = matMul(lerpMat(identity(2), st[k].M, u), M);
    return { M, done };
  }

  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: params.range ?? 4, bus, height: 380 });
  p.draw = (p) => {
    const { M } = current();
    p.grid();
    p.tgrid(M);
    p.arrow([0, 0], col(M, 0), { color: C.c1, key: 'col1' });
    p.arrow([0, 0], col(M, 1), { color: C.c2, key: 'col2' });
    p.arrow([0, 0], x, { color: C.x, width: 2, alpha: 0.45, label: 'x', key: 'x' });
    const y = matVec(M, x);
    p.arrow([0, 0], y, { color: C.y, key: 'Ax' });
    p.dot(y, { color: C.y, r: 3 });
    const st = stages();
    p.hud([{ text: `단계: ${st.map((t, i) => (i < Math.floor(s) ? `[${t.name}]` : t.name)).join(' → ')}`, color: C.ink }], 'tl');
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: params.lockA ? undefined : (M) => ((A = M), (s = 0), sync()) });
  if (B) matrixEditor(eds, { name: 'B', prefix: 'B', get: () => B, colColors: false });
  const ro = readout(panel);
  const total = () => stages().length;
  const sl = slider(panel, { label: '진행', min: 0, max: B ? 4 : 2, step: 0.01, get: () => s, set: (v) => ((s = Math.min(v, total())), sync()), format: (v) => `${fmt(Math.min(v, total()), 1)} 단계` });
  let stop: (() => void) | null = null;
  const play = (from: number, to: number) => {
    stop?.();
    stop = animate(900 * Math.abs(to - from), (u) => ((s = from + (to - from) * u), sync()), () => (stop = null));
  };
  buttons(panel, [
    { label: '▶ 끝까지', on: () => play(0, total()) },
    { label: '한 단계 ▶', on: () => play(s, Math.min(total(), Math.floor(s + 1e-9) + 1)) },
    { label: '처음으로', on: () => ((s = 0), stop?.(), sync()) },
  ]);
  if (B) toggle(panel, '순서를 틀리게: A⁻¹보다 B⁻¹을 먼저', () => wrong, (v) => ((wrong = v), (s = Math.min(s, 2)), sync()));
  hint(panel, '진행 막대를 끌면 지금까지 한 일 전체가 격자로 보입니다. 분홍 화살표는 노란 x가 지금 가 있는 자리입니다.');

  function sync() {
    med.refresh();
    sl.refresh();
    const { M, done } = current();
    const Ai = inverse(A);
    let html = '';
    if (!Ai) html += `<div style="color:${C.bad}">det A = ${fmt(det2(A))}: A⁻¹이 없다. 되돌릴 단계가 없다.</div>`;
    else html += `<div>${chip('A⁻¹', C.ink, 'inv')} = ${matHtml(Ai, { colColors: true })}</div>`;
    if (params.showT) {
      const T = transpose(A);
      const same = Ai && T.every((r, i) => r.every((v, j) => Math.abs(v - Ai[i][j]) < 1e-9));
      html += `<div>${chip('Aᵀ', C.ink, 'tr')} = ${matHtml(T)} <span class="dim">${same ? '= A⁻¹' : '≠ A⁻¹'}</span></div>`;
    }
    const name = done.length ? [...done].reverse().join('') : 'I';
    const y = matVec(M, x);
    html += `<div>지금까지 한 일 = ${matHtml(M, { colColors: true })} ${Math.abs(s - Math.round(s)) < 1e-9 ? `<span class="dim">= ${name}</span>` : ''}</div>`;
    html += `<div>${chip('x', C.x, 'x')} = ${vecTxt(x)} → ${chip(vecTxt(y), C.y, 'Ax')}</div>`;
    if (s >= total() - 1e-9 && total() > 1) {
      const back = isIdentity(M) && near(y, x);
      html += `<div style="color:${back ? C.ok : C.bad}">${back ? '격자도 x도 제자리로 돌아왔다.' : '제자리가 아니다: 되돌리는 순서가 틀렸다.'}</div>`;
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
