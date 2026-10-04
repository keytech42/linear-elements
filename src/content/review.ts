// 노드별 검토 상태. 저자가 노드를 검토하고 나면 그때의 내용 지문(hash)을 reviews.json에 적어 둔다.
// 그 뒤 노드 내용이 바뀌면 지문이 달라지므로 "검토 뒤 바뀜"으로 돌아간다(검증기 P026).
//   기록: npm run review -- mark <노드id...>   취소: npm run review -- unmark <노드id...>   목록: npm run review
// 지문에 들어가는 것: 제목, 종류, 용어·기호, 선행 노드, 본문, 증명, 왜?, 점검, 관문, 코드 참조.
// 들어가지 않는 것: 장면 코드(src/scenes)와 렌더러. 장면을 고치면 그 노드를 손으로 다시 검토해야 한다.
import type { NodeDef } from './schema';
import reviews from './reviews.json';

export interface ReviewStamp {
  /** 검토한 날(YYYY-MM-DD) */
  on: string;
  /** 검토할 때의 내용 지문 */
  hash: string;
}

export const REVIEWS: Record<string, ReviewStamp> = reviews as Record<string, ReviewStamp>;

export type ReviewState = 'draft' | 'reviewed' | 'changed';

/** 노드 내용의 지문. 브라우저와 CLI에서 같은 값이 나오도록 의존성 없이 계산한다(cyrb53). */
export function nodeHash(n: NodeDef): string {
  const s = JSON.stringify([n.title, n.kind, n.introduces, n.requires, n.body, n.proof, n.openWhys, n.checks, n.predicts, n.code]);
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function reviewState(n: NodeDef): ReviewState {
  const r = REVIEWS[n.id];
  if (!r) return 'draft';
  return r.hash === nodeHash(n) ? 'reviewed' : 'changed';
}
