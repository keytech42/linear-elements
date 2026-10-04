import type { Book } from './schema';

// 9장 — 특이값 분해. 이 교재 전체가 향하는 목적지.
// 증명의 뼈대: AᵀA는 대칭 → 스펙트럼 정리 → "가장 많이 늘어나는 방향"이 서로 수직 → A = UΣVᵀ
const book: Book = {
  id: 'b9',
  num: 9,
  title: '특이값 분해',
  subtitle: '모든 행렬은 회전, 늘이기, 회전이다',
  nodes: [
    {
      id: 'exp.circle-to-ellipse',
      kind: 'exp',
      title: '아무 행렬이나 단위원을 타원으로 보낸다',
      status: 'written',
      requires: ['prop.sym-ellipse'],
      openWhys: [
        { q: '대칭이 아닌 행렬도 단위원을 정확히 타원으로 보내는가?', answeredBy: 'prop.svd' },
        { q: '가장 많이 늘어나는 입력 방향과 가장 적게 늘어나는 입력 방향은 왜 언제나 서로 수직인가?', answeredBy: 'prop.svd-ata' },
      ],
      predicts: [
        {
          id: 'p-shape',
          kind: 'choice',
          q: '대칭이 아닌 행렬은 단위원을 어떤 모양으로 보낼까?',
          choices: ['타원 (납작해지면 선분)', '한쪽이 불룩한 달걀 모양', '평행사변형', '행렬마다 아무 모양이나 될 수 있다'],
          answer: 0,
          why: [
            String.raw`아래 그림으로 확인하고, 증명은 이 장의 셋째 노드에서 한다.`,
            String.raw`선형 변환은 $\mathbf{x}$와 $-\mathbf{x}$를 정반대 자리로 보낸다($A(-\mathbf{x}) = -A\mathbf{x}$). 그래서 상은 원점에 대해 대칭이고, 한쪽만 불룩할 수 없다.`,
            String.raw`평행사변형은 단위 **정사각형**의 상이다. 원에는 꼭짓점이 없고, 선형 변환은 없던 꼭짓점을 만들지 않는다(평면이 선으로 납작해지는 경우는 빼고).`,
            String.raw`선형 변환은 격자를 곧고 평행하고 고르게 둔다. 그래서 상의 모양은 "원을 고르게 늘이고 기울인 것"으로 제한된다. 아무 모양이나 될 수는 없다.`,
          ],
        },
        {
          id: 'p-angle',
          kind: 'choice',
          q: '단위원 위에서 가장 많이 늘어나는 입력 방향과 가장 적게 늘어나는 입력 방향 사이의 각은?',
          hints: [
            String.raw`같은 직선 위의 두 단위 입력 $\mathbf{x}$와 $-\mathbf{x}$는 [똑같은 길이로 늘어난다](n:def.linear-map). 그렇다면 \"가장 많이\"와 \"가장 적게\"가 같은 직선일 수 있는가?`,
          ],
          choices: ['0° (같은 직선)', '45°', '90°', '행렬마다 다르다'],
          answer: 2,
          why: [
            String.raw`같은 직선 위의 단위 입력은 $\mathbf{x}$와 $-\mathbf{x}$뿐이고, 둘은 똑같은 길이로 늘어난다. 그러니 가장 많이 늘어나는 방향과 가장 적게 늘어나는 방향이 같은 직선이라면, 모든 방향이 똑같이 늘어나는 경우(예: 회전)뿐이다.`,
            String.raw`45°가 나오는 행렬은 없다. 아래 그림에서 여러 행렬로 확인해 보라.`,
            String.raw`어떤 행렬이든 90°다. 이 사실이 이 장 전체의 출발점이고, 다음 두 노드에서 증명한다.`,
            String.raw`직관적으로는 그렇게 보이지만, 어떤 행렬이든 90°다. 일반적인 선형 변환은 직각을 지키지 않는데도 그렇다. 그래서 놀라운 사실이다.`,
          ],
        },
      ],
      body: String.raw`8장에서 [대칭 행렬](t:t.symmetric)은 [단위원](t:t.unit-circle)을 [타원](t:t.ellipse)으로 보내고, 그 타원의 두 축이 [고유벡터](t:t.eigenvector) 방향이라는 것을 보았다. [왜 그랬는가?](why:prop.sym-ellipse) 그런데 대부분의 행렬은 대칭이 아니다. 대칭이 아닌 행렬은 단위원을 무엇으로 보낼까?

그림을 보기 전에 두 가지를 먼저 예측하자.

::predict p-shape

::predict p-angle

이제 그림으로 확인하자. 아래 그림에서 점선 원이 단위원, 흰 곡선이 그 원 위의 모든 점에 $A$를 곱한 결과다. 노란 점 $\mathbf{x}$를 단위원을 따라 한 바퀴 돌리면, 분홍 화살표 $A\mathbf{x}$가 흰 곡선을 따라 돈다. 그림 아래 그래프는 입력 방향의 각에 따라 출력의 길이 $\|A\mathbf{x}\|$가 어떻게 바뀌는지 보여 준다.

::scene b9-svd-ellipse {"svd": false, "probe": 10}

### 찾아볼 것
- 흰 곡선은 여전히 타원처럼 보이는가? 행렬의 칸을 바꿔 가며 확인하라. 찌그러진 달걀이나 삼각형 같은 모양이 나오는가?
- 출력이 가장 길어지는 입력 방향을 찾아라. 그래프의 가장 높은 곳이다. 이어서 출력이 가장 짧아지는 입력 방향을 찾아라.
- 두 입력 방향 사이의 각은 얼마인가? 행렬을 여러 번 바꿔서 다시 재 보라.
- "A의 고유 방향 겹쳐 보기"를 켜라. 가장 길게 늘어나는 방향이 고유 방향과 같은가?
- 그래프는 왜 180°마다 같은 모양을 되풀이하는가? (힌트: $\mathbf{x}$와 $-\mathbf{x}$의 출력 길이를 비교하라. [스칼라 곱](t:t.scalar-mul)이 선형 변환을 어떻게 통과하는가?)

### 관찰한 것을 정리하면
행렬을 어떻게 바꾸어도 다음 세 가지가 되풀이된다.

1. 단위원의 상은 타원이다(납작해지면 선분, 영행렬이면 점).
2. 가장 많이 늘어나는 입력 방향과 가장 적게 늘어나는 입력 방향은 **서로 [직교](t:t.orthogonal)한다**. 그리고 그 두 방향의 출력이 타원의 긴 축과 짧은 축이 되며, 두 축도 서로 직교한다.
3. 대칭이 아닌 행렬에서는 이 방향이 고유 방향과 **다르다**.

2번은 놀라운 사실이다. 일반적인 선형 변환은 직각을 지키지 않는다(전단을 떠올려 보라). 그런데 어떤 행렬이든 직각을 그대로 지키는 입력 방향의 쌍이 **적어도 하나는** 있다는 뜻이기 때문이다. 이 한 쌍의 방향과 그 방향들이 늘어나는 배율에는 곧 이름이 붙는다. 배율의 이름이 [특이값](fwd:t.singular-value)이다.

이제 답을 켜 보자. 초록 화살표 $\mathbf{v}_1, \mathbf{v}_2$가 입력 쪽 두 방향, 하늘색 화살표가 타원의 두 축이다.

::scene b9-svd-ellipse {"svd": true, "eig": true}

> [!주의] 관찰은 증명이 아니다
> 여러 행렬에서 같은 일이 일어나는 것을 보았다고 모든 행렬에서 일어난다는 보장은 없다. 다음 두 노드에서 2번을 증명하고, 그다음 노드에서 1번(정확히 타원이라는 것)을 증명한다.`,
      checks: [
        {
          q: String.raw`$A = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$일 때, 단위원 위의 입력 가운데 가장 많이 늘어나는 방향과 그 길이는?`,
          choices: [String.raw`$\mathbf{e}_1$ 방향, 길이 3`, String.raw`$\mathbf{e}_2$ 방향, 길이 3`, String.raw`$(1, 1)$ 방향, 길이 4`, '모든 방향이 똑같이 늘어난다'],
          answer: 0,
          explain: String.raw`단위 입력 $(\cos\theta, \sin\theta)$의 출력은 $(3\cos\theta, \sin\theta)$이고, 그 길이의 제곱은 $9\cos^2\theta + \sin^2\theta = 1 + 8\cos^2\theta$다. 이 값은 $\cos^2\theta = 1$, 곧 $\mathbf{e}_1$ 방향에서 가장 커서 길이 3이 된다. $(1, 1)$ 방향(단위 길이로 맞춘 것)의 출력 길이는 $\sqrt{(9 + 1)/2} = \sqrt{5}$로 3보다 작다.`,
        },
        {
          q: String.raw`회전 행렬 $R_\theta$는 단위원을 무엇으로 보내는가? 그리고 "가장 많이 늘어나는 방향"은?`,
          choices: ['단위원 자신. 모든 방향이 똑같이(1배) 늘어나므로 가장 많이 늘어나는 방향이 하나로 정해지지 않는다', '긴 축이 θ 방향인 타원', '선분'],
          answer: 0,
          explain: String.raw`[회전은 길이를 바꾸지 않는다](n:prop.orthogonal-preserves). 그래서 상은 단위원 그대로이고, 모든 입력 방향의 늘어난 길이가 1이다. 이처럼 두 [특이값](fwd:t.singular-value)이 같으면 "그 방향"은 하나로 정해지지 않는다. 이 경우는 [특이값 분해](fwd:t.svd)가 하나로 정해지는지를 다룰 때 다시 나온다.`,
        },
      ],
    },
    {
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
    },
    {
      id: 'prop.svd-ata',
      kind: 'prop',
      title: '가장 많이 늘어나는 방향 = AᵀA의 고유벡터',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.singular-value', ko: '특이값', en: 'singular value', gloss: '행렬이 단위원을 보낸 타원의 반지름들. σ₁ ≥ σ₂ ≥ … ≥ 0. AᵀA의 고윳값의 제곱근.' },
          { id: 't.right-singular', ko: '오른쪽 특이벡터', en: 'right singular vector', surfaces: ['우특이벡터'], gloss: '줄여서 우특이벡터. 입력 공간에서, 변환 뒤에도 서로 수직으로 남는 단위 방향들(𝐯ᵢ). AᵀA의 고유벡터.' },
          { id: 't.left-singular', ko: '왼쪽 특이벡터', en: 'left singular vector', surfaces: ['좌특이벡터'], gloss: '줄여서 좌특이벡터. 출력 공간에서, 타원의 축 방향을 가리키는 단위 방향들(𝐮ᵢ = A𝐯ᵢ/σᵢ).' },
        ],
        symbols: [
          { tex: String.raw`\sigma_i`, meaning: 'i번째 특이값' },
          { tex: String.raw`\mathbf{v}_i`, meaning: 'i번째 오른쪽 특이벡터', note: '첨자 없는 𝐯(이름 없는 벡터), 가는 v₁(성분)과 구별' },
          { tex: String.raw`\mathbf{u}_i`, meaning: 'i번째 왼쪽 특이벡터' },
        ],
      },
      requires: ['prop.ata-symmetric', 'prop.spectral', 'exp.circle-to-ellipse'],
      predicts: [
        {
          id: 'p-dir',
          kind: 'point',
          q: String.raw`계산하기 전에 손으로 찾아보자. $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$에서 가장 많이 늘어나는 입력 방향을 노란 손잡이로 맞춰라. 두 열(주황, 청록)을 참고하라.`,
          hints: [
            String.raw`두 열 $\mathbf{a}_1 = (1.2, 0.3)$, $\mathbf{a}_2 = (0.9, 1.1)$은 대체로 같은 쪽(오른쪽 위)을 향한다. 입력 $(\cos\theta, \sin\theta)$의 출력은 $\cos\theta\,\mathbf{a}_1 + \sin\theta\,\mathbf{a}_2$다.`,
            String.raw`두 열을 **같은 부호로** 섞으면 서로 보태고, 반대 부호로 섞으면 서로 깎는다. 그리고 $\mathbf{a}_2$가 $\mathbf{a}_1$보다 길다($\sqrt{2.02}$ 대 $\sqrt{1.53}$).`,
          ],
          A: [[1.2, 0.9], [0.3, 1.1]],
          target: 'v1',
          show: ['cols', 'circle'],
          reveal: String.raw`정답 방향은 약 49.9°, 곧 $(0.644, 0.765)$ 쪽이다. 두 열이 대체로 같은 쪽을 향하므로, 두 열을 같은 부호로 섞는 방향이 많이 늘어난다. 흰 곡선이 단위원의 상이고, 초록 직선이 그 타원의 긴 축을 만드는 입력 방향이다. 아래에서 이 방향을 계산으로 정확히 찾는다.`,
        },
        {
          id: 'p-max',
          kind: 'choice',
          q: String.raw`$c_1^2 + c_2^2 = 1$이라는 조건 아래에서 $\lambda_1 c_1^2 + \lambda_2 c_2^2$이 가질 수 있는 가장 큰 값은? ($\lambda_1 \ge \lambda_2 \ge 0$)`,
          hints: [
            String.raw`$\lambda_1 c_1^2 + \lambda_2 c_2^2$에서 $c_2^2 = 1 - c_1^2$를 넣어 $c_1^2$ 하나에 대한 식으로 바꿔 보라.`,
          ],
          choices: [String.raw`$\lambda_1$`, String.raw`$\lambda_1 + \lambda_2$`, String.raw`$\sqrt{\lambda_1}$`, String.raw`$(\lambda_1 + \lambda_2)/2$`],
          answer: 0,
          why: [
            String.raw`조건 $c_1^2 + c_2^2 = 1$을 전부 $c_1^2$에 몰아주면($c_1^2 = 1$, $c_2 = 0$) 된다. 아래 문단이 이것을 "가중 평균"으로 설명한다.`,
            String.raw`$c_1 = c_2 = 1$로 두고 싶어지지만, 그러면 $c_1^2 + c_2^2 = 2$가 되어 조건을 어긴다. 두 계수는 1을 나눠 가져야 한다.`,
            String.raw`$\sqrt{\lambda_1}$은 늘어난 **길이**의 최댓값이다. 이 식은 길이의 **제곱**이다. 이 차이가 곧 아래의 특이값 정의로 이어진다.`,
            String.raw`$c_1^2 = c_2^2 = 1/2$일 때의 값이다. 가장 큰 값이 아니라 중간값이다.`,
          ],
        },
      ],
      body: String.raw`앞 노드의 식 $\|A\mathbf{x}\|^2 = \mathbf{x}\cdot(A^{\mathsf{T}}A\mathbf{x})$에서 $S = A^{\mathsf{T}}A$라고 쓰자. [S는 대칭이다](why:prop.ata-symmetric). 그러면 8장의 [스펙트럼 정리](t:t.spectral)를 쓸 수 있다. 서로 직교하는 단위 [고유벡터](t:t.eigenvector) $\mathbf{q}_1, \mathbf{q}_2$가 있고, 그 [고윳값](t:t.eigenvalue)을 $\lambda_1 \ge \lambda_2$라 하자. [왜 이런 고유벡터가 있는가?](why:prop.spectral) 그리고 [이 고윳값은 0 이상이다](why:prop.ata-symmetric).

이제 질문은 이것이다. **길이가 1인 입력 $\mathbf{x}$ 가운데 $\mathbf{x}\cdot S\mathbf{x}$를 가장 크게 만드는 것은 무엇인가?**

::predict p-dir

### 고유벡터를 자로 삼아 x를 다시 적기
$\mathbf{q}_1, \mathbf{q}_2$는 [정규직교](t:t.orthonormal) [기저](t:t.basis)이므로 모든 $\mathbf{x}$를 $\mathbf{x} = c_1\mathbf{q}_1 + c_2\mathbf{q}_2$로 쓸 수 있다. 계수는 [정사영](t:t.orth-projection)으로 바로 구한다: $c_i = \mathbf{q}_i\cdot\mathbf{x}$. [왜 내적이 곧 좌표인가?](why:prop.orth-projection)

이 기저로 적으면 두 가지 계산이 아주 단순해진다.

- **길이:** $\|\mathbf{x}\|^2 = (c_1\mathbf{q}_1 + c_2\mathbf{q}_2)\cdot(c_1\mathbf{q}_1 + c_2\mathbf{q}_2) = c_1^2 + c_2^2$. 전개하면 $\mathbf{q}_1\cdot\mathbf{q}_2 = 0$인 항은 사라지고, $\mathbf{q}_i\cdot\mathbf{q}_i = 1$인 항만 남는다. 그래서 $\mathbf{x}$가 단위원 위에 있다는 조건은 $c_1^2 + c_2^2 = 1$이 된다.
- **늘어난 길이:** $S\mathbf{x} = c_1\lambda_1\mathbf{q}_1 + c_2\lambda_2\mathbf{q}_2$ (선형성, 그리고 고유벡터의 정의). 그러므로

$$\|A\mathbf{x}\|^2 = \mathbf{x}\cdot S\mathbf{x} = \lambda_1 c_1^2 + \lambda_2 c_2^2, \qquad c_1^2 + c_2^2 = 1$$

::predict p-max

이 식은 $\lambda_1$과 $\lambda_2$를 $c_1^2 : c_2^2$의 비율로 섞은 **가중 평균**이다. 가중 평균은 두 값 사이에 있다. 그러므로 가장 큰 값 $\lambda_1$은 $c_1^2 = 1$, 곧 $\mathbf{x} = \pm\mathbf{q}_1$일 때 나오고, 가장 작은 값 $\lambda_2$는 $\mathbf{x} = \pm\mathbf{q}_2$일 때 나온다.

### 이름 붙이기
**정의.** $A^{\mathsf{T}}A$의 고윳값을 큰 것부터 $\lambda_1 \ge \lambda_2 \ge 0$이라 할 때,
- $\sigma_i = \sqrt{\lambda_i}$를 $A$의 $i$번째 [특이값](def:t.singular-value)이라 한다. $\sigma_1$은 단위 입력이 가장 많이 늘어난 길이, $\sigma_2$는 가장 적게 늘어난 길이다.
- 그 고유벡터 $\mathbf{v}_i = \mathbf{q}_i$를 [오른쪽 특이벡터](def:t.right-singular)라 한다(입력 공간의 방향).
- $\sigma_i > 0$이면 $\mathbf{u}_i = A\mathbf{v}_i / \sigma_i$를 [왼쪽 특이벡터](def:t.left-singular)라 한다(출력 공간의 방향). 정의에서 바로 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$이다.

이 교재에서는 이 뒤로 두 이름을 줄여서 각각 **우특이벡터**, **좌특이벡터**라 적는다.

::scene b9-svd-ellipse {"svd": true}

### 앞 노드의 "놀라운 사실"이 풀린다
- **입력 쪽 두 방향이 수직인 이유:** $\mathbf{v}_1, \mathbf{v}_2$는 대칭 행렬 $A^{\mathsf{T}}A$의 서로 다른 고윳값의 고유벡터다. 대칭 행렬의 그런 고유벡터는 언제나 직교한다. [왜?](why:prop.spectral)
- **출력 쪽 두 축도 수직인 이유:** 아래 증명의 둘째 부분.
- **고유 방향과 다른 이유:** 특이벡터는 $A$의 고유벡터가 아니라 $A^{\mathsf{T}}A$의 고유벡터다. $A$가 대칭이면 $A^{\mathsf{T}}A = A^2$이 되고, 이때는 $A$의 고유벡터가 그대로 $A^2$의 고유벡터이므로 두 방향이 같아진다. 8장에서 본 그림이 바로 이 특별한 경우였다.

### 예
- 앞 노드의 $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$: $A^{\mathsf{T}}A = \begin{bmatrix} 1.53 & 1.41 \\ 1.41 & 2.02 \end{bmatrix}$의 [특성방정식](t:t.char-eq)은 $\lambda^2 - 3.55\lambda + 1.1025 = 0$이고, 근은 $\lambda_1 \approx 3.2062$, $\lambda_2 \approx 0.3439$다. 따라서 $\sigma_1 \approx 1.7906$, $\sigma_2 \approx 0.5864$. 그림의 수치와 비교해 보라. 검산: $\sigma_1\sigma_2 \approx 1.05$이고 $\det A = 1.2\cdot1.1 - 0.9\cdot0.3 = 1.05$다. 이 일치는 우연이 아니다(다음 노드의 점검 문제).
- 랭크 1인 $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $A^{\mathsf{T}}A = \begin{bmatrix} 5 & 10 \\ 10 & 20 \end{bmatrix}$의 고윳값은 25와 0이므로 $\sigma_1 = 5$, $\sigma_2 = 0$이다. $\mathbf{v}_1 = (1, 2)/\sqrt{5}$를 넣으면 $A\mathbf{v}_1 = (5, 10)/\sqrt{5}$이고 그 길이는 $\sqrt{125/5} = 5$로 정확히 $\sigma_1$이다. $\mathbf{v}_2 = (-2, 1)/\sqrt{5}$는 $A\mathbf{v}_2 = \mathbf{0}$, 곧 [영공간](t:t.null-space)의 방향이다. 단위원이 길이 10인 선분으로 납작해진다.

> [!코드] 증명의 순서가 곧 코드의 순서다
> 아래 \`svd2\`는 이 노드의 증명을 한 단계씩 그대로 옮겼다: (1) $A^{\mathsf{T}}A$를 만들고, (2) 대칭 행렬의 고유분해(\`symEig\`, 야코비 회전)로 $\mathbf{v}_i$와 $\lambda_i$를 얻고, (3) $\sigma_i = \sqrt{\lambda_i}$, (4) $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$. $\sigma_2 = 0$이면 (4)의 나눗셈을 할 수 없으므로 $\mathbf{u}_1$에 수직인 아무 단위벡터로 $\mathbf{u}_2$를 채운다. 수치 계산 전문 라이브러리는 정밀도 때문에 $A^{\mathsf{T}}A$를 만들지 않는 다른 길(이 저장소의 \`svd\`가 쓰는 한쪽 야코비 방법 등)을 쓴다. $A^{\mathsf{T}}A$를 만들면 작은 특이값의 유효 숫자가 절반쯤 사라지기 때문이다. 교과서의 증명과 실무의 알고리즘이 갈라지는 지점이다.

### n차원으로
위 논증은 차원과 상관없다. $n \times n$ 대칭 행렬 $A^{\mathsf{T}}A$의 정규직교 고유벡터 $\mathbf{q}_1, \dots, \mathbf{q}_n$으로 $\mathbf{x}$를 적으면 $\|A\mathbf{x}\|^2 = \sum_i \lambda_i c_i^2$, $\sum_i c_i^2 = 1$이 되어 똑같이 가중 평균이다. 그래서 $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_n \ge 0$이 생긴다. 다만 이 일반화는 $n$차원의 스펙트럼 정리에 기댄다. 8장에서 그 정리를 어디까지 증명했는지 확인하라.`,
      proof: String.raw`**최대·최소.** 본문에서 보였듯 $\mathbf{x} = c_1\mathbf{q}_1 + c_2\mathbf{q}_2$, $c_1^2 + c_2^2 = 1$일 때 $\|A\mathbf{x}\|^2 = \lambda_1c_1^2 + \lambda_2c_2^2$이다. $c_2^2 = 1 - c_1^2$을 넣으면

$$\|A\mathbf{x}\|^2 = \lambda_2 + (\lambda_1 - \lambda_2)\,c_1^2$$

$\lambda_1 - \lambda_2 \ge 0$이고 $0 \le c_1^2 \le 1$이므로, 이 값은 $c_1^2 = 1$일 때 $\lambda_1$로 가장 크고 $c_1^2 = 0$일 때 $\lambda_2$로 가장 작다. 따라서 단위 입력이 늘어나는 길이는 $\sigma_2 = \sqrt{\lambda_2}$와 $\sigma_1 = \sqrt{\lambda_1}$ 사이에 있다. 양 끝은 $\mathbf{x} = \pm\mathbf{v}_2$와 $\mathbf{x} = \pm\mathbf{v}_1$에서 나온다.

**출력 쪽 직교.** $\sigma_1, \sigma_2 > 0$이라 하자. [전치의 정체](why:prop.transpose-dot)를 쓰면

$$(A\mathbf{v}_1)\cdot(A\mathbf{v}_2) = \mathbf{v}_1\cdot(A^{\mathsf{T}}A\mathbf{v}_2) = \mathbf{v}_1\cdot(\lambda_2\mathbf{v}_2) = \lambda_2(\mathbf{v}_1\cdot\mathbf{v}_2) = 0$$

그러므로 $\mathbf{u}_1\cdot\mathbf{u}_2 = (A\mathbf{v}_1)\cdot(A\mathbf{v}_2)/(\sigma_1\sigma_2) = 0$이다. 또 $\|A\mathbf{v}_i\|^2 = \lambda_i = \sigma_i^2$이므로 $\|\mathbf{u}_i\| = 1$이다. 따라서 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교다. 입력 쪽의 직각 한 쌍이 출력 쪽에서도 직각으로 남는 이유가 이 한 줄이다. 직교하는 입력들이 $A$를 지난 뒤에도 직교하려면 $A^{\mathsf{T}}A$가 그 입력들을 방향을 바꾸지 않고 보내야 하고, 그런 입력이 곧 $A^{\mathsf{T}}A$의 고유벡터다.`,
      checks: [
        {
          q: String.raw`$A^{\mathsf{T}}A$의 고윳값이 9와 4이다. $A$의 특이값은?`,
          choices: ['3과 2', '9와 4', '81과 16', 'A를 모르면 알 수 없다'],
          answer: 0,
          explain: String.raw`$\sigma_i = \sqrt{\lambda_i}$다. $\lambda_i = \|A\mathbf{v}_i\|^2$은 **길이의 제곱**이기 때문이다. $A$ 자체를 몰라도 특이값은 정해진다. 다만 $A$의 특이벡터(특히 $\mathbf{u}_i$)는 $A$를 알아야 구할 수 있다.`,
        },
        {
          q: String.raw`대칭 행렬 $S = \begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix}$의 특이값은?`,
          choices: ['3과 2', '2와 −3', '−3과 2', '4와 9'],
          answer: 0,
          explain: String.raw`특이값은 늘어난 **길이**이므로 음수가 될 수 없다. $S^{\mathsf{T}}S = \begin{bmatrix} 4 & 0 \\ 0 & 9 \end{bmatrix}$이므로 $\sigma_1 = 3$, $\sigma_2 = 2$다(큰 것부터). 고윳값 $-3$의 부호(뒤집힘)는 특이값이 아니라 특이벡터 쪽에 담긴다. 실제로 $\mathbf{v}_1 = \mathbf{e}_2$일 때 $\mathbf{u}_1 = S\mathbf{e}_2/3 = -\mathbf{e}_2$로 방향이 뒤집힌다. 대칭 행렬의 특이값은 고윳값의 **절댓값**이다.`,
        },
      ],
      code: ['svd2', 'symEig'],
    },
    {
      id: 'prop.svd',
      kind: 'prop',
      title: 'A = UΣVᵀ: 회전, 늘이기, 회전',
      status: 'written',
      introduces: {
        terms: [{ id: 't.svd', ko: '특이값 분해', en: 'singular value decomposition', surfaces: ['SVD'], gloss: '모든 행렬을 (직교 행렬)(대각 행렬)(직교 행렬)의 곱 UΣVᵀ로 쓰는 것. 회전(또는 반사) → 축 방향 늘이기 → 회전(또는 반사).' }],
        symbols: [
          { tex: 'U', meaning: '열 = 왼쪽 특이벡터인 직교 행렬' },
          { tex: String.raw`\Sigma`, meaning: '특이값을 대각에 놓은 행렬' },
          { tex: 'V', meaning: '열 = 오른쪽 특이벡터인 직교 행렬' },
        ],
      },
      requires: ['prop.svd-ata', 'prop.orthogonal-inverse'],
      predicts: [
        {
          id: 'p-vt',
          kind: 'choice',
          q: String.raw`세 단계 가운데 첫째인 $V^{\mathsf{T}}$는 우특이벡터 $\mathbf{v}_1$을 어디로 보낼까?`,
          choices: [String.raw`$\mathbf{e}_1$`, String.raw`$\mathbf{v}_1$ 그대로`, String.raw`$\sigma_1\mathbf{u}_1$`, String.raw`$\mathbf{u}_1$`],
          answer: 0,
          why: [
            String.raw`$V^{\mathsf{T}}$의 행이 $\mathbf{v}_1, \mathbf{v}_2$이므로 $V^{\mathsf{T}}\mathbf{v}_1 = (\mathbf{v}_1\cdot\mathbf{v}_1,\ \mathbf{v}_2\cdot\mathbf{v}_1) = (1, 0)$이다.`,
            String.raw`제자리에 두는 것은 항등 행렬이다. $V^{\mathsf{T}}$는 $\mathbf{v}_1$을 좌표축 위로 옮기는 회전이다.`,
            String.raw`$\sigma_1\mathbf{u}_1$은 세 단계를 모두 거친 결과, 곧 $A\mathbf{v}_1$이다. 첫 단계에서는 아직 늘이지도, 출력 쪽으로 돌리지도 않았다.`,
            String.raw`$\mathbf{u}_1$은 마지막 단계 $U$가 만드는 방향이다.`,
          ],
        },
        {
          id: 'p-flip',
          kind: 'choice',
          q: String.raw`$\det A < 0$인 행렬(거울에 비친 것처럼 뒤집는 변환)을 $U\Sigma V^{\mathsf{T}}$로 쓰면, 뒤집힘은 어디에 들어갈까?`,
          hints: [
            String.raw`직교 행렬의 행렬식은 $+1$ 또는 $-1$이고, $\det\Sigma = \sigma_1\sigma_2 \ge 0$이다. [행렬식은 곱을 곱으로 보낸다](n:prop.det-product).`,
          ],
          choices: [String.raw`$U$와 $V$ 가운데 한쪽 (반사인 직교 행렬)`, String.raw`$\Sigma$의 음수 특이값`, '뒤집는 변환은 이렇게 분해할 수 없다', String.raw`$U$와 $V$ 양쪽 모두`],
          answer: 0,
          why: [
            String.raw`직교 행렬의 행렬식은 $+1$(회전) 또는 $-1$(반사)이다. $\det A = \det U\cdot\sigma_1\sigma_2\cdot\det V^{\mathsf{T}}$가 음수가 되려면 둘 가운데 한쪽만 $-1$이어야 한다.`,
            String.raw`특이값은 늘어난 길이이므로 0 이상이다. 부호는 대각 행렬이 아니라 직교 행렬 쪽이 맡는다.`,
            String.raw`이 노드의 증명에는 행렬식의 부호를 가정한 곳이 없다. 그러므로 모든 행렬이 이렇게 분해된다.`,
            String.raw`양쪽 모두 뒤집으면 뒤집힘이 두 번 일어나 서로 지워진다. 그러면 행렬식은 양수가 된다.`,
          ],
        },
      ],
      body: String.raw`앞 노드에서 얻은 것은 방정식 두 개다: $A\mathbf{v}_1 = \sigma_1\mathbf{u}_1$, $A\mathbf{v}_2 = \sigma_2\mathbf{u}_2$. 그리고 $\mathbf{v}_1, \mathbf{v}_2$는 정규직교이고 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교다. 이 두 방정식을 행렬 하나로 묶으면 무엇이 되는가?

벡터들을 열로 세워 행렬을 만든다.

$$V = \begin{bmatrix} | & | \\ \cv{\mathbf{v}_1} & \cv{\mathbf{v}_2} \\ | & | \end{bmatrix}, \quad \Sigma = \begin{bmatrix} \sigma_1 & 0 \\ 0 & \sigma_2 \end{bmatrix}, \quad U = \begin{bmatrix} | & | \\ \cu{\mathbf{u}_1} & \cu{\mathbf{u}_2} \\ | & | \end{bmatrix}$$

**명제(특이값 분해).** 모든 2×2 행렬 $A$는

$$A = \h{s3}{U}\,\h{s2}{\Sigma}\,\h{s1}{V^{\mathsf{T}}}$$

로 쓸 수 있다. 여기서 $U$와 $V$는 [직교 행렬](t:t.orth-matrix)이고, $\Sigma$는 대각선에 특이값 $\sigma_1 \ge \sigma_2 \ge 0$을 놓은 [대각 행렬](t:t.diagonal)이다. 이것을 $A$의 [특이값 분해](def:t.svd)라 한다(줄여서 SVD).

### 오른쪽부터 읽기: 세 단계
[행렬 곱은 오른쪽부터 읽는다](why:def.composition). 입력 $\mathbf{x}$에 $A = U\Sigma V^{\mathsf{T}}$를 곱하는 일은 다음 세 단계다.

::predict p-vt

1. $V^{\mathsf{T}}$: **회전(또는 반사).** $V^{\mathsf{T}}\mathbf{v}_1 = \mathbf{e}_1$, $V^{\mathsf{T}}\mathbf{v}_2 = \mathbf{e}_2$다. $V^{\mathsf{T}}$의 행이 $\mathbf{v}_1, \mathbf{v}_2$이므로 [행의 관점](why:prop.row-picture)으로 $V^{\mathsf{T}}\mathbf{v}_1 = (\mathbf{v}_1\cdot\mathbf{v}_1, \mathbf{v}_2\cdot\mathbf{v}_1) = (1, 0)$이기 때문이다. 특별한 두 방향을 좌표축 위에 올려놓는 단계다.
2. $\Sigma$: **축 방향으로 따로따로 늘이기.** 가로축을 $\sigma_1$배, 세로축을 $\sigma_2$배 한다.
3. $U$: **회전(또는 반사).** $\mathbf{e}_1$을 $\mathbf{u}_1$로, $\mathbf{e}_2$를 $\mathbf{u}_2$로 보낸다.

아래 장면에서 단계를 하나씩 실행해 보라. 노란 F가 회전인지 반사인지를 구별해 준다.

::scene b9-svd-steps {}

### 그래서 단위원의 상은 정확히 타원이다
[앞에서 미뤄 둔 질문](n:exp.circle-to-ellipse)의 답이다. 1단계의 직교 행렬은 [길이를 바꾸지 않으므로](why:prop.orthogonal-preserves) 단위원을 단위원으로 보낸다. 2단계는 원을 서로 수직인 두 축 방향으로 각각 $\sigma_1$배, $\sigma_2$배 늘인다. 이것이 [타원의 정의](t:t.ellipse) 그대로다. 3단계는 타원을 돌리거나 뒤집을 뿐이므로 타원은 타원으로 남는다. $\sigma_2 = 0$이면 2단계에서 원이 선분으로 납작해진다.

::predict p-flip

### 예
- 앞 노드의 $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$: $V$는 약 49.9° 회전, $\Sigma = \operatorname{diag}(1.7906, 0.5864)$, $U$는 약 35.3° 회전이다. 오른쪽부터 읽으면 이렇다. 먼저 $-49.9°$ 돌려 $\mathbf{v}_1$을 가로축에 놓는다. 다음에 가로로 1.79배, 세로로 0.59배 늘인다. 마지막에 35.3° 돌린다.
- 반사가 들어간 $A = \begin{bmatrix} 2 & 1 \\ 0 & -1 \end{bmatrix}$ ($\det A = -2$): $\sigma_1 \approx 2.2882$, $\sigma_2 \approx 0.8740$이고, $V$를 회전으로 고르면 $U$에 반사가 하나 들어간다($\det U = -1$). 장면의 행렬을 이 값으로 바꾸고 3단계를 보라. 반사는 회전을 이어 붙여서는 만들 수 없다. 그래서 애니메이션에서는 한 축이 0을 지나며 뒤집힌다.

### 직사각 행렬도
$A$가 $m \times n$이어도 같은 논증이 된다. $A^{\mathsf{T}}A$($n \times n$)에서 $\mathbf{v}_i$와 $\sigma_i$를 얻고, $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$는 $\mathbb{R}^m$의 정규직교 벡터들이다. 예를 들어 $A = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$이면 $A^{\mathsf{T}}A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이고 고윳값은 3과 1이다. 그래서 $\sigma_1 = \sqrt{3}$, $\sigma_2 = 1$, $\mathbf{v}_1 = (1, 1)/\sqrt{2}$, $\mathbf{u}_1 = A\mathbf{v}_1/\sqrt{3} = (1, 1, 2)/\sqrt{6}$이다. 평면의 단위원이 3차원 공간 안의 기울어진 평면 위에 놓인 타원이 된다. 출력 공간은 3차원인데 [열공간](t:t.column-space)은 2차원이므로, $\mathbf{u}_1, \mathbf{u}_2$에 수직인 방향 $\mathbf{u}_3$가 하나 남는다. 어떤 입력으로도 닿지 않는 방향이다. 이 방향의 정체는 이 장의 마지막 노드에서 다룬다. 이 저장소의 \`svd\`는 이런 직사각 행렬을 위한 함수다.

### 무엇이 유일한가
특이값 $\sigma_i$는 $A$만으로 정해진다($A^{\mathsf{T}}A$의 고윳값이므로). 특이벡터는 그렇지 않다. $\mathbf{v}_i$와 $\mathbf{u}_i$의 부호를 **함께** 바꿔도 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$가 유지된다. 또 $\sigma_1 = \sigma_2$이면(예: 회전 행렬) 어느 직교 쌍이든 $\mathbf{v}_1, \mathbf{v}_2$가 될 수 있다. 그러므로 "A의 SVD"는 하나의 분해가 아니라, 같은 $\Sigma$를 공유하는 분해들의 모임이다.`,
      proof: String.raw`[행렬 곱의 j번째 열은 왼쪽 행렬 × 오른쪽 행렬의 j번째 열이다](why:prop.matmul-columns). 그러므로 $AV$의 열은 $A\mathbf{v}_1, A\mathbf{v}_2$이고, $U\Sigma$의 열은 $U(\sigma_1\mathbf{e}_1) = \sigma_1\mathbf{u}_1$, $U(\sigma_2\mathbf{e}_2) = \sigma_2\mathbf{u}_2$다. [앞 노드](why:prop.svd-ata)에서 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$이므로 두 행렬의 열이 모두 같다.

$$AV = U\Sigma$$

$\sigma_2 = 0$인 경우에도 이 식은 성립한다. $A\mathbf{v}_2 = \mathbf{0} = 0\cdot\mathbf{u}_2$이기 때문이다($\|A\mathbf{v}_2\|^2 = \lambda_2 = 0$).

이제 양변의 오른쪽에 $V^{\mathsf{T}}$를 곱한다. $V$는 열이 정규직교인 직교 행렬이므로 [역행렬이 전치](why:prop.orthogonal-inverse)다. 따라서 $VV^{\mathsf{T}} = I$이고

$$A = A(VV^{\mathsf{T}}) = (AV)V^{\mathsf{T}} = U\Sigma V^{\mathsf{T}}$$

가운데 등호에서는 [결합법칙](why:prop.associative)을 썼다. $U$의 열 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교이므로 $U$는 직교 행렬이다.`,
      checks: [
        {
          q: String.raw`2×2 행렬에서 $\sigma_1\sigma_2 = |\det A|$인 이유는?`,
          choices: [
            String.raw`$\det A = \det U \cdot \det\Sigma \cdot \det V^{\mathsf{T}}$이고, 직교 행렬의 행렬식은 ±1이며 $\det\Sigma = \sigma_1\sigma_2$이기 때문`,
            '특이값은 원래 행렬식을 나눠 가진 것이라고 정의했기 때문',
            '우연히 위 예에서만 성립한다',
          ],
          answer: 0,
          explain: String.raw`[행렬식은 곱을 곱으로 보낸다](n:prop.det-product). 직교 행렬은 넓이를 바꾸지 않으므로 행렬식이 $+1$(회전) 또는 $-1$(반사)이다. 남는 넓이 배율은 $\Sigma$의 $\sigma_1\sigma_2$뿐이다. 기하로 말하면, 단위원(넓이 π)이 반지름 $\sigma_1, \sigma_2$인 타원(넓이 $\pi\sigma_1\sigma_2$)이 된다. 부호는 $U$와 $V$에 반사가 홀수 번 들어갔는지가 정한다.`,
        },
        {
          q: String.raw`$A = U\Sigma V^{\mathsf{T}}$에서 $A\mathbf{v}_2$는?`,
          choices: [String.raw`$\sigma_2\mathbf{u}_2$`, String.raw`$\sigma_2\mathbf{v}_2$`, String.raw`$\mathbf{u}_2$`, String.raw`$\sigma_1\mathbf{u}_1$`],
          answer: 0,
          explain: String.raw`세 단계로 따라가면 $V^{\mathsf{T}}\mathbf{v}_2 = \mathbf{e}_2 \to \Sigma\mathbf{e}_2 = \sigma_2\mathbf{e}_2 \to U(\sigma_2\mathbf{e}_2) = \sigma_2\mathbf{u}_2$다. $\sigma_2\mathbf{v}_2$를 고른 경우는 $\mathbf{v}_2$를 $A$의 고유벡터로 착각한 것이다. 특이벡터는 출발 방향($\mathbf{v}$)과 도착 방향($\mathbf{u}$)이 다르다.`,
        },
      ],
      code: ['svd2', 'svd'],
    },
    {
      id: 'exp.svd-assemble',
      kind: 'exp',
      title: '세 다이얼로 행렬 조립하기',
      status: 'written',
      requires: ['prop.svd'],
      predicts: [
        {
          id: 'p-thv',
          kind: 'choice',
          q: String.raw`다른 다이얼은 그대로 두고 $\theta_V$(입력 쪽 회전)만 돌리면, 실선 타원은 어떻게 될까?`,
          hints: [
            String.raw`$V^{\mathsf{T}}$는 [길이를 바꾸지 않는다](n:prop.orthogonal-preserves). 그렇다면 단위원을 $V^{\mathsf{T}}$에 넣으면 무엇이 나오는가? 그 결과에 $\Sigma$와 $U$가 하는 일은 $\theta_V$와 상관이 있는가?`,
          ],
          choices: ['꿈쩍하지 않는다. 화살표 끝만 타원 위를 미끄러진다', '타원이 함께 돈다', '타원이 납작해졌다가 다시 펴진다'],
          answer: 0,
          why: [
            String.raw`$V^{\mathsf{T}}$는 단위원을 단위원 자신으로 보낸다. 그래서 그 뒤의 $\Sigma$와 $U$가 받는 "모양"은 늘 같은 원이다. 바뀌는 것은 원 위의 어느 점이 어디로 가는지뿐이다.`,
            String.raw`타원을 돌리는 것은 출력 쪽 회전 $\theta_U$다.`,
            String.raw`늘이는 배율은 $\sigma_1, \sigma_2$만 정한다. 회전은 길이를 바꾸지 않는다.`,
          ],
        },
      ],
      body: String.raw`[특이값 분해](t:t.svd)를 읽을 줄 아는 것과 손으로 조립할 줄 아는 것은 다른 능력이다. 이 노드는 둘째 능력을 기른다.

아래 장면의 점선은 목표 행렬 $A$가 만드는 것이다. 단위원의 상(점선 타원)과 $\mathbf{e}_1, \mathbf{e}_2$의 도착지(점선 화살표)가 그려져 있다. 다이얼 다섯 개로 $U\Sigma V^{\mathsf{T}}$를 조립해 실선을 점선에 정확히 겹쳐 보라.

- $\theta_V$: 입력 쪽 회전 $V$의 각. $V^{\mathsf{T}}$는 이 각만큼 **거꾸로** 돈다.
- $\sigma_1, \sigma_2$: 가로와 세로로 늘이는 배율.
- $\theta_U$: 출력 쪽 회전 $U$의 각.
- 뒤집기: $U$에 반사를 넣는다.

::predict p-thv

::scene b9-svd-assemble {}

### 해 보면 드러나는 것
- **타원의 모양**은 $\sigma_1, \sigma_2$만으로 정해지고, **타원이 놓인 방향**은 $\theta_U$만으로 정해진다. $\theta_V$를 아무리 돌려도 타원은 꿈쩍하지 않는다. 그 이유는 이렇다. $V^{\mathsf{T}}$는 단위원을 단위원으로 보낸다. 바뀌는 것은 원 위의 **어느 점이 어디로 가는지**뿐이다. 그래서 $\theta_V$를 돌리면 점선 화살표와 실선 화살표의 끝이 타원 위를 미끄러진다.
- 그래서 타원만 겹쳤다고 같은 행렬이 아니다. 주황·청록 화살표까지 겹쳐야 같은 변환이다. "같은 모양을 만든다"와 "같은 변환이다"는 다른 말이다.
- 목표의 [행렬식](t:t.determinant)이 음수인데 뒤집기를 끄면, 아무리 돌려도 화살표 순서(주황에서 청록으로 도는 방향)를 맞출 수 없다. [왜?](why:prop.det-sign)

> [!직관] 숙련의 기준
> 행렬 하나를 보고 "대략 몇 도 돌리고, 대략 몇 배와 몇 배로 늘이고, 다시 몇 도 돈다"를 어림할 수 있게 되면 이 장의 목표에 닿은 것이다. 훈련장의 "SVD 어림" 연습이 이 감각을 반복 훈련한다.`,
    },
    {
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
    },
    {
      id: 'prop.svd-sum',
      kind: 'prop',
      title: '행렬 = 랭크 1 \'층\'들의 합',
      status: 'written',
      introduces: {
        terms: [{ id: 't.svd-layer', ko: "'층'", en: 'rank-one term', surfaces: ["'층'"], gloss: 'SVD의 한 항 σᵢuᵢvᵢᵀ(랭크 1 행렬)를 이 교재가 비유로 부르는 이름. 행렬은 \'층\'들의 합이고, σᵢ가 큰 \'층\'부터 줄을 선다. 비유이므로 언제나 작은따옴표를 붙인다.' }],
      },
      requires: ['prop.svd', 'def.outer-product'],
      predicts: [
        {
          id: 'p-drop',
          kind: 'choice',
          q: String.raw`'층' 2를 버리고 '층' 1 $\sigma_1\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}}$만 남기면, 출력은 어떻게 될까?`,
          choices: [String.raw`모든 출력이 $\mathbf{u}_1$ 방향의 직선 위로 모인다`, String.raw`$\mathbf{x}$가 $\mathbf{v}_1$ 위에 있을 때만 바뀌고, 나머지는 그대로다`, '\'층\' 2는 작으니 아무것도 눈에 띄게 바뀌지 않는다', '모든 출력이 0이 된다'],
          answer: 0,
          why: [
            String.raw`'층' 1은 바깥곱이므로 랭크 1이다. 출력은 $(\mathbf{v}_1\cdot\mathbf{x})$배 한 $\mathbf{u}_1$뿐이다.`,
            String.raw`거꾸로다. $\mathbf{x}$가 $\mathbf{v}_1$ 위에 있으면 '층' 2는 원래 0을 내므로 아무것도 바뀌지 않는다. 바뀌는 것은 나머지 방향들이다.`,
            String.raw`출력의 **크기**로는 크게 다르지 않을 수 있다($\sigma_2$가 작다면). 그러나 **모양**은 크게 바뀐다. 평면 전체가 직선 하나로 접힌다.`,
            String.raw`$\mathbf{v}_1$에 수직인 입력만 0으로 간다.`,
          ],
        },
      ],
      body: String.raw`[특이값 분해](t:t.svd) $A = U\Sigma V^{\mathsf{T}}$를 "회전, 늘이기, 회전"이 아닌 다른 방식으로 읽을 수 있을까? [바깥곱](t:t.outer-product)을 써서 읽어 보자.

**명제.**

$$A = \sigma_1\,\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}} + \sigma_2\,\mathbf{u}_2\mathbf{v}_2^{\mathsf{T}} \quad\left(n\text{차원에서는 } A = \sum_i \sigma_i\,\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}\right)$$

각 항 $\sigma_i\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}$는 랭크 1 행렬이다. 이 항을 ['층'](def:t.svd-layer)이라 부르자. '층' $i$는 입력을 $\mathbf{v}_i$ 방향으로 읽고, $\sigma_i$배 해서, $\mathbf{u}_i$ 방향으로 쓴다.

> [!비유] '층'이라는 이름
> 행렬을 랭크 1 행렬들의 합으로 나눈 것을, 층을 쌓은 것에 빗댄다. 비유가 덮는 것은 둘이다. '층'을 모두 합치면 원래 행렬이 되고, 빠지거나 남는 것이 없다. 그리고 '층'마다 두께에 해당하는 $\sigma_i$가 있어서, 두꺼운 '층'부터 차례로 놓인다. 비유가 깨지는 곳도 있다. 실제 층은 서로 다른 높이에 따로 놓이지만, 이 '층'들은 같은 자리에 겹쳐 **더해진다**. 그래서 한 '층'의 성분이 음수일 수 있고, 다른 '층'과 더해져 서로 지워질 수도 있다.
>
> 이 교재는 이 뜻으로 쓸 때 언제나 작은따옴표를 붙여 '층'이라 적는다. 비유로 붙인 이름이라는 표시다. 교과서에서는 보통 풀어서 "랭크 1 항"(rank-one term)이라 부른다.

$$A\mathbf{x} = \sigma_1(\cv{\mathbf{v}_1}\cdot\cx{\mathbf{x}})\,\cu{\mathbf{u}_1} + \sigma_2(\cv{\mathbf{v}_2}\cdot\cx{\mathbf{x}})\,\cu{\mathbf{u}_2}$$

'층'은 $\sigma$가 큰 것부터, 곧 **중요한 것부터** 줄을 선다.

::predict p-drop

::scene b9-layers {}

### 장면에서 볼 것
- 노란 $\mathbf{x}$를 끌면 초록 점 두 개가 움직인다. 초록 점은 $\mathbf{x}$를 $\mathbf{v}_1$, $\mathbf{v}_2$ 방향으로 [정사영](t:t.orth-projection)한 자리다. '층'마다 그 길이에 $\sigma_i$를 곱해 $\mathbf{u}_i$ 방향의 하늘색 화살표를 내보낸다. 두 화살표를 이어 붙이면 분홍 $A\mathbf{x}$다.
- '층' 2를 끄면 격자 전체가 $\mathbf{u}_1$ 방향의 직선 하나로 접힌다. 남은 것은 랭크 1이다. 그래도 분홍 화살표는 원래 $A\mathbf{x}$에서 크게 벗어나지 않는다. $\sigma_2$가 $\sigma_1$보다 작아서 '층' 2의 기여가 작기 때문이다.

### 예
$A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$이면 $\sigma_1 \approx 1.7906$, $\mathbf{u}_1 \approx (0.8161, 0.5780)$, $\mathbf{v}_1 \approx (0.6437, 0.7652)$이고

$$\sigma_1\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}} \approx \begin{bmatrix} 0.9406 & 1.1182 \\ 0.6662 & 0.7919 \end{bmatrix}, \qquad \sigma_2\mathbf{u}_2\mathbf{v}_2^{\mathsf{T}} \approx \begin{bmatrix} 0.2594 & -0.2182 \\ -0.3662 & 0.3081 \end{bmatrix}$$

두 '층'을 더하면 정확히 $A$로 돌아온다. 첫째 '층'만으로도 $A$의 성분과 대략 비슷하다. 둘째 '층'은 "보정"에 해당한다. 장면의 수치와 맞춰 보라.`,
      proof: String.raw`두 행렬이 같다는 것은 모든 입력에 대해 같은 출력을 낸다는 것이다([왜 그것으로 충분한가?](why:prop.basis-determines) 특히 $\mathbf{x} = \mathbf{e}_j$를 넣으면 두 행렬의 $j$번째 열이 같아진다). 그러므로 아무 $\mathbf{x}$에서 양쪽을 비교한다.

왼쪽: $A\mathbf{x} = U(\Sigma(V^{\mathsf{T}}\mathbf{x}))$. [행의 관점](why:prop.row-picture)에서 $V^{\mathsf{T}}$의 행은 $\mathbf{v}_1^{\mathsf{T}}, \mathbf{v}_2^{\mathsf{T}}$이므로 $V^{\mathsf{T}}\mathbf{x} = (\mathbf{v}_1\cdot\mathbf{x}, \mathbf{v}_2\cdot\mathbf{x})$이다. $\Sigma$를 곱하면 $(\sigma_1\,\mathbf{v}_1\cdot\mathbf{x},\ \sigma_2\,\mathbf{v}_2\cdot\mathbf{x})$가 된다. 이 벡터를 $U$에 넣으면, [행렬-벡터 곱의 정의](why:def.matvec)에 따라 성분을 계수로 삼아 $U$의 열 $\mathbf{u}_1, \mathbf{u}_2$를 섞는다.

$$A\mathbf{x} = (\sigma_1\,\mathbf{v}_1\cdot\mathbf{x})\,\mathbf{u}_1 + (\sigma_2\,\mathbf{v}_2\cdot\mathbf{x})\,\mathbf{u}_2$$

오른쪽: [바깥곱의 작용](why:def.outer-product) $(\mathbf{u}\mathbf{v}^{\mathsf{T}})\mathbf{x} = (\mathbf{v}\cdot\mathbf{x})\mathbf{u}$를 '층'마다 쓰면 바로 위 식과 같다. 모든 $\mathbf{x}$에서 같으므로 두 행렬은 같다.`,
      checks: [
        {
          q: '\'층\' 2를 끄고 \'층\' 1만 남긴 행렬 σ₁u₁v₁ᵀ의 랭크와 열공간은?',
          choices: ['랭크 1, 열공간은 u₁ 방향의 직선', '랭크 1, 열공간은 v₁ 방향의 직선', '랭크 2, 열공간은 평면 전체', 'σ₁에 따라 다르다'],
          answer: 0,
          explain: String.raw`바깥곱 $\mathbf{u}\mathbf{v}^{\mathsf{T}}$의 모든 열은 $\mathbf{u}$의 배수다. 그래서 출력은 모두 $\mathbf{u}_1$ 방향의 직선 위에 있다. $\mathbf{v}_1$은 "읽는" 방향이다. $\sigma_1 > 0$이기만 하면 랭크는 1이다.`,
        },
      ],
    },
    {
      id: 'prop.eckart-young',
      kind: 'prop',
      title: '가장 좋은 랭크 k 근사 (에카르트–영)',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.low-rank', ko: '저랭크 근사', en: 'low-rank approximation', gloss: '랭크가 k 이하인 행렬 가운데 원래 행렬과 가장 가까운 것을 찾는 일.' },
          { id: 't.frobenius', ko: '프로베니우스 노름', en: 'Frobenius norm', gloss: '행렬의 모든 성분을 제곱해 더한 값의 제곱근. 행렬을 숫자 mn개짜리 긴 벡터로 보고 잰 길이.' },
        ],
        symbols: [
          { tex: 'k', meaning: '저랭크 근사에서 남기는 \'층\'의 수' },
          { tex: 'A_k', meaning: '앞의 k개 \'층\'만 더한 랭크 k 근사' },
          { tex: String.raw`\|A\|_F`, meaning: '행렬 A의 프로베니우스 노름' },
        ],
      },
      requires: ['prop.svd-sum'],
      openWhys: [{ q: '일반적인 m×n 행렬과 아무 k에 대해서도 A_k가 가장 가깝다는 것의 완전한 증명은?', answeredBy: null }],
      predicts: [
        {
          id: 'p-err',
          kind: 'choice',
          q: String.raw`특이값이 3, 2, 1인 3×3 행렬에서 앞의 '층' 하나만 남기고 나머지 두 '층'을 버렸다. 원래 행렬과의 거리(프로베니우스 노름)는 얼마일까?`,
          hints: [
            String.raw`버린 것은 '층' 2와 '층' 3이다. 남은 차이 $A - (\text{'층' 1})$은 그 두 '층'의 합이다.`,
            String.raw`두 '층'은 서로 수직인 방향 $\mathbf{u}_2, \mathbf{u}_3$으로 내보낸다. 수직인 두 화살표를 합친 길이는 [피타고라스 정리](n:prop.pythagoras)로 잰다.`,
          ],
          choices: [String.raw`$\sqrt{5} \approx 2.24$`, '3 (= 2 + 1)', '2 (버린 것 가운데 가장 큰 특이값)', '1'],
          answer: 0,
          why: [
            String.raw`버린 두 '층'은 서로 직교하는 방향에 놓여 있어서, 거리의 제곱이 $2^2 + 1^2 = 5$로 더해진다. 피타고라스 정리와 같은 모양이다. 아래 증명의 1번이 이것이다.`,
            String.raw`특이값을 그대로 더하는 것은 서로 수직인 두 변의 길이를 그대로 더하는 것과 같다. 거리는 제곱해서 더한 뒤 제곱근을 취해야 한다.`,
            String.raw`다른 거리(스펙트럼 노름: 가장 많이 늘어나는 배율로 잰 크기)로 재면 맞는 답이다. 프로베니우스 노름은 모든 성분을 함께 잰다.`,
            String.raw`가장 작은 특이값 하나만 센 것이다. 버린 '층'은 두 개다.`,
          ],
        },
      ],
      body: String.raw`[행렬을 '층'으로 나눌 수 있고, '층'은 중요한 것부터 줄을 선다](why:prop.svd-sum). 그렇다면 앞의 $k$개 '층'만 남기고 나머지를 버리면 어떻게 될까? 버린 만큼 틀리게 된다. 그 틀림은 얼마나 큰가? 그리고 랭크 $k$ 행렬로 근사하는 다른 방법 가운데 이것보다 나은 것이 있는가?

### 두 행렬 사이의 거리
"가깝다"를 재려면 행렬의 크기를 정해야 한다. $m \times n$ 행렬의 성분 $mn$개를 한 줄로 늘어놓으면 숫자 $mn$개짜리 벡터가 된다. 그 벡터의 [노름](t:t.norm)을 행렬의 [프로베니우스 노름](def:t.frobenius) $\|A\|_F$라 한다.

$$\|A\|_F^2 = \sum_{i,j} a_{ij}^2 = \|\mathbf{a}_1\|^2 + \|\mathbf{a}_2\|^2 + \cdots$$

둘째 등호는 성분을 열 단위로 묶어 더한 것이다. 두 행렬 $A$, $B$의 거리는 $\|A - B\|_F$로 잰다.

::predict p-err

### 명제
$A$의 SVD에서 앞의 $k$개 '층'만 더한 행렬을 $A_k = \sum_{i \le k}\sigma_i\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}$라 하자.

1. **틀린 만큼:** $\|A - A_k\|_F^2 = \sigma_{k+1}^2 + \sigma_{k+2}^2 + \cdots$ (버린 특이값의 제곱의 합).
2. **가장 좋음(에카르트–영 정리):** 랭크가 $k$ 이하인 **모든** 행렬 $B$에 대해 $\|A - B\|_F \ge \|A - A_k\|_F$.

곧 [저랭크 근사](def:t.low-rank)의 정답은 SVD를 앞에서부터 잘라 내는 것이다. 이 명제는 근사의 방법뿐 아니라 **한계**도 알려 준다. 랭크 $k$로는 버린 특이값보다 더 잘 맞출 수 없다.

### 예
- $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$, $k = 1$: $\|A - A_1\|_F = \sigma_2 \approx 0.586$. 다른 랭크 1 근사와 비교해 보자. 둘째 열을 버리고 첫째 열만 남긴 $B = \begin{bmatrix} 1.2 & 0 \\ 0.3 & 0 \end{bmatrix}$도 랭크 1이다. 그런데 $\|A - B\|_F = \|\mathbf{a}_2\| = \sqrt{2.02} \approx 1.421$로 두 배 넘게 틀린다.
- 랭크 2인 $3 \times 3$ 행렬이면 $\sigma_3 = 0$이므로 $\|A - A_2\|_F = 0$이다. '층' 두 개로 정확히 복원된다.

> [!코드] 테스트가 이 명제를 확인한다
> 이 저장소의 테스트 \`Eckart–Young\`은 무작위 12×9 행렬에서 $k = 0, 1, \dots, 9$마다 $\|A - A_k\|_F^2$와 버린 $\sigma^2$의 합이 소수점 아래 8자리까지 같은지 확인한다(1번 식). 2번의 "가장 좋음"은 무작위 검사로 확인할 수 있는 종류의 주장이 아니다. 그래서 아래 증명이 필요하다.`,
      proof: String.raw`**보조 사실: 직교 행렬을 곱해도 프로베니우스 노름은 그대로다.** $Q$가 직교 행렬이면 $\|QM\|_F = \|M\|_F$다. $QM$의 열은 $Q\mathbf{m}_j$이고, [직교 행렬은 길이를 지키므로](why:prop.orthogonal-preserves) 열마다 길이가 같기 때문이다. 오른쪽에 곱하는 경우 $\|MQ\|_F = \|M\|_F$는 전치하여 같은 논리를 쓴다. 성분을 모두 제곱해 더한 값은 전치해도 같고, $(MQ)^{\mathsf{T}} = Q^{\mathsf{T}}M^{\mathsf{T}}$에서 $Q^{\mathsf{T}}$도 직교 행렬이다([왜?](why:prop.orthogonal-inverse)). 이 사실의 한 가지 결과로, 아무 정규직교 기저 $\mathbf{q}_1, \dots, \mathbf{q}_n$에 대해 $\|M\|_F^2 = \sum_j \|M\mathbf{q}_j\|^2$이다. ($MQ$의 열이 $M\mathbf{q}_j$이기 때문이다.)

**1번(틀린 만큼).** $A - A_k = \sum_{i>k}\sigma_i\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}} = U\,\Sigma'\,V^{\mathsf{T}}$이다. 여기서 $\Sigma'$은 $\Sigma$에서 앞의 $k$개 대각 성분을 0으로 바꾼 것이다([왜 이렇게 다시 묶을 수 있는가?](why:prop.svd-sum)). 보조 사실에 따라 $\|U\Sigma'V^{\mathsf{T}}\|_F = \|\Sigma'\|_F$이고, 이 값의 제곱은 $\sum_{i>k}\sigma_i^2$이다.

**2번(가장 좋음): 2×2, k = 1인 경우.** $B$를 랭크 1 이하인 아무 2×2 행렬이라 하자. [입력 차원 = 랭크 + 영공간의 차원](why:prop.rank-nullity)이므로 $B$의 영공간은 적어도 1차원이다. 그 안에서 길이 1인 $\mathbf{w}$를 하나 고르고, $\mathbf{w}$에 수직인 단위벡터를 $\mathbf{w}'$라 하자. 보조 사실을 정규직교 기저 $\mathbf{w}, \mathbf{w}'$에 쓰면

$$\|A - B\|_F^2 = \|(A - B)\mathbf{w}\|^2 + \|(A - B)\mathbf{w}'\|^2 \ \ge\ \|(A - B)\mathbf{w}\|^2 = \|A\mathbf{w}\|^2 \ \ge\ \sigma_2^2$$

마지막 부등식은 [단위 입력은 적어도 $\sigma_2$만큼은 늘어난다](why:prop.svd-ata)는 사실이다. 한편 $\|A - A_1\|_F^2 = \sigma_2^2$(1번)이므로 $A_1$이 이 하한에 정확히 닿는다. ∎(2×2, $k = 1$)

**일반적인 경우.** 같은 생각이 이어진다. 랭크 $k$ 이하의 $B$는 적어도 $n - k$차원의 영공간을 가지고, $A$는 그 영공간을 어딘가로 보내야 한다. 그러나 $(n-k)$차원 공간 위에서 $\|A\mathbf{x}\|^2$의 합이 $\sigma_{k+1}^2 + \cdots$ 이상이라는 것을 보이려면, 이 교재가 다루지 않은 도구(바일 부등식, 또는 쿠란트–피셔 최소최대 정리)가 필요하다. 이 교재 안에서는 일반적인 경우를 증명 없이 받아들인다. 이 사실은 아래 "아직 여기서 답하지 않은 질문"에 기록해 둔다.`,
      checks: [
        {
          q: String.raw`특이값이 $10, 3, 1, 0.5$인 4×4 행렬을 랭크 2로 가장 잘 근사했을 때 오차 $\|A - A_2\|_F$는?`,
          choices: [String.raw`$\sqrt{1.25} \approx 1.118$`, '1.5', '1', String.raw`$\sqrt{9 + 1} \approx 3.16$`],
          answer: 0,
          explain: String.raw`버린 특이값은 1과 0.5이므로 오차의 제곱은 $1^2 + 0.5^2 = 1.25$다. 특이값을 그대로 더한 1.5는 제곱을 빠뜨린 것이다. 1은 가장 큰 버린 특이값 $\sigma_3$뿐인데, 이 값은 다른 노름(스펙트럼 노름)에서의 오차다. 마지막 선택지는 남긴 '층'을 버린 '층'으로 착각한 것이다.`,
        },
        {
          q: '전체 크기 ‖A‖_F² = 110.25 (= 10² + 3² + 1² + 0.5²)일 때, 랭크 1 근사가 담는 "에너지"의 비율은?',
          choices: ['100/110.25 ≈ 90.7%', '10/14.5 ≈ 69%', '25%', '알 수 없다'],
          answer: 0,
          explain: String.raw`$\|A_1\|_F^2 = \sigma_1^2 = 100$이다. '층'들은 서로 직교하므로(보조 사실을 생각하라) 에너지가 제곱의 합으로 나뉜다. 그래서 특이값을 제곱해서 비교해야 한다. 특이값이 빠르게 줄어드는 행렬일수록 앞의 '층' 몇 개에 거의 모든 것이 담긴다. 다음 노드의 그림이 그런 예다.`,
        },
      ],
      code: ['lowRankInto', 'frobenius'],
    },
    {
      id: 'exp.image-lowrank',
      kind: 'exp',
      title: '그림 한 장을 랭크로 압축하기',
      status: 'written',
      requires: ['prop.eckart-young'],
      predicts: [
        {
          id: 'p-plaid',
          kind: 'choice',
          q: '가로 줄무늬 그림 하나와 세로 줄무늬 그림 하나를 더해 만든 체크무늬(112×112)를 완벽하게 되살리려면 \'층\'이 몇 개 필요할까?',
          choices: ['2개 이하', '줄무늬의 줄 수만큼', '112개 (그림의 한 변)', '근사만 할 수 있고 완벽하게 되살릴 수는 없다'],
          answer: 0,
          why: [
            String.raw`가로 줄무늬는 "세로로 변하는 패턴 × 가로로 모두 1"인 바깥곱이고, 세로 줄무늬는 그 반대다. 바깥곱 두 개의 합이므로 랭크가 2 이하다.`,
            String.raw`줄 수는 패턴 안에서 값이 몇 번 바뀌는지일 뿐이다. 랭크는 서로 다른 패턴의 **종류**를 센다.`,
            String.raw`아무 그림이라면 112개까지 필요할 수 있다. 이 그림은 구조가 단순하다.`,
            String.raw`'층'을 모두 쓰면 SVD는 언제나 정확히 되살린다. 이 그림은 그보다 훨씬 적은 '층'으로 정확히 되살아난다.`,
          ],
        },
      ],
      body: String.raw`흑백 그림은 밝기 숫자의 표다. 0은 검정, 1은 흰색이다. 그러므로 $m \times n$ 픽셀 그림은 $m \times n$ 행렬이다. 이 행렬에 [에카르트–영 정리](t:t.low-rank)를 쓰면 무엇이 보일까?

::predict p-plaid

::scene b9-image {"k": 8}

### 해 볼 것
1. **글자**: $k$를 1부터 천천히 올려라. $k = 1$일 때의 그림은 가로 패턴 하나와 세로 패턴 하나의 곱이다([바깥곱](t:t.outer-product)). 그래서 십자 무늬 같은 흐린 얼룩으로 보인다. '층' 몇 개부터 글자를 읽을 수 있는가? 그때 저장할 숫자는 원래의 몇 %인가?
2. **체크무늬**: 가로 줄무늬 하나와 세로 줄무늬 하나를 더해 만든 그림이다. 각각이 바깥곱이므로 이 그림의 [랭크](t:t.rank)는 2 이하다. $k = 2$에서 오차가 0이 되는 것을 확인하라. 막대그래프에서 셋째 특이값부터 0인 것도 보인다.
3. **원**: 단순한 모양인데도 많은 '층'이 필요하다. 원의 윤곽은 "가로 패턴 × 세로 패턴"으로 나누기 어려운 모양이기 때문이다. 랭크는 그림이 사람 눈에 얼마나 단순한지를 재는 것이 아니다. **가로·세로 방향의 패턴 몇 개의 합으로 쓸 수 있는지**를 잰다.
4. **k번째 '층' 하나**(오른쪽 그림): '층' 하나는 음수 성분도 가진다(주황 = 음수, 하늘 = 양수). 앞쪽 '층'은 큰 덩어리를, 뒤쪽 '층'은 가장자리 같은 세부를 담는다.
5. 내 그림을 올려 보라. 사진은 대개 특이값이 빠르게 줄어든다.

### 저장 비용 셈
'층' 하나에는 $\mathbf{u}_i$($m$개), $\mathbf{v}_i$($n$개), $\sigma_i$(1개)가 필요하다. 그러므로 '층'이 $k$개이면 숫자 $k(m + n + 1)$개다. 112×112 그림에서 $k = 8$이면 $8 \times 225 = 1800$개로, 원래 12544개의 약 14%다.

> [!주의] 실제 이미지 압축은 SVD를 쓰지 않는다
> JPEG 같은 실제 형식은 그림마다 다른 $\mathbf{u}_i, \mathbf{v}_i$를 저장하지 않는다. 대신 모든 그림에 똑같이 쓰는 고정된 기저(이산 코사인 변환)를 쓴다. SVD의 기저는 그 그림 하나에 최적이지만, 기저 자체를 함께 저장해야 하고 계산도 비싸다. "가장 좋은 근사"와 "가장 좋은 압축 형식"은 다른 문제다. 비용이 어디서 생기는지가 다르기 때문이다. 10장에서 비슷한 맞바꿈이 다시 나온다.`,
    },
    {
      id: 'prop.svd-four-subspaces',
      kind: 'prop',
      title: 'SVD는 네 기본 부분공간에 좌표를 준다',
      status: 'written',
      requires: ['prop.svd', 'exp.four-subspaces'],
      predicts: [
        {
          id: 'p-v3',
          kind: 'choice',
          q: String.raw`랭크가 2인 3×3 행렬에서, 특이값이 0인 우특이벡터 $\mathbf{v}_3$는 네 부분공간 가운데 어디에 속할까?`,
          choices: ['영공간', '행공간', '열공간', '좌영공간'],
          answer: 0,
          why: [
            String.raw`$\|A\mathbf{v}_3\| = \sigma_3 = 0$이므로 $A\mathbf{v}_3 = \mathbf{0}$이다. 0으로 사라지는 입력, 곧 영공간이다.`,
            String.raw`행공간의 0이 아닌 벡터는 0이 아닌 출력을 낸다(행공간은 영공간과 직교하므로 영공간과 겹치는 벡터는 $\mathbf{0}$뿐이다). $\mathbf{v}_3$의 출력은 0이다.`,
            String.raw`$\mathbf{v}$들은 입력 공간의 벡터다. 열공간은 출력 공간에 있다.`,
            String.raw`$\mathbf{v}$들은 입력 공간의 벡터다. 좌영공간은 출력 공간에 있다.`,
          ],
        },
      ],
      body: String.raw`6장에서 모든 행렬에 [네 기본 부분공간](n:exp.four-subspaces)이 있다는 것을 보았다. 입력 쪽의 [행공간](t:t.row-space)과 [영공간](t:t.null-space), 출력 쪽의 [열공간](t:t.column-space)과 [좌영공간](t:t.left-null)이다. 그런데 그 지도에는 좌표가 없었다. 각 공간이 몇 차원인지는 알았지만, 각 공간을 펼치는 "좋은" 기저가 무엇인지는 몰랐다. SVD는 네 공간 모두에 **정규직교** 기저를 한꺼번에 준다.

::predict p-v3

**명제.** $A$가 $m \times n$이고 $\operatorname{rank} A$개의 특이값이 0보다 크다고 하자(나머지는 0). 그러면
- $\mathbf{v}_1, \dots$ 가운데 앞의 $\operatorname{rank} A$개는 **행공간**의 정규직교 기저이고, 나머지 $\mathbf{v}_i$들은 **영공간**의 정규직교 기저다.
- $\mathbf{u}_1, \dots$ 가운데 앞의 $\operatorname{rank} A$개는 **열공간**의 정규직교 기저이고, 나머지 $\mathbf{u}_i$들은 **좌영공간**의 정규직교 기저다.
- 행공간의 $\mathbf{v}_i$는 $A$에 의해 열공간의 $\mathbf{u}_i$로, 정확히 $\sigma_i$배 늘어나 짝지어진다.

이렇게 보면 행렬이 하는 일 전체가 한 문장으로 요약된다. **입력 공간을 "살아남는 방향들"과 "사라지는 방향들"로 직교하게 나누고, 살아남는 방향들을 하나씩 출력의 방향에 짝지어 늘인다. 출력의 나머지 방향에는 아무것도 닿지 않는다.**

::scene b9-subspaces3 {}

### 장면에서 볼 것
행렬 $A = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 1 & 2 & 1 \end{bmatrix}$의 셋째 행은 첫째 행 + 둘째 행이다. 그래서 랭크가 2다. 특이값은 정확히 $3,\ 1,\ 0$이다($A^{\mathsf{T}}A$의 고윳값이 9, 1, 0).
- 왼쪽(입력): 노란 단위 구 위에 초록 $\mathbf{v}_1, \mathbf{v}_2$가 행공간 평면을 펼친다. 점선 $\mathbf{v}_3$이 영공간이다.
- 오른쪽(출력): 단위 구가 분홍 **납작한 타원판**이 된다. 그 판이 놓인 평면이 열공간이고, 판에 수직인 점선 $\mathbf{u}_3$이 좌영공간이다.
- 행렬의 셋째 행을 바꿔 랭크를 3으로 만들면 판이 부풀어 타원체가 된다. 영공간과 좌영공간은 사라진다.

### 예 (2×2)
랭크 1인 $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: [앞에서](n:prop.svd-ata) 구한 대로 $\sigma_1 = 5$, $\sigma_2 = 0$, $\mathbf{v}_1 = (1, 2)/\sqrt{5}$, $\mathbf{v}_2 = (-2, 1)/\sqrt{5}$다. 행공간은 $\mathbf{v}_1$ 방향(행 $(1, 2)$의 방향과 같다), 영공간은 $\mathbf{v}_2$ 방향이다. $\mathbf{u}_1 = A\mathbf{v}_1/5 = (1, 2)/\sqrt{5}$는 열공간의 방향(열 $(1, 2)$의 방향과 같다), $\mathbf{u}_2 = (-2, 1)/\sqrt{5}$는 좌영공간의 방향이다. 이 행렬은 대칭이라 입력 쪽과 출력 쪽 공간이 같은 직선이지만, 일반적으로는 다르다.`,
      proof: String.raw`**영공간.** 특이값이 0인 $i$에 대해 $\|A\mathbf{v}_i\|^2 = \sigma_i^2 = 0$이므로 $A\mathbf{v}_i = \mathbf{0}$이다. 그래서 이런 $\mathbf{v}_i$들은 영공간에 있다. 그 개수는 $n - \operatorname{rank}A$이고, [영공간의 차원도 정확히 그만큼](why:prop.rank-nullity)이다. 정규직교 벡터들은 [선형 독립](t:t.lin-indep)이므로, 영공간 안에서 그 차원만큼의 독립 벡터는 기저가 된다.

**행공간.** [행공간은 영공간과 직교한다](why:prop.row-null-perp). 앞의 $\operatorname{rank}A$개의 $\mathbf{v}_i$는 영공간의 기저인 나머지 $\mathbf{v}_j$와 모두 직교한다. 그런데 입력 공간 $\mathbb{R}^n$에서 영공간에 수직인 벡터 전체가 행공간이고, 행공간의 차원은 $\operatorname{rank}A$다. 그 안에서 $\operatorname{rank}A$개의 정규직교 벡터는 기저가 된다. (여기서 "영공간에 수직인 것 전체 = 행공간"은 [6장의 네 부분공간 지도에서 차원을 세어 얻은 사실](why:exp.four-subspaces)이다.)

**열공간.** $\sigma_i > 0$이면 $\mathbf{u}_i = A(\mathbf{v}_i/\sigma_i)$이므로 $\mathbf{u}_i$는 출력이 닿는 곳, 곧 열공간에 있다. 개수가 $\operatorname{rank}A$ = [열공간의 차원](why:def.rank)이고 정규직교이므로 기저다.

**좌영공간.** 나머지 $\mathbf{u}_i$는 앞의 $\mathbf{u}$들, 곧 열공간의 기저와 모두 직교한다. 그러므로 열공간 전체와 직교하고, 그것이 좌영공간이다. 다른 식으로 보면, $A^{\mathsf{T}} = V\Sigma^{\mathsf{T}}U^{\mathsf{T}}$에서 $A^{\mathsf{T}}\mathbf{u}_i = \sigma_i\mathbf{v}_i = \mathbf{0}$이다.`,
      checks: [
        {
          q: '5×3 행렬의 특이값이 4, 2, 0이다. 네 부분공간의 차원은 (행공간, 영공간, 열공간, 좌영공간) 순서로?',
          choices: ['(2, 1, 2, 3)', '(3, 0, 3, 2)', '(2, 1, 2, 1)', '(2, 3, 2, 1)'],
          answer: 0,
          explain: String.raw`0보다 큰 특이값이 2개이므로 랭크는 2다. 입력은 $\mathbb{R}^3$이므로 영공간은 $3 - 2 = 1$차원이다. 출력은 $\mathbb{R}^5$이므로 좌영공간은 $5 - 2 = 3$차원이다. 입력 쪽 두 공간의 차원을 더하면 열의 수 3, 출력 쪽 두 공간의 차원을 더하면 행의 수 5다.`,
        },
      ],
      code: ['svd'],
    },
  ],
};
export default book;
