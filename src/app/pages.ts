// 보조 화면: 처음 화면, 용어·기호표, 검증 보고서
import { BOOKS, ALL_NODES, NODE_BY_ID, BOOK_OF, V } from './data';
import { KIND_LABEL } from '../content/schema';
import { RULES } from '../verify/verify';
import { COLOR_TABLE } from '../render/colors';
import { tex } from './render';
import { progress } from './state';
import { reviewState, REVIEWS } from '../content/review';

export function renderHome(main: HTMLElement) {
  const written = ALL_NODES.filter((n) => n.status === 'written').length;
  const first = ALL_NODES[0];
  main.innerHTML = `
  <section class="home">
    <div class="home-hero">
      <div class="kicker">선형 원론 · Linear Algebra: The Elements</div>
      <h1>화살표에서 SVD까지,<br/>당연한 것을 하나도 당연하게 넘기지 않는 선형대수</h1>
      <p>이 교재는 독자가 산수만 안다고 가정하고 출발합니다. 모든 <b>정의</b>와 <b>명제</b>는 앞에 놓인 것만으로 세워지고, 읽다가 “왜?”라고 물을 만한 자리마다 그 답이 있는 앞쪽 노드로 가는 <span class="why"><span class="why-badge">왜?</span></span> 칩이 달려 있습니다. 이 규칙은 <a href="#/verify">검증기</a>가 기계적으로 확인합니다.</p>
      <div class="home-cta">
        <a class="btn primary" href="#/n/${first.id}">0장부터 시작하기</a>
        <a class="btn" href="#/map?focus=exp.lora">지도에서 끝(LoRA)부터 보기</a>
        <a class="btn" href="#/n/def.matvec">맛보기: 행렬 × 벡터</a>
      </div>
      <div class="home-stats">노드 ${ALL_NODES.length}개 · 본문 완성 ${written}개 · 이해 표시 ${progress.count()}개 · 용어 ${V.termHome.size}개</div>
    </div>
    <div class="home-grid">
      <div class="home-card"><h3>세 표현의 동기화</h3><p>행렬의 칸, 그림의 화살표, 식의 항이 같은 대상을 가리키면 같은 색이고, 하나를 가리키면 셋이 함께 빛납니다. <b>색도 기호입니다.</b></p></div>
      <div class="home-card"><h3>유리 상자</h3><p>화면의 모든 수는 이 저장소의 <code>src/la</code>에 있는 손으로 짠 함수가 계산합니다. 각 노드의 “이 노드의 코드”에서 그 원문을 그대로 읽을 수 있습니다. 라이브러리는 테스트의 심판으로만 씁니다.</p></div>
      <div class="home-card"><h3>원론 지도</h3><p>모든 노드는 앞의 노드에 기댑니다. 어떤 명제든 골라서 <b>공리까지 거슬러 오를</b> 수 있습니다.</p></div>
      <div class="home-card"><h3>눈 훈련장</h3><p>행렬을 보면 그림이, 그림을 보면 행렬이 떠오르도록 반복 훈련합니다. 이해와 숙련은 다른 목표입니다.</p></div>
    </div>
    <h2>목차</h2>
    <div class="toc-books">${BOOKS.map(
      (b) => `<div class="toc-book"><div class="toc-num">${b.num}</div><div><a href="#/n/${b.nodes[0].id}"><b>${b.title}</b></a> <span class="dim">— ${b.subtitle}</span><div class="toc-meter">${b.nodes
        .map((n) => `<a href="#/n/${n.id}" title="${n.title}" class="tick ${n.status} ${progress.isDone(n.id) ? 'done' : ''}"></a>`)
        .join('')}</div></div></div>`,
    ).join('')}</div>
  </section>`;
}

export function renderGlossary(main: HTMLElement) {
  const terms = [...V.termHome.entries()].sort((a, b) => V.order.get(a[1].node)! - V.order.get(b[1].node)!);
  const syms = ALL_NODES.flatMap((n) => (n.introduces?.symbols ?? []).map((s) => ({ ...s, node: n.id })));
  const useCount = new Map<string, number>();
  for (const e of V.edges) if (e.kind === 'term') useCount.set(e.to, (useCount.get(e.to) ?? 0) + 1);
  main.innerHTML = `
  <section class="page">
    <h1>용어 · 기호 · 색</h1>
    <p class="dim">이 표는 손으로 관리하지 않습니다. 각 노드의 선언(<code>introduces</code>)에서 자동으로 만들어지고, 검증기가 한 이름이 두 뜻을 갖지 않는지 확인합니다.</p>
    <h2>이름 충돌을 피하려고 정한 것</h2>
    <table class="tbl"><tr><th>충돌</th><th>결정</th></tr>
      <tr><td>계수(係數, coefficient) / 계수(階數, rank)</td><td>coefficient = <b>계수</b>, rank = <b>랭크</b></td></tr>
      <tr><td>외적(cross product) / 외적(outer product)</td><td>outer product = <b>바깥곱</b></td></tr>
      <tr><td>투영 / 사영 (projection)</td><td><b>사영</b>, 수직으로 내리면 <b>정사영</b></td></tr>
      <tr><td>가는 v₁ / 굵은 𝐯₁</td><td>가는 글씨+첨자 = 성분(숫자), 굵은 글씨+첨자 = 이름 붙은 벡터 목록의 하나</td></tr>
    </table>
    <h2>색</h2>
    <table class="tbl">${COLOR_TABLE.map((c) => `<tr><td><span class="swatch" style="background:${c.color}"></span> ${c.name}</td><td>${c.meaning}</td></tr>`).join('')}</table>
    <h2>기호 (${syms.length})</h2>
    <table class="tbl"><tr><th>기호</th><th>가리키는 것</th><th>처음 나온 곳</th><th>비고</th></tr>
    ${syms.map((s) => `<tr><td>${tex(s.tex)}</td><td>${s.meaning}</td><td><a href="#/n/${s.node}">${BOOK_OF.get(s.node)!.num}장 · ${NODE_BY_ID.get(s.node)!.title}</a></td><td class="dim">${s.note ?? ''}</td></tr>`).join('')}</table>
    <h2>용어 (${terms.length})</h2>
    <table class="tbl"><tr><th>용어</th><th>영어</th><th>한 줄 정의</th><th>정의한 곳</th><th>참조</th></tr>
    ${terms
      .map(
        ([id, { node, decl }]) =>
          `<tr><td><b>${decl.ko}</b></td><td class="dim">${decl.en ?? ''}</td><td>${decl.gloss}</td><td><a href="#/n/${node}">${BOOK_OF.get(node)!.num}장 · ${NODE_BY_ID.get(node)!.title}</a>${NODE_BY_ID.get(node)!.status === 'stub' ? ' <span class="dim">(예정)</span>' : ''}</td><td class="dim">${useCount.get(node) ? '' : ''}${id}</td></tr>`,
      )
      .join('')}</table>
  </section>`;
}

