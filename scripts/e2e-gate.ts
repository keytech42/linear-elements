// 예측 관문 흐름 검사 (헤드리스 Chrome): npx tsx scripts/e2e-gate.ts
//  1. 예측 모드에서 관문 뒤 단계와 증명·점검이 잠겨 있다
//  2. 선택형 관문에서 보기를 고르면 판정과 오해 설명이 뜨고 다음 단계가 열린다
//  3. 그림형 관문을 확정하면 정답이 겹쳐 그려지고 다음 단계가 열린다
//  4. 관문을 모두 통과하면 증명·점검이 열린다
//  5. 펼쳐 보기(?view=all)에서는 잠긴 곳이 없다
//  6. 왜? 칩을 따라 들어가면 펼쳐 보기로 열린다
//  9~11. 답으로 바로가기와 앞질러 가기는 착지한 자리에 알림을 두고, 돌아가기로 돌아온다
import { createServer } from 'vite';
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

// 스크린샷 폴더. /tmp는 OS가 비울 수 있으므로 돌 때마다 만든다.
mkdirSync('/tmp/le-shots', { recursive: true });

const server = await createServer({ server: { port: 0, host: '127.0.0.1', hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const base = `http://127.0.0.1:${(server.httpServer!.address() as { port: number }).port}/`;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 30000 });
let fail = 0;
const ok = (name: string, cond: boolean, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`);
  if (!cond) fail++;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
try {
  const page = await browser.newPage();
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.setViewport({ width: 1300, height: 900 });
  await page.goto(base + '#/n/def.matrix', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  const state = () =>
    page.evaluate(() => ({
      hiddenSegs: [...document.querySelectorAll('.seg')].filter((e) => (e as HTMLElement).hidden).length,
      tailHidden: (document.querySelector('.node-tail') as HTMLElement).hidden,
      gates: document.querySelectorAll('.gate').length,
      resolved: document.querySelectorAll('.gate.resolved').length,
    }));
  let s = await state();
  ok('1. 처음에는 관문 뒤가 잠겨 있다', s.gates === 2 && s.hiddenSegs === 2 && !!s.tailHidden, JSON.stringify(s));

  // 선택형: 틀린 보기(2개)를 고른다
  await page.evaluate(() => (document.querySelectorAll('.gate')[0].querySelectorAll('button.check-opt')[0] as HTMLButtonElement).click());
  await wait(200);
  s = await state();
  const why = await page.evaluate(() => document.querySelector('.gate .gate-why:not(.right)')?.textContent ?? '');
  ok('2. 선택형: 판정·오해 설명이 뜨고 다음 단계가 열린다', s.resolved === 1 && s.hiddenSegs === 1 && why.includes('상(숫자 2개)'), JSON.stringify(s));

  // 그림형: 기본 위치 그대로 확정
  await page.evaluate(() => ([...document.querySelectorAll('.gate')[1].querySelectorAll('button')].find((b) => b.textContent === '확정') as HTMLButtonElement).click());
  await wait(300);
  s = await state();
  const msg = await page.evaluate(() => document.querySelectorAll('.gate')[1].querySelector('.gate-hint')?.textContent ?? '');
  ok('3. 그림형: 확정하면 정답·거리가 표시된다', s.resolved === 2 && msg.includes('정답 (0, 1)'), msg);
  ok('4. 관문을 모두 지나면 증명·점검이 열린다', !s.tailHidden && s.hiddenSegs === 0);
  await page.screenshot({ path: '/tmp/le-shots/e2e-gates-resolved.png' });

  // 다시 들어와도 기록이 남아 있다
  await page.goto(base + '#/n/def.matvec', { waitUntil: 'networkidle0' });
  await page.goto(base + '#/n/def.matrix?view=predict', { waitUntil: 'networkidle0' });
  await wait(200);
  s = await state();
  ok('기록 유지: 다시 열어도 통과한 관문은 열려 있다', s.resolved === 2 && !s.tailHidden);

  // 펼쳐 보기
  await page.goto(base + '#/n/prop.svd?view=all', { waitUntil: 'networkidle0' });
  await wait(200);
  s = await state();
  ok('5. 펼쳐 보기에서는 잠긴 곳이 없다', s.hiddenSegs === 0 && !s.tailHidden && s.gates === 2, JSON.stringify(s));

  // 왜? 칩을 따라가면 펼쳐 열린다: prop.svd 안의 왜? 칩 가운데 prop.svd-ata 를 가리키는 것
  await page.goto(base + '#/n/prop.svd?view=predict', { waitUntil: 'networkidle0' });
  await wait(200);
  await page.evaluate(() => (document.querySelector('a.why[data-to="prop.svd-ata"]') as HTMLAnchorElement).click());
  await wait(500);
  const here = await page.evaluate(() => location.hash);
  s = await state();
  ok('6. 왜? 칩으로 들어가면 펼쳐 열린다', here.includes('prop.svd-ata') && s.hiddenSegs === 0 && !s.tailHidden, `${here} ${JSON.stringify(s)}`);
  await page.screenshot({ path: '/tmp/le-shots/e2e-by-why.png' });

  // 힌트: 한 단계씩 열리고, 연 개수가 기록된다 (def.matvec의 그림 관문에는 힌트가 2개)
  await page.evaluate(() => localStorage.clear());
  await page.goto(base + '#/n/def.matvec?view=predict', { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(200);
  await page.evaluate(() => (document.querySelector('.gate-hint-btn') as HTMLButtonElement).click());
  await wait(100);
  const h1 = await page.evaluate(() => ({ boxes: document.querySelectorAll('.gate .gate-hint-box').length, label: document.querySelector('.gate-hint-btn')?.textContent ?? '' }));
  ok('7. 힌트 버튼을 누르면 힌트가 하나씩 열린다', h1.boxes === 1 && h1.label.includes('2/2'), JSON.stringify(h1));
  await page.evaluate(() => ([...document.querySelector('.gate')!.querySelectorAll('button')].find((b) => b.textContent === '확정') as HTMLButtonElement).click());
  await wait(200);
  const used = await page.evaluate(() => document.querySelector('.gate .gate-hint-used')?.textContent ?? '');
  const foot = await page.evaluate(() => document.querySelector('.predict-sum')?.textContent ?? '');
  ok('8. 힌트를 본 개수가 판정과 예측 기록에 남는다', used.includes('1개') && foot.includes('힌트 1개'), `${used} / ${foot.slice(0, 60)}`);

  // 건너가기(nav.ts): 답으로 바로가기와 앞질러 가기는 착지한 자리에 알림을 두고, 돌아가기로 원래 노드에 돌아온다
  const arrive = () =>
    page.evaluate(() => ({
      hash: location.hash,
      hiddenSegs: [...document.querySelectorAll('.seg')].filter((e) => (e as HTMLElement).hidden).length,
      // 알림이 붙은 자리: 착지한 요소 바로 뒤(증명 머리)이거나 그 안(답 표지)
      note: document.querySelector('.arrival-note')?.previousElementSibling?.id || document.querySelector('.arrival-note')?.parentElement?.id || '',
      noteText: document.querySelector('.arrival-note')?.textContent ?? '',
      trail: !!document.querySelector('.trail-bar'),
    }));
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(base + '#/n/ax.arith?view=predict', { waitUntil: 'networkidle0' });
  await page.evaluate(() => (document.querySelector('a.shortcut') as HTMLAnchorElement).click());
  await wait(700);
  let a = await arrive();
  ok('9. 답으로 바로가기: 답 표지에 착지 알림이 붙고 펼쳐 열린다', a.hash.includes('prop.arith-first') && a.note === 'answers-ax.arith' && a.hiddenSegs === 0 && a.trail, JSON.stringify(a));
  await page.goto(base + '#/n/ax.arith?view=predict', { waitUntil: 'networkidle0' });
  await page.evaluate(() => (document.querySelector('a.ref.ahead[data-ref="prop.arith-first#inverse-unique"]') as HTMLAnchorElement).click());
  await wait(700);
  a = await arrive();
  ok('10. 앞질러 가기: 그 명제의 증명 머리에 착지하고, 건너뛴 관문 수를 알린다', a.hash.includes('prop.arith-first') && a.note === 'proof-inverse-unique' && a.noteText.includes('관문') && a.noteText.includes('원래 자리로') && a.hiddenSegs === 0, JSON.stringify(a));
  await page.screenshot({ path: '/tmp/le-shots/e2e-ahead.png' });
  await page.evaluate(() => ([...document.querySelectorAll('.arrival-note button')].pop() as HTMLButtonElement).click());
  await wait(500);
  ok('11. 돌아가기로 원래 노드에 돌아온다', (await page.evaluate(() => location.hash)).includes('ax.arith'));

  // 예측 모드 첫 화면 (잠긴 모습)
  await page.evaluate(() => localStorage.clear());
  await page.goto(base + '#/n/def.matvec?view=predict', { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(300);
  await page.screenshot({ path: '/tmp/le-shots/e2e-locked.png' });
  ok('페이지 오류 없음', errs.length === 0, errs.join(' | '));
} finally {
  await browser.close();
  await server.close();
}
console.log(fail ? `\n${fail}개 실패` : '\n모두 통과');
process.exit(fail ? 1 : 0);
