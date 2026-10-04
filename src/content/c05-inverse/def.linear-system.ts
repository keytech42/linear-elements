import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.linear-system',
  kind: 'def',
  title: '연립일차방정식 Ax = b',
  status: 'written',
  introduces: {
    terms: [{ id: 't.linear-system', ko: '연립일차방정식', en: 'system of linear equations', gloss: '여러 개의 일차방정식을 동시에 만족하는 해를 찾는 문제. 행렬로 A𝐱 = 𝐛.' }],
    symbols: [{ tex: String.raw`\mathbf{b}`, meaning: '연립방정식 A𝐱 = 𝐛 의 오른쪽 벡터(목표 출력)' }],
  },
  requires: ['def.matvec', 'prop.row-picture'],
  predicts: [
    {
      id: 'p-solve',
      kind: 'point',
      q: String.raw`$2x_1 + x_2 = 5$와 $x_1 - x_2 = 1$을 동시에 만족하는 점 $(x_1, x_2)$를 분홍 점으로 끌어 놓아라.`,
      hints: [
        String.raw`두 식을 더하면 $x_2$가 지워진다.`,
        String.raw`$3x_1 = 6$에서 $x_1$을 구하고, 둘째 식에 넣어라.`,
      ],
      A: [[0.3333333333333333, 0.3333333333333333], [0.3333333333333333, -0.6666666666666666]],
      x: [5, 1],
      target: 'Ax',
      tol: 0.2,
      reveal: String.raw`정답은 $(2, 1)$이다. 이 점은 아래 두 그림에서 동시에 보인다. 열의 관점에서는 "열을 각각 2배, 1배 섞으면 $\mathbf{b} = (5, 1)$에 닿는다", 행의 관점에서는 "두 직선이 만나는 점"이다.`,
    },
    {
      id: 'p-none',
      kind: 'choice',
      q: String.raw`$2x_1 + x_2 = 5$와 $4x_1 + 2x_2 = 3$을 동시에 만족하는 해는?`,
      hints: [
        String.raw`둘째 식의 왼쪽은 첫째 식의 왼쪽의 2배다. 오른쪽도 2배인가?`,
        String.raw`행의 관점: 두 직선의 기울기를 비교하라. 열의 관점: 두 열 $(2, 4)$와 $(1, 2)$는 같은 직선 위에 있다. $\mathbf{b} = (5, 3)$은 그 직선 위에 있는가?`,
      ],
      choices: ['없다', '하나', '무수히 많다', '(1, 3)'],
      answer: 0,
      why: [
        String.raw`두 직선은 평행하고(왼쪽이 2배), 오른쪽은 2배가 아니므로($5 \times 2 \ne 3$) 만나지 않는다. 열의 관점에서는 $\mathbf{b}$가 두 열이 닿을 수 있는 직선 밖에 있다.`,
        String.raw`두 직선이 평행하다. 한 점에서 만나려면 기울기가 달라야 한다.`,
        String.raw`그것은 오른쪽까지 2배였을 때($4x_1 + 2x_2 = 10$), 곧 두 식이 같은 직선일 때다.`,
        String.raw`첫째 식만 만족한다: $2 + 3 = 5$. 둘째 식은 $4 + 6 = 10 \ne 3$.`,
      ],
    },
  ],
  body: String.raw`지금까지는 입력을 주고 출력을 물었다. 거꾸로, **출력이 주어졌을 때 어떤 입력이 거기에 도착하는가?**

**정의.** 행렬 $A$와 벡터 $\mathbf{b}$가 주어졌을 때 $A\mathbf{x} = \mathbf{b}$를 만족하는 $\mathbf{x}$를 찾는 문제를 [연립일차방정식](def:t.linear-system)이라 하고, 그런 $\mathbf{x}$를 해라 한다. $\mathbf{b}$는 목표 출력이다. 성분으로 쓰면 일차방정식 여러 개를 한꺼번에 만족시키는 문제다.

$$\begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix} \iff \begin{cases} 2x_1 + x_2 = 5 \\ x_1 - x_2 = 1 \end{cases}$$

::predict p-solve

### 같은 문제, 두 그림
::scene c5-two-pictures {}

- **열의 관점(왼쪽)**: [행렬-벡터 곱은 열들의 섞음](why:def.matvec)이므로, 해를 찾는 것은 "열 $\mathbf{a}_1$, $\mathbf{a}_2$를 얼마씩 섞어야 $\mathbf{b}$에 닿는가"를 찾는 것이다. 출력 공간에서 화살표를 이어 붙여 분홍 고리에 닿게 하라.
- **행의 관점(오른쪽)**: [출력의 성분 하나는 행 하나와의 내적](why:prop.row-picture)이므로, 방정식 하나는 "$i$행과의 내적이 $b_i$인 점들", 곧 입력 공간의 직선 하나다. 해는 모든 직선이 만나는 점이다.

### 해는 몇 개인가
단추로 세 경우를 비교하라.
- **해 하나**: 두 직선이 한 점에서 만난다. 두 열이 평면을 펼친다($\det A \ne 0$). 이때 해는 $A^{-1}\mathbf{b}$다.
- **해 없음**: 두 직선이 평행하고 겹치지 않는다. 두 열이 한 직선 위에 있고, $\mathbf{b}$가 그 직선 밖에 있다.
- **해 무수히**: 두 직선이 겹친다. 두 열이 한 직선 위에 있고, $\mathbf{b}$도 그 직선 위에 있다.

::predict p-none

"해가 없다"는 결론이 두 그림에서 같은 말이라는 점에 주목하라. 행의 관점의 평행한 직선과 열의 관점의 "닿을 수 없는 목표"는 같은 사실의 두 얼굴이다.`,
  checks: [
    {
      q: String.raw`$\det A \ne 0$인 2×2 행렬이다. $A\mathbf{x} = \mathbf{b}$의 해는 몇 개인가?`,
      choices: [String.raw`$\mathbf{b}$가 무엇이든 정확히 하나`, String.raw`$\mathbf{b}$에 따라 0개 또는 1개`, '무수히 많다', String.raw`$\mathbf{b} = \mathbf{0}$일 때만 하나`],
      answer: 0,
      explain: String.raw`[역행렬이 있으므로](n:prop.inverse-exists) $\mathbf{x} = A^{-1}\mathbf{b}$가 해이고, 다른 해 $\mathbf{x}'$가 있다면 $\mathbf{x}' = A^{-1}A\mathbf{x}' = A^{-1}\mathbf{b} = \mathbf{x}$이므로 하나뿐이다. 열이 평면 전체를 펼치므로 어떤 $\mathbf{b}$에도 닿는다.`,
    },
  ],
  code: ['solve'],
};

export default node;
