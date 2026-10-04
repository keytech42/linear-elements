import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.det-product',
  kind: 'prop',
  title: 'det(AB) = det A · det B',
  status: 'written',
  requires: ['prop.det-uniform', 'def.composition'],
  predicts: [
    {
      id: 'p-order',
      kind: 'choice',
      q: String.raw`$\det A = 2$, $\det B = -3$이다. $\det(AB)$와 $\det(BA)$는?`,
      hints: [String.raw`$AB$는 "$B$를 먼저, 그다음 $A$"다. 넓이는 $B$에서 몇 배, 이어서 $A$에서 몇 배가 되는가? $BA$는 순서가 반대지만, 배율끼리의 곱은 순서를 바꿔도 같은가?`],
      choices: ['둘 다 −6', '−6과 6', '−1과 1', 'AB ≠ BA이므로 알 수 없다'],
      answer: 0,
      why: [
        String.raw`배율이 차례로 곱해진다: $2\times(-3) = -3\times2 = -6$. 행렬은 순서를 바꾸면 달라지지만, 행렬식(수)의 곱은 [교환법칙](n:ax.arith)을 따른다.`,
        String.raw`순서를 바꾸면 행렬은 달라질 수 있지만 행렬식은 같다. 두 번 뒤집기 중 한 번만 뒤집힌다는 사실도 순서와 상관없다.`,
        String.raw`배율을 더했다. 이어서 하는 변환의 배율은 곱해진다.`,
        String.raw`$AB$와 $BA$가 다르더라도 넓이 배율은 같다.`,
      ],
    },
    {
      id: 'p-double',
      kind: 'choice',
      q: String.raw`2×2 행렬 $A$에 대해 $\det(2A)$는?`,
      hints: [
        String.raw`$2A = (2I)A$로 볼 수 있다. $2I$는 넓이를 몇 배 하는가?`,
        String.raw`$2I = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$은 가로로 2배, 세로로 2배다.`,
      ],
      choices: [String.raw`$4\det A$`, String.raw`$2\det A$`, String.raw`$\det A$`, String.raw`$8\det A$`],
      answer: 0,
      why: [
        String.raw`$\det(2I) = 4$이므로 $\det(2A) = 4\det A$. 두 열이 모두 2배가 되므로 평행사변형의 가로세로가 모두 2배다.`,
        String.raw`흔한 착각이다. 행렬에 2를 곱하면 **모든** 열이 2배가 되고, 2×2에서는 열이 두 개라 넓이가 $2 \times 2$배가 된다.`,
        String.raw`모든 성분이 2배가 되었으므로 넓이가 바뀐다.`,
        String.raw`$8 = 2^3$은 3×3 행렬에서의 답이다(부피). 2×2에서는 $2^2$이다.`,
      ],
    },
  ],
  body: String.raw`두 변환을 차례로 하면 넓이 배율은 어떻게 될까?

::predict p-order

**명제.** 모든 2×2 행렬 $A$, $B$에 대해 $\det(AB) = \det A\cdot\det B$이다.

계산 없이 증명된다. $AB$는 "[$B$ 다음 $A$](why:def.composition)"다. $B$는 모든 넓이를 $|\det B|$배 하고, 이어서 $A$가 모든 넓이를 $|\det A|$배 한다([모든 도형에 같은 배율](why:prop.det-uniform)). 그러므로 전체는 $|\det A|\,|\det B|$배다. 향은 두 번 중 몇 번 뒤집혔는지로 정해진다. 한 번 뒤집히면 뒤집힌 채이고, 두 번 뒤집히면 제자리다. 이것은 [음수 × 음수 = 양수](why:prop.neg-times-neg)와 정확히 같은 규칙이다.

::scene c4-product {}

진행 막대로 단위 정사각형이 $B$에서 넓이 $\det B$인 평행사변형이 되고, 이어서 $A$에서 다시 $\det A$배가 되는 것을 보라.

::predict p-double

### 두 개의 예
- 그림의 $A = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$($\det 2$), $B = \begin{bmatrix} 1.5 & 0 \\ 0.5 & 1 \end{bmatrix}$($\det 1.5$): $AB = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이고 $\det(AB) = 4 - 1 = 3 = 2 \times 1.5$.
- 반사를 두 번: 가로축 반사 $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$을 두 번 하면 $I$다. $(-1)(-1) = 1 = \det I$.`,
  proof: String.raw`[행렬식](why:def.det)은 단위 정사각형의 상의 부호 있는 넓이다. $AB$는 단위 정사각형을 먼저 $B$로 보낸다. 그 상의 넓이는 $|\det B|$다. 이어서 $A$가 이 평행사변형을 보내는데, [A는 모든 도형의 넓이를 |det A|배 하므로](why:prop.det-uniform) 최종 넓이는 $|\det A|\,|\det B|$다. 향에 대해: $\det B < 0$이면 $B$가 향을 뒤집고, $\det A < 0$이면 $A$가 다시 뒤집는다. 뒤집힘이 짝수 번이면 향이 유지되고 홀수 번이면 뒤집힌다. 부호의 곱이 정확히 이 규칙을 따르므로, 부호까지 $\det(AB) = \det A\cdot\det B$이다.`,
};

export default node;
