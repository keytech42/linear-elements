// npm run verify — 교수법 검증기 CLI. error가 하나라도 있으면 실패(exit 1)한다.
// 옵션: --all  info 수준까지 모두 출력
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from '../src/content/index';
import { verify, RULES } from '../src/verify/verify';
import { indexExports } from '../src/verify/code-index';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sceneIds = new Set(
  readdirSync(join(root, 'src/scenes'))
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
    .map((f) => f.replace(/\.ts$/, '')),
);
const laDir = join(root, 'src/la');
const sources: Record<string, string> = {};
for (const f of readdirSync(laDir)) if (f.endsWith('.ts') && !f.endsWith('.test.ts')) sources[`la/${f}`] = readFileSync(join(laDir, f), 'utf8');
const codeIndex = indexExports(sources);

const r = verify(BOOKS, sceneIds, codeIndex);
const showAll = process.argv.includes('--all');
const by = { error: 0, warn: 0, info: 0 };
const color = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[90m' };
for (const i of r.issues) {
  by[i.level]++;
  if (i.level === 'info' && !showAll) continue;
  console.log(`${color[i.level]}${i.level.padEnd(5)} ${i.rule}\x1b[0m [${i.node}] ${i.msg}`);
}
const nodes = BOOKS.flatMap((b) => b.nodes);
const written = nodes.filter((n) => n.status === 'written').length;
console.log(`\n노드 ${nodes.length}개 (본문 완성 ${written}개) · 용어 ${r.termHome.size}개 · 의존 간선 ${r.edges.length}개 · 첫 등장 자동 링크 ${r.autoLinked}곳`);
console.log(`error ${by.error} · warn ${by.warn} · info ${by.info}${showAll ? '' : ' (info는 --all로 표시)'}`);
if (by.error) {
  console.log('\n규칙 설명:');
  for (const rule of new Set(r.issues.filter((i) => i.level === 'error').map((i) => i.rule))) console.log(`  ${rule}: ${RULES[rule].text}`);
  process.exit(1);
}
