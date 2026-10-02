import type { Book } from './schema';

// 5권 — 되돌리기. 역행렬, 그리고 "어떤 입력이 이 출력에 도착하는가"(연립일차방정식).
const book: Book = {
  id: 'b5',
  num: 5,
  title: '되돌리기',
  subtitle: '역행렬과 연립일차방정식',
  nodes: [
    {
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
            String.raw`시계 방향으로 30° 돌리면 제자리다. 3권에서 본 대로 그것은 $R_{30°}$의 전치와 같다. 이 일치는 우연이 아니다(이 권의 넷째 노드).`,
            String.raw`$30° + 60° = 90°$다. 되돌리려면 합이 0°여야 한다.`,
            String.raw`$-R_{30°}$는 30° 돌린 뒤 180° 더 돌린 것(210° 회전)이다.`,
            String.raw`두 번 하면 60° 돌아간다.`,
          ],
        },
      ],
      body: String.raw`변환 $A$를 한 뒤, 그 결과를 보고 원래 입력으로 **되돌릴** 수 있을까? 되돌리는 변환도 행렬일까?

**정의.** 정사각 행렬 $A$에 대해 $A^{-1}A = I$이고 $AA^{-1} = I$인 행렬 $A^{-1}$이 있으면, $A^{-1}$을 $A$의 [역행렬](def:t.inverse)이라 하고, $A$를 [가역](def:t.invertible) 행렬이라 한다.

[합성](t:t.composition)으로 읽으면 "$A$를 한 뒤 $A^{-1}$을 하면 아무것도 안 한 것과 같고, 순서를 바꿔도 그렇다"는 뜻이다. [항등 행렬](t:t.identity)이 "아무것도 안 함"이다.

::scene b5-undo {}

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
    },
    {
      id: 'prop.inverse-exists',
      kind: 'prop',
      title: '역행렬이 있을 조건: det A ≠ 0',
      status: 'written',
      requires: ['def.inverse', 'prop.det-zero', 'prop.det-product'],
      predicts: [
        {
          id: 'p-formula',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$의 역행렬은?`,
          hints: [
            String.raw`아래 공식: 대각선 두 성분은 자리를 맞바꾸고, 나머지 두 성분은 부호만 바꾼 뒤, 전체를 $\det A$로 나눈다.`,
            String.raw`$\det A = 2 - 1 = 1$이다. 답이 맞는지는 $A$와 곱해서 $I$가 나오는지로 확인하라.`,
          ],
          choices: [String.raw`$\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0.5 & 1 \\ 1 & 1 \end{bmatrix}$ (성분마다 역수)`, String.raw`$\begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -1 & 1 \\ 1 & -2 \end{bmatrix}$`],
          answer: 0,
          why: [
            String.raw`$\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$.`,
            String.raw`성분마다 역수를 취하는 것은 흔한 착각이다. 역행렬은 **변환을** 되돌리는 것이지 숫자를 하나씩 뒤집는 것이 아니다. 곱해 보면 $I$가 나오지 않는다.`,
            String.raw`대각선만 맞바꾸고 부호를 바꾸지 않았다.`,
            String.raw`부호를 반대로 바꿨다. 이것은 $-A^{-1}$이다.`,
          ],
        },
        {
          id: 'p-det',
          kind: 'choice',
          q: String.raw`$\det A = 4$이면 $\det(A^{-1})$은?`,
          hints: [String.raw`$A^{-1}A = I$의 양쪽에 행렬식을 취해 보라. [곱의 행렬식은 행렬식의 곱](n:prop.det-product)이다.`],
          choices: [String.raw`$\tfrac{1}{4}$`, '4', '−4', '1'],
          answer: 0,
          why: [
            String.raw`$\det(A^{-1})\det A = \det I = 1$이므로 $\det(A^{-1}) = 1/4$. 넓이를 4배 한 것을 되돌리면 넓이가 4분의 1이 된다.`,
            String.raw`되돌리는 변환은 넓이를 다시 줄여야 한다.`,
            String.raw`뒤집힘을 되돌릴 일은 없다. $\det A$가 양수이므로 향은 뒤집히지 않았다.`,
            String.raw`$A$와 $A^{-1}$을 함께 한 결과($I$)의 행렬식이 1이다.`,
          ],
        },
      ],
      body: String.raw`어떤 행렬은 되돌릴 수 있고 어떤 행렬은 되돌릴 수 없을까? 둘을 가르는 기준은 무엇일까?

**명제.** 2×2 행렬 $A$가 [가역](t:t.invertible)인 것은 $\det A \ne 0$인 것과 같다. 그리고 그때

$$A^{-1} = \frac{1}{\det A}\begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11} \end{bmatrix}$$

이다.

::scene b5-collapse {}

이 그림의 행렬은 행렬식이 0이다. 노란 점선 위의 입력들이 **모두 같은 출력**으로 간다. 출력만 보고는 그중 어느 입력에서 왔는지 알 수 없다. 그래서 되돌릴 수 없다.

::predict p-formula

::predict p-det

### 두 개의 예
- $\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$: $\det = 1$, 역행렬 $\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$.
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $\det = 0$이므로 역행렬이 없다. 공식으로는 0으로 나누게 된다. 그림으로는 평면이 직선 하나로 눌려서, 직선 밖의 출력은 어디서도 오지 않고 직선 위의 출력은 끝없이 많은 곳에서 온다.`,
      proof: String.raw`**det A = 0이면 가역이 아니다.** [행렬식이 0이면](why:prop.det-zero) 영벡터가 아닌 $\mathbf{z}$가 있어 $A\mathbf{z} = \mathbf{0} = A\mathbf{0}$이다. 서로 다른 두 입력 $\mathbf{z}$와 $\mathbf{0}$이 같은 출력으로 가므로, 되돌리는 변환이 $\mathbf{0}$을 어디로 보내야 할지 하나로 정할 수 없다. (또는: $A^{-1}$이 있다면 [$\det(A^{-1})\det A = \det I = 1$](why:prop.det-product)이어야 하는데 $\det A = 0$이면 불가능하다.)

**det A ≠ 0이면 위 공식이 역행렬이다.** 직접 곱하면

$$\begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11} \end{bmatrix}\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} = \begin{bmatrix} a_{11}a_{22} - a_{12}a_{21} & 0 \\ 0 & a_{11}a_{22} - a_{12}a_{21} \end{bmatrix} = (\det A)\,I$$

이다(대각선 밖은 $a_{22}a_{12} - a_{12}a_{22} = 0$ 같은 꼴로 지워진다). 양쪽을 $\det A$로 나누면 $A^{-1}A = I$다. 반대 순서의 곱도 같은 계산으로 $I$가 된다.`,
      code: ['inverse2'],
    },
    {
      id: 'prop.inverse-product',
      kind: 'prop',
      title: '(AB)⁻¹ = B⁻¹A⁻¹ — 양말과 신발',
      status: 'written',
      requires: ['def.inverse', 'prop.associative'],
      predicts: [
        {
          id: 'p-order',
          kind: 'choice',
          q: String.raw`$A$, $B$가 가역일 때 $(AB)^{-1}$은?`,
          hints: [
            String.raw`$AB$는 "$B$를 먼저, 그다음 $A$"다. 이 둘을 되돌리려면 무엇을 먼저 되돌려야 하는가? 마지막에 한 일부터다.`,
            String.raw`후보를 $AB$에 곱해서 $I$가 되는지 확인하라. 괄호는 [결합법칙](n:prop.associative)으로 옮길 수 있다.`,
          ],
          choices: [String.raw`$B^{-1}A^{-1}$`, String.raw`$A^{-1}B^{-1}$`, String.raw`$(BA)^{-1}$과 같고, 따라서 $AB$와 상관없다`, String.raw`$AB$의 각 성분의 역수`],
          answer: 0,
          why: [
            String.raw`$(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}B = I$. 마지막에 한 $A$를 먼저 되돌리고, 처음에 한 $B$를 나중에 되돌린다.`,
            String.raw`순서를 그대로 두면 $(A^{-1}B^{-1})(AB) = A^{-1}(B^{-1}A)B$에서 가운데가 지워지지 않는다. 흔한 실수다.`,
            String.raw`$(BA)^{-1} = A^{-1}B^{-1}$이고, 일반적으로 $AB \ne BA$이므로 다르다.`,
            String.raw`[역행렬은 성분의 역수가 아니다](n:prop.inverse-exists).`,
          ],
        },
      ],
      body: String.raw`두 변환을 차례로 한 것을 되돌리려면 어떻게 해야 할까?

::predict p-order

**명제.** $A$, $B$가 [가역](t:t.invertible)이면 $AB$도 가역이고

$$(AB)^{-1} = B^{-1}A^{-1}$$

이다. 순서가 뒤집힌다.

> [!비유] 양말과 신발
> 아침에 양말을 신고($B$) 신발을 신는다($A$). 밤에 되돌릴 때는 신발을 먼저 벗고($A^{-1}$) 양말을 나중에 벗는다($B^{-1}$). 마지막에 한 일을 먼저 되돌린다. 이 비유가 덮는 것은 **순서**뿐이다. 양말이나 신발은 선형 변환이 아니므로, "되돌리는 변환도 선형"이라는 사실까지 설명해 주지는 않는다.

::scene b5-undo {"B": [[2, 0], [0, 1]]}

"순서를 틀리게" 상자를 켜고 다시 해 보라. $B^{-1}$을 먼저 하면 격자가 제자리로 돌아오지 않는다.

### 두 개의 예
- $A$ = 90° 회전, $B$ = 가로 2배: $(AB)^{-1} = B^{-1}A^{-1}$ = "−90° 돌린 뒤 가로 절반". 순서를 바꾼 "가로 절반 뒤 −90°"는 세로를 절반으로 만들어 버린다.
- 같은 행렬 두 번: $(AA)^{-1} = A^{-1}A^{-1}$. 두 번 한 것은 두 번 되돌린다.`,
      proof: String.raw`[결합법칙](why:prop.associative)으로 괄호를 옮기면

$$(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}IB = B^{-1}B = I$$

이고, 같은 방식으로 $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AA^{-1} = I$다. 두 식이 모두 성립하므로 [역행렬의 정의](why:def.inverse)에 따라 $B^{-1}A^{-1}$이 $AB$의 역행렬이다.`,
    },
    {
      id: 'prop.orthogonal-inverse',
      kind: 'prop',
      title: '직교 행렬의 역행렬은 전치다',
      status: 'written',
      requires: ['def.inverse', 'def.orthogonal-matrix'],
      predicts: [
        {
          id: 'p-cost',
          kind: 'choice',
          q: String.raw`직교 행렬 $Q$의 역행렬을 구하는 데 필요한 계산은?`,
          hints: [String.raw`[직교 행렬의 조건](n:def.orthogonal-matrix)은 $Q^{\mathsf{T}}Q = I$였다. 이 식을 [역행렬의 정의](n:def.inverse)와 나란히 놓아 보라.`],
          choices: ['행과 열을 맞바꾸기만 하면 된다. 곱셈도 나눗셈도 없다', '일반 역행렬 공식을 써야 한다', '행렬식으로 나누는 일만 하면 된다', '직교 행렬은 역행렬이 없다'],
          answer: 0,
          why: [
            String.raw`$Q^{\mathsf{T}}Q = I$이므로 $Q^{\mathsf{T}}$가 바로 되돌리는 행렬이다. 아래에서 반대 순서 $QQ^{\mathsf{T}} = I$도 보인다. 회전을 되돌리는 계산이 이렇게 싼 이유가 이것이다.`,
            String.raw`써도 같은 답이 나오지만, 공식을 쓸 필요가 없다. 전치 한 번이면 된다.`,
            String.raw`직교 행렬의 행렬식은 ±1이라 나눠도 부호만 바뀐다. 그것만으로는 부족하다.`,
            String.raw`길이를 지키는 변환은 납작해지지 않으므로 언제나 되돌릴 수 있다.`,
          ],
        },
        {
          id: 'p-rows',
          kind: 'choice',
          q: '열이 정규직교인 정사각 행렬(직교 행렬)은 행도 정규직교일까?',
          hints: [String.raw`$Q^{-1} = Q^{\mathsf{T}}$이면 $QQ^{\mathsf{T}} = I$이기도 하다. $QQ^{\mathsf{T}}$의 성분은 $Q$의 무엇끼리의 내적인가?`],
          choices: ['그렇다. 행도 정규직교다', '아니다. 열만 정규직교다', '회전일 때만 그렇다', '반사일 때만 그렇다'],
          answer: 0,
          why: [
            String.raw`$QQ^{\mathsf{T}}$의 $i$행 $j$열 성분은 $Q$의 $i$번째 행과 $j$번째 행의 내적이다. 그것이 $I$이므로 행들도 정규직교다.`,
            String.raw`정사각 행렬에서는 열이 정규직교이면 행도 정규직교다. 정사각이 아니면(예: 3×2) 열만 정규직교일 수 있다.`,
            String.raw`반사도 마찬가지다.`,
            String.raw`회전도 마찬가지다.`,
          ],
        },
      ],
      body: String.raw`[회전의 전치는 되돌리는 회전](n:def.transpose)이었다. 이것은 회전만의 우연일까, 아니면 [직교 행렬](t:t.orth-matrix) 전체의 성질일까?

::predict p-cost

**명제.** 직교 행렬 $Q$는 가역이고 $Q^{-1} = Q^{\mathsf{T}}$이다. 그러므로 $QQ^{\mathsf{T}} = I$이기도 하고, $Q$의 행들도 정규직교다.

::scene b5-undo {"A": [[0.8, -0.6], [0.6, 0.8]], "showT": true}

읽기 칸에서 $A^{-1}$과 $A^{\mathsf{T}}$를 비교해 보라. 성분이 똑같다.

::predict p-rows

### 두 개의 예
- $R_\theta^{-1} = R_\theta^{\mathsf{T}} = R_{-\theta}$.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: 전치가 자기 자신이므로 역행렬도 자기 자신이다.`,
      proof: String.raw`**가역이다.** 2×2 행렬에서 $\det(A^{\mathsf{T}}) = \det A$다(공식 $a_{11}a_{22} - a_{12}a_{21}$은 행과 열을 바꿔도 같다). $Q^{\mathsf{T}}Q = I$의 양쪽에 행렬식을 취하면 [곱의 행렬식](why:prop.det-product)으로 $(\det Q)^2 = 1$이다. 그러므로 $\det Q = \pm1 \ne 0$이고, [Q는 가역이다](why:prop.inverse-exists).

**역행렬은 전치다.** $Q^{-1}$이 있으므로, 결합법칙으로

$$Q^{\mathsf{T}} = Q^{\mathsf{T}}(QQ^{-1}) = (Q^{\mathsf{T}}Q)Q^{-1} = IQ^{-1} = Q^{-1}$$

이다. 그러므로 $QQ^{\mathsf{T}} = QQ^{-1} = I$이기도 하다. $QQ^{\mathsf{T}}$의 $i$행 $j$열 성분은 [행의 관점](why:prop.row-picture)으로 $Q$의 $i$번째 행과 $Q^{\mathsf{T}}$의 $j$번째 열($= Q$의 $j$번째 행)의 내적이므로, 행들이 정규직교다.`,
    },
    {
      id: 'def.linear-system',
      kind: 'def',
      title: '연립일차방정식 Ax = b',
      status: 'written',
      introduces: {
        terms: [{ id: 't.linear-system', ko: '연립일차방정식', en: 'system of linear equations', gloss: '여러 개의 일차방정식을 동시에 만족하는 해를 찾는 문제. 행렬로 A𝐱 = 𝐛.' }],
        symbols: [{ tex: String.raw`\mathbf{b}`, meaning: '연립방정식 A𝐱 = 𝐛 의 오른쪽 벡터(목표 출력)' }],
      },
      requires: ['def.matvec', 'prop.row-picture'],
      predicts: [
        {
          id: 'p-solve',
          kind: 'point',
          q: String.raw`$2x_1 + x_2 = 5$와 $x_1 - x_2 = 1$을 동시에 만족하는 점 $(x_1, x_2)$를 분홍 점으로 끌어 놓아라.`,
          hints: [
            String.raw`두 식을 더하면 $x_2$가 지워진다.`,
            String.raw`$3x_1 = 6$에서 $x_1$을 구하고, 둘째 식에 넣어라.`,
          ],
          A: [[0.3333333333333333, 0.3333333333333333], [0.3333333333333333, -0.6666666666666666]],
          x: [5, 1],
          target: 'Ax',
          tol: 0.2,
          reveal: String.raw`정답은 $(2, 1)$이다. 이 점은 아래 두 그림에서 동시에 보인다. 열의 관점에서는 "열을 각각 2배, 1배 섞으면 $\mathbf{b} = (5, 1)$에 닿는다", 행의 관점에서는 "두 직선이 만나는 점"이다.`,
        },
        {
          id: 'p-none',
          kind: 'choice',
          q: String.raw`$2x_1 + x_2 = 5$와 $4x_1 + 2x_2 = 3$을 동시에 만족하는 해는?`,
          hints: [
            String.raw`둘째 식의 왼쪽은 첫째 식의 왼쪽의 2배다. 오른쪽도 2배인가?`,
            String.raw`행의 관점: 두 직선의 기울기를 비교하라. 열의 관점: 두 열 $(2, 4)$와 $(1, 2)$는 같은 직선 위에 있다. $\mathbf{b} = (5, 3)$은 그 직선 위에 있는가?`,
          ],
          choices: ['없다', '하나', '무수히 많다', '(1, 3)'],
          answer: 0,
          why: [
            String.raw`두 직선은 평행하고(왼쪽이 2배), 오른쪽은 2배가 아니므로($5 \times 2 \ne 3$) 만나지 않는다. 열의 관점에서는 $\mathbf{b}$가 두 열이 닿을 수 있는 직선 밖에 있다.`,
            String.raw`두 직선이 평행하다. 한 점에서 만나려면 기울기가 달라야 한다.`,
            String.raw`그것은 오른쪽까지 2배였을 때($4x_1 + 2x_2 = 10$), 곧 두 식이 같은 직선일 때다.`,
            String.raw`첫째 식만 만족한다: $2 + 3 = 5$. 둘째 식은 $4 + 6 = 10 \ne 3$.`,
          ],
        },
      ],
      body: String.raw`지금까지는 입력을 주고 출력을 물었다. 거꾸로, **출력이 주어졌을 때 어떤 입력이 거기에 도착하는가?**

**정의.** 행렬 $A$와 벡터 $\mathbf{b}$가 주어졌을 때 $A\mathbf{x} = \mathbf{b}$를 만족하는 $\mathbf{x}$를 찾는 문제를 [연립일차방정식](def:t.linear-system)이라 하고, 그런 $\mathbf{x}$를 해라 한다. $\mathbf{b}$는 목표 출력이다. 성분으로 쓰면 일차방정식 여러 개를 한꺼번에 만족시키는 문제다.

$$\begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix} \iff \begin{cases} 2x_1 + x_2 = 5 \\ x_1 - x_2 = 1 \end{cases}$$

::predict p-solve

### 같은 문제, 두 그림
::scene b5-two-pictures {}

- **열의 관점(왼쪽)**: [행렬-벡터 곱은 열들의 섞음](why:def.matvec)이므로, 해를 찾는 것은 "열 $\mathbf{a}_1$, $\mathbf{a}_2$를 얼마씩 섞어야 $\mathbf{b}$에 닿는가"를 찾는 것이다. 출력 공간에서 화살표를 이어 붙여 분홍 고리에 닿게 하라.
- **행의 관점(오른쪽)**: [출력의 성분 하나는 행 하나와의 내적](why:prop.row-picture)이므로, 방정식 하나는 "$i$행과의 내적이 $b_i$인 점들", 곧 입력 공간의 직선 하나다. 해는 모든 직선이 만나는 점이다.

### 해는 몇 개인가
단추로 세 경우를 비교하라.
- **해 하나**: 두 직선이 한 점에서 만난다. 두 열이 평면을 펼친다($\det A \ne 0$). 이때 해는 $A^{-1}\mathbf{b}$다.
- **해 없음**: 두 직선이 평행하고 겹치지 않는다. 두 열이 한 직선 위에 있고, $\mathbf{b}$가 그 직선 밖에 있다.
- **해 무수히**: 두 직선이 겹친다. 두 열이 한 직선 위에 있고, $\mathbf{b}$도 그 직선 위에 있다.

::predict p-none

"해가 없다"는 결론이 두 그림에서 같은 말이라는 점에 주목하라. 행의 관점의 평행한 직선과 열의 관점의 "닿을 수 없는 목표"는 같은 사실의 두 얼굴이다.`,
      checks: [
        {
          q: String.raw`$\det A \ne 0$인 2×2 행렬이다. $A\mathbf{x} = \mathbf{b}$의 해는 몇 개인가?`,
          choices: [String.raw`$\mathbf{b}$가 무엇이든 정확히 하나`, String.raw`$\mathbf{b}$에 따라 0개 또는 1개`, '무수히 많다', String.raw`$\mathbf{b} = \mathbf{0}$일 때만 하나`],
          answer: 0,
          explain: String.raw`[역행렬이 있으므로](n:prop.inverse-exists) $\mathbf{x} = A^{-1}\mathbf{b}$가 해이고, 다른 해 $\mathbf{x}'$가 있다면 $\mathbf{x}' = A^{-1}A\mathbf{x}' = A^{-1}\mathbf{b} = \mathbf{x}$이므로 하나뿐이다. 열이 평면 전체를 펼치므로 어떤 $\mathbf{b}$에도 닿는다.`,
        },
      ],
      code: ['solve'],
    },
    {
      id: 'prop.elimination',
      kind: 'prop',
      title: '가우스 소거 = 전단 변환을 차례로 곱하기',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.elimination', ko: '가우스 소거', en: 'Gaussian elimination', surfaces: ['가우스 소거법'], gloss: '한 행의 몇 배를 다른 행에서 빼는 일을 되풀이해 연립방정식을 푸는 방법. 기본 행렬을 왼쪽에 차례로 곱하는 것과 같다.' },
          { id: 't.elementary-matrix', ko: '기본 행렬', en: 'elementary matrix', gloss: '행 연산 하나를 행렬 곱 하나로 나타낸 행렬. 더하기(전단), 맞바꿈, 늘림.' },
        ],
      },
      requires: ['def.linear-system', 'exp.gallery', 'prop.det-product'],
      predicts: [
        {
          id: 'p-E',
          kind: 'choice',
          q: String.raw`"둘째 행에서 첫째 행의 2배를 뺀다"는 행 연산을 행렬 곱으로 하려면, 왼쪽에 어떤 행렬을 곱해야 할까?`,
          hints: [String.raw`항등 행렬 $I$에 **같은 행 연산**을 해 보라. 그 결과를 아무 행렬의 왼쪽에 곱하면 그 행렬에 같은 행 연산을 한 것이 된다([행의 관점](n:prop.row-picture)으로 확인하라).`],
          choices: [String.raw`$\begin{bmatrix} 1 & 0 \\ -2 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & -2 \\ 0 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -2 & 1 \\ 0 & 1 \end{bmatrix}$`],
          answer: 0,
          why: [
            String.raw`$I$의 둘째 행 $(0, 1)$에서 첫째 행 $(1, 0)$의 2배를 빼면 $(-2, 1)$이다. 곱한 행렬의 둘째 행은 "원래 둘째 행 − 2 × 첫째 행"이 된다.`,
            String.raw`이것을 **오른쪽에** 곱하면 열 연산이 된다(둘째 열에서 첫째 열의 2배를 뺀다). 행 연산은 왼쪽에 곱한다. 거의 맞는 답이다.`,
            String.raw`부호가 반대다. 이것은 2배를 **더한다**.`,
            String.raw`이 행렬의 첫째 행은 $(-2, 1)$로, 첫째 행을 바꿔 버린다.`,
          ],
        },
        {
          id: 'p-same',
          kind: 'choice',
          q: '행 연산을 해도 연립방정식의 해가 바뀌지 않는 이유는?',
          hints: [String.raw`행 연산은 기본 행렬 $E$를 양쪽 왼쪽에 곱하는 일이다: $A\mathbf{x} = \mathbf{b} \Rightarrow EA\mathbf{x} = E\mathbf{b}$. 거꾸로 $EA\mathbf{x} = E\mathbf{b}$에서 $A\mathbf{x} = \mathbf{b}$로 돌아올 수 있으려면 $E$가 어때야 하는가?`],
          choices: ['기본 행렬은 되돌릴 수 있어서, 새 식과 원래 식이 서로 오갈 수 있기 때문이다', '양쪽에 같은 일을 하면 언제나 해가 같기 때문이다', '행렬식이 바뀌지 않기 때문이다', '해가 바뀌지만 마지막에 되돌리기 때문이다'],
          answer: 0,
          why: [
            String.raw`$E$가 가역이므로 $EA\mathbf{x} = E\mathbf{b}$의 양쪽에 $E^{-1}$을 곱하면 원래 식이 나온다. 두 식은 정확히 같은 해를 가진다.`,
            String.raw`그렇지 않다. 양쪽에 영행렬을 곱하면 $\mathbf{0} = \mathbf{0}$이 되어 모든 $\mathbf{x}$가 "해"가 된다. 되돌릴 수 있는 일이어야 한다.`,
            String.raw`맞바꿈은 행렬식의 부호를 바꾸지만 해는 바꾸지 않는다. 행렬식은 이유가 아니다.`,
            String.raw`행 연산의 매 단계에서 해는 그대로다.`,
          ],
        },
      ],
      body: String.raw`[연립일차방정식](t:t.linear-system)을 손으로 풀 때 "한 식의 몇 배를 다른 식에서 뺀다"를 되풀이한다. 이 익숙한 계산은 기하적으로 무엇을 하는 것일까?

### 행 연산 셋
- **더하기**: 한 행에 다른 행의 몇 배를 더한다.
- **맞바꿈**: 두 행의 자리를 바꾼다.
- **늘림**: 한 행에 0이 아닌 수를 곱한다.

::predict p-E

**명제.** 행 연산 하나는 [기본 행렬](def:t.elementary-matrix) $E$ 하나를 왼쪽에 곱하는 일이다. $E$는 항등 행렬에 같은 행 연산을 한 것이다. 행 연산은 해를 바꾸지 않는다. 그러므로 [가우스 소거](def:t.elimination)는 기본 행렬들을 차례로 곱해 $A\mathbf{x} = \mathbf{b}$를 풀기 쉬운 꼴(계단 모양)로 바꾸는 일이다.

### 더하기 연산은 전단이다
더하기의 기본 행렬, 예를 들어 $\begin{bmatrix} 1 & 0 \\ -2 & 1 \end{bmatrix}$은 [전단](t:t.shear)이다. 그래서 넓이를 바꾸지 않는다($\det = 1$). 맞바꿈은 반사라 $\det = -1$, $c$배 늘림은 $\det = c$다.

::scene b5-elim {}

"다음 단계 ▶"를 누르며 보라. 왼쪽(열의 관점)에서는 지금까지 곱한 기본 행렬이 출력 평면 전체를 민다. 오른쪽(행의 관점)에서는 식들의 직선이 돌지만, **두 직선이 만나는 점(해)은 움직이지 않는다.**

::predict p-same

### 두 개의 예
- $\begin{cases} 2x_1 + x_2 = 5 \\ x_1 - x_2 = 1 \end{cases}$: 둘째 식에서 첫째 식의 $\tfrac{1}{2}$배를 빼면 $-\tfrac{3}{2}x_2 = -\tfrac{3}{2}$, 곧 $x_2 = 1$이다. 첫째 식에 넣으면 $x_1 = 2$. 기본 행렬은 $\begin{bmatrix} 1 & 0 \\ -1/2 & 1 \end{bmatrix}$이다.
- 맞바꿈이 필요한 경우 $\begin{cases} 0x_1 + x_2 = 3 \\ x_1 + x_2 = 4 \end{cases}$: 첫째 식에 $x_1$이 없어 그대로는 첫째 식으로 $x_1$을 지울 수 없다. 두 식을 맞바꾸면 $\begin{cases} x_1 + x_2 = 4 \\ x_2 = 3 \end{cases}$이 되어 $x_1 = 1$.

> [!코드] 소거로 하는 일들
> 이 저장소의 \`eliminationSteps\`는 소거의 단계마다 기본 행렬을 기록한다. 같은 소거에서 6권의 [랭크](fwd:t.rank)(남은 계단의 수)와 [영공간](fwd:t.null-space)의 기저도 나온다(\`rank\`, \`nullBasis\`). 소거는 연립방정식을 푸는 계산이면서, 행렬의 구조를 드러내는 계산이기도 하다.`,
      proof: String.raw`**기본 행렬.** [행의 관점](why:prop.row-picture)으로, $EA$의 $i$번째 행은 "$E$의 $i$번째 행"으로 $A$의 행들을 섞은 것이다. $E$가 $I$에 행 연산을 한 것이면, $E$의 각 행은 $A$의 행들을 바로 그 행 연산대로 섞는다. 예를 들어 $E$의 둘째 행이 $(-2, 1)$이면, $EA$의 둘째 행은 $-2\times$($A$의 첫째 행) $+$ ($A$의 둘째 행)이다.

**해를 바꾸지 않는다.** 행 연산마다 되돌리는 행 연산이 있다(더한 것은 빼고, 맞바꾼 것은 다시 맞바꾸고, $c$배 한 것은 $1/c$배 한다). 그러므로 기본 행렬은 [가역](why:def.inverse)이다. $A\mathbf{x} = \mathbf{b}$이면 $EA\mathbf{x} = E\mathbf{b}$이고, 거꾸로 $EA\mathbf{x} = E\mathbf{b}$이면 양쪽에 $E^{-1}$을 곱해 $A\mathbf{x} = \mathbf{b}$다. 두 식은 같은 해를 가진다.

**행렬식.** 더하기의 기본 행렬은 대각선이 1이고 한쪽만 0이 아닌 삼각 행렬이라 [행렬식이 1](why:prop.det-formula)이다. [곱의 행렬식](why:prop.det-product)에 따라 더하기 연산은 $\det A$를 바꾸지 않는다.`,
      code: ['elementary', 'eliminationSteps', 'solve'],
    },
  ],
};
export default book;
