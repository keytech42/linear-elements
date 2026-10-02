// LoRA의 매개변수 수: 전체 미세조정 m·n 개 vs LoRA r(m + n) 개 (exp.lora)
// 직사각형의 넓이가 곧 숫자의 개수다. W(m×n)는 큰 사각형, B(m×r)는 세로로 가는 띠, A(r×n)는 가로로 가는 띠.
//
// 매개변수: m, n, r (기본 4096, 4096, 8)
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { C } from '../render/colors';
import { fmt, slider, el } from '../ui/widgets';

const scene: SceneFn = (host, { params }) => {
  let lm = Math.log2(params.m ?? 4096), ln = Math.log2(params.n ?? 4096), r = params.r ?? 8;
  const root = el('div', 'scene-grid');
  host.appendChild(root);
  const stage = el('div', 'scene-stage');
  const panel = el('div', 'scene-panel');
  root.append(stage, panel);
  const cv = el('canvas');
  cv.style.width = '100%';
  cv.style.height = '340px';
  cv.style.display = 'block';
  stage.appendChild(cv);
  const ctx = cv.getContext('2d')!;

  const sl = [
    slider(panel, { label: 'm (출력)', min: 6, max: 13, step: 1, get: () => lm, set: (v) => ((lm = v), draw()), format: (v) => String(2 ** v) }),
    slider(panel, { label: 'n (입력)', min: 6, max: 13, step: 1, get: () => ln, set: (v) => ((ln = v), draw()), format: (v) => String(2 ** v) }),
    slider(panel, { label: 'r (랭크)', min: 1, max: 256, step: 1, get: () => r, set: (v) => ((r = v), draw()), format: (v) => String(v) }),
  ];
  const ro = readout(panel);
  hint(panel, '그림의 넓이가 숫자의 개수에 비례합니다. r을 아무리 키워도 B와 A는 띠일 뿐입니다. 띠 두 개의 넓이가 W와 같아지는 r은 mn/(m+n)입니다.');

  function draw() {
    sl.forEach((s) => s.refresh());
    const m = 2 ** lm, n = 2 ** ln;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // 단위: 가장 큰 변이 260px
    const s = 260 / Math.max(m, n);
    const rw = Math.max(1, r * s);
    const box = (x: number, y: number, bw: number, bh: number, fill: string, label: string) => {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.strokeRect(x + 0.5, y + 0.5, bw, bh);
      ctx.fillStyle = C.ink;
      ctx.font = '13px "Pretendard", system-ui, sans-serif';
      ctx.fillText(label, x, y - 6);
    };
    box(20, 40, n * s, m * s, 'rgba(124,196,255,0.25)', `ΔW: ${m}×${n}`);
    const x0 = 40 + n * s + 30;
    box(x0, 40, rw, m * s, 'rgba(255,122,89,0.5)', `B: ${m}×${r}`);
    box(x0 + rw + 16, 64, n * s, rw, 'rgba(53,201,180,0.5)', `A: ${r}×${n}`);
    ctx.fillStyle = C.dim;
    ctx.fillText('=  (전체 미세조정이 배우는 것)', 20, 40 + m * s + 22);
    ctx.fillText('LoRA가 배우는 것: B × A', x0, 40 + m * s + 22);
    const full = m * n, lora = r * (m + n);
    ro.set(
      `<div>전체: m·n = <b>${full.toLocaleString()}</b>개</div>` +
        `<div>LoRA: r(m + n) = <b>${lora.toLocaleString()}</b>개 (${fmt((100 * lora) / full, 3)}%)</div>` +
        `<div class="dim">BA의 랭크 ≤ r = ${r} · 손익분기 r = ${fmt((m * n) / (m + n), 1)}</div>` +
        `<div class="dim">추론 시 BA를 W에 더해 두면(W + BA) 추가 계산이 없다.</div>`,
    );
  }
  const ro2 = new ResizeObserver(draw);
  ro2.observe(cv);
  draw();
  return () => ro2.disconnect();
};

export default scene;
