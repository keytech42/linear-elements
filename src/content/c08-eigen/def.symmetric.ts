import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.symmetric',
  kind: 'def',
  title: '대칭 행렬',
  status: 'written',
  introduces: {
    terms: [{ id: 't.symmetric', ko: '대칭 행렬', en: 'symmetric matrix', gloss: 'Sᵀ = S 인 행렬. 대각선을 거울로 삼아 성분이 대칭. 기하로는 (S𝐱)·𝐲 = 𝐱·(S𝐲).' }],
    symbols: [
      { tex: 'S', meaning: '대칭 행렬' },
      { tex: 's_{ij}', meaning: '대칭 행렬 S의 i행 j열 성분 (s_ij = s_ji)' },
    ],
  },
  requires: ['def.transpose'],
  predicts: [
    {
      id: 'p-sym',
      kind: 'choice',
      q: String.raw`행렬 $M$에 대해, 모든 $\mathbf{x}, \mathbf{y}$에서 $(M\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(M\mathbf{y})$가 성립하려면 $M$은 어떤 행렬이어야 할까?`,
      choices: [String.raw`$M^{\mathsf{T}} = M$인 행렬`, '회전 행렬', '행렬식이 1인 행렬', '대각 행렬만'],
      answer: 0,
      why: [
        String.raw`[전치의 정체](n:prop.transpose-dot)에 따라 $(M\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(M^{\mathsf{T}}\mathbf{y})$이므로, $M^{\mathsf{T}} = M$이면 바로 성립한다.`,
        String.raw`회전 $R$에서는 $(R\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(R^{\mathsf{T}}\mathbf{y})$이고 $R^{\mathsf{T}}$는 **반대 방향**의 회전이다. 같은 회전을 양쪽에 걸면 같은 값이 나오지 않는다.`,
        String.raw`넓이 배율은 이 등식과 관계가 없다.`,
        String.raw`대각 행렬은 이 등식을 만족하지만, 만족하는 행렬이 대각 행렬뿐인 것은 아니다. 예: $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.`,
      ],
    },
  ],
  body: String.raw`행렬의 성분이 대각선을 거울로 삼아 대칭이라는 것은 "숫자 배치"의 성질이다. 이 배치는 기하적으로 무엇을 뜻할까?

**정의.** [전치](t:t.transpose)해도 자기 자신인 행렬, 곧 $S^{\mathsf{T}} = S$인 행렬을 [대칭 행렬](def:t.symmetric)이라 한다. 성분으로는 $s_{ij} = s_{ji}$다. 2×2에서는 $s_{12} = s_{21}$이라는 조건 하나다.

예: $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$, $\begin{bmatrix} 1 & 2 \\ 2 & -2 \end{bmatrix}$, 그리고 모든 대각 행렬은 대칭이다. $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$과 회전 행렬(각이 0°, 180°가 아닐 때)은 대칭이 아니다.

::predict p-sym

### 기하적인 뜻: 어느 쪽에 걸어도 같다
[전치의 정체](why:prop.transpose-dot) $(A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$에서 $A$가 대칭이면 $A^{\mathsf{T}} = A$이므로

$$(S\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(S\mathbf{y})$$

이다. "$\mathbf{x}$를 보낸 뒤 $\mathbf{y}$와 [내적](t:t.dot)한 값"과 "$\mathbf{y}$를 보낸 뒤 $\mathbf{x}$와 내적한 값"이 언제나 같다. 변환을 두 벡터 중 어느 쪽에 걸어도 둘의 관계는 같다는 뜻이다.

거꾸로 이 등식이 모든 $\mathbf{x}, \mathbf{y}$에서 성립하면 행렬은 대칭이다. $\mathbf{x} = \mathbf{e}_j$, $\mathbf{y} = \mathbf{e}_i$를 넣으면 왼쪽은 $(S\mathbf{e}_j)\cdot\mathbf{e}_i = s_{ij}$, 오른쪽은 $\mathbf{e}_j\cdot(S\mathbf{e}_i) = s_{ji}$이기 때문이다. 그러므로 숫자 배치의 성질과 기하적 성질은 정확히 같은 것이다.

::scene c8-symmetric {}

그림에서 두 벡터를 끌어도 아래 두 값이 언제나 같다. "대칭 고정"을 끄고 $s_{21}$만 바꾸면 두 값이 갈라진다. 다음 노드에서 이 등식 한 줄이 대칭 행렬의 고유벡터를 서로 수직으로 만든다.`,
  checks: [
    {
      q: '다음 가운데 대칭 행렬이 아닌 것은?',
      choices: [String.raw`$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 5 & 0 \\ 0 & -2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 3 \\ 3 & 1 \end{bmatrix}$`],
      answer: 0,
      explain: String.raw`첫째 행렬은 90° 회전이고 $s_{12} = -1 \ne s_{21} = 1$이다. 둘째는 대각선 $y = x$를 거울로 삼는 반사, 셋째는 축 방향 늘이기(와 뒤집기), 넷째는 $(1, 1)$ 방향을 4배 늘이고 $(1, -1)$ 방향을 뒤집으며 2배 늘이는 변환으로, 모두 대칭이다. 반사는 대칭이고 회전은 대칭이 아니라는 점을 기억해 두라.`,
    },
  ],
};

export default node;
