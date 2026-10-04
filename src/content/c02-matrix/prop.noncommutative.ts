import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.noncommutative',
  kind: 'prop',
  title: '행렬 곱은 순서를 바꾸면 달라진다',
  status: 'written',
  requires: ['prop.matmul-columns', 'exp.gallery'],
  predicts: [
    {
      id: 'p-swap',
      kind: 'choice',
      q: String.raw`90° 회전 $R$과 가로 2배 늘이기 $D$가 있다. "$D$ 다음 $R$"($RD$)과 "$R$ 다음 $D$"($DR$)는 $\mathbf{e}_1$을 같은 곳으로 보낼까?`,
      hints: [String.raw`두 순서를 한 단계씩 따라가라. $RD$: $\mathbf{e}_1 \to (2, 0) \to$ ? $DR$: $\mathbf{e}_1 \to (0, 1) \to$ ?`],
      choices: ['다른 곳으로 보낸다', '같은 곳으로 보낸다. 같은 두 변환을 하므로', '같은 곳으로 보낸다. 넓이 배율이 같으므로'],
      answer: 0,
      why: [
        String.raw`$RD$는 $\mathbf{e}_1 \to (2, 0) \to (0, 2)$, $DR$은 $\mathbf{e}_1 \to (0, 1) \to (0, 1)$이다. 늘이기를 **돌리기 전에** 하면 가로 방향이 늘어나고, **돌린 뒤에** 하면 (원래 세로였던) 지금의 가로 방향이 늘어난다.`,
        String.raw`같은 재료라도 순서가 다르면 결과가 다를 수 있다. 양말을 신고 신발을 신는 것과 신발을 신고 양말을 신는 것이 다르듯이.`,
        String.raw`넓이 배율은 실제로 같다(둘 다 2배). 그러나 넓이가 같다고 변환이 같은 것은 아니다.`,
      ],
    },
    {
      id: 'p-center',
      kind: 'choice',
      q: String.raw`다음 가운데 **어떤 행렬과도** 순서를 바꿔 곱해도 같은($AM = MA$) 행렬 $M$은?`,
      hints: [
        String.raw`후보마다 반례를 찾아보라. 예를 들어 대각선 밖이 0인 $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$과 전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$을 두 순서로 곱해 보라.`,
        String.raw`"모든 방향을 똑같이 다루는" 변환이라면, 먼저 하든 나중에 하든 상관이 없을 것이다.`,
      ],
      choices: [String.raw`$2I$처럼 [항등 행렬](t:t.identity)의 수배`, '대각선 밖이 모두 0인 모든 행렬', '모든 회전 행렬', '넓이를 바꾸지 않는 모든 행렬'],
      answer: 0,
      why: [
        String.raw`$(cI)A = cA = A(cI)$이다. 모든 방향을 똑같이 $c$배 하므로 앞에서 하든 뒤에서 하든 같다.`,
        String.raw`$\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 2 \\ 0 & 1 \end{bmatrix}$이지만 반대 순서는 $\begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$이다. 대각선 밖이 0인 행렬끼리는 교환되지만, 아무 행렬과 교환되지는 않는다.`,
        String.raw`회전끼리는 교환되지만, 위 관문처럼 회전과 늘이기는 교환되지 않는다.`,
        String.raw`회전은 넓이를 바꾸지 않지만 늘이기와 교환되지 않는다.`,
      ],
    },
  ],
  body: String.raw`수의 곱셈은 순서를 바꿔도 같다($3 \times 5 = 5 \times 3$, [교환법칙](t:t.commutative)). [행렬 곱](t:t.matmul)도 그럴까?

::predict p-swap

**명제.** 행렬 곱은 일반적으로 교환법칙을 따르지 않는다. $AB \ne BA$인 행렬 $A$, $B$가 있다.

아래 그림은 위 관문의 두 변환이다. "순서 바꾸기"를 눌러 두 결과의 격자를 비교해 보라.

::scene c2-compose {"A": [[0, -1], [1, 0]], "B": [[2, 0], [0, 1]], "x": [1, 0]}

### 언제 교환되는가
교환되는 쌍도 있다. 기하로 생각하면 이유가 보인다.
- **회전끼리**: $\alpha$ 돌리고 $\beta$ 돌리는 것과 $\beta$ 돌리고 $\alpha$ 돌리는 것은 둘 다 $\alpha + \beta$ 돌리는 것이다.
- **축 방향 늘이기끼리**: 가로를 2배 하고 세로를 3배 하는 것은 순서와 상관없다.
- **[항등 행렬](t:t.identity)의 수배와는 무엇이든**: 아래 관문.

::predict p-center

> [!직관] 그래서 순서를 읽는 습관이 중요하다
> 행렬 곱이 나오면 오른쪽부터, 곧 입력에 가까운 쪽부터 읽는다. $AB\mathbf{x}$는 "$\mathbf{x}$에 $B$를 하고, 그다음 $A$를 한다"이다. 9장의 $U\Sigma V^{\mathsf{T}}$도 이 습관으로 읽는다.`,
  proof: String.raw`반례 하나로 충분하다. $R = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$, $D = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$이라 하자. [열마다 곱하면](why:prop.matmul-columns)

$$RD = \begin{bmatrix} 0 & -1 \\ 2 & 0 \end{bmatrix}, \qquad DR = \begin{bmatrix} 0 & -2 \\ 1 & 0 \end{bmatrix}$$

이고, 첫째 열부터 $(0, 2) \ne (0, 1)$이다.`,
};

export default node;
