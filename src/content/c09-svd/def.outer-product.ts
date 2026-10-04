import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.outer-product',
  kind: 'def',
  title: '바깥곱: 랭크 1 행렬',
  status: 'written',
  introduces: { terms: [{ id: 't.outer-product', ko: '바깥곱', en: 'outer product', gloss: '열벡터 × 행벡터 = 𝐮𝐯ᵀ. 랭크가 1인 행렬: 입력을 한 방향(𝐯)으로만 읽고, 한 방향(𝐮)으로만 내보낸다.' }] },
  requires: ['def.rank', 'def.transpose', 'prop.row-picture'],
  predicts: [
    {
      id: 'p-line',
      kind: 'choice',
      q: String.raw`$\mathbf{u} = (1, 2)$, $\mathbf{v} = (1, 0.5)$일 때 행렬 $\mathbf{u}\mathbf{v}^{\mathsf{T}}$는 평면 전체를 무엇으로 보낼까?`,
      choices: [String.raw`$\mathbf{u}$ 방향의 직선 하나`, String.raw`$\mathbf{v}$ 방향의 직선 하나`, '평면 전체 (모양만 바뀐다)', '원점 한 점'],
      answer: 0,
      why: [
        String.raw`열의 관점으로 보면 모든 열이 $\mathbf{u}$의 배수다. 아래에서 세 관점으로 확인한다.`,
        String.raw`$\mathbf{v}$는 입력을 "읽는" 방향이다. 출력은 모두 $\mathbf{u}$의 배수다.`,
        String.raw`두 열이 모두 $\mathbf{u}$의 배수라서 평면을 펼칠 수 없다.`,
        String.raw`$\mathbf{v}$에 수직인 입력만 원점으로 간다. 나머지 입력은 $\mathbf{u}$ 직선 위의 다른 점으로 간다.`,
      ],
    },
  ],
  body: String.raw`[랭크](t:t.rank)가 가장 작은(0이 아닌) 행렬은 어떻게 생겼는가? 그리고 그런 행렬은 입력에 무슨 일을 하는가?

열벡터 $\mathbf{u}$($m$개 성분)와 열벡터 $\mathbf{v}$($n$개 성분)가 있다. $\mathbf{v}$를 [전치](t:t.transpose)하면 행이 하나뿐인 $1 \times n$ 행렬 $\mathbf{v}^{\mathsf{T}}$가 된다. $\mathbf{u}$는 열이 하나뿐인 $m \times 1$ 행렬로 볼 수 있다. 두 행렬의 곱 $\mathbf{u}\mathbf{v}^{\mathsf{T}}$는 [안쪽 차원이 1로 맞으므로](why:prop.shape-rule) 정의되고, 모양은 $m \times n$이다.

**정의.** $\mathbf{u}\mathbf{v}^{\mathsf{T}}$를 $\mathbf{u}$와 $\mathbf{v}$의 [바깥곱](def:t.outer-product)이라 한다. 그 $i$행 $j$열 성분은 $u_i v_j$다. (내적 $\mathbf{v}^{\mathsf{T}}\mathbf{u}$는 $1\times1$, 곧 수 하나인 것과 대조된다. 같은 두 벡터를 곱하는 순서만 바꿨는데 하나는 수, 하나는 행렬이 된다.)

::predict p-line

### 세 가지 관점으로 읽기
예: $\mathbf{u} = (1, 2)$, $\mathbf{v} = (1, 0.5)$이면 $\mathbf{u}\mathbf{v}^{\mathsf{T}} = \begin{bmatrix} 1 & 0.5 \\ 2 & 1 \end{bmatrix}$이다.

- **열의 관점:** $j$번째 열은 $v_j\mathbf{u}$다. 예에서 1열 $(1, 2) = 1\cdot\mathbf{u}$, 2열 $(0.5, 1) = 0.5\cdot\mathbf{u}$. 모든 열이 $\mathbf{u}$의 배수이므로 [열공간](t:t.column-space)은 $\mathbf{u}$ 방향의 직선 하나다. 그래서 랭크가 1이다.
- **행의 관점:** $i$번째 행은 $u_i\mathbf{v}^{\mathsf{T}}$다. 모든 행이 $\mathbf{v}^{\mathsf{T}}$의 배수다.
- **작용의 관점:** $(\mathbf{u}\mathbf{v}^{\mathsf{T}})\mathbf{x} = \mathbf{u}(\mathbf{v}^{\mathsf{T}}\mathbf{x}) = (\mathbf{v}\cdot\mathbf{x})\,\mathbf{u}$. 입력 $\mathbf{x}$를 $\mathbf{v}$ 방향으로 **읽어서**(내적, 수 하나), 그 수만큼 $\mathbf{u}$ 방향으로 **쓴다**. 예에서 $\mathbf{x} = (1, 1)$이면 $\mathbf{v}\cdot\mathbf{x} = 1.5$이므로 출력은 $1.5\,\mathbf{u} = (1.5, 3)$이다. 직접 곱해도 $\begin{bmatrix} 1 & 0.5 \\ 2 & 1 \end{bmatrix}\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1.5 \\ 3 \end{bmatrix}$로 같다.

::scene transform-grid {"A": [[1, 0.5], [2, 1]], "x": [1, 1]}

그림에서 평면 전체의 격자가 $\mathbf{u} = (1, 2)$ 방향의 직선 하나로 접힌다. $\mathbf{v}$에 수직인 입력(예: $(-0.5, 1)$)은 $\mathbf{v}\cdot\mathbf{x} = 0$이므로 원점으로 사라진다. 그 방향이 [영공간](t:t.null-space)이다.

### 거꾸로: 랭크 1 행렬은 모두 바깥곱이다
랭크가 1이면 열공간이 직선 하나이므로, 그 직선을 따라가는 벡터 $\mathbf{u}$를 하나 고르면 모든 열이 $\mathbf{a}_j = c_j\mathbf{u}$ 꼴이다. 계수들을 모은 벡터를 $\mathbf{c}$라 하면 $A = \mathbf{u}\mathbf{c}^{\mathsf{T}}$이다. [열을 나란히 세운 것이 행렬이기 때문이다](why:def.matrix).

### 저장 비용
$m \times n$ 행렬은 숫자 $mn$개를 담는다. 랭크 1 행렬은 $\mathbf{u}$와 $\mathbf{v}$, 숫자 $m + n$개면 충분하다. $m = n = 1000$이면 100만 개 대 2000개다. 이 차이가 다음 두 노드와 10장 [LoRA](fwd:t.lora)의 출발점이다.`,
  checks: [
    {
      q: String.raw`$\mathbf{u} = (1, -1, 2)$, $\mathbf{v} = (3, 0)$일 때 $\mathbf{u}\mathbf{v}^{\mathsf{T}}$의 모양과 둘째 열은?`,
      choices: [String.raw`3×2, 둘째 열 $(0, 0, 0)$`, String.raw`2×3, 둘째 열 $(-3, 0)$`, String.raw`3×2, 둘째 열 $(3, -3, 6)$`, '곱할 수 없다'],
      answer: 0,
      explain: String.raw`$(3\times1)(1\times2) = 3\times2$다. $j$번째 열은 $v_j\mathbf{u}$이고 $v_2 = 0$이므로 둘째 열은 영벡터다. 첫째 열이 $3\mathbf{u} = (3, -3, 6)$이다.`,
    },
    {
      q: String.raw`랭크 1인 $A = \mathbf{u}\mathbf{v}^{\mathsf{T}}$가 0으로 보내는 입력들의 모임(영공간)은?`,
      choices: [String.raw`$\mathbf{v}$에 수직인 모든 입력`, String.raw`$\mathbf{u}$에 수직인 모든 입력`, String.raw`$\mathbf{v}$ 방향의 직선`, String.raw`$\mathbf{0}$ 하나뿐`],
      answer: 0,
      explain: String.raw`$A\mathbf{x} = (\mathbf{v}\cdot\mathbf{x})\mathbf{u}$이고 $\mathbf{u} \ne \mathbf{0}$이므로, $A\mathbf{x} = \mathbf{0}$은 $\mathbf{v}\cdot\mathbf{x} = 0$과 같다. "읽는 방향" $\mathbf{v}$에 수직인 입력은 읽히지 않는다. $\mathbf{u}$는 출력 쪽 방향이라 입력의 영공간과는 관계가 없다.`,
    },
  ],
  code: ['outer'],
};

export default node;
