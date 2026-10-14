// 노드 읽기 화면.
import {
  NODE_BY_ID,
  BOOK_OF,
  ALL_NODES,
  V,
  prereqs,
  dependents,
  codeOf,
} from "./data";
import { KIND_LABEL, KIND_EN } from "../content/schema";
import { renderBlocks, renderInlines, type RenderCtx } from "./render";
import { progress, trail } from "./state";
import {
  depart,
  takeArrival,
  skipsOrder,
  OPENED_BECAUSE,
  BACK_LABEL,
  type Via,
} from "./nav";
import { SyncBus } from "../sync/bus";
import { highlightTs } from "./highlight";
import { renderGate } from "./predict";
import type { Block } from "../content/markup";

const EDGE_LABEL = {
  requires: "선행",
  why: "왜?",
  link: "참조",
  term: "용어",
} as const;

export function renderNode(
  main: HTMLElement,
  id: string,
  view?: string | null,
): () => void {
  const node = NODE_BY_ID.get(id);
  if (!node) {
    main.innerHTML = `<div class="empty">노드 <code>${id}</code>를 찾을 수 없습니다.</div>`;
    return () => {};
  }
  const book = BOOK_OF.get(id)!;
  const pn = V.parsed.get(id);
  const bus = new SyncBus();
  const ctx: RenderCtx = { bus, cleanups: [], node: id };
  const art = document.createElement("article");
  art.className = `node node-${node.kind}`;

  // 돌아가기 막대
  const t = trail.get();
  if (t.length) {
    const last = t[t.length - 1];
    const from = NODE_BY_ID.get(last.node);
    const bar = document.createElement("button");
    bar.className = "trail-bar";
    bar.innerHTML = `<span>← 돌아가기</span> <b>${from?.title ?? last.node}</b>에서 ${last.kind === "ref" ? "찾아본" : "물었던"} <i>“${last.q}”</i>${t.length > 1 ? ` <span class="dim">(쌓인 질문 ${t.length}개)</span>` : ""}`;
    bar.onclick = () => {
      const s = trail.pop()!;
      location.hash = `#/n/${s.node}`;
      sessionStorage.setItem("le.restoreScroll", String(s.scroll));
    };
    art.appendChild(bar);
  }

  const head = document.createElement("header");
  head.className = "node-head";
  head.innerHTML = `<div class="kicker"><span class="kind kind-${node.kind}">${KIND_LABEL[node.kind]}<sup class="term-en">${KIND_EN[node.kind]}</sup></span> ${book.num}장 ${book.title} · <code>${node.id}</code></div><h1>${node.title}</h1>`;
  art.appendChild(head);

  // 읽기 모드: 예측하며 읽기(관문이 잠겨 있음) / 펼쳐 보기(모두 열림)
  // 다른 노드에서 건너왔거나(nav.ts: 왜? 칩, 이름표 참조, 바로가기, 앞질러 가기), 이해했다고 표시한 노드라면 펼쳐서 연다.
  // 답이나 근거를 찾으러 온 사람에게 퀴즈를 내지 않는다. 펼쳐 보기는 예측을 기록하지 않으므로, 나중에 순서대로 읽을 때 관문은 그대로 남아 있다.
  const nPred = node.predicts?.length ?? 0;
  const arrival = takeArrival(id);
  const review =
    nPred > 0 &&
    (view === "all" ||
      (view !== "predict" && (!!arrival || progress.isDone(id))));
  if (nPred) {
    const mode = document.createElement("div");
    mode.className = "mode-switch";
    mode.innerHTML =
      `<a href="#/n/${id}?view=predict" class="${review ? "" : "on"}">예측하며 읽기</a><a href="#/n/${id}?view=all" class="${review ? "on" : ""}">펼쳐 보기</a>` +
      (review && arrival
        ? `<span class="dim">${OPENED_BECAUSE[arrival.via]}</span>`
        : review && view !== "all"
          ? '<span class="dim">이해했다고 표시한 노드라 펼쳐 열었습니다</span>'
          : "");
    head.appendChild(mode);
  }

  // 이 노드가 기대는 곳
  const pre = prereqs(id).sort(
    (a, b) => V.order.get(a.to)! - V.order.get(b.to)!,
  );
  if (pre.length) {
    const strip = document.createElement("div");
    strip.className = "prereq-strip";
    strip.innerHTML = `<span class="strip-label">기대는 곳</span>`;
    const seen = new Set<string>();
    for (const e of pre) {
      if (seen.has(e.to)) continue;
      seen.add(e.to);
      const n = NODE_BY_ID.get(e.to)!;
      const a = document.createElement("a");
      a.className = `chip-node ${progress.isDone(e.to) ? "done" : ""}`;
      a.href = `#/n/${e.to}`;
      a.dataset.node = e.to;
      a.innerHTML = `<span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span>${n.title}`;
      a.title = pre
        .filter((x) => x.to === e.to)
        .map((x) => EDGE_LABEL[x.kind])
        .join(", ");
      strip.appendChild(a);
    }
    art.appendChild(strip);
  }

  if (node.status === "stub") {
    const b = document.createElement("div");
    b.className = "stub-banner";
    b.innerHTML =
      "<b>집필 예정 노드</b> — 아래는 이 노드가 답할 질문들입니다. 용어·기호·의존 관계는 이미 확정되어 검증기에 등록되어 있습니다.";
    art.appendChild(b);
  }

  // 본문을 관문(::predict) 자리에서 단계로 나눈다. 관문 i를 통과해야 단계 i+1이 열린다.
  const body = document.createElement("div");
  body.className = "node-body";
  art.appendChild(body);
  const segs: Block[][] = [[]];
  const gateIds: string[] = [];
  for (const b of pn?.body ?? []) {
    if (b.t === "predict") {
      gateIds.push(b.id);
      segs.push([]);
    } else segs[segs.length - 1].push(b);
  }
  const segEls = segs.map((blocks) => {
    const d = document.createElement("div");
    d.className = "seg";
    d.appendChild(renderBlocks(blocks, ctx));
    return d;
  });
  const tail = document.createElement("div");
  tail.className = "node-tail";
  const proofLinks: HTMLAnchorElement[] = [];
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
    // 명제 옆의 "증명 ↓": 증명은 관문을 모두 지나야 열리므로, 잠겨 있으면 몇 개가 남았는지 알린다.
    const left = review
      ? 0
      : gateIds.filter((g) => !progress.predict(id, g)).length;
    for (const a of proofLinks) {
      a.classList.toggle("locked", !open);
      a.textContent = open
        ? "증명 ↓"
        : `증명 ↓ · 관문 ${left}개를 지나면 열린다`;
    }
    if (firstNew)
      requestAnimationFrame(() =>
        (firstNew as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
  };
  let updateSum = () => {};
  body.appendChild(segEls[0]);
  gateIds.forEach((g, i) => {
    const pp = pn!.predicts.get(g);
    if (pp)
      body.appendChild(
        renderGate(
          pp,
          id,
          i,
          review,
          ctx,
          () => (refreshLocks(true), updateSum()),
        ),
      );
    body.appendChild(segEls[i + 1]);
  });
  art.appendChild(tail);

  if (pn?.proof) {
    const d = document.createElement("details");
    d.className = "proof";
    d.id = "proof";
    d.open = true;
    d.innerHTML = "<summary>증명</summary>";
    d.appendChild(renderBlocks(pn.proof, ctx));
    const qed = document.createElement("div");
    qed.className = "qed";
    qed.textContent = "∎";
    d.appendChild(qed);
    tail.appendChild(d);
  }

  // 점검 문제
  if (pn?.checks.length) {
    const sec = document.createElement("section");
    sec.className = "checks";
    sec.innerHTML = "<h2>점검</h2>";
    pn.checks.forEach((c, i) => {
      const box = document.createElement("div");
      box.className = "check";
      const q = document.createElement("div");
      q.className = "check-q";
      q.append(`${i + 1}. `, renderInlines(c.q));
      box.appendChild(q);
      const opts = document.createElement("div");
      opts.className = "check-opts";
      const exp = document.createElement("div");
      exp.className = "check-explain";
      exp.hidden = true;
      exp.appendChild(renderBlocks(c.explain, ctx));
      c.choices.forEach((ch, k) => {
        const b = document.createElement("button");
        b.className = "check-opt";
        b.appendChild(renderInlines(ch));
        b.onclick = () => {
          const ok = k === c.answer;
          opts.querySelectorAll("button").forEach((x, j) => {
            x.classList.toggle("right", j === c.answer);
            x.classList.toggle("wrong", j === k && !ok);
          });
          exp.hidden = false;
          exp.dataset.result = ok ? "맞았습니다" : "다시 생각해 볼 지점";
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
    const d = document.createElement("details");
    d.className = "code-panel";
    d.innerHTML = `<summary>이 노드의 코드 <span class="dim">— 화면의 모든 수는 이 함수들로 계산된다</span></summary>`;
    for (const fn of node.code) {
      const c = codeOf(fn);
      if (!c) continue;
      const fig = document.createElement("figure");
      fig.innerHTML = `<figcaption><code>${fn}</code> · ${c.file}</figcaption><pre><code>${highlightTs(c.src)}</code></pre>`;
      d.appendChild(fig);
    }
    tail.appendChild(d);
  }

  // 미뤄 둔/열린 왜?
  if (node.openWhys?.length) {
    const sec = document.createElement("section");
    sec.className = "open-whys";
    sec.innerHTML = "<h2>아직 여기서 답하지 않은 질문</h2>";
    const ul = document.createElement("ul");
    const here = ALL_NODES.findIndex((n) => n.id === id);
    for (const w of node.openWhys) {
      const li = document.createElement("li");
      if (w.answeredBy) {
        // 순서대로 읽을 사람에게는 답이 어디쯤 있는지를, 지금 답을 보려는 사람에게는 바로가기를 준다.
        const to = w.answeredBy;
        const n = NODE_BY_ID.get(to);
        const gap = ALL_NODES.findIndex((x) => x.id === to) - here;
        const where = gap === 1 ? "바로 다음 노드" : `${gap}개 노드 뒤`;
        li.innerHTML = `${w.q} <span class="dim">→ 뒤에서 답함: ${BOOK_OF.get(to)?.num}장 · ${n?.title} (${where})</span> <a class="shortcut" data-to="${to}" href="#/n/${to}" title="답이 있는 자리로 건너뛴다. 그 노드는 관문을 펼쳐 연 채로 열리고, 예측은 기록되지 않는다.">답으로 바로가기 ↷</a>`;
        li.querySelector<HTMLAnchorElement>("a.shortcut")!.dataset.q = w.q;
      } else
        li.innerHTML = `${w.q} <span class="warn-dot">이 교재 안에서는 답하지 않음</span>`;
      ul.appendChild(li);
    }
    sec.appendChild(ul);
    tail.appendChild(sec);
  }

  // 마무리: 이해함 표시, 이 노드에 기대는 곳, 앞뒤
  const foot = document.createElement("footer");
  foot.className = "node-foot";
  const doneLbl = document.createElement("label");
  doneLbl.className = "done-toggle";
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = progress.isDone(id);
  cb.onchange = () => progress.setDone(id, cb.checked);
  doneLbl.append(cb, " 이 노드를 이해했다 (스스로 설명할 수 있다)");
  foot.appendChild(doneLbl);
  if (nPred) {
    const sum = document.createElement("div");
    sum.className = "predict-sum";
    const text = document.createElement("span");
    const again = document.createElement("button");
    again.className = "gate-skip";
    again.textContent = "이 노드의 예측을 처음부터 다시";
    again.onclick = () => {
      progress.clearPredicts(id);
      location.hash = `#/n/${id}?view=predict`;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    };
    sum.append(text, again);
    // 관문을 확정할 때마다 다시 센다
    updateSum = () => {
      const recs = (node.predicts ?? []).map((p) => progress.predict(id, p.id));
      const ok = recs.filter((r) => r?.ok === true).length;
      const bad = recs.filter((r) => r?.ok === false).length;
      const sk = recs.filter((r) => r?.skipped).length;
      const hu = recs.reduce((a, r) => a + (r?.hints ?? 0), 0);
      text.innerHTML = `<span class="strip-label">예측 기록</span> ${nPred}개 중 맞음 ${ok} · 다름 ${bad} · 건너뜀 ${sk} · 아직 ${nPred - ok - bad - sk}${hu ? ` · 사용한 힌트 ${hu}개` : ""} `;
    };
    updateSum();
    foot.appendChild(sum);
  }

  const deps = [...new Set(dependents(id).map((e) => e.from))].sort(
    (a, b) => V.order.get(a)! - V.order.get(b)!,
  );
  if (deps.length) {
    const bl = document.createElement("div");
    bl.className = "backlinks";
    bl.innerHTML = `<span class="strip-label">이 노드에 기대는 곳 ${deps.length}개</span>`;
    for (const d of deps) {
      const n = NODE_BY_ID.get(d)!;
      const a = document.createElement("a");
      a.className = "chip-node";
      a.href = `#/n/${d}`;
      a.dataset.node = d;
      a.innerHTML = `<span class="kind kind-${n.kind}">${KIND_LABEL[n.kind]}</span>${BOOK_OF.get(d)!.num}장 · ${n.title}`;
      bl.appendChild(a);
    }
    foot.appendChild(bl);
  }

  const idx = ALL_NODES.findIndex((n) => n.id === id);
  const nav = document.createElement("div");
  nav.className = "prevnext";
  const prev = ALL_NODES[idx - 1],
    next = ALL_NODES[idx + 1];
  nav.innerHTML =
    (prev
      ? `<a href="#/n/${prev.id}" class="prev">← ${prev.title}</a>`
      : "<span></span>") +
    `<a href="#/map?focus=${id}" class="maplink">지도에서 보기</a>` +
    (next
      ? `<a href="#/n/${next.id}" class="next">${next.title} →</a>`
      : "<span></span>");
  foot.appendChild(nav);
  art.appendChild(foot);

  // 명제와 공리 아래의 작은 줄: "증명 ↓"(그 명제의 증명으로)과 "뒤에서 쓰이는 곳"(이 이름표를 가리키는 뒤쪽 노드들).
  // 노드마다 구조가 달라도, 명제를 읽는 자리에서 증명이 어디 있는지와 이것이 어디에 쓰이는지를 바로 알 수 있게 한다.
  for (const lbl of body.querySelectorAll<HTMLElement>("strong.lbl")) {
    const key = lbl.id.slice("lbl-".length);
    const isStmt = node.kind === "prop" && !!pn?.proof;
    const usedBy = V.uses.get(`${id}#${key}`) ?? [];
    if (!isStmt && !usedBy.length) continue;
    const meta = document.createElement("span");
    meta.className = "stmt-meta";
    if (isStmt) {
      const a = document.createElement("a");
      a.className = "proof-link";
      a.href = `#/n/${id}`;
      a.dataset.key = key;
      proofLinks.push(a);
      meta.appendChild(a);
    }
    if (usedBy.length) {
      if (isStmt) meta.append(" · ");
      meta.append("뒤에서 쓰이는 곳: ");
      usedBy.slice(0, 3).forEach((u, i) => {
        const a = document.createElement("a");
        a.className = "nlink";
        a.href = `#/n/${u}`;
        a.dataset.to = u;
        a.textContent = `${BOOK_OF.get(u)!.num}장 ${NODE_BY_ID.get(u)!.title}`;
        meta.append(...(i ? [", ", a] : [a]));
      });
      if (usedBy.length > 3) meta.append(` 외 ${usedBy.length - 3}곳`);
    }
    (lbl.closest("li, p") ?? lbl.parentElement!).appendChild(meta);
  }

  main.innerHTML = "";
  main.appendChild(art);

  // 다른 노드로 건너가는 링크를 누르면 지금 자리를 기억하고 도착 지시를 남긴다(nav.ts)
  const here = () => window.scrollY;
  art.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.why");
    if (a) {
      // 그 노드의 명제 하나를 가리키는 왜? 칩이면 그 명제 자리로 간다
      const key = a.dataset.ref?.split("#")[1];
      depart(
        { node: id, scroll: here(), q: a.dataset.q ?? "" },
        {
          to: a.dataset.to ?? "",
          via: "why",
          targets: key ? [`lbl-${key}`] : [],
        },
      );
    }
    // 의의 칩: 그 칩이 있는 문단(목록 줄, 등식 줄) 바로 아래에 펼치고, 다시 누르면 접는다. 휴대폰처럼 마우스를 올릴 수 없는 곳에서도 읽을 수 있다.
    const sg = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.sig");
    if (sg) {
      e.preventDefault();
      const key = sg.dataset.sig ?? "";
      const host =
        sg.closest<HTMLElement>("li, p, .chain, .gate, .note") ??
        sg.parentElement!;
      const open = host.nextElementSibling?.matches(
        `.sig-panel[data-sig="${CSS.escape(key)}"]`,
      )
        ? (host.nextElementSibling as HTMLElement)
        : null;
      if (open) open.remove();
      else {
        const blocks = V.parsed.get(id)?.sig.get(key);
        if (blocks) {
          const panel = document.createElement("div");
          panel.className = "sig-panel";
          panel.dataset.sig = key;
          const lab = document.createElement("div");
          lab.className = "sig-panel-label";
          lab.textContent = "의의";
          panel.append(lab, renderBlocks(blocks, ctx));
          host.after(panel);
        }
      }
      sg.classList.toggle("open", !open);
      return;
    }
    const pl = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a.proof-link",
    );
    if (pl) {
      e.preventDefault();
      if (!pl.classList.contains("locked")) {
        const t =
          tail.querySelector<HTMLElement>(
            `#proof-${CSS.escape(pl.dataset.key ?? "")}`,
          ) ?? tail.querySelector<HTMLElement>("#proof");
        if (t) {
          t.scrollIntoView({ block: "start", behavior: "smooth" });
          flash(t);
        }
      }
    }
    // 이름표 참조: 같은 노드면 그 자리로 내려가고, 앞 노드면 펼쳐 열고 그 자리로 간다.
    // 앞질러 가기(a.ref.ahead)는 뒤 노드의 그 명제를 증명하는 자리로 건너뛴다. 증명 머리가 없으면(공리) 이름표로 간다.
    const ref = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a.ref, a.nlink[data-ref]",
    );
    if (ref?.dataset.ref) {
      const [to, key] = ref.dataset.ref.split("#");
      if (to === id) {
        e.preventDefault();
        const t = art.querySelector<HTMLElement>(`#lbl-${CSS.escape(key)}`);
        if (t?.offsetParent) {
          t.scrollIntoView({ block: "center", behavior: "smooth" });
          flash(t);
        }
      } else {
        const via: Via = ref.dataset.ahead ? "ahead" : "ref";
        depart(
          {
            node: id,
            scroll: here(),
            q: ref.dataset.name ?? ref.textContent ?? "",
            kind: "ref",
          },
          {
            to,
            via,
            targets:
              via === "ahead" ? [`proof-${key}`, `lbl-${key}`] : [`lbl-${key}`],
          },
        );
      }
    }
    const s = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a.shortcut",
    );
    if (s)
      depart(
        { node: id, scroll: here(), q: s.dataset.q ?? "" },
        { to: s.dataset.to ?? "", via: "shortcut", targets: [`answers-${id}`] },
      );
  });

  refreshLocks();
  const offDom = bus.bindDom(art);
  const restore = sessionStorage.getItem("le.restoreScroll");
  const landing =
    arrival?.targets
      .map((t) => art.querySelector<HTMLElement>(`#${CSS.escape(t)}`))
      .find((el) => !!el) ?? null;
  if (landing) land(landing, arrival!.via);
  else if (restore) {
    sessionStorage.removeItem("le.restoreScroll");
    requestAnimationFrame(() => window.scrollTo(0, +restore));
  } else window.scrollTo(0, 0);

  /** 건너온 자리에 착지한다: 그 자리로 내려가 잠깐 빛나게 한다. 순서를 건너뛰어 왔으면 그 사실과 두 갈래 길을 그 자리에 적는다. */
  function land(el: HTMLElement, via: Via) {
    // 이름표는 글 속의 굵은 글씨이므로, 알림은 그 항목(목록 줄이나 문단) 뒤에 둔다.
    const block = el.matches("strong.lbl")
      ? (el.closest<HTMLElement>("li, p") ?? el)
      : el;
    let view: HTMLElement = el;
    if (skipsOrder(via)) {
      // 머리의 안내는 화면 밖에 있으므로, 건너뛰어 왔다는 것과 두 갈래 길(처음부터 / 돌아가기)을 착지한 자리에 적는다.
      const seg = segEls.findIndex((s) => s.contains(el));
      const skipped = seg === -1 ? gateIds.length : seg; // 착지한 자리보다 앞에 있는 관문 수
      const note = document.createElement("div");
      note.className = "arrival-note";
      note.innerHTML =
        `<span>↷ 건너뛰어 왔습니다. 이 노드의 앞부분${skipped ? `과 관문 ${skipped}개를` : "을"} 지나쳤습니다.` +
        `${nPred ? " 이 노드의 관문은 모두 펼쳐 열려 있고, 예측은 기록되지 않습니다." : ""}</span> `;
      const top = document.createElement("a");
      top.href = `#/n/${id}?view=predict`;
      top.textContent = "이 노드를 처음부터 읽기";
      const back = document.createElement("button");
      back.textContent = BACK_LABEL[via];
      back.onclick = () =>
        art.querySelector<HTMLButtonElement>(".trail-bar")?.click();
      note.append(top, " · ", back);
      const hint = block.querySelector(":scope > .answers-hint");
      if (hint) block.insertBefore(note, hint);
      else block.after(note);
      // 착지한 자리 바로 앞이 소제목이면 소제목부터 보이게 한다.
      view =
        block.previousElementSibling?.tagName === "H3"
          ? (block.previousElementSibling as HTMLElement)
          : block;
    }
    // 위쪽 장면이 그려지며 높이가 바뀔 수 있으므로 조금 뒤에 한 번 더 맞춘다.
    const go = () =>
      view.scrollIntoView({ block: skipsOrder(via) ? "start" : "center" });
    requestAnimationFrame(go);
    setTimeout(go, 400);
    flash(el);
  }

  return () => {
    offDom();
    ctx.cleanups.forEach((f) => f());
  };
}

/** 찾아간 자리를 잠깐 빛나게 한다(같은 자리를 다시 찾아가도 다시 빛나도록 애니메이션을 처음부터 돌린다). */
function flash(el: HTMLElement) {
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}
