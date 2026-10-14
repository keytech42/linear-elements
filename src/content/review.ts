// 노드별 검토 상태. 저자가 노드를 검토하고 나면 그때의 내용 지문(hash)을 reviews.json에 적어 둔다.
// 그 뒤 노드 내용이 바뀌면 지문이 달라지므로 "검토 뒤 바뀜"으로 돌아간다(검증기 P026).
//   기록: npm run review -- mark <노드id...>   취소: npm run review -- unmark <노드id...>   목록: npm run review
// 지문에 들어가는 것: 제목, 종류, 용어·기호, 선행 노드, 본문, 증명, 왜?, 점검, 관문, 코드 참조.
// 들어가지 않는 것: 장면 코드(src/scenes)와 렌더러. 장면을 고치면 그 노드를 손으로 다시 검토해야 한다.
import type { NodeDef } from "./schema";
import reviews from "./reviews.json";

export interface ReviewStamp {
  /** 검토한 때. 지역 시간대가 붙은 ISO 8601(예: 2026-10-07T17:42:10+09:00). 예전 기록은 날짜(YYYY-MM-DD)만 있다. */
  on: string;
  /** 검토할 때의 내용 지문. 수정 감지는 이 값으로 한다(시각은 감지에 쓰지 않는다). */
  hash: string;
  /** 검토할 때의 HEAD 커밋. "검토 이후 무엇이 바뀌었나"를 보여 줄 때 기준이 된다(npm run review -- diff). */
  commit?: string;
  /** 검토할 때 노드 파일에 커밋하지 않은 수정이 있었는가. 그러면 commit 기준 diff에 검토 전 수정도 섞인다. */
  dirty?: boolean;
}

export const REVIEWS: Record<string, ReviewStamp> = reviews as Record<
  string,
  ReviewStamp
>;

export type ReviewState = "draft" | "reviewed" | "changed";

/** 노드 내용의 지문. 브라우저와 CLI에서 같은 값이 나오도록 의존성 없이 계산한다(cyrb53). */
export function nodeHash(n: NodeDef): string {
  const s = JSON.stringify([
    n.title,
    n.kind,
    n.introduces,
    n.requires,
    n.body,
    n.proof,
    n.openWhys,
    n.checks,
    n.predicts,
    n.code,
  ]);
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** 지역 시간대가 붙은 ISO 8601. toISOString()은 UTC로 바꿔 버리므로 직접 만든다. */
export function isoLocal(d: Date): string {
  const p = (x: number) => String(Math.abs(x)).padStart(2, "0");
  const off = -d.getTimezoneOffset(); // 분. 서울이면 +540
  const sign = off >= 0 ? "+" : "-";
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}${sign}${p(Math.trunc(off / 60))}:${p(off % 60)}`;
}

/** 사람이 읽는 표기: "2026-10-07 17:42". 날짜만 있는 예전 기록은 그대로. */
export function stampLabel(r: ReviewStamp): string {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(r.on);
  return m ? `${m[1]} ${m[2]}` : r.on;
}

export function reviewState(n: NodeDef): ReviewState {
  const r = REVIEWS[n.id];
  if (!r) return "draft";
  return r.hash === nodeHash(n) ? "reviewed" : "changed";
}
