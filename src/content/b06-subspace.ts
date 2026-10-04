import type { Book } from './schema';

// 6장 — 부분공간과 랭크. 변환이 무엇을 살리고(열공간, 랭크) 무엇을 지우는가(영공간).
const book: Book = {
  id: 'b6',
  num: 6,
  title: '부분공간과 랭크',
  subtitle: '무엇이 살아남고 무엇이 사라지는가',
  nodes: [
    {
      id: 'def.subspace',
      kind: 'def',
      title: '부분공간',
      status: 'written',
      introduces: { terms: [{ id: 't.subspace', ko: '부분공간', en: 'subspace', gloss: '덧셈과 스칼라 곱을 해도 밖으로 나가지 않는 벡터들의 모임. 원점을 지나는 직선·평면 같은 것.' }] },
      requires: ['def.span', 'def.dimension'],
      predicts: [
        {
          id: 'p-offset',
          kind: 'choice',
          q: String.raw`원점을 지나지 않는 직선, 예를 들어 $y = x + 1$ 위의 벡터들의 모임은 부분공간일까?`,
          hints: [String.raw`아래 정의의 둘째 조건에 $c = 0$을 넣어 보라. 직선 위의 아무 벡터를 0배 하면 어디로 가는가?`],
          choices: ['아니다. 0배 하면 원점으로 가는데, 원점이 직선 위에 없다', '그렇다. 곧은 직선이므로', '그렇다. 직선 위의 두 점 사이도 직선 위에 있으므로', '방향에 따라 다르다'],
          answer: 0,
          why: [
            String.raw`$0\cdot\mathbf{v} = \mathbf{0}$인데 원점 $(0, 0)$은 $y = x + 1$ 위에 없다($0 \ne 1$). 덧셈으로도 깨진다: $(0, 1) + (1, 2) = (1, 3)$은 $3 \ne 2$라 직선 밖이다.`,
            String.raw`곧다는 것만으로는 부족하다. 원점을 지나야 한다.`,
            String.raw`두 점 **사이**(평균)는 직선 위에 있지만, 두 점을 **더한** 것은 밖으로 나간다.`,
            String.raw`원점을 지나지 않으면 어느 방향이든 부분공간이 아니다.`,
          ],
        },
        {
          id: 'p-union',
          kind: 'choice',
          q: '가로축과 세로축을 합친 모임(두 직선 위의 벡터 전부)은 부분공간일까?',
          hints: [String.raw`가로축 위의 $(1, 0)$과 세로축 위의 $(0, 1)$을 더해 보라. 결과는 두 축 가운데 하나 위에 있는가?`],
          choices: ['아니다. 서로 다른 축의 벡터를 더하면 밖으로 나간다', '그렇다. 원점을 지나는 직선 둘이므로', '그렇다. 두 축이 평면 전체를 스팬하므로', '그렇다. 스칼라 곱을 해도 축 위에 남으므로'],
          answer: 0,
          why: [
            String.raw`$(1, 0) + (0, 1) = (1, 1)$은 어느 축 위에도 없다. 덧셈 조건이 깨진다.`,
            String.raw`직선 하나하나는 부분공간이지만, 둘을 **합친 것**은 아니다.`,
            String.raw`두 축이 **스팬하는** 것은 평면 전체(부분공간)지만, 두 축 **자체**는 평면이 아니다. 스팬과 모임을 혼동했다.`,
            String.raw`스칼라 곱 조건은 지키지만 덧셈 조건이 깨진다. 두 조건이 모두 필요하다. 거의 맞는 답이다.`,
          ],
        },
      ],
      body: String.raw`[스팬](t:t.span)은 언제나 "원점을 지나는 직선, 평면, …" 같은 모양이었다. 이런 모양들에 공통인 성질은 무엇일까?

**정의.** 벡터들의 모임 $V$가 다음 두 조건을 만족하면 [부분공간](def:t.subspace)이라 한다(비어 있지 않을 때).
1. $V$ 안의 두 벡터를 더해도 $V$ 안에 있다.
2. $V$ 안의 벡터에 아무 [스칼라](t:t.scalar)를 곱해도 $V$ 안에 있다.

둘째 조건에 $c = 0$을 넣으면, **부분공간은 언제나 영벡터를 품는다.** 평면의 부분공간은 원점 하나, 원점을 지나는 직선, 평면 전체, 이 세 종류뿐이다.

::scene b6-subspace {}

"원점에서 띄우기" 막대로 직선을 원점에서 떼어 보라. 두 벡터의 합(흰 화살표)이 직선 밖으로 나가 빨간 점이 된다.

::predict p-offset

### 스팬은 언제나 부분공간이다
$\mathbf{u}, \mathbf{w}$의 선형 결합 두 개를 더하면 $(c_1\mathbf{u} + c_2\mathbf{w}) + (d_1\mathbf{u} + d_2\mathbf{w}) = (c_1 + d_1)\mathbf{u} + (c_2 + d_2)\mathbf{w}$로 다시 선형 결합이다([여덟 규칙](why:prop.vector-rules)). 스칼라를 곱해도 마찬가지다. 그래서 스팬은 부분공간이다. 거꾸로 평면의 부분공간은 모두 무언가의 스팬이다(원점은 영벡터의 스팬, 직선은 그 방향 벡터 하나의 스팬, 평면은 기저 둘의 스팬). 부분공간의 [차원](t:t.dimension)은 그 기저의 벡터 개수다.

::predict p-union`,
      checks: [
        {
          q: String.raw`3차원 공간에서 $\{(x, y, z) : x + y + z = 0\}$은 부분공간인가? 그렇다면 차원은?`,
          choices: ['부분공간, 차원 2 (원점을 지나는 평면)', '부분공간이 아니다', '부분공간, 차원 3', '부분공간, 차원 1'],
          answer: 0,
          explain: String.raw`조건을 만족하는 두 벡터를 더하거나 스칼라를 곱해도 성분의 합은 0으로 남는다(분배법칙). 원점도 만족한다. 조건 하나가 자유도 하나를 없애므로 원점을 지나는 평면이다. 기저로 $(1, -1, 0)$, $(0, 1, -1)$을 고를 수 있다. 만약 오른쪽이 0이 아니라 1이라면 원점이 빠져서 부분공간이 아니다.`,
        },
      ],
    },
    {
      id: 'def.column-space',
      kind: 'def',
      title: '열공간: 출력이 닿을 수 있는 곳 전부',
      status: 'written',
      introduces: {
        terms: [{ id: 't.column-space', ko: '열공간', en: 'column space', gloss: '행렬의 열들이 스팬하는 부분공간. 곧 A𝐱가 될 수 있는 모든 벡터.' }],
        symbols: [{ tex: 'C(A)', meaning: '행렬 A의 열공간' }],
      },
      requires: ['def.subspace', 'def.matvec'],
      predicts: [
        {
          id: 'p-reach',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$일 때 $A\mathbf{x} = (3, 5)$를 만족하는 $\mathbf{x}$는?`,
          hints: [
            String.raw`출력 $A\mathbf{x}$는 언제나 두 열 $(1, 2)$, $(2, 4)$의 선형 결합이다. 두 열은 같은 직선 위에 있다. 그 직선은 무엇인가?`,
            String.raw`$(1, 2)$의 몇 배를 해도 둘째 성분은 첫째 성분의 2배다. $(3, 5)$는 그런가?`,
          ],
          choices: ['없다. (3, 5)는 출력이 닿을 수 있는 직선 밖에 있다', '하나 있다', '무수히 많다', '(1, 1)'],
          answer: 0,
          why: [
            String.raw`모든 출력은 $(1, 2)$ 방향의 직선 $y = 2x$ 위에 있다. $(3, 5)$는 $5 \ne 6$이라 그 위에 없다. 열공간 밖의 목표에는 닿을 수 없다.`,
            String.raw`두 열이 평면을 펼친다면 그랬을 것이다. 이 행렬은 평면을 직선으로 누른다.`,
            String.raw`목표가 직선 **위에** 있었다면(예: $(3, 6)$) 무수히 많았을 것이다.`,
            String.raw`$A(1, 1) = (3, 6)$이다. $(3, 5)$가 아니다.`,
          ],
        },
      ],
      body: String.raw`변환 $A$의 출력은 어디까지 닿을 수 있을까? 출력이 닿지 못하는 곳이 있다면, 그곳을 목표로 하는 [연립방정식](t:t.linear-system)은 풀리지 않는다.

**정의.** 행렬 $A$의 열들이 스팬하는 부분공간을 $A$의 [열공간](def:t.column-space)이라 하고 $C(A)$로 쓴다. [출력은 언제나 열들의 선형 결합](why:def.matvec)이고, 거꾸로 열들의 선형 결합은 모두 어떤 입력의 출력이므로, 열공간은 **$A$의 출력 전체**와 같다.

$$C(A) = \{A\mathbf{x} : \mathbf{x}\text{는 아무 입력}\}$$

그래서 다음이 바로 따라 나온다. **$A\mathbf{x} = \mathbf{b}$에 해가 있는 것은 $\mathbf{b}$가 열공간 안에 있는 것과 같다.**

::scene b6-space {"mode": "col"}

3차원 그림에서 단추로 열을 바꿔 보라(단추 이름의 "[랭크](fwd:t.rank)"는 다음 노드에서 정의한다). 열 세 개가 공간 전체를 펼칠 때, 한 평면 위에 있을 때, 한 직선 위에 있을 때 열공간(분홍)이 각각 공간, 평면, 직선이 된다.

::predict p-reach

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 열공간은 $(1, 2)$ 방향의 직선이다.
- $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$(3×2): 열공간은 $(1, 0, 1)$과 $(0, 1, 1)$이 펼치는 3차원 안의 평면이다. 출력은 3차원에 살지만 그 평면을 벗어나지 못한다.`,
      checks: [
        {
          q: String.raw`2×2 행렬 $A$의 $\det A \ne 0$이다. 열공간은?`,
          choices: ['평면 전체', '원점을 지나는 직선', '원점 하나', '행렬마다 다르다'],
          answer: 0,
          explain: String.raw`[행렬식이 0이 아니면 두 열은 독립](n:prop.det-zero)이고, 독립인 두 벡터는 평면 전체를 스팬한다. 그래서 모든 $\mathbf{b}$에 해가 있다.`,
        },
      ],
    },
    {
      id: 'def.rank',
      kind: 'def',
      title: '랭크: 출력 공간의 차원',
      status: 'written',
      introduces: {
        terms: [{ id: 't.rank', ko: '랭크', en: 'rank', gloss: '열공간의 차원. 변환이 살려 두는 독립 방향의 개수.' }],
        symbols: [{ tex: String.raw`\operatorname{rank} A`, meaning: '행렬 A의 랭크' }],
      },
      requires: ['def.column-space'],
      predicts: [
        {
          id: 'p-r3',
          kind: 'choice',
          q: String.raw`3×3 행렬의 세 열이 $(1, 0, 0)$, $(0, 1, 0)$, $(1, 1, 0)$이다. 랭크는?`,
          hints: [String.raw`셋째 열은 앞의 두 열로 만들 수 있는가? 그렇다면 [새 방향을 보태지 못한다](n:def.independence).`],
          choices: ['2', '3', '1', '0'],
          answer: 0,
          why: [
            String.raw`셋째 열 = 첫째 + 둘째이므로 열공간은 앞의 두 열이 펼치는 평면(바닥, $z = 0$)이다. 차원 2.`,
            String.raw`열이 셋이라고 랭크가 3인 것은 아니다. 독립인 방향의 수를 센다.`,
            String.raw`첫째와 둘째 열은 같은 직선 위에 있지 않다.`,
            String.raw`0은 모든 열이 영벡터일 때뿐이다.`,
          ],
        },
        {
          id: 'p-max',
          kind: 'choice',
          q: '3×5 행렬(행 3개, 열 5개)의 랭크가 될 수 있는 가장 큰 값은?',
          hints: [String.raw`열은 5개이지만, 열 하나하나는 성분이 몇 개인 벡터인가? 그 공간 안에서 독립인 벡터는 최대 몇 개인가?`],
          choices: ['3', '5', '15', '8'],
          answer: 0,
          why: [
            String.raw`열 5개는 모두 $\mathbb{R}^3$의 벡터이고, $\mathbb{R}^3$에서 독립인 벡터는 최대 3개다([차원](n:def.dimension)). 그래서 랭크는 $\min(\text{행}, \text{열}) = 3$을 넘지 못한다.`,
            String.raw`열의 개수만 보았다. 열이 사는 공간의 차원(행의 수)도 한계를 준다.`,
            String.raw`성분의 개수는 랭크와 관계없다.`,
            String.raw`행과 열의 수를 더할 이유가 없다.`,
          ],
        },
      ],
      body: String.raw`[열공간](t:t.column-space)이 직선인지, 평면인지, 공간 전체인지를 수 하나로 말하고 싶다.

**정의.** 열공간의 [차원](t:t.dimension)을 행렬의 [랭크](def:t.rank)라 하고 $\operatorname{rank} A$로 쓴다. 곧 열들 가운데 서로 독립인 것의 최대 개수다. 기하적으로는 "변환이 출력 쪽에 살려 두는 방향의 수"다.

::scene b6-space {"mode": "col"}

::predict p-r3

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 랭크 1. 평면이 직선으로 눌린다.
- 2×2 회전: 랭크 2. 아무것도 눌리지 않는다.

::predict p-max

> [!직관] 9장으로 가는 길
> 랭크 1인 행렬은 모든 출력을 직선 하나로 모은다. 9장에서 모든 행렬을 "랭크 1 행렬들의 합"으로 쪼개고, 그 가운데 중요한 몇 개만 남겨 행렬을 압축한다. 10장의 [LoRA](fwd:t.lora)는 처음부터 랭크가 낮은 행렬만 배운다. 랭크는 "이 변환에 실제로 들어 있는 정보의 차원"이다.`,
      checks: [
        {
          q: '랭크가 1인 3×3 행렬은 3차원 공간을 어떻게 보이게 하는가?',
          choices: ['공간 전체를 원점을 지나는 직선 하나로 누른다', '공간을 평면 하나로 누른다', '공간 전체를 원점 하나로 누른다', '공간을 그대로 두고 돌리기만 한다'],
          answer: 0,
          explain: String.raw`열공간의 차원이 1이므로 모든 출력이 한 직선 위에 있다. 평면으로 누르는 것은 랭크 2, 점으로 누르는 것은 랭크 0(영행렬)이다.`,
        },
      ],
      code: ['rank'],
    },
    {
      id: 'def.null-space',
      kind: 'def',
      title: '영공간: 0으로 사라지는 입력들',
      status: 'written',
      introduces: {
        terms: [{ id: 't.null-space', ko: '영공간', en: 'null space', gloss: 'A𝐱 = 𝟎 이 되는 입력 𝐱 전체. 변환이 지워 버리는 방향들.' }],
        symbols: [{ tex: 'N(A)', meaning: '행렬 A의 영공간' }],
      },
      requires: ['def.subspace', 'def.matvec'],
      predicts: [
        {
          id: 'p-null',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$이 원점으로 보내는 입력들은 어떤 모양을 이룰까?`,
          hints: [String.raw`$A\mathbf{x} = \mathbf{0}$은 $x_1 + 2x_2 = 0$과 $2x_1 + 4x_2 = 0$이다. 둘째 식은 첫째 식의 2배다. $x_1 + 2x_2 = 0$을 만족하는 점들은?`],
          choices: [String.raw`원점을 지나는 $(-2, 1)$ 방향의 직선`, '원점 하나', String.raw`$(1, 2)$ 방향의 직선`, '평면 전체'],
          answer: 0,
          why: [
            String.raw`$x_1 = -2x_2$이므로 $(-2, 1)$의 배수들이다. 이 직선이 통째로 원점으로 사라진다.`,
            String.raw`원점만 0으로 가는 것은 행렬식이 0이 아닐 때다. 이 행렬은 평면을 눌러 버린다.`,
            String.raw`$(1, 2)$ 방향은 열공간(출력 쪽)이다. 영공간은 입력 쪽의 방향이다.`,
            String.raw`$A(1, 0) = (1, 2) \ne \mathbf{0}$이다.`,
          ],
        },
        {
          id: 'p-all',
          kind: 'choice',
          q: String.raw`$A\mathbf{x} = \mathbf{b}$의 해 하나 $\mathbf{x}_0$을 찾았다. 그렇다면 해들은 모두 어떤 꼴일까?`,
          hints: [String.raw`다른 해 $\mathbf{x}$가 있다면 $A(\mathbf{x} - \mathbf{x}_0) = A\mathbf{x} - A\mathbf{x}_0 = ?$`],
          choices: [String.raw`$\mathbf{x}_0 + (\text{영공간의 벡터})$`, String.raw`$\mathbf{x}_0$의 스칼라 배`, String.raw`$\mathbf{x}_0$ 하나뿐`, String.raw`$\mathbf{x}_0 + (\text{열공간의 벡터})$`],
          answer: 0,
          why: [
            String.raw`$A(\mathbf{x} - \mathbf{x}_0) = \mathbf{b} - \mathbf{b} = \mathbf{0}$이므로 차이는 영공간에 있다. 거꾸로 영공간의 벡터를 더해도 여전히 해다. 해 전체는 영공간을 $\mathbf{x}_0$만큼 옮긴 모양이다.`,
            String.raw`$2\mathbf{x}_0$을 넣으면 $2\mathbf{b}$가 된다. $\mathbf{b} \ne \mathbf{0}$이면 해가 아니다.`,
            String.raw`영공간이 원점뿐일 때만 그렇다.`,
            String.raw`열공간은 출력 쪽이다. 해(입력)에 더할 수 있는 것은 입력 쪽의 영공간이다. 거의 맞는 답이다.`,
          ],
        },
      ],
      body: String.raw`변환은 어떤 입력들을 흔적도 없이 지워 버릴까? 지워지는 입력이 많을수록 출력만 보고 입력을 되찾기 어렵다.

**정의.** $A\mathbf{x} = \mathbf{0}$인 입력 $\mathbf{x}$ 전체를 $A$의 [영공간](def:t.null-space)이라 하고 $N(A)$로 쓴다.

영공간은 언제나 부분공간이다. $A\mathbf{x} = \mathbf{0}$, $A\mathbf{y} = \mathbf{0}$이면 [선형이므로](why:def.linear-map) $A(\mathbf{x} + \mathbf{y}) = \mathbf{0}$, $A(c\mathbf{x}) = \mathbf{0}$이기 때문이다.

::scene b6-space {"mode": "null"}

연두색이 영공간이다. "▶ I에서 A로"를 누르면 연두 직선(또는 평면)이 원점으로 납작하게 사라진다.

::predict p-null

### 영공간이 원점뿐이면
영공간이 원점 하나뿐이면, 서로 다른 입력은 서로 다른 출력으로 간다. $A\mathbf{x} = A\mathbf{y}$이면 $A(\mathbf{x} - \mathbf{y}) = \mathbf{0}$이므로 $\mathbf{x} - \mathbf{y} = \mathbf{0}$이기 때문이다. 정사각 행렬에서는 이것이 [가역](t:t.invertible)과 같은 말이다.

::predict p-all

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 영공간은 $(-2, 1)$ 방향의 직선.
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$(2×3): $x_1 + 2x_3 = 0$, $x_2 - x_3 = 0$이므로 $(-2, 1, 1)$의 배수들, 곧 3차원 안의 직선 하나다.`,
      checks: [
        {
          q: '영공간과 열공간은 각각 어느 공간에 사는가? (A가 m×n)',
          choices: [String.raw`영공간은 입력 공간 $\mathbb{R}^n$, 열공간은 출력 공간 $\mathbb{R}^m$`, '둘 다 입력 공간', '둘 다 출력 공간', String.raw`영공간은 $\mathbb{R}^m$, 열공간은 $\mathbb{R}^n$`],
          answer: 0,
          explain: String.raw`영공간은 "원점으로 가는 **입력**"이므로 입력 공간에, 열공간은 "닿을 수 있는 **출력**"이므로 출력 공간에 산다. 정사각이 아니면 둘은 차원조차 다른 공간에 있다.`,
        },
      ],
      code: ['nullBasis'],
    },
    {
      id: 'prop.rank-nullity',
      kind: 'prop',
      title: '차원 세기: n = rank A + dim N(A)',
      status: 'written',
      introduces: { terms: [{ id: 't.rank-nullity', ko: '랭크–영공간 차원 정리', en: 'rank–nullity theorem', gloss: '입력 차원 = 살아남는 차원(랭크) + 사라지는 차원(영공간의 차원).' }] },
      requires: ['def.rank', 'def.null-space'],
      predicts: [
        {
          id: 'p-count',
          kind: 'choice',
          q: '3×5 행렬의 랭크가 2이다. 영공간의 차원은?',
          hints: [String.raw`입력 공간은 몇 차원인가? (입력 성분의 수 = 열의 수) 그 방향들은 "살아남는 것"과 "사라지는 것"으로 나뉜다.`],
          choices: ['3', '1', '2', '0'],
          answer: 0,
          why: [
            String.raw`입력 차원 5 = 랭크 2 + 영공간 3.`,
            String.raw`출력 차원(행의 수 3)에서 뺐다. 이 정리는 **입력** 차원을 나눈다.`,
            String.raw`랭크와 영공간의 차원이 같을 이유는 없다.`,
            String.raw`열이 5개인데 독립인 방향은 2개뿐이므로, 사라지는 방향이 반드시 있다.`,
          ],
        },
        {
          id: 'p-geom',
          kind: 'choice',
          q: '랭크가 1인 3×3 행렬은 입력 공간을 어떻게 다룰까?',
          hints: [String.raw`입력 차원 3 = 랭크 1 + 영공간의 차원. 영공간은 몇 차원이고, 3차원 공간 안의 그런 부분공간은 무슨 모양인가?`],
          choices: ['평면 하나(영공간)를 통째로 지우고, 나머지 한 방향만 직선 위로 살린다', '직선 하나를 지우고 평면을 살린다', '아무것도 지우지 않는다', '공간 전체를 지운다'],
          answer: 0,
          why: [
            String.raw`영공간의 차원은 $3 - 1 = 2$, 곧 평면이다. 그 평면 위의 입력은 모두 원점으로 간다. 출력은 직선 하나(열공간) 위에 모인다.`,
            String.raw`그것은 랭크 2일 때다.`,
            String.raw`랭크가 3보다 작으면 무언가 지워진다.`,
            String.raw`그것은 랭크 0(영행렬)일 때다.`,
          ],
        },
      ],
      openWhys: [{ q: '소거의 피벗 열들이 열공간의 기저가 된다는 것(그래서 랭크 = 피벗의 개수)의 완전한 증명은?', answeredBy: null }],
      body: String.raw`입력 공간의 방향들은 [변환](t:t.transformation)을 지나면서 살아남거나 사라진다. 살아남는 것과 사라지는 것의 개수 사이에 정확한 관계가 있을까?

::predict p-count

**명제([랭크–영공간 차원 정리](def:t.rank-nullity)).** $A$가 $m \times n$ 행렬이면

$$n = \operatorname{rank}A + \dim N(A)$$

이다. 입력 차원 = 살아남는 차원 + 사라지는 차원.

::scene b6-space {"mode": "both"}

랭크 단추를 바꿔 가며 읽기 칸의 차원 세기를 보라. 랭크가 하나 줄 때마다 영공간이 하나 커진다.

::predict p-geom

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 입력 2차원 = 랭크 1(직선) + 영공간 1(직선).
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$: 입력 3차원 = 랭크 2(평면 전체가 출력) + 영공간 1(직선 $(-2, 1, 1)$ 방향).

> [!코드] 세는 방법은 소거다
> \`rank\`와 \`nullBasis\`는 [가우스 소거](t:t.elimination)로 계단 모양을 만든 뒤 피벗(계단의 첫 0 아닌 수)이 있는 열과 없는 열을 센다. 테스트는 여러 행렬에서 $\operatorname{rank} + \dim N = n$을 확인한다.`,
      proof: String.raw`[가우스 소거](why:prop.elimination)로 $A$를 계단 모양 $R$로 바꾼다. 행 연산은 [해를 바꾸지 않으므로](why:prop.elimination) $A\mathbf{x} = \mathbf{0}$과 $R\mathbf{x} = \mathbf{0}$은 같은 해, 곧 같은 영공간을 가진다. $R$의 열 $n$개는 피벗이 있는 열(피벗 열)과 없는 열(자유 열)로 나뉜다. 그 개수를 각각 $p$, $f$라 하면 $p + f = n$이다.

**영공간의 차원 = f.** 자유 열의 변수는 아무 값이나 고를 수 있고, 그 값을 정하면 피벗 열의 변수는 계단을 거슬러 올라가며 하나로 정해진다. 자유 변수 하나만 1, 나머지 자유 변수는 0으로 둔 해를 자유 열마다 하나씩 만들면, 이 $f$개의 해는 독립이고(각각 자기 자유 자리에만 1이 있으므로) 모든 해가 그 선형 결합이다. 그러므로 $\dim N(A) = f$다.

**랭크 = p.** 피벗 열에 해당하는 $A$의 원래 열들이 열공간의 기저가 된다는 것은 이렇게 본다. 자유 열은 위의 해에 따라 피벗 열들의 선형 결합으로 적히므로 새 방향을 보태지 않는다. 그리고 피벗 열들끼리는, 자유 변수를 모두 0으로 두면 $A\mathbf{x} = \mathbf{0}$의 해가 $\mathbf{0}$뿐이므로 독립이다. 그러므로 $\operatorname{rank}A = p$다. (이 문단은 개요다. 완전한 증명은 아래 열린 질문에 남긴다.)

따라서 $n = p + f = \operatorname{rank}A + \dim N(A)$다.`,
      code: ['rref', 'rank', 'nullBasis'],
    },
    {
      id: 'prop.row-null-perp',
      kind: 'prop',
      title: '행공간과 영공간은 직교한다',
      status: 'written',
      introduces: { terms: [{ id: 't.row-space', ko: '행공간', en: 'row space', gloss: '행렬의 행들이 스팬하는 부분공간. Aᵀ의 열공간. 입력 공간에 산다.' }] },
      requires: ['prop.row-picture', 'def.null-space', 'def.orthogonal'],
      predicts: [
        {
          id: 'p-perp',
          kind: 'choice',
          q: String.raw`2×3 행렬의 두 행이 $(1, 2, 2)$와 $(0, 1, -1)$이다. 영공간은?`,
          hints: [
            String.raw`$A\mathbf{x} = \mathbf{0}$을 [행의 관점](n:prop.row-picture)으로 읽으면 "두 행과의 내적이 모두 0"이다. $x_1 + 2x_2 + 2x_3 = 0$과 $x_2 - x_3 = 0$.`,
            String.raw`둘째 식에서 $x_2 = x_3 = t$로 두고 첫째 식에 넣어라.`,
          ],
          choices: [String.raw`$(-4, 1, 1)$ 방향의 직선`, String.raw`$(1, 2, 2)$ 방향의 직선`, String.raw`$(1, 3, 1)$ 방향(두 행의 합)`, '원점 하나'],
          answer: 0,
          why: [
            String.raw`$x_1 = -2t - 2t = -4t$이므로 $(-4, 1, 1)$의 배수. 확인: $(1, 2, 2)\cdot(-4, 1, 1) = 0$, $(0, 1, -1)\cdot(-4, 1, 1) = 0$. 두 행 **모두와** 수직인 방향이다.`,
            String.raw`그것은 행 자체다. 영공간은 행들과 **수직인** 방향이다.`,
            String.raw`두 행의 합은 행공간 안의 벡터다. 영공간과는 수직이다.`,
            String.raw`입력이 3차원이고 랭크가 2이므로, [영공간은 1차원](n:prop.rank-nullity)이다.`,
          ],
        },
      ],
      body: String.raw`[영공간](t:t.null-space)은 "$A\mathbf{x} = \mathbf{0}$인 입력"으로 정의했다. 이 식을 [행의 관점](why:prop.row-picture)으로 읽으면 무엇이 보일까?

**정의.** 행렬의 행들이 스팬하는 부분공간을 [행공간](def:t.row-space)이라 한다. 행은 입력과 내적하는 벡터이므로 행공간은 **입력 공간**에 산다. 행공간은 $A^{\mathsf{T}}$의 열공간이기도 하다.

**명제.** 행공간의 모든 벡터와 영공간의 모든 벡터는 서로 [직교](t:t.orthogonal)한다.

::scene b6-space {"mode": "row"}

하늘색이 행공간, 연두색이 영공간이다. 그림을 돌려 보면 둘이 서로 수직으로 만난다.

::predict p-perp

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 행공간은 $(1, 2)$ 방향, 영공간은 $(-2, 1)$ 방향. 내적 $-2 + 2 = 0$.
- 위 관문: 행공간은 $(1, 2, 2)$와 $(0, 1, -1)$이 펼치는 평면, 영공간은 그 평면에 수직인 직선 $(-4, 1, 1)$.`,
      proof: String.raw`$\mathbf{x}$가 영공간에 있다는 것은 $A\mathbf{x} = \mathbf{0}$, 곧 [모든 성분이 0](why:prop.row-picture)이라는 것이다: 모든 $i$에 대해 ($i$번째 행)$\cdot\mathbf{x} = 0$. 그러므로 $\mathbf{x}$는 행 하나하나와 직교한다. 행공간의 아무 벡터 $\mathbf{r} = c_1(\text{1행}) + c_2(\text{2행}) + \cdots$와의 내적은 [내적이 덧셈 위로 나뉘므로](why:def.dot) $c_1\cdot0 + c_2\cdot0 + \cdots = 0$이다.`,
    },
    {
      id: 'exp.four-subspaces',
      kind: 'exp',
      title: '네 기본 부분공간 지도',
      status: 'written',
      introduces: { terms: [{ id: 't.left-null', ko: '왼쪽 영공간', en: 'left null space', surfaces: ['좌영공간'], gloss: 'Aᵀ의 영공간. 줄여서 좌영공간. 열공간과 직교하는, 출력 공간에서 닿을 수 없는 방향들.' }] },
      requires: ['prop.rank-nullity', 'prop.row-null-perp', 'def.transpose'],
      predicts: [
        {
          id: 'p-split',
          kind: 'choice',
          q: String.raw`입력 $\mathbf{x}$를 행공간 조각 $\mathbf{x}_r$과 영공간 조각 $\mathbf{x}_n$의 합으로 나누었다. $A\mathbf{x}$는?`,
          hints: [String.raw`[선형이므로](n:def.linear-map) $A\mathbf{x} = A\mathbf{x}_r + A\mathbf{x}_n$이다. $A\mathbf{x}_n$은?`],
          choices: [String.raw`$A\mathbf{x}_r$`, String.raw`$A\mathbf{x}_n$`, String.raw`$\mathbf{0}$`, String.raw`$\mathbf{x}_r + \mathbf{x}_n$`],
          answer: 0,
          why: [
            String.raw`$A\mathbf{x}_n = \mathbf{0}$이므로 출력은 행공간 조각만으로 정해진다. 영공간 쪽은 출력에 아무 흔적도 남기지 않는다.`,
            String.raw`영공간의 조각은 원점으로 사라진다. 거꾸로다.`,
            String.raw`$\mathbf{x}$가 영공간에 있을 때만 그렇다.`,
            String.raw`그것은 $\mathbf{x}$ 자신이다. 변환을 하지 않았다.`,
          ],
        },
        {
          id: 'p-dims',
          kind: 'choice',
          q: '랭크 1인 2×2 행렬의 네 공간(행공간, 영공간, 열공간, 좌영공간)의 차원은 차례로?',
          hints: [String.raw`입력 2 = 행공간 + 영공간, 출력 2 = 열공간 + 좌영공간. 행공간과 열공간의 차원은 둘 다 랭크다(아래).`],
          choices: ['1, 1, 1, 1', '1, 1, 2, 0', '2, 0, 1, 1', '1, 2, 1, 2'],
          answer: 0,
          why: [
            String.raw`네 공간이 모두 직선이다. 입력 평면은 행공간 직선과 영공간 직선으로, 출력 평면은 열공간 직선과 좌영공간 직선으로 나뉜다.`,
            String.raw`랭크가 1이면 열공간은 직선(1차원)이다.`,
            String.raw`행공간의 차원도 랭크(1)다.`,
            String.raw`입력 평면은 2차원뿐이라 1 + 2가 될 수 없다.`,
          ],
        },
      ],
      openWhys: [],
      body: String.raw`지금까지 본 공간들을 한 장의 지도로 모으자. 모든 행렬 $A$($m \times n$)에는 네 개의 기본 부분공간이 있다.

- **입력 공간 $\mathbb{R}^n$**: [행공간](t:t.row-space)(살아남는 방향, 차원 = 랭크)과 [영공간](t:t.null-space)(사라지는 방향, 차원 = $n$ − 랭크). [둘은 서로 직교한다](why:prop.row-null-perp).
- **출력 공간 $\mathbb{R}^m$**: [열공간](t:t.column-space)(닿을 수 있는 곳, 차원 = 랭크)과 [왼쪽 영공간](def:t.left-null)(닿을 수 없는 방향, 차원 = $m$ − 랭크). 이 교재에서는 이 뒤로 이 공간을 줄여서 **좌영공간**이라 적는다. 좌영공간은 $A^{\mathsf{T}}$의 영공간이고, 열공간과 직교한다($A^{\mathsf{T}}$에 같은 명제를 쓰면 된다).

::scene b6-four {}

왼쪽은 입력 평면, 오른쪽은 출력 평면이다. 노란 $\mathbf{x}$를 끌면 왼쪽에서 행공간 조각과 영공간 조각으로 나뉘고, 오른쪽의 출력은 행공간 조각만으로 정해진다.

::predict p-split

### 행공간의 차원도 랭크다
열공간의 차원을 랭크라 불렀는데, 행공간의 차원도 똑같이 랭크다. [가우스 소거](t:t.elimination)로 보면 이렇다. 행 연산은 행들을 서로 섞고 되돌릴 수 있으므로 행공간을 바꾸지 않는다. 소거가 끝난 계단 모양에서 0이 아닌 행의 수는 피벗의 수 $p$이고, 그 행들은 계단 모양 때문에 서로 독립이다. 그러므로 행공간의 차원은 $p$이고, [p는 랭크와 같았다](n:prop.rank-nullity). 따라서

$$\dim(\text{행공간}) = \dim(\text{열공간}) = \operatorname{rank}A$$

이고, 입력 공간에서 $\dim(\text{행공간}) + \dim N(A) = n$이다. 행공간과 영공간은 직교하고 차원의 합이 $n$이므로, 입력 공간의 모든 벡터는 "행공간 조각 + 영공간 조각"으로 하나뿐인 방식으로 나뉜다.

::predict p-dims

### 이 지도에 아직 없는 것
이 지도는 각 공간이 몇 차원인지는 말해 주지만, 각 공간을 펼치는 **좋은 기저**, 그리고 행공간의 방향 하나하나가 열공간의 어느 방향으로 얼마나 늘어나 가는지는 말해 주지 않는다. 9장의 [특이값 분해](fwd:t.svd)가 이 지도에 좌표를 그려 넣는다.`,
      checks: [
        {
          q: '4×3 행렬의 랭크가 3이다. 영공간과 좌영공간의 차원은?',
          choices: ['0과 1', '1과 0', '0과 0', '1과 1'],
          answer: 0,
          explain: String.raw`입력 3 − 랭크 3 = 0(영공간은 원점뿐, 서로 다른 입력은 서로 다른 출력). 출력 4 − 랭크 3 = 1(출력 공간에 닿지 못하는 방향이 하나 남는다). 그래서 $A\mathbf{x} = \mathbf{b}$는 해가 없거나 하나다.`,
        },
      ],
    },
  ],
};
export default book;
