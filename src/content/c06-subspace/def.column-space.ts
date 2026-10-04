import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.column-space',
  kind: 'def',
  title: '열공간: 출력이 닿을 수 있는 곳 전부',
  status: 'written',
  introduces: {
    terms: [{ id: 't.column-space', ko: '열공간', en: 'column space', gloss: '행렬의 열들이 스팬하는 부분공간. 곧 A𝐱가 될 수 있는 모든 벡터.' }],
    symbols: [{ tex: 'C(A)', meaning: '행렬 A의 열공간' }],
  },
  requires: ['def.subspace', 'def.matvec'],
  predicts: [
    {
      id: 'p-reach',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$일 때 $A\mathbf{x} = (3, 5)$를 만족하는 $\mathbf{x}$는?`,
      hints: [
        String.raw`출력 $A\mathbf{x}$는 언제나 두 열 $(1, 2)$, $(2, 4)$의 선형 결합이다. 두 열은 같은 직선 위에 있다. 그 직선은 무엇인가?`,
        String.raw`$(1, 2)$의 몇 배를 해도 둘째 성분은 첫째 성분의 2배다. $(3, 5)$는 그런가?`,
      ],
      choices: ['없다. (3, 5)는 출력이 닿을 수 있는 직선 밖에 있다', '하나 있다', '무수히 많다', '(1, 1)'],
      answer: 0,
      why: [
        String.raw`모든 출력은 $(1, 2)$ 방향의 직선 $y = 2x$ 위에 있다. $(3, 5)$는 $5 \ne 6$이라 그 위에 없다. 열공간 밖의 목표에는 닿을 수 없다.`,
        String.raw`두 열이 평면을 펼친다면 그랬을 것이다. 이 행렬은 평면을 직선으로 누른다.`,
        String.raw`목표가 직선 **위에** 있었다면(예: $(3, 6)$) 무수히 많았을 것이다.`,
        String.raw`$A(1, 1) = (3, 6)$이다. $(3, 5)$가 아니다.`,
      ],
    },
  ],
  body: String.raw`변환 $A$의 출력은 어디까지 닿을 수 있을까? 출력이 닿지 못하는 곳이 있다면, 그곳을 목표로 하는 [연립방정식](t:t.linear-system)은 풀리지 않는다.

**정의.** 행렬 $A$의 열들이 스팬하는 부분공간을 $A$의 [열공간](def:t.column-space)이라 하고 $C(A)$로 쓴다. [출력은 언제나 열들의 선형 결합](why:def.matvec)이고, 거꾸로 열들의 선형 결합은 모두 어떤 입력의 출력이므로, 열공간은 **$A$의 출력 전체**와 같다.

$$C(A) = \{A\mathbf{x} : \mathbf{x}\text{는 아무 입력}\}$$

그래서 다음이 바로 따라 나온다. **$A\mathbf{x} = \mathbf{b}$에 해가 있는 것은 $\mathbf{b}$가 열공간 안에 있는 것과 같다.**

::scene c6-space {"mode": "col"}

3차원 그림에서 단추로 열을 바꿔 보라(단추 이름의 "[랭크](fwd:t.rank)"는 다음 노드에서 정의한다). 열 세 개가 공간 전체를 펼칠 때, 한 평면 위에 있을 때, 한 직선 위에 있을 때 열공간(분홍)이 각각 공간, 평면, 직선이 된다.

::predict p-reach

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 열공간은 $(1, 2)$ 방향의 직선이다.
- $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$(3×2): 열공간은 $(1, 0, 1)$과 $(0, 1, 1)$이 펼치는 3차원 안의 평면이다. 출력은 3차원에 살지만 그 평면을 벗어나지 못한다.`,
  checks: [
    {
      q: String.raw`2×2 행렬 $A$의 $\det A \ne 0$이다. 열공간은?`,
      choices: ['평면 전체', '원점을 지나는 직선', '원점 하나', '행렬마다 다르다'],
      answer: 0,
      explain: String.raw`[행렬식이 0이 아니면 두 열은 독립](n:prop.det-zero)이고, 독립인 두 벡터는 평면 전체를 스팬한다. 그래서 모든 $\mathbf{b}$에 해가 있다.`,
    },
  ],
};

export default node;
