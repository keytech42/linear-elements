import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.det',
  kind: 'def',
  title: '행렬식: 부호 있는 넓이 배율',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.determinant', ko: '행렬식', en: 'determinant', gloss: '변환이 넓이(3차원에서는 부피)를 몇 배로 만드는지, 그리고 방향을 뒤집는지를 부호까지 담은 수.' },
      { id: 't.orientation', ko: '향', en: 'orientation', boundary: true, everyMention: true, gloss: 'e₁에서 e₂로 짧게 도는 쪽이 시계 반대 방향인지 시계 방향인지. 거울에 비추면 바뀐다.' },
    ],
    symbols: [{ tex: String.raw`\det A`, meaning: '행렬 A의 행렬식' }],
  },
  requires: ['ax.area', 'def.matrix'],
  predicts: [
    {
      id: 'p-shear',
      kind: 'choice',
      q: String.raw`전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$은 단위 정사각형을 넓이 몇인 도형으로 보낼까?`,
      hints: [String.raw`두 열 $(1, 0)$, $(1, 1)$이 만드는 평행사변형의 밑변과 높이는? [평행사변형의 넓이는 밑변 × 높이였다](n:ax.area).`],
      choices: ['1', '2', String.raw`$\sqrt{2}$`, '0'],
      answer: 0,
      why: [
        String.raw`밑변 1(가로축 위), 높이 1. 전단은 모양을 비스듬히 만들 뿐 넓이를 바꾸지 않는다.`,
        String.raw`두 열의 길이를 곱한 $1 \times \sqrt{2}$도 아니고 성분의 합도 아니다. 넓이는 밑변 × 높이다.`,
        String.raw`$\sqrt{2}$는 둘째 열(옆변)의 길이다. 넓이를 정하는 것은 옆변이 아니라 높이다.`,
        String.raw`납작해지지 않았다. 두 열이 같은 직선 위에 있지 않다.`,
      ],
    },
    {
      id: 'p-mirror',
      kind: 'choice',
      q: String.raw`대각선 $y = x$에 비치는 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$의 행렬식은?`,
      hints: [
        String.raw`단위 정사각형은 자기 자신으로 간다(넓이 1). 그런데 주황 $\mathbf{e}_1$과 청록 $\mathbf{e}_2$는 각각 어디로 가는가?`,
        String.raw`변환 전에는 주황에서 청록으로 시계 반대 방향으로 90° 돌면 된다. 변환 뒤에는 어느 쪽으로 돌아야 하는가?`,
      ],
      choices: ['−1', '1', '0', '2'],
      answer: 0,
      why: [
        String.raw`넓이는 그대로(1)지만 주황과 청록이 자리를 바꿔 도는 방향이 뒤집혔다. 그래서 $-1$이다.`,
        String.raw`넓이만 보면 1배다. 그러나 행렬식은 **뒤집혔는지**도 담는다. 거의 맞는 답이다.`,
        String.raw`넓이는 0이 아니다. 정사각형이 그대로 정사각형이다.`,
        String.raw`넓이는 변하지 않았다.`,
      ],
    },
  ],
  body: String.raw`[변환 도감](n:exp.gallery)에서 행렬을 볼 때마다 물어볼 질문 첫째를 이렇게 적었다. "넓이는 몇 배가 되는가? 뒤집히는가?" 이 두 답을 수 하나로 담을 수 있을까?

[행렬](t:t.matrix) $A$는 단위 정사각형(꼭짓점 $\mathbf{0}, \mathbf{e}_1, \mathbf{e}_1 + \mathbf{e}_2, \mathbf{e}_2$)을 두 열 $\mathbf{a}_1, \mathbf{a}_2$가 만드는 평행사변형으로 보낸다([격자가 고르게 남으므로](why:prop.linear-grid)).

**정의.** $A$의 [행렬식](def:t.determinant) $\det A$는, 단위 정사각형이 옮겨 간 평행사변형의 넓이에 부호를 붙인 수다.
- $\mathbf{a}_1$에서 $\mathbf{a}_2$로 짧게 도는 쪽이 $\mathbf{e}_1$에서 $\mathbf{e}_2$로 도는 쪽과 같으면(시계 반대 방향) **양수**,
- 반대(시계 방향)이면 **음수**,
- 평행사변형이 납작해지면(두 열이 한 직선 위에 있으면) **0**이다.

"도는 쪽"을 [향(向)](def:t.orientation)이라 부른다. 왼손과 오른손의 차이와 같다. 거울에 비추면 바뀌고, 돌리기만 해서는 바뀌지 않는다.

::scene c4-signed-area {}

두 열의 끝을 끌어 보라. 평행사변형이 노랑이면 향이 유지된 것(양수), 빨강이면 뒤집힌 것(음수)이다. 원점 근처의 작은 호 두 개가 도는 방향을 비교해 준다.

::predict p-shear

::predict p-mirror

### 두 개의 예
- $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$: 가로 2, 세로 3인 직사각형. 향은 그대로이므로 $\det = 6$.
- $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$(가로축 반사): 넓이 1, 향이 뒤집힌다. $\det = -1$.

> [!질문] 단위 정사각형 하나만 보고 정의해도 되는가?
> 행렬식은 단위 정사각형의 넓이 배율로 정의했다. 그런데 원이나 삼각형 같은 다른 도형의 넓이도 같은 배율로 바뀔까? 그렇지 않다면 "넓이 배율"이라는 이름이 지나치다. 다음 노드가 이 질문에 답한다.`,
  checks: [
    {
      q: String.raw`90° 회전 $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$의 행렬식은?`,
      choices: ['1', '−1', '0', '90'],
      answer: 0,
      explain: String.raw`정사각형이 돌아갈 뿐 넓이는 1이고, 돌리기는 향을 바꾸지 않는다(주황에서 청록으로 여전히 시계 반대 방향). 반사와 회전은 넓이를 모두 지키지만, 행렬식의 부호가 둘을 구별한다.`,
    },
  ],
};

export default node;
