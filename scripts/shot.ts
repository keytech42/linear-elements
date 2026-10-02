// 스크린샷 도구: npx tsx scripts/shot.ts <노드id | #/경로> [더 많은 대상...] [--w=1400]
// 개발 서버를 잠깐 띄우고, 이 컴퓨터의 Chrome을 머리 없이(headless) 열어 전체 페이지를 찍는다.
// 결과: /tmp/le-shots/<이름>.png  · 콘솔 오류는 표준 출력으로.
import { createServer } from 'vite';
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const width = +(args.find((a) => a.startsWith('--w='))?.slice(4) ?? 1400);
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.log('사용법: npx tsx scripts/shot.ts def.matvec "#/map" ...');
  process.exit(1);
}
const out = '/tmp/le-shots';
mkdirSync(out, { recursive: true });

const server = await createServer({ server: { port: 0, host: '127.0.0.1', hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const addr = server.httpServer!.address() as { port: number };
const base = `http://127.0.0.1:${addr.port}/`;
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
  protocolTimeout: 30000,
});
try {
  for (const t of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    const errs: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    const hash = t.startsWith('#') ? t : `#/n/${t}`;
    await page.goto(base + hash, { waitUntil: 'networkidle0', timeout: 60000 });
    // 장면은 화면에 들어올 때 그려지므로 끝까지 한 번 훑는다
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));
    const name = t.replace(/[^\w.-]+/g, '_');
    // fullPage 캡처는 100vh에 기대는 배치에서 가끔 멈춘다. 화면 높이를 페이지 높이에 맞춘 뒤 일반 캡처를 한다.
    const fullH = await page.evaluate(() => Math.min(16000, document.documentElement.scrollHeight));
    await page.setViewport({ width, height: fullH, deviceScaleFactor: 1 });
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log(`${out}/${name}.png${errs.length ? '\n  콘솔 오류:\n  ' + errs.join('\n  ') : ''}`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
