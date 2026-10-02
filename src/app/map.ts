// 원론 지도: 모든 노드와 의존 관계를 한 장에. 한 노드를 고르면
//   - 그 노드가 기대는 모든 노드(거슬러 오르기)가 약속까지 이어져 빛나고
//   - 그 노드에 기대는 모든 노드(내려가기)가 다른 색으로 빛난다.
// 배치: 권마다 한 줄(위→아래), 줄 안에서는 교재 순서(왼→오).
import { BOOKS, NODE_BY_ID, BOOK_OF, V, ancestors, descendants } from './data';
import { KIND_LABEL } from '../content/schema';
import { progress } from './state';

const NW = 132, NH = 46, GX = 14, GY = 34, LEFT = 150, TOP = 20;

export function renderMap(main: HTMLElement, focus?: string): () => void {
  main.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'map-wrap';
  const side = document.createElement('aside');
  side.className = 'map-side';
  const scroller = document.createElement('div');
  scroller.className = 'map-scroll';
  wrap.append(scroller, side);
  main.appendChild(wrap);

  const pos = new Map<string, { x: number; y: number }>();
  let maxW = 0;
  BOOKS.forEach((b, bi) => {
    b.nodes.forEach((n, i) => pos.set(n.id, { x: LEFT + i * (NW + GX), y: TOP + bi * (NH + GY) }));
    maxW = Math.max(maxW, LEFT + b.nodes.length * (NW + GX));
  });
  const H = TOP + BOOKS.length * (NH + GY);
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', String(maxW + 20));
  svg.setAttribute('height', String(H));
  svg.classList.add('map');
  scroller.appendChild(svg);

  BOOKS.forEach((b, bi) => {
    const t = document.createElementNS(svgNS, 'text');
    t.setAttribute('x', '12');
    t.setAttribute('y', String(TOP + bi * (NH + GY) + NH / 2 + 5));
    t.classList.add('map-book');
    t.textContent = `${b.num}권 ${b.title}`;
    svg.appendChild(t);
  });

  const edgeEls: { from: string; to: string; el: SVGPathElement }[] = [];
  const gEdges = document.createElementNS(svgNS, 'g');
  svg.appendChild(gEdges);
  const uniq = new Set<string>();
  for (const e of V.edges) {
    const k = `${e.from}>${e.to}`;
    if (uniq.has(k)) continue;
    uniq.add(k);
    const a = pos.get(e.to)!, b = pos.get(e.from)!;
    const path = document.createElementNS(svgNS, 'path');
    const x1 = a.x + NW / 2, y1 = a.y + NH, x2 = b.x + NW / 2, y2 = b.y;
    const sameRow = a.y === b.y;
    const d = sameRow
      ? `M${a.x + NW},${a.y + NH / 2} C${a.x + NW + 20},${a.y + NH / 2 - 26} ${b.x - 20},${b.y + NH / 2 - 26} ${b.x},${b.y + NH / 2}`
      : `M${x1},${y1} C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}`;
    path.setAttribute('d', d);
    path.classList.add('map-edge');
    gEdges.appendChild(path);
    edgeEls.push({ from: e.from, to: e.to, el: path });
  }

  const nodeEls = new Map<string, SVGGElement>();
  for (const [id, p] of pos) {
    const n = NODE_BY_ID.get(id)!;
    const g = document.createElementNS(svgNS, 'g');
    g.classList.add('map-node', `kind-${n.kind}`);
    if (n.status === 'stub') g.classList.add('stub');
    if (progress.isDone(id)) g.classList.add('done');
    g.setAttribute('transform', `translate(${p.x},${p.y})`);
    const r = document.createElementNS(svgNS, 'rect');
    r.setAttribute('width', String(NW));
    r.setAttribute('height', String(NH));
    r.setAttribute('rx', '8');
    const k = document.createElementNS(svgNS, 'text');
    k.setAttribute('x', '8');
    k.setAttribute('y', '15');
    k.classList.add('map-kind');
    k.textContent = KIND_LABEL[n.kind] + (n.status === 'stub' ? ' · 예정' : '') + (progress.isDone(id) ? ' ✓' : '');
    const tt = document.createElementNS(svgNS, 'text');
    tt.setAttribute('x', '8');
    tt.setAttribute('y', '33');
    tt.classList.add('map-title');
    tt.textContent = n.title.length > 11 ? n.title.slice(0, 10) + '…' : n.title;
    const tip = document.createElementNS(svgNS, 'title');
    tip.textContent = `${n.title}\n${n.id}`;
    g.append(r, k, tt, tip);
    g.addEventListener('click', () => select(id));
    g.addEventListener('dblclick', () => (location.hash = `#/n/${id}`));
    svg.appendChild(g);
    nodeEls.set(id, g);
  }

  function select(id: string) {
    const up = new Set(ancestors(id));
    const down = new Set(descendants(id));
    for (const [nid, g] of nodeEls) {
      g.classList.toggle('sel', nid === id);
      g.classList.toggle('up', up.has(nid));
      g.classList.toggle('down', down.has(nid));
      g.classList.toggle('faded', nid !== id && !up.has(nid) && !down.has(nid));
    }
    for (const e of edgeEls) {
      const inUp = (e.from === id || up.has(e.from)) && up.has(e.to);
      const inDown = (e.to === id || down.has(e.to)) && (down.has(e.from));
      e.el.classList.toggle('up', inUp);
      e.el.classList.toggle('down', inDown);
      e.el.classList.toggle('faded', !inUp && !inDown);
    }
    const n = NODE_BY_ID.get(id)!;
    const chain = [...up].filter((x) => NODE_BY_ID.get(x)!.kind === 'ax');
    side.innerHTML = `
      <div class="kicker"><span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span> ${BOOK_OF.get(id)!.num}권</div>
      <h2>${n.title}</h2>
      <a class="btn" href="#/n/${id}">이 노드 읽기 →</a>
      <p class="dim">거슬러 오르면 <b class="up-c">${up.size}개</b> 노드에 기대고, 그 끝은 약속 ${chain.length}개(${chain.map((c) => NODE_BY_ID.get(c)!.title).join(', ') || '없음'})입니다. 이 노드에 기대는 노드는 <b class="down-c">${down.size}개</b>입니다.</p>
      <h3>거슬러 오르기 (교재 순서)</h3>
      <ol class="chain">${[...up].map((x) => `<li class="${progress.isDone(x) ? 'done' : ''}"><a href="#/n/${x}">${BOOK_OF.get(x)!.num}권 · ${NODE_BY_ID.get(x)!.title}</a></li>`).join('')}</ol>`;
    const p = pos.get(id)!;
    scroller.scrollTo({ left: Math.max(0, p.x - scroller.clientWidth / 2), top: Math.max(0, p.y - scroller.clientHeight / 2), behavior: 'smooth' });
  }

  side.innerHTML = `<h2>원론 지도</h2><p>노드 ${pos.size}개, 의존 관계 ${uniq.size}개. 노드를 한 번 누르면 그 노드가 기대는 모든 노드(<b class="up-c">거슬러 오르기</b>)와 그 노드에 기대는 모든 노드(<b class="down-c">내려가기</b>)가 빛납니다. 두 번 누르면 읽기로 갑니다.</p>
  <p class="dim">회색 점선 테두리 = 집필 예정 노드. 초록 = 이해했다고 표시한 노드.</p>
  <p>추천: 맨 아래의 <a href="#/map?focus=exp.lora">LoRA</a>나 <a href="#/map?focus=prop.svd">SVD</a>를 눌러, 이 교재가 그 하나를 위해 무엇을 쌓는지 보세요.</p>`;
  if (focus && pos.has(focus)) requestAnimationFrame(() => select(focus));
  return () => {};
}
