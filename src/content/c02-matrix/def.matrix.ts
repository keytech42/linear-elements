import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.matrix',
  kind: 'def',
  title: '행렬: 기저의 도착지를 열로 나란히',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.matrix', ko: '행렬', en: 'matrix', gloss: '선형 변환이 각 표준 기저 벡터를 보내는 자리를 열로 나란히 적은 표.' },
      { id: 't.column', ko: '열', en: 'column', gloss: '행렬의 세로 줄. j번째 열 = 𝐞ⱼ의 도착지.' },
      { id: 't.row', ko: '행', en: 'row', gloss: '행렬의 가로 줄.' },
    ],
    symbols: [
      { tex: 'A', meaning: '이름 없는 행렬' },
      { tex: 'B', meaning: '이름 없는 둘째 행렬' },
      { tex: 'a_{ij}', meaning: '행렬 A의 i행 j열 성분' },
      { tex: String.raw`\mathbf{a}_j`, meaning: '행렬 A의 j번째 열' },
    ],
  },
  requires: ['prop.basis-determines'],
  predicts: [
    {
      id: 'p-count',
      kind: 'choice',
      q: String.raw`평면의 [선형 변환](t:t.linear-map) 하나를 빠짐없이 전하려면 숫자가 최소 몇 개 필요할까?`,
      hints: [
        String.raw`[기저의 도착지만 알면 모든 벡터의 도착지가 정해진다](n:prop.basis-determines). 평면의 표준 기저는 몇 개이고, 도착지 하나는 숫자 몇 개인가?`,
      ],
      choices: ['2개', '4개', '평면의 점마다 2개씩, 끝없이 많이', '변환마다 다르다'],
      answer: 1,
      why: [
        String.raw`$\mathbf{e}_1$의 도착지(숫자 2개)만 보내면 $\mathbf{e}_2$가 어디로 가는지 알 수 없다. 예를 들어 아무것도 하지 않는 변환과 위쪽을 옆으로 미는 변환은 둘 다 $\mathbf{e}_1$을 제자리에 둔다.`,
        String.raw`기저 두 개의 도착지, 곧 벡터 2개 × 성분 2개면 충분하다. 나머지 모든 벡터의 도착지는 계산으로 정해진다. 아래가 그 이유다.`,
        String.raw`아무 변환이라면 맞는 말이다. 그러나 선형 변환은 선형 결합을 그대로 유지하므로, 기저 두 개의 도착지만 알면 나머지는 모두 계산된다.`,
        String.raw`평면의 선형 변환이라면 어떤 것이든 4개면 된다. 변환마다 다른 것은 그 네 숫자의 값뿐이다.`,
      ],
    },
    {
      id: 'p-read',
      kind: 'point',
      q: String.raw`행렬 $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$이 나타내는 변환은 $\mathbf{e}_1$을 어디로 보낼까? 분홍 점을 그 자리에 끌어 놓아라.`,
      A: [[0, -1], [1, 0]],
      x: [1, 0],
      target: 'Ax',
      reveal: String.raw`정답은 첫째 **열** $(0, 1)$이다. 열은 위에서 아래로 읽는다. $(0, -1)$에 놓았다면 첫째 **행**을 읽은 것이다. 행과 열을 헷갈리는 것이 가장 흔한 실수이므로, 아래의 읽는 법을 천천히 따라가 보라.`,
    },
  ],
  body: String.raw`선형 변환 하나를 다른 사람에게 정확히 전하려면, 최소한 무엇을 적어 보내면 될까?

::predict p-count

답은 네 개다. 그리고 그 이유는 이미 나와 있다. [선형 변환이 표준 기저 벡터를 어디로 보내는지만 알면 나머지 모든 벡터의 도착지가 정해진다](why:prop.basis-determines). 그러니 평면의 [선형 변환](t:t.linear-map) $T$를 전하려면 $T(\mathbf{e}_1)$과 $T(\mathbf{e}_2)$, 곧 도착지 두 개만 적어 보내면 된다. 도착지 하나는 [성분](t:t.component) 두 개짜리 [벡터](t:t.vector)이므로, 적어 보낼 숫자는 모두 네 개다.

이 네 숫자를 적는 방법을 하나로 정해 두자. $T(\mathbf{e}_1)$을 세로로 세워 왼쪽 줄에, $T(\mathbf{e}_2)$를 세로로 세워 오른쪽 줄에 둔다.

$$A = \begin{bmatrix} \h{a11}{\ca{a_{11}}} & \h{a12}{\cb{a_{12}}} \\ \h{a21}{\ca{a_{21}}} & \h{a22}{\cb{a_{22}}} \end{bmatrix}, \qquad \h{col1}{\ca{\mathbf{a}_1}} = T(\mathbf{e}_1) = \begin{bmatrix} \ca{a_{11}} \\ \ca{a_{21}} \end{bmatrix}, \quad \h{col2}{\cb{\mathbf{a}_2}} = T(\mathbf{e}_2) = \begin{bmatrix} \cb{a_{12}} \\ \cb{a_{22}} \end{bmatrix}$$

**정의.** 선형 변환 $T$가 표준 기저 벡터 $\mathbf{e}_1$, $\mathbf{e}_2$를 보내는 자리를 차례로 세로로 세워 나란히 적은 숫자 표를 $T$의 [행렬](def:t.matrix)이라 한다. 행렬의 세로 줄을 [열](def:t.column), 가로 줄을 [행](def:t.row)이라 부른다. $i$번째 행과 $j$번째 열이 만나는 자리의 성분을 $a_{ij}$로 쓰고(앞 첨자가 행, 뒤 첨자가 열), $j$번째 열 전체를 벡터 하나로 보아 $\mathbf{a}_j$로 쓴다.

::scene transform-grid {"A": [[1, 1], [0, 1]]}

위 그림에서 주황 화살표가 $\ca{\mathbf{a}_1}$, 곧 $\mathbf{e}_1$의 도착지이고, 청록 화살표가 $\cb{\mathbf{a}_2}$, 곧 $\mathbf{e}_2$의 도착지다. 행렬의 칸에 마우스를 올리면 그 칸이 속한 열의 화살표가 빛난다. 화살표 끝을 끌면 행렬의 숫자가 따라 바뀐다. 행렬과 그림은 같은 정보를 두 가지로 적은 것이기 때문이다.

::predict p-read

### 행렬을 읽는 법: 열 하나 = 화살표 하나
행렬을 보면 숫자 네 개가 아니라 **화살표 두 개**를 읽는다.

- $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$ — 첫째 열 $(2, 0)$: $\mathbf{e}_1$이 가로 방향으로 두 배가 된다. 둘째 열 $(0, 3)$: $\mathbf{e}_2$가 세로 방향으로 세 배가 된다. 평면이 가로로 2배, 세로로 3배 늘어난다.
- $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ — 첫째 열 $(0, 1)$: $\mathbf{e}_1$이 위쪽을 가리키게 된다. 둘째 열 $(-1, 0)$: $\mathbf{e}_2$가 왼쪽을 가리키게 된다. 두 화살표가 함께 시계 반대 방향으로 90° 돌았다. 평면 전체가 90° 돈다.
- $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ — 첫째 열 $(1, 0)$: $\mathbf{e}_1$은 제자리다. 둘째 열 $(1, 1)$: $\mathbf{e}_2$만 오른쪽으로 한 칸 밀렸다. 바닥은 그대로 두고 위쪽을 옆으로 미는 변환이다(위 그림의 처음 상태).

세 예 모두 같은 순서로 읽었다. 1열을 보고 $\mathbf{e}_1$이 간 곳을, 2열을 보고 $\mathbf{e}_2$가 간 곳을 그린 뒤, 격자가 그 두 화살표를 따라간다고 상상한다.

> [!질문] 왜 가로(행)가 아니라 세로(열)로 적는가?
> 이것은 [규약](t:t.convention)이다. 증명할 수 있는 사실이 아니다. 다만 이 규약에는 이유가 있다. 첫째, 이 교재에서는 [벡터를 처음부터 세로로 적었다](n:def.vector). 그래서 도착지 벡터를 그대로 세워 끼우면 행렬의 열이 된다. 둘째, 이렇게 정하면 다음 노드의 [행렬-벡터 곱](fwd:t.matvec)이 "열들을 섞는다"는 한 문장으로 읽히고, 행렬끼리의 곱도 열 단위로 읽힌다. 도착지를 가로로 적는 규약을 택해도 수학은 똑같이 성립하지만, 그때는 모든 공식에서 행과 열이 뒤바뀐 모양이 된다(그 뒤바꿈 자체는 3장의 [전치](fwd:t.transpose)가 된다).

> [!주의] 행렬의 행에도 뜻이 있다
> 이 노드에서는 열만 읽었다. 행렬의 행은 3장에서 [내적](fwd:t.dot)과 함께 다른 뜻을 얻는다. 열을 읽는 눈과 행을 읽는 눈을 둘 다 갖는 것이 이 교재의 목표 중 하나다.`,
  checks: [
    {
      q: String.raw`행렬 $\begin{bmatrix} 2 & -1 \\ 1 & 0 \end{bmatrix}$이 나타내는 변환은 $\mathbf{e}_1$을 어디로 보내는가?`,
      choices: [String.raw`$(2, 1)$`, String.raw`$(2, -1)$`, String.raw`$(-1, 0)$`, String.raw`$(1, 0)$`],
      answer: 0,
      explain: String.raw`$\mathbf{e}_1$의 도착지는 **첫째 열**이다. 위에서 아래로 읽으면 $(2, 1)$이다. $(2, -1)$은 첫째 **행**을 읽은 것이다. 행과 열을 헷갈리는 것이 가장 흔한 실수다.`,
    },
    {
      q: String.raw`어떤 선형 변환이 $\mathbf{e}_1$을 $(3, 1)$로, $\mathbf{e}_2$를 $(-1, 2)$로 보낸다. 이 변환의 행렬은?`,
      choices: [
        String.raw`$\begin{bmatrix} 3 & -1 \\ 1 & 2 \end{bmatrix}$`,
        String.raw`$\begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}$`,
        String.raw`$\begin{bmatrix} -1 & 3 \\ 2 & 1 \end{bmatrix}$`,
      ],
      answer: 0,
      explain: String.raw`도착지를 **세로로** 세워 1열, 2열에 차례로 놓는다. 둘째 선택지는 도착지를 가로로 적은 것(행과 열이 뒤바뀐 것)이고, 셋째 선택지는 열의 순서가 바뀐 것이다. 열의 순서가 바뀌면 $\mathbf{e}_1$과 $\mathbf{e}_2$의 역할이 바뀌므로 다른 변환이 된다.`,
    },
  ],
  code: ['col', 'fromCols'],
};

export default node;
