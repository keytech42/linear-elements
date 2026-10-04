import 'katex/dist/katex.min.css';
import './styles.css';
import { BOOKS, NODE_BY_ID, BOOK_OF } from './app/data';
import { KIND_LABEL } from './content/schema';
import { renderNode } from './app/reader';
import { renderMap } from './app/map';
import { renderHome, renderGlossary, renderReport } from './app/pages';
import { installPopovers } from './app/popover';
import { progress, trail } from './app/state';

// 초안 표시: 사용자의 노드별 검토가 끝나면 false로 바꾼다.
const DRAFT = true;

const app = document.getElementById('app')!;
document.body.classList.toggle('draft', DRAFT);
app.innerHTML = `${DRAFT ? '<div class="draft-banner" role="note">초안 · 검토하며 고쳐 쓰고 있는 원고입니다.<span class="draft-more">&nbsp;내용과 관문은 바뀔 수 있습니다.</span></div>' : ''}
  <header class="topbar">
    <button class="menu-btn" aria-label="목차 열기">☰</button>
    <a class="brand" href="#/">선형 원론</a>
    <nav>
      <a href="#/map">지도</a>
      <a href="#/dojo">훈련장</a>
      <a href="#/glossary">용어·기호</a>
      <a href="#/verify">검증 보고서</a>
    </nav>
  </header>
  <div class="layout">
    <aside class="sidebar"></aside>
    <main class="main"></main>
  </div>`;
const sidebar = app.querySelector<HTMLElement>('.sidebar')!;
const main = app.querySelector<HTMLElement>('.main')!;
app.querySelector<HTMLButtonElement>('.menu-btn')!.onclick = () => document.body.classList.toggle('side-open');
installPopovers(document.body);

function renderSidebar(active?: string) {
  const openBook = active ? BOOK_OF.get(active)?.id : undefined;
  sidebar.innerHTML = BOOKS.map((b) => {
    const done = b.nodes.filter((n) => progress.isDone(n.id)).length;
    return `<details class="side-book" ${b.id === openBook ? 'open' : ''}>
      <summary><span class="side-num">${b.num}</span><span class="side-title">${b.title}</span><span class="side-count">${done}/${b.nodes.length}</span></summary>
      <ol>${b.nodes
        .map(
          (n) =>
            `<li class="${n.id === active ? 'active' : ''} ${n.status} ${progress.isDone(n.id) ? 'done' : ''}"><a href="#/n/${n.id}"><span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span>${n.title}</a></li>`,
        )
        .join('')}</ol></details>`;
  }).join('');
  sidebar.querySelector('li.active')?.scrollIntoView({ block: 'nearest' });
}

let cleanup: () => void = () => {};
async function route() {
  cleanup();
  cleanup = () => {};
  document.body.classList.remove('side-open');
  const h = location.hash.replace(/^#/, '') || '/';
  const [path, query] = h.split('?');
  const params = new URLSearchParams(query ?? '');
  const parts = path.split('/').filter(Boolean);
  document.querySelectorAll('.topbar nav a').forEach((a) => a.classList.toggle('on', (a as HTMLAnchorElement).hash === `#/${parts[0] ?? ''}`));
  main.classList.toggle('wide', parts[0] === 'map');
  if (parts[0] === 'n' && parts[1]) {
    renderSidebar(parts[1]);
    cleanup = renderNode(main, parts[1], params.get('view'));
    const n = NODE_BY_ID.get(parts[1]);
    document.title = n ? `${n.title} · 선형 원론` : '선형 원론';
    return;
  }
  renderSidebar();
  trail.clear();
  if (parts[0] === 'map') cleanup = renderMap(main, params.get('focus') ?? undefined);
  else if (parts[0] === 'glossary') renderGlossary(main);
  else if (parts[0] === 'verify') renderReport(main);
  else if (parts[0] === 'lab') {
    const { renderLab } = await import('./app/lab');
    cleanup = await renderLab(main, parts[1], params.get('p') ?? undefined);
  } else if (parts[0] === 'dojo') {
    const { renderDojo } = await import('./app/dojo');
    cleanup = renderDojo(main, params.get('d') ?? undefined);
  } else renderHome(main);
  document.title = '선형 원론';
}
window.addEventListener('hashchange', route);
progress.on(() => {
  const m = /^#\/n\/(.+)$/.exec(location.hash);
  renderSidebar(m?.[1]);
});
route();
