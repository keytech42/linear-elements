// LoRA를 경사 하강으로 학습해도, 에카르트–영이 정한 바닥 아래로는 내려갈 수 없다 (exp.lora)
// 목표 변화량 T(8×8, 특이값 3, 2, 1.2, 0.6, 0.3, 0.15, 0.08, 0.04)를 랭크 r의 BA로 맞춘다.
// 손실 L = ‖BA − T‖_F². 기울기: ∂L/∂B = 2(BA − T)Aᵀ, ∂L/∂A = 2Bᵀ(BA − T).
// 초기값은 LoRA 논문을 따른다: B = 0(그래서 처음엔 ΔW = 0), A = 작은 무작위 값.
// 점선 = 바닥 Σ_{i>r} σᵢ² (prop.eckart-young). 학습한 손실은 이 선에 닿을 수는 있어도 뚫을 수는 없다.
//
// 매개변수: r (기본 2)
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { Chart } from './_lib/chart';
import { C } from '../render/colors';
import { matMul, transpose, type Mat } from '../la/mat';
import { svd } from '../la/svd';
import { fmt, slider, buttons, el } from '../ui/widgets';

const N = 8;
const SIG = [3, 2, 1.2, 0.6, 0.3, 0.15, 0.08, 0.04];

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
}

const scene: SceneFn = (host, { params }) => {
  let r = params.r ?? 2;
  const R = rng(7);
  const rand = (): Mat => Array.from({ length: N }, () => Array.from({ length: N }, R));
  const Q1 = svd(rand()).U, Q2 = svd(rand()).V;
  const T = matMul(matMul(Q1, SIG.map((s, i) => SIG.map((_, j) => (i === j ? s : 0)))), transpose(Q2));
  let B: Mat, A: Mat, losses: number[], step: number;
  const lr = 0.04;
  const reset = () => {
    const R2 = rng(11 + r);
    B = Array.from({ length: N }, () => new Array(r).fill(0));
    A = Array.from({ length: r }, () => Array.from({ length: N }, () => R2() * 0.2));
    losses = [];
    step = 0;
    losses.push(loss());
  };
  const resid = () => matMul(B, A).map((row, i) => row.map((v, j) => v - T[i][j]));
  const loss = () => resid().flat().reduce((a, v) => a + v * v, 0);
  const floor = () => SIG.slice(r).reduce((a, s) => a + s * s, 0);
  const gdStep = () => {
    const G = resid();
    const gB = matMul(G, transpose(A));
    const gA = matMul(transpose(B), G);
    B = B.map((row, i) => row.map((v, j) => v - lr * 2 * gB[i][j]));
    A = A.map((row, i) => row.map((v, j) => v - lr * 2 * gA[i][j]));
    step++;
    losses.push(loss());
  };

  const root = el('div', 'scene-grid');
  host.appendChild(root);
  const stage = el('div', 'scene-stage');
  const panel = el('div', 'scene-panel');
  root.append(stage, panel);
  const chart = new Chart(stage, 340);
  chart.pad.l = 44;
  const rs = slider(panel, { label: 'r', min: 1, max: 8, step: 1, get: () => r, set: (v) => ((r = v), reset(), redraw()), format: (v) => String(v) });
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    const tick = () => {
      for (let k = 0; k < 4 && step < 600; k++) gdStep();
      redraw();
      if (step < 600) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  buttons(panel, [
    { label: '▶ 학습', on: play },
    { label: '처음부터', on: () => (cancelAnimationFrame(raf), reset(), redraw()) },
    {
      label: 'B×2, A÷2',
      title: '곱 BA는 그대로, 인자만 바뀐다',
      on: () => {
        B = B.map((row) => row.map((v) => v * 2));
        A = A.map((row) => row.map((v) => v / 2));
        losses.push(loss());
        redraw();
      },
    },
  ]);
  const ro = readout(panel);
  hint(panel, 'r을 바꿔 가며 학습해 보세요. 손실(흰 선)이 점선(바닥)에 닿고 멈춥니다. "B×2, A÷2"를 누르면 B와 A가 바뀌어도 손실이 그대로입니다. B와 A 각각에는 고유한 뜻이 없고, 곱 BA만 뜻을 가집니다.');

  chart.draw = (c) => {
    const L0 = losses[0];
    c.xr = [0, 600];
    c.yr = [0, L0 * 1.05];
    c.frame('학습 단계', '손실 ‖BA − T‖²', [0, floor(), L0]);
    c.hline(floor(), C.u, `바닥 Σᵢ₍ᵢ>ᵣ₎ σᵢ² = ${fmt(floor(), 4)}`);
    c.line(losses.map((_, i) => i), losses, C.ink, 2);
  };
  function redraw() {
    rs.refresh();
    const L = losses[losses.length - 1];
    ro.set(
      `<div>단계 ${step} · 손실 ${fmt(L, 5)}</div>` +
        `<div>바닥(에카르트–영) ${fmt(floor(), 5)} <span class="verdict ${L - floor() < 1e-4 ? 'ok' : ''}">${L - floor() < 1e-4 ? '— 닿았다' : ''}</span></div>` +
        `<div class="dim">학습하는 숫자 ${2 * N * r}개 / 전체 ${N * N}개</div>`,
    );
    chart.invalidate();
  }
  reset();
  redraw();
  return () => {
    cancelAnimationFrame(raf);
    chart.destroy();
  };
};

export default scene;
