import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.identity',
  kind: 'def',
  title: '항등 행렬',
  status: 'written',
  introduces: {
    terms: [{ id: 't.identity', ko: '항등 행렬', en: 'identity matrix', gloss: '모든 벡터를 제자리에 두는 변환의 행렬. 열 = 표준 기저 그대로.' }],
    symbols: [{ tex: 'I', meaning: '항등 행렬' }],
  },
  requires: ['def.matrix'],
  predicts: [
    {
      id: 'p-unique',
      kind: 'choice',
      q: String.raw`어떤 행렬 $M$이 **모든** 행렬 $A$에 대해 $MA = A$를 만족한다. $M$은 무엇일까?`,
      hints: [String.raw`"모든 $A$"이므로 아주 특별한 $A$를 골라 넣어도 된다. 어떤 $A$를 넣으면 $M$이 그대로 드러나는가?`],
      choices: [String.raw`$I$뿐이다`, '대각선 밖이 0인 행렬이면 무엇이든 된다', '넓이를 바꾸지 않는 행렬이면 무엇이든 된다', '그런 행렬은 여러 개다'],
      answer: 0,
      why: [
        String.raw`$A = I$를 넣으면 $MI = I$이고, $MI = M$이므로 $M = I$다.`,
        String.raw`$\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}A$는 $A$의 첫째 행을 2배 한다. $A$와 같지 않다.`,
        String.raw`90° 회전은 넓이를 바꾸지 않지만 $R_{90°}A$는 $A$를 돌린 것이다.`,
        String.raw`$A = I$를 넣어 보면 하나로 정해진다.`,
      ],
    },
  ],
  body: String.raw`수의 세계에서 1은 곱해도 아무것도 바꾸지 않는다. 행렬의 세계에서 그런 역할을 하는 것은 무엇일까?

**정의.** 모든 벡터를 제자리에 두는 변환의 행렬을 [항등 행렬](def:t.identity)이라 하고 $I$로 쓴다. 이 변환은 $\mathbf{e}_1$을 $\mathbf{e}_1$로, $\mathbf{e}_2$를 $\mathbf{e}_2$로 보내므로, [행렬의 정의](why:def.matrix)에 따라

$$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

이다. 3차원이면 대각선에 1이 셋 놓인다.

$I$는 "아무것도 하지 않는 변환"이므로 앞에 하든 뒤에 하든 결과가 같다: $AI = IA = A$. [합성](t:t.composition)으로 읽으면 "아무것도 안 한 뒤 $A$" = "$A$ 한 뒤 아무것도 안 함" = "$A$"다.

::predict p-unique

### 두 개의 예
- $I\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2 = \mathbf{x}$. 행렬-벡터 곱의 정의 그대로다.
- $\begin{bmatrix} 3 & 1 \\ 2 & 5 \end{bmatrix}I$: 열마다 $I$의 열을 곱하므로 첫째 열은 $\begin{bmatrix} 3 & 1 \\ 2 & 5 \end{bmatrix}\mathbf{e}_1 = (3, 2)$, 둘째 열은 $(1, 5)$로 원래 행렬과 같다.

$I$는 5장의 [역행렬](fwd:t.inverse)에서 "되돌렸을 때 도착해야 하는 곳"이 된다.`,
  code: ['identity'],
};

export default node;
