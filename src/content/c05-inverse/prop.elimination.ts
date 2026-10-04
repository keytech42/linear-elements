import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.elimination',
  kind: 'prop',
  title: '가우스 소거 = 전단 변환을 차례로 곱하기',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.elimination', ko: '가우스 소거', en: 'Gaussian elimination', surfaces: ['가우스 소거법'], gloss: '한 행의 몇 배를 다른 행에서 빼는 일을 되풀이해 연립방정식을 푸는 방법. 기본 행렬을 왼쪽에 차례로 곱하는 것과 같다.' },
      { id: 't.elementary-matrix', ko: '기본 행렬', en: 'elementary matrix', gloss: '행 연산 하나를 행렬 곱 하나로 나타낸 행렬. 더하기(전단), 맞바꿈, 늘림.' },
    ],
  },
  requires: ['def.linear-system', 'exp.gallery', 'prop.det-product'],
  predicts: [
    {
      id: 'p-E',
      kind: 'choice',
      q: String.raw`"둘째 행에서 첫째 행의 2배를 뺀다"는 행 연산을 행렬 곱으로 하려면, 왼쪽에 어떤 행렬을 곱해야 할까?`,
      hints: [String.raw`항등 행렬 $I$에 **같은 행 연산**을 해 보라. 그 결과를 아무 행렬의 왼쪽에 곱하면 그 행렬에 같은 행 연산을 한 것이 된다([행의 관점](n:prop.row-picture)으로 확인하라).`],
      choices: [String.raw`$\begin{bmatrix} 1 & 0 \\ -2 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & -2 \\ 0 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -2 & 1 \\ 0 & 1 \end{bmatrix}$`],
      answer: 0,
      why: [
        String.raw`$I$의 둘째 행 $(0, 1)$에서 첫째 행 $(1, 0)$의 2배를 빼면 $(-2, 1)$이다. 곱한 행렬의 둘째 행은 "원래 둘째 행 − 2 × 첫째 행"이 된다.`,
        String.raw`이것을 **오른쪽에** 곱하면 열 연산이 된다(둘째 열에서 첫째 열의 2배를 뺀다). 행 연산은 왼쪽에 곱한다. 거의 맞는 답이다.`,
        String.raw`부호가 반대다. 이것은 2배를 **더한다**.`,
        String.raw`이 행렬의 첫째 행은 $(-2, 1)$로, 첫째 행을 바꿔 버린다.`,
      ],
    },
    {
      id: 'p-same',
      kind: 'choice',
      q: '행 연산을 해도 연립방정식의 해가 바뀌지 않는 이유는?',
      hints: [String.raw`행 연산은 기본 행렬 $E$를 양쪽 왼쪽에 곱하는 일이다: $A\mathbf{x} = \mathbf{b} \Rightarrow EA\mathbf{x} = E\mathbf{b}$. 거꾸로 $EA\mathbf{x} = E\mathbf{b}$에서 $A\mathbf{x} = \mathbf{b}$로 돌아올 수 있으려면 $E$가 어때야 하는가?`],
      choices: ['기본 행렬은 되돌릴 수 있어서, 새 식과 원래 식이 서로 오갈 수 있기 때문이다', '양쪽에 같은 일을 하면 언제나 해가 같기 때문이다', '행렬식이 바뀌지 않기 때문이다', '해가 바뀌지만 마지막에 되돌리기 때문이다'],
      answer: 0,
      why: [
        String.raw`$E$가 가역이므로 $EA\mathbf{x} = E\mathbf{b}$의 양쪽에 $E^{-1}$을 곱하면 원래 식이 나온다. 두 식은 정확히 같은 해를 가진다.`,
        String.raw`그렇지 않다. 양쪽에 영행렬을 곱하면 $\mathbf{0} = \mathbf{0}$이 되어 모든 $\mathbf{x}$가 "해"가 된다. 되돌릴 수 있는 일이어야 한다.`,
        String.raw`맞바꿈은 행렬식의 부호를 바꾸지만 해는 바꾸지 않는다. 행렬식은 이유가 아니다.`,
        String.raw`행 연산의 매 단계에서 해는 그대로다.`,
      ],
    },
  ],
  body: String.raw`[연립일차방정식](t:t.linear-system)을 손으로 풀 때 "한 식의 몇 배를 다른 식에서 뺀다"를 되풀이한다. 이 익숙한 계산은 기하적으로 무엇을 하는 것일까?

### 행 연산 셋
- **더하기**: 한 행에 다른 행의 몇 배를 더한다.
- **맞바꿈**: 두 행의 자리를 바꾼다.
- **늘림**: 한 행에 0이 아닌 수를 곱한다.

::predict p-E

**명제.** 행 연산 하나는 [기본 행렬](def:t.elementary-matrix) $E$ 하나를 왼쪽에 곱하는 일이다. $E$는 항등 행렬에 같은 행 연산을 한 것이다. 행 연산은 해를 바꾸지 않는다. 그러므로 [가우스 소거](def:t.elimination)는 기본 행렬들을 차례로 곱해 $A\mathbf{x} = \mathbf{b}$를 풀기 쉬운 꼴(계단 모양)로 바꾸는 일이다.

### 더하기 연산은 전단이다
더하기의 기본 행렬, 예를 들어 $\begin{bmatrix} 1 & 0 \\ -2 & 1 \end{bmatrix}$은 [전단](t:t.shear)이다. 그래서 넓이를 바꾸지 않는다($\det = 1$). 맞바꿈은 반사라 $\det = -1$, $c$배 늘림은 $\det = c$다.

::scene c5-elim {}

"다음 단계 ▶"를 누르며 보라. 왼쪽(열의 관점)에서는 지금까지 곱한 기본 행렬이 출력 평면 전체를 민다. 오른쪽(행의 관점)에서는 식들의 직선이 돌지만, **두 직선이 만나는 점(해)은 움직이지 않는다.**

::predict p-same

### 두 개의 예
- $\begin{cases} 2x_1 + x_2 = 5 \\ x_1 - x_2 = 1 \end{cases}$: 둘째 식에서 첫째 식의 $\tfrac{1}{2}$배를 빼면 $-\tfrac{3}{2}x_2 = -\tfrac{3}{2}$, 곧 $x_2 = 1$이다. 첫째 식에 넣으면 $x_1 = 2$. 기본 행렬은 $\begin{bmatrix} 1 & 0 \\ -1/2 & 1 \end{bmatrix}$이다.
- 맞바꿈이 필요한 경우 $\begin{cases} 0x_1 + x_2 = 3 \\ x_1 + x_2 = 4 \end{cases}$: 첫째 식에 $x_1$이 없어 그대로는 첫째 식으로 $x_1$을 지울 수 없다. 두 식을 맞바꾸면 $\begin{cases} x_1 + x_2 = 4 \\ x_2 = 3 \end{cases}$이 되어 $x_1 = 1$.

> [!코드] 소거로 하는 일들
> 이 저장소의 \`eliminationSteps\`는 소거의 단계마다 기본 행렬을 기록한다. 같은 소거에서 6장의 [랭크](fwd:t.rank)(남은 계단의 수)와 [영공간](fwd:t.null-space)의 기저도 나온다(\`rank\`, \`nullBasis\`). 소거는 연립방정식을 푸는 계산이면서, 행렬의 구조를 드러내는 계산이기도 하다.`,
  proof: String.raw`**기본 행렬.** [행의 관점](why:prop.row-picture)으로, $EA$의 $i$번째 행은 "$E$의 $i$번째 행"으로 $A$의 행들을 섞은 것이다. $E$가 $I$에 행 연산을 한 것이면, $E$의 각 행은 $A$의 행들을 바로 그 행 연산대로 섞는다. 예를 들어 $E$의 둘째 행이 $(-2, 1)$이면, $EA$의 둘째 행은 $-2\times$($A$의 첫째 행) $+$ ($A$의 둘째 행)이다.

**해를 바꾸지 않는다.** 행 연산마다 되돌리는 행 연산이 있다(더한 것은 빼고, 맞바꾼 것은 다시 맞바꾸고, $c$배 한 것은 $1/c$배 한다). 그러므로 기본 행렬은 [가역](why:def.inverse)이다. $A\mathbf{x} = \mathbf{b}$이면 $EA\mathbf{x} = E\mathbf{b}$이고, 거꾸로 $EA\mathbf{x} = E\mathbf{b}$이면 양쪽에 $E^{-1}$을 곱해 $A\mathbf{x} = \mathbf{b}$다. 두 식은 같은 해를 가진다.

**행렬식.** 더하기의 기본 행렬은 대각선이 1이고 한쪽만 0이 아닌 삼각 행렬이라 [행렬식이 1](why:prop.det-formula)이다. [곱의 행렬식](why:prop.det-product)에 따라 더하기 연산은 $\det A$를 바꾸지 않는다.`,
  code: ['elementary', 'eliminationSteps', 'solve'],
};

export default node;
