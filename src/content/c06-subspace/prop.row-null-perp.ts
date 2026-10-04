import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.row-null-perp',
  kind: 'prop',
  title: '행공간과 영공간은 직교한다',
  status: 'written',
  introduces: { terms: [{ id: 't.row-space', ko: '행공간', en: 'row space', gloss: '행렬의 행들이 스팬하는 부분공간. Aᵀ의 열공간. 입력 공간에 산다.' }] },
  requires: ['prop.row-picture', 'def.null-space', 'def.orthogonal'],
  predicts: [
    {
      id: 'p-perp',
      kind: 'choice',
      q: String.raw`2×3 행렬의 두 행이 $(1, 2, 2)$와 $(0, 1, -1)$이다. 영공간은?`,
      hints: [
        String.raw`$A\mathbf{x} = \mathbf{0}$을 [행의 관점](n:prop.row-picture)으로 읽으면 "두 행과의 내적이 모두 0"이다. $x_1 + 2x_2 + 2x_3 = 0$과 $x_2 - x_3 = 0$.`,
        String.raw`둘째 식에서 $x_2 = x_3 = t$로 두고 첫째 식에 넣어라.`,
      ],
      choices: [String.raw`$(-4, 1, 1)$ 방향의 직선`, String.raw`$(1, 2, 2)$ 방향의 직선`, String.raw`$(1, 3, 1)$ 방향(두 행의 합)`, '원점 하나'],
      answer: 0,
      why: [
        String.raw`$x_1 = -2t - 2t = -4t$이므로 $(-4, 1, 1)$의 배수. 확인: $(1, 2, 2)\cdot(-4, 1, 1) = 0$, $(0, 1, -1)\cdot(-4, 1, 1) = 0$. 두 행 **모두와** 수직인 방향이다.`,
        String.raw`그것은 행 자체다. 영공간은 행들과 **수직인** 방향이다.`,
        String.raw`두 행의 합은 행공간 안의 벡터다. 영공간과는 수직이다.`,
        String.raw`입력이 3차원이고 랭크가 2이므로, [영공간은 1차원](n:prop.rank-nullity)이다.`,
      ],
    },
  ],
  body: String.raw`[영공간](t:t.null-space)은 "$A\mathbf{x} = \mathbf{0}$인 입력"으로 정의했다. 이 식을 [행의 관점](why:prop.row-picture)으로 읽으면 무엇이 보일까?

**정의.** 행렬의 행들이 스팬하는 부분공간을 [행공간](def:t.row-space)이라 한다. 행은 입력과 내적하는 벡터이므로 행공간은 **입력 공간**에 산다. 행공간은 $A^{\mathsf{T}}$의 열공간이기도 하다.

**명제.** 행공간의 모든 벡터와 영공간의 모든 벡터는 서로 [직교](t:t.orthogonal)한다.

::scene c6-space {"mode": "row"}

하늘색이 행공간, 연두색이 영공간이다. 그림을 돌려 보면 둘이 서로 수직으로 만난다.

::predict p-perp

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 행공간은 $(1, 2)$ 방향, 영공간은 $(-2, 1)$ 방향. 내적 $-2 + 2 = 0$.
- 위 관문: 행공간은 $(1, 2, 2)$와 $(0, 1, -1)$이 펼치는 평면, 영공간은 그 평면에 수직인 직선 $(-4, 1, 1)$.`,
  proof: String.raw`$\mathbf{x}$가 영공간에 있다는 것은 $A\mathbf{x} = \mathbf{0}$, 곧 [모든 성분이 0](why:prop.row-picture)이라는 것이다: 모든 $i$에 대해 ($i$번째 행)$\cdot\mathbf{x} = 0$. 그러므로 $\mathbf{x}$는 행 하나하나와 직교한다. 행공간의 아무 벡터 $\mathbf{r} = c_1(\text{1행}) + c_2(\text{2행}) + \cdots$와의 내적은 [내적이 덧셈 위로 나뉘므로](why:def.dot) $c_1\cdot0 + c_2\cdot0 + \cdots = 0$이다.`,
};

export default node;
