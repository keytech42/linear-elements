import type { Book } from './schema';

// 7권 — 기저 변환. 같은 벡터, 같은 변환을 다른 언어(기저)로 적기. 8권의 대각화가 바로 "좋은 언어 고르기"다.
const book: Book = {
  id: 'b7',
  num: 7,
  title: '기저 변환',
  subtitle: '같은 대상, 다른 언어',
  nodes: [
    {
      id: 'def.change-of-basis',
      kind: 'def',
      title: '기저 변환: 같은 벡터, 다른 이름표',
      status: 'written',
      introduces: {
        terms: [{ id: 't.change-of-basis', ko: '기저 변환', en: 'change of basis', gloss: '한 기저로 적은 좌표를 다른 기저로 적은 좌표로 바꾸는 일. 행렬 P의 열 = 새 기저 벡터(표준 좌표로 적은 것). 표준 좌표 = P × 새 좌표.' }],
        symbols: [{ tex: 'P', meaning: '기저 변환 행렬(열 = 새 기저 벡터를 표준 좌표로 적은 것)' }],
      },
      requires: ['def.basis', 'def.inverse'],
      predicts: [
        {
          id: 'p-way',
          kind: 'choice',
          q: String.raw`새 기저 벡터 $\mathbf{p}_1, \mathbf{p}_2$를 (표준 좌표로 적어) 열로 세운 행렬 $P$가 있다. $P$에 어떤 좌표를 곱하면, 무엇이 무엇으로 바뀔까? ($\mathbf{p}_1, \mathbf{p}_2$는 이 노드에서만 쓰는 이름이다.)`,
          hints: [String.raw`[행렬-벡터 곱은 열들의 선형 결합](n:def.matvec)이다. $P\begin{bmatrix} c_1 \\ c_2 \end{bmatrix} = c_1\mathbf{p}_1 + c_2\mathbf{p}_2$. 여기서 $c_1, c_2$는 어느 기저로 잰 좌표이고, 결과는 어느 기저로 적힌 벡터인가?`],
          choices: ['새 좌표 → 표준 좌표', '표준 좌표 → 새 좌표', '어느 쪽으로도 쓸 수 있다', '좌표가 아니라 벡터를 다른 벡터로 바꾼다'],
          answer: 0,
          why: [
            String.raw`$c_1, c_2$가 새 기저로 잰 좌표이면, $c_1\mathbf{p}_1 + c_2\mathbf{p}_2$는 바로 그 점을 표준 좌표로 적은 것이다. 반대 방향(표준 → 새)은 $P^{-1}$이다.`,
            String.raw`가장 흔한 혼동이다. "새 기저 벡터를 담은 행렬"이라는 이름 때문에 "새 쪽으로 번역한다"고 느끼지만, 실제로는 새 좌표를 받아 표준 좌표를 내놓는다.`,
            String.raw`한쪽 방향은 $P$, 반대 방향은 $P^{-1}$이다. 둘은 일반적으로 다른 행렬이다.`,
            String.raw`$P$를 곱하는 것을 "점을 옮기는 변환"으로도 읽을 수 있지만, 기저 변환에서는 **같은 점의 이름**을 바꾸는 계산으로 읽는다. 점 자체는 그대로다.`,
          ],
        },
        {
          id: 'p-name',
          kind: 'choice',
          q: String.raw`새 기저 $(2, 1)$, $(1, 1)$로 재면, 표준 좌표로 $(3, 2)$인 점의 새 좌표는?`,
          hints: [
            String.raw`새 좌표를 $(c_1, c_2)$라 하면 $c_1(2, 1) + c_2(1, 1) = (3, 2)$다. 또는 $P^{-1}$을 곱한다.`,
            String.raw`$P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$이고 $\det P = 1$이므로 $P^{-1} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$이다.`,
          ],
          choices: ['(1, 1)', '(8, 5)', '(3, 2) 그대로', '(1, 0)'],
          answer: 0,
          why: [
            String.raw`$1\cdot(2, 1) + 1\cdot(1, 1) = (3, 2)$. 새 격자에서는 대각선으로 한 칸 간 자리다.`,
            String.raw`$P$를 곱했다($P(3, 2) = (8, 5)$). 그것은 "새 좌표가 $(3, 2)$인 점"의 표준 좌표다. 방향을 거꾸로 썼다. 거의 맞는 답이다.`,
            String.raw`이름표가 바뀌면 좌표도 바뀐다. 점은 같아도 이름이 다르다.`,
            String.raw`$1\cdot(2, 1) + 0\cdot(1, 1) = (2, 1) \ne (3, 2)$.`,
          ],
        },
      ],
      body: String.raw`1권에서 [기저](t:t.basis)를 "평면에 좌표를 매기는 자"라고 했다. 자를 바꾸면 같은 점의 좌표가 바뀐다. 두 좌표 사이를 어떻게 번역할까?

::scene b7-two-grids {}

같은 평면 위에 격자가 둘 겹쳐 있다. 회색은 표준 기저의 격자, 파란색은 새 기저(주황 $\mathbf{p}_1$, 청록 $\mathbf{p}_2$)의 격자다. 노란 점을 끌면 같은 점의 **두 이름**이 함께 바뀐다. $\mathbf{p}_1, \mathbf{p}_2$는 이 노드에서만 쓰는 이름이다.

::predict p-way

**정의.** 새 기저 벡터들을 표준 좌표로 적어 열로 세운 행렬을 $P$라 하자. 새 기저로 잰 좌표 $\mathbf{c}$와 표준 좌표 $\mathbf{v}$ 사이의 번역을 [기저 변환](def:t.change-of-basis)이라 한다.

$$\mathbf{v} = P\,\mathbf{c} \quad(\text{새 좌표} \to \text{표준 좌표}), \qquad \mathbf{c} = P^{-1}\mathbf{v} \quad(\text{표준 좌표} \to \text{새 좌표})$$

새 기저는 [기저](why:def.basis)이므로 열이 독립이고, 그래서 [P는 가역](why:prop.inverse-exists)이다. 반대 방향의 번역이 언제나 있다.

::predict p-name

> [!비유] 수도꼭지 두 개와 레버 하나
> 손잡이가 둘인 수도꼭지는 물을 "온수 몇, 냉수 몇"으로 적는다(표준 기저: 온수 1단위, 냉수 1단위). 레버 하나인 수도꼭지는 같은 물을 "총량 몇, 차이(온수 − 냉수) 몇"으로 적는다(새 기저). 나오는 물은 같고, 적는 언어만 다르다. 총량 = 온수 + 냉수, 차이 = 온수 − 냉수는 선형이므로, 두 언어 사이의 번역은 정확히 기저 변환이다. 레버 쪽의 기저 벡터는 "총량 1, 차이 0" = 온수 0.5 + 냉수 0.5, 그리고 "총량 0, 차이 1" = 온수 0.5 − 냉수 0.5다.
>
> 이 비유가 깨지는 곳이 둘 있다. 첫째, 레버의 둘째 좌표를 흔히 생각하는 **온도**로 잡으면 번역이 선형이 아니게 된다. 온도는 온수와 냉수의 섞인 **비율**이라서, 총량을 두 배로 해도 온도는 그대로이기 때문이다. 그래서 비유는 온도가 아니라 "차이"를 써야 맞는다. 둘째, 물의 양은 음수가 될 수 없지만, 좌표평면은 음수 좌표도 포함한다. 비유는 평면의 한 귀퉁이만 덮는다.

::scene b7-two-grids {"P": [[0.5, 0.5], [0.5, -0.5]], "v": [2, 1], "names": {"e1": "온수", "e2": "냉수", "p1": "합", "p2": "차", "std": "손잡이 둘", "new": "레버"}}

### 두 개의 예
- 새 기저 $(2, 1)$, $(1, 1)$: 표준 $(3, 2)$ = 새 $(1, 1)$. 표준 $(1, 0)$ = 새 $P^{-1}(1, 0) = (1, -1)$. 확인: $1\cdot(2, 1) - 1\cdot(1, 1) = (1, 0)$.
- 수도꼭지: 온수 2, 냉수 1(표준 $(2, 1)$)은 레버로 총량 3, 차이 1이다. $P = \begin{bmatrix} 0.5 & 0.5 \\ 0.5 & -0.5 \end{bmatrix}$이고 $P^{-1} = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$이므로 $P^{-1}(2, 1) = (3, 1)$.`,
      checks: [
        {
          q: String.raw`새 기저가 표준 기저를 30° 돌린 것($P = R_{30°}$)이다. 표준 좌표에서 새 좌표로 번역하는 행렬은?`,
          choices: [String.raw`$R_{-30°} = R_{30°}^{\mathsf{T}}$`, String.raw`$R_{30°}$`, String.raw`$R_{60°}$`, '번역할 수 없다'],
          answer: 0,
          explain: String.raw`표준 → 새는 $P^{-1}$이고, [직교 행렬의 역행렬은 전치](n:prop.orthogonal-inverse)이므로 $R_{30°}^{\mathsf{T}} = R_{-30°}$다. 자를 30° 돌려 대면, 점의 좌표는 반대로 30° 돌린 것처럼 바뀐다. 9권에서 $V^{\mathsf{T}}$가 하는 일이 정확히 이것이다.`,
        },
      ],
    },
    {
      id: 'prop.similarity',
      kind: 'prop',
      title: '같은 변환을 새 언어로: P⁻¹AP',
      status: 'written',
      introduces: { terms: [{ id: 't.similar', ko: '닮음', en: 'similar', surfaces: ['닮은 행렬'], gloss: 'B = P⁻¹AP 꼴로 쓸 수 있는 두 행렬. 같은 변환을 다른 기저로 적은 것.' }] },
      requires: ['def.change-of-basis', 'prop.associative'],
      predicts: [
        {
          id: 'p-read',
          kind: 'choice',
          q: String.raw`새 좌표로 적은 입력 $\mathbf{c}$에 $P^{-1}AP$를 하면, 오른쪽부터 무슨 일이 차례로 일어날까?`,
          hints: [String.raw`오른쪽부터 읽는다. $P$는 [새 좌표 → 표준 좌표](n:def.change-of-basis), $A$는 표준 좌표로 적힌 변환, $P^{-1}$은 표준 좌표 → 새 좌표.`],
          choices: ['새 좌표를 표준 좌표로 번역 → 변환 → 다시 새 좌표로 번역', '변환 → 번역 → 번역', '새 좌표로 번역 → 변환 → 표준 좌표로 번역', '세 번 변환한다'],
          answer: 0,
          why: [
            String.raw`$P\mathbf{c}$는 같은 점의 표준 좌표, $AP\mathbf{c}$는 그 점의 상의 표준 좌표, $P^{-1}AP\mathbf{c}$는 그 상의 새 좌표다. 그러므로 $P^{-1}AP$는 "새 언어로 적은 $A$"다.`,
            String.raw`$A$는 표준 좌표를 받는다. 새 좌표를 먼저 번역해야 한다.`,
            String.raw`방향이 거꾸로다. 입력이 이미 새 좌표이므로 첫 단계는 "표준 좌표로" 번역이다.`,
            String.raw`$P$와 $P^{-1}$은 점을 움직이지 않는다. 같은 점의 이름만 바꾼다. 실제로 점을 움직이는 것은 $A$ 하나다.`,
          ],
        },
        {
          id: 'p-det',
          kind: 'choice',
          q: String.raw`닮은 두 행렬 $A$와 $P^{-1}AP$의 행렬식은?`,
          hints: [String.raw`[곱의 행렬식](n:prop.det-product)과 [역행렬의 행렬식](n:prop.inverse-exists)을 써라. 또는 기하로: 넓이 배율은 어느 언어로 재든 같아야 하는가?`],
          choices: ['언제나 같다', 'P에 따라 다르다', String.raw`$\det(P^{-1}AP) = (\det P)^2\det A$`, '부호만 같다'],
          answer: 0,
          why: [
            String.raw`$\det(P^{-1})\det A\det P = \frac{1}{\det P}\det A\det P = \det A$. 같은 변환이므로 넓이 배율이 같다.`,
            String.raw`번역은 변환이 넓이를 몇 배 하는지를 바꾸지 못한다.`,
            String.raw`$P^{-1}$의 행렬식은 $\det P$가 아니라 $1/\det P$다.`,
            String.raw`크기도 같다.`,
          ],
        },
      ],
      body: String.raw`[기저 변환](t:t.change-of-basis)은 같은 **점**을 다른 언어로 적었다. 같은 **변환**도 다른 언어로 적을 수 있을까?

::predict p-read

**명제.** 표준 좌표로 적은 변환 $A$를 새 기저(열이 그 기저인 $P$)의 좌표로 다시 적으면

$$B = P^{-1}AP$$

이다. 이렇게 $B = P^{-1}AP$ 꼴로 쓸 수 있는 두 행렬을 [닮은](def:t.similar) 행렬이라 한다. 닮은 행렬은 **같은 변환의 두 이름**이다.

::scene b7-similarity {}

왼쪽은 표준 좌표로, 오른쪽은 새 좌표로 같은 변환을 그린 것이다. 진행 막대를 움직이면 두 그림이 매 순간 같은 움직임을 보인다. 오른쪽에서는 새 격자가 반듯한 격자로 그려진다.

::predict p-det

### 예
그림의 처음 값: 전단 $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, 새 기저 $P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$. 계산하면 $AP = \begin{bmatrix} 3 & 2 \\ 1 & 1 \end{bmatrix}$이고

$$B = P^{-1}AP = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}\begin{bmatrix} 3 & 2 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ -1 & 0 \end{bmatrix}$$

이다. 숫자는 전혀 달라 보이지만 같은 변환이다. 그 증거로 $\det B = 0 + 1 = 1 = \det A$, [대각합](fwd:t.trace)(대각선 성분의 합)도 $2 = 2$로 같다.

### 왜 언어를 바꾸는가
같은 변환이라도 어떤 언어로 적느냐에 따라 숫자가 단순해지기도 하고 복잡해지기도 한다. 8권의 핵심 질문이 이것이다. **이 변환을 가장 단순하게, 곧 축 방향으로 늘이기만 하는 [대각 행렬](fwd:t.diagonal)로 적게 해 주는 기저가 있는가?** 그런 기저가 [고유벡터](fwd:t.eigenvector)들이다.`,
      proof: String.raw`새 좌표 $\mathbf{c}$로 적힌 아무 점을 생각하자. [기저 변환의 정의](why:def.change-of-basis)에 따라 그 점의 표준 좌표는 $P\mathbf{c}$다. $A$는 표준 좌표로 적힌 변환이므로, 그 점의 상의 표준 좌표는 $A(P\mathbf{c})$다. 이것을 새 좌표로 번역하면 $P^{-1}(A(P\mathbf{c}))$다. [결합법칙](why:prop.associative)으로 괄호를 정리하면 $(P^{-1}AP)\mathbf{c}$이므로, 새 좌표에서 이 변환을 적은 행렬은 $P^{-1}AP$다.`,
    },
  ],
};
export default book;
