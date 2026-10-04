import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.inverse-exists',
  kind: 'prop',
  title: '역행렬이 있을 조건: det A ≠ 0',
  status: 'written',
  requires: ['def.inverse', 'prop.det-zero', 'prop.det-product'],
  predicts: [
    {
      id: 'p-formula',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$의 역행렬은?`,
      hints: [
        String.raw`아래 공식: 대각선 두 성분은 자리를 맞바꾸고, 나머지 두 성분은 부호만 바꾼 뒤, 전체를 $\det A$로 나눈다.`,
        String.raw`$\det A = 2 - 1 = 1$이다. 답이 맞는지는 $A$와 곱해서 $I$가 나오는지로 확인하라.`,
      ],
      choices: [String.raw`$\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0.5 & 1 \\ 1 & 1 \end{bmatrix}$ (성분마다 역수)`, String.raw`$\begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -1 & 1 \\ 1 & -2 \end{bmatrix}$`],
      answer: 0,
      why: [
        String.raw`$\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$.`,
        String.raw`성분마다 역수를 취하는 것은 흔한 착각이다. 역행렬은 **변환을** 되돌리는 것이지 숫자를 하나씩 뒤집는 것이 아니다. 곱해 보면 $I$가 나오지 않는다.`,
        String.raw`대각선만 맞바꾸고 부호를 바꾸지 않았다.`,
        String.raw`부호를 반대로 바꿨다. 이것은 $-A^{-1}$이다.`,
      ],
    },
    {
      id: 'p-det',
      kind: 'choice',
      q: String.raw`$\det A = 4$이면 $\det(A^{-1})$은?`,
      hints: [String.raw`$A^{-1}A = I$의 양쪽에 행렬식을 취해 보라. [곱의 행렬식은 행렬식의 곱](n:prop.det-product)이다.`],
      choices: [String.raw`$\tfrac{1}{4}$`, '4', '−4', '1'],
      answer: 0,
      why: [
        String.raw`$\det(A^{-1})\det A = \det I = 1$이므로 $\det(A^{-1}) = 1/4$. 넓이를 4배 한 것을 되돌리면 넓이가 4분의 1이 된다.`,
        String.raw`되돌리는 변환은 넓이를 다시 줄여야 한다.`,
        String.raw`뒤집힘을 되돌릴 일은 없다. $\det A$가 양수이므로 향은 뒤집히지 않았다.`,
        String.raw`$A$와 $A^{-1}$을 함께 한 결과($I$)의 행렬식이 1이다.`,
      ],
    },
  ],
  body: String.raw`어떤 행렬은 되돌릴 수 있고 어떤 행렬은 되돌릴 수 없을까? 둘을 가르는 기준은 무엇일까?

**명제.** 2×2 행렬 $A$가 [가역](t:t.invertible)인 것은 $\det A \ne 0$인 것과 같다. 그리고 그때

$$A^{-1} = \frac{1}{\det A}\begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11} \end{bmatrix}$$

이다.

::scene c5-collapse {}

이 그림의 행렬은 행렬식이 0이다. 노란 점선 위의 입력들이 **모두 같은 출력**으로 간다. 출력만 보고는 그중 어느 입력에서 왔는지 알 수 없다. 그래서 되돌릴 수 없다.

::predict p-formula

::predict p-det

### 두 개의 예
- $\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$: $\det = 1$, 역행렬 $\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$.
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $\det = 0$이므로 역행렬이 없다. 공식으로는 0으로 나누게 된다. 그림으로는 평면이 직선 하나로 눌려서, 직선 밖의 출력은 어디서도 오지 않고 직선 위의 출력은 끝없이 많은 곳에서 온다.`,
  proof: String.raw`**det A = 0이면 가역이 아니다.** [행렬식이 0이면](why:prop.det-zero) 영벡터가 아닌 $\mathbf{z}$가 있어 $A\mathbf{z} = \mathbf{0} = A\mathbf{0}$이다. 서로 다른 두 입력 $\mathbf{z}$와 $\mathbf{0}$이 같은 출력으로 가므로, 되돌리는 변환이 $\mathbf{0}$을 어디로 보내야 할지 하나로 정할 수 없다. (또는: $A^{-1}$이 있다면 [$\det(A^{-1})\det A = \det I = 1$](why:prop.det-product)이어야 하는데 $\det A = 0$이면 불가능하다.)

**det A ≠ 0이면 위 공식이 역행렬이다.** 직접 곱하면

$$\begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11} \end{bmatrix}\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} = \begin{bmatrix} a_{11}a_{22} - a_{12}a_{21} & 0 \\ 0 & a_{11}a_{22} - a_{12}a_{21} \end{bmatrix} = (\det A)\,I$$

이다(대각선 밖은 $a_{22}a_{12} - a_{12}a_{22} = 0$ 같은 꼴로 지워진다). 양쪽을 $\det A$로 나누면 $A^{-1}A = I$다. 반대 순서의 곱도 같은 계산으로 $I$가 된다.`,
  code: ['inverse2'],
};

export default node;
