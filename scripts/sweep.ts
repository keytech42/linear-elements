// 전체 점검: 본문을 쓴 모든 노드를 펼쳐 보기로 열고, 장면을 모두 띄운 뒤
//   KaTeX 렌더링 오류(.katex-error), 장면 오류 문구, 페이지 오류를 센다.  npx tsx scripts/sweep.ts
import { createServer } from 'vite';
import puppeteer from 'puppeteer-core';
import { ALL_NODES } from '../src/content/index';

const ids = ALL_NODES.filter((n) => n.status === 'written').map((n) => n.id);
const server = await createServer({ server: { port: 0, host: '127.0.0.1', hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const base = `http://127.0.0.1:${(server.httpServer!.address() as { port: number }).port}/`;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 60000 });
let bad = 0;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900 });
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  for (const id of ids) {
    errs.length = 0;
    await page.goto(`${base}#/n/${id}?view=all`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await new Promise((r) => setTimeout(r, 200));
    const r = await page.evaluate(() => ({
      katex: [...document.querySelectorAll('.katex-error')].map((e) => (e as HTMLElement).title || e.textContent || '').slice(0, 3),
      scene: [...document.querySelectorAll('.scene')].filter((e) => /장면 오류|찾을 수 없음/.test(e.textContent ?? '')).length,
      gates: document.querySelectorAll('.gate').length,
    }));
    const okNode = !r.katex.length && !r.scene && !errs.length;
    if (!okNode) bad++;
    console.log(`${okNode ? 'ok  ' : 'BAD '} ${id.padEnd(28)} 관문 ${r.gates}${r.katex.length ? ' · KaTeX: ' + r.katex.join(' | ') : ''}${r.scene ? ` · 장면 오류 ${r.scene}` : ''}${errs.length ? ' · ' + errs.join(' | ') : ''}`);
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(bad ? `\n문제 있는 노드 ${bad}개` : `\n${ids.length}개 노드 모두 깨끗함`);
process.exit(bad ? 1 : 0);
