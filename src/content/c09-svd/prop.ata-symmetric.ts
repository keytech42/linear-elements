import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.ata-symmetric',
  kind: 'prop',
  title: 'AᵀA는 대칭이고, ‖Ax‖² = x·(AᵀAx)',
  status: 'written',
  requires: ['prop.transpose-dot', 'def.symmetric', 'def.norm'],
  predicts: [
    {
      id: 'p-entry',
      kind: 'choice',
      q: String.raw`$A$의 두 열을 $\mathbf{a}_1, \mathbf{a}_2$라 하자. $A^{\mathsf{T}}A$의 1행 2열 성분은 무엇일까?`,
      hints: [
        String.raw`$A^{\mathsf{T}}A$의 1행 2열 성분은 $A^{\mathsf{T}}$의 1행과 $A$의 2열의 내적이다([왜?](n:prop.row-picture)). $A^{\mathsf{T}}$의 1행은 $A$의 무엇인가?`,
      ],
      choices: [String.raw`$\mathbf{a}_1 \cdot \mathbf{a}_2$ (두 열의 내적)`, String.raw`$a_{12}a_{21}$ (A의 대각선 밖 두 성분의 곱)`, String.raw`$\|\mathbf{a}_1\|\,\|\mathbf{a}_2\|$ (두 열의 길이의 곱)`, '언제나 0'],
      answer: 0,
      why: [
        String.raw`$A^{\mathsf{T}}$의 1행은 $A$의 1열이다. 행렬 곱의 성분 하나는 (왼쪽 행렬의 행)·(오른쪽 행렬의 열)이므로 $\mathbf{a}_1\cdot\mathbf{a}_2$다.`,
        String.raw`행렬 곱은 같은 자리의 성분끼리 곱하는 계산이 아니다. 성분 하나는 행 하나와 열 하나의 내적이다.`,
        String.raw`내적은 길이의 곱에 $\cos\theta$가 붙은 값이다. 두 열이 같은 방향일 때만 이 값과 같다.`,
        String.raw`두 열이 직교할 때만 0이다.`,
      ],
    },
  ],
  body: String.raw`앞 노드에서 "가장 많이 늘어나는 방향"을 눈으로 찾았다. 이것을 계산으로 찾으려면 먼저 **늘어난 길이** $\|A\mathbf{x}\|$를 $\mathbf{x}$에 대한 식으로 써야 한다. 제곱근이 붙어 있으면 다루기 불편하므로 길이의 제곱 $\|A\mathbf{x}\|^2$을 쓴다. 길이가 가장 클 때 길이의 제곱도 가장 크므로, 무엇을 최대로 만드는지는 달라지지 않는다.

**명제.** $A$가 $m \times n$ 행렬이면 다음 두 가지가 성립한다.
- $A^{\mathsf{T}}A$는 $n \times n$ [대칭 행렬](t:t.symmetric)이다.
- 모든 입력 $\mathbf{x} \in \mathbb{R}^n$에 대해 $\|A\mathbf{x}\|^2 = \mathbf{x} \cdot (A^{\mathsf{T}}A\mathbf{x})$ 이다.

둘째 식이 이 노드의 핵심이다. 출력 공간 $\mathbb{R}^m$에서 잰 길이를, 입력 공간 $\mathbb{R}^n$ 안의 계산만으로 구할 수 있다는 뜻이다. $A^{\mathsf{T}}A$는 "입력 $\mathbf{x}$가 $A$를 지나면서 얼마나 늘어나는지"를 입력 공간 안에 기록해 둔 대칭 행렬이다.

::predict p-entry

### AᵀA의 성분: 열끼리의 내적
$A^{\mathsf{T}}A$의 $i$행 $j$열 성분은 $A^{\mathsf{T}}$의 $i$번째 행과 $A$의 $j$번째 열의 [내적](t:t.dot)이다([왜?](why:prop.row-picture)). 그런데 $A^{\mathsf{T}}$의 $i$번째 행은 $A$의 $i$번째 열이다. 그러므로

$$(A^{\mathsf{T}}A)_{ij} = \mathbf{a}_i \cdot \mathbf{a}_j$$

대각선에는 각 열의 길이의 제곱 $\|\mathbf{a}_i\|^2$이 놓이고, 대각선 밖에는 두 열의 내적이 놓인다. $\mathbf{a}_i \cdot \mathbf{a}_j = \mathbf{a}_j \cdot \mathbf{a}_i$이므로 대칭인 것이 한눈에 보인다.

### 예
$A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$ (앞 노드 그림의 처음 행렬)의 열은 $\mathbf{a}_1 = (1.2, 0.3)$, $\mathbf{a}_2 = (0.9, 1.1)$이다.

$$A^{\mathsf{T}}A = \begin{bmatrix} \mathbf{a}_1\cdot\mathbf{a}_1 & \mathbf{a}_1\cdot\mathbf{a}_2 \\ \mathbf{a}_2\cdot\mathbf{a}_1 & \mathbf{a}_2\cdot\mathbf{a}_2 \end{bmatrix} = \begin{bmatrix} 1.53 & 1.41 \\ 1.41 & 2.02 \end{bmatrix}$$

- $\mathbf{x} = (1, 0)$: $A\mathbf{x} = (1.2, 0.3)$이므로 $\|A\mathbf{x}\|^2 = 1.44 + 0.09 = 1.53$. 오른쪽 식으로는 $\mathbf{x}\cdot(A^{\mathsf{T}}A\mathbf{x}) = (1, 0)\cdot(1.53, 1.41) = 1.53$. 같다.
- $\mathbf{x} = (0.6, 0.8)$ (길이 1): $A\mathbf{x} = (1.44, 1.06)$이므로 $\|A\mathbf{x}\|^2 = 2.0736 + 1.1236 = 3.1972$. 오른쪽 식으로는 $A^{\mathsf{T}}A\mathbf{x} = (2.046, 2.462)$, $\mathbf{x}\cdot(2.046, 2.462) = 1.2276 + 1.9696 = 3.1972$. 같다.

### 따름 사실: AᵀA의 고윳값은 음수가 아니다
$A^{\mathsf{T}}A\mathbf{q} = \lambda\mathbf{q}$이고 $\mathbf{q}$의 길이가 1이라 하자. 위 식에 $\mathbf{x} = \mathbf{q}$를 넣으면 $\|A\mathbf{q}\|^2 = \mathbf{q}\cdot(\lambda\mathbf{q}) = \lambda(\mathbf{q}\cdot\mathbf{q}) = \lambda$ 이다. 왼쪽은 길이의 제곱이므로 0 이상이다. 따라서 $\lambda \ge 0$이다. 이 사실 덕분에 다음 노드에서 $\lambda$의 제곱근을 걱정 없이 쓸 수 있다.

> [!주의] AᵀA는 A를 되돌리는 행렬이 아니다
> $A^{\mathsf{T}}$는 $A$의 [역행렬](t:t.inverse)이 아니다(직교 행렬일 때만 예외다). 그래서 $A^{\mathsf{T}}A$는 보통 $I$가 아니다. $A^{\mathsf{T}}A = I$이면 모든 길이가 그대로라는 뜻이고, 그것이 바로 [직교 행렬](t:t.orth-matrix)의 조건이다.`,
  proof: String.raw`**대칭.** 모양부터 보자. $A^{\mathsf{T}}$는 $n \times m$, $A$는 $m \times n$이므로 곱 $A^{\mathsf{T}}A$는 $n \times n$이다([왜?](why:prop.shape-rule)). [전치의 곱은 순서를 뒤집어 전치한 것](why:prop.transpose-dot)이므로

$$(A^{\mathsf{T}}A)^{\mathsf{T}} = A^{\mathsf{T}}(A^{\mathsf{T}})^{\mathsf{T}} = A^{\mathsf{T}}A$$

가운데에서 $(A^{\mathsf{T}})^{\mathsf{T}} = A$를 썼다. 행과 열을 두 번 맞바꾸면 원래대로 돌아오기 때문이다. 전치해도 자기 자신이므로 [대칭](why:def.symmetric)이다.

**길이의 제곱.** [길이의 제곱은 자기 자신과의 내적](why:def.norm)이므로 $\|A\mathbf{x}\|^2 = (A\mathbf{x})\cdot(A\mathbf{x})$ 이다. 여기에 [전치의 정체 $(A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$](why:prop.transpose-dot)를 $\mathbf{y} = A\mathbf{x}$로 놓고 쓰면

$$\|A\mathbf{x}\|^2 = (A\mathbf{x})\cdot(A\mathbf{x}) = \mathbf{x}\cdot\big(A^{\mathsf{T}}(A\mathbf{x})\big) = \mathbf{x}\cdot\big((A^{\mathsf{T}}A)\mathbf{x}\big)$$

마지막 등호는 ["A를 하고 Aᵀ를 하는 것"과 "AᵀA를 한 번에 하는 것"이 같다](why:prop.associative)는 사실이다.`,
  checks: [
    {
      q: String.raw`$A$의 두 열이 서로 직교하고 길이가 각각 2와 3이다. $A^{\mathsf{T}}A$는?`,
      choices: [String.raw`$\begin{bmatrix} 4 & 0 \\ 0 & 9 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$`, String.raw`$I$`, '열의 성분을 모르면 알 수 없다'],
      answer: 0,
      explain: String.raw`$(A^{\mathsf{T}}A)_{ij} = \mathbf{a}_i\cdot\mathbf{a}_j$다. 대각선은 길이의 제곱 4와 9, 대각선 밖은 직교하므로 0이다. 열의 구체적 성분을 몰라도 길이와 내적만 알면 된다. $A^{\mathsf{T}}A$는 열들 사이의 **길이와 각도 정보만** 담는다는 뜻이다. $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$은 제곱을 빠뜨린 것이다.`,
    },
  ],
  code: ['matMul', 'transpose'],
};

export default node;