export function renderReport(main: HTMLElement) {
  const by = (lv: string) => V.issues.filter((i) => i.level === lv);
  const groups = (['error', 'warn', 'info'] as const).map((lv) => {
    const list = by(lv);
    const rules = [...new Set(list.map((i) => i.rule))];
    return `<h2 class="lv-${lv}">${lv === 'error' ? '오류' : lv === 'warn' ? '경고' : '참고'} ${list.length}개</h2>${rules
      .map(
        (r) => `<details ${lv !== 'info' ? 'open' : ''}><summary><code>${r}</code> ${RULES[r].text} — ${list.filter((i) => i.rule === r).length}개</summary><ul>${list
          .filter((i) => i.rule === r)
          .map((i) => `<li><a href="#/n/${i.node}">${i.node}</a> ${escapeHtml(i.msg)}</li>`)
          .join('')}</ul></details>`,
      )
      .join('')}`;
  });
  const written = ALL_NODES.filter((n) => n.status === 'written').length;
  main.innerHTML = `
  <section class="page">
    <h1>검증 보고서</h1>
    <p>이 화면은 <code>npm run verify</code>와 <b>같은 코드</b>를 지금 이 브라우저에서 돌린 결과입니다. 노드 ${ALL_NODES.length}개 중 본문 완성 ${written}개, 의존 관계 ${V.edges.length}개.</p>
    <aside class="note note-주의"><div class="note-label">이 검증기가 보장하는 것과 보장하지 못하는 것</div>
      <p><b>보장하는 것 — 정의 그래프의 무결성.</b> 표시된 용어를 정의하기 전에 쓰지 않았다. 왜? 칩과 링크가 모두 이미 읽은 앞쪽 노드를 가리킨다. 한 용어나 기호가 두 번 정의되지 않았다. 표시되지 않은 본문에 아직 정의되지 않은 용어의 표기가 섞이지 않았다(원문 어휘 스캔). 장면과 코드 참조가 실제로 존재한다.</p>
      <p><b>보장하지 못하는 것 — 설명의 충분성.</b> “늘어나는 비율”처럼 풀어 쓴 표현이 사실상 뒤의 개념을 쓰는 경우, 증명에 논리의 빈틈이 있는 경우, 그림이 암묵적으로 전제하는 개념은 잡지 못합니다. 이 빈틈은 사람(당신)의 “왜?”로만 메울 수 있습니다.</p>
    </aside>
    ${groups.join('')}
    ${reviewSection()}
    <h2>규칙 목록</h2>
    <table class="tbl">${Object.entries(RULES).map(([k, v]) => `<tr><td><code>${k}</code></td><td>${v.level}</td><td>${v.text}</td></tr>`).join('')}</table>
  </section>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

export function kindLabel(id: string) {
  return KIND_LABEL[NODE_BY_ID.get(id)!.kind];
}

/** 저자 검토 현황: 장마다 검토함 / 검토 뒤 바뀜 / 초안. 기록은 npm run review -- mark <id> */
function reviewSection(): string {
  const label = { reviewed: '검토함', changed: '검토 뒤 바뀜', draft: '초안' } as const;
  const all = ALL_NODES.map((n) => reviewState(n));
  const rows = BOOKS.map((b) => {
    const items = b.nodes
      .map((n) => {
        const s = reviewState(n);
        return `<li class="rv rv-${s}"><span class="rv-tag">${label[s]}${s !== 'draft' ? ` · ${REVIEWS[n.id].on}` : ''}</span> <a href="#/n/${n.id}">${n.title}</a></li>`;
      })
      .join('');
    const done = b.nodes.filter((n) => reviewState(n) === 'reviewed').length;
    return `<details><summary>${b.num}장 ${b.title} — 검토함 ${done}/${b.nodes.length}</summary><ul class="rv-list">${items}</ul></details>`;
  }).join('');
  return `<h2>저자 검토</h2>
    <p>저자가 노드를 검토하면 그때의 내용 지문을 기록합니다. 그 뒤 내용이 바뀌면 "검토 뒤 바뀜"으로 돌아갑니다(P026). 검토함 ${all.filter((s) => s === 'reviewed').length} · 검토 뒤 바뀜 ${all.filter((s) => s === 'changed').length} · 초안 ${all.filter((s) => s === 'draft').length}.</p>
    ${rows}`;
}
