// 노드별 검토 기록. 저자가 노드를 검토하고 나면 그때의 내용 지문을 src/content/reviews.json에 적는다.
//   npm run review                      검토 상태 목록(검토함 / 검토 뒤 바뀜 / 초안)
//   npm run review -- mark <id...>      지금 내용으로 검토했다고 기록 (권 전체: b0, b1 …)
//   npm run review -- unmark <id...>    기록을 지운다
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS, NODE_BY_ID } from '../src/content/index';
import { nodeHash, reviewState, type ReviewStamp } from '../src/content/review';

const file = join(dirname(fileURLToPath(import.meta.url)), '../src/content/reviews.json');
const reviews: Record<string, ReviewStamp> = JSON.parse(readFileSync(file, 'utf8'));
const [cmd, ...args] = process.argv.slice(2);
// 권 id(b0 …)를 주면 그 권의 노드 전부
const ids = args.flatMap((a) => BOOKS.find((b) => b.id === a)?.nodes.map((n) => n.id) ?? [a]);
const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

if (cmd === 'mark' || cmd === 'unmark') {
  for (const id of ids) {
    const n = NODE_BY_ID.get(id);
    if (!n) {
      console.error(`없는 노드: ${id}`);
      process.exit(1);
    }
    if (cmd === 'mark') reviews[id] = { on: today, hash: nodeHash(n) };
    else delete reviews[id];
    console.log(`${cmd === 'mark' ? '검토함' : '기록 지움'}  ${id}  ${n.title}`);
  }
  // 교재 순서대로 적어 두면 diff가 읽기 쉽다
  const ordered = Object.fromEntries(BOOKS.flatMap((b) => b.nodes).filter((n) => reviews[n.id]).map((n) => [n.id, reviews[n.id]]));
  writeFileSync(file, JSON.stringify(ordered, null, 2) + '\n');
} else {
  const mark = { reviewed: '✓', changed: '△', draft: '·' } as const;
  let count = { reviewed: 0, changed: 0, draft: 0 };
  for (const b of BOOKS) {
    console.log(`\n${b.num}권 ${b.title}`);
    for (const n of b.nodes) {
      const s = reviewState(n);
      count[s]++;
      console.log(`  ${mark[s]} ${n.id.padEnd(30)} ${n.title}${s !== 'draft' ? `  (${reviews[n.id].on})` : ''}`);
    }
  }
  console.log(`\n✓ 검토함 ${count.reviewed} · △ 검토 뒤 바뀜 ${count.changed} · 초안 ${count.draft}`);
}
