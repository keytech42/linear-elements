import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.shape',
  kind: 'def',
  title: '모양 m×n: 몇 차원에서 몇 차원으로',
  status: 'written',
  introduces: {
    terms: [{ id: 't.shape', ko: '모양', en: 'shape', everyday: true, gloss: '행렬의 행 개수 × 열 개수. m×n 행렬은 ℝⁿ의 벡터를 받아 ℝᵐ의 벡터를 내놓는다.' }],
    symbols: [
      { tex: 'm', meaning: '행렬의 행 개수 = 출력 차원' },
      { tex: 'n', meaning: '행렬의 열 개수 = 입력 차원' },
    ],
  },
  requires: ['def.matvec', 'def.dimension'],
  predicts: [
    {
      id: 'p-io',
      kind: 'choice',
      q: '행이 3개, 열이 2개인 행렬은 무엇을 받아 무엇을 내놓을까?',
      hints: [String.raw`[열 하나는 입력 기저 벡터 하나의 도착지다](n:def.matrix). 열이 몇 개이면 입력 기저 벡터가 몇 개인가? 그리고 열 하나(도착지 벡터)에는 성분이 몇 개 있는가?`],
      choices: ['성분 2개짜리 벡터를 받아 3개짜리를 내놓는다', '성분 3개짜리를 받아 2개짜리를 내놓는다', '3개짜리를 받아 3개짜리를 내놓는다', '2개짜리를 받아 2개짜리를 내놓는다'],
      answer: 0,
      why: [
        String.raw`열이 2개 = 입력 기저 벡터 2개 = 입력 성분 2개. 열 하나의 길이(행의 수) 3 = 출력 성분 3개.`,
        String.raw`가장 흔한 혼동이다. "3×2"를 왼쪽부터 "3에서 2로"라고 읽으면 틀린다. 앞의 수(행)가 **출력**, 뒤의 수(열)가 **입력**이다.`,
        String.raw`입력 성분의 수는 행렬-벡터 곱에서 열을 몇 개 섞는지, 곧 열의 수다.`,
        String.raw`출력은 열 벡터들의 선형 결합이므로 열의 길이(3)만큼 성분을 가진다.`,
      ],
    },
    {
      id: 'p-fill',
      kind: 'choice',
      q: '3×2 행렬의 출력들은 3차원 공간 전체를 채울 수 있을까?',
      hints: [String.raw`모든 출력은 두 열의 [선형 결합](n:def.linear-combination)이다. 벡터 두 개의 [스팬](n:def.span)은 가장 커 봐야 무엇인가?`],
      choices: ['없다. 가장 커 봐야 원점을 지나는 평면 하나다', '있다. 출력이 3차원 벡터이므로', '열을 잘 고르면 있다', '없다. 언제나 직선 하나다'],
      answer: 0,
      why: [
        String.raw`출력은 모두 두 열의 선형 결합이고, 두 벡터가 스팬하는 것은 평면(두 열이 독립일 때) 이하다.`,
        String.raw`출력이 3차원 공간에 **산다**는 것과 3차원 공간을 **채운다**는 것은 다르다.`,
        String.raw`열이 두 개뿐이라 어떻게 골라도 평면을 넘지 못한다.`,
        String.raw`두 열이 독립이면 평면이다. 직선이 되는 것은 두 열이 같은 직선 위에 있을 때다.`,
      ],
    },
  ],
  body: String.raw`지금까지는 평면에서 평면으로 가는 2×2 행렬만 보았다. 그런데 행렬의 정의, "기저의 도착지를 열로 나란히"는 차원이 달라도 그대로 쓸 수 있다.

**정의.** 행이 $m$개, 열이 $n$개인 행렬의 [모양](def:t.shape)을 $m \times n$이라 쓴다. $m \times n$ 행렬은 $\mathbb{R}^n$의 벡터를 받아 $\mathbb{R}^m$의 벡터를 내놓는다.

::predict p-io

### 축의 뜻을 하나씩
- **열의 수 $n$ = 입력 차원.** 입력 공간 $\mathbb{R}^n$의 표준 기저 $\mathbf{e}_1, \dots, \mathbf{e}_n$마다 도착지가 하나씩 필요하고, 도착지 하나가 열 하나다.
- **행의 수 $m$ = 출력 차원.** 열 하나(도착지 하나)는 출력 공간의 벡터이므로 성분이 $m$개다.
- 성분 $a_{ij}$의 **뒤 첨자 $j$는 입력 축**(몇 번째 입력 성분이 보탠 것인가), **앞 첨자 $i$는 출력 축**(출력의 몇 번째 성분인가)을 가리킨다.

이 규약은 신경망의 가중치에도 그대로 쓰인다. 10장에서 다시 만난다.

### 두 모양을 3차원으로 보기
아래 왼쪽은 입력, 오른쪽은 출력이다. 3차원 그림은 끌어서 돌려 볼 수 있다.

::scene c2-shape3 {"mode": "3x2"}

3×2 행렬은 평면의 격자를 3차원 공간 안의 기울어진 평면으로 보낸다.

::predict p-fill

::scene c2-shape3 {"mode": "2x3"}

2×3 행렬은 3차원의 단위 정육면체를 평면 위로 납작하게 누른다. 열이 세 개이므로 평면 위에 화살표가 셋 생긴다. 평면 위의 화살표 셋은 [선형 독립](t:t.lin-indep)일 수 없으므로, 3차원의 어떤 방향은 반드시 원점으로 사라진다.

### 두 개의 예
- $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0.8 & 0.5 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \end{bmatrix} = 1\begin{bmatrix} 1 \\ 0 \\ 0.8 \end{bmatrix} + 2\begin{bmatrix} 0 \\ 1 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 1.8 \end{bmatrix}$ (3×2: 성분 2개 → 3개)
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} = 1\begin{bmatrix} 1 \\ 0 \end{bmatrix} + 2\begin{bmatrix} 0 \\ 1 \end{bmatrix} + 3\begin{bmatrix} 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 7 \\ -1 \end{bmatrix}$ (2×3: 성분 3개 → 2개)`,
  code: ['shape'],
};

export default node;
