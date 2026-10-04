import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c7-similarity {}

왼쪽은 표준 좌표로, 오른쪽은 새 좌표로 같은 변환을 그린 것이다. 진행 막대를 움직이면 두 그림이 매 순간 같은 움직임을 보인다. 오른쪽에서는 새 격자가 반듯한 격자로 그려진다.

::predict p-det

### 예
그림의 처음 값: 전단 $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, 새 기저 $P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$. 계산하면 $AP = \begin{bmatrix} 3 & 2 \\ 1 & 1 \end{bmatrix}$이고

$$B = P^{-1}AP = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}\begin{bmatrix} 3 & 2 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ -1 & 0 \end{bmatrix}$$

이다. 숫자는 전혀 달라 보이지만 같은 변환이다. 그 증거로 $\det B = 0 + 1 = 1 = \det A$, [대각합](fwd:t.trace)(대각선 성분의 합)도 $2 = 2$로 같다.

### 왜 언어를 바꾸는가
같은 변환이라도 어떤 언어로 적느냐에 따라 숫자가 단순해지기도 하고 복잡해지기도 한다. 8장의 핵심 질문이 이것이다. **이 변환을 가장 단순하게, 곧 축 방향으로 늘이기만 하는 [대각 행렬](fwd:t.diagonal)로 적게 해 주는 기저가 있는가?** 그런 기저가 [고유벡터](fwd:t.eigenvector)들이다.`,
  proof: String.raw`새 좌표 $\mathbf{c}$로 적힌 아무 점을 생각하자. [기저 변환의 정의](why:def.change-of-basis)에 따라 그 점의 표준 좌표는 $P\mathbf{c}$다. $A$는 표준 좌표로 적힌 변환이므로, 그 점의 상의 표준 좌표는 $A(P\mathbf{c})$다. 이것을 새 좌표로 번역하면 $P^{-1}(A(P\mathbf{c}))$다. [결합법칙](why:prop.associative)으로 괄호를 정리하면 $(P^{-1}AP)\mathbf{c}$이므로, 새 좌표에서 이 변환을 적은 행렬은 $P^{-1}AP$다.`,
};

export default node;
