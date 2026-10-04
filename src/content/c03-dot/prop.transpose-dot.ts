import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.transpose-dot',
  kind: 'prop',
  title: '전치의 정체: (Ax)·y = x·(Aᵀy)',
  status: 'written',
  requires: ['def.transpose'],
  predicts: [
    {
      id: 'p-same',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 1)$, $\mathbf{y} = (2, -1)$이다. $(A\mathbf{x})\cdot\mathbf{y} = 5$다. 그렇다면 $\mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$는?`,
      hints: [String.raw`직접 계산해 보라. $A^{\mathsf{T}} = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$이므로 $A^{\mathsf{T}}\mathbf{y} = (2,\ 4 - 1)$이다. 그다음 $\mathbf{x}$와 내적.`],
      choices: ['5', '3', '−5', '계산해 보기 전에는 아무 관계도 없다'],
      answer: 0,
      why: [
        String.raw`$A^{\mathsf{T}}\mathbf{y} = (2, 3)$, $(1, 1)\cdot(2, 3) = 5$. 우연이 아니다. 아래 명제가 언제나 같다고 말한다.`,
        String.raw`$A^{\mathsf{T}}\mathbf{y}$의 성분 하나만 더했다.`,
        String.raw`부호가 바뀔 이유가 없다. 전치는 뒤집기가 아니다.`,
        String.raw`언제나 같다. 이것이 전치의 정체다.`,
      ],
    },
    {
      id: 'p-order',
      kind: 'choice',
      q: String.raw`$(AB)^{\mathsf{T}}$는 무엇과 같을까?`,
      hints: [
        String.raw`$((AB)\mathbf{x})\cdot\mathbf{y} = (A(B\mathbf{x}))\cdot\mathbf{y}$에 이 노드의 식을 써서, $A$를 $\mathbf{y}$ 쪽으로 넘겨 보라.`,
        String.raw`$(B\mathbf{x})\cdot(A^{\mathsf{T}}\mathbf{y})$가 된다. 한 번 더, 이번에는 $B$를 넘겨라.`,
      ],
      choices: [String.raw`$B^{\mathsf{T}}A^{\mathsf{T}}$`, String.raw`$A^{\mathsf{T}}B^{\mathsf{T}}$`, String.raw`$AB$`, String.raw`$BA$`],
      answer: 0,
      why: [
        String.raw`$\mathbf{x}\cdot(B^{\mathsf{T}}(A^{\mathsf{T}}\mathbf{y}))$가 되므로 $\mathbf{y}$에 $A^{\mathsf{T}}$를 먼저, $B^{\mathsf{T}}$를 나중에 한다. 곧 $B^{\mathsf{T}}A^{\mathsf{T}}$다. 넘기는 순서대로 쌓이므로 순서가 뒤집힌다.`,
        String.raw`순서를 그대로 둔 것이다. 2×2에서 아무 예로 계산해 보면 대개 다르다. 거의 맞는 답이다.`,
        String.raw`전치를 빠뜨렸다.`,
        String.raw`순서는 뒤집혔지만 각각을 전치하지 않았다.`,
      ],
    },
  ],
  body: String.raw`[전치](t:t.transpose)는 숫자 배치로 정의했다. 그 기하적인 뜻은 무엇일까? [내적](t:t.dot)이 그 답을 준다.

::predict p-same

**명제.** 모든 $\mathbf{x}$, $\mathbf{y}$에 대해

$$(A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$$

이다. 그리고 $(AB)^{\mathsf{T}} = B^{\mathsf{T}}A^{\mathsf{T}}$이다.

### 읽는 법: 재는 자리를 옮긴다
왼쪽은 "$\mathbf{x}$를 $A$로 출력 공간에 보낸 뒤, 거기서 $\mathbf{y}$와 잰다"이다. 오른쪽은 "$\mathbf{y}$를 $A^{\mathsf{T}}$로 **입력 공간에** 보낸 뒤, 거기서 $\mathbf{x}$와 잰다"이다. 두 값이 언제나 같다. $A$가 입력을 출력 쪽으로 보낸다면, $A^{\mathsf{T}}$는 출력 쪽의 "재는 방향"을 입력 쪽으로 가져온다. $A$가 $m \times n$이면 $A^{\mathsf{T}}$는 $n \times m$이라 방향이 정확히 반대인 것도 이 때문이다.

::scene c3-transpose {}

::predict p-order

### 두 개의 예
- 위 관문: $A\mathbf{x} = (3, 1)$이고 $(3, 1)\cdot(2, -1) = 5$. $A^{\mathsf{T}}\mathbf{y} = (2, 3)$이고 $(1, 1)\cdot(2, 3) = 5$.
- $A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$(90° 회전): $(A\mathbf{x})\cdot\mathbf{y}$는 "$\mathbf{x}$를 90° 돌린 것과 $\mathbf{y}$의 내적"이다. $A^{\mathsf{T}}$는 −90° 회전이므로 오른쪽은 "$\mathbf{y}$를 거꾸로 90° 돌린 것과 $\mathbf{x}$의 내적"이다. 두 벡터 사이의 각은 둘 중 어느 쪽을 돌려도 같은 만큼 바뀐다.`,
  proof: String.raw`**내적 등식.** [행의 관점](why:prop.row-picture)으로 $(A\mathbf{x})_i = \sum_j a_{ij}x_j$이므로

$$(A\mathbf{x})\cdot\mathbf{y} = \sum_i\Big(\sum_j a_{ij}x_j\Big)y_i = \sum_j x_j\Big(\sum_i a_{ij}y_i\Big)$$

이다. 가운데에서 오른쪽으로는 [분배·교환·결합법칙](why:ax.arith)으로 같은 항들을 다른 순서로 묶었을 뿐이다($\sum$는 "모두 더한다"를 줄여 쓴 것이다). 그런데 $\sum_i a_{ij}y_i = \sum_i (A^{\mathsf{T}})_{ji}y_i = (A^{\mathsf{T}}\mathbf{y})_j$이다. 그러므로 오른쪽은 $\mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$다.

**곱의 전치.** 아무 $\mathbf{x}$, $\mathbf{y}$에서, 내적 등식을 두 번 쓰면

$$\mathbf{x}\cdot\big((AB)^{\mathsf{T}}\mathbf{y}\big) = ((AB)\mathbf{x})\cdot\mathbf{y} = (A(B\mathbf{x}))\cdot\mathbf{y} = (B\mathbf{x})\cdot(A^{\mathsf{T}}\mathbf{y}) = \mathbf{x}\cdot\big(B^{\mathsf{T}}A^{\mathsf{T}}\mathbf{y}\big)$$

이다. 이 등식에 $\mathbf{x} = \mathbf{e}_j$를 넣으면 양쪽 벡터의 $j$번째 성분이 같다($\mathbf{e}_j\cdot\mathbf{w} = w_j$이므로). 모든 $j$와 모든 $\mathbf{y}$에서 그러므로 $(AB)^{\mathsf{T}}\mathbf{y} = B^{\mathsf{T}}A^{\mathsf{T}}\mathbf{y}$이고, 두 행렬은 같다.`,
};

export default node;
