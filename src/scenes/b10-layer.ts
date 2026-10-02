// 선형 층 y = Wx 의 텐서 축 (def.linear-layer)
// W의 모양은 (출력 차원 m, 입력 차원 n). 행 i = 출력 뉴런 i가 입력을 읽는 방식(행의 관점: yᵢ = 𝐰ᵢ·𝐱),
// 열 j = 입력 성분 j가 출력 전체로 퍼지는 방식(열의 관점: 𝐲 = Σⱼ xⱼ·(W의 j열)).
// 칸 위에 마우스를 올리면 그 칸의 행과 열이 함께 빛나고, 아래 식이 그 관점으로 바뀐다.
//
// 매개변수: W (기본 3×4), x (기본 길이 4)
import type { SceneFn } from './_lib/scene';
import { readout, hint } from './_lib/scene';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { dot, type Vec } from '../la/vec';
import { fmt, el, scrub } from '../ui/widgets';

const scene: SceneFn = (host, { params }) => {
  let W: Mat = params.W ?? [
    [0.8, -0.2, 0.0, 0.5],
    [0.1, 0.9, -0.6, 0.0],
    [-0.4, 0.3, 0.7, 0.2],
  ];
  let x: Vec = params.x ?? [1, 0.5, -1, 2];
  const m = W.length, n = W[0].length;
  let hot: { i: number | null; j: number | null } = { i: null, j: null };

  const root = el('div', 'scene-grid stacked');
  host.appendChild(root);
  const board = el('div', 'layer-board');
  root.appendChild(board);
  const panel = el('div', 'scene-panel');
  panel.style.borderLeft = '0';
  panel.style.borderTop = '1px solid var(--line)';
  root.appendChild(panel);

  // 격자 배치: [빈칸][x₁…xₙ][빈칸] / [축 이름][W 행 i][yᵢ]
  const grid = el('div', 'layer-grid');
  grid.style.gridTemplateColumns = `90px repeat(${n}, 58px) 30px 70px`;
  board.appendChild(grid);
  const cell = (cls: string, html = '') => {
    const d = el('div', cls, html);
    grid.appendChild(d);
    return d;
  };
  cell('lg-corner', '<span class="dim">입력 𝐱 →</span>');
  const xCells = x.map((_, j) => {
    const d = cell('lg-x');
    scrub(d, { get: () => x[j], set: (v) => ((x[j] = v), sync()), step: 0.1 });
    d.addEventListener('pointerenter', () => ((hot = { i: null, j }), sync()));
    return d;
  });
  cell('');
  cell('lg-corner', '<span class="dim">출력 𝐲</span>');
  const wCells: HTMLElement[][] = [];
  const yCells: HTMLElement[] = [];
  for (let i = 0; i < m; i++) {
    cell('lg-rowlab', `<span class="dim">뉴런 ${i + 1}</span>`).addEventListener('pointerenter', () => ((hot = { i, j: null }), sync()));
    wCells.push(
      W[i].map((_, j) => {
        const d = cell('lg-w');
        scrub(d, { get: () => W[i][j], set: (v) => ((W[i][j] = v), sync()), step: 0.1 });
        d.addEventListener('pointerenter', () => ((hot = { i, j }), sync()));
        return d;
      }),
    );
    cell('lg-eq', '=');
    const y = cell('lg-y');
    y.addEventListener('pointerenter', () => ((hot = { i, j: null }), sync()));
    yCells.push(y);
  }
  grid.addEventListener('pointerleave', () => ((hot = { i: null, j: null }), sync()));
  board.appendChild(el('div', 'layer-axes', `W.shape = (${m}, ${n}) = (출력 차원 m, 입력 차원 n) · 세로 축(행) = 출력 뉴런 · 가로 축(열) = 입력 성분`));

  const ro = readout(panel);
  hint(panel, '숫자는 좌우로 끌어 바꿀 수 있습니다. 뉴런 이름(행)에 올리면 행의 관점, 입력 칸(열)에 올리면 열의 관점, W의 칸에 올리면 둘 다 보입니다.');

  const shade = (v: number) => {
    const a = Math.min(1, Math.abs(v));
    return v >= 0 ? `rgba(124,196,255,${0.12 + 0.5 * a})` : `rgba(255,122,89,${0.12 + 0.5 * a})`;
  };

  function sync() {
    const y = matVec(W, x);
    x.forEach((v, j) => {
      if (!xCells[j].querySelector('input')) xCells[j].textContent = fmt(v);
      xCells[j].classList.toggle('lg-hot', hot.j === j);
      xCells[j].style.color = C.x;
    });
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const c = wCells[i][j];
        if (!c.querySelector('input')) c.textContent = fmt(W[i][j]);
        c.style.background = shade(W[i][j]);
        c.classList.toggle('lg-hot', hot.i === i || hot.j === j);
        c.classList.toggle('lg-dim', (hot.i !== null || hot.j !== null) && hot.i !== i && hot.j !== j);
      }
      yCells[i].textContent = fmt(y[i]);
      yCells[i].style.color = C.y;
      yCells[i].classList.toggle('lg-hot', hot.i === i);
    }
    let html = '';
    if (hot.i !== null) {
      const i = hot.i;
      html += `<div><b>행의 관점</b> — 뉴런 ${i + 1}은 입력을 자기 가중치 행과 <b>내적</b>한다: y${sub(i + 1)} = 𝐰${sub(i + 1)}·𝐱 = ${W[i].map((w, j) => `${fmt(w)}·${fmt(x[j])}`).join(' + ')} = <b style="color:${C.y}">${fmt(dot(W[i], x))}</b></div>`;
      html += `<div class="dim">행 𝐰${sub(i + 1)}는 입력 공간 ℝ${sup(n)} 안의 방향 하나다. 이 뉴런은 "입력이 이 방향과 얼마나 같은 쪽을 보는가"를 잰다.</div>`;
    }
    if (hot.j !== null) {
      const j = hot.j;
      html += `<div><b>열의 관점</b> — 입력 성분 x${sub(j + 1)} = ${fmt(x[j])}은 W의 ${j + 1}열 (${col(W, j).map((v) => fmt(v)).join(', ')})을 그만큼 늘려 출력 전체에 보탠다: x${sub(j + 1)}·𝐚${sub(j + 1)} = (${col(W, j).map((v) => fmt(v * x[j])).join(', ')})</div>`;
    }
    if (hot.i === null && hot.j === null) html = `<div>𝐲 = W𝐱 = (${y.map((v) => fmt(v)).join(', ')})</div><div class="dim">PyTorch: <code>nn.Linear(in_features=${n}, out_features=${m})</code>의 <code>weight.shape</code>는 (${m}, ${n})이다. 행의 수가 출력 차원이다.</div>`;
    ro.set(html);
  }
  const sub = (k: number) => String(k).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]);
  const sup = (k: number) => String(k).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
  sync();
};

export default scene;
