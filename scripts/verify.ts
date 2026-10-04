// npm run verify — 교수법 검증기 CLI. error가 하나라도 있으면 실패(exit 1)한다.
// 옵션: --all  info 수준까지 모두 출력
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from '../src/content/index';
import { verify, RULES } from '../src/verify/verify';
import { indexExports } from '../src/verify/code-index';
import { reviewState } from '../src/content/review';

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

// 노드 파일과 장 목록이 맞는가: 장 폴더(src/content/cNN-…)의 노드 파일은 모두 그 장의 index.ts 목록에 있어야 하고,
// 파일 이름은 노드 id와 같아야 한다. 목록에서 빠진 파일은 검증기도 앱도 읽지 않으므로 조용히 사라진다.
const contentDir = join(root, 'src/content');
const layoutErrors: string[] = [];
for (const dir of readdirSync(contentDir, { withFileTypes: true })) {
  const m = /^c(\d\d)-/.exec(dir.name);
  if (!dir.isDirectory() || !m) continue;
  const book = BOOKS.find((b) => b.num === Number(m[1]));
  if (!book) {
    layoutErrors.push(`${dir.name}: 장 목록(src/content/index.ts)에 없는 장 폴더`);
    continue;
  }
  const ids = new Set(book.nodes.map((n) => n.id));
  const files = readdirSync(join(contentDir, dir.name)).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => f.replace(/\.ts$/, ''));
  for (const f of files) if (!ids.has(f)) layoutErrors.push(`${dir.name}/${f}.ts: ${dir.name}/index.ts의 nodes 목록에 없는 노드 파일(또는 파일 이름이 노드 id와 다름)`);
  for (const id of ids) if (!files.includes(id)) layoutErrors.push(`${dir.name}: 노드 ${id}의 파일 이름이 id와 다르다(${id}.ts여야 한다)`);
}
for (const e of layoutErrors) console.log(`\x1b[31merror P028\x1b[0m ${e}`);
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
const rs = nodes.map(reviewState);
console.log(`저자 검토: 검토함 ${rs.filter((s) => s === 'reviewed').length} · 검토 뒤 바뀜 ${rs.filter((s) => s === 'changed').length} · 초안 ${rs.filter((s) => s === 'draft').length}`);
console.log(`error ${by.error} · warn ${by.warn} · info ${by.info}${showAll ? '' : ' (info는 --all로 표시)'}`);
if (layoutErrors.length) process.exit(1);
if (by.error) {
  console.log('\n규칙 설명:');
  for (const rule of new Set(r.issues.filter((i) => i.level === 'error').map((i) => i.rule))) console.log(`  ${rule}: ${RULES[rule].text}`);
  process.exit(1);
}
