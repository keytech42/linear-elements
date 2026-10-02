// 콘텐츠 스키마. 이 앱의 진짜 핵심은 렌더러가 아니라 이 구조다.
// 모든 노드는 데이터이고, 검증기(src/verify)가 이 데이터만 읽고 "정의 전 사용"과 "앞쪽을 가리키는 왜?"를 잡아낸다.

/**
 * 노드 종류 (유클리드 『원론』의 구성을 따른다)
 *  ax   약속(공리): 증명 없이 받아들이는 출발점. 산수의 규칙, 넓이의 규칙.
 *  def  정의: 이름을 붙인다. 참/거짓이 없다.
 *  prop 명제: 앞의 약속과 정의만으로 증명되는 사실.
 *  exp  탐구: 손으로 만지며 다음 정의/명제를 예감하게 하는 장면.
 */
export type Kind = 'ax' | 'def' | 'prop' | 'exp';

export const KIND_LABEL: Record<Kind, string> = {
  ax: '약속',
  def: '정의',
  prop: '명제',
  exp: '탐구',
};

export interface TermDecl {
  /** 용어 id. 본문에서 [표면형](t:id) 로 참조한다. */
  id: string;
  /** 대표 한국어 표기 */
  ko: string;
  /** 영어 표준 용어 */
  en?: string;
  /** 원문 어휘 스캔(P008)에 쓸 표면형들. 대표 표기는 자동으로 포함된다. */
  surfaces?: string[];
  /** 일상어와 겹치는 용어(예: 공간, 차원). P008 스캔에서 제외한다. */
  everyday?: boolean;
  /** 용어 팝오버에 띄울 한 줄 정의 */
  gloss: string;
}

export interface SymbolDecl {
  /** KaTeX 표기 */
  tex: string;
  /** 무엇을 가리키는가 */
  meaning: string;
  /** 같은 글자를 다른 뜻으로 쓰지 않도록 예약해 둔 경우 그 이유 */
  note?: string;
}

export interface Check {
  /** 질문 (인라인 마크업) */
  q: string;
  choices: string[];
  answer: number;
  /** 정답 해설 (블록 마크업) */
  explain: string;
}

/**
 * 예측 관문. 본문의 `::predict id` 자리에 놓이고, 학습자가 예측을 확정해야 그 뒤의 본문이 열린다.
 *  choice: 보기 중 하나를 고른다. why[k]는 k번째 보기를 고른 사람에게 보여 줄 말(오해를 짚는다).
 *  point:  평면 위에 끌어 놓는다. 정답은 src/la 로 계산한다.
 *          target 'Ax'  = A𝐱가 도착할 점,  'eig' = A의 고유 방향(직선),  'v1' = 가장 많이 늘어나는 입력 방향(직선)
 * hints: 어려운 관문에 붙이는 단계별 힌트(최대 3개). 학습자가 하나씩 열어 본다. 답을 직접 말하면 안 된다.
 */
export type Predict =
  | { id: string; kind: 'choice'; q: string; choices: string[]; answer: number; why?: (string | null)[]; reveal?: string; hints?: string[] }
  | {
      id: string;
      kind: 'point';
      q: string;
      A: number[][];
      x?: number[];
      target: 'Ax' | 'eig' | 'v1';
      /** 무엇을 미리 그려 줄지: cols(A의 두 열), x(입력), tgrid(변환된 격자), circle(단위원) */
      show?: ('cols' | 'x' | 'tgrid' | 'circle')[];
      /** cols를 보일 때 두 열의 이름표 (기본 ['Ae₁', 'Ae₂']). 행렬을 배우기 전의 노드에서는 ['u', 'w'] 등으로 바꾼다 */
      colLabels?: [string, string];
      /** 맞았다고 볼 오차: Ax는 단위 길이(기본 0.3), 방향은 도(기본 8) */
      tol?: number;
      reveal?: string;
      hints?: string[];
    };

export interface NodeDef {
  id: string;
  kind: Kind;
  title: string;
  /** written: 본문 완성 / stub: 계획만 있음(본문 = 이 노드가 답할 질문 목록) */
  status: 'written' | 'stub';
  introduces?: { terms?: TermDecl[]; symbols?: SymbolDecl[] };
  /** 명시적 선행 노드. 본문 안의 링크/용어 참조에서 나오는 의존은 자동으로 더해진다. */
  requires?: string[];
  /** 블록 마크업 (문법은 markup.ts 맨 위 주석) */
  body: string;
  /** 명제의 증명 (블록 마크업) */
  proof?: string;
  /** 아직 답하지 못한 "왜?" 질문. answeredBy가 null이면 미해결(P007). */
  openWhys?: { q: string; answeredBy: string | null }[];
  checks?: Check[];
  /** 예측 관문들. 본문에 `::predict id` 로 놓는다. */
  predicts?: Predict[];
  /** 이 노드의 수학을 구현한 함수 이름(src/la/*.ts의 export). 앱에서 원문 그대로 보여 준다. */
  code?: string[];
}

export interface Book {
  id: string;
  /** 권 번호 (0부터) */
  num: number;
  title: string;
  subtitle: string;
  nodes: NodeDef[];
}
