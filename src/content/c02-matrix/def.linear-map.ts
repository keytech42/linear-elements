import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c2-additive {}

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
};

export default node;
