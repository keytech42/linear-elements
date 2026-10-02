import type { Book } from './schema';

// 4권 — 행렬식. "넓이는 몇 배가 되었고, 뒤집혔는가"를 수 하나로.
const book: Book = {
  id: 'b4',
  num: 4,
  title: '행렬식',
  subtitle: '넓이는 몇 배가 되었고, 뒤집혔는가',
  nodes: [
    {
      id: 'def.det',
      kind: 'def',
      title: '행렬식: 부호 있는 넓이 배율',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.determinant', ko: '행렬식', en: 'determinant', gloss: '변환이 넓이(3차원에서는 부피)를 몇 배로 만드는지, 그리고 방향을 뒤집는지를 부호까지 담은 수.' },
          { id: 't.orientation', ko: '방향(향)', en: 'orientation', surfaces: ['향'], gloss: 'e₁에서 e₂로 짧게 도는 쪽이 시계 반대 방향인지 시계 방향인지. 거울에 비추면 바뀐다.' },
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

"도는 쪽"을 [방향](def:t.orientation)(향)이라 부른다. 왼손과 오른손의 차이와 같다. 거울에 비추면 바뀌고, 돌리기만 해서는 바뀌지 않는다.

::scene b4-signed-area {}

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
    },
    {
      id: 'prop.det-uniform',
      kind: 'prop',
      title: '모든 도형의 넓이가 같은 배율로 변한다',
      status: 'written',
      requires: ['def.det', 'prop.linear-grid'],
      predicts: [
        {
          id: 'p-circle',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$이 반지름 1인 원(넓이 $\pi$)을 보낸 도형의 넓이는?`,
          hints: [
            String.raw`단위 정사각형의 넓이는 몇 배가 되는가? 그것이 행렬식이다.`,
            String.raw`원을 아주 작은 정사각형들로 빈틈없이 채웠다고 상상하라. 작은 정사각형 하나하나는 모두 똑같은 배율로 바뀐다.`,
          ],
          choices: [String.raw`$6\pi$`, String.raw`$5\pi$`, String.raw`$\pi$ (원은 회전해도 원이므로)`, String.raw`$36\pi$`],
          answer: 0,
          why: [
            String.raw`$\det A = 6$이므로 모든 도형의 넓이가 6배가 된다. 원은 가로 반지름 2, 세로 반지름 3인 [타원](fwd:t.ellipse) 모양이 된다.`,
            String.raw`배율을 더했다($2 + 3$). 넓이 배율은 두 방향의 배율을 곱한 것이다.`,
            String.raw`이 변환은 돌리기가 아니라 늘이기다.`,
            String.raw`배율을 제곱했다. 넓이 배율은 이미 "두 방향의 곱"이므로 6이다.`,
          ],
        },
      ],
      openWhys: [{ q: '휘어진 경계를 가진 도형의 넓이를 작은 정사각형으로 "끝없이 가깝게" 맞춘다는 것을 엄밀하게 하려면?', answeredBy: null }],
      body: String.raw`[행렬식](t:t.determinant)은 단위 정사각형 하나의 넓이 배율로 정의했다. 원, 삼각형, 아무렇게나 그린 얼룩의 넓이도 같은 배율로 바뀔까?

::predict p-circle

**명제.** 선형 변환 $A$는 평면의 **모든** 도형의 넓이를 똑같이 $|\det A|$배 한다.

::scene b4-area-ratio {}

도형 단추로 원, 얼룩, F를 바꿔 가며 두 넓이의 비가 언제나 $|\det A|$인지 확인하라. "작은 정사각형" 상자를 켜면 증명의 핵심이 보인다. 도형 안의 작은 정사각형들이 모두 **똑같은 모양**의 평행사변형으로 옮겨진다.

### 두 개의 예
- 위 관문: $\det = 6$이므로 원(넓이 $\pi$)이 넓이 $6\pi$인 납작한 원 모양이 된다.
- 전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$: $\det = 1$이므로 어떤 도형을 밀어도 넓이가 그대로다. 카드 더미를 비스듬히 밀어도 카드의 양은 그대로인 것과 같다.`,
      proof: String.raw`**작은 정사각형 하나.** 꼭짓점이 $\mathbf{p}$이고 두 변이 $h\mathbf{e}_1$, $h\mathbf{e}_2$인 작은 정사각형을 생각하자($h$는 한 변의 길이). [선형 변환은 선형 결합을 그대로 통과시키므로](why:def.linear-map), 이 정사각형의 점 $\mathbf{p} + s\,h\mathbf{e}_1 + t\,h\mathbf{e}_2$($0 \le s, t \le 1$)는 $A\mathbf{p} + s\,h\mathbf{a}_1 + t\,h\mathbf{a}_2$로 간다. 곧 작은 정사각형은 꼭짓점이 $A\mathbf{p}$이고 두 변이 $h\mathbf{a}_1$, $h\mathbf{a}_2$인 평행사변형이 된다. 이것은 단위 정사각형의 상(두 변 $\mathbf{a}_1$, $\mathbf{a}_2$)을 가로세로 모두 $h$배로 줄여 $A\mathbf{p}$로 옮긴 것이다. [넓이의 규칙](why:ax.area)에 따라 옮겨도 넓이는 그대로이고, 가로세로를 모두 $h$배 하면 넓이는 $h^2$배다. 그러므로 그 넓이는 $|\det A|\,h^2$, 곧 작은 정사각형 넓이 $h^2$의 $|\det A|$배다.

**아무 도형.** 도형을 한 변 $h$인 작은 정사각형들로 덮는다. 안쪽에 완전히 들어가는 정사각형들과, 도형에 조금이라도 걸치는 정사각형들을 생각하면, 도형의 넓이는 그 두 합 사이에 있다. 변환 뒤에도 같은 관계가 그대로 옮겨지고(포함 관계는 변환 뒤에도 유지된다), 정사각형마다 넓이가 정확히 $|\det A|$배가 된다. $h$를 작게 할수록 두 합의 차이는 도형의 경계 근처의 얇은 띠만큼으로 줄어든다. 그러므로 도형의 넓이도 $|\det A|$배다. (이 "끝없이 가깝게 맞추기"를 완전히 엄밀하게 하는 일은 이 교재의 범위 밖이다. 아래 열린 질문에 남겨 둔다.)`,
    },
    {
      id: 'prop.det-formula',
      kind: 'prop',
      title: '2×2 행렬식의 공식',
      status: 'written',
      requires: ['prop.det-uniform'],
      predicts: [
        {
          id: 'p-cut',
          kind: 'choice',
          q: String.raw`두 열이 $\mathbf{a}_1 = (3, 1)$, $\mathbf{a}_2 = (1, 2)$인 행렬이 단위 정사각형을 보낸 평행사변형의 넓이는?`,
          hints: [
            String.raw`평행사변형을 감싸는 가로 $3 + 1$, 세로 $1 + 2$인 상자를 그려라(아래 장면). 상자에서 평행사변형이 아닌 조각들을 떼어 내면 된다.`,
            String.raw`떼어 낼 조각: 밑변 3·높이 1인 직각삼각형 둘, 밑변 1·높이 2인 직각삼각형 둘, 1×1 직사각형 둘.`,
          ],
          choices: ['5', '7', '12', '6'],
          answer: 0,
          why: [
            String.raw`상자 $4 \times 3 = 12$에서 $2\cdot\tfrac{3}{2} + 2\cdot\tfrac{2}{2} + 2\cdot1 = 7$을 빼면 5다. 공식으로는 $3\cdot2 - 1\cdot1 = 5$.`,
            String.raw`그것은 떼어 낸 조각들의 넓이다. 남은 것이 평행사변형이다.`,
            String.raw`상자 전체다. 조각들을 아직 떼어 내지 않았다.`,
            String.raw`대각 성분만 곱했다($3 \times 2$). 엇갈린 성분의 곱 $1 \times 1$을 빼야 한다.`,
          ],
        },
      ],
      body: String.raw`[행렬식](t:t.determinant)을 그림 없이 행렬의 네 성분만으로 계산할 수 있을까?

::predict p-cut

**명제.** 2×2 행렬 $A$의 행렬식은

$$\det A = \det\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} = a_{11}a_{22} - a_{12}a_{21}$$

이다. "대각선끼리의 곱에서 엇갈린 성분끼리의 곱을 뺀다."

### 잘라 내기로 보기 (성분이 모두 0 이상일 때)
::scene b4-cut {}

평행사변형을 감싸는 상자의 넓이는 $(a_{11} + a_{12})(a_{21} + a_{22})$다. 여기서 직각삼각형 넷(넓이 $\tfrac{a_{11}a_{21}}{2}$ 둘, $\tfrac{a_{12}a_{22}}{2}$ 둘)과 직사각형 둘(넓이 $a_{12}a_{21}$ 둘)을 떼어 내면

$$(a_{11} + a_{12})(a_{21} + a_{22}) - a_{11}a_{21} - a_{12}a_{22} - 2a_{12}a_{21} = a_{11}a_{22} - a_{12}a_{21}$$

이 남는다. 이 그림은 성분이 모두 0 이상이고 $\mathbf{a}_2$가 $\mathbf{a}_1$의 시계 반대 방향 쪽에 있는 경우만 보여 준다. 모든 경우에 통하는 증명은 아래에 있다.

### 밀기로 보기: 모든 경우
::scene b4-shear {}

$\mathbf{a}_2$를 $\mathbf{a}_1$ 방향으로 밀어도(전단) 평행사변형의 밑변($\mathbf{a}_1$)과 높이가 그대로이므로 넓이가 그대로다. 아래 증명은 이 밀기를 이용해, 한 열을 축에 맞춘 쉬운 모양으로 바꾼 뒤 넓이를 읽는다.

### 두 개의 예
- $\begin{bmatrix} 3 & 1 \\ 1 & 2 \end{bmatrix}$: $6 - 1 = 5$.
- $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$: $4 - 6 = -2$. 넓이는 2배이고 향이 뒤집힌다. 첫째 열 $(1, 3)$에서 둘째 열 $(2, 4)$로는 시계 방향으로 짧게 돈다.`,
      proof: String.raw`평행사변형의 넓이에 부호를 붙인 값을 구한다.

**경우 1: $a_{11} \ne 0$.** $\mathbf{a}_2$에서 $\mathbf{a}_1$의 $\frac{a_{12}}{a_{11}}$배를 빼서 $\mathbf{a}_2' = \mathbf{a}_2 - \frac{a_{12}}{a_{11}}\mathbf{a}_1$을 만든다. 첫째 성분은 $a_{12} - a_{12} = 0$, 둘째 성분은 $a_{22} - \frac{a_{12}a_{21}}{a_{11}}$이다. $\mathbf{a}_2$를 $\mathbf{a}_1$ 방향으로 민 것이므로 평행사변형의 밑변($\mathbf{a}_1$)과 높이는 그대로이고, 넓이와 향도 그대로다([밑변 × 높이](why:ax.area)). 이제 $\mathbf{a}_2' = (0,\ d)$, $d = a_{22} - \frac{a_{12}a_{21}}{a_{11}}$는 세로축 위에 있다. $\mathbf{a}_1$과 $\mathbf{a}_2'$가 만드는 평행사변형을 세로축 방향 변을 밑변으로 보면, 밑변의 길이는 $|d|$이고 높이는 $\mathbf{a}_1$의 가로 성분의 크기 $|a_{11}|$이다. 그러므로 넓이는 $|a_{11}d| = |a_{11}a_{22} - a_{12}a_{21}|$이다. 부호: $a_{11}d > 0$이면, 곧 $a_{11}$과 $d$의 부호가 같으면 $\mathbf{a}_1$(오른쪽 또는 왼쪽)에서 $\mathbf{a}_2'$(위 또는 아래)로 시계 반대 방향으로 돈다. 예를 들어 둘 다 양수이면 오른쪽에서 위쪽으로 돈다. 그러므로 부호까지 $a_{11}d = a_{11}a_{22} - a_{12}a_{21}$이다.

**경우 2: $a_{11} = 0$.** 공식은 $-a_{12}a_{21}$이다. $\mathbf{a}_1 = (0, a_{21})$은 세로축 위에 있다. 이번에는 $\mathbf{a}_2$를 $\mathbf{a}_1$ 방향으로 밀어 둘째 성분을 0으로 만들면($a_{21} \ne 0$일 때) $\mathbf{a}_2' = (a_{12}, 0)$이 되고, 넓이는 $|a_{12}a_{21}|$이다. 부호는 $\mathbf{a}_1$이 위쪽($a_{21} > 0$)이고 $\mathbf{a}_2'$가 오른쪽($a_{12} > 0$)이면 위에서 오른쪽으로, 곧 시계 방향이므로 음수다. 그래서 $-a_{12}a_{21}$이다. $a_{21} = 0$이면 $\mathbf{a}_1 = \mathbf{0}$이라 넓이가 0이고, 공식도 0이다.`,
      code: ['det2'],
    },
    {
      id: 'prop.det-sign',
      kind: 'prop',
      title: '음수 행렬식 = 뒤집힘',
      status: 'written',
      requires: ['prop.det-formula'],
      predicts: [
        {
          id: 'p-swap',
          kind: 'choice',
          q: String.raw`행렬 $A$의 두 열을 맞바꾼 행렬의 행렬식은 $\det A$와 어떤 관계일까?`,
          hints: [String.raw`두 열이 만드는 평행사변형은 같다(넓이가 같다). 그런데 "$\mathbf{a}_1$에서 $\mathbf{a}_2$로 도는 쪽"과 "$\mathbf{a}_2$에서 $\mathbf{a}_1$로 도는 쪽"은?`],
          choices: [String.raw`$-\det A$`, String.raw`$\det A$`, '0', String.raw`$1/\det A$`],
          answer: 0,
          why: [
            String.raw`넓이는 같고 도는 방향만 반대가 된다. 공식으로도 $a_{12}a_{21} - a_{11}a_{22} = -(a_{11}a_{22} - a_{12}a_{21})$.`,
            String.raw`넓이만 보면 같다. 그러나 순서를 바꾸면 도는 방향이 뒤집힌다. 거의 맞는 답이다.`,
            String.raw`평행사변형이 납작해지지 않았다.`,
            String.raw`역수가 될 이유가 없다. 넓이가 같다.`,
          ],
        },
      ],
      body: String.raw`넓이는 음수일 수 없다. 그런데 [행렬식의 공식](n:prop.det-formula)은 음수를 내기도 한다. 그 음수는 정확히 무엇을 뜻할까?

**명제.** $\det A < 0$인 것은 $A$가 [향](t:t.orientation)을 뒤집는 것과 같다. 기하적으로 2×2 행렬식은

$$\det A = (R_{90°}\,\mathbf{a}_1)\cdot\mathbf{a}_2$$

곧 "첫째 열을 시계 반대 방향으로 90° 돌린 벡터"와 "둘째 열"의 [내적](t:t.dot)이다.

::scene b4-signed-area {"perp": true}

"a₁를 90° 돌림"을 켜 보라. 하늘색 화살표가 $\mathbf{a}_1$을 90° 돌린 것이다. $\mathbf{a}_2$가 그 화살표와 같은 쪽(내적 양수)에 있으면, $\mathbf{a}_1$에서 $\mathbf{a}_2$로 시계 반대 방향으로 돈다. 반대쪽(내적 음수)이면 시계 방향으로 돈다. [내적의 부호는 각이 90°보다 작은지를 말해 주었다](why:prop.dot-geometric).

::predict p-swap

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$: $\mathbf{a}_1 = (1, 3)$을 90° 돌리면 $(-3, 1)$, 이것과 $\mathbf{a}_2 = (2, 4)$의 내적은 $-6 + 4 = -2$. 공식의 답과 같다.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: $\mathbf{a}_1 = (0, 1)$을 돌리면 $(-1, 0)$, $\mathbf{a}_2 = (1, 0)$과의 내적은 $-1$. 반사는 향을 뒤집는다.

> [!비유] 왼손과 오른손
> 행렬식의 부호는 왼손 장갑과 오른손 장갑의 차이와 같다. 평면 위에서 손 모양을 아무리 돌리고 밀어도 왼손은 오른손이 되지 않는다(부호가 그대로). 거울에 비추면 바뀐다(부호가 뒤집힌다). 이 비유가 깨지는 지점은 행렬식이 0인 경우다. 손이 납작한 선이 되어 버리면 왼손도 오른손도 아니게 되는데, 장갑에는 그런 상태가 없다.`,
      proof: String.raw`[90° 회전](why:prop.rotation-matrix)은 $(p, q)$를 $(-q, p)$로 보내므로 $R_{90°}\mathbf{a}_1 = (-a_{21}, a_{11})$이다. 이것과 $\mathbf{a}_2 = (a_{12}, a_{22})$의 내적은 $-a_{21}a_{12} + a_{11}a_{22}$이고, 이것은 [2×2 공식](why:prop.det-formula) 그대로다. 내적이 양수인 것은 $\mathbf{a}_2$와 $R_{90°}\mathbf{a}_1$ 사이의 각이 90°보다 작다는 것, 곧 $\mathbf{a}_2$가 $\mathbf{a}_1$에서 시계 반대 방향으로 0°에서 180° 사이에 있다는 것이다. 그것이 향이 유지된다는 뜻이다.`,
    },
    {
      id: 'prop.det-product',
      kind: 'prop',
      title: 'det(AB) = det A · det B',
      status: 'written',
      requires: ['prop.det-uniform', 'def.composition'],
      predicts: [
        {
          id: 'p-order',
          kind: 'choice',
          q: String.raw`$\det A = 2$, $\det B = -3$이다. $\det(AB)$와 $\det(BA)$는?`,
          hints: [String.raw`$AB$는 "$B$를 먼저, 그다음 $A$"다. 넓이는 $B$에서 몇 배, 이어서 $A$에서 몇 배가 되는가? $BA$는 순서가 반대지만, 배율끼리의 곱은 순서를 바꿔도 같은가?`],
          choices: ['둘 다 −6', '−6과 6', '−1과 1', 'AB ≠ BA이므로 알 수 없다'],
          answer: 0,
          why: [
            String.raw`배율이 차례로 곱해진다: $2\times(-3) = -3\times2 = -6$. 행렬은 순서를 바꾸면 달라지지만, 행렬식(수)의 곱은 [교환법칙](n:ax.arith)을 따른다.`,
            String.raw`순서를 바꾸면 행렬은 달라질 수 있지만 행렬식은 같다. 두 번 뒤집기 중 한 번만 뒤집힌다는 사실도 순서와 상관없다.`,
            String.raw`배율을 더했다. 이어서 하는 변환의 배율은 곱해진다.`,
            String.raw`$AB$와 $BA$가 다르더라도 넓이 배율은 같다.`,
          ],
        },
        {
          id: 'p-double',
          kind: 'choice',
          q: String.raw`2×2 행렬 $A$에 대해 $\det(2A)$는?`,
          hints: [
            String.raw`$2A = (2I)A$로 볼 수 있다. $2I$는 넓이를 몇 배 하는가?`,
            String.raw`$2I = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$은 가로로 2배, 세로로 2배다.`,
          ],
          choices: [String.raw`$4\det A$`, String.raw`$2\det A$`, String.raw`$\det A$`, String.raw`$8\det A$`],
          answer: 0,
          why: [
            String.raw`$\det(2I) = 4$이므로 $\det(2A) = 4\det A$. 두 열이 모두 2배가 되므로 평행사변형의 가로세로가 모두 2배다.`,
            String.raw`흔한 착각이다. 행렬에 2를 곱하면 **모든** 열이 2배가 되고, 2×2에서는 열이 두 개라 넓이가 $2 \times 2$배가 된다.`,
            String.raw`모든 성분이 2배가 되었으므로 넓이가 바뀐다.`,
            String.raw`$8 = 2^3$은 3×3 행렬에서의 답이다(부피). 2×2에서는 $2^2$이다.`,
          ],
        },
      ],
      body: String.raw`두 변환을 차례로 하면 넓이 배율은 어떻게 될까?

::predict p-order

**명제.** 모든 2×2 행렬 $A$, $B$에 대해 $\det(AB) = \det A\cdot\det B$이다.

계산 없이 증명된다. $AB$는 "[$B$ 다음 $A$](why:def.composition)"다. $B$는 모든 넓이를 $|\det B|$배 하고, 이어서 $A$가 모든 넓이를 $|\det A|$배 한다([모든 도형에 같은 배율](why:prop.det-uniform)). 그러므로 전체는 $|\det A|\,|\det B|$배다. 향은 두 번 중 몇 번 뒤집혔는지로 정해진다. 한 번 뒤집히면 뒤집힌 채이고, 두 번 뒤집히면 제자리다. 이것은 [음수 × 음수 = 양수](why:prop.neg-times-neg)와 정확히 같은 규칙이다.

::scene b4-product {}

진행 막대로 단위 정사각형이 $B$에서 넓이 $\det B$인 평행사변형이 되고, 이어서 $A$에서 다시 $\det A$배가 되는 것을 보라.

::predict p-double

### 두 개의 예
- 그림의 $A = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$($\det 2$), $B = \begin{bmatrix} 1.5 & 0 \\ 0.5 & 1 \end{bmatrix}$($\det 1.5$): $AB = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이고 $\det(AB) = 4 - 1 = 3 = 2 \times 1.5$.
- 반사를 두 번: 가로축 반사 $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$을 두 번 하면 $I$다. $(-1)(-1) = 1 = \det I$.`,
      proof: String.raw`[행렬식](why:def.det)은 단위 정사각형의 상의 부호 있는 넓이다. $AB$는 단위 정사각형을 먼저 $B$로 보낸다. 그 상의 넓이는 $|\det B|$다. 이어서 $A$가 이 평행사변형을 보내는데, [A는 모든 도형의 넓이를 |det A|배 하므로](why:prop.det-uniform) 최종 넓이는 $|\det A|\,|\det B|$다. 향에 대해: $\det B < 0$이면 $B$가 향을 뒤집고, $\det A < 0$이면 $A$가 다시 뒤집는다. 뒤집힘이 짝수 번이면 향이 유지되고 홀수 번이면 뒤집힌다. 부호의 곱이 정확히 이 규칙을 따르므로, 부호까지 $\det(AB) = \det A\cdot\det B$이다.`,
    },
    {
      id: 'prop.det-zero',
      kind: 'prop',
      title: 'det = 0 ⇔ 평면이 납작해진다 ⇔ 열이 종속',
      status: 'written',
      requires: ['prop.det-formula', 'def.independence'],
      predicts: [
        {
          id: 'p-t',
          kind: 'choice',
          q: String.raw`두 열이 $(2, 1)$과 $(t, 3)$인 행렬의 행렬식이 0이 되는 $t$는?`,
          hints: [String.raw`$\det = 2\cdot3 - t\cdot1$. 기하로는 $(t, 3)$이 $(2, 1)$과 같은 직선 위에 오는 $t$다. $(2, 1)$을 몇 배 하면 둘째 성분이 3이 되는가?`],
          choices: ['6', '1.5', '−6', String.raw`$\tfrac{2}{3}$`],
          answer: 0,
          why: [
            String.raw`$6 - t = 0$. 그때 $(6, 3) = 3\cdot(2, 1)$로 두 열이 같은 직선 위에 있다.`,
            String.raw`$2t - 3 = 0$으로 풀었다. 공식의 엇갈린 곱을 잘못 짝지었다.`,
            String.raw`부호를 반대로 풀었다.`,
            String.raw`$3t = 2$로 풀었다. 성분을 거꾸로 맞췄다.`,
          ],
        },
        {
          id: 'p-lost',
          kind: 'choice',
          q: String.raw`$\det A = 0$인 2×2 행렬 $A$에서, 서로 다른 두 입력이 같은 출력으로 갈 수 있을까?`,
          hints: [
            String.raw`$\det A = 0$이면 두 열이 종속이다. 그러면 $c_1\mathbf{a}_1 + c_2\mathbf{a}_2 = \mathbf{0}$인, 0이 아닌 계수가 있다. 그 계수를 입력으로 넣으면?`,
            String.raw`$A\mathbf{z} = \mathbf{0}$인 영벡터가 아닌 $\mathbf{z}$가 있다면, $A(\mathbf{x} + \mathbf{z})$와 $A\mathbf{x}$를 비교해 보라.`,
          ],
          choices: ['있다. 그런 쌍이 끝없이 많다', '없다. 선형 변환은 서로 다른 입력을 서로 다른 출력으로 보낸다', '출력이 0일 때만 있다', '열이 같은 행렬일 때만 있다'],
          answer: 0,
          why: [
            String.raw`$A\mathbf{z} = \mathbf{0}$이면 $A(\mathbf{x} + \mathbf{z}) = A\mathbf{x} + \mathbf{0} = A\mathbf{x}$. 모든 $\mathbf{x}$에 대해 $\mathbf{x}$와 $\mathbf{x} + \mathbf{z}$가 같은 곳으로 간다. 그래서 5권에서 이런 변환은 "되돌릴 수 없다"가 된다.`,
            String.raw`납작해지는 선형 변환은 그렇지 않다. 회전처럼 행렬식이 0이 아닌 변환만 서로 다른 입력을 서로 다른 출력으로 보낸다.`,
            String.raw`출력이 0인 입력들만이 아니라, **모든** 출력에 대해 그런 쌍이 있다.`,
            String.raw`두 열이 같은 직선 위에 있기만 하면 된다. 같을 필요는 없다.`,
          ],
        },
      ],
      body: String.raw`[행렬식](t:t.determinant)이 0이라는 것은 정확히 무슨 일이 일어났다는 뜻일까?

**명제.** 2×2 행렬 $A$에 대해 다음 셋은 같은 말이다.
1. $\det A = 0$.
2. 두 열 $\mathbf{a}_1$, $\mathbf{a}_2$가 [선형 종속](t:t.lin-dep)이다(같은 직선 위에 있거나 하나가 영벡터다).
3. $A$는 평면 전체를 직선 하나(또는 점 하나)로 납작하게 누른다.

::scene b4-collapse {}

"▶ 납작하게"를 누르면 둘째 열이 첫째 열의 직선 위로 옮겨 가면서, 평행사변형의 넓이(행렬식)가 0으로 줄고 격자 전체가 직선 하나로 눌린다.

::predict p-t

::predict p-lost

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $4 - 4 = 0$. 둘째 열이 첫째 열의 2배다. 모든 출력이 $(1, 2)$ 방향의 직선 위에 있다.
- 사영 $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$: $\det = 0$. 평면이 가로축으로 눌린다. 세로 방향의 정보가 모두 사라진다.`,
      proof: String.raw`**1 ⇔ 2.** [행렬식의 크기는 두 열이 만드는 평행사변형의 넓이](why:def.det)다. 넓이가 0인 것은 평행사변형이 납작한 것, 곧 두 열이 한 직선 위에 있거나 하나가 영벡터인 것이다. 그것이 [선형 종속](why:def.independence)이다(한 열이 다른 열의 몇 배로 적히거나, 영벡터다).

**2 ⇒ 3.** 두 열이 한 직선 위에 있으면, 모든 출력 $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2$는 그 직선 위의 벡터들의 [선형 결합](t:t.linear-combination)이므로 그 직선 위에 있다. 두 열이 모두 영벡터이면 모든 출력이 원점이다.

**3 ⇒ 1.** 평면이 직선이나 점으로 눌리면 단위 정사각형도 넓이가 0인 도형으로 간다. 그러므로 행렬식이 0이다.`,
    },
    {
      id: 'exp.det-3d',
      kind: 'exp',
      title: '3차원: 부피 배율',
      status: 'written',
      requires: ['prop.det-zero', 'exp.space3'],
      predicts: [
        {
          id: 'p-vol',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 0.5 \end{bmatrix}$은 단위 정육면체를 부피 몇인 상자로 보낼까?`,
          hints: [String.raw`세 축이 각각 몇 배가 되는가? 직육면체의 부피는 가로 × 세로 × 높이다.`],
          choices: ['3', '5.5', '6', '1'],
          answer: 0,
          why: [
            String.raw`$2 \times 3 \times 0.5 = 3$. 높이가 절반이 되어 부피가 줄었다.`,
            String.raw`배율을 더했다. 부피 배율은 곱이다.`,
            String.raw`높이 0.5를 빠뜨렸다.`,
            String.raw`높이가 줄었지만 다른 두 방향이 늘었다.`,
          ],
        },
        {
          id: 'p-flat',
          kind: 'choice',
          q: '3×3 행렬의 세 열이 원점을 지나는 한 평면 위에 있다(셋 다 영벡터는 아니다). 이 행렬의 행렬식과, 공간이 눌리는 모양은?',
          hints: [String.raw`세 열이 만드는 평행육면체는 평면 안에 납작하게 누운 도형이다. 그 부피는? 그리고 모든 출력 $x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + x_3\mathbf{a}_3$은 어디에 놓이는가?`],
          choices: ['행렬식 0, 공간 전체가 그 평면(또는 그 안의 직선)으로 눌린다', '행렬식 0, 공간이 한 점으로 눌린다', '행렬식은 0이 아니다. 열 셋이 모두 영벡터가 아니므로', '행렬식 1, 공간은 그대로다'],
          answer: 0,
          why: [
            String.raw`평행육면체가 납작하므로 부피(행렬식)가 0이다. 모든 출력은 세 열의 선형 결합이라 그 평면 안에 있다. 세 열이 한 직선 위에까지 모이면 공간은 직선으로 눌린다.`,
            String.raw`점으로 눌리는 것은 세 열이 모두 영벡터일 때뿐이다.`,
            String.raw`각 열이 영벡터가 아니어도, 셋이 [새 방향을 보태지 못하면](n:def.independence) 부피가 0이다.`,
            String.raw`납작해졌으므로 부피가 사라졌다.`,
          ],
        },
      ],
      openWhys: [{ q: 'n×n 행렬의 행렬식은 어떻게 정의하고, 2×2·3×3의 성질(곱의 행렬식, 0이면 종속)이 그대로 성립하는가?', answeredBy: null }],
      body: String.raw`3차원에서 행렬은 단위 정육면체를 세 열 $\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3$이 만드는 비스듬한 상자(평행육면체)로 보낸다. [행렬식](t:t.determinant)은 이제 **부피** 배율이다.

::scene b4-det3d {}

그림을 끌어 돌려 보고, 단추로 부피가 0이 되는 세 가지 방식을 불러와 보라. 한 열이 영벡터인 경우, 두 열이 한 직선 위에 있는 경우, 세 열이 한 평면 위에 있는 경우다.

::predict p-vol

### 3×3 행렬식의 공식
3×3 행렬식은 첫째 행을 따라 펼친 식으로 계산할 수 있다.

$$\det A = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})$$

괄호 안은 각각 2×2 행렬식이다. 이 공식이 정말 부피에 부호를 붙인 값이라는 증명은 이 교재에서 하지 않는다. 그 대신 테스트가 무작위 3×3 행렬에서 $\det(AB) = \det A\cdot\det B$를 확인한다(\`det3\`). 2권의 사영처럼, 공식보다 그림에서 읽는 눈이 먼저다.

::predict p-flat

### 2차원에서 배운 것이 그대로 통한다
- 부피 배율은 모든 입체에 같다.
- 두 변환을 이으면 부피 배율이 곱해진다.
- 행렬식이 0인 것은 열들이 종속인 것, 곧 공간이 평면이나 직선이나 점으로 납작해지는 것이다.
- 음수는 "오른손이 왼손이 된다"는 뜻이다. 3차원에서는 엄지(𝐞₁)·검지(𝐞₂)·중지(𝐞₃)가 이루는 손 모양으로 향을 정한다.

이 성질들을 $n \times n$ 행렬로 넓히는 일반 이론은 이 교재의 범위 밖이다. 아래 열린 질문에 남겨 둔다.`,
      code: ['det3'],
    },
  ],
};
export default book;
