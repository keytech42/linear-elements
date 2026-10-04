// 가우스 소거 = 기본 행렬을 하나씩 왼쪽에 곱하기 (prop.elimination)
//
// 매개변수
//   A:  2×2 계수 행렬 (기본 [[2,1],[1,-1]])
//   b:  오른쪽 벡터 (기본 [5,1])
// 왼쪽(열의 관점, 출력 평면): 지금까지의 기본 행렬 곱 G = Eₖ⋯E₁ 이 출력 평면 전체를 민다(파란 격자).
//   주황 = G a₁, 청록 = G a₂, 분홍 = G b. 점선 x₁(Ga₁) + x₂(Ga₂) 는 언제나 G b 에 닿는다(해 x는 그대로).
//   끝나면 Ga₁ = e₁, Ga₂ = e₂ 가 되고, G b 가 곧 해 x다.
// 오른쪽(행의 관점, 입력 평면): 지금 식들의 직선(하늘 = 1번, 연두 = 2번). 직선은 돌지만 교점(해)은 움직이지 않는다.
// 동기화 키: col1, col2, b, row1, row2, E (이번 단계의 기본 행렬), det
import type { SceneFn } from './_lib/scene';
import { layout, readout, hint } from './_lib/scene';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, matMul, col, row, identity, det2, type Mat } from '../la/mat';
import { eliminationSteps, solve, type RowOp, type ElimStep } from '../la/solve';
import { scale, type Vec } from '../la/vec';
import { matrixEditor, vectorEditor, fmt, chip, buttons, animate, lerpMat } from '../ui/widgets';
import { twoStages, eqLine, matHtml, vecTxt } from './_lib/c5-kit';

const PRESETS: { label: string; A: Mat; b: Vec }[] = [
  { label: '예 1', A: [[2, 1], [1, -1]], b: [5, 1] },
  { label: '예 2 (맞바꿈)', A: [[0, 2], [3, 1]], b: [4, 5] },
  { label: '납작한 A', A: [[1, 2], [2, 4]], b: [3, 6] },
];

function opText(op: RowOp): string {
  const n = (i: number) => `${i + 1}행`;
  if (op.kind === 'add') return `${n(op.target)} ← ${n(op.target)} ${op.c >= 0 ? '+' : '−'} ${fmt(Math.abs(op.c))} × ${n(op.source)}`;
  if (op.kind === 'swap') return `${n(op.i)} ↔ ${n(op.j)}`;
  return `${n(op.i)} ← ${fmt(op.c)} × ${n(op.i)}`;
}
const opKind = (op: RowOp) => (op.kind === 'add' ? '전단 (행렬식 1)' : op.kind === 'swap' ? '맞바꿈 (행렬식 −1)' : `늘림 (행렬식 ${fmt((op as { c: number }).c)})`);

