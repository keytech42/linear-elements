import type { Book } from './schema';

// 8장 — 고윳값과 고유벡터. 9장(SVD)의 발판: 9장은 "AᵀA는 대칭 → 스펙트럼 정리"로 증명을 시작한다.
const book: Book = {
  id: 'b8',
  num: 8,
  title: '고윳값과 고유벡터',
  subtitle: '변환이 방향을 바꾸지 않는 축',
  nodes: [
    {
      id: 'exp.eigen-hunt',
      kind: 'exp',
      title: '자기 방향을 지키는 벡터 찾기',
      status: 'written',
      requires: ['def.matvec', 'def.span'],
      predicts: [
        {
          id: 'p-hunt',
          kind: 'point',
          q: String.raw`행렬 $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이 나타내는 변환에서, 변환한 뒤에도 **자기가 놓인 직선 위에 그대로 남는** 방향을 하나 찾아 노란 손잡이로 맞춰라. 파란 격자는 $A$가 보낸 격자다.`,
          hints: [
            String.raw`두 열 화살표(주황, 청록)가 어떤 직선을 사이에 두고 거울처럼 놓여 있는지 보라.`,
            String.raw`$A(1, 1)$과 $A(1, -1)$을 직접 계산해 보라. 두 결과가 각각 입력과 같은 직선 위에 있는가?`,
          ],
          A: [[2, 1], [1, 2]],
          target: 'eig',
          show: ['tgrid', 'cols'],
          reveal: String.raw`이 행렬에는 그런 직선이 둘 있다(초록). 대각선 $(1, 1)$ 방향은 $A(1, 1) = (3, 3)$으로 같은 직선 위에서 3배가 되고, $(1, -1)$ 방향은 $A(1, -1) = (1, -1)$로 제자리에 남는다. 두 열 화살표가 대각선을 사이에 두고 거울처럼 놓인 것이 단서였다.`,
        },
        {
          id: 'p-count',
          kind: 'choice',
          q: '2×2 행렬 하나에 이런 직선은 몇 개 있을까?',
          choices: ['언제나 정확히 2개', '행렬에 따라 0개, 1개, 2개, 또는 모든 직선', '언제나 적어도 1개', '언제나 무수히 많다'],
          answer: 1,
          why: [
            String.raw`90° 회전을 떠올려 보라. 모든 벡터가 수직인 방향으로 돌아가므로 그런 직선이 하나도 없다.`,
            String.raw`아래 그림에서 보기 행렬을 바꿔 가며 세어 보라. 회전은 0개, 위쪽을 옆으로 미는 변환은 1개, 위의 행렬은 2개, 2배 확대는 모든 직선이다.`,
            String.raw`회전에서는 0개다.`,
            String.raw`모든 방향을 같은 배율로 늘이는 행렬(예: 2배 확대)에서만 그렇다. 대부분의 행렬은 2개 이하다.`,
          ],
        },
      ],
      body: String.raw`[행렬](t:t.matrix)이 나타내는 변환은 대부분의 벡터를 다른 방향으로 돌려 놓는다. 그런데 변환을 지난 뒤에도 **자기가 놓여 있던 직선 위에 그대로 남는** 벡터가 있을까? 그런 벡터가 있다면, 그 직선 위에서 변환이 하는 일은 늘이거나 줄이거나 뒤집는 것뿐이다. 복잡해 보이는 변환이 적어도 그 직선 위에서는 [스칼라 곱](t:t.scalar-mul) 하나로 줄어든다.

먼저 손으로 찾아보자.

::predict p-hunt

::predict p-count

### 탐침을 돌려 보기
아래 그림에서 노란 탐침 $\mathbf{x}$는 단위원 위를 돈다. 분홍 화살표가 출력 $A\mathbf{x}$다. 아래 그래프는 $\mathbf{x}$에서 $A\mathbf{x}$까지 돌아간 각을 $\mathbf{x}$의 각에 따라 그린 것이다. 그래프가 0°나 ±180°를 지나는 자리에서 $A\mathbf{x}$는 $\mathbf{x}$의 직선 위에 놓인다.

::scene b8-eigen-hunt {}

### 찾아볼 것
- 보기 행렬 단추를 바꿔 가며 그런 직선이 몇 개 나오는지 세어 보라. 회전, [전단](t:t.shear), 대각선 밖이 0인 행렬, 대각선을 사이에 두고 성분이 같은 행렬을 모두 해 보라.
- 그래프가 0°를 지날 때와 180°를 지날 때, 분홍 화살표는 각각 노란 화살표에 비해 어떻게 보이는가?
- 직선 하나를 찾았다면, 그 직선 위의 다른 벡터(예: $2\mathbf{x}$, $-\mathbf{x}$)도 같은 성질을 갖는가?

### 관찰을 정리하면
1. 이런 직선의 개수는 행렬에 따라 0개, 1개, 2개이거나, 모든 직선이 다 그렇다.
2. 직선 위의 벡터 하나가 이 성질을 가지면, 그 직선 위의 모든 벡터(영벡터 말고)가 같은 성질을 갖는다. [선형 변환은 스칼라 곱을 그대로 통과시키기](why:def.linear-map) 때문이다: $A(c\mathbf{x}) = cA\mathbf{x}$. 그러므로 우리가 찾는 것은 벡터 하나가 아니라 **직선 하나**다.
3. 직선마다 늘어나는 배율이 정해져 있다. 배율이 음수면 화살표가 뒤집힌다(그래프의 180°).

다음 노드에서 이 벡터와 배율에 이름을 붙인다. 각각 [고유벡터](fwd:t.eigenvector)와 [고윳값](fwd:t.eigenvalue)이다.`,
      checks: [
        {
          q: String.raw`$A = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$에서 자기 직선 위에 남는 직선을 모두 고르면?`,
          choices: ['가로축과 세로축', '대각선 y = x 하나', '없다', '모든 직선'],
          answer: 0,
          explain: String.raw`$\mathbf{e}_1 \to 3\mathbf{e}_1$, $\mathbf{e}_2 \to \mathbf{e}_2$이므로 두 축이 그 직선이다. 대각선 위의 $(1, 1)$은 $(3, 1)$로 가서 대각선을 벗어난다. 두 축의 배율이 다르면 그 사이 방향은 더 많이 늘어나는 축 쪽으로 기울어진다.`,
        },
      ],
    },
    {
      id: 'def.eigen',
      kind: 'def',
      title: '고유벡터와 고윳값',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.eigenvector', ko: '고유벡터', en: 'eigenvector', surfaces: ['고유 벡터'], gloss: '변환 뒤에도 자기가 놓인 직선(스팬) 위에 그대로 있는, 영벡터가 아닌 벡터. A𝐯 = λ𝐯.' },
          { id: 't.eigenvalue', ko: '고윳값', en: 'eigenvalue', surfaces: ['고유값'], gloss: '고유벡터가 늘어나는 배율. 음수면 뒤집히며 늘어나고, 0이면 원점으로 사라진다.' },
        ],
        symbols: [{ tex: String.raw`\lambda`, meaning: '고윳값' }],
      },
      requires: ['exp.eigen-hunt', 'def.scalar-mul'],
      predicts: [
        {
          id: 'p-zero',
          kind: 'choice',
          q: String.raw`정의에서 "영벡터가 아닌"이라는 조건을 빼면 무슨 문제가 생길까?`,
          choices: ['모든 수가 고윳값이 되어 버린다', '아무 문제도 없다', '영벡터는 그림으로 그릴 수 없을 뿐이다', '고윳값 0이 생기지 않게 된다'],
          answer: 0,
          why: [
            String.raw`$A\mathbf{0} = \mathbf{0} = \lambda\mathbf{0}$이 $\lambda$가 무엇이든 성립하기 때문이다.`,
            String.raw`$A\mathbf{0} = \lambda\mathbf{0}$은 $\lambda$가 무엇이든 성립한다. 그러면 "고윳값"이라는 이름이 아무 수도 가려내지 못한다.`,
            String.raw`그림의 문제가 아니라 정의가 정보를 잃는 문제다. 영벡터를 넣으면 모든 수가 고윳값이 된다.`,
            String.raw`거꾸로다. 고윳값 0은 영벡터가 **아닌** $\mathbf{v}$가 $A\mathbf{v} = \mathbf{0}$일 때 생기는 정상적인 경우다. 영벡터를 허용하면 0을 포함해 모든 수가 고윳값이 된다.`,
          ],
        },
        {
          id: 'p-sum',
          kind: 'choice',
          q: String.raw`$A\mathbf{v} = 2\mathbf{v}$이고 $A\mathbf{w} = -\mathbf{w}$이다($\mathbf{v}$, $\mathbf{w}$는 서로 다른 직선 위에 있다). 두 고유벡터의 합 $\mathbf{v} + \mathbf{w}$도 $A$의 고유벡터일까?`,
          hints: [
            String.raw`[선형 변환은 덧셈을 그대로 통과시킨다](n:def.linear-map): $A(\mathbf{v} + \mathbf{w}) = A\mathbf{v} + A\mathbf{w}$.`,
            String.raw`$A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$이다. 이것이 어떤 수 $c$에 대해 $c(\mathbf{v} + \mathbf{w})$와 같을 수 있는가? $\mathbf{v}$와 $\mathbf{w}$의 계수를 따로 비교해 보라.`,
          ],
          choices: ['아니다. 고윳값이 다르면 합은 직선을 벗어난다', '그렇다. 고유벡터끼리 더하면 고유벡터다', '그렇다. 고윳값은 2 + (−1) = 1이다', '그렇다. 고윳값은 두 고윳값의 평균인 0.5다'],
          answer: 0,
          why: [
            String.raw`$A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$가 $c\mathbf{v} + c\mathbf{w}$와 같으려면 $c = 2$이면서 $c = -1$이어야 한다(서로 다른 직선 위의 두 벡터는 [계수가 하나로 정해지므로](n:prop.coords-unique)). 불가능하다.`,
            String.raw`**같은** 고윳값의 고유벡터끼리라면 맞는 말이다. 고윳값이 다르면 두 방향이 서로 다른 배율로 늘어나서, 합의 방향이 돌아간다.`,
            String.raw`고윳값은 더해지지 않는다. $A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$이지 $1\cdot(\mathbf{v} + \mathbf{w})$가 아니다. 거의 맞는 추론에서 "더하기"를 고윳값에까지 적용한 것이다.`,
            String.raw`$0.5(\mathbf{v} + \mathbf{w})$와 $2\mathbf{v} - \mathbf{w}$는 계수가 다르다.`,
          ],
        },
      ],
      body: String.raw`[앞 탐구](n:exp.eigen-hunt)에서 찾은 벡터와 배율에 이름을 붙인다.

**정의.** 정사각 행렬 $A$에 대해, 영벡터가 아닌 벡터 $\mathbf{v}$와 수 $\lambda$가

$$\cy{A\mathbf{v}} = \lambda\,\cx{\mathbf{v}}, \qquad \mathbf{v} \ne \mathbf{0}$$

를 만족하면, $\mathbf{v}$를 $A$의 [고유벡터](def:t.eigenvector)라 하고 $\lambda$를 그 고유벡터의 [고윳값](def:t.eigenvalue)이라 한다.

식을 읽는 법은 이렇다. 왼쪽은 "$\mathbf{v}$에 $A$를 한 결과"이고, 오른쪽은 "같은 $\mathbf{v}$를 그냥 $\lambda$배 한 결과"다. 둘이 같다는 것은 이 변환이 $\mathbf{v}$에게는 [스칼라 곱](t:t.scalar-mul)만 했다는 뜻이다. 그림으로는 출력 $A\mathbf{v}$가 $\mathbf{v}$의 [스팬](t:t.span) 직선 위에 놓인다.

::predict p-zero

### 왜 영벡터는 빼는가
영벡터를 허용하면 $A\mathbf{0} = \mathbf{0} = \lambda\mathbf{0}$이 어떤 $\lambda$로도 성립하므로, 모든 수가 고윳값이 된다. 이름이 아무것도 가려내지 못하게 된다. 그래서 정의에서 영벡터를 뺀다.

반면 **고윳값 0은 허용한다.** $A\mathbf{v} = 0\mathbf{v} = \mathbf{0}$이고 $\mathbf{v} \ne \mathbf{0}$이라는 것은, $\mathbf{v}$가 원점으로 사라지는 방향, 곧 [영공간](t:t.null-space)의 방향이라는 뜻이다.

### 고윳값의 부호와 크기가 말하는 것
- $\lambda > 1$: 그 직선 위에서 늘어난다. $0 < \lambda < 1$: 줄어든다. $\lambda = 1$: 제자리에 있다.
- $\lambda = 0$: 원점으로 사라진다.
- $\lambda < 0$: 뒤집히면서 $|\lambda|$배가 된다.

예: $A = \begin{bmatrix} 2 & 3 \\ 0 & -1 \end{bmatrix}$에서 $A(1, 0) = (2, 0) = 2\cdot(1, 0)$이므로 가로축이 고윳값 2의 방향이다. 또 $A(1, -1) = (2 - 3,\ 0 + 1) = (-1, 1) = -1\cdot(1, -1)$이므로 $(1, -1)$ 방향은 고윳값 $-1$, 곧 같은 직선 위에서 뒤집힌다. 아래 그림에서 탐침을 그 방향에 놓으면 그래프가 180°를 지난다.

::scene b8-eigen-hunt {"A": [[2, 3], [0, -1]], "showEigen": true}

::predict p-sum

### 고유벡터는 직선으로 생각한다
$A\mathbf{v} = \lambda\mathbf{v}$이면 $A(c\mathbf{v}) = cA\mathbf{v} = c\lambda\mathbf{v} = \lambda(c\mathbf{v})$다. 그래서 고유벡터를 몇 배 해도(0배만 빼고) 같은 고윳값의 고유벡터다. "고유벡터 하나"라고 말할 때 실제로 가리키는 것은 그 직선이다. 계산할 때는 그 직선에서 길이가 1인 대표 하나를 고른다. 이 저장소의 \`eig2\`도 길이 1인 벡터를 돌려준다.

같은 고윳값의 고유벡터끼리는 더해도 고유벡터다: $A(\mathbf{v} + \mathbf{w}) = \lambda\mathbf{v} + \lambda\mathbf{w} = \lambda(\mathbf{v} + \mathbf{w})$. 그러나 **고윳값이 다르면 합은 고유벡터가 아니다.** 위 예 $A = \begin{bmatrix} 2 & 3 \\ 0 & -1 \end{bmatrix}$에서 $(1, 0) + (1, -1) = (2, -1)$을 넣으면 $A(2, -1) = (1, 1)$로, $(2, -1)$의 직선을 벗어난다. 고유벡터는 "방향마다 따로" 성립하는 성질이다.`,
      checks: [
        {
          q: String.raw`$A = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$의 고윳값과 그 고유 방향은?`,
          choices: ['고윳값 0(가로축)과 1(세로축)', '고윳값 1(세로축)만', '고윳값 0만', '고유벡터가 없다'],
          answer: 0,
          explain: String.raw`$A\mathbf{e}_1 = \mathbf{0} = 0\cdot\mathbf{e}_1$이므로 가로축은 고윳값 0의 방향(영공간)이다. $A\mathbf{e}_2 = \mathbf{e}_2$이므로 세로축은 고윳값 1의 방향이다. 고윳값 0을 빠뜨리는 것이 흔한 실수다. 0이 될 수 없는 것은 고유**벡터**이지 고윳값이 아니다.`,
        },
      ],
      code: ['eig2'],
    },
    {
      id: 'def.trace',
      kind: 'def',
      title: '대각합',
      status: 'written',
      introduces: {
        terms: [{ id: 't.trace', ko: '대각합', en: 'trace', gloss: '정사각 행렬의 대각선 성분을 모두 더한 수. 아주 조금 변환할 때 넓이가 늘어나는 빠르기이자, 고윳값들의 합.' }],
        symbols: [{ tex: String.raw`\operatorname{tr} A`, meaning: '행렬 A의 대각합' }],
      },
      requires: ['def.matrix', 'prop.det-formula'],
      predicts: [
        {
          id: 'p-nudge',
          kind: 'choice',
          q: String.raw`$A$를 아주 조금만($t$배, $t$는 작은 수) 더한 변환 $I + tA$를 생각하자. 단위 정사각형의 넓이는 대략 몇 배가 될까?`,
          hints: [
            String.raw`[2×2 행렬식 공식](n:prop.det-formula)을 $I + tA$의 네 성분에 그대로 써 보라.`,
            String.raw`대각선 두 칸은 $1 + ta_{11}$, $1 + ta_{22}$이고 나머지 두 칸은 $ta_{12}$, $ta_{21}$이다. 곱을 전개한 뒤 $t$의 차수별로 모아 보라.`,
          ],
          choices: [String.raw`$1 + t\cdot\operatorname{tr}A$`, String.raw`$1 + t\cdot\det A$`, String.raw`$\det A$`, '1 (아주 조금이므로 그대로)'],
          answer: 0,
          why: [
            String.raw`아래에서 정확히 계산한다. $t$에 비례하는 항의 계수가 대각합이다.`,
            String.raw`$\det A$는 $A$ 전체를 했을 때의 넓이 배율이다. $A$를 $t$배만 더하면 $\det A$는 $t^2$에 붙어서 나오므로, $t$가 작을 때는 훨씬 작은 항이 된다.`,
            String.raw`그것은 $I$ 없이 $A$만 했을 때($t = 1$에서 $I$를 뺀 경우)의 배율이다.`,
            String.raw`대략은 맞지만, 가장 큰 변화인 $t$에 비례하는 항을 버렸다. 그 항의 계수가 바로 대각합이다.`,
          ],
        },
      ],
      body: String.raw`다음 노드에서 고윳값을 계산하는 공식을 세우면, 그 공식에 [행렬식](t:t.determinant)과 함께 수 하나가 더 나온다. 그 수를 먼저 정의하고, 기하적인 뜻을 찾아보자.

**정의.** 정사각 행렬 $A$의 대각선 성분을 모두 더한 수를 $A$의 [대각합](def:t.trace)이라 하고 $\operatorname{tr} A$로 쓴다. 2×2에서는 $\operatorname{tr}A = a_{11} + a_{22}$다.

예: $\begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$의 대각합은 5, 90° 회전 $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$의 대각합은 0, 항등 행렬 $I$의 대각합은 2다.

### 첫째 뜻: 열이 자기 축에 남긴 몫
$a_{11}$은 첫째 열 $A\mathbf{e}_1$의 첫째 성분이다. 이것은 $A\mathbf{e}_1$을 $\mathbf{e}_1$ 방향으로 [정사영](t:t.orth-projection)한 길이와 같다: $a_{11} = \mathbf{e}_1\cdot(A\mathbf{e}_1)$. [왜 내적이 정사영의 길이인가?](why:prop.orth-projection) 마찬가지로 $a_{22} = \mathbf{e}_2\cdot(A\mathbf{e}_2)$다. 그래서 대각합은 "각 기저 벡터가 변환 뒤에도 **자기 축 방향으로** 남긴 몫의 합"이다. 90° 회전의 대각합이 0인 것은 두 열이 모두 자기 축과 수직으로 돌아갔기 때문이다.

::scene b8-trace {}

::predict p-nudge

### 둘째 뜻: 아주 조금 변환할 때 넓이가 늘어나는 빠르기
$I + tA = \begin{bmatrix} 1 + ta_{11} & ta_{12} \\ ta_{21} & 1 + ta_{22} \end{bmatrix}$의 행렬식을 [2×2 공식](why:prop.det-formula)으로 계산하면

$$\det(I + tA) = (1 + ta_{11})(1 + ta_{22}) - t^2a_{12}a_{21} = 1 + t\,\operatorname{tr}A + t^2\det A$$

이다. 가운데에서 괄호를 [분배법칙](t:t.distributive)으로 풀었다. $t$가 작으면 $t^2$은 훨씬 더 작으므로, 넓이 배율은 대략 $1 + t\,\operatorname{tr}A$다. 곧 **대각합은 항등 변환 근처에서 넓이가 늘어나는 빠르기**다. 대각합이 0이면 아주 조금 변환할 때 넓이가 (첫 근사로) 변하지 않는다. 회전을 아주 조금 하는 경우가 그렇다.

예: $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$, $t = 0.05$이면 정확한 값은 $1 + 0.25 + 0.0025\times6 = 1.265$이고, 근사 $1 + 0.05\times5 = 1.25$와 $0.015$만큼 차이 난다. 아래 그림에서 $t$를 줄이면 이 차이가 $t^2$의 빠르기로 사라진다.

::scene b8-trace {"nudge": true, "t": 0.05}

> [!주의] 대각합만으로는 행렬식을 알 수 없다
> 대각합은 "조금 했을 때"의 변화이고, 행렬식은 "다 했을 때"의 배율이다. 대각합이 같아도 행렬식은 다를 수 있다. 예를 들어 $I$와 $\begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix}$은 대각합이 둘 다 2이지만 행렬식은 1과 0이다. 다음 노드에서는 두 수가 함께 고윳값을 정한다.`,
      checks: [
        {
          q: String.raw`회전 행렬 $R_\theta$의 대각합은?`,
          choices: [String.raw`$2\cos\theta$`, '0', '1', String.raw`$\cos\theta + \sin\theta$`],
          answer: 0,
          explain: String.raw`$R_\theta$의 대각선은 $\cos\theta$와 $\cos\theta$다. 각 기저 벡터가 $\theta$만큼 돌아가면 자기 축 방향의 몫이 $\cos\theta$로 줄어든다. $\theta = 90°$일 때만 0이다.`,
        },
      ],
      code: ['trace'],
    },
    {
      id: 'prop.char-poly',
      kind: 'prop',
      title: '특성방정식: det(A − λI) = 0',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.char-eq', ko: '특성방정식', en: 'characteristic equation', gloss: 'det(A − λI) = 0. 2×2에서는 λ² − (tr A)λ + det A = 0. 근이 고윳값이다.' },
          { id: 't.discriminant', ko: '판별식', en: 'discriminant', gloss: '2×2 특성방정식에서 (tr A)² − 4 det A. 양수면 서로 다른 실수 고윳값 둘, 0이면 하나, 음수면 실수 고윳값이 없다.' },
        ],
        symbols: [{ tex: String.raw`\lambda_i`, meaning: 'i번째 고윳값 (큰 것부터)' }],
      },
      requires: ['def.eigen', 'def.trace', 'prop.det-zero', 'def.identity'],
      predicts: [
        {
          id: 'p-why',
          kind: 'choice',
          q: String.raw`$(A - \lambda I)\mathbf{v} = \mathbf{0}$이고 $\mathbf{v} \ne \mathbf{0}$이라면, 행렬 $A - \lambda I$에 대해 무엇을 알 수 있을까?`,
          choices: ['평면을 직선이나 점으로 납작하게 누른다. 그래서 행렬식이 0이다', String.raw`$A - \lambda I$는 영행렬이다`, String.raw`$A - \lambda I$는 역행렬을 가진다`, '아무것도 알 수 없다'],
          answer: 0,
          why: [
            String.raw`영벡터가 아닌 입력이 원점으로 간다는 것은 영공간이 원점보다 크다는 뜻이고, [그것은 행렬식이 0이라는 것과 같다](n:prop.det-zero).`,
            String.raw`영행렬이면 **모든** 벡터가 0으로 간다(그 경우는 $A = \lambda I$다). 필요한 것은 영벡터가 아닌 벡터 **하나**가 0으로 가는 것뿐이다.`,
            String.raw`거꾸로다. $\mathbf{v}$와 $\mathbf{0}$, 서로 다른 두 입력이 같은 출력 $\mathbf{0}$으로 가므로 [되돌릴 수 없다](n:prop.inverse-exists).`,
            String.raw`영벡터가 아닌 입력이 0으로 간다는 것은 강한 정보다. 넓이가 0이 된다는 것까지 알 수 있다.`,
          ],
        },
        {
          id: 'p-shift',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$의 고윳값은 3과 1이다(아래에서 계산한다). 그렇다면 $A + 2I$의 고윳값은?`,
          hints: [
            String.raw`$A$의 고유벡터 $\mathbf{v}$에 $A + 2I$를 곱하면 어떻게 되는가? 행렬 곱은 덧셈 위로 나뉜다: $(A + 2I)\mathbf{v} = A\mathbf{v} + 2I\mathbf{v}$.`,
            String.raw`$A\mathbf{v} = \lambda\mathbf{v}$이고 $I\mathbf{v} = \mathbf{v}$다. 두 항을 합쳐 $(\ \cdot\ )\mathbf{v}$ 꼴로 써 보라.`,
          ],
          choices: ['5와 3', '3과 1 그대로', '6과 2 (두 배)', '특성방정식을 새로 풀기 전에는 알 수 없다'],
          answer: 0,
          why: [
            String.raw`$(A + 2I)\mathbf{v} = \lambda\mathbf{v} + 2\mathbf{v} = (\lambda + 2)\mathbf{v}$. 고유벡터는 그대로이고 고윳값만 2씩 옮겨진다.`,
            String.raw`$2I$를 더하면 모든 벡터에 "자기 자신의 2배"가 더해진다. 고유 방향은 같지만 배율이 바뀐다.`,
            String.raw`두 배가 되는 것은 $2A$의 고윳값이다. $A + 2I$는 배율에 2를 **더한다**. 거의 맞는 추론에서 곱과 합을 바꾼 것이다.`,
            String.raw`새로 풀어도 되지만, 고유벡터에 직접 곱해 보면 계산 없이 알 수 있다. 특성방정식으로 검산하면 대각합 8, 행렬식 15이므로 $\lambda^2 - 8\lambda + 15 = (\lambda - 5)(\lambda - 3)$이다.`,
          ],
        },
      ],
      openWhys: [{ q: '판별식이 음수일 때 나오는 복소수 근은 기하적으로 무엇을 뜻하는가?', answeredBy: 'prop.no-real-eigen' }],
      body: String.raw`[앞의 탐구](n:exp.eigen-hunt)처럼 그림에서 고유벡터를 찾을 수는 있다. 그러나 정확한 값을 얻으려면 계산이 필요하다. $A\mathbf{v} = \lambda\mathbf{v}$를 만족하는 $\lambda$는 어떻게 구할까? 미지수가 $\lambda$와 $\mathbf{v}$ 둘이라 막막해 보인다. 먼저 식을 옮겨 써 보자.

$$A\mathbf{v} = \lambda\mathbf{v} \iff A\mathbf{v} - \lambda I\mathbf{v} = \mathbf{0} \iff (A - \lambda I)\mathbf{v} = \mathbf{0}$$

가운데에서 $\lambda\mathbf{v}$를 $\lambda I\mathbf{v}$로 바꿔 썼다. [항등 행렬](t:t.identity)은 모든 벡터를 제자리에 두기 때문이다. 이렇게 쓰면 행렬 하나 $A - \lambda I$가 영벡터가 아닌 $\mathbf{v}$를 원점으로 보내는지를 묻는 문제가 된다.

::predict p-why

**명제.** 수 $\lambda$가 $A$의 [고윳값](t:t.eigenvalue)인 것과 $\det(A - \lambda I) = 0$인 것은 같은 말이다. 2×2 행렬에서 이 식을 풀어 쓰면

$$\lambda^2 - (\operatorname{tr}A)\,\lambda + \det A = 0$$

이고, 이 식을 $A$의 [특성방정식](def:t.char-eq)이라 한다. 미지수가 $\lambda$ 하나뿐인 이차방정식이다. $\mathbf{v}$는 $\lambda$를 구한 뒤에 따로 구한다.

### 그림으로 보기
아래 그림 위쪽은 $A - \lambda I$가 격자를 보내는 모습이고, 아래쪽은 $\lambda$에 따른 $\det(A - \lambda I)$의 그래프(포물선)다. $\lambda$를 움직여 포물선이 가로축과 만나는 자리에 두면, 위쪽 격자가 직선으로 납작해진다. 그때 원점으로 사라지는 방향이 바로 그 고윳값의 고유 방향이다.

::scene b8-char-poly {}

::predict p-shift

$(A + cI)\mathbf{v} = A\mathbf{v} + c\mathbf{v} = (\lambda + c)\mathbf{v}$이므로, 항등 행렬의 $c$배를 더하면 **고유벡터는 그대로이고 고윳값만 $c$만큼 옮겨진다.** 이 사실은 뒤에서도 자주 쓴다. 이제 고윳값을 직접 구하는 방법으로 돌아가자.

### 푸는 법: 완전제곱
근의 공식을 외우지 않고 만들어 보자. 특성방정식을 $\lambda^2 - (\operatorname{tr}A)\lambda = -\det A$로 옮기고, 양쪽에 $(\operatorname{tr}A)^2/4$를 더하면 왼쪽이 완전제곱이 된다([분배법칙](t:t.distributive)으로 전개해 확인하라).

$$\Big(\lambda - \tfrac{\operatorname{tr}A}{2}\Big)^2 = \frac{(\operatorname{tr}A)^2 - 4\det A}{4}$$

오른쪽 분자 $(\operatorname{tr}A)^2 - 4\det A$를 [판별식](def:t.discriminant)이라 한다.
- 판별식 > 0: 제곱근이 두 개(±)이므로 서로 다른 실수 고윳값이 둘이다. $\lambda_{1,2} = \big(\operatorname{tr}A \pm \sqrt{(\operatorname{tr}A)^2 - 4\det A}\big)/2$.
- 판별식 = 0: 고윳값이 하나(중근)다.
- 판별식 < 0: 실수 고윳값이 없다. 실수의 제곱은 음수가 될 수 없기 때문이다. [왜 음수 × 음수는 양수인가?](why:prop.neg-times-neg)

### 고윳값의 합과 곱
실수 고윳값이 $\lambda_1, \lambda_2$이면 특성방정식은 $(\lambda - \lambda_1)(\lambda - \lambda_2) = \lambda^2 - (\lambda_1 + \lambda_2)\lambda + \lambda_1\lambda_2$로 인수분해된다. 계수를 맞추면

$$\lambda_1 + \lambda_2 = \operatorname{tr}A, \qquad \lambda_1\lambda_2 = \det A$$

둘째 식은 기하적으로도 자연스럽다. 두 고유 방향을 따라 각각 $\lambda_1$배, $\lambda_2$배 늘이는 변환은 넓이를 $\lambda_1\lambda_2$배 한다. 그것이 [행렬식의 뜻](t:t.determinant)이다.

### 고유벡터 구하기
$\lambda$를 구했으면 $(A - \lambda I)\mathbf{v} = \mathbf{0}$을 푼다. [행의 관점](why:prop.row-picture)으로 읽으면 이 식은 "$\mathbf{v}$가 $A - \lambda I$의 두 행과 모두 수직"이라는 뜻이다. 그러므로 0이 아닌 행 하나를 90° 돌리면 $\mathbf{v}$가 된다. 이 저장소의 \`eig2\`가 정확히 이렇게 계산한다.

### 두 개의 예
- $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$: $\operatorname{tr}A = 4$, $\det A = 3$이므로 $\lambda^2 - 4\lambda + 3 = (\lambda - 3)(\lambda - 1) = 0$. $\lambda = 3$이면 $A - 3I = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}$의 행 $(-1, 1)$을 90° 돌려 $\mathbf{v} = (1, 1)$을 얻는다. $\lambda = 1$이면 $A - I$의 행 $(1, 1)$에서 $\mathbf{v} = (1, -1)$을 얻는다. 검산: 합 $3 + 1 = 4$, 곱 $3 \times 1 = 3$.
- $A = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$: $\operatorname{tr}A = 5$, $\det A = 4 + 2 = 6$이므로 $\lambda^2 - 5\lambda + 6 = (\lambda - 3)(\lambda - 2) = 0$. $\lambda = 3$이면 $A - 3I = \begin{bmatrix} 1 & -2 \\ 1 & -2 \end{bmatrix}$에서 $\mathbf{v} = (2, 1)$, $\lambda = 2$이면 $A - 2I = \begin{bmatrix} 2 & -2 \\ 1 & -1 \end{bmatrix}$에서 $\mathbf{v} = (1, 1)$이다.`,
      proof: String.raw`**같은 말인 이유.** $\lambda$가 고윳값이라는 것은 영벡터가 아닌 $\mathbf{v}$가 있어 $(A - \lambda I)\mathbf{v} = \mathbf{0}$이라는 것이다. 영벡터도 $(A - \lambda I)\mathbf{0} = \mathbf{0}$이므로, 이것은 서로 다른 두 입력 $\mathbf{v}$와 $\mathbf{0}$이 같은 출력으로 간다는 것, 곧 $A - \lambda I$가 평면을 납작하게 누른다는 것이다. [평면을 납작하게 누르는 것과 행렬식이 0인 것은 같은 말이다](why:prop.det-zero). 거꾸로 $\det(A - \lambda I) = 0$이면 $A - \lambda I$의 두 열이 종속이어서 어떤 영벡터가 아닌 입력이 원점으로 가고, 그 입력이 고유벡터다.

**2×2 전개.** [2×2 행렬식 공식](why:prop.det-formula)으로

$$\det\begin{bmatrix} a_{11} - \lambda & a_{12} \\ a_{21} & a_{22} - \lambda \end{bmatrix} = (a_{11} - \lambda)(a_{22} - \lambda) - a_{12}a_{21} = \lambda^2 - (a_{11} + a_{22})\lambda + (a_{11}a_{22} - a_{12}a_{21})$$

이다. 마지막 식의 $\lambda$의 계수는 $-\operatorname{tr}A$, 상수항은 $\det A$다.`,
      checks: [
        {
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$의 고윳값은?`,
          choices: ['1과 3', '1과 2', '3과 2', '4와 3'],
          answer: 0,
          explain: String.raw`특성방정식은 $\lambda^2 - 4\lambda + 3 = 0$이고 근은 1과 3이다. 대각선 아래가 0인 행렬(삼각 행렬)에서는 $\det(A - \lambda I) = (1 - \lambda)(3 - \lambda)$이므로 대각 성분이 그대로 고윳값이다. 대각선 밖의 2는 고윳값이 아니라 고유벡터의 방향에 영향을 준다(고윳값 3의 방향은 $(1, 1)$).`,
        },
        {
          q: '2×2 행렬의 고윳값이 2와 −3이다. 대각합과 행렬식은?',
          choices: ['대각합 −1, 행렬식 −6', '대각합 −6, 행렬식 −1', '대각합 5, 행렬식 6', '행렬을 모르면 알 수 없다'],
          answer: 0,
          explain: String.raw`합 $2 + (-3) = -1$이 대각합, 곱 $2\times(-3) = -6$이 행렬식이다. 행렬식이 음수이므로 이 변환은 넓이를 6배 하면서 뒤집는다. 고윳값 $-3$의 방향이 뒤집히는 방향이다.`,
        },
      ],
      code: ['eig2'],
    },
    {
      id: 'prop.no-real-eigen',
      kind: 'prop',
      title: '회전에는 실수 고유벡터가 없다',
      status: 'written',
      requires: ['prop.char-poly', 'prop.rotation-matrix'],
      predicts: [
        {
          id: 'p-angles',
          kind: 'choice',
          q: String.raw`회전 $R_\theta$ ($0° \le \theta < 360°$)가 실수 고유벡터를 **가지는** 각 $\theta$를 모두 고르면?`,
          hints: [String.raw`회전은 모든 방향을 같은 각 $\theta$만큼 돌린다. 화살표가 돌아간 뒤에도 처음과 **같은 직선** 위에 있으려면, 몇 도를 돌아야 하는가?`],
          choices: ['0°와 180°뿐', '0°뿐', '90°의 배수(0°, 90°, 180°, 270°)', '없다. 회전에는 언제나 고유벡터가 없다'],
          answer: 0,
          why: [
            String.raw`같은 직선 위에 남으려면 0°(같은 방향) 또는 180°(반대 방향)만큼 돌아야 한다. 아래에서 판별식으로 같은 결론을 얻는다.`,
            String.raw`180°를 빠뜨렸다. 180° 돌린 화살표는 반대쪽을 가리키지만 **같은 직선** 위에 있다. 고윳값 $-1$이다.`,
            String.raw`90° 돌린 화살표는 처음 직선과 **수직인** 직선 위에 있다. 직선이 바뀐다.`,
            String.raw`0°(아무것도 안 함)와 180°는 예외다.`,
          ],
        },
        {
          id: 'p-stretch',
          kind: 'choice',
          q: String.raw`30° 돌린 뒤 가로로 4배 늘이는 변환 $M = \begin{bmatrix} 4 & 0 \\ 0 & 1 \end{bmatrix}R_{30°}$에 실수 고유 방향이 있을까?`,
          hints: [
            String.raw`판별식 $(\operatorname{tr}M)^2 - 4\det M$의 부호만 알면 된다. [행렬식은 곱을 곱으로 보낸다](n:prop.det-product).`,
            String.raw`$\det M = 4\cdot\det R_{30°} = 4$. $M = \begin{bmatrix} 4\cos30° & -4\sin30° \\ \sin30° & \cos30° \end{bmatrix}$이므로 $\operatorname{tr}M = 5\cos30° \approx 4.33$이다.`,
          ],
          choices: ['있다. 늘이기가 회전을 이긴다', '없다. 회전이 들어 있으므로', '있다. 다만 고윳값이 음수다', '모든 방향이 고유 방향이다'],
          answer: 0,
          why: [
            String.raw`판별식은 $(5\cos30°)^2 - 16 = 18.75 - 16 = 2.75 > 0$이다. 서로 다른 실수 고윳값(약 2.99와 1.34)이 둘 있다.`,
            String.raw`회전이 "들어 있다"는 것만으로는 판정할 수 없다. 한 방향으로 강하게 늘이면, 돌아간 화살표가 그 방향으로 다시 끌려와 자기 직선에 돌아오는 방향이 생긴다. 판별식이 판정한다.`,
            String.raw`두 고윳값의 곱은 $\det M = 4 > 0$, 합은 $\operatorname{tr}M > 0$이므로 둘 다 양수다.`,
            String.raw`모든 방향이 고유 방향인 것은 $M$이 수의 배수 $cI$일 때뿐이다.`,
          ],
        },
      ],
      openWhys: [{ q: '판별식이 음수일 때 나오는 복소수 근은 기하적으로 무엇을 뜻하는가?', answeredBy: null }],
      body: String.raw`[회전](t:t.rotation)은 모든 벡터를 같은 각만큼 돌린다. 그렇다면 회전에서 자기 직선 위에 남는 벡터가 있을 수 있을까?

::predict p-angles

**명제.** 각 $\theta$가 0°도 180°도 아닌 회전 $R_\theta$에는 실수 [고윳값](t:t.eigenvalue)이 없다. 그러므로 [고유벡터](t:t.eigenvector)도 없다.

아래 그림은 90° 회전이다. 탐침을 어디에 두어도 "돌아간 각" 그래프가 90°에 붙어 있다. 0°나 180°를 지나는 자리가 없다.

::scene b8-eigen-hunt {"rot": 90}

### 계산과 그림이 같은 말을 한다
[회전 행렬](n:prop.rotation-matrix) $R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$의 대각합은 $2\cos\theta$, 행렬식은 $\cos^2\theta + \sin^2\theta = 1$이다([왜 1인가?](why:prop.cos-sin-identity)). 그러므로 [판별식](t:t.discriminant)은

$$(2\cos\theta)^2 - 4\cdot1 = 4(\cos^2\theta - 1) = -4\sin^2\theta$$

이다. $\sin\theta \ne 0$이면, 곧 $\theta$가 0°도 180°도 아니면, 이 값은 음수다. [판별식이 음수이면 실수 근이 없다](why:prop.char-poly). 그림의 말로는 이렇다. "모든 방향이 $\theta$만큼 돌아가는데, $\theta$가 0°도 180°도 아니므로 어떤 방향도 자기 직선에 돌아오지 않는다."

### 남은 두 각
- $\theta = 0°$: $R_0 = I$. 모든 벡터가 제자리에 있으므로 모든 방향이 고윳값 1의 고유 방향이다.
- $\theta = 180°$: $R_{180°} = -I$. 모든 벡터가 같은 직선 위에서 뒤집히므로 모든 방향이 고윳값 $-1$의 고유 방향이다. 판별식은 $-4\sin^2 180° = 0$으로 중근이다.

::predict p-stretch

### 돌리기와 늘이기의 줄다리기
30° 돌린 뒤 가로로 $a$배 늘이는 변환 $\begin{bmatrix} a & 0 \\ 0 & 1 \end{bmatrix}R_{30°}$의 대각합은 $(a + 1)\cos30°$, 행렬식은 $a$다. 판별식 $(a + 1)^2\cos^2 30° - 4a$를 계산하면 $a = 2$일 때 $-1.25$(실수 고유 방향 없음), $a = 3$일 때 정확히 0(중근), $a = 4$일 때 $2.75$(둘)이다. 회전은 고유 방향을 없애는 쪽으로, 한 방향 늘이기는 만드는 쪽으로 당긴다. 판별식의 부호가 둘 중 어느 쪽이 이기는지 정한다.

### 회전만 그런 것은 아니다
판별식이 음수인 행렬은 모두 "어느 정도 돌리는" 변환이다. 예를 들어 $\begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$은 45° 돌리면서 $\sqrt{2}$배 늘이는 변환이다. 대각합 2, 행렬식 2이므로 판별식은 $4 - 8 = -4 < 0$이고, 실수 고유 방향이 없다.

> [!참고] 복소수 고윳값
> 판별식이 음수일 때도, 수의 범위를 복소수로 넓히면 근 $\cos\theta \pm i\sin\theta$가 생긴다. 이 복소수들은 회전을 담는 다른 언어다. 이 교재는 실수 안에서만 다루므로, 이 뜻은 "아직 여기서 답하지 않은 질문"으로 남겨 둔다.`,
      checks: [
        {
          q: String.raw`$\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$에 실수 고유벡터가 있는가?`,
          choices: ['없다. 시계 방향 90° 회전이다', '있다. e₁ 방향', '있다. 모든 방향', '있다. 대각선 방향'],
          answer: 0,
          explain: String.raw`첫째 열 $(0, -1)$: $\mathbf{e}_1$이 아래쪽을 가리키게 된다. 둘째 열 $(1, 0)$: $\mathbf{e}_2$가 오른쪽을 가리키게 된다. 시계 방향 90° 회전이다. 대각합 0, 행렬식 1이므로 판별식은 $0 - 4 = -4 < 0$이다.`,
        },
      ],
    },
    {
      id: 'prop.diagonalization',
      kind: 'prop',
      title: '고유기저에서는 늘이기뿐: A = PDP⁻¹',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.diagonal', ko: '대각 행렬', en: 'diagonal matrix', gloss: '대각선 밖의 성분이 모두 0인 행렬. 축 방향으로 따로따로 늘이기만 한다.' },
          { id: 't.diagonalize', ko: '대각화', en: 'diagonalization', gloss: '고유벡터들을 기저로 삼아 변환을 대각 행렬로 다시 적는 일: A = PDP⁻¹.' },
        ],
        symbols: [{ tex: 'D', meaning: '대각 행렬(대각화에서 고윳값을 대각에 놓은 것)' }],
      },
      requires: ['prop.char-poly', 'prop.similarity'],
      predicts: [
        {
          id: 'p-diag',
          kind: 'choice',
          q: String.raw`서로 다른 직선 위의 두 고유벡터 $\mathbf{v}_1, \mathbf{v}_2$(고윳값 $\lambda_1, \lambda_2$)를 새 기저로 삼아, 같은 변환을 그 기저의 좌표로 다시 적으면 어떤 행렬이 될까?`,
          hints: [
            String.raw`새 좌표 $(c_1, c_2)$는 벡터 $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$를 뜻한다. 여기에 $A$를 곱하면 무엇이 되는지, 그리고 그 결과를 다시 새 좌표로 적으면 무엇인지 써 보라.`,
          ],
          choices: [String.raw`대각선에 $\lambda_1, \lambda_2$가 놓이고 나머지는 0인 행렬`, String.raw`$A$와 똑같은 행렬`, '항등 행렬', '회전 행렬'],
          answer: 0,
          why: [
            String.raw`새 좌표 $(c_1, c_2)$로 적힌 벡터 $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$는 $c_1\lambda_1\mathbf{v}_1 + c_2\lambda_2\mathbf{v}_2$로 간다. 새 좌표로는 $(\lambda_1c_1, \lambda_2c_2)$, 곧 좌표마다 따로 늘이기만 한다.`,
            String.raw`같은 변환이라도 기저를 바꾸면 적는 숫자가 바뀐다. [7장](n:prop.similarity)에서 본 것처럼, 새 기저로 적은 행렬은 $P^{-1}AP$다.`,
            String.raw`그것은 모든 고윳값이 1일 때뿐이다.`,
            String.raw`고유 방향 위에서는 늘이기만 할 뿐 돌리지 않는다.`,
          ],
        },
        {
          id: 'p-shear',
          kind: 'choice',
          q: String.raw`[전단](t:t.shear) $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$은 대각화될까?`,
          choices: ['안 된다. 고유 방향이 하나뿐이다', '된다. 고윳값 1이 실수이므로', '된다. 모든 행렬은 대각화된다', '된다. 고윳값이 두 개이므로'],
          answer: 0,
          why: [
            String.raw`$A - I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$이 0으로 보내는 방향은 가로축 하나뿐이다. 기저를 이루려면 서로 다른 직선 위의 고유벡터가 둘 필요하다.`,
            String.raw`고윳값이 실수인 것만으로는 부족하다. 서로 다른 직선 위의 고유벡터가 **둘** 있어야 한다.`,
            String.raw`회전(실수 고윳값 없음)과 전단(고유 방향 하나)이 반례다.`,
            String.raw`특성방정식 $(\lambda - 1)^2 = 0$의 근은 1 하나(중근)다. 그리고 그 하나에 딸린 직선도 하나뿐이다.`,
          ],
        },
      ],
      body: String.raw`[고유벡터](t:t.eigenvector)가 서로 다른 직선 위에 두 개 있으면, 그 두 방향은 평면의 [기저](t:t.basis)가 된다. 그 기저의 좌표로 변환을 다시 적으면 어떻게 보일까?

::predict p-diag

새 좌표로 적은 행렬은 대각선에만 고윳값이 있고 나머지는 0이다. 이런 행렬을 [대각 행렬](def:t.diagonal)이라 하고, 이렇게 다시 적는 일을 [대각화](def:t.diagonalize)라 한다.

**명제.** 2×2 행렬 $A$가 서로 다른 직선 위의 고유벡터 $\mathbf{v}_1, \mathbf{v}_2$(고윳값 $\lambda_1, \lambda_2$)를 가진다고 하자. $P$를 두 고유벡터를 열로 세운 행렬, $D$를 고윳값을 대각에 놓은 행렬이라 하면

$$P = \begin{bmatrix} | & | \\ \mathbf{v}_1 & \mathbf{v}_2 \\ | & | \end{bmatrix}, \quad D = \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix}, \qquad A = PDP^{-1}$$

이다.

### 오른쪽부터 읽기: 번역 → 늘이기 → 번역
[기저 변환](t:t.change-of-basis)에서 $P$는 "새 좌표 → 표준 좌표"였다. 그러므로 $A\mathbf{x} = P(D(P^{-1}\mathbf{x}))$는 세 단계다.
1. $P^{-1}$: 입력을 고유 기저의 좌표로 **번역**한다.
2. $D$: 각 좌표를 고윳값만큼 따로 **늘인다**.
3. $P$: 결과를 다시 표준 좌표로 **번역**한다.

[같은 변환을 다른 언어로 적은 것](why:prop.similarity)이 바로 이 모양이다. 대각화는 "고유 기저라는 언어로 말하면 이 변환은 늘이기뿐"이라는 뜻이다.

::scene b8-diagonalize {}

예: 그림의 처음 행렬 $A = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$은 [앞 노드](n:prop.char-poly)에서 고윳값 3, 2와 고유벡터 $(2, 1)$, $(1, 1)$을 얻었다. 그러므로 $P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$, $D = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}$, $P^{-1} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$이다($\det P = 1$). 검산하면 $PD = \begin{bmatrix} 6 & 2 \\ 3 & 2 \end{bmatrix}$이고, $(PD)P^{-1} = \begin{bmatrix} 6 - 2 & -6 + 4 \\ 3 - 2 & -3 + 4 \end{bmatrix} = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$으로 $A$와 같다.

### 언제 대각화되는가
- **고윳값이 서로 다르면 언제나 된다.** 서로 다른 고윳값의 고유벡터는 같은 직선 위에 있을 수 없기 때문이다(아래 증명의 첫 부분).
- **실수 고윳값이 없으면 안 된다.** [회전](n:prop.no-real-eigen)이 그렇다.
- **고윳값이 하나(중근)이면 경우에 따라 다르다.** $2I$처럼 모든 방향이 고유 방향이면 이미 대각 행렬이다. 그렇지 않으면 고유 방향이 하나뿐이어서 대각화되지 않는다.

::predict p-shear

::scene b8-eigen-hunt {"A": [[1, 1], [0, 1]], "showEigen": true}

### 대각화가 주는 것: 여러 번 하기가 쉬워진다
$A^2 = (PDP^{-1})(PDP^{-1}) = PD(P^{-1}P)DP^{-1} = PD^2P^{-1}$이다([결합법칙](why:prop.associative)으로 가운데를 묶었다). 같은 방식으로 $A^k = PD^kP^{-1}$이고, $D^k$는 대각선을 $\lambda_1^k, \lambda_2^k$로 바꾸기만 하면 된다. 위 예에서 $A^{10}$은 $(2, 1)$ 방향으로 $3^{10} = 59049$배, $(1, 1)$ 방향으로 $2^{10} = 1024$배 늘인다. 그래서 변환을 여러 번 되풀이하면 거의 모든 입력이 가장 큰 고윳값의 방향으로 쏠린다.`,
      proof: String.raw`**서로 다른 고윳값의 고유벡터는 같은 직선 위에 없다.** $\lambda_1 \ne \lambda_2$인데 $\mathbf{v}_2 = c\mathbf{v}_1$이라고 해 보자. 그러면 $A\mathbf{v}_2 = \lambda_2\mathbf{v}_2$이고, 한편 $A\mathbf{v}_2 = cA\mathbf{v}_1 = c\lambda_1\mathbf{v}_1 = \lambda_1\mathbf{v}_2$다. 두 식을 빼면 $(\lambda_1 - \lambda_2)\mathbf{v}_2 = \mathbf{0}$이고, $\mathbf{v}_2 \ne \mathbf{0}$이므로 $\lambda_1 = \lambda_2$가 되어 가정과 어긋난다.

**$A = PDP^{-1}$.** [곱의 j번째 열은 왼쪽 행렬 × 오른쪽 행렬의 j번째 열이다](why:prop.matmul-columns). 그러므로 $AP$의 열은 $A\mathbf{v}_1 = \lambda_1\mathbf{v}_1$, $A\mathbf{v}_2 = \lambda_2\mathbf{v}_2$이고, $PD$의 열은 $P(\lambda_1\mathbf{e}_1) = \lambda_1\mathbf{v}_1$, $P(\lambda_2\mathbf{e}_2) = \lambda_2\mathbf{v}_2$다. 열이 모두 같으므로 $AP = PD$다. $P$의 두 열은 서로 다른 직선 위에 있으므로 [선형 독립](t:t.lin-indep)이고, [그래서 행렬식이 0이 아니며](why:prop.det-zero) [역행렬이 있다](why:prop.inverse-exists). 양쪽의 오른쪽에 $P^{-1}$을 곱하면 $A = PDP^{-1}$이다.`,
      checks: [
        {
          q: String.raw`$A = PDP^{-1}$이고 $D = \begin{bmatrix} 2 & 0 \\ 0 & 0.5 \end{bmatrix}$이다. $\det A$는?`,
          choices: ['1', '2.5', 'P를 모르면 알 수 없다', '0'],
          answer: 0,
          explain: String.raw`[행렬식은 곱을 곱으로 보낸다](n:prop.det-product). $\det A = \det P\cdot\det D\cdot\det P^{-1} = \det D = 2\times0.5 = 1$이다($\det P\cdot\det P^{-1} = \det I = 1$). 같은 변환을 어느 언어로 적든 넓이 배율은 같다. 그리고 그것은 고윳값의 곱이다.`,
        },
      ],
    },
    {
      id: 'def.symmetric',
      kind: 'def',
      title: '대칭 행렬',
      status: 'written',
      introduces: {
        terms: [{ id: 't.symmetric', ko: '대칭 행렬', en: 'symmetric matrix', gloss: 'Sᵀ = S 인 행렬. 대각선을 거울로 삼아 성분이 대칭. 기하로는 (S𝐱)·𝐲 = 𝐱·(S𝐲).' }],
        symbols: [
          { tex: 'S', meaning: '대칭 행렬' },
          { tex: 's_{ij}', meaning: '대칭 행렬 S의 i행 j열 성분 (s_ij = s_ji)' },
        ],
      },
      requires: ['def.transpose'],
      predicts: [
        {
          id: 'p-sym',
          kind: 'choice',
          q: String.raw`행렬 $M$에 대해, 모든 $\mathbf{x}, \mathbf{y}$에서 $(M\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(M\mathbf{y})$가 성립하려면 $M$은 어떤 행렬이어야 할까?`,
          choices: [String.raw`$M^{\mathsf{T}} = M$인 행렬`, '회전 행렬', '행렬식이 1인 행렬', '대각 행렬만'],
          answer: 0,
          why: [
            String.raw`[전치의 정체](n:prop.transpose-dot)에 따라 $(M\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(M^{\mathsf{T}}\mathbf{y})$이므로, $M^{\mathsf{T}} = M$이면 바로 성립한다.`,
            String.raw`회전 $R$에서는 $(R\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(R^{\mathsf{T}}\mathbf{y})$이고 $R^{\mathsf{T}}$는 **반대 방향**의 회전이다. 같은 회전을 양쪽에 걸면 같은 값이 나오지 않는다.`,
            String.raw`넓이 배율은 이 등식과 관계가 없다.`,
            String.raw`대각 행렬은 이 등식을 만족하지만, 만족하는 행렬이 대각 행렬뿐인 것은 아니다. 예: $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.`,
          ],
        },
      ],
      body: String.raw`행렬의 성분이 대각선을 거울로 삼아 대칭이라는 것은 "숫자 배치"의 성질이다. 이 배치는 기하적으로 무엇을 뜻할까?

**정의.** [전치](t:t.transpose)해도 자기 자신인 행렬, 곧 $S^{\mathsf{T}} = S$인 행렬을 [대칭 행렬](def:t.symmetric)이라 한다. 성분으로는 $s_{ij} = s_{ji}$다. 2×2에서는 $s_{12} = s_{21}$이라는 조건 하나다.

예: $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$, $\begin{bmatrix} 1 & 2 \\ 2 & -2 \end{bmatrix}$, 그리고 모든 대각 행렬은 대칭이다. $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$과 회전 행렬(각이 0°, 180°가 아닐 때)은 대칭이 아니다.

::predict p-sym

### 기하적인 뜻: 어느 쪽에 걸어도 같다
[전치의 정체](why:prop.transpose-dot) $(A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$에서 $A$가 대칭이면 $A^{\mathsf{T}} = A$이므로

$$(S\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(S\mathbf{y})$$

이다. "$\mathbf{x}$를 보낸 뒤 $\mathbf{y}$와 [내적](t:t.dot)한 값"과 "$\mathbf{y}$를 보낸 뒤 $\mathbf{x}$와 내적한 값"이 언제나 같다. 변환을 두 벡터 중 어느 쪽에 걸어도 둘의 관계는 같다는 뜻이다.

거꾸로 이 등식이 모든 $\mathbf{x}, \mathbf{y}$에서 성립하면 행렬은 대칭이다. $\mathbf{x} = \mathbf{e}_j$, $\mathbf{y} = \mathbf{e}_i$를 넣으면 왼쪽은 $(S\mathbf{e}_j)\cdot\mathbf{e}_i = s_{ij}$, 오른쪽은 $\mathbf{e}_j\cdot(S\mathbf{e}_i) = s_{ji}$이기 때문이다. 그러므로 숫자 배치의 성질과 기하적 성질은 정확히 같은 것이다.

::scene b8-symmetric {}

그림에서 두 벡터를 끌어도 아래 두 값이 언제나 같다. "대칭 고정"을 끄고 $s_{21}$만 바꾸면 두 값이 갈라진다. 다음 노드에서 이 등식 한 줄이 대칭 행렬의 고유벡터를 서로 수직으로 만든다.`,
      checks: [
        {
          q: '다음 가운데 대칭 행렬이 아닌 것은?',
          choices: [String.raw`$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 5 & 0 \\ 0 & -2 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 3 \\ 3 & 1 \end{bmatrix}$`],
          answer: 0,
          explain: String.raw`첫째 행렬은 90° 회전이고 $s_{12} = -1 \ne s_{21} = 1$이다. 둘째는 대각선 $y = x$를 거울로 삼는 반사, 셋째는 축 방향 늘이기(와 뒤집기), 넷째는 $(1, 1)$ 방향을 4배 늘이고 $(1, -1)$ 방향을 뒤집으며 2배 늘이는 변환으로, 모두 대칭이다. 반사는 대칭이고 회전은 대칭이 아니라는 점을 기억해 두라.`,
        },
      ],
    },
    {
      id: 'prop.spectral',
      kind: 'prop',
      title: '스펙트럼 정리: S = QΛQᵀ',
      status: 'written',
      introduces: {
        terms: [{ id: 't.spectral', ko: '스펙트럼 정리', en: 'spectral theorem', gloss: '대칭 행렬은 고윳값이 모두 실수이고, 서로 수직인 단위 고유벡터로 이루어진 기저를 가진다: S = QΛQᵀ.' }],
        symbols: [
          { tex: String.raw`\Lambda`, meaning: '고윳값을 대각에 놓은 대각 행렬' },
          { tex: String.raw`\mathbf{q}_i`, meaning: '대칭 행렬의 i번째 단위 고유벡터 (Q의 i번째 열)' },
        ],
      },
      requires: ['def.symmetric', 'prop.diagonalization', 'prop.transpose-dot', 'prop.orthogonal-inverse'],
      predicts: [
        {
          id: 'p-orth',
          kind: 'choice',
          q: '대칭 행렬에서, 고윳값이 서로 다른 두 고유벡터 사이의 각은?',
          choices: ['언제나 90°', '행렬마다 다르다', '언제나 45°', '0° (같은 직선)'],
          answer: 0,
          why: [
            String.raw`아래 그림에서 행렬을 바꿔 확인하고, 증명은 이 노드의 끝에 있다. 앞 노드의 등식 $(S\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(S\mathbf{y})$ 한 줄이면 된다.`,
            String.raw`대칭이 **아닌** 행렬에서는 그렇다. 앞 노드의 예 $\begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$의 고유벡터 $(2, 1)$, $(1, 1)$은 수직이 아니다.`,
            String.raw`45°가 나오는 대칭 행렬은 없다. 그림에서 확인해 보라.`,
            String.raw`[서로 다른 고윳값의 고유벡터는 같은 직선 위에 있을 수 없다](n:prop.diagonalization).`,
          ],
        },
        {
          id: 'p-disc',
          kind: 'choice',
          q: String.raw`대칭 행렬 $\begin{bmatrix} s_{11} & s_{12} \\ s_{12} & s_{22} \end{bmatrix}$의 특성방정식의 판별식은 음수가 될 수 있을까?`,
          hints: [
            String.raw`대칭 행렬의 대각합은 $s_{11} + s_{22}$, 행렬식은 $s_{11}s_{22} - s_{12}^2$이다. 판별식 $(\operatorname{tr})^2 - 4\det$에 넣고 전개해 보라.`,
            String.raw`전개하면 $s_{11}^2 - 2s_{11}s_{22} + s_{22}^2 + 4s_{12}^2$이 된다. 앞의 세 항은 무엇의 제곱인가?`,
          ],
          choices: ['될 수 없다', '될 수 있다. 회전처럼', String.raw`$\det S < 0$이면 음수가 된다`, String.raw`$s_{12}$가 크면 음수가 된다`],
          answer: 0,
          why: [
            String.raw`판별식을 정리하면 $(s_{11} - s_{22})^2 + 4s_{12}^2$, 곧 제곱의 합이 된다. 증명의 1번이다.`,
            String.raw`회전은 대칭 행렬이 아니다(각이 0°, 180°일 때만 빼고). 대칭 행렬은 무언가를 돌리는 변환이 될 수 없다.`,
            String.raw`$\det S < 0$이면 판별식 $(\operatorname{tr}S)^2 - 4\det S$는 오히려 더 커진다.`,
            String.raw`$s_{12}$는 판별식에 $4s_{12}^2$로, 곧 0 이상의 값으로만 들어간다. 클수록 판별식이 커진다.`,
          ],
        },
      ],
      openWhys: [
        { q: 'n×n 대칭 행렬도 고윳값이 모두 실수이고, 서로 수직인 단위 고유벡터 n개를 언제나 가지는가? (일반적인 증명)', answeredBy: null },
      ],
      body: String.raw`[대칭 행렬](t:t.symmetric)의 고유벡터는 어떻게 생겼을까?

::predict p-orth

아래 그림은 대칭 행렬 $S$와 그 고유 방향(하늘, 연두)이다. "대칭 고정"을 켠 채로 성분을 바꿔 보면 두 고유 방향이 언제나 서로 수직이다. 고정을 끄고 대칭을 깨면 수직이 무너진다.

::scene b8-spectral {}

::predict p-disc

**명제(스펙트럼 정리, 2×2).** 2×2 대칭 행렬 $S$에 대해
1. 고윳값은 모두 실수다.
2. 서로 다른 고윳값의 고유벡터는 서로 [직교](t:t.orthogonal)한다.
3. 그러므로 서로 수직인 단위 고유벡터 $\mathbf{q}_1, \mathbf{q}_2$가 있다. 이 둘을 열로 세운 [직교 행렬](t:t.orth-matrix) $Q$와, 고윳값을 대각에 놓은 $\Lambda$로

$$S = Q\Lambda Q^{\mathsf{T}}, \qquad Q = \begin{bmatrix} | & | \\ \mathbf{q}_1 & \mathbf{q}_2 \\ | & | \end{bmatrix}, \quad \Lambda = \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix}$$

이것을 [스펙트럼 정리](def:t.spectral)라 한다. [대각화](t:t.diagonalize) $A = PDP^{-1}$과 같은 모양인데, 두 가지가 더 좋다. 대각화가 **언제나** 되고, 번역을 되돌리는 $P^{-1}$ 자리에 계산하기 쉬운 $Q^{\mathsf{T}}$가 온다. 기하로 읽으면 $S$는 "돌리고(또는 뒤집고) → 서로 수직인 두 축 방향으로 따로 늘이고 → 되돌려 돌리는" 변환이다.

### 두 개의 예
- $S = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$: 고윳값 3, 1, 단위 고유벡터 $\mathbf{q}_1 = (1, 1)/\sqrt{2}$, $\mathbf{q}_2 = (1, -1)/\sqrt{2}$. 내적은 $(1 - 1)/2 = 0$이다.
- $S = \begin{bmatrix} 1 & 2 \\ 2 & -2 \end{bmatrix}$: 대각합 $-1$, 행렬식 $-2 - 4 = -6$이므로 $\lambda^2 + \lambda - 6 = (\lambda - 2)(\lambda + 3) = 0$, 고윳값 2와 $-3$. 고유벡터는 $(2, 1)$과 $(1, -2)$이고 내적은 $2 - 2 = 0$이다. 고윳값 $-3$의 방향은 뒤집힌다.

### n차원에 대해 정직하게
같은 정리가 $n \times n$ 대칭 행렬에서도 성립한다. 아래 증명의 2번은 차원과 상관없이 그대로 통한다. 그러나 1번(고윳값이 실수)과 "서로 수직인 고유벡터가 $n$개 모두 있다"는 부분은, 이 교재가 다루지 않는 도구(복소수, 또는 수학적 귀납법과 최댓값 논증)가 있어야 증명된다. 이 교재 안에서는 $n \times n$의 경우를 증명 없이 받아들이고, 그 사실을 아래 "아직 여기서 답하지 않은 질문"에 남긴다.

> [!코드] 야코비 방법은 정리를 "만들어 보인다"
> 이 저장소의 \`symEig\`는 $n \times n$ 대칭 행렬에 대해 실제로 $Q$와 $\Lambda$를 계산한다. 대각선 밖의 성분 하나를 0으로 만드는 회전을 계속 곱해 나가는 방법(야코비 방법)이다. 회전들의 곱이 $Q$가 된다. 테스트는 무작위 2, 3, 5차원 대칭 행렬에서 $S = Q\Lambda Q^{\mathsf{T}}$와 $Q^{\mathsf{T}}Q = I$를 확인한다. 다만 이것은 정리의 증거이지 증명은 아니다. 이 방법이 언제나 끝까지 수렴한다는 사실 역시 이 교재 밖의 결과다.`,
      proof: String.raw`**1. 고윳값은 실수다.** $S = \begin{bmatrix} s_{11} & s_{12} \\ s_{12} & s_{22} \end{bmatrix}$의 [판별식](why:prop.char-poly)을 정리하면

$$(s_{11} + s_{22})^2 - 4(s_{11}s_{22} - s_{12}^2) = s_{11}^2 - 2s_{11}s_{22} + s_{22}^2 + 4s_{12}^2 = (s_{11} - s_{22})^2 + 4s_{12}^2$$

이다. [실수의 제곱은 0 이상이므로](why:prop.neg-times-neg) 판별식은 0 이상이고, 고윳값은 실수다.

**2. 서로 다른 고윳값의 고유벡터는 직교한다.** $S\mathbf{q}_1 = \lambda_1\mathbf{q}_1$, $S\mathbf{q}_2 = \lambda_2\mathbf{q}_2$, $\lambda_1 \ne \lambda_2$라 하자. [대칭 행렬은 어느 쪽에 걸어도 같으므로](why:def.symmetric)

$$\lambda_1(\mathbf{q}_1\cdot\mathbf{q}_2) = (S\mathbf{q}_1)\cdot\mathbf{q}_2 = \mathbf{q}_1\cdot(S\mathbf{q}_2) = \lambda_2(\mathbf{q}_1\cdot\mathbf{q}_2)$$

이다. 양쪽을 빼면 $(\lambda_1 - \lambda_2)(\mathbf{q}_1\cdot\mathbf{q}_2) = 0$이고, $\lambda_1 \ne \lambda_2$이므로 $\mathbf{q}_1\cdot\mathbf{q}_2 = 0$이다.

**3. 직교 행렬로 대각화된다.** 판별식이 0인 경우는 $(s_{11} - s_{22})^2 + 4s_{12}^2 = 0$, 곧 $s_{11} = s_{22}$이고 $s_{12} = 0$인 경우뿐이다. 이때 $S = s_{11}I$이므로 모든 벡터가 고유벡터이고, $\mathbf{q}_1 = \mathbf{e}_1$, $\mathbf{q}_2 = \mathbf{e}_2$로 고르면 된다. 판별식이 양수이면 고윳값이 서로 다르므로 2번에 따라 두 고유벡터가 직교한다. 각각을 길이 1로 맞춰([단위벡터](t:t.unit-vector)) $\mathbf{q}_1, \mathbf{q}_2$라 하자. 그러면 $Q$의 열은 [정규직교](t:t.orthonormal)이므로 [$Q^{-1} = Q^{\mathsf{T}}$](why:prop.orthogonal-inverse)이고, [대각화](why:prop.diagonalization)에서 $P = Q$로 놓으면 $S = Q\Lambda Q^{-1} = Q\Lambda Q^{\mathsf{T}}$다.`,
      checks: [
        {
          q: String.raw`$Q\Lambda Q^{\mathsf{T}}$ 꼴의 행렬(Q는 직교, Λ는 대각)은 언제나 대칭인가?`,
          choices: ['언제나 대칭이다', 'Q가 회전일 때만 대칭이다', 'Λ의 성분이 양수일 때만 대칭이다', '대칭일 수 없다'],
          answer: 0,
          explain: String.raw`$(Q\Lambda Q^{\mathsf{T}})^{\mathsf{T}} = (Q^{\mathsf{T}})^{\mathsf{T}}\Lambda^{\mathsf{T}}Q^{\mathsf{T}} = Q\Lambda Q^{\mathsf{T}}$이다(대각 행렬은 전치해도 같다). 그러므로 스펙트럼 정리는 양방향이다. 대칭 행렬은 정확히 "서로 수직인 축 방향으로 따로 늘이는 변환"이다.`,
        },
      ],
      code: ['symEig'],
    },
    {
      id: 'prop.sym-ellipse',
      kind: 'prop',
      title: '대칭 행렬은 단위원을 고유벡터 축의 타원으로 보낸다',
      status: 'written',
      introduces: { terms: [{ id: 't.ellipse', ko: '타원', en: 'ellipse', gloss: '원을 서로 수직인 두 방향으로 각각 다른 배율로 늘인 모양. 배율 하나가 0이면 선분으로 납작해진다.' }] },
      requires: ['prop.spectral', 'prop.orthogonal-preserves'],
      predicts: [
        {
          id: 'p-axis',
          kind: 'point',
          q: String.raw`$S = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이 단위원을 보낸 곡선에서 **가장 길게 늘어난 쪽**을 만드는 입력 방향을 노란 손잡이로 맞춰라.`,
          hints: [
            String.raw`[스펙트럼 정리](n:prop.spectral): 대칭 행렬은 서로 수직인 두 고유 방향을 따로 늘인다. 가장 많이 늘어나는 것은 어느 고윳값의 방향일까?`,
          ],
          A: [[2, 1], [1, 2]],
          target: 'v1',
          show: ['circle', 'tgrid'],
          reveal: String.raw`정답은 대각선 $(1, 1)$ 방향, 곧 가장 큰 고윳값 3의 고유벡터다. 가장 짧게 늘어나는 방향은 그와 수직인 $(1, -1)$, 고윳값 1의 고유벡터다. 흰 곡선(단위원의 상)의 두 축이 정확히 두 고유 방향 위에 놓인다.`,
        },
        {
          id: 'p-nonsym',
          kind: 'point',
          q: String.raw`이번에는 대칭이 **아닌** $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$이다. 고유 방향은 가로축 $(1, 0)$과 대각선 $(1, 1)$이다. 단위원 위에서 가장 많이 늘어나는 입력 방향을 노란 손잡이로 맞춰라.`,
          hints: [
            String.raw`대칭 행렬에서는 답이 고유 방향이었다. 이 행렬에서도 그런지 의심해 보라. 두 열 $(1, 0)$, $(2, 3)$ 가운데 어느 쪽이 더 긴가?`,
            String.raw`$\mathbf{e}_2$ 방향 입력은 길이 $\sqrt{13} \approx 3.6$인 둘째 열로 간다. 대각선 $(1, 1)/\sqrt{2}$은 $3/\sqrt{2}\cdot(1, 1)$, 길이 3으로 간다. 그 사이 어딘가를 찾아라.`,
          ],
          A: [[1, 2], [0, 3]],
          target: 'v1',
          show: ['cols', 'circle'],
          reveal: String.raw`정답은 약 80.8°, 곧 $(0.160, 0.987)$ 방향이다. 고유 방향 0°, 45° 어느 쪽과도 다르다. 그러므로 대칭이 아닌 행렬에서는 "가장 많이 늘어나는 방향"과 "자기 직선에 남는 방향"이 다른 것이다. 이 방향의 정체가 9장의 첫 주제다.`,
        },
      ],
      body: String.raw`[스펙트럼 정리](t:t.spectral)는 대칭 행렬을 "돌리고, 수직인 두 축 방향으로 늘이고, 되돌려 돌리는" 변환으로 읽게 해 준다. 그렇다면 대칭 행렬은 [단위원](t:t.unit-circle)을 무엇으로 보낼까?

::predict p-axis

### 이름 붙이기: 타원
원을 서로 수직인 두 방향으로 각각 다른 배율로 늘인 모양을 [타원](def:t.ellipse)이라 한다. 두 방향을 타원의 **축**, 각 방향으로 늘어난 길이를 **반지름**이라 부른다. 배율 하나가 0이면 타원은 선분으로 납작해지고, 두 배율이 같으면 원이다.

**명제.** 대칭 행렬 $S = Q\Lambda Q^{\mathsf{T}}$는 단위원을, 축이 $\mathbf{q}_1, \mathbf{q}_2$ 방향이고 반지름이 $|\lambda_1|, |\lambda_2|$인 타원으로 보낸다.

::scene b8-spectral {"probe": true}

그림에서 노란 탐침을 단위원 위에서 돌려 보라. 탐침이 하늘색 고유 방향에 오면 분홍 출력이 타원의 한 축 끝에 닿는다.

::predict p-nonsym

아래 그림은 대칭이 아닌 행렬 $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$이다. 흰 점선이 타원의 축이고, 하늘·연두 직선이 고유 방향이다. 둘이 어긋나 있다.

::scene b8-spectral {"S": [[1, 2], [0, 3]], "mirror": false, "axes": true}

그렇다면 대칭이 아닌 행렬에서 타원의 축은 어디서 오는가? 축을 만드는 입력 방향은 서로 수직인가? 이것이 9장의 첫 질문이다.`,
      proof: String.raw`$S\mathbf{x} = Q(\Lambda(Q^{\mathsf{T}}\mathbf{x}))$를 오른쪽부터 따라간다.

1. $Q^{\mathsf{T}}$는 직교 행렬이므로 [길이를 바꾸지 않는다](why:prop.orthogonal-preserves). 그래서 단위원 위의 점을 단위원 위의 점으로 보내고, 단위원 전체를 단위원 전체로 보낸다(되돌리는 $Q$도 단위원을 단위원으로 보내기 때문이다).
2. $\Lambda$는 가로 방향을 $\lambda_1$배, 세로 방향을 $\lambda_2$배 한다. 그래서 단위원을 축이 $\mathbf{e}_1, \mathbf{e}_2$이고 반지름이 $|\lambda_1|, |\lambda_2|$인 타원으로 보낸다. 배율이 음수이면 그 방향으로 뒤집히지만, 원은 원점에 대해 대칭이므로 상의 모양은 반지름 $|\lambda|$짜리와 같다. 이것이 [타원의 정의](t:t.ellipse) 그대로다.
3. $Q$는 $\mathbf{e}_1$을 $\mathbf{q}_1$로, $\mathbf{e}_2$를 $\mathbf{q}_2$로 보내면서 길이와 직각을 지킨다. 그래서 2의 타원을 축이 $\mathbf{q}_1, \mathbf{q}_2$인 같은 크기의 타원으로 옮긴다.`,
      checks: [
        {
          q: String.raw`$S = \begin{bmatrix} 3 & 0 \\ 0 & -1 \end{bmatrix}$은 단위원을 어떤 타원으로 보내는가?`,
          choices: ['가로 반지름 3, 세로 반지름 1인 타원', '가로 반지름 3, 세로로는 뒤집혀서 타원이 아니다', '가로 반지름 3인 선분', '반지름 3인 원'],
          answer: 0,
          explain: String.raw`세로 방향의 배율 $-1$은 뒤집기다. 그러나 원은 위아래가 대칭이므로 뒤집어도 모양이 같고, 반지름은 $|-1| = 1$이다. 뒤집힘은 모양이 아니라 "원 위의 어느 점이 어디로 가는지"에만 흔적을 남긴다. 9장에서 이 차이가 [특이값](fwd:t.singular-value)(언제나 0 이상)과 고윳값(음수일 수 있음)의 차이가 된다.`,
        },
      ],
    },
  ],
};
export default book;
