import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.shape-rule',
  kind: 'prop',
  title: '곱할 수 있는 조건: 안쪽 차원이 같아야 한다',
  status: 'written',
  requires: ['def.shape', 'def.composition'],
  predicts: [
    {
      id: 'p-rule',
      kind: 'choice',
      q: String.raw`$A$가 2×3, $B$가 3×4이다. $AB$와 $BA$의 모양은?`,
      hints: [
        String.raw`$AB$는 $B$를 먼저 한다. $B$는 성분 몇 개를 받아 몇 개를 내놓는가? 그 출력을 $A$가 받을 수 있는가?`,
        String.raw`$BA$는 $A$를 먼저 한다. $A$의 출력은 성분 2개다. $B$는 성분 몇 개를 받는가?`,
      ],
      choices: ['AB는 2×4이고, BA는 곱할 수 없다', 'AB는 3×3이고, BA는 4×2다', 'AB는 2×4이고, BA는 4×2다', '둘 다 곱할 수 없다'],
      answer: 0,
      why: [
        String.raw`$B$: 4개 → 3개, 이어서 $A$: 3개 → 2개. 그래서 $AB$: 4개 → 2개, 곧 2×4다. $BA$는 $A$의 출력(2개)을 $B$가 받아야 하는데 $B$는 4개를 받으므로 이어지지 않는다.`,
        String.raw`안쪽 수 3끼리 맞춰야 하는데 바깥쪽 수를 맞춘 것이다.`,
        String.raw`$AB$는 맞다. 그러나 $BA$에서는 안쪽 수가 4와 2로 맞지 않는다. 거의 맞는 답이다.`,
        String.raw`$AB$는 안쪽 수가 3과 3으로 맞으므로 곱할 수 있다.`,
      ],
    },
  ],
  body: String.raw`2×2 행렬끼리는 언제나 곱할 수 있었다. 모양이 다르면 어떻게 될까?

::predict p-rule

**명제.** $A$가 $m \times k$, $B$가 $k' \times n$일 때, $AB$는 $k = k'$일 때만 정의되고, 그때 모양은 $m \times n$이다. 이 문단의 $k$, $k'$은 안쪽 차원을 가리키는 이 노드만의 이름이다.

$$\underbrace{A}_{m \times k}\ \underbrace{B}_{k \times n} = \underbrace{AB}_{m \times n}$$

외우는 법보다 **이유**가 중요하다. $AB$는 "$B$ 다음 $A$"다. $B$가 내놓는 벡터(성분 $k'$개)를 $A$가 받을 수 있어야(성분 $k$개를 받아야) 두 변환이 이어진다. 그래서 안쪽 두 수가 같아야 한다. 그리고 전체는 $B$의 입력($n$개)을 받아 $A$의 출력($m$개)을 내놓으므로 $m \times n$이다.

### 두 개의 예
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$(2×3)과 $\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$(3×1): 안쪽 3 = 3이므로 곱할 수 있고, 결과는 2×1이다. [앞 노드](n:def.shape)의 계산대로 $(7, -1)$이다. 벡터 하나는 열이 하나뿐인 행렬로 볼 수 있다.
- 같은 두 행렬을 반대 순서로 곱하면 (3×1)(2×3)이 되어 안쪽 1 ≠ 2이므로 곱할 수 없다.

> [!직관] 텐서의 축을 맞추는 일
> 신경망 코드에서 "모양이 맞지 않는다"는 오류는 거의 언제나 이 규칙을 어긴 것이다. 그때마다 "먼저 하는 쪽의 출력 축과 나중에 하는 쪽의 입력 축이 같은가"를 물으면 된다.`,
  proof: String.raw`$AB$는 [합성 변환의 행렬](why:def.composition)이다. 합성 $\mathbf{x} \mapsto A(B\mathbf{x})$가 뜻을 가지려면 $B\mathbf{x}$가 $A$의 입력이 될 수 있어야 한다. [모양의 정의](why:def.shape)에 따라 $B\mathbf{x}$는 성분이 $k'$개이고 $A$는 성분 $k$개짜리 벡터를 받으므로 $k = k'$이어야 한다. 그때 합성은 $\mathbb{R}^n$의 벡터를 받아 $\mathbb{R}^m$의 벡터를 내놓으므로, 그 행렬은 열이 $n$개(입력 기저마다 하나)이고 각 열의 성분이 $m$개다. 곧 $m \times n$이다.`,
};

export default node;
