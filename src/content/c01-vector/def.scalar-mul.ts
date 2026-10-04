import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.scalar-mul',
  kind: 'def',
  title: '스칼라 곱: 늘이고, 줄이고, 뒤집기',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.scalar', ko: '스칼라', en: 'scalar', gloss: '벡터의 길이를 몇 배로 바꿀지 정하는 보통의 수.' },
      { id: 't.scalar-mul', ko: '스칼라 곱', en: 'scalar multiplication', gloss: '벡터의 모든 성분에 같은 수를 곱하는 것. 같은 직선 위에서 늘이고 줄이고 뒤집는다.' },
      { id: 't.line-origin', ko: '원점을 지나는 직선', en: 'line through the origin', gloss: '영벡터가 아닌 벡터 v의 스칼라 배 cv를 모두 모은 것. 이 교재는 좌표로 쓰는 직선을 이렇게 정의한다.' },
    ],
    symbols: [{ tex: 'c', meaning: '스칼라(보통의 수)' }],
  },
  requires: ['def.vector', 'prop.neg-times-neg'],
  predicts: [
    {
      id: 'p-neg',
      kind: 'point',
      q: String.raw`$\mathbf{v} = (2, -1)$이다. $-1.5\,\mathbf{v}$는 원점에서 출발해 어디에서 끝날까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`정의대로 성분마다 $-1.5$를 곱한다. 둘째 성분은 음수 × 음수다. [그 결과의 부호는 앞에서 정했다](n:prop.neg-times-neg).`,
        String.raw`첫째 성분은 $-1.5 \times 2 = -3$이다. 둘째 성분 $-1.5 \times (-1)$을 구하라.`,
      ],
      A: [[-1.5, 0], [0, -1.5]],
      x: [2, -1],
      target: 'Ax',
      reveal: String.raw`정답은 $(-3, 1.5)$다(초록 화살표 끝. 이름표 "Ax"는 2장의 표기다). $\mathbf{v}$는 오른쪽 아래를 가리키는데, $-1.5\,\mathbf{v}$는 왼쪽 위를 가리킨다. 같은 직선 위에서 **뒤집히면서** 1.5배 길어졌다. $(-3, -1.5)$에 놓았다면 둘째 성분에서 음수 × 음수 = 양수를 빠뜨린 것이다. 그 점은 $\mathbf{v}$의 직선 위에 있지 않다.`,
    },
    {
      id: 'p-line',
      kind: 'choice',
      q: String.raw`$\mathbf{v} \ne \mathbf{0}$을 고정하고, $c$를 **모든 수**로 바꿔 가며 $c\mathbf{v}$의 끝점을 모두 찍으면 무엇이 그려질까?`,
      hints: [String.raw`$c$가 양수일 때, 0일 때, 음수일 때를 따로 생각하라. 각각 끝점은 원점에서 어느 쪽에 있는가?`],
      choices: [String.raw`원점을 지나는 직선 하나 전체`, String.raw`원점에서 $\mathbf{v}$ 쪽으로만 뻗은 반직선`, String.raw`원점을 중심으로 하는 원`, String.raw`$\mathbf{v}$의 끝점 하나`],
      answer: 0,
      why: [
        String.raw`$c > 0$이면 $\mathbf{v}$ 쪽 절반, $c < 0$이면 반대쪽 절반, $c = 0$이면 원점이 찍힌다. 셋을 합치면 직선 전체다.`,
        String.raw`음수 $c$를 빠뜨렸다. $c < 0$이면 $c\mathbf{v}$는 뒤집혀서 반대쪽 절반을 채운다.`,
        String.raw`원은 크기는 그대로 두고 방향만 바꿀 때 생긴다. 스칼라 곱은 반대로, 방향의 직선은 그대로 두고 크기만 바꾼다.`,
        String.raw`$c = 1$일 때의 끝점일 뿐이다. $c$를 바꾸면 끝점이 움직인다.`,
      ],
    },
  ],
  body: String.raw`같은 이동을 두 번 하면 어떤 이동이 될까? 절반만 하면? 반대로 하면?

[벡터 덧셈은 성분끼리 더하는 것](why:prop.add-componentwise)이므로, 같은 이동 $\mathbf{v}$를 두 번 하면
$$\mathbf{v} + \mathbf{v} = \begin{bmatrix} v_1 + v_1 \\ v_2 + v_2 \end{bmatrix} = \begin{bmatrix} 2v_1 \\ 2v_2 \end{bmatrix}$$
이다. 성분마다 2를 곱한 것과 같다. 이 관찰을 2가 아닌 모든 수로 넓힌다.

**정의.** 벡터의 성분과 구별해서, 보통의 수 하나를 [스칼라](def:t.scalar)라 부른다. 스칼라는 이 교재에서 주로 $c$로 쓴다. 스칼라 $c$와 벡터 $\mathbf{v}$의 [스칼라 곱](def:t.scalar-mul) $c\mathbf{v}$는 $\mathbf{v}$의 모든 성분에 $c$를 곱한 벡터다.
$$\h{cv}{c\mathbf{v}} = c\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} cv_1 \\ cv_2 \end{bmatrix}$$

성분이 세 개 이상이어도 모든 성분에 같은 $c$를 곱한다. 계산 예: $3\cdot(1, -2) = (3, -6)$, $0.5\cdot(4, 2) = (2, 1)$.

::predict p-neg

답은 $(-3, 1.5)$다. 성분마다 곱하면 $(-1.5 \times 2,\ -1.5 \times (-1))$이고, 둘째 성분은 [음수 × 음수 = 양수](why:prop.neg-times-neg)이므로 $1.5$다. 같은 직선 위에서 화살표가 뒤집혔다. 그렇다면 $c$를 모든 수로 바꾸면 끝점은 어디를 지나갈까?

::predict p-line

답은 "원점을 지나는 직선 하나 전체"다.

### 그림으로 읽기: 늘이고, 줄이고, 뒤집기
아래 그림에서 $c$를 바꿔 보면 다음 네 경우가 보인다.

- $c > 1$: 같은 쪽으로 늘어난다. 예: $2\cdot(2, -1) = (4, -2)$.
- $0 < c < 1$: 같은 쪽으로 줄어든다. 예: $0.5\cdot(2, -1) = (1, -0.5)$.
- $c = 0$: 모든 성분이 0이 되므로 [영벡터](t:t.zero-vector)가 된다.
- $c < 0$: 반대쪽으로 뒤집히고, 길이는 $-c$배가 된다. 예: $-1\cdot(2, -1) = (-2, 1)$.

::scene c1-scale {"v": [2, -1], "c": -1.5, "line": false}

어느 경우든 화살표는 처음 화살표가 놓인 직선을 벗어나지 않는다. 이유는 이렇다. 가로 이동과 세로 이동이 **같은 수 $c$로** 곱해지므로, "가로로 한 칸 갈 때 세로로 얼마 가는가"라는 기울기가 바뀌지 않는다. 예를 들어 $(2, -1)$은 가로 2에 세로 −1이고, $(4, -2)$도 $(-3, 1.5)$도 가로 대 세로가 똑같이 $2 : -1$이다. $c$가 음수이면 두 성분의 부호가 함께 바뀌므로 같은 직선 위에서 반대쪽을 가리킨다. 그리고 화살표의 길이는 $c \ge 0$이면 $c$배, $c < 0$이면 $-c$배가 된다. $c \ge 0$이면 [피타고라스 정리](t:t.pythagoras)에 따라 새 길이는 $\sqrt{c^2v_1^2 + c^2v_2^2}$이다. 그런데 $c\sqrt{v_1^2 + v_2^2}$도 0 이상이고 제곱하면 $c^2v_1^2 + c^2v_2^2$이므로, [제곱근은 하나뿐](why:prop.neg-times-neg)이라는 사실에 따라 새 길이는 $c\sqrt{v_1^2 + v_2^2}$, 곧 처음 길이의 $c$배다. $c < 0$이면 $c^2 = (-c)^2$이고 $-c$가 0 이상이므로, 같은 계산에서 $c$ 대신 $-c$를 쓰면 된다.

::scene c1-scale {"v": [2, -1], "c": -3, "trail": true}

위 그림에서 막대를 끝에서 끝까지 밀면 흰 점이 직선을 채워 간다. $c$의 범위가 막대 끝(−3에서 3)에서 멈출 뿐, 실제로는 $c$가 커질수록 끝없이 뻗는다.

### 원점을 지나는 직선의 정의
위의 기울기 이야기가 보인 것은 $c\mathbf{v}$가 처음 직선을 **벗어나지 않는다**는 것뿐이다. 거꾸로, 그 직선 위의 **모든** 점이 어떤 $c$에 대한 $c\mathbf{v}$라는 것은 보이지 않았다. 게다가 좌표로 "직선"이 무엇인지는 앞에서 정한 적이 없다. 그래서 이 교재는 이 모임 자체를 정의로 삼는다.

**정의.** 영벡터가 아닌 벡터 $\mathbf{v}$의 스칼라 배를 모두 모은 것, 곧 $c$가 모든 수를 돌 때의 $c\mathbf{v}$ 전체를 $\mathbf{v}$ 방향의 [원점을 지나는 직선](def:t.line-origin)이라 한다.

기울기 이야기는 이 정의가 우리가 보통 그리는 곧은 선과 맞는다고 믿을 근거다. 다만 그림은 증명이 아니라 [경험](n:ax.arith)이다. 가로 성분이 0인 세로 벡터 $(0, v_2)$에서는 "가로로 한 칸 갈 때"를 말할 수 없어서 기울기 이야기가 통하지 않는다. 그래도 정의는 그대로 통한다. $(0, v_2)$의 스칼라 배 $(0, cv_2)$를 모두 모으면 세로축 전체다.

이 직선은 앞으로 여러 번 나온다. $\mathbf{v} = \mathbf{0}$이면 $c\mathbf{0} = \mathbf{0}$이므로 직선이 아니라 원점 한 점만 남는다. 그래서 정의에서 영벡터를 뺐다.

### 두 번 뒤집으면 제자리
$(-1)\big((-1)\mathbf{v}\big)$의 첫째 성분은 $(-1)\cdot\big((-1)\cdot v_1\big) = v_1$이다([음수 × 음수 = 양수](why:prop.neg-times-neg)). 둘째 성분도 같다. 그러므로 두 번 뒤집은 화살표는 처음 화살표와 같다. $(-1)\mathbf{v}$를 줄여서 $-\mathbf{v}$로 쓴다. $-\mathbf{v}$는 $\mathbf{v}$와 크기가 같고 반대쪽을 가리키며, $\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$이다.

### 뺄셈
$\mathbf{w} - \mathbf{u}$는 $\mathbf{w} + (-\mathbf{u})$로 정한다. 성분으로는 $(w_1 - u_1,\ w_2 - u_2)$다. 그림으로는 **$\mathbf{u}$의 머리에서 $\mathbf{w}$의 머리로 가는 화살표**다. 두 벡터를 원점에서 그렸을 때 $\mathbf{u} + (\mathbf{w} - \mathbf{u}) = \mathbf{w}$이기 때문이다. 예: $\mathbf{u} = (1, 1)$, $\mathbf{w} = (3, 2)$이면 $\mathbf{w} - \mathbf{u} = (2, 1)$이고, 실제로 점 $(1, 1)$에서 점 $(3, 2)$로 가는 이동이다. [두 점에서 벡터를 읽는 법(도착점 − 출발점)](n:def.vector)이 바로 이 뺄셈이었다.`,
  checks: [
    {
      q: String.raw`$-2\cdot(-1, 3)$은?`,
      choices: [String.raw`$(2, -6)$`, String.raw`$(-2, -6)$`, String.raw`$(-3, 1)$`, String.raw`$(2, 6)$`],
      answer: 0,
      explain: String.raw`성분마다 $-2$를 곱한다: $(-2)\cdot(-1) = 2$, $(-2)\cdot 3 = -6$. $(-2, -6)$은 첫째 성분에서 음수 × 음수를 음수로 계산한 것이다. $(-3, 1)$은 곱하지 않고 더했다. $(2, 6)$은 둘째 성분의 부호를 놓쳤다. 정답 $(2, -6)$은 $(-1, 3)$과 반대쪽을 가리키고 두 배 길다.`,
    },
    {
      q: String.raw`$\mathbf{v} \ne \mathbf{0}$인데 $c\mathbf{v} = \mathbf{0}$이다. $c$는?`,
      choices: ['0', '1', '−1', '어떤 수든 될 수 있다'],
      answer: 0,
      explain: String.raw`$\mathbf{v}$의 성분 가운데 0이 아닌 것이 있다. 그 성분에 $c$를 곱한 것이 0이 되려면, [곱이 0이면 한쪽은 0](why:prop.arith-first)이고 그 성분은 0이 아니므로 $c = 0$이어야 한다. $c = -1$이면 $-\mathbf{v}$가 되어 반대쪽을 가리킬 뿐 영벡터가 되지 않는다.`,
    },
  ],
  code: ['scale'],
};

export default node;
