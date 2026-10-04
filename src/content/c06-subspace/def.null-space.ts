import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.null-space',
  kind: 'def',
  title: '영공간: 0으로 사라지는 입력들',
  status: 'written',
  introduces: {
    terms: [{ id: 't.null-space', ko: '영공간', en: 'null space', gloss: 'A𝐱 = 𝟎 이 되는 입력 𝐱 전체. 변환이 지워 버리는 방향들.' }],
    symbols: [{ tex: 'N(A)', meaning: '행렬 A의 영공간' }],
  },
  requires: ['def.subspace', 'def.matvec'],
  predicts: [
    {
      id: 'p-null',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$이 원점으로 보내는 입력들은 어떤 모양을 이룰까?`,
      hints: [String.raw`$A\mathbf{x} = \mathbf{0}$은 $x_1 + 2x_2 = 0$과 $2x_1 + 4x_2 = 0$이다. 둘째 식은 첫째 식의 2배다. $x_1 + 2x_2 = 0$을 만족하는 점들은?`],
      choices: [String.raw`원점을 지나는 $(-2, 1)$ 방향의 직선`, '원점 하나', String.raw`$(1, 2)$ 방향의 직선`, '평면 전체'],
      answer: 0,
      why: [
        String.raw`$x_1 = -2x_2$이므로 $(-2, 1)$의 배수들이다. 이 직선이 통째로 원점으로 사라진다.`,
        String.raw`원점만 0으로 가는 것은 행렬식이 0이 아닐 때다. 이 행렬은 평면을 눌러 버린다.`,
        String.raw`$(1, 2)$ 방향은 열공간(출력 쪽)이다. 영공간은 입력 쪽의 방향이다.`,
        String.raw`$A(1, 0) = (1, 2) \ne \mathbf{0}$이다.`,
      ],
    },
    {
      id: 'p-all',
      kind: 'choice',
      q: String.raw`$A\mathbf{x} = \mathbf{b}$의 해 하나 $\mathbf{x}_0$을 찾았다. 그렇다면 해들은 모두 어떤 꼴일까?`,
      hints: [String.raw`다른 해 $\mathbf{x}$가 있다면 $A(\mathbf{x} - \mathbf{x}_0) = A\mathbf{x} - A\mathbf{x}_0 = ?$`],
      choices: [String.raw`$\mathbf{x}_0 + (\text{영공간의 벡터})$`, String.raw`$\mathbf{x}_0$의 스칼라 배`, String.raw`$\mathbf{x}_0$ 하나뿐`, String.raw`$\mathbf{x}_0 + (\text{열공간의 벡터})$`],
      answer: 0,
      why: [
        String.raw`$A(\mathbf{x} - \mathbf{x}_0) = \mathbf{b} - \mathbf{b} = \mathbf{0}$이므로 차이는 영공간에 있다. 거꾸로 영공간의 벡터를 더해도 여전히 해다. 해 전체는 영공간을 $\mathbf{x}_0$만큼 옮긴 모양이다.`,
        String.raw`$2\mathbf{x}_0$을 넣으면 $2\mathbf{b}$가 된다. $\mathbf{b} \ne \mathbf{0}$이면 해가 아니다.`,
        String.raw`영공간이 원점뿐일 때만 그렇다.`,
        String.raw`열공간은 출력 쪽이다. 해(입력)에 더할 수 있는 것은 입력 쪽의 영공간이다. 거의 맞는 답이다.`,
      ],
    },
  ],
  body: String.raw`변환은 어떤 입력들을 흔적도 없이 지워 버릴까? 지워지는 입력이 많을수록 출력만 보고 입력을 되찾기 어렵다.

**정의.** $A\mathbf{x} = \mathbf{0}$인 입력 $\mathbf{x}$ 전체를 $A$의 [영공간](def:t.null-space)이라 하고 $N(A)$로 쓴다.

영공간은 언제나 부분공간이다. $A\mathbf{x} = \mathbf{0}$, $A\mathbf{y} = \mathbf{0}$이면 [선형이므로](why:def.linear-map) $A(\mathbf{x} + \mathbf{y}) = \mathbf{0}$, $A(c\mathbf{x}) = \mathbf{0}$이기 때문이다.

::scene c6-space {"mode": "null"}

연두색이 영공간이다. "▶ I에서 A로"를 누르면 연두 직선(또는 평면)이 원점으로 납작하게 사라진다.

::predict p-null

### 영공간이 원점뿐이면
영공간이 원점 하나뿐이면, 서로 다른 입력은 서로 다른 출력으로 간다. $A\mathbf{x} = A\mathbf{y}$이면 $A(\mathbf{x} - \mathbf{y}) = \mathbf{0}$이므로 $\mathbf{x} - \mathbf{y} = \mathbf{0}$이기 때문이다. 정사각 행렬에서는 이것이 [가역](t:t.invertible)과 같은 말이다.

::predict p-all

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 영공간은 $(-2, 1)$ 방향의 직선.
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$(2×3): $x_1 + 2x_3 = 0$, $x_2 - x_3 = 0$이므로 $(-2, 1, 1)$의 배수들, 곧 3차원 안의 직선 하나다.`,
  checks: [
    {
      q: '영공간과 열공간은 각각 어느 공간에 사는가? (A가 m×n)',
      choices: [String.raw`영공간은 입력 공간 $\mathbb{R}^n$, 열공간은 출력 공간 $\mathbb{R}^m$`, '둘 다 입력 공간', '둘 다 출력 공간', String.raw`영공간은 $\mathbb{R}^m$, 열공간은 $\mathbb{R}^n$`],
      answer: 0,
      explain: String.raw`영공간은 "원점으로 가는 **입력**"이므로 입력 공간에, 열공간은 "닿을 수 있는 **출력**"이므로 출력 공간에 산다. 정사각이 아니면 둘은 차원조차 다른 공간에 있다.`,
    },
  ],
  code: ['nullBasis'],
};

export default node;
