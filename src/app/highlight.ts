// 아주 작은 TypeScript 강조기: 주석, 문자열, 키워드, 숫자만 구분한다. (코드 패널 전용)
const KW = /\b(export|function|const|let|for|if|else|return|throw|new|type|interface|import|from|of|while|break|continue)\b/g;

export function highlightTs(src: string): string {
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
  const out: string[] = [];
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('[^'\n]*'|`[^`]*`)|([^/'`]+|\/)/g;
  for (const m of src.matchAll(re)) {
    if (m[1]) out.push(`<span class="hl-c">${esc(m[1])}</span>`);
    else if (m[2]) out.push(`<span class="hl-s">${esc(m[2])}</span>`);
    else out.push(esc(m[3]).replace(KW, '<span class="hl-k">$1</span>').replace(/\b(\d+(\.\d+)?(e-?\d+)?)\b/g, '<span class="hl-n">$1</span>'));
  }
  return out.join('');
}
