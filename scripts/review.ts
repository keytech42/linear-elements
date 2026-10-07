// 노드별 검토 기록. 저자가 노드를 검토하고 나면 그때의 내용 지문을 src/content/reviews.json에 적는다.
//   npm run review                      검토 상태 목록(검토함 / 검토 뒤 바뀜 / 초안)
//   npm run review -- mark <id...>      지금 내용으로 검토했다고 기록 (장 전체: c0, c1 …)
//   npm run review -- unmark <id...>    기록을 지운다
//   npm run review -- diff <id...>      검토한 뒤 노드 파일에서 바뀐 부분 (검토할 때의 커밋 기준)
// 기록에 남는 것: 검토한 때(시간대가 붙은 시각), 내용 지문, 그때의 HEAD 커밋, 노드 파일에 커밋하지 않은 수정이 있었는지.
// 수정 감지는 지문으로 한다. 시각과 커밋은 "언제부터, 무엇이 바뀌었나"를 보여 주는 데만 쓴다.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { BOOKS, NODE_BY_ID } from '../src/content/index';
import { nodeHash, reviewState, isoLocal, stampLabel, type ReviewStamp } from '../src/content/review';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src/content/reviews.json');
const reviews: Record<string, ReviewStamp> = JSON.parse(readFileSync(file, 'utf8'));
const [cmd, ...args] = process.argv.slice(2);
// 장 id(c0 …)를 주면 그 장의 노드 전부
const ids = args.flatMap((a) => BOOKS.find((b) => b.id === a)?.nodes.map((n) => n.id) ?? [a]);

const git = (...a: string[]) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();

/** 노드 파일의 저장소 기준 경로: src/content/cNN-…/<id>.ts */
function nodeFile(id: string): string | null {
  const dir = join(root, 'src/content');
  for (const d of readdirSync(dir)) {
    if (!/^c\d\d-/.test(d)) continue;
    const f = join(dir, d, `${id}.ts`);
    if (existsSync(f)) return relative(root, f);
  }
  return null;
}

function need(id: string) {
  const n = NODE_BY_ID.get(id);
  if (!n) {
    console.error(`없는 노드: ${id}`);
    process.exit(1);
  }
  return n;
}

if (cmd === 'mark' || cmd === 'unmark') {
  const head = cmd === 'mark' ? git('rev-parse', '--short=12', 'HEAD') : '';
  const now = isoLocal(new Date());
  for (const id of ids) {
    const n = need(id);
    if (cmd === 'mark') {
      const f = nodeFile(id);
      const dirty = !!f && git('status', '--porcelain', '--', f) !== '';
      reviews[id] = { on: now, hash: nodeHash(n), commit: head, ...(dirty ? { dirty: true } : {}) };
      console.log(`검토함  ${id}  ${n.title}`);
      if (dirty)
        console.log(`  ⚠ ${f}에 커밋하지 않은 수정이 있는 채로 기록했습니다. 나중에 diff를 보면 이 수정도 "검토 뒤 바뀐 것"처럼 섞여 나옵니다. 커밋한 뒤 다시 mark하면 정확합니다.`);
    } else {
      delete reviews[id];
      console.log(`기록 지움  ${id}  ${n.title}`);
    }
  }
  // 교재 순서대로 적어 두면 diff가 읽기 쉽다
  const ordered = Object.fromEntries(BOOKS.flatMap((b) => b.nodes).filter((n) => reviews[n.id]).map((n) => [n.id, reviews[n.id]]));
  writeFileSync(file, JSON.stringify(ordered, null, 2) + '\n');
} else if (cmd === 'diff') {
  const label = { reviewed: '검토함, 바뀐 것 없음', changed: '검토 뒤 바뀜', draft: '초안' } as const;
  for (const id of ids) {
    const n = need(id);
    const r = reviews[id];
    const f = nodeFile(id);
    console.log(`\n=== ${id}  ${n.title}  (${label[reviewState(n)]})`);
    if (!r) continue;
    if (!r.commit || !f) {
      console.log(`  검토 기록에 커밋이 없습니다(${stampLabel(r)}에 기록). 대신: git log --since="${r.on}" -p -- ${f ?? '<노드 파일>'}`);
      continue;
    }
    console.log(`  기준: ${stampLabel(r)}에 검토할 때의 커밋 ${r.commit}${r.dirty ? ' (그때 커밋하지 않은 수정이 있었으므로, 아래에는 검토 전 수정도 섞여 있다)' : ''}`);
    // 기준 커밋부터 지금 작업 트리까지. 커밋하지 않은 수정도 들어간다.
    const out = git('diff', r.commit, '--', f);
    console.log(out || '  (노드 파일에는 바뀐 것이 없다. 지문이 다르다면 파일이 옮겨졌을 수 있다)');
  }
} else {
  const mark = { reviewed: '✓', changed: '△', draft: '·' } as const;
  const count = { reviewed: 0, changed: 0, draft: 0 };
  const changed: string[] = [];
  for (const b of BOOKS) {
    console.log(`\n${b.num}장 ${b.title}`);
    for (const n of b.nodes) {
      const s = reviewState(n);
      count[s]++;
      if (s === 'changed') changed.push(n.id);
      console.log(`  ${mark[s]} ${n.id.padEnd(30)} ${n.title}${s !== 'draft' ? `  (${stampLabel(reviews[n.id])})` : ''}`);
    }
  }
  console.log(`\n✓ 검토함 ${count.reviewed} · △ 검토 뒤 바뀜 ${count.changed} · 초안 ${count.draft}`);
  if (changed.length) console.log(`바뀐 부분 보기: npm run review -- diff ${changed.join(' ')}`);
}
