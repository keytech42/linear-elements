import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.matvec',
  kind: 'def',
  title: '행렬 × 벡터 = 열들의 선형 결합',
  status: 'written',
  introduces: {
    terms: [{ id: 't.matvec', ko: '행렬-벡터 곱', en: 'matrix–vector product', gloss: 'A𝐱 = x₁𝐚₁ + x₂𝐚₂ + … : 𝐱의 성분을 계수로 삼아 A의 열들을 선형 결합한 것.' }],
    symbols: [{ tex: String.raw`\mathbf{x}`, meaning: '변환에 넣는 입력 벡터', note: '성분은 x₁, x₂' }],
  },
  requires: ['def.matrix'],
  openWhys: [{ q: '학교에서 배운 "행 × 열" 계산법은 이 정의와 어떻게 같은가?', answeredBy: 'prop.row-picture' }],
  predicts: [
    {
      id: 'p-ax',
      kind: 'point',
      q: String.raw`어떤 변환이 $\mathbf{e}_1$을 $(1, 0)$으로, $\mathbf{e}_2$를 $(1, 1)$로 보낸다(주황, 청록 화살표). 그렇다면 $\mathbf{x} = (2, 1)$(노랑)은 어디로 갈까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`$\mathbf{x} = (2, 1)$을 표준 기저로 적으면 $2\mathbf{e}_1 + 1\mathbf{e}_2$다. [선형 변환은 이 결합을 그대로 유지한다](n:prop.basis-determines).`,
        String.raw`그러므로 도착지는 \"$\mathbf{e}_1$의 도착지 2개\" + \"$\mathbf{e}_2$의 도착지 1개\"다. 주황 화살표를 두 번 이어 붙인 끝에서 청록 화살표를 하나 더 이어 붙여 보라.`,
      ],
      A: [[1, 1], [0, 1]],
      x: [2, 1],
      target: 'Ax',
      show: ['cols', 'x'],
      reveal: String.raw`정답은 $(3, 1)$이다. $\mathbf{x} = 2\mathbf{e}_1 + 1\mathbf{e}_2$이므로 도착지도 $2\cdot(1, 0) + 1\cdot(1, 1)$이다. $(2, 1)$ 근처에 놓았다면 변환이 $\mathbf{x}$를 움직이지 않는다고 본 것이다. 아래에서 이 계산이 왜 **언제나** 맞는지 정리한다.`,
    },
  ],
  body: String.raw`[행렬](t:t.matrix) $A$와 벡터 $\mathbf{x}$가 있다. $A$가 나타내는 변환은 $\mathbf{x}$를 어디로 보낼까?

::predict p-ax

입력 벡터를 $\mathbf{x}$, 그 성분을 $x_1$, $x_2$라고 쓰자. 출발점은 두 사실이다.

- 모든 벡터는 표준 기저의 선형 결합으로 쓸 수 있다: $\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2$. [왜 이렇게 쓸 수 있고, 왜 계수가 하나로 정해지는가?](why:prop.coords-unique)
- 선형 변환은 선형 결합을 그대로 유지한다: $T(x_1\mathbf{e}_1 + x_2\mathbf{e}_2) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2)$. [왜?](why:prop.basis-determines)

그런데 $T(\mathbf{e}_1)$과 $T(\mathbf{e}_2)$는 [행렬의 정의](n:def.matrix)에 따라 $A$의 첫째 열 $\mathbf{a}_1$과 둘째 열 $\mathbf{a}_2$다. 두 사실을 이으면 다음 식이 나온다.

$$\h{Ax}{\cy{A\mathbf{x}}} = \h{x1a1}{\cx{x_1}\,\ca{\mathbf{a}_1}} + \h{x2a2}{\cx{x_2}\,\cb{\mathbf{a}_2}}$$

**정의.** 행렬 $A$와 벡터 $\mathbf{x}$의 [행렬-벡터 곱](def:t.matvec) $A\mathbf{x}$는, $\mathbf{x}$의 성분 $x_1, x_2$를 [계수](t:t.coefficient)로 삼아 $A$의 열 $\mathbf{a}_1, \mathbf{a}_2$를 [선형 결합](t:t.linear-combination)한 벡터다.

한 문장으로 줄이면 이렇다. **행렬은 열들을 담고 있고, 벡터는 그 열들을 얼마씩 섞을지를 담고 있다.**

::scene transform-grid {"A": [[1, 1], [0, 1]], "x": [2, 1]}

그림에서 노란 화살표가 입력 $\mathbf{x}$, 분홍 화살표가 출력 $A\mathbf{x}$다. 점선 두 개는 $x_1\mathbf{a}_1$(주황)과 그 끝에 이어 붙인 $x_2\mathbf{a}_2$(청록)다. 두 점선을 [이어 붙인](t:t.vector-add) 끝이 정확히 분홍 화살표의 끝과 만난다. 위 식의 각 항에 마우스를 올리면 그림의 해당 화살표가 빛난다.

### 성분으로 풀어 쓰기
$$\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = x_1 \begin{bmatrix} a_{11} \\ a_{21} \end{bmatrix} + x_2 \begin{bmatrix} a_{12} \\ a_{22} \end{bmatrix} = \begin{bmatrix} a_{11}x_1 + a_{12}x_2 \\ a_{21}x_1 + a_{22}x_2 \end{bmatrix}$$

첫째 등호가 정의이고, 둘째 등호는 [스칼라 곱과 벡터 덧셈을 성분별로 계산](why:prop.add-componentwise)한 것이다.

### 두 개의 예
- [전단](fwd:t.shear) $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $\mathbf{x} = (2, 1)$: $\;2\begin{bmatrix} 1 \\ 0 \end{bmatrix} + 1\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \end{bmatrix}$. 위 그림의 처음 상태와 같다.
- 90° 회전 $A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$, $\mathbf{x} = (2, 1)$: $\;2\begin{bmatrix} 0 \\ 1 \end{bmatrix} + 1\begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 2 \end{bmatrix}$. 화살표 $(2, 1)$을 시계 반대 방향으로 90° 돌리면 실제로 $(-1, 2)$가 된다. 그림의 행렬 칸을 바꿔 직접 확인해 보라.

### 거꾸로: 아무 행렬이나 선형 변환을 만든다
지금까지는 선형 변환에서 출발해 행렬을 얻었다. 반대 방향도 성립한다. 숫자 네 개를 아무렇게나 적은 표 $A$를 가져와 위 정의대로 $\mathbf{x} \mapsto A\mathbf{x}$라는 변환을 만들면, 그 변환은 언제나 선형이다. 두 입력 $\mathbf{u}$, $\mathbf{w}$를 더해서 넣어 보자.

$$A(\mathbf{u} + \mathbf{w}) = (u_1 + w_1)\mathbf{a}_1 + (u_2 + w_2)\mathbf{a}_2 = (u_1\mathbf{a}_1 + u_2\mathbf{a}_2) + (w_1\mathbf{a}_1 + w_2\mathbf{a}_2) = A\mathbf{u} + A\mathbf{w}$$

가운데 등호에서 쓴 것은 [벡터 계산 규칙](why:prop.vector-rules)(스칼라 곱의 분배와 덧셈의 교환·결합)뿐이다. 스칼라 곱 $A(c\mathbf{x}) = cA\mathbf{x}$도 같은 방식으로 확인된다. 그래서 **평면의 선형 변환과 2×2 행렬은 하나씩 정확히 짝지어진다**. 앞으로 둘을 같은 것의 두 이름처럼 쓴다.

> [!코드] 정의가 곧 구현이다
> 아래 "이 노드의 코드"에 있는 \`matVec\`은 이 정의를 한 줄씩 옮긴 것이다. 열을 하나씩 꺼내(\`col\`) 성분을 계수로 삼아 선형 결합(\`linComb\`)한다. 학교에서 배운 "행 × 열" 계산을 쓰지 않았다는 점에 주목하라. 그 계산법이 왜 같은 답을 내는지는 3장에서 증명한다.`,
  checks: [
    {
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, $\mathbf{x} = (1, 0)$일 때 $A\mathbf{x}$는?`,
      choices: [String.raw`$(1, 3)$`, String.raw`$(1, 2)$`, String.raw`$(3, 7)$`, String.raw`$(4, 6)$`],
      answer: 0,
      explain: String.raw`$A\mathbf{x} = 1\cdot\mathbf{a}_1 + 0\cdot\mathbf{a}_2 = \mathbf{a}_1 = (1, 3)$. 일반적으로 $A\mathbf{e}_j$는 $A$의 $j$번째 열이다. 이것이 [행렬의 정의](n:def.matrix) 그 자체다. $(1, 2)$는 첫째 행을 읽은 것이다.`,
    },
    {
      q: String.raw`$A\mathbf{x}$를 "$\mathbf{x}$의 성분으로 $A$의 열을 섞은 것"으로 정의할 수 있는 근거는?`,
      choices: ['선형 변환은 선형 결합을 그대로 유지하고, 열은 기저의 도착지이기 때문', '이렇게 계산하는 편이 빠르기 때문', '수학자들이 그렇게 정했기 때문(근거 없음)'],
      answer: 0,
      explain: String.raw`$\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2$이고, 선형 변환은 이 결합을 유지하므로 $T(\mathbf{x}) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2)$다. 열이 $T(\mathbf{e}_j)$이므로 식이 정해진다. 계산 속도와는 관계가 없다. 그리고 "정했기 때문"은 반만 맞는다. 행렬을 세로로 적는 것은 규약이지만, 규약을 정한 뒤 곱셈의 모양은 선형성에서 저절로 나온다.`,
    },
  ],
  code: ['matVec', 'col', 'linComb'],
};

export default node;
