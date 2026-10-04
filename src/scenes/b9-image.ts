// 그림 한 장을 랭크로 압축하기 (exp.image-lowrank, prop.eckart-young)
// 흑백 그림 = 밝기 숫자의 행렬(m×n). SVD로 층을 나누고, 앞의 k개 층만 더해 다시 그린다.
// 저장할 숫자의 개수: 원래 mn개 → k층이면 k(m + n + 1)개 (𝐮ᵢ m개 + 𝐯ᵢ n개 + σᵢ 1개, 층마다).
//
// 매개변수
//   k: 처음 층 수 (기본 8),  preset: 'letters' | 'plaid' | 'circle' (기본 letters)
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { Chart } from './_lib/chart';
import { C } from '../render/colors';
import { svd, lowRankInto, type SVD } from '../la/svd';
import type { Mat } from '../la/mat';
import { fmt, slider, buttons, el } from '../ui/widgets';

const SIZE = 112;

function preset(kind: string): Mat {
  const cv = document.createElement('canvas');
  cv.width = cv.height = SIZE;
  const g = cv.getContext('2d')!;
  if (kind === 'plaid') {
    // 체크무늬: 가로 줄무늬 × 세로 줄무늬의 합 → 랭크가 정확히 2 이하
    const A: Mat = [];
    for (let i = 0; i < SIZE; i++) {
      const r: number[] = [];
      for (let j = 0; j < SIZE; j++) r.push(0.5 * (Math.sin(i / 6) > 0 ? 1 : 0.2) + 0.5 * (Math.sin(j / 9) > 0 ? 1 : 0.3));
      A.push(r);
    }
    return A;
  }
  g.fillStyle = '#000';
  g.fillRect(0, 0, SIZE, SIZE);
  if (kind === 'circle') {
    g.fillStyle = '#fff';
    g.beginPath();
    g.arc(SIZE / 2, SIZE / 2, SIZE * 0.36, 0, Math.PI * 2);
    g.fill();
  } else {
    const grd = g.createLinearGradient(0, 0, SIZE, SIZE);
    grd.addColorStop(0, '#222');
    grd.addColorStop(1, '#777');
    g.fillStyle = grd;
    g.fillRect(0, 0, SIZE, SIZE);
    g.fillStyle = '#fff';
    g.font = `700 ${SIZE * 0.42}px "Pretendard", system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('SVD', SIZE / 2, SIZE * 0.36);
    g.font = `600 ${SIZE * 0.2}px "Pretendard", system-ui, sans-serif`;
    g.fillText('선형 원론', SIZE / 2, SIZE * 0.76);
    g.strokeStyle = '#bbb';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(SIZE * 0.85, SIZE * 0.12, SIZE * 0.08, 0, Math.PI * 2);
    g.stroke();
  }
  return fromCanvas(cv);
}

function fromCanvas(cv: HTMLCanvasElement): Mat {
  const d = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height).data;
  const A: Mat = [];
  for (let i = 0; i < cv.height; i++) {
    const r: number[] = [];
    for (let j = 0; j < cv.width; j++) {
      const q = (i * cv.width + j) * 4;
      r.push((0.299 * d[q] + 0.587 * d[q + 1] + 0.114 * d[q + 2]) / 255);
    }
    A.push(r);
  }
  return A;
}

function paint(cv: HTMLCanvasElement, data: ArrayLike<number>, m: number, n: number, signed = false) {
  cv.width = n;
  cv.height = m;
  const g = cv.getContext('2d')!;
  const img = g.createImageData(n, m);
  let s = 1;
  if (signed) {
    s = 1e-12;
    for (let i = 0; i < m * n; i++) s = Math.max(s, Math.abs(data[i]));
  }
  for (let i = 0; i < m * n; i++) {
    const q = i * 4;
    if (signed) {
      // 층 하나는 음수도 있다: 양수 = 하늘색, 음수 = 주황
      const v = data[i] / s;
      img.data[q] = v < 0 ? 255 * -v : 40 * v;
      img.data[q + 1] = v < 0 ? 122 * -v : 196 * v;
      img.data[q + 2] = v < 0 ? 89 * -v : 255 * v;
    } else {
      const v = Math.max(0, Math.min(1, data[i])) * 255;
      img.data[q] = img.data[q + 1] = img.data[q + 2] = v;
    }
    img.data[q + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}

const scene: SceneFn = (host, { params }) => {
  let k = params.k ?? 8;
  let A: Mat = preset(params.preset ?? 'letters');
  let r: SVD | null = null;
  let m = A.length, n = A[0].length;
  let out = new Float64Array(m * n);
  let lay = new Float64Array(m * n);

  const root = el('div', 'scene-grid stacked');
  host.appendChild(root);
  const row = el('div', 'img-row');
  root.appendChild(row);
  const fig = (cap: string) => {
    const f = el('figure');
    const cv = el('canvas');
    cv.style.width = `${SIZE * 2}px`;
    cv.style.height = `${SIZE * 2}px`;
    const c = el('figcaption', '', cap);
    f.append(cv, c);
    row.appendChild(f);
    return { cv, c };
  };
  const fOrig = fig('원래 그림 (랭크 = 행렬의 랭크)');
  const fApprox = fig('앞의 k개 \'층\'의 합 A_k');
  const fLayer = fig('k번째 \'층\' 하나 σ_k u_k v_kᵀ');
  const panel = el('div', 'scene-panel');
  panel.style.borderLeft = '0';
  panel.style.borderTop = '1px solid var(--line)';
  root.appendChild(panel);
  const ks = slider(panel, { label: '\'층\'의 수 k', min: 0, max: Math.min(m, n), step: 1, get: () => k, set: (v) => ((k = v), redraw()), format: (v) => String(v) });
  const chartBox = el('div', 'chart-box');
  panel.appendChild(chartBox);
  const chart = new Chart(chartBox, 130);
  const ro = readout(panel);
  const file = el('input');
  file.type = 'file';
  file.accept = 'image/*';
  file.style.display = 'none';
  panel.appendChild(file);
  buttons(panel, [
    { label: '글자', on: () => load(preset('letters')) },
    { label: '체크무늬', on: () => load(preset('plaid')), title: '가로 줄무늬와 세로 줄무늬의 합. \'층\'이 몇 개면 완벽해질까?' },
    { label: '원', on: () => load(preset('circle')) },
    { label: '내 그림 올리기', on: () => file.click() },
  ]);
  hint(panel, '체크무늬를 골라 k를 1, 2, 3으로 올려 보세요. 원은 왜 그렇게 많은 \'층\'이 필요할까요? (원의 윤곽은 가로·세로 방향의 패턴으로 나누기 어렵습니다.)');

  file.addEventListener('change', () => {
    const f = file.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 140 / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.max(8, Math.round(img.width * s));
      cv.height = Math.max(8, Math.round(img.height * s));
      cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height);
      load(fromCanvas(cv));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  });

  function load(M: Mat) {
    A = M;
    m = A.length;
    n = A[0].length;
    out = new Float64Array(m * n);
    lay = new Float64Array(m * n);
    r = null;
    ro.set('<div class="dim">SVD 계산 중…</div>');
    for (const f of [fOrig, fApprox, fLayer]) {
      f.cv.style.width = `${n * 2}px`;
      f.cv.style.height = `${m * 2}px`;
    }
    const flat = new Float64Array(m * n);
    A.forEach((row, i) => row.forEach((v, j) => (flat[i * n + j] = v)));
    paint(fOrig.cv, flat, m, n);
    setTimeout(() => {
      const t0 = performance.now();
      r = svd(A);
      const ms = performance.now() - t0;
      k = Math.min(k, r.S.length);
      ks.el.querySelector('input')!.max = String(r.S.length);
      fOrig.c.textContent = `원래 그림 ${m}×${n} (SVD 계산 ${Math.round(ms)}ms, 한쪽 야코비)`;
      redraw();
    }, 30);
  }

  function redraw() {
    ks.refresh();
    if (!r) return;
    lowRankInto(out, r, k, m, n);
    paint(fApprox.cv, out, m, n);
    lay.fill(0);
    if (k >= 1) {
      const l = k - 1, s = r.S[l];
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) lay[i * n + j] = s * r.U[i][l] * r.V[j][l];
    }
    paint(fLayer.cv, lay, m, n, true);
    const total = r.S.reduce((a, s) => a + s * s, 0);
    const tail = r.S.slice(k).reduce((a, s) => a + s * s, 0);
    const store = k * (m + n + 1);
    const rankA = r.S.filter((s) => s > 1e-9 * r!.S[0]).length;
    ro.set(
      `<div>저장할 숫자: <b>${store.toLocaleString()}</b>개 / 원래 ${(m * n).toLocaleString()}개 (${fmt((100 * store) / (m * n), 1)}%)</div>` +
        `<div>상대 오차 ‖A − A_k‖ / ‖A‖ = √(버린 σ²의 합 / 전체 σ²의 합) = <b>${fmt(Math.sqrt(tail / total), 4)}</b></div>` +
        `<div class="dim">원래 그림의 랭크 ≈ ${rankA} · σ₁ = ${fmt(r.S[0], 2)}${k ? ` · σ_k = ${fmt(r.S[k - 1], 3)}` : ''}</div>`,
    );
    chart.invalidate();
  }

  chart.draw = (c) => {
    if (!r) return;
    const L = Math.min(r.S.length, 60);
    c.xr = [0.5, L + 0.5];
    c.yr = [0, r.S[0] * 1.05];
    c.frame('i (\'층\' 번호)', 'σᵢ', [0, r.S[0]]);
    for (let i = 0; i < L; i++) c.bar(i + 1, r.S[i], 1, i < k ? C.u : 'rgba(124,196,255,0.22)');
    if (k > 0 && k <= L) c.vline(k + 0.5, C.x, `k=${k}`);
  };

  load(A);
  return () => chart.destroy();
};

export default scene;