const scene: SceneFn = (host, { bus, params }) => {
  let A: Mat = params.A ?? PRESETS[0].A;
  let b: Vec = params.b ?? PRESETS[0].b;
  let steps: ElimStep[] = [];
  let k = 0; // 끝낸 단계 수
  let u = 0; // 다음 단계로 가는 중(0~1)

  const G = (): Mat => {
    let M = identity(2);
    for (let i = 0; i < k; i++) M = matMul(steps[i].E, M);
    if (k < steps.length && u > 0) M = matMul(lerpMat(identity(2), steps[k].E, u), M);
    return M;
  };

  const { stage, panel } = layout(host);
  const [sl, sr] = twoStages(stage, ['열의 관점: 출력 평면이 밀린다', '행의 관점: 교점은 그대로']);
  const L = new Plane(sl, { range: params.range ?? 5, bus, height: 340, noZoom: true });
  const R = new Plane(sr, { range: params.rangeR ?? 4, bus, height: 340, noZoom: true });

  L.draw = (p) => {
    const M = G();
    p.grid();
    p.tgrid(M);
    const GA = matMul(M, A), Gb = matVec(M, b);
    const g1 = col(GA, 0), g2 = col(GA, 1);
    p.arrow([0, 0], g1, { color: C.c1, label: 'Ga₁', key: 'col1' });
    p.arrow([0, 0], g2, { color: C.c2, label: 'Ga₂', key: 'col2' });
    const s = solve(A, b);
    if (s.kind !== 'none') {
      const s1 = scale(s.x[0], g1);
      p.arrow([0, 0], s1, { color: C.c1, width: 1.5, dash: [5, 4], alpha: 0.85 });
      p.arrow(s1, matVec(GA, s.x), { color: C.c2, width: 1.5, dash: [5, 4], alpha: 0.85 });
    }
    p.arrow([0, 0], Gb, { color: C.y, label: 'Gb', key: 'b' });
  };
  R.draw = (p) => {
    const M = G();
    p.grid();
    const GA = matMul(M, A), Gb = matVec(M, b);
    eqLine(p, row(GA, 0), Gb[0], { color: C.u, width: 2, key: 'row1' });
    eqLine(p, row(GA, 1), Gb[1], { color: C.v, width: 2, key: 'row2' });
    const s = solve(A, b);
    if (s.kind === 'unique') {
      p.dot(s.x, { color: C.x, r: 5, key: 'x' });
      p.text(s.x, `해 ${vecTxt(s.x)}`, { color: C.x, dx: 10, dy: -12 });
    }
  };

  const eds = panel.appendChild(document.createElement('div'));
  eds.className = 'eds';
  const med = matrixEditor(eds, { name: 'A', get: () => A, set: (M) => ((A = M), reset()) });
  const ved = vectorEditor(eds, { name: 'b', key: 'b', color: C.y, get: () => b, set: (v) => ((b = v), reset()) });
  buttons(panel, PRESETS.map((q) => ({ label: q.label, on: () => ((A = q.A.map((r) => r.slice())), (b = q.b.slice()), reset()) })));
  let stop: (() => void) | null = null;
  buttons(panel, [
    { label: '◀ 이전', on: () => (stop?.(), (u = 0), (k = Math.max(0, k - 1)), sync()) },
    {
      label: '다음 단계 ▶',
      on: () => {
        if (k >= steps.length) return;
        stop?.();
        stop = animate(1000, (t) => ((u = t), sync()), () => ((stop = null), (u = 0), (k += 1), sync()));
      },
    },
    { label: '처음으로', on: () => (stop?.(), (k = 0), (u = 0), sync()) },
  ]);
  const ro = readout(panel);
  hint(panel, '단계마다 같은 행 연산을 A와 b에 함께 합니다. 그 연산은 기본 행렬 E 하나를 왼쪽에 곱하는 것과 같습니다.');

  function reset() {
    stop?.();
    steps = eliminationSteps(A, b);
    k = 0;
    u = 0;
    sync();
  }

  function sync() {
    med.refresh();
    ved.refresh();
    const M = G();
    const GA = matMul(M, A), Gb = matVec(M, b);
    const eq = (i: number) => `${fmt(GA[i][0])}·x₁ + ${fmt(GA[i][1])}·x₂ = ${fmt(Gb[i])}`;
    let html = `<div>${chip('1번', C.u, 'row1')} ${eq(0)}</div><div>${chip('2번', C.v, 'row2')} ${eq(1)}</div>`;
    html += `<div class="dim">단계 ${k} / ${steps.length}</div>`;
    const next = steps[k];
    if (next) html += `<div>다음: ${opText(next.op)} <span class="dim">· ${opKind(next.op)}</span></div><div>${chip('E', C.ink, 'E')} = ${matHtml(next.E)}</div>`;
    else {
      const s = solve(A, b);
      const msg =
        s.kind === 'unique'
          ? [C.ok, `끝: 왼쪽이 I가 되었고, 오른쪽 b 자리에 해 x = ${vecTxt(Gb)} 가 남았다`]
          : s.kind === 'none'
            ? [C.bad, `끝: 0 = ${fmt(Gb[1])} 인 식이 남았다(해가 없다)`]
            : [C.x, '끝: 피벗이 하나뿐이고 0 = 0 인 식이 남았다(해가 무수히 많다)'];
      html += `<div style="color:${msg[0]}">${msg[1]}</div>`;
    }
    html += `<div>${chip('det(GA)', C.ink, 'det')} = ${fmt(det2(GA))} <span class="dim">(det A = ${fmt(det2(A))})</span></div>`;
    ro.set(html);
    L.invalidate();
    R.invalidate();
  }
  reset();
  return () => {
    stop?.();
    L.destroy();
    R.destroy();
  };
};

export default scene;
