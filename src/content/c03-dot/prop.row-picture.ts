import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.row-picture',
  kind: 'prop',
  title: '행의 관점: (Ax)ᵢ = (i행)·x',
  status: 'written',
  requires: ['def.dot', 'def.matvec'],
  predicts: [
    {
      id: 'p-row',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ -1 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 2)$일 때 $A\mathbf{x}$의 **둘째 성분**만 구하려면 무엇이 있으면 되고, 그 값은?`,
      hints: [String.raw`[행렬-벡터 곱의 정의](n:def.matvec) $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2$에서 둘째 성분만 떼어 보라. 각 열의 **둘째 성분**만 쓰인다. 그 둘째 성분들을 모으면 $A$의 무엇이 되는가?`],
      choices: [String.raw`$A$의 둘째 행과 $\mathbf{x}$. 값은 1`, String.raw`$A$의 둘째 열과 $\mathbf{x}$. 값은 3`, String.raw`$A$ 전체. 값은 4`, String.raw`$A$의 둘째 행과 $\mathbf{x}$. 값은 −3`],
      answer: 0,
      why: [
        String.raw`$x_1a_{21} + x_2a_{22} = (-1)(1) + (1)(2) = 1$. 둘째 행 $(-1, 1)$과 $\mathbf{x}$의 내적이다.`,
        String.raw`둘째 **열** $(1, 1)$과 내적했다. 출력의 $i$번째 성분은 $i$번째 **행**에서 나온다. 행과 열의 혼동이다.`,
        String.raw`4는 첫째 성분이다. 둘째 성분은 둘째 행만으로 정해진다.`,
        String.raw`행은 맞지만 부호 계산이 틀렸다: $(-1)\cdot1 + 1\cdot2 = 1$.`,
      ],
    },
    {
      id: 'p-line',
      kind: 'choice',
      q: String.raw`$A$의 첫째 행이 $(1, 2)$이다. $A\mathbf{x}$의 첫째 성분이 0이 되는 입력 $\mathbf{x}$들은 평면에서 어떤 모양을 이룰까?`,
      hints: [String.raw`첫째 성분은 $(1, 2)\cdot\mathbf{x}$다. 내적이 0이라는 것은 무슨 뜻이었는가?`],
      choices: [String.raw`원점을 지나고 $(1, 2)$에 수직인 직선`, String.raw`$(1, 2)$ 방향의 직선`, '원점 한 점', '평면 전체'],
      answer: 0,
      why: [
        String.raw`$(1, 2)\cdot\mathbf{x} = 0$은 $\mathbf{x}$가 $(1, 2)$와 [직교](n:def.orthogonal)한다는 뜻이다. 그런 $\mathbf{x}$는 $(-2, 1)$ 방향의 직선을 이룬다. 6장에서 이 생각이 "[행공간](fwd:t.row-space)과 [영공간](fwd:t.null-space)은 직교한다"가 된다.`,
        String.raw`그 방향의 입력은 오히려 첫째 성분을 크게 만든다: $(1, 2)\cdot(1, 2) = 5$.`,
        String.raw`$(-2, 1)$도 첫째 성분이 0이다. 원점만이 아니다.`,
        String.raw`$(1, 0)$을 넣으면 첫째 성분이 1이다.`,
      ],
    },
  ],
  openWhys: [],
  body: String.raw`2장에서 [행렬-벡터 곱](t:t.matvec)을 "열들의 선형 결합"으로 정의했다. 그런데 학교에서는 "행 × 열"로 곱셈을 배웠을 것이다. 두 계산법은 어떻게 같은 답을 내는가?

::predict p-row

**명제.** $A\mathbf{x}$의 $i$번째 성분은 $A$의 $i$번째 행과 $\mathbf{x}$의 [내적](t:t.dot)이다.

$$(A\mathbf{x})_i = (A\text{의 } i\text{번째 행})\cdot\mathbf{x}$$

같은 출력을 두 눈으로 읽을 수 있다.
- **열의 관점**: 출력 = 열들을 $\mathbf{x}$의 성분만큼 섞은 것. 출력 공간에서 화살표를 이어 붙인다.
- **행의 관점**: 출력의 성분 하나하나 = 입력이 각 행과 얼마나 같은 쪽을 보는가(내적). 입력 공간에서 잰다.

::scene c3-row-col {}

그림 왼쪽은 열의 관점, 오른쪽은 행의 관점이다. 오른쪽의 두 점선은 "그 행과의 내적이 지금 값과 같은 점들"이 이루는 직선이고, 각 행에 수직이다. 두 직선이 만나는 점이 $\mathbf{x}$다.

::predict p-line

### 두 개의 예
- $A = \begin{bmatrix} 2 & 1 \\ -1 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 2)$: 행의 관점으로 $(2, 1)\cdot(1, 2) = 4$, $(-1, 1)\cdot(1, 2) = 1$이므로 $A\mathbf{x} = (4, 1)$. 열의 관점으로 $1\cdot(2, -1) + 2\cdot(1, 1) = (4, 1)$. 같다.
- 3×2 행렬 $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$과 $\mathbf{x} = (3, 4)$: 세 행과 내적하면 $(3, 4, 7)$. 행이 세 개이므로 출력의 성분도 셋이다.

> [!코드] 두 구현, 한 답
> \`matVec\`은 열의 관점으로, \`matVecRows\`는 행의 관점으로 계산한다. 테스트는 무작위 행렬 100개에서 두 함수의 답이 소수점 아래 12자리까지 같은지 확인한다. 2장의 미뤄 둔 질문, "학교에서 배운 행 × 열 계산은 정의와 어떻게 같은가?"의 답이 이 노드다.`,
  proof: String.raw`[행렬-벡터 곱의 정의](why:def.matvec)에 따라 $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + \cdots + x_n\mathbf{a}_n$이다. 이 벡터의 $i$번째 성분만 보면, 각 열 $\mathbf{a}_j$의 $i$번째 성분 $a_{ij}$에 $x_j$를 곱해 더한 것이다([벡터 덧셈과 스칼라 곱은 성분마다 한다](why:prop.add-componentwise)).

$$(A\mathbf{x})_i = x_1a_{i1} + x_2a_{i2} + \cdots + x_na_{in}$$

그런데 $(a_{i1}, a_{i2}, \dots, a_{in})$은 $A$의 $i$번째 행이다. 그러므로 오른쪽은 [내적의 정의](why:def.dot) 그대로 ($i$번째 행)$\cdot\mathbf{x}$다.`,
  code: ['matVecRows', 'matVec'],
};

export default node;
