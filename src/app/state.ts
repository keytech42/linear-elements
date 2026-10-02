// 학습자 상태: 이해했다고 표시한 노드, 점검 문제 결과, "왜?"를 따라간 길(돌아가기 스택).
// 모두 이 브라우저의 localStorage/sessionStorage 에만 저장된다.

const KEY = 'le.v1';

export interface PredictRecord {
  /** 고른 보기 번호, 또는 끌어 놓은 점 */
  v: number | number[] | null;
  /** 맞았는가 (건너뛰었으면 null) */
  ok: boolean | null;
  skipped: boolean;
  /** 예측하기 전에 열어 본 힌트의 수 */
  hints?: number;
}

interface Saved {
  done: string[];
  predicts: Record<string, Record<string, PredictRecord>>;
  checks: Record<string, boolean[]>; // 노드 id → 문제별 정답 여부
  dojo: Record<string, { tries: number; best: number; streak: number }>;
}

function load(): Saved {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '');
    return { done: s.done ?? [], checks: s.checks ?? {}, dojo: s.dojo ?? {}, predicts: s.predicts ?? {} };
  } catch {
    return { done: [], checks: {}, dojo: {}, predicts: {} };
  }
}

const saved = load();
const done = new Set(saved.done);
const subs = new Set<() => void>();
const persist = () => {
  localStorage.setItem(KEY, JSON.stringify({ done: [...done], checks: saved.checks, dojo: saved.dojo, predicts: saved.predicts }));
  subs.forEach((f) => f());
};

export const progress = {
  isDone: (id: string) => done.has(id),
  setDone(id: string, v: boolean) {
    if (v) done.add(id);
    else done.delete(id);
    persist();
  },
  count: () => done.size,
  check(node: string, i: number, ok: boolean) {
    (saved.checks[node] ??= [])[i] = ok;
    persist();
  },
  checkResult: (node: string, i: number): boolean | undefined => saved.checks[node]?.[i],
  predict: (node: string, id: string): PredictRecord | undefined => saved.predicts[node]?.[id],
  setPredict(node: string, id: string, r: PredictRecord) {
    (saved.predicts[node] ??= {})[id] = r;
    persist();
  },
  clearPredict(node: string, id: string) {
    if (saved.predicts[node]) delete saved.predicts[node][id];
    persist();
  },
  clearPredicts(node: string) {
    delete saved.predicts[node];
    persist();
  },
  dojo: (k: string) => (saved.dojo[k] ??= { tries: 0, best: 0, streak: 0 }),
  saveDojo: () => persist(),
  on(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
  reset() {
    done.clear();
    saved.checks = {};
    saved.dojo = {};
    saved.predicts = {};
    persist();
  },
};

// ── "왜?"를 따라간 길 ─────────────────────────────────────────
// 왜? 칩을 누르면 지금 노드와 스크롤 위치를 쌓아 두고, "돌아가기"로 정확히 그 자리로 돌아온다.
const TRAIL = 'le.trail';
export interface TrailStep {
  node: string;
  scroll: number;
  q: string;
}
export const trail = {
  get(): TrailStep[] {
    try {
      return JSON.parse(sessionStorage.getItem(TRAIL) ?? '[]');
    } catch {
      return [];
    }
  },
  push(s: TrailStep) {
    const t = trail.get();
    t.push(s);
    sessionStorage.setItem(TRAIL, JSON.stringify(t.slice(-30)));
  },
  pop(): TrailStep | undefined {
    const t = trail.get();
    const s = t.pop();
    sessionStorage.setItem(TRAIL, JSON.stringify(t));
    return s;
  },
  clear() {
    sessionStorage.removeItem(TRAIL);
  },
};
