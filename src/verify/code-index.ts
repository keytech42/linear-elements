// src/la/*.ts 원문에서 export된 함수의 이름 → 파일, 그리고 함수 원문을 뽑는다.
// 앱의 "이 노드의 코드" 패널과 검증기(P017)가 같이 쓴다.

/** sources: { 'la/mat.ts': '원문', ... } → 함수 이름 → 파일 경로 */
export function indexExports(sources: Record<string, string>): Map<string, string> {
  const m = new Map<string, string>();
  for (const [file, src] of Object.entries(sources)) {
    for (const mt of src.matchAll(/^export function (\w+)/gm)) m.set(mt[1], file);
  }
  return m;
}

/** 함수 하나의 원문(바로 위의 주석 묶음 포함)을 잘라 낸다. 중괄호 짝을 세어 끝을 찾는다. */
export function extractFunction(src: string, name: string): string | null {
  const start = src.search(new RegExp(`^export function ${name}\\b`, 'm'));
  if (start < 0) return null;
  // 위쪽 주석 포함
  const before = src.slice(0, start).split('\n');
  before.pop();
  let k = before.length;
  while (k > 0 && /^\s*(\/\/|\/\*\*|\*|\*\/)/.test(before[k - 1])) k--;
  const head = before.slice(k).join('\n');
  const open = src.indexOf('{', src.indexOf(')', start));
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return (head ? head + '\n' : '') + src.slice(start, i + 1);
  }
  return null;
}
