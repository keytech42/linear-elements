// 떠 있는 미리보기: 용어에 마우스를 올리면 정의 한 줄, 왜? 칩에 올리면 답이 있는 노드의 첫 문단.
// 페이지를 떠나지 않고 답을 엿볼 수 있게 하는 것이 목적이다(읽던 흐름을 끊지 않기).
import { V, NODE_BY_ID, BOOK_OF } from './data';
import { KIND_LABEL } from '../content/schema';
import { renderInlines, firstParagraph } from './render';
import { progress } from './state';

let pop: HTMLDivElement | null = null;
let timer = 0;
let current: HTMLElement | null = null;

export function installPopovers(root: HTMLElement) {
  pop = document.createElement('div');
  pop.className = 'popover';
  document.body.appendChild(pop);
  pop.addEventListener('pointerenter', () => clearTimeout(timer));
  pop.addEventListener('pointerleave', hide);

  root.addEventListener('pointerover', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-term], a.why, a.nlink, .chip-node');
    if (!el || el === current) return;
    clearTimeout(timer);
    timer = window.setTimeout(() => show(el), 220);
  });
  root.addEventListener('pointerout', (e) => {
    const to = e.relatedTarget as Node | null;
    if (to && pop!.contains(to)) return;
    const el = (e.target as HTMLElement).closest('[data-term], a.why, a.nlink, .chip-node');
    if (el) {
      clearTimeout(timer);
      timer = window.setTimeout(hide, 180);
    }
  });
}

function hide() {
  if (!pop) return;
  pop.classList.remove('open');
  current = null;
}

function show(el: HTMLElement) {
  if (!pop) return;
  current = el;
  pop.innerHTML = '';
  const termId = el.dataset.term;
  const to = el.dataset.to ?? el.dataset.node;
  if (termId) {
    const home = V.termHome.get(termId);
    if (!home) return;
    const d = home.decl;
    const node = NODE_BY_ID.get(home.node)!;
    pop.innerHTML = `<div class="pop-kicker">용어 · ${d.en ?? ''}</div><div class="pop-title">${d.ko}</div><p>${escape(d.gloss)}</p>
      <div class="pop-foot">정의한 곳: ${BOOK_OF.get(node.id)!.num}권 · ${KIND_LABEL[node.kind]} — ${escape(node.title)}${progress.isDone(node.id) ? ' ✓' : ' <span class="warn-dot">아직 읽지 않음</span>'}</div>`;
  } else if (to) {
    const node = NODE_BY_ID.get(to);
    if (!node) return;
    const kick = document.createElement('div');
    kick.className = 'pop-kicker';
    kick.textContent = `${BOOK_OF.get(to)!.num}권 · ${KIND_LABEL[node.kind]}${node.status === 'stub' ? ' · 집필 예정' : ''}`;
    const title = document.createElement('div');
    title.className = 'pop-title';
    title.textContent = node.title;
    const p = document.createElement('p');
    p.appendChild(renderInlines(firstParagraph(to)));
    pop.append(kick, title, p);
    if (el.classList.contains('why')) {
      const foot = document.createElement('div');
      foot.className = 'pop-foot';
      foot.textContent = '누르면 이 노드로 갑니다. 다 읽은 뒤 "돌아가기"로 지금 자리에 돌아옵니다.';
      pop.appendChild(foot);
    }
  } else return;
  const r = el.getBoundingClientRect();
  pop.classList.add('open');
  const pw = Math.min(380, window.innerWidth - 24);
  pop.style.width = `${pw}px`;
  const left = Math.min(window.innerWidth - pw - 12, Math.max(12, r.left + r.width / 2 - pw / 2));
  pop.style.left = `${left}px`;
  const below = r.bottom + 8;
  const ph = pop.offsetHeight;
  pop.style.top = `${below + ph > window.innerHeight - 8 ? Math.max(8, r.top - ph - 8) : below}px`;
}

function escape(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}
