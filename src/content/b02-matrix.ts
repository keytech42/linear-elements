import type { Book } from './schema';

// 2권 — 선형 변환과 행렬 (뼈대; 본문은 곧 채운다)
const book: Book = {
  id: 'b2',
  num: 2,
  title: '선형 변환과 행렬',
  subtitle: '공간을 움직이는 규칙, 그 규칙을 적는 표',
  nodes: [
    {
      id: 'def.transformation',
      kind: 'def',
      title: '변환: 벡터를 받아 벡터를 내놓는 규칙',
      status: 'written',
      introduces: {
        terms: [{ id: 't.transformation', ko: '변환', en: 'transformation', gloss: '벡터 하나를 받으면 벡터 하나를 정해서 내놓는 규칙(함수).' }],
        symbols: [{ tex: 'T', meaning: '변환' }],
      },
      requires: ['def.vector'],
      predicts: [
        {
          id: 'p-free',
          kind: 'choice',
          q: String.raw`어떤 변환이 $(1, 0)$을 $(2, 1)$로, $(2, 0)$을 $(3, 5)$로 보낸다는 것만 알려져 있다. $(3, 0)$은 어디로 갈까?`,
          hints: [String.raw`$(3, 0)$은 $(1, 0) + (2, 0)$이기도 하고 $(1, 0)$의 3배이기도 하다. 그런데 "더한 것의 도착지 = 도착지끼리 더한 것"이라는 보장이 어디에 있었는가?`],
          choices: ['이것만으로는 알 수 없다', '(4, 9): 같은 간격으로 이어진다', '(6, 3): (1, 0)의 도착지를 3배 한 것', '(5, 6): 두 도착지를 더한 것'],
          answer: 0,
          why: [
            String.raw`변환은 입력마다 출력을 **하나** 정하기만 하면 된다. 다른 입력의 출력에 대해서는 아무것도 보장하지 않는다.`,
            String.raw`"같은 간격으로 이어진다"는 것은 직선을 직선으로, 간격을 고르게 보내는 특별한 변환의 성질이다. 일반 변환에는 그런 보장이 없다.`,
            String.raw`3배를 그대로 통과시키는 것도 특별한 변환의 성질이다. 게다가 이 변환은 그 성질조차 없다: $(2, 0)$의 도착지 $(3, 5)$가 $(1, 0)$의 도착지의 2배 $(4, 2)$가 아니다.`,
            String.raw`덧셈을 그대로 통과시킨다면 맞는 추론이다. 그러나 그것은 다음 노드에서 정의할 특별한 변환의 성질이다.`,
          ],
        },
        {
          id: 'p-transl',
          kind: 'choice',
          q: String.raw`평면의 모든 점을 오른쪽으로 1칸 옮기는 변환을 했다. 점 $P$에서 점 $Q$로 가는 화살표(변위)는 어떻게 될까?`,
          hints: [String.raw`$P$와 $Q$가 **둘 다** 오른쪽으로 1칸 움직인다. 두 점 사이의 [변위](n:def.numberline)는 "$Q$의 좌표 − $P$의 좌표"다.`],
          choices: ['그대로다. 두 점이 함께 옮겨지므로', '오른쪽으로 1칸 길어진다', '오른쪽으로 1칸 옮겨진 같은 모양의 화살표가 되므로, 다른 벡터가 된다', '점의 위치에 따라 다르다'],
          answer: 0,
          why: [
            String.raw`$(Q + (1, 0)) - (P + (1, 0)) = Q - P$. 두 점이 같이 움직이면 그 사이의 이동은 변하지 않는다.`,
            String.raw`시작점과 끝점이 똑같이 움직이므로 길이도 방향도 그대로다.`,
            String.raw`[벡터는 시작점과 상관없는 이동이었다](n:def.vector). 같은 모양의 화살표를 옆으로 옮긴 것은 **같은 벡터**다. 거의 맞는 그림에서 결론만 미끄러졌다.`,
            String.raw`어디에 있든 두 점이 똑같이 1칸 움직인다.`,
          ],
        },
      ],
      body: String.raw`1권까지는 벡터를 "이동 하나"로 다뤘다. 이제 한 단계 올라간다. 평면의 **모든** 벡터를 한꺼번에 움직이는 규칙을 생각한다.

**정의.** 벡터 하나를 받으면 벡터 하나를 정해서 내놓는 규칙을 [변환](def:t.transformation)이라 하고, 이름을 $T$로 쓴다. 입력 $\mathbf{v}$에 대한 출력은 $T(\mathbf{v})$로 쓴다. 규칙은 모든 입력에 대해 출력을 **정확히 하나** 정해야 한다.

변환을 보는 눈은 두 가지다. 하나는 **점 하나씩** 보는 눈이다. 입력을 넣으면 출력이 나온다. 다른 하나는 **평면 전체**를 보는 눈이다. 모든 점이 동시에 움직이고, 그 결과 격자 전체가 새 모양으로 바뀐다. 이 교재는 주로 둘째 눈을 쓴다.

::scene b2-warp {}

그림 오른쪽의 단추로 변환을 바꿔 보라. 각 변환의 규칙은 이렇다.
- **평행 이동**: $(x, y) \mapsto (x + 1,\ y + 0.5)$. 모든 점을 같은 만큼 옮긴다.
- **휘기**: $(x, y) \mapsto (x,\ y + x^2/4)$. 세로선은 곧게 남지만 가로선은 휜다.
- **소용돌이**: 원점에서 멀수록 더 많이 돌린다.
- 나머지 하나: 다음 노드들에서 다룰 특별한 변환이다. 단추에 붙은 이름의 뜻은 곧 [행렬](fwd:t.matrix)과 [행렬 곱](fwd:t.matmul)에서 밝혀진다.

### 변환은 아무것도 보장하지 않는다
변환의 정의는 "입력마다 출력이 하나"뿐이다. 그래서 몇 점의 도착지를 알아도 다른 점의 도착지는 알 수 없다.

::predict p-free

이 막막함이 다음 노드의 출발점이다. 몇 점의 도착지만으로 나머지를 모두 알 수 있게 해 주는 변환, 곧 [선형 변환](fwd:t.linear-map)을 정의할 것이다.

### 점이 움직이는 것과 화살표가 움직이는 것
::predict p-transl

평행 이동은 모든 **점**을 옮기지만, 두 점 사이의 **이동**(벡터)은 바꾸지 않는다. 그런데 이 교재에서 벡터는 원점에서 시작하는 화살표로도 그린다. 원점에서 시작하는 화살표의 끝점 $\mathbf{v}$를 평행 이동하면 $\mathbf{v} + (1, 0.5)$가 되고, 원점 자신도 $(1, 0.5)$로 옮겨진다. 끝점만 보면 벡터가 바뀐 것처럼 보이지만, 시작점과 끝점이 함께 옮겨졌으므로 이동 자체는 그대로다. 앞으로는 변환을 "원점에서 시작하는 화살표의 끝점을 어디로 보내는가"로 읽는다. 그렇게 읽으면 평행 이동은 원점을 원점에 두지 않는 변환이 되고, 다음 노드에서 보듯 이것이 평행 이동이 [선형 변환](fwd:t.linear-map)에서 빠지는 이유가 된다.`,
      checks: [
        {
          q: String.raw`$T(x, y) = (y, x)$는 $(2, -1)$을 어디로 보내는가?`,
          choices: ['(−1, 2)', '(2, −1)', '(1, −2)', '(−2, 1)'],
          answer: 0,
          explain: String.raw`규칙대로 두 성분의 자리를 바꾼다. 기하로는 대각선 $y = x$를 거울로 삼아 비친 것이다.`,
        },
      ],
    },
    {
      id: 'def.linear-map',
      kind: 'def',
      title: '선형 변환: 덧셈과 스칼라 곱을 지키는 변환',
      status: 'written',
      introduces: { terms: [{ id: 't.linear-map', ko: '선형 변환', en: 'linear transformation', surfaces: ['선형 사상', '선형사상'], gloss: 'T(𝐮 + 𝐰) = T(𝐮) + T(𝐰), T(c𝐯) = cT(𝐯)를 지키는 변환. 선형 결합을 그대로 통과시킨다.' }] },
      requires: ['def.transformation', 'def.linear-combination'],
      predicts: [
        {
          id: 'p-origin',
          kind: 'choice',
          q: '선형 변환은 원점(영벡터)을 어디로 보낼까?',
          hints: [String.raw`영벡터는 아무 벡터의 0배다: $\mathbf{0} = 0\cdot\mathbf{v}$. 둘째 조건 $T(c\mathbf{v}) = cT(\mathbf{v})$에 $c = 0$을 넣어 보라.`],
          choices: ['언제나 원점으로', '변환마다 정해진 어느 점으로든', '원점을 지나는 어떤 직선 위의 점으로', '정의만으로는 알 수 없다'],
          answer: 0,
          why: [
            String.raw`$T(\mathbf{0}) = T(0\cdot\mathbf{v}) = 0\cdot T(\mathbf{v}) = \mathbf{0}$.`,
            String.raw`평행 이동처럼 원점을 다른 곳으로 보내는 변환은 선형이 아니다. 둘째 조건이 그것을 막는다.`,
            String.raw`원점의 도착지는 점 하나로 정해진다. 그 점은 원점이다.`,
            String.raw`두 조건만으로 알 수 있다. 영벡터를 "아무 벡터의 0배"로 보는 것이 열쇠다.`,
          ],
        },
        {
          id: 'p-which',
          kind: 'choice',
          q: String.raw`다음 네 변환 가운데 선형 변환을 모두 고르면? (가) $(x, y) \mapsto (2x,\ x + y)$ (나) $(x, y) \mapsto (x + 1,\ y)$ (다) $(x, y) \mapsto (x^2,\ y)$ (라) $(x, y) \mapsto (|x|,\ y)$`,
          hints: [
            String.raw`먼저 원점을 넣어 보라. 원점이 움직이면 그 변환은 바로 탈락이다.`,
            String.raw`남은 후보에 $c = -1$과 $c = 2$를 넣어 $T(c\mathbf{v}) = cT(\mathbf{v})$를 확인해 보라. 예를 들어 $\mathbf{v} = (1, 0)$.`,
          ],
          choices: ['(가)만', '(가)와 (라)', '(가)와 (나)', '(가), (나), (라)'],
          answer: 0,
          why: [
            String.raw`(나)는 원점을 $(1, 0)$으로 보낸다. (다)는 $T(2\mathbf{e}_1) = (4, 0) \ne 2T(\mathbf{e}_1) = (2, 0)$. (라)는 $T(-\mathbf{e}_1) = (1, 0) \ne -T(\mathbf{e}_1) = (-1, 0)$. (가)만 남는다.`,
            String.raw`(라)는 원점을 지키고 양수 배도 통과시키지만, $c = -1$에서 깨진다: $T(-1, 0) = (1, 0)$인데 $-T(1, 0) = (-1, 0)$이다. 거의 맞는 답이다.`,
            String.raw`(나)는 원점을 $(1, 0)$으로 보낸다. 선형 변환은 원점을 원점으로 보내야 한다.`,
            String.raw`(나)는 원점이 움직이고, (라)는 음수 배에서 깨진다.`,
          ],
        },
      ],
      body: String.raw`[앞 노드](n:def.transformation)에서 본 것처럼, 일반 변환은 몇 점의 도착지만으로는 다른 점을 예측할 수 없다. 어떤 변환이어야 적은 정보로 전체를 알 수 있을까?

**정의.** 변환 $T$가 모든 벡터 $\mathbf{u}, \mathbf{w}, \mathbf{v}$와 모든 [스칼라](t:t.scalar) $c$에 대해

$$T(\mathbf{u} + \mathbf{w}) = T(\mathbf{u}) + T(\mathbf{w}), \qquad T(c\mathbf{v}) = cT(\mathbf{v})$$

를 지키면 $T$를 [선형 변환](def:t.linear-map)이라 한다. 첫째 조건은 "더한 다음 보내나, 보낸 다음 더하나 같다", 둘째 조건은 "늘인 다음 보내나, 보낸 다음 늘이나 같다"는 뜻이다.

두 조건을 합치면 한 문장이 된다. **선형 변환은 [선형 결합](t:t.linear-combination)을 그대로 통과시킨다.**

$$T(c_1\mathbf{u} + c_2\mathbf{w}) = c_1T(\mathbf{u}) + c_2T(\mathbf{w})$$

첫째 조건으로 덧셈을 밖으로 꺼내고, 둘째 조건으로 각 항의 스칼라를 밖으로 꺼내면 된다. 거꾸로 이 한 줄이 성립하면 $c_1 = c_2 = 1$로 첫째 조건이, $c_2 = 0$으로 둘째 조건이 나온다. 그러므로 두 조건과 이 한 줄은 같은 말이다.

::predict p-origin

그러므로 **선형 변환은 원점을 움직이지 않는다.** 평행 이동은 원점을 옮기므로 선형이 아니다.

### 시험해 보기
아래 그림에서 하늘색 $\mathbf{u}$와 라일락색 $\mathbf{w}$를 끌어 보라. 노란 점은 "먼저 보내고 더한 것" $T(\mathbf{u}) + T(\mathbf{w})$이고, 흰 점은 "먼저 더하고 보낸 것" $T(\mathbf{u} + \mathbf{w})$다. 두 점이 **어떻게 끌어도** 겹치는 변환만 선형이다. 겹치지 않으면 빨간 선이 그 어긋남을 보인다.

::scene b2-additive {}

::predict p-which

### 두 개의 예
- $(x, y) \mapsto (2x,\ x + y)$: $\mathbf{u} = (u_1, u_2)$, $\mathbf{w} = (w_1, w_2)$라 하면 $T(\mathbf{u} + \mathbf{w}) = (2u_1 + 2w_1,\ u_1 + w_1 + u_2 + w_2)$이다. 이것은 $T(\mathbf{u}) + T(\mathbf{w}) = (2u_1, u_1 + u_2) + (2w_1, w_1 + w_2)$와 [분배법칙](t:t.distributive)과 [교환·결합법칙](t:t.commutative)만으로 같아진다. 스칼라 곱도 같은 방식으로 확인된다. 선형이다.
- $(x, y) \mapsto (x^2,\ y)$: $T(2\mathbf{e}_1) = (4, 0)$이지만 $2T(\mathbf{e}_1) = (2, 0)$이다. 둘째 조건이 깨지므로 선형이 아니다. 조건이 깨지는 예 하나만 보이면 충분하다.`,
      checks: [
        {
          q: String.raw`$T$가 선형이고 $T(\mathbf{e}_1) = (1, 2)$, $T(\mathbf{e}_2) = (3, 0)$이다. $T(2, -1)$은?`,
          choices: ['(−1, 4)', '(5, 4)', '(2, −1)', '이것만으로는 알 수 없다'],
          answer: 0,
          explain: String.raw`$(2, -1) = 2\mathbf{e}_1 - \mathbf{e}_2$이므로 $T(2, -1) = 2(1, 2) - (3, 0) = (-1, 4)$다. 선형이라는 사실 하나로 "알 수 없다"가 "알 수 있다"로 바뀌었다. 이것이 바로 다음 두 노드의 내용이다. $(5, 4)$는 빼기를 더하기로 바꾼 것이다.`,
        },
      ],
    },
    {
      id: 'prop.linear-grid',
      kind: 'prop',
      title: '선형 변환은 격자를 곧고 평행하고 고르게 둔다',
      status: 'written',
      requires: ['def.linear-map'],
      predicts: [
        {
          id: 'p-mid',
          kind: 'choice',
          q: String.raw`한 직선 위에 같은 간격으로 놓인 세 점 $P, Q, R$이 있다($Q$가 가운데). 선형 변환 $T$가 $P$를 $(1, 1)$로, $R$을 $(5, 3)$으로 보낸다. $Q$는 어디로 갈까?`,
          hints: [
            String.raw`가운데 점은 양 끝의 평균이다: $Q = \tfrac{1}{2}P + \tfrac{1}{2}R$. 이것은 $P$와 $R$의 선형 결합이다.`,
            String.raw`[선형 변환은 선형 결합을 그대로 통과시킨다](n:def.linear-map).`,
          ],
          choices: ['(3, 2)', '이것만으로는 알 수 없다', '(6, 4)', '(4, 2)'],
          answer: 0,
          why: [
            String.raw`$T(Q) = \tfrac{1}{2}T(P) + \tfrac{1}{2}T(R) = \tfrac{1}{2}(1, 1) + \tfrac{1}{2}(5, 3) = (3, 2)$. 가운데 점은 가운데 점으로 간다.`,
            String.raw`일반 변환이라면 그렇다. 선형 변환은 "가운데"를 지킨다.`,
            String.raw`$(6, 4)$는 두 도착지의 합이다. $Q$는 $P + R$이 아니라 그 절반이다.`,
            String.raw`어림셈에서 한 성분이 미끄러졌다. 두 성분을 각각 평균하면 $(3, 2)$다.`,
          ],
        },
      ],
      openWhys: [{ q: '거꾸로, 원점을 고정하고 직선을 직선으로·고른 간격을 고르게 보내는 변환은 언제나 선형인가?', answeredBy: null }],
      body: String.raw`선형 변환의 두 조건은 식이다. 이 식들이 **그림에서는** 어떻게 보일까?

::predict p-mid

**명제.** [선형 변환](t:t.linear-map)은
1. 원점을 원점으로 보낸다.
2. 직선을 직선으로(또는 한 점으로) 보낸다.
3. 평행한 직선들을 평행한 직선들로 보낸다.
4. 한 직선 위에 같은 간격으로 놓인 점들을 같은 간격으로 놓인 점들로 보낸다.

그래서 평면의 격자는 선형 변환을 거친 뒤에도 **곧고, 평행하고, 고르게** 남는다. 정사각형 칸들은 모두 똑같은 평행사변형 칸들로 바뀐다.

::scene b2-warp {"map": "linear", "line": true}

그림의 단추로 휘기와 소용돌이로 바꿔 보라. 같은 간격의 점들이 간격을 잃고, 곧은 선이 휜다. 평행 이동은 2~4번을 모두 지키지만 원점을 옮기므로(1번) 선형이 아니다.

### 이 성질이 주는 눈
격자가 고르게 남는다는 것은 **칸 하나만 보면 전체를 안다**는 뜻이다. 원점에 붙은 칸 하나(단위 정사각형)가 어떤 평행사변형으로 가는지 보면, 나머지 칸들은 그것을 옆으로 이어 붙인 것이다. 다음 노드에서 이 관찰을 정확한 명제로 만든다.`,
      proof: String.raw`1번은 [앞 노드](why:def.linear-map)에서 보였다.

점 $\mathbf{p}$를 지나고 방향이 $\mathbf{d}$인 직선 위의 점은 $\mathbf{p} + s\mathbf{d}$($s$는 아무 수) 꼴이다. 여기에 $T$를 하면

$$T(\mathbf{p} + s\mathbf{d}) = T(\mathbf{p}) + sT(\mathbf{d})$$

이다([두 조건을 차례로 썼다](why:def.linear-map)). 오른쪽은 점 $T(\mathbf{p})$를 지나고 방향이 $T(\mathbf{d})$인 직선 위의 점이다(2번). 만약 $T(\mathbf{d}) = \mathbf{0}$이면 모든 점이 $T(\mathbf{p})$ 하나로 모인다.

평행한 직선들은 방향 $\mathbf{d}$가 같다. 그 상들의 방향은 모두 $T(\mathbf{d})$이므로 서로 평행하다(3번).

같은 간격의 점들은 $s = 0, 1, 2, \dots$처럼 고르게 놓인 $s$에 해당한다. 상 $T(\mathbf{p}) + sT(\mathbf{d})$에서도 $s$가 한 칸 늘 때마다 같은 $T(\mathbf{d})$만큼 나아가므로 간격이 고르다(4번).`,
    },
    {
      id: 'prop.basis-determines',
      kind: 'prop',
      title: '기저의 도착지가 전부를 결정한다',
      status: 'written',
      requires: ['def.linear-map', 'def.basis'],
      predicts: [
        {
          id: 'p-land',
          kind: 'point',
          q: String.raw`선형 변환 $T$가 $\mathbf{e}_1$을 $(1, 0.5)$로(주황), $\mathbf{e}_2$를 $(-0.5, 1)$로(청록) 보낸다. $\mathbf{x} = (-1, 2)$(노랑)는 어디로 갈까? 분홍 점을 끌어 놓아라.`,
          hints: [
            String.raw`$\mathbf{x}$를 표준 기저로 적으면 $-1\cdot\mathbf{e}_1 + 2\cdot\mathbf{e}_2$다. 음수 계수에 주의하라.`,
            String.raw`도착지 = $-1\cdot$(주황 화살표) $+ 2\cdot$(청록 화살표). 주황을 뒤집고, 그 끝에 청록을 두 번 이어 붙여 보라.`,
          ],
          A: [[1, -0.5], [0.5, 1]],
          x: [-1, 2],
          target: 'Ax',
          show: ['cols', 'x'],
          reveal: String.raw`정답은 $(-2, 1.5)$다: $-1\cdot(1, 0.5) + 2\cdot(-0.5, 1) = (-1 - 1,\ -0.5 + 2)$. 입력의 좌표가 그대로 **기저 도착지의 계수**가 된다. 아래 명제가 이것이다.`,
        },
      ],
      body: String.raw`[선형 변환은 격자를 고르게 둔다](n:prop.linear-grid). 그렇다면 정확히 **몇 개의** 도착지를 알면 변환 전체를 알 수 있을까?

::predict p-land

**명제.** 평면의 선형 변환 $T$는 두 도착지 $T(\mathbf{e}_1)$, $T(\mathbf{e}_2)$만으로 완전히 정해진다. 입력 $\mathbf{x} = (x_1, x_2)$의 도착지는

$$T(\mathbf{x}) = x_1\,\ca{T(\mathbf{e}_1)} + x_2\,\cb{T(\mathbf{e}_2)}$$

이다. 그리고 거꾸로, 같은 두 도착지를 갖는 선형 변환은 하나뿐이다.

::scene transform-grid {"A": [[1, -0.5], [0.5, 1]], "x": [-1, 2], "morph": false}

그림 오른쪽의 숫자 표는 두 도착지를 세로로 적은 것이다. 다음 노드에서 이 표에 [행렬](fwd:t.matrix)이라는 이름이 붙는다. 주황·청록 화살표의 끝을 끌어 도착지를 바꾸면, 노란 입력의 도착지(분홍)와 격자 전체가 따라 바뀐다. 두 화살표가 전부를 결정한다는 것을 손으로 확인해 보라.

### 두 개의 예
- 위 관문: $\mathbf{x} = (-1, 2)$이면 $T(\mathbf{x}) = -1\cdot(1, 0.5) + 2\cdot(-0.5, 1) = (-2, 1.5)$.
- $T(\mathbf{e}_1) = (2, 0)$, $T(\mathbf{e}_2) = (0, 3)$이면 $T(x_1, x_2) = (2x_1, 3x_2)$다. 가로로 2배, 세로로 3배 늘이는 변환이다.

### 이 명제의 무게
일반 변환이었다면 평면의 점 **하나하나마다** 도착지를 적어야 했다. 선형이라는 조건 하나 덕분에 점 두 개의 도착지, 곧 숫자 네 개로 충분하다. 이 압축이 [행렬](fwd:t.matrix)이라는 도구의 출발점이다.`,
      proof: String.raw`**도착지 공식.** 모든 벡터는 [표준 기저의 선형 결합으로, 계수가 하나로 정해지게](why:prop.coords-unique) 쓸 수 있다: $\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2$. [선형 변환은 선형 결합을 그대로 통과시키므로](why:def.linear-map)

$$T(\mathbf{x}) = T(x_1\mathbf{e}_1 + x_2\mathbf{e}_2) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2)$$

**하나뿐이다.** 두 선형 변환 $T$, $T'$이 $\mathbf{e}_1$, $\mathbf{e}_2$를 같은 곳으로 보낸다면, 위 공식에 따라 모든 $\mathbf{x}$에서 $T(\mathbf{x}) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2) = x_1T'(\mathbf{e}_1) + x_2T'(\mathbf{e}_2) = T'(\mathbf{x})$이다. 그러므로 두 변환은 같다.`,
      checks: [
        {
          q: String.raw`선형 변환이 $\mathbf{e}_1$을 $(3, 1)$로, $\mathbf{e}_2$를 $(0, 2)$로 보낸다. $(1, 1)$의 도착지는?`,
          choices: ['(3, 3)', '(3, 2)', '(0, 2)', '(4, 2)'],
          answer: 0,
          explain: String.raw`$(1, 1) = \mathbf{e}_1 + \mathbf{e}_2$이므로 $(3, 1) + (0, 2) = (3, 3)$이다. 그림으로는 주황 화살표 끝에 청록 화살표를 이어 붙인 자리다. $(4, 2)$는 성분을 섞어 더한 실수다.`,
        },
      ],
    },
    {
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
> 이것은 [규약](t:t.convention)이다. 증명할 수 있는 사실이 아니다. 다만 이 규약에는 이유가 있다. 첫째, 이 교재에서는 [벡터를 처음부터 세로로 적었다](n:def.vector). 그래서 도착지 벡터를 그대로 세워 끼우면 행렬의 열이 된다. 둘째, 이렇게 정하면 다음 노드의 [행렬-벡터 곱](fwd:t.matvec)이 "열들을 섞는다"는 한 문장으로 읽히고, 행렬끼리의 곱도 열 단위로 읽힌다. 도착지를 가로로 적는 규약을 택해도 수학은 똑같이 성립하지만, 그때는 모든 공식에서 행과 열이 뒤바뀐 모양이 된다(그 뒤바꿈 자체는 3권의 [전치](fwd:t.transpose)가 된다).

> [!주의] 행렬의 행에도 뜻이 있다
> 이 노드에서는 열만 읽었다. 행렬의 행은 3권에서 [내적](fwd:t.dot)과 함께 다른 뜻을 얻는다. 열을 읽는 눈과 행을 읽는 눈을 둘 다 갖는 것이 이 교재의 목표 중 하나다.`,
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
    },
    {
      id: 'def.matvec',
      kind: 'def',
      title: '행렬 × 벡터 = 열들의 선형 결합',
      status: 'written',
      introduces: {
        terms: [{ id: 't.matvec', ko: '행렬-벡터 곱', en: 'matrix–vector product', gloss: 'A𝐱 = x₁𝐚₁ + x₂𝐚₂ + … : 𝐱의 성분을 계수로 삼아 A의 열들을 선형 결합한 것.' }],
        symbols: [{ tex: String.raw`\mathbf{x}`, meaning: '변환에 넣는 입력 벡터', note: '성분은 x₁, x₂' }],
      },
      requires: ['def.matrix'],
      openWhys: [{ q: '학교에서 배운 "행 × 열" 계산법은 이 정의와 어떻게 같은가?', answeredBy: 'prop.row-picture' }],
      predicts: [
        {
          id: 'p-ax',
          kind: 'point',
          q: String.raw`어떤 변환이 $\mathbf{e}_1$을 $(1, 0)$으로, $\mathbf{e}_2$를 $(1, 1)$로 보낸다(주황, 청록 화살표). 그렇다면 $\mathbf{x} = (2, 1)$(노랑)은 어디로 갈까? 분홍 점을 끌어 놓아라.`,
          hints: [
            String.raw`$\mathbf{x} = (2, 1)$을 표준 기저로 적으면 $2\mathbf{e}_1 + 1\mathbf{e}_2$다. [선형 변환은 이 결합을 그대로 유지한다](n:prop.basis-determines).`,
            String.raw`그러므로 도착지는 \"$\mathbf{e}_1$의 도착지 2개\" + \"$\mathbf{e}_2$의 도착지 1개\"다. 주황 화살표를 두 번 이어 붙인 끝에서 청록 화살표를 하나 더 이어 붙여 보라.`,
          ],
          A: [[1, 1], [0, 1]],
          x: [2, 1],
          target: 'Ax',
          show: ['cols', 'x'],
          reveal: String.raw`정답은 $(3, 1)$이다. $\mathbf{x} = 2\mathbf{e}_1 + 1\mathbf{e}_2$이므로 도착지도 $2\cdot(1, 0) + 1\cdot(1, 1)$이다. $(2, 1)$ 근처에 놓았다면 변환이 $\mathbf{x}$를 움직이지 않는다고 본 것이다. 아래에서 이 계산이 왜 **언제나** 맞는지 정리한다.`,
        },
      ],
      body: String.raw`[행렬](t:t.matrix) $A$와 벡터 $\mathbf{x}$가 있다. $A$가 나타내는 변환은 $\mathbf{x}$를 어디로 보낼까?

::predict p-ax

입력 벡터를 $\mathbf{x}$, 그 성분을 $x_1$, $x_2$라고 쓰자. 출발점은 두 사실이다.

- 모든 벡터는 표준 기저의 선형 결합으로 쓸 수 있다: $\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2$. [왜 이렇게 쓸 수 있고, 왜 계수가 하나로 정해지는가?](why:prop.coords-unique)
- 선형 변환은 선형 결합을 그대로 유지한다: $T(x_1\mathbf{e}_1 + x_2\mathbf{e}_2) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2)$. [왜?](why:prop.basis-determines)

그런데 $T(\mathbf{e}_1)$과 $T(\mathbf{e}_2)$는 [행렬의 정의](n:def.matrix)에 따라 $A$의 첫째 열 $\mathbf{a}_1$과 둘째 열 $\mathbf{a}_2$다. 두 사실을 이으면 다음 식이 나온다.

$$\h{Ax}{\cy{A\mathbf{x}}} = \h{x1a1}{\cx{x_1}\,\ca{\mathbf{a}_1}} + \h{x2a2}{\cx{x_2}\,\cb{\mathbf{a}_2}}$$

**정의.** 행렬 $A$와 벡터 $\mathbf{x}$의 [행렬-벡터 곱](def:t.matvec) $A\mathbf{x}$는, $\mathbf{x}$의 성분 $x_1, x_2$를 [계수](t:t.coefficient)로 삼아 $A$의 열 $\mathbf{a}_1, \mathbf{a}_2$를 [선형 결합](t:t.linear-combination)한 벡터다.

한 문장으로 줄이면 이렇다. **행렬은 열들을 담고 있고, 벡터는 그 열들을 얼마씩 섞을지를 담고 있다.**

::scene transform-grid {"A": [[1, 1], [0, 1]], "x": [2, 1]}

그림에서 노란 화살표가 입력 $\mathbf{x}$, 분홍 화살표가 출력 $A\mathbf{x}$다. 점선 두 개는 $x_1\mathbf{a}_1$(주황)과 그 끝에 이어 붙인 $x_2\mathbf{a}_2$(청록)다. 두 점선을 [이어 붙인](t:t.vector-add) 끝이 정확히 분홍 화살표의 끝과 만난다. 위 식의 각 항에 마우스를 올리면 그림의 해당 화살표가 빛난다.

### 성분으로 풀어 쓰기
$$\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = x_1 \begin{bmatrix} a_{11} \\ a_{21} \end{bmatrix} + x_2 \begin{bmatrix} a_{12} \\ a_{22} \end{bmatrix} = \begin{bmatrix} a_{11}x_1 + a_{12}x_2 \\ a_{21}x_1 + a_{22}x_2 \end{bmatrix}$$

첫째 등호가 정의이고, 둘째 등호는 [스칼라 곱과 벡터 덧셈을 성분별로 계산](why:prop.add-componentwise)한 것이다.

### 두 개의 예
- [전단](fwd:t.shear) $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $\mathbf{x} = (2, 1)$: $\;2\begin{bmatrix} 1 \\ 0 \end{bmatrix} + 1\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \end{bmatrix}$. 위 그림의 처음 상태와 같다.
- 90° 회전 $A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$, $\mathbf{x} = (2, 1)$: $\;2\begin{bmatrix} 0 \\ 1 \end{bmatrix} + 1\begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 2 \end{bmatrix}$. 화살표 $(2, 1)$을 시계 반대 방향으로 90° 돌리면 실제로 $(-1, 2)$가 된다. 그림의 행렬 칸을 바꿔 직접 확인해 보라.

### 거꾸로: 아무 행렬이나 선형 변환을 만든다
지금까지는 선형 변환에서 출발해 행렬을 얻었다. 반대 방향도 성립한다. 숫자 네 개를 아무렇게나 적은 표 $A$를 가져와 위 정의대로 $\mathbf{x} \mapsto A\mathbf{x}$라는 변환을 만들면, 그 변환은 언제나 선형이다. 두 입력 $\mathbf{u}$, $\mathbf{w}$를 더해서 넣어 보자.

$$A(\mathbf{u} + \mathbf{w}) = (u_1 + w_1)\mathbf{a}_1 + (u_2 + w_2)\mathbf{a}_2 = (u_1\mathbf{a}_1 + u_2\mathbf{a}_2) + (w_1\mathbf{a}_1 + w_2\mathbf{a}_2) = A\mathbf{u} + A\mathbf{w}$$

가운데 등호에서 쓴 것은 [벡터 계산 규칙](why:prop.vector-rules)(스칼라 곱의 분배와 덧셈의 교환·결합)뿐이다. 스칼라 곱 $A(c\mathbf{x}) = cA\mathbf{x}$도 같은 방식으로 확인된다. 그래서 **평면의 선형 변환과 2×2 행렬은 하나씩 정확히 짝지어진다**. 앞으로 둘을 같은 것의 두 이름처럼 쓴다.

> [!코드] 정의가 곧 구현이다
> 아래 "이 노드의 코드"에 있는 \`matVec\`은 이 정의를 한 줄씩 옮긴 것이다. 열을 하나씩 꺼내(\`col\`) 성분을 계수로 삼아 선형 결합(\`linComb\`)한다. 학교에서 배운 "행 × 열" 계산을 쓰지 않았다는 점에 주목하라. 그 계산법이 왜 같은 답을 내는지는 3권에서 증명한다.`,
      checks: [
        {
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, $\mathbf{x} = (1, 0)$일 때 $A\mathbf{x}$는?`,
          choices: [String.raw`$(1, 3)$`, String.raw`$(1, 2)$`, String.raw`$(3, 7)$`, String.raw`$(4, 6)$`],
          answer: 0,
          explain: String.raw`$A\mathbf{x} = 1\cdot\mathbf{a}_1 + 0\cdot\mathbf{a}_2 = \mathbf{a}_1 = (1, 3)$. 일반적으로 $A\mathbf{e}_j$는 $A$의 $j$번째 열이다. 이것이 [행렬의 정의](n:def.matrix) 그 자체다. $(1, 2)$는 첫째 행을 읽은 것이다.`,
        },
        {
          q: String.raw`$A\mathbf{x}$를 "$\mathbf{x}$의 성분으로 $A$의 열을 섞은 것"으로 정의할 수 있는 근거는?`,
          choices: ['선형 변환은 선형 결합을 그대로 유지하고, 열은 기저의 도착지이기 때문', '이렇게 계산하는 편이 빠르기 때문', '수학자들이 그렇게 정했기 때문(근거 없음)'],
          answer: 0,
          explain: String.raw`$\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2$이고, 선형 변환은 이 결합을 유지하므로 $T(\mathbf{x}) = x_1T(\mathbf{e}_1) + x_2T(\mathbf{e}_2)$다. 열이 $T(\mathbf{e}_j)$이므로 식이 정해진다. 계산 속도와는 관계가 없다. 그리고 "정했기 때문"은 반만 맞는다. 행렬을 세로로 적는 것은 규약이지만, 규약을 정한 뒤 곱셈의 모양은 선형성에서 저절로 나온다.`,
        },
      ],
      code: ['matVec', 'col', 'linComb'],
    },
    {
      id: 'exp.gallery',
      kind: 'exp',
      title: '변환 도감: 회전, 늘이기, 전단, 반사, 사영',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.rotation', ko: '회전', en: 'rotation', everyday: true, gloss: '원점을 중심으로 모든 벡터를 같은 각만큼 돌리는 변환.' },
          { id: 't.shear', ko: '전단', en: 'shear', gloss: '한 축은 그대로 두고 다른 축을 옆으로 미는 변환. 카드 더미를 비스듬히 미는 모양.' },
          { id: 't.reflection', ko: '반사', en: 'reflection', gloss: '원점을 지나는 직선을 거울로 삼아 뒤집는 변환.' },
          { id: 't.projection', ko: '사영', en: 'projection', gloss: '공간을 더 낮은 차원(예: 직선) 위로 납작하게 누르는 변환.' },
        ],
      },
      requires: ['def.matvec', 'def.angle-trig'],
      predicts: [
        {
          id: 'p-mirror',
          kind: 'choice',
          q: String.raw`가로축($x$축)을 거울로 삼는 반사의 행렬은?`,
          hints: [String.raw`$\mathbf{e}_1$은 거울 위에 있다. $\mathbf{e}_2$는 거울에 비치면 어디로 가는가? 두 도착지를 차례로 세로로 적어라.`],
          choices: [String.raw`$\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$`],
          answer: 0,
          why: [
            String.raw`$\mathbf{e}_1$은 제자리 $(1, 0)$, $\mathbf{e}_2$는 아래로 뒤집혀 $(0, -1)$이다.`,
            String.raw`그것은 **세로축**을 거울로 삼는 반사다. $\mathbf{e}_1$이 뒤집히고 $\mathbf{e}_2$가 제자리다.`,
            String.raw`그것은 대각선 $y = x$를 거울로 삼는 반사다.`,
            String.raw`그것은 가로축 위로 누르는 사영이다. 반사는 뒤집을 뿐 납작하게 누르지 않는다.`,
          ],
        },
        {
          id: 'p-proj',
          kind: 'point',
          q: String.raw`대각선 $y = x$ 위로 **수직으로** 눌러 내리는 사영은 $\mathbf{e}_1$을 어디로 보낼까? 분홍 점을 끌어 놓아라.`,
          hints: [
            String.raw`$\mathbf{e}_1$의 끝 $(1, 0)$에서 대각선으로 수직인 선을 그어 보라. 그 선이 대각선과 만나는 점이 도착지다.`,
            String.raw`원점, $(1, 0)$, 그리고 그 만나는 점은 직각이등변삼각형을 이룬다(대각선이 가로축과 45°를 이루므로). 만나는 점은 대각선 위에서 $(a, a)$ 꼴이다.`,
          ],
          A: [[0.5, 0.5], [0.5, 0.5]],
          x: [1, 0],
          target: 'Ax',
          show: ['x'],
          reveal: String.raw`정답은 $(0.5, 0.5)$다. 같은 이유로 $\mathbf{e}_2$도 $(0.5, 0.5)$로 간다. 그래서 이 사영의 행렬은 $\begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix}$이고, 두 열이 같다. 두 기저 벡터가 같은 곳으로 가므로 평면 전체가 대각선 하나로 납작해진다.`,
        },
      ],
      body: String.raw`[행렬](t:t.matrix)을 읽는 눈은 많은 예를 볼수록 빨라진다. 이 노드는 평면의 대표적인 선형 변환 다섯 가지를 모은 도감이다. 각각에 대해 같은 질문을 던진다. **$\mathbf{e}_1$과 $\mathbf{e}_2$는 어디로 가는가? 그래서 열은 무엇인가?**

::scene transform-grid {"A": [[1, 0], [0, 1]], "presets": true, "morph": false}

그림 오른쪽의 단추를 누르면 지금 행렬에서 그 변환으로 천천히 바뀐다. 각 변환을 보면서 아래 설명과 맞춰 보라.

### 다섯 가지
- [회전](def:t.rotation): 원점을 중심으로 모든 벡터를 같은 각만큼 돌린다. 30° 회전은 $\mathbf{e}_1$을 단위원 위 30° 자리 $(\cos30°, \sin30°)$로 보낸다([왜 그 좌표인가?](why:def.angle-trig)). 길이와 넓이가 그대로다. 일반 공식은 다음 노드에서 만든다.
- **늘이기**: $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$은 가로로 2배, 세로는 그대로다. 대각선 밖이 0인 행렬은 축 방향으로 따로따로 늘인다.
- [전단](def:t.shear): $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$은 $\mathbf{e}_1$을 제자리에 두고 $\mathbf{e}_2$를 옆으로 민다. 바닥은 그대로이고 위로 갈수록 더 많이 밀린다. 카드 더미를 비스듬히 미는 모양이다. 칸의 모양은 바뀌지만 칸의 밑변과 높이는 그대로다.
- [반사](def:t.reflection): $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$은 대각선 $y = x$를 거울로 삼아 뒤집는다. $\mathbf{e}_1$과 $\mathbf{e}_2$가 자리를 맞바꾼다. 주황에서 청록으로 도는 방향이 시계 반대 방향에서 시계 방향으로 바뀐다. 거울에 비치면 왼손이 오른손이 되는 것과 같다.
- [사영](def:t.projection): $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$은 평면을 가로축 위로 눌러 내린다. $\mathbf{e}_2$가 원점으로 사라지므로 평면 전체가 직선 하나로 납작해진다. 납작해진 것은 되돌릴 수 없다(어디서 왔는지 정보가 사라졌으므로).

::predict p-mirror

::predict p-proj

### 도감에서 읽어 낼 세 가지 질문
행렬을 볼 때마다 아래 세 가지를 물어보는 습관을 들이면, 뒤의 개념들이 차례로 이름을 얻는다.
1. 넓이는 몇 배가 되는가? 뒤집히는가? — 4권의 [행렬식](fwd:t.determinant)
2. 납작해지는가? 그렇다면 몇 차원으로? — 6권의 [랭크](fwd:t.rank)
3. 자기 직선 위에 남는 방향이 있는가? — 8권의 [고유벡터](fwd:t.eigenvector)`,
    },
    {
      id: 'prop.rotation-matrix',
      kind: 'prop',
      title: '회전 행렬 R_θ',
      status: 'written',
      introduces: { symbols: [{ tex: String.raw`R_\theta`, meaning: '각 θ만큼 시계 반대 방향으로 돌리는 회전 행렬' }] },
      requires: ['exp.gallery', 'prop.cos-sin-identity'],
      predicts: [
        {
          id: 'p-e2',
          kind: 'point',
          q: String.raw`공식을 만들기 전에: 시계 반대 방향 60° 회전은 $\mathbf{e}_2$를 어디로 보낼까? 분홍 점을 끌어 놓아라.`,
          hints: [
            String.raw`$\mathbf{e}_2$는 단위원 위 90° 자리에 있다. 60°를 더 돌면 몇 도 자리인가?`,
            String.raw`150° 자리는 왼쪽 위다. 그 점의 가로 좌표는 음수, 세로 좌표는 양수다. 30° 자리 $(\cos30°, \sin30°) \approx (0.87, 0.5)$를 세로축에 비친 점이다.`,
          ],
          A: [[0.5, -0.8660254037844386], [0.8660254037844386, 0.5]],
          x: [0, 1],
          target: 'Ax',
          show: ['circle', 'x'],
          tol: 0.15,
          reveal: String.raw`정답은 $(-0.87, 0.5)$, 곧 $(-\sin60°, \cos60°)$다. 일반적으로 $\theta$ 회전은 $\mathbf{e}_2$를 $(-\sin\theta, \cos\theta)$로 보낸다. 아래 증명이 그 이유다.`,
        },
      ],
      body: String.raw`[도감](n:exp.gallery)에서 30° 회전을 보았다. 아무 각 $\theta$의 [회전](t:t.rotation)의 행렬은 무엇일까? [행렬은 기저의 도착지를 열로 적은 것](why:def.matrix)이므로, $\mathbf{e}_1$과 $\mathbf{e}_2$가 어디로 가는지만 알면 된다.

::predict p-e2

**명제.** 원점을 중심으로 시계 반대 방향으로 $\theta$만큼 돌리는 회전의 행렬은

$$R_\theta = \begin{bmatrix} \ca{\cos\theta} & \cb{-\sin\theta} \\ \ca{\sin\theta} & \cb{\cos\theta} \end{bmatrix}$$

이다. 첫째 열이 $\mathbf{e}_1$의 도착지, 둘째 열이 $\mathbf{e}_2$의 도착지다.

### 두 개의 예
- $\theta = 90°$: $\cos90° = 0$, $\sin90° = 1$이므로 $R_{90°} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$. [행렬을 읽는 법](n:def.matrix)에서 본 행렬과 같다.
- $\theta = 30°$: $R_{30°} \approx \begin{bmatrix} 0.866 & -0.5 \\ 0.5 & 0.866 \end{bmatrix}$. 둘째 열 $(-0.5, 0.866)$의 길이는 $\sqrt{0.25 + 0.75} = 1$이다. 회전은 길이를 바꾸지 않는다.

> [!코드] 각의 단위
> 이 저장소의 \`rotation\`은 각을 [라디안](t:t.radian)으로 받는다(90° = $\pi/2$). 수학 함수 \`Math.cos\`가 라디안을 받기 때문이다.`,
      proof: String.raw`**첫째 열.** 회전은 $\mathbf{e}_1 = (1, 0)$, 곧 단위원 위 0° 자리의 점을 $\theta$ 자리로 옮긴다. [코사인과 사인은 단위원 위 θ 자리의 점의 좌표로 정의했으므로](why:def.angle-trig) 도착지는 $(\cos\theta, \sin\theta)$다.

**둘째 열.** 먼저 사실 하나를 보이자. **점 $(a, b)$를 원점 중심으로 시계 반대 방향 90° 돌리면 $(-b, a)$가 된다.** 원점, $(a, 0)$, $(a, b)$를 꼭짓점으로 하는 직각삼각형을 통째로 90° 돌려 보라. 가로 변(길이 $a$, 오른쪽 방향)은 세로 변(길이 $a$, 위쪽 방향)이 되고, 세로 변(길이 $b$, 위쪽 방향)은 가로 변(길이 $b$, 왼쪽 방향)이 된다. 그래서 꼭짓점 $(a, b)$는 $(-b, a)$로 간다. $a$, $b$가 음수일 때도 방향이 함께 뒤집히므로 같은 식이 성립한다.

$\mathbf{e}_2$는 $\mathbf{e}_1$을 90° 돌린 것이다. 회전을 두 번 하는 순서는 결과에 영향을 주지 않는다(90° 돌리고 $\theta$ 돌린 것과 $\theta$ 돌리고 90° 돌린 것은 둘 다 $90° + \theta$ 돌린 것이다). 그러므로 $\mathbf{e}_2$의 도착지는 "$\mathbf{e}_1$의 도착지 $(\cos\theta, \sin\theta)$를 90° 돌린 것", 곧 $(-\sin\theta, \cos\theta)$다. 검산으로 길이를 재면 $\sin^2\theta + \cos^2\theta = 1$([왜?](why:prop.cos-sin-identity))이다.`,
      code: ['rotation'],
    },
    {
      id: 'def.composition',
      kind: 'def',
      title: '합성과 행렬 곱',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.composition', ko: '합성', en: 'composition', gloss: '한 변환을 한 뒤 이어서 다른 변환을 하는 것을 하나의 변환으로 본 것.' },
          { id: 't.matmul', ko: '행렬 곱', en: 'matrix multiplication', gloss: 'AB = "B를 먼저, 그다음 A"를 하는 합성 변환의 행렬.' },
        ],
      },
      requires: ['def.matvec'],
      predicts: [
        {
          id: 'p-two',
          kind: 'point',
          q: String.raw`먼저 가로로 2배 늘이고($B = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$), 그다음 시계 반대 방향 90° 돌린다($A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$). 두 단계를 마친 뒤 $\mathbf{e}_1$은 어디에 있을까?`,
          hints: [String.raw`한 단계씩 따라가라. 늘이기 뒤 $\mathbf{e}_1$은 $(2, 0)$이다. 이 화살표를 90° 돌리면?`],
          A: [[0, -1], [2, 0]],
          x: [1, 0],
          target: 'Ax',
          show: ['x'],
          reveal: String.raw`정답은 $(0, 2)$다. $(2, 0)$을 90° 돌리면 위쪽을 가리키는 길이 2짜리 화살표가 된다. 두 단계를 하나로 합친 변환의 첫째 열이 바로 이것이다.`,
        },
      ],
      body: String.raw`변환을 하나 하고 이어서 다른 변환을 하면, 그 전체도 하나의 변환이다. 두 변환이 모두 행렬로 적혀 있다면, 그 전체의 행렬은 무엇일까?

::predict p-two

**정의.** 변환 $B$를 먼저 하고 이어서 변환 $A$를 하는 것을 한 변환으로 본 것을 두 변환의 [합성](def:t.composition)이라 한다. 그 합성 변환의 행렬을 $AB$라 쓰고, $A$와 $B$의 [행렬 곱](def:t.matmul)이라 한다.

$$(AB)\mathbf{x} = A(B\mathbf{x})$$

**순서에 주의하라.** $AB$는 오른쪽의 $B$를 **먼저** 한다. 입력 $\mathbf{x}$에 가까운 쪽이 먼저 작용하기 때문이다. 함수를 $f(g(x))$로 쓰면 $g$가 먼저인 것과 같다.

::scene b2-compose {}

### 합성도 선형이다, 그래서 행렬이 있다
합성 변환이 행렬을 가지려면 선형이어야 한다([행렬은 선형 변환의 기저 도착지를 적은 것이므로](why:def.matrix)). 실제로 선형이다.

$$A(B(\mathbf{u} + \mathbf{w})) = A(B\mathbf{u} + B\mathbf{w}) = A(B\mathbf{u}) + A(B\mathbf{w})$$

첫 등호는 $B$가, 둘째 등호는 $A$가 [덧셈을 통과시키기](why:def.linear-map) 때문이다. 스칼라 곱도 같은 방식으로 통과한다. 그러므로 $AB$는 잘 정의된 행렬이다. 그 행렬의 열을 실제로 계산하는 법은 다음 노드에서 다룬다.

### 두 개의 예
- 위 관문: $B$(가로 2배) 다음 $A$(90° 회전). $\mathbf{e}_1 \to (2, 0) \to (0, 2)$, $\mathbf{e}_2 \to (0, 1) \to (-1, 0)$. 그러므로 $AB = \begin{bmatrix} 0 & -1 \\ 2 & 0 \end{bmatrix}$.
- 같은 회전을 두 번: $R_{90°}R_{90°}$는 $\mathbf{e}_1 \to \mathbf{e}_2 \to -\mathbf{e}_1$, $\mathbf{e}_2 \to -\mathbf{e}_1 \to -\mathbf{e}_2$이므로 $\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}$, 곧 180° 회전이다.`,
      checks: [
        {
          q: String.raw`$AB$와 "$A$를 먼저 한 뒤 $B$를 하는 것" 가운데 같은 것은?`,
          choices: ['어느 것도 같다고 할 수 없다. AB는 B를 먼저 한다', '같다. 왼쪽부터 읽는다', '같다. 순서는 상관없다'],
          answer: 0,
          explain: String.raw`$(AB)\mathbf{x} = A(B\mathbf{x})$이므로 $B$가 먼저다. "$A$ 먼저, 그다음 $B$"의 행렬은 $BA$다. 둘이 같은지는 다음다음 노드에서 다룬다(대개 다르다).`,
        },
      ],
    },
    {
      id: 'prop.matmul-columns',
      kind: 'prop',
      title: 'AB의 j번째 열 = A × (B의 j번째 열)',
      status: 'written',
      requires: ['def.composition'],
      predicts: [
        {
          id: 'p-col2',
          kind: 'point',
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 3 & 0 \\ 1 & 2 \end{bmatrix}$이다. 곱 $AB$의 **둘째 열**을 분홍 점으로 끌어 놓아라.`,
          hints: [
            String.raw`$AB$의 둘째 열은 $AB$가 $\mathbf{e}_2$를 보내는 곳이다. [합성의 정의](n:def.composition)에 따라 그것은 $A(B\mathbf{e}_2)$다.`,
            String.raw`$B\mathbf{e}_2$는 $B$의 둘째 열 $(0, 2)$다. 이제 $A(0, 2) = 0\cdot\mathbf{a}_1 + 2\cdot\mathbf{a}_2$를 계산하라.`,
          ],
          A: [[5, 4], [1, 2]],
          x: [0, 1],
          target: 'Ax',
          reveal: String.raw`정답은 $(4, 2)$다: $A(0, 2) = 0\cdot(1, 0) + 2\cdot(2, 1)$. 첫째 열도 같은 방식으로 $A(3, 1) = 3\cdot(1, 0) + 1\cdot(2, 1) = (5, 1)$이다.`,
        },
      ],
      body: String.raw`[행렬 곱](t:t.matmul) $AB$는 합성 변환의 행렬로 정의했다. 실제로 숫자를 어떻게 계산할까?

::predict p-col2

**명제.** $AB$의 $j$번째 열은 $A$에 $B$의 $j$번째 열을 곱한 것이다.

$$AB = A\begin{bmatrix} | & | \\ B\mathbf{e}_1 & B\mathbf{e}_2 \\ | & | \end{bmatrix} = \begin{bmatrix} | & | \\ A(B\mathbf{e}_1) & A(B\mathbf{e}_2) \\ | & | \end{bmatrix}$$

말로 하면 이렇다. "$B$가 $\mathbf{e}_j$를 보낸 곳을, $A$가 다시 어디로 보내는가." 열 하나하나는 [행렬-벡터 곱](t:t.matvec)이고, 행렬-벡터 곱은 열들의 선형 결합이다.

### 성분으로 풀어 쓰기
위 관문의 $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 3 & 0 \\ 1 & 2 \end{bmatrix}$에서

$$AB = \begin{bmatrix} 1\cdot3 + 2\cdot1 & 1\cdot0 + 2\cdot2 \\ 0\cdot3 + 1\cdot1 & 0\cdot0 + 1\cdot2 \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 1 & 2 \end{bmatrix}$$

성분 하나만 보면 "$A$의 $i$행"과 "$B$의 $j$열"을 같은 자리끼리 곱해서 더한 것이다. 이 "곱해서 더하기"는 3권에서 [내적](fwd:t.dot)이라는 이름을 얻는다. 그러나 이 계산은 정의가 아니라 **결과**다. 정의는 어디까지나 "열마다 $A$를 곱한다"이다.

::scene b2-compose {"A": [[1, 2], [0, 1]], "B": [[3, 0], [1, 2]], "x": [0, 1]}

> [!코드] 정의대로 구현하기
> \`matMul\`은 $B$의 열을 하나씩 꺼내 \`matVec\`으로 $A$를 곱하고, 그 결과를 다시 열로 세운다(\`fromCols\`). 학교에서 배운 "행 × 열" 계산을 쓰지 않았다. 둘이 언제나 같은 답을 낸다는 것은 테스트(\`(AB)x = A(Bx)\`, 오라클 비교)가 확인한다.`,
      proof: String.raw`[행렬의 j번째 열은 그 변환이 eⱼ를 보내는 곳이다](why:def.matrix). $AB$가 나타내는 변환은 "$B$ 다음 $A$"이므로 $\mathbf{e}_j$를 $A(B\mathbf{e}_j)$로 보낸다([왜?](why:def.composition)). 그리고 $B\mathbf{e}_j$는 $B$의 $j$번째 열이다.`,
      code: ['matMul'],
    },
    {
      id: 'def.identity',
      kind: 'def',
      title: '항등 행렬',
      status: 'written',
      introduces: {
        terms: [{ id: 't.identity', ko: '항등 행렬', en: 'identity matrix', gloss: '모든 벡터를 제자리에 두는 변환의 행렬. 열 = 표준 기저 그대로.' }],
        symbols: [{ tex: 'I', meaning: '항등 행렬' }],
      },
      requires: ['def.matrix'],
      predicts: [
        {
          id: 'p-unique',
          kind: 'choice',
          q: String.raw`어떤 행렬 $M$이 **모든** 행렬 $A$에 대해 $MA = A$를 만족한다. $M$은 무엇일까?`,
          hints: [String.raw`"모든 $A$"이므로 아주 특별한 $A$를 골라 넣어도 된다. 어떤 $A$를 넣으면 $M$이 그대로 드러나는가?`],
          choices: [String.raw`$I$뿐이다`, '대각선 밖이 0인 행렬이면 무엇이든 된다', '넓이를 바꾸지 않는 행렬이면 무엇이든 된다', '그런 행렬은 여러 개다'],
          answer: 0,
          why: [
            String.raw`$A = I$를 넣으면 $MI = I$이고, $MI = M$이므로 $M = I$다.`,
            String.raw`$\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}A$는 $A$의 첫째 행을 2배 한다. $A$와 같지 않다.`,
            String.raw`90° 회전은 넓이를 바꾸지 않지만 $R_{90°}A$는 $A$를 돌린 것이다.`,
            String.raw`$A = I$를 넣어 보면 하나로 정해진다.`,
          ],
        },
      ],
      body: String.raw`수의 세계에서 1은 곱해도 아무것도 바꾸지 않는다. 행렬의 세계에서 그런 역할을 하는 것은 무엇일까?

**정의.** 모든 벡터를 제자리에 두는 변환의 행렬을 [항등 행렬](def:t.identity)이라 하고 $I$로 쓴다. 이 변환은 $\mathbf{e}_1$을 $\mathbf{e}_1$로, $\mathbf{e}_2$를 $\mathbf{e}_2$로 보내므로, [행렬의 정의](why:def.matrix)에 따라

$$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

이다. 3차원이면 대각선에 1이 셋 놓인다.

$I$는 "아무것도 하지 않는 변환"이므로 앞에 하든 뒤에 하든 결과가 같다: $AI = IA = A$. [합성](t:t.composition)으로 읽으면 "아무것도 안 한 뒤 $A$" = "$A$ 한 뒤 아무것도 안 함" = "$A$"다.

::predict p-unique

### 두 개의 예
- $I\mathbf{x} = x_1\mathbf{e}_1 + x_2\mathbf{e}_2 = \mathbf{x}$. 행렬-벡터 곱의 정의 그대로다.
- $\begin{bmatrix} 3 & 1 \\ 2 & 5 \end{bmatrix}I$: 열마다 $I$의 열을 곱하므로 첫째 열은 $\begin{bmatrix} 3 & 1 \\ 2 & 5 \end{bmatrix}\mathbf{e}_1 = (3, 2)$, 둘째 열은 $(1, 5)$로 원래 행렬과 같다.

$I$는 5권의 [역행렬](fwd:t.inverse)에서 "되돌렸을 때 도착해야 하는 곳"이 된다.`,
      code: ['identity'],
    },
    {
      id: 'prop.noncommutative',
      kind: 'prop',
      title: '행렬 곱은 순서를 바꾸면 달라진다',
      status: 'written',
      requires: ['prop.matmul-columns', 'exp.gallery'],
      predicts: [
        {
          id: 'p-swap',
          kind: 'choice',
          q: String.raw`90° 회전 $R$과 가로 2배 늘이기 $D$가 있다. "$D$ 다음 $R$"($RD$)과 "$R$ 다음 $D$"($DR$)는 $\mathbf{e}_1$을 같은 곳으로 보낼까?`,
          hints: [String.raw`두 순서를 한 단계씩 따라가라. $RD$: $\mathbf{e}_1 \to (2, 0) \to$ ? $DR$: $\mathbf{e}_1 \to (0, 1) \to$ ?`],
          choices: ['다른 곳으로 보낸다', '같은 곳으로 보낸다. 같은 두 변환을 하므로', '같은 곳으로 보낸다. 넓이 배율이 같으므로'],
          answer: 0,
          why: [
            String.raw`$RD$는 $\mathbf{e}_1 \to (2, 0) \to (0, 2)$, $DR$은 $\mathbf{e}_1 \to (0, 1) \to (0, 1)$이다. 늘이기를 **돌리기 전에** 하면 가로 방향이 늘어나고, **돌린 뒤에** 하면 (원래 세로였던) 지금의 가로 방향이 늘어난다.`,
            String.raw`같은 재료라도 순서가 다르면 결과가 다를 수 있다. 양말을 신고 신발을 신는 것과 신발을 신고 양말을 신는 것이 다르듯이.`,
            String.raw`넓이 배율은 실제로 같다(둘 다 2배). 그러나 넓이가 같다고 변환이 같은 것은 아니다.`,
          ],
        },
        {
          id: 'p-center',
          kind: 'choice',
          q: String.raw`다음 가운데 **어떤 행렬과도** 순서를 바꿔 곱해도 같은($AM = MA$) 행렬 $M$은?`,
          hints: [
            String.raw`후보마다 반례를 찾아보라. 예를 들어 대각선 밖이 0인 $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$과 전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$을 두 순서로 곱해 보라.`,
            String.raw`"모든 방향을 똑같이 다루는" 변환이라면, 먼저 하든 나중에 하든 상관이 없을 것이다.`,
          ],
          choices: [String.raw`$2I$처럼 [항등 행렬](t:t.identity)의 수배`, '대각선 밖이 모두 0인 모든 행렬', '모든 회전 행렬', '넓이를 바꾸지 않는 모든 행렬'],
          answer: 0,
          why: [
            String.raw`$(cI)A = cA = A(cI)$이다. 모든 방향을 똑같이 $c$배 하므로 앞에서 하든 뒤에서 하든 같다.`,
            String.raw`$\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 2 \\ 0 & 1 \end{bmatrix}$이지만 반대 순서는 $\begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$이다. 대각선 밖이 0인 행렬끼리는 교환되지만, 아무 행렬과 교환되지는 않는다.`,
            String.raw`회전끼리는 교환되지만, 위 관문처럼 회전과 늘이기는 교환되지 않는다.`,
            String.raw`회전은 넓이를 바꾸지 않지만 늘이기와 교환되지 않는다.`,
          ],
        },
      ],
      body: String.raw`수의 곱셈은 순서를 바꿔도 같다($3 \times 5 = 5 \times 3$, [교환법칙](t:t.commutative)). [행렬 곱](t:t.matmul)도 그럴까?

::predict p-swap

**명제.** 행렬 곱은 일반적으로 교환법칙을 따르지 않는다. $AB \ne BA$인 행렬 $A$, $B$가 있다.

아래 그림은 위 관문의 두 변환이다. "순서 바꾸기"를 눌러 두 결과의 격자를 비교해 보라.

::scene b2-compose {"A": [[0, -1], [1, 0]], "B": [[2, 0], [0, 1]], "x": [1, 0]}

### 언제 교환되는가
교환되는 쌍도 있다. 기하로 생각하면 이유가 보인다.
- **회전끼리**: $\alpha$ 돌리고 $\beta$ 돌리는 것과 $\beta$ 돌리고 $\alpha$ 돌리는 것은 둘 다 $\alpha + \beta$ 돌리는 것이다.
- **축 방향 늘이기끼리**: 가로를 2배 하고 세로를 3배 하는 것은 순서와 상관없다.
- **[항등 행렬](t:t.identity)의 수배와는 무엇이든**: 아래 관문.

::predict p-center

> [!직관] 그래서 순서를 읽는 습관이 중요하다
> 행렬 곱이 나오면 오른쪽부터, 곧 입력에 가까운 쪽부터 읽는다. $AB\mathbf{x}$는 "$\mathbf{x}$에 $B$를 하고, 그다음 $A$를 한다"이다. 9권의 $U\Sigma V^{\mathsf{T}}$도 이 습관으로 읽는다.`,
      proof: String.raw`반례 하나로 충분하다. $R = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$, $D = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$이라 하자. [열마다 곱하면](why:prop.matmul-columns)

$$RD = \begin{bmatrix} 0 & -1 \\ 2 & 0 \end{bmatrix}, \qquad DR = \begin{bmatrix} 0 & -2 \\ 1 & 0 \end{bmatrix}$$

이고, 첫째 열부터 $(0, 2) \ne (0, 1)$이다.`,
    },
    {
      id: 'prop.associative',
      kind: 'prop',
      title: '(AB)C = A(BC): 결합법칙은 공짜다',
      status: 'written',
      requires: ['def.composition'],
      predicts: [
        {
          id: 'p-twelve',
          kind: 'choice',
          q: String.raw`30° 회전 $R_{30°}$를 12번 곱한 $R_{30°}R_{30°}\cdots R_{30°}$ (12개)는?`,
          hints: [String.raw`곱 하나하나를 계산하지 말고 기하로 생각하라. 30°씩 12번 돌리면 모두 몇 도를 돈 것인가? 그리고 괄호를 어디에 치든 결과가 같은가?`],
          choices: [String.raw`항등 행렬 $I$`, String.raw`$12R_{30°}$`, String.raw`$R_{30°}$`, '괄호를 어떻게 치느냐에 따라 다르다'],
          answer: 0,
          why: [
            String.raw`30° × 12 = 360°, 한 바퀴를 돌아 제자리다. 어떤 순서로 묶어 계산해도 "차례로 12번 돌린다"는 같은 변환이다.`,
            String.raw`행렬을 12번 **곱하는** 것과 12배 하는 것은 다르다. 12배는 모든 벡터를 12배 늘인다.`,
            String.raw`그것은 13번 곱했을 때(390° = 30°)다.`,
            String.raw`이 노드의 명제가 바로 "괄호의 위치는 결과를 바꾸지 않는다"이다.`,
          ],
        },
      ],
      body: String.raw`행렬 셋을 곱할 때 $(AB)C$로 계산하든 $A(BC)$로 계산하든 같을까? 성분을 다 전개해서 확인할 수도 있지만, 그럴 필요가 없다.

**명제.** $(AB)C = A(BC)$이다. 그래서 괄호 없이 $ABC$라고 써도 된다.

::predict p-twelve

### 계산 없이 증명되는 이유
두 쪽 모두 같은 변환, "**$C$를 하고, $B$를 하고, $A$를 한다**"를 나타낸다. [합성](t:t.composition)은 "차례로 한다"는 뜻이고, 차례로 하는 일을 둘씩 어떻게 묶어 부르든 일어나는 일은 같다. 아래 증명은 이 말을 식으로 옮긴 것이다.

### 숫자로 한 번 확인
$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$, $C = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$이라 하자. 이 이름 $C$는 이 문단에서만 쓴다.
- $AB = \begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$이고 $(AB)C = \begin{bmatrix} 1 & -2 \\ 1 & 0 \end{bmatrix}$.
- $BC = \begin{bmatrix} 0 & -2 \\ 1 & 0 \end{bmatrix}$이고 $A(BC) = \begin{bmatrix} 1 & -2 \\ 1 & 0 \end{bmatrix}$.

같다. 계산 경로는 달랐지만 도착점은 같다.

> [!주의] 결합법칙과 교환법칙은 다르다
> [순서를 바꾸면 달라진다](n:prop.noncommutative). 괄호의 **위치**를 바꾸는 것은 괜찮지만, 행렬의 **순서**를 바꾸면 안 된다.`,
      proof: String.raw`아무 입력 $\mathbf{x}$에서 두 쪽의 출력을 비교한다. [행렬 곱의 정의](why:def.composition)를 되풀이해 쓰면

$$((AB)C)\mathbf{x} = (AB)(C\mathbf{x}) = A(B(C\mathbf{x})), \qquad (A(BC))\mathbf{x} = A((BC)\mathbf{x}) = A(B(C\mathbf{x}))$$

이다. 모든 입력에서 출력이 같으므로 두 행렬은 같다. ($\mathbf{x} = \mathbf{e}_j$를 넣으면 두 행렬의 $j$번째 열이 같아진다.)`,
    },
    {
      id: 'def.shape',
      kind: 'def',
      title: '모양 m×n: 몇 차원에서 몇 차원으로',
      status: 'written',
      introduces: {
        terms: [{ id: 't.shape', ko: '모양', en: 'shape', everyday: true, gloss: '행렬의 행 개수 × 열 개수. m×n 행렬은 ℝⁿ의 벡터를 받아 ℝᵐ의 벡터를 내놓는다.' }],
        symbols: [
          { tex: 'm', meaning: '행렬의 행 개수 = 출력 차원' },
          { tex: 'n', meaning: '행렬의 열 개수 = 입력 차원' },
        ],
      },
      requires: ['def.matvec', 'def.dimension'],
      predicts: [
        {
          id: 'p-io',
          kind: 'choice',
          q: '행이 3개, 열이 2개인 행렬은 무엇을 받아 무엇을 내놓을까?',
          hints: [String.raw`[열 하나는 입력 기저 벡터 하나의 도착지다](n:def.matrix). 열이 몇 개이면 입력 기저 벡터가 몇 개인가? 그리고 열 하나(도착지 벡터)에는 성분이 몇 개 있는가?`],
          choices: ['성분 2개짜리 벡터를 받아 3개짜리를 내놓는다', '성분 3개짜리를 받아 2개짜리를 내놓는다', '3개짜리를 받아 3개짜리를 내놓는다', '2개짜리를 받아 2개짜리를 내놓는다'],
          answer: 0,
          why: [
            String.raw`열이 2개 = 입력 기저 벡터 2개 = 입력 성분 2개. 열 하나의 길이(행의 수) 3 = 출력 성분 3개.`,
            String.raw`가장 흔한 혼동이다. "3×2"를 왼쪽부터 "3에서 2로"라고 읽으면 틀린다. 앞의 수(행)가 **출력**, 뒤의 수(열)가 **입력**이다.`,
            String.raw`입력 성분의 수는 행렬-벡터 곱에서 열을 몇 개 섞는지, 곧 열의 수다.`,
            String.raw`출력은 열 벡터들의 선형 결합이므로 열의 길이(3)만큼 성분을 가진다.`,
          ],
        },
        {
          id: 'p-fill',
          kind: 'choice',
          q: '3×2 행렬의 출력들은 3차원 공간 전체를 채울 수 있을까?',
          hints: [String.raw`모든 출력은 두 열의 [선형 결합](n:def.linear-combination)이다. 벡터 두 개의 [스팬](n:def.span)은 가장 커 봐야 무엇인가?`],
          choices: ['없다. 가장 커 봐야 원점을 지나는 평면 하나다', '있다. 출력이 3차원 벡터이므로', '열을 잘 고르면 있다', '없다. 언제나 직선 하나다'],
          answer: 0,
          why: [
            String.raw`출력은 모두 두 열의 선형 결합이고, 두 벡터가 스팬하는 것은 평면(두 열이 독립일 때) 이하다.`,
            String.raw`출력이 3차원 공간에 **산다**는 것과 3차원 공간을 **채운다**는 것은 다르다.`,
            String.raw`열이 두 개뿐이라 어떻게 골라도 평면을 넘지 못한다.`,
            String.raw`두 열이 독립이면 평면이다. 직선이 되는 것은 두 열이 같은 직선 위에 있을 때다.`,
          ],
        },
      ],
      body: String.raw`지금까지는 평면에서 평면으로 가는 2×2 행렬만 보았다. 그런데 행렬의 정의, "기저의 도착지를 열로 나란히"는 차원이 달라도 그대로 쓸 수 있다.

**정의.** 행이 $m$개, 열이 $n$개인 행렬의 [모양](def:t.shape)을 $m \times n$이라 쓴다. $m \times n$ 행렬은 $\mathbb{R}^n$의 벡터를 받아 $\mathbb{R}^m$의 벡터를 내놓는다.

::predict p-io

### 축의 뜻을 하나씩
- **열의 수 $n$ = 입력 차원.** 입력 공간 $\mathbb{R}^n$의 표준 기저 $\mathbf{e}_1, \dots, \mathbf{e}_n$마다 도착지가 하나씩 필요하고, 도착지 하나가 열 하나다.
- **행의 수 $m$ = 출력 차원.** 열 하나(도착지 하나)는 출력 공간의 벡터이므로 성분이 $m$개다.
- 성분 $a_{ij}$의 **뒤 첨자 $j$는 입력 축**(몇 번째 입력 성분이 보탠 것인가), **앞 첨자 $i$는 출력 축**(출력의 몇 번째 성분인가)을 가리킨다.

이 규약은 신경망의 가중치에도 그대로 쓰인다. 10권에서 다시 만난다.

### 두 모양을 3차원으로 보기
아래 왼쪽은 입력, 오른쪽은 출력이다. 3차원 그림은 끌어서 돌려 볼 수 있다.

::scene b2-shape3 {"mode": "3x2"}

3×2 행렬은 평면의 격자를 3차원 공간 안의 기울어진 평면으로 보낸다.

::predict p-fill

::scene b2-shape3 {"mode": "2x3"}

2×3 행렬은 3차원의 단위 정육면체를 평면 위로 납작하게 누른다. 열이 세 개이므로 평면 위에 화살표가 셋 생긴다. 평면 위의 화살표 셋은 [선형 독립](t:t.lin-indep)일 수 없으므로, 3차원의 어떤 방향은 반드시 원점으로 사라진다.

### 두 개의 예
- $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0.8 & 0.5 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \end{bmatrix} = 1\begin{bmatrix} 1 \\ 0 \\ 0.8 \end{bmatrix} + 2\begin{bmatrix} 0 \\ 1 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 1.8 \end{bmatrix}$ (3×2: 성분 2개 → 3개)
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} = 1\begin{bmatrix} 1 \\ 0 \end{bmatrix} + 2\begin{bmatrix} 0 \\ 1 \end{bmatrix} + 3\begin{bmatrix} 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 7 \\ -1 \end{bmatrix}$ (2×3: 성분 3개 → 2개)`,
      code: ['shape'],
    },
    {
      id: 'prop.shape-rule',
      kind: 'prop',
      title: '곱할 수 있는 조건: 안쪽 차원이 같아야 한다',
      status: 'written',
      requires: ['def.shape', 'def.composition'],
      predicts: [
        {
          id: 'p-rule',
          kind: 'choice',
          q: String.raw`$A$가 2×3, $B$가 3×4이다. $AB$와 $BA$의 모양은?`,
          hints: [
            String.raw`$AB$는 $B$를 먼저 한다. $B$는 성분 몇 개를 받아 몇 개를 내놓는가? 그 출력을 $A$가 받을 수 있는가?`,
            String.raw`$BA$는 $A$를 먼저 한다. $A$의 출력은 성분 2개다. $B$는 성분 몇 개를 받는가?`,
          ],
          choices: ['AB는 2×4이고, BA는 곱할 수 없다', 'AB는 3×3이고, BA는 4×2다', 'AB는 2×4이고, BA는 4×2다', '둘 다 곱할 수 없다'],
          answer: 0,
          why: [
            String.raw`$B$: 4개 → 3개, 이어서 $A$: 3개 → 2개. 그래서 $AB$: 4개 → 2개, 곧 2×4다. $BA$는 $A$의 출력(2개)을 $B$가 받아야 하는데 $B$는 4개를 받으므로 이어지지 않는다.`,
            String.raw`안쪽 수 3끼리 맞춰야 하는데 바깥쪽 수를 맞춘 것이다.`,
            String.raw`$AB$는 맞다. 그러나 $BA$에서는 안쪽 수가 4와 2로 맞지 않는다. 거의 맞는 답이다.`,
            String.raw`$AB$는 안쪽 수가 3과 3으로 맞으므로 곱할 수 있다.`,
          ],
        },
      ],
      body: String.raw`2×2 행렬끼리는 언제나 곱할 수 있었다. 모양이 다르면 어떻게 될까?

::predict p-rule

**명제.** $A$가 $m \times k$, $B$가 $k' \times n$일 때, $AB$는 $k = k'$일 때만 정의되고, 그때 모양은 $m \times n$이다. 이 문단의 $k$, $k'$은 안쪽 차원을 가리키는 이 노드만의 이름이다.

$$\underbrace{A}_{m \times k}\ \underbrace{B}_{k \times n} = \underbrace{AB}_{m \times n}$$

외우는 법보다 **이유**가 중요하다. $AB$는 "$B$ 다음 $A$"다. $B$가 내놓는 벡터(성분 $k'$개)를 $A$가 받을 수 있어야(성분 $k$개를 받아야) 두 변환이 이어진다. 그래서 안쪽 두 수가 같아야 한다. 그리고 전체는 $B$의 입력($n$개)을 받아 $A$의 출력($m$개)을 내놓으므로 $m \times n$이다.

### 두 개의 예
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$(2×3)과 $\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$(3×1): 안쪽 3 = 3이므로 곱할 수 있고, 결과는 2×1이다. [앞 노드](n:def.shape)의 계산대로 $(7, -1)$이다. 벡터 하나는 열이 하나뿐인 행렬로 볼 수 있다.
- 같은 두 행렬을 반대 순서로 곱하면 (3×1)(2×3)이 되어 안쪽 1 ≠ 2이므로 곱할 수 없다.

> [!직관] 텐서의 축을 맞추는 일
> 신경망 코드에서 "모양이 맞지 않는다"는 오류는 거의 언제나 이 규칙을 어긴 것이다. 그때마다 "먼저 하는 쪽의 출력 축과 나중에 하는 쪽의 입력 축이 같은가"를 물으면 된다.`,
      proof: String.raw`$AB$는 [합성 변환의 행렬](why:def.composition)이다. 합성 $\mathbf{x} \mapsto A(B\mathbf{x})$가 뜻을 가지려면 $B\mathbf{x}$가 $A$의 입력이 될 수 있어야 한다. [모양의 정의](why:def.shape)에 따라 $B\mathbf{x}$는 성분이 $k'$개이고 $A$는 성분 $k$개짜리 벡터를 받으므로 $k = k'$이어야 한다. 그때 합성은 $\mathbb{R}^n$의 벡터를 받아 $\mathbb{R}^m$의 벡터를 내놓으므로, 그 행렬은 열이 $n$개(입력 기저마다 하나)이고 각 열의 성분이 $m$개다. 곧 $m \times n$이다.`,
    },
  ],
};
export default book;
