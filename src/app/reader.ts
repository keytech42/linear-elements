// 노드 읽기 화면.
import { NODE_BY_ID, BOOK_OF, ALL_NODES, V, prereqs, dependents, codeOf } from './data';
import { KIND_LABEL, KIND_EN } from '../content/schema';
import { renderBlocks, renderInlines, type RenderCtx } from './render';
import { progress, trail } from './state';
import { SyncBus } from '../sync/bus';
import { highlightTs } from './highlight';
import { renderGate } from './predict';
import type { Block } from '../content/markup';

const EDGE_LABEL = { requires: '선행', why: '왜?', link: '참조', term: '용어' } as const;

export function renderNode(main: HTMLElement, id: string, view?: string | null): () => void {
  const node = NODE_BY_ID.get(id);
  if (!node) {
    main.innerHTML = `<div class="empty">노드 <code>${id}</code>를 찾을 수 없습니다.</div>`;
    return () => {};
  }
  const book = BOOK_OF.get(id)!;
  const pn = V.parsed.get(id);
  const bus = new SyncBus();
  const ctx: RenderCtx = { bus, cleanups: [] };
  const art = document.createElement('article');
  art.className = `node node-${node.kind}`;

  // 돌아가기 막대
  const t = trail.get();
  if (t.length) {
    const last = t[t.length - 1];
    const from = NODE_BY_ID.get(last.node);
    const bar = document.createElement('button');
    bar.className = 'trail-bar';
    bar.innerHTML = `<span>← 돌아가기</span> <b>${from?.title ?? last.node}</b>에서 물었던 <i>“${last.q}”</i>${t.length > 1 ? ` <span class="dim">(쌓인 질문 ${t.length}개)</span>` : ''}`;
    bar.onclick = () => {
      const s = trail.pop()!;
      location.hash = `#/n/${s.node}`;
      sessionStorage.setItem('le.restoreScroll', String(s.scroll));
    };
    art.appendChild(bar);
  }

  const head = document.createElement('header');
  head.className = 'node-head';
  head.innerHTML = `<div class="kicker"><span class="kind kind-${node.kind}">${KIND_LABEL[node.kind]}<sup class="term-en">${KIND_EN[node.kind]}</sup></span> ${book.num}권 ${book.title} · <code>${node.id}</code></div><h1>${node.title}</h1>`;
  art.appendChild(head);

  // 읽기 모드: 예측하며 읽기(관문이 잠겨 있음) / 펼쳐 보기(모두 열림)
  // 왜? 칩을 따라 들어왔거나, 이해했다고 표시한 노드라면 펼쳐서 연다(답을 찾으러 온 사람에게 퀴즈를 내지 않는다).
  const nPred = node.predicts?.length ?? 0;
  const byWhy = sessionStorage.getItem('le.arrivedByWhy') === id;
  sessionStorage.removeItem('le.arrivedByWhy');
  const review = nPred > 0 && (view === 'all' || (view !== 'predict' && (byWhy || progress.isDone(id))));
  if (nPred) {
    const mode = document.createElement('div');
    mode.className = 'mode-switch';
    mode.innerHTML =
      `<a href="#/n/${id}?view=predict" class="${review ? '' : 'on'}">예측하며 읽기</a><a href="#/n/${id}?view=all" class="${review ? 'on' : ''}">펼쳐 보기</a>` +
      (review && byWhy ? '<span class="dim">왜? 칩을 따라와서 펼쳐 열었습니다</span>' : review && view !== 'all' ? '<span class="dim">이해했다고 표시한 노드라 펼쳐 열었습니다</span>' : '');
    head.appendChild(mode);
  }

  // 이 노드가 기대는 곳
  const pre = prereqs(id).sort((a, b) => V.order.get(a.to)! - V.order.get(b.to)!);
  if (pre.length) {
    const strip = document.createElement('div');
    strip.className = 'prereq-strip';
    strip.innerHTML = `<span class="strip-label">기대는 곳</span>`;
    const seen = new Set<string>();
    for (const e of pre) {
      if (seen.has(e.to)) continue;
      seen.add(e.to);
      const n = NODE_BY_ID.get(e.to)!;
      const a = document.createElement('a');
      a.className = `chip-node ${progress.isDone(e.to) ? 'done' : ''}`;
      a.href = `#/n/${e.to}`;
      a.dataset.node = e.to;
      a.innerHTML = `<span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span>${n.title}`;
      a.title = pre.filter((x) => x.to === e.to).map((x) => EDGE_LABEL[x.kind]).join(', ');
      strip.appendChild(a);
    }
    art.appendChild(strip);
  }

  if (node.status === 'stub') {
    const b = document.createElement('div');
    b.className = 'stub-banner';
    b.innerHTML = '<b>집필 예정 노드</b> — 아래는 이 노드가 답할 질문들입니다. 용어·기호·의존 관계는 이미 확정되어 검증기에 등록되어 있습니다.';
    art.appendChild(b);
  }

  // 본문을 관문(::predict) 자리에서 단계로 나눈다. 관문 i를 통과해야 단계 i+1이 열린다.
  const body = document.createElement('div');
  body.className = 'node-body';
  art.appendChild(body);
  const segs: Block[][] = [[]];
  const gateIds: string[] = [];
  for (const b of pn?.body ?? []) {
    if (b.t === 'predict') {
      gateIds.push(b.id);
      segs.push([]);
    } else segs[segs.length - 1].push(b);
  }
  const segEls = segs.map((blocks) => {
    const d = document.createElement('div');
    d.className = 'seg';
    d.appendChild(renderBlocks(blocks, ctx));
    return d;
  });
  const tail = document.createElement('div');
  tail.className = 'node-tail';
  const refreshLocks = (scrollToNew = false) => {
    let open = true;
    let firstNew: HTMLElement | null = null;
    gateIds.forEach((g, i) => {
      open = open && (review || !!progress.predict(id, g));
      const el = segEls[i + 1];
      if (open && el.hidden && scrollToNew && !firstNew) firstNew = el;
      el.hidden = !open;
    });
    if (open && tail.hidden && scrollToNew && !firstNew) firstNew = tail;
    tail.hidden = !open;
    if (firstNew) requestAnimationFrame(() => (firstNew as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  let updateSum = () => {};
  body.appendChild(segEls[0]);
  gateIds.forEach((g, i) => {
    const pp = pn!.predicts.get(g);
    if (pp) body.appendChild(renderGate(pp, id, i, review, ctx, () => (refreshLocks(true), updateSum())));
    body.appendChild(segEls[i + 1]);
  });
  art.appendChild(tail);

  if (pn?.proof) {
    const d = document.createElement('details');
    d.className = 'proof';
    d.open = true;
    d.innerHTML = '<summary>증명</summary>';
    d.appendChild(renderBlocks(pn.proof, ctx));
    const qed = document.createElement('div');
    qed.className = 'qed';
    qed.textContent = '∎';
    d.appendChild(qed);
    tail.appendChild(d);
  }

  // 점검 문제
  if (pn?.checks.length) {
    const sec = document.createElement('section');
    sec.className = 'checks';
    sec.innerHTML = '<h2>점검</h2>';
    pn.checks.forEach((c, i) => {
      const box = document.createElement('div');
      box.className = 'check';
      const q = document.createElement('div');
      q.className = 'check-q';
      q.append(`${i + 1}. `, renderInlines(c.q));
      box.appendChild(q);
      const opts = document.createElement('div');
      opts.className = 'check-opts';
      const exp = document.createElement('div');
      exp.className = 'check-explain';
      exp.hidden = true;
      exp.appendChild(renderBlocks(c.explain, ctx));
      c.choices.forEach((ch, k) => {
        const b = document.createElement('button');
        b.className = 'check-opt';
        b.appendChild(renderInlines(ch));
        b.onclick = () => {
          const ok = k === c.answer;
          opts.querySelectorAll('button').forEach((x, j) => {
            x.classList.toggle('right', j === c.answer);
            x.classList.toggle('wrong', j === k && !ok);
          });
          exp.hidden = false;
          exp.dataset.result = ok ? '맞았습니다' : '다시 생각해 볼 지점';
          progress.check(id, i, ok);
        };
        opts.appendChild(b);
      });
      box.append(opts, exp);
      sec.appendChild(box);
    });
    tail.appendChild(sec);
  }

  // 코드
  if (node.code?.length) {
    const d = document.createElement('details');
    d.className = 'code-panel';
    d.innerHTML = `<summary>이 노드의 코드 <span class="dim">— 화면의 모든 수는 이 함수들로 계산된다</span></summary>`;
    for (const fn of node.code) {
      const c = codeOf(fn);
      if (!c) continue;
      const fig = document.createElement('figure');
      fig.innerHTML = `<figcaption><code>${fn}</code> · ${c.file}</figcaption><pre><code>${highlightTs(c.src)}</code></pre>`;
      d.appendChild(fig);
    }
    tail.appendChild(d);
  }

  // 미뤄 둔/열린 왜?
  if (node.openWhys?.length) {
    const sec = document.createElement('section');
    sec.className = 'open-whys';
    sec.innerHTML = '<h2>아직 여기서 답하지 않은 질문</h2>';
    const ul = document.createElement('ul');
    for (const w of node.openWhys) {
      const li = document.createElement('li');
      if (w.answeredBy) {
        const n = NODE_BY_ID.get(w.answeredBy);
        li.innerHTML = `${w.q} <span class="dim">→ 뒤에서 답함:</span> <a class="nlink" data-to="${w.answeredBy}" href="#/n/${w.answeredBy}">${BOOK_OF.get(w.answeredBy)?.num}권 · ${n?.title}</a>`;
      } else li.innerHTML = `${w.q} <span class="warn-dot">이 교재 안에서는 답하지 않음</span>`;
      ul.appendChild(li);
    }
    sec.appendChild(ul);
    tail.appendChild(sec);
  }

  // 마무리: 이해함 표시, 이 노드에 기대는 곳, 앞뒤
  const foot = document.createElement('footer');
  foot.className = 'node-foot';
  const doneLbl = document.createElement('label');
  doneLbl.className = 'done-toggle';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = progress.isDone(id);
  cb.onchange = () => progress.setDone(id, cb.checked);
  doneLbl.append(cb, ' 이 노드를 이해했다 (스스로 설명할 수 있다)');
  foot.appendChild(doneLbl);
  if (nPred) {
    const sum = document.createElement('div');
    sum.className = 'predict-sum';
    const text = document.createElement('span');
    const again = document.createElement('button');
    again.className = 'gate-skip';
    again.textContent = '이 노드의 예측을 처음부터 다시';
    again.onclick = () => {
      progress.clearPredicts(id);
      location.hash = `#/n/${id}?view=predict`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    };
    sum.append(text, again);
    // 관문을 확정할 때마다 다시 센다
    updateSum = () => {
      const recs = (node.predicts ?? []).map((p) => progress.predict(id, p.id));
      const ok = recs.filter((r) => r?.ok === true).length;
      const bad = recs.filter((r) => r?.ok === false).length;
      const sk = recs.filter((r) => r?.skipped).length;
      const hu = recs.reduce((a, r) => a + (r?.hints ?? 0), 0);
      text.innerHTML = `<span class="strip-label">예측 기록</span> ${nPred}개 중 맞음 ${ok} · 다름 ${bad} · 건너뜀 ${sk} · 아직 ${nPred - ok - bad - sk}${hu ? ` · 사용한 힌트 ${hu}개` : ''} `;
    };
    updateSum();
    foot.appendChild(sum);
  }

  const deps = [...new Set(dependents(id).map((e) => e.from))].sort((a, b) => V.order.get(a)! - V.order.get(b)!);
  if (deps.length) {
    const bl = document.createElement('div');
    bl.className = 'backlinks';
    bl.innerHTML = `<span class="strip-label">이 노드에 기대는 곳 ${deps.length}개</span>`;
    for (const d of deps) {
      const n = NODE_BY_ID.get(d)!;
      const a = document.createElement('a');
      a.className = 'chip-node';
      a.href = `#/n/${d}`;
      a.dataset.node = d;
      a.innerHTML = `<span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span>${BOOK_OF.get(d)!.num}권 · ${n.title}`;
      bl.appendChild(a);
    }
    foot.appendChild(bl);
  }

  const idx = ALL_NODES.findIndex((n) => n.id === id);
  const nav = document.createElement('div');
  nav.className = 'prevnext';
  const prev = ALL_NODES[idx - 1], next = ALL_NODES[idx + 1];
  nav.innerHTML =
    (prev ? `<a href="#/n/${prev.id}" class="prev">← ${prev.title}</a>` : '<span></span>') +
    `<a href="#/map?focus=${id}" class="maplink">지도에서 보기</a>` +
    (next ? `<a href="#/n/${next.id}" class="next">${next.title} →</a>` : '<span></span>');
  foot.appendChild(nav);
  art.appendChild(foot);

  main.innerHTML = '';
  main.appendChild(art);

  // 왜? 칩을 누르면 지금 자리를 기억한다
  art.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.why');
    if (a) {
      trail.push({ node: id, scroll: window.scrollY, q: a.dataset.q ?? '' });
      sessionStorage.setItem('le.arrivedByWhy', a.dataset.to ?? '');
    }
  });

  refreshLocks();
  const offDom = bus.bindDom(art);
  const restore = sessionStorage.getItem('le.restoreScroll');
  if (restore) {
    sessionStorage.removeItem('le.restoreScroll');
    requestAnimationFrame(() => window.scrollTo(0, +restore));
  } else window.scrollTo(0, 0);

  return () => {
    offDom();
    ctx.cleanups.forEach((f) => f());
  };
}
