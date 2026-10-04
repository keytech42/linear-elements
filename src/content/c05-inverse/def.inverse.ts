import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.inverse',
  kind: 'def',
  title: '역행렬: 변환을 되돌리는 변환',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.inverse', ko: '역행렬', en: 'inverse matrix', gloss: 'A가 한 일을 정확히 되돌리는 행렬. A⁻¹A = AA⁻¹ = I.' },
      { id: 't.invertible', ko: '가역', en: 'invertible', surfaces: ['가역 행렬'], gloss: '역행렬이 있는 것.' },
    ],
    symbols: [{ tex: 'A^{-1}', meaning: '행렬 A의 역행렬' }],
  },
  requires: ['def.identity', 'def.composition'],
  predicts: [
    {
      id: 'p-undo',
      kind: 'point',
      q: String.raw`전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$(위쪽을 오른쪽으로 미는 변환)을 **되돌리는** 변환은 $\mathbf{e}_2$를 어디로 보낼까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`전단은 높이가 1인 점을 오른쪽으로 1만큼 민다. 되돌리는 변환은 높이가 1인 점을 어느 쪽으로 얼마나 밀어야 하는가?`,
        String.raw`되돌리는 변환은 높이는 건드리지 않는다. $\mathbf{e}_2 = (0, 1)$의 높이는 1이다.`,
      ],
      A: [[1, -1], [0, 1]],
      x: [0, 1],
      target: 'Ax',
      show: ['x'],
      reveal: String.raw`정답은 $(-1, 1)$이다. 되돌리는 변환은 위쪽을 **왼쪽으로** 미는 전단 $\begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}$이다. 둘을 곱하면 $I$가 된다.`,
    },
    {
      id: 'p-rot',
      kind: 'choice',
      q: String.raw`30° 회전 $R_{30°}$의 역행렬은?`,
      hints: [String.raw`30° 돌린 것을 되돌리려면 어느 쪽으로 몇 도 돌려야 하는가? 그리고 [회전의 전치는 무엇이었는가?](n:def.transpose)`],
      choices: [String.raw`$R_{-30°}$, 곧 $R_{30°}^{\mathsf{T}}$`, String.raw`$R_{60°}$`, String.raw`$-R_{30°}$`, String.raw`$R_{30°}$ 그대로`],
      answer: 0,
      why: [
        String.raw`시계 방향으로 30° 돌리면 제자리다. 3장에서 본 대로 그것은 $R_{30°}$의 전치와 같다. 이 일치는 우연이 아니다(이 장의 넷째 노드).`,
        String.raw`$30° + 60° = 90°$다. 되돌리려면 합이 0°여야 한다.`,
        String.raw`$-R_{30°}$는 30° 돌린 뒤 180° 더 돌린 것(210° 회전)이다.`,
        String.raw`두 번 하면 60° 돌아간다.`,
      ],
    },
  ],
  body: String.raw`변환 $A$를 한 뒤, 그 결과를 보고 원래 입력으로 **되돌릴** 수 있을까? 되돌리는 변환도 행렬일까?

**정의.** 정사각 행렬 $A$에 대해 $A^{-1}A = I$이고 $AA^{-1} = I$인 행렬 $A^{-1}$이 있으면, $A^{-1}$을 $A$의 [역행렬](def:t.inverse)이라 하고, $A$를 [가역](def:t.invertible) 행렬이라 한다.

[합성](t:t.composition)으로 읽으면 "$A$를 한 뒤 $A^{-1}$을 하면 아무것도 안 한 것과 같고, 순서를 바꿔도 그렇다"는 뜻이다. [항등 행렬](t:t.identity)이 "아무것도 안 함"이다.

::scene c5-undo {}

"▶ 끝까지"를 누르면 격자가 $A$로 밀렸다가 $A^{-1}$로 정확히 제자리로 돌아온다.

::predict p-undo

### 되돌리는 변환도 선형이다
$A$가 선형이고 되돌릴 수 있다면, 되돌리는 변환 $S$도 선형이다. 아무 두 출력 $\mathbf{u}$, $\mathbf{w}$를 생각하자. 각각 $\mathbf{u} = A\mathbf{p}$, $\mathbf{w} = A\mathbf{q}$인 입력 $\mathbf{p} = S\mathbf{u}$, $\mathbf{q} = S\mathbf{w}$가 있다. [A는 덧셈을 통과시키므로](why:def.linear-map) $\mathbf{u} + \mathbf{w} = A(\mathbf{p} + \mathbf{q})$이고, 그래서 $S(\mathbf{u} + \mathbf{w}) = \mathbf{p} + \mathbf{q} = S\mathbf{u} + S\mathbf{w}$다. 스칼라 곱도 같은 방식이다. 그러므로 되돌리는 변환도 [행렬](t:t.matrix)로 적힌다. 그것이 $A^{-1}$이다.

::predict p-rot

### 두 개의 예
- 가로 2배 $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$의 역행렬은 가로 절반 $\begin{bmatrix} 0.5 & 0 \\ 0 & 1 \end{bmatrix}$이다.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$의 역행렬은 자기 자신이다. 두 번 뒤집으면 제자리다.

모든 행렬이 되돌릴 수 있는 것은 아니다. 사영처럼 평면을 납작하게 누르는 행렬은 어떻게 될까? 다음 노드의 질문이다.`,
  checks: [
    {
      q: String.raw`$A^{-1}$이 있을 때 $(A^{-1})^{-1}$은?`,
      choices: [String.raw`$A$`, String.raw`$A^{-1}$`, String.raw`$I$`, '정해지지 않는다'],
      answer: 0,
      explain: String.raw`정의의 두 식 $A^{-1}A = I$, $AA^{-1} = I$를 "$A^{-1}$의 역행렬은 $A$"로 읽을 수 있다. 되돌리는 것을 되돌리면 원래 변환이다.`,
    },
  ],
};

export default node;
