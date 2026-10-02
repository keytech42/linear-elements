// 앱 전체가 공유하는 데이터: 콘텐츠, 검증 결과(파싱된 본문과 의존 그래프), 코드 원문, 장면 목록.
// 검증기는 CLI와 같은 코드를 브라우저에서도 한 번 돌린다. 그 결과가 곧 앱의 "지도"다.
import { BOOKS, ALL_NODES, NODE_BY_ID, BOOK_OF } from '../content/index';
import { verify, type Edge } from '../verify/verify';
import { indexExports, extractFunction } from '../verify/code-index';
import type { SceneFn } from '../scenes/_lib/scene';

const rawLa = import.meta.glob('../la/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const LA_SOURCES: Record<string, string> = {};
for (const [path, src] of Object.entries(rawLa)) {
  if (path.endsWith('.test.ts')) continue;
  LA_SOURCES[path.replace('../', '')] = src;
}
export const CODE_INDEX = indexExports(LA_SOURCES);
export function codeOf(fn: string): { file: string; src: string } | null {
  const file = CODE_INDEX.get(fn);
  if (!file) return null;
  const src = extractFunction(LA_SOURCES[file], fn);
  return src ? { file: `src/${file}`, src } : null;
}

const sceneMods = import.meta.glob(['../scenes/*.ts'], { import: 'default' }) as Record<string, () => Promise<SceneFn>>;
export const SCENES = new Map<string, () => Promise<SceneFn>>();
for (const [path, load] of Object.entries(sceneMods)) SCENES.set(path.replace('../scenes/', '').replace(/\.ts$/, ''), load);

export const V = verify(BOOKS, new Set(SCENES.keys()), CODE_INDEX);
export { BOOKS, ALL_NODES, NODE_BY_ID, BOOK_OF };

/** 이 노드가 기대는 노드들(앞쪽) */
export function prereqs(id: string): Edge[] {
  return V.edges.filter((e) => e.from === id);
}
/** 이 노드에 기대는 노드들(뒤쪽) */
export function dependents(id: string): Edge[] {
  return V.edges.filter((e) => e.to === id);
}
/** 거슬러 오르기: 이 노드가 (직간접으로) 기대는 모든 노드, 교재 순서대로 */
export function ancestors(id: string): string[] {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const n = stack.pop()!;
    for (const e of V.edges) if (e.from === n && !seen.has(e.to)) {
      seen.add(e.to);
      stack.push(e.to);
    }
  }
  return [...seen].sort((a, b) => V.order.get(a)! - V.order.get(b)!);
}
export function descendants(id: string): string[] {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const n = stack.pop()!;
    for (const e of V.edges) if (e.to === n && !seen.has(e.from)) {
      seen.add(e.from);
      stack.push(e.from);
    }
  }
  return [...seen].sort((a, b) => V.order.get(a)! - V.order.get(b)!);
}
