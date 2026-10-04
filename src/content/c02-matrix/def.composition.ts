import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.composition',
  kind: 'def',
  title: '합성과 행렬 곱',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.composition', ko: '합성', en: 'composition', gloss: '한 변환을 한 뒤 이어서 다른 변환을 하는 것을 하나의 변환으로 본 것.' },
      { id: 't.matmul', ko: '행렬 곱', en: 'matrix multiplication', gloss: 'AB = "B를 먼저, 그다음 A"를 하는 합성 변환의 행렬.' },
    ],
  },
  requires: ['def.matvec'],
  predicts: [
    {
      id: 'p-two',
      kind: 'point',
      q: String.raw`먼저 가로로 2배 늘이고($B = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$), 그다음 시계 반대 방향 90° 돌린다($A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$). 두 단계를 마친 뒤 $\mathbf{e}_1$은 어디에 있을까?`,
      hints: [String.raw`한 단계씩 따라가라. 늘이기 뒤 $\mathbf{e}_1$은 $(2, 0)$이다. 이 화살표를 90° 돌리면?`],
      A: [[0, -1], [2, 0]],
      x: [1, 0],
      target: 'Ax',
      show: ['x'],
      reveal: String.raw`정답은 $(0, 2)$다. $(2, 0)$을 90° 돌리면 위쪽을 가리키는 길이 2짜리 화살표가 된다. 두 단계를 하나로 합친 변환의 첫째 열이 바로 이것이다.`,
    },
  ],
  body: String.raw`변환을 하나 하고 이어서 다른 변환을 하면, 그 전체도 하나의 변환이다. 두 변환이 모두 행렬로 적혀 있다면, 그 전체의 행렬은 무엇일까?

::predict p-two

**정의.** 변환 $B$를 먼저 하고 이어서 변환 $A$를 하는 것을 한 변환으로 본 것을 두 변환의 [합성](def:t.composition)이라 한다. 그 합성 변환의 행렬을 $AB$라 쓰고, $A$와 $B$의 [행렬 곱](def:t.matmul)이라 한다.

$$(AB)\mathbf{x} = A(B\mathbf{x})$$

**순서에 주의하라.** $AB$는 오른쪽의 $B$를 **먼저** 한다. 입력 $\mathbf{x}$에 가까운 쪽이 먼저 작용하기 때문이다. 함수를 $f(g(x))$로 쓰면 $g$가 먼저인 것과 같다.

::scene c2-compose {}

### 합성도 선형이다, 그래서 행렬이 있다
합성 변환이 행렬을 가지려면 선형이어야 한다([행렬은 선형 변환의 기저 도착지를 적은 것이므로](why:def.matrix)). 실제로 선형이다.

$$A(B(\mathbf{u} + \mathbf{w})) = A(B\mathbf{u} + B\mathbf{w}) = A(B\mathbf{u}) + A(B\mathbf{w})$$

첫 등호는 $B$가, 둘째 등호는 $A$가 [덧셈을 통과시키기](why:def.linear-map) 때문이다. 스칼라 곱도 같은 방식으로 통과한다. 그러므로 $AB$는 잘 정의된 행렬이다. 그 행렬의 열을 실제로 계산하는 법은 다음 노드에서 다룬다.

### 두 개의 예
- 위 관문: $B$(가로 2배) 다음 $A$(90° 회전). $\mathbf{e}_1 \to (2, 0) \to (0, 2)$, $\mathbf{e}_2 \to (0, 1) \to (-1, 0)$. 그러므로 $AB = \begin{bmatrix} 0 & -1 \\ 2 & 0 \end{bmatrix}$.
- 같은 회전을 두 번: $R_{90°}R_{90°}$는 $\mathbf{e}_1 \to \mathbf{e}_2 \to -\mathbf{e}_1$, $\mathbf{e}_2 \to -\mathbf{e}_1 \to -\mathbf{e}_2$이므로 $\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}$, 곧 180° 회전이다.`,
  checks: [
    {
      q: String.raw`$AB$와 "$A$를 먼저 한 뒤 $B$를 하는 것" 가운데 같은 것은?`,
      choices: ['어느 것도 같다고 할 수 없다. AB는 B를 먼저 한다', '같다. 왼쪽부터 읽는다', '같다. 순서는 상관없다'],
      answer: 0,
      explain: String.raw`$(AB)\mathbf{x} = A(B\mathbf{x})$이므로 $B$가 먼저다. "$A$ 먼저, 그다음 $B$"의 행렬은 $BA$다. 둘이 같은지는 다음다음 노드에서 다룬다(대개 다르다).`,
    },
  ],
};

export default node;
