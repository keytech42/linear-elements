// 본문 수식에서 쓰는 KaTeX 매크로. 색은 src/render/colors.ts 와 같은 값(색도 기호다).
//   \ca{…} 주황 = 1열/e₁    \cb{…} 청록 = 2열/e₂    \cc{…} 보라 = 3열/e₃
//   \cx{…} 노랑 = 입력 x    \cy{…} 분홍 = 출력 Ax
//   \cu{…} 하늘 = 벡터 u    \cv{…} 연두 = 벡터 v    \cw{…} 라일락 = 벡터 w
//   \h{키}{…}  동기화 고리 (markup.ts 의 expandSyncMacros 가 \htmlData 로 바꾼다)
import { C } from '../render/colors';

// 매크로 정의 안에서 '#'은 인자 자리(#1)를 뜻하므로, 색의 '#'은 '##'로 적어야 글자 그대로 남는다.
const hex = (c: string) => c.replace('#', '##');

export const KATEX_MACROS: Record<string, string> = {
  '\\ca': `\\textcolor{${hex(C.c1)}}{#1}`,
  '\\cb': `\\textcolor{${hex(C.c2)}}{#1}`,
  '\\cc': `\\textcolor{${hex(C.c3)}}{#1}`,
  '\\cx': `\\textcolor{${hex(C.x)}}{#1}`,
  '\\cy': `\\textcolor{${hex(C.y)}}{#1}`,
  '\\cu': `\\textcolor{${hex(C.u)}}{#1}`,
  '\\cv': `\\textcolor{${hex(C.v)}}{#1}`,
  '\\cw': `\\textcolor{${hex(C.w)}}{#1}`,
  '\\R': '\\mathbb{R}',
  '\\T': '^{\\mathsf{T}}',
};
