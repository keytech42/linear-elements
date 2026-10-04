import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.span',
  kind: 'def',
  title: '스팬: 닿을 수 있는 모든 곳',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.span', ko: '스팬', en: 'span', everyMention: true, gloss: '주어진 벡터들의 선형 결합으로 만들 수 있는 모든 벡터의 모임.' },
      { id: 't.parallel', ko: '평행하다', en: 'parallel', surfaces: ['평행하다', '평행하지', '평행하면', '평행하므로', '평행하거나', '평행한', '평행할'], gloss: '두 벡터 가운데 하나가 다른 하나의 스칼라 배이다. 영벡터는 모든 벡터와 평행하다. (평행 이동의 "평행"과는 다른 말이다.)' },
    ],
    symbols: [{ tex: String.raw`\operatorname{span}`, meaning: '스팬(span)' }],
  },
  requires: ['def.linear-combination'],
  predicts: [
    {
      id: 'p-parallel',
      kind: 'choice',
      q: String.raw`$\mathbf{u} = (1, 2)$로 고정하고 $\mathbf{w} = (2, t)$의 둘째 성분 $t$만 바꾼다. 두 벡터의 스팬이 평면 전체가 **아닌** $t$는?`,
      hints: [
        String.raw`스팬이 평면보다 작아지는 것은 두 벡터가 [같은 직선 위에 놓일 때](n:def.scalar-mul)다. 곧 $\mathbf{w}$가 $\mathbf{u}$의 스칼라 배일 때다.`,
        String.raw`$\mathbf{w}$의 첫째 성분은 $\mathbf{u}$의 첫째 성분의 2배다. 그렇다면 둘째 성분도 몇 배여야 하는가?`,
      ],
      choices: [String.raw`$t = 4$일 때뿐`, String.raw`$t = 1$일 때뿐`, String.raw`$t = 0$일 때뿐`, String.raw`그런 $t$는 없다. 벡터가 두 개이면 언제나 평면 전체다`],
      answer: 0,
      why: [
        String.raw`$t = 4$이면 $\mathbf{w} = (2, 4) = 2\mathbf{u}$로 같은 직선 위에 있다. 그때 스팬은 그 직선 하나다. 그 밖의 $t$에서는 평면 전체다.`,
        String.raw`성분의 자리를 바꿔 $(2, 1)$을 떠올렸을 수 있다. $(2, 1)$은 $(1, 2)$의 스칼라 배가 아니다(가로 대 세로가 $2 : 1$과 $1 : 2$로 다르다).`,
        String.raw`$\mathbf{w} = (2, 0)$은 가로 방향이고 $\mathbf{u} = (1, 2)$는 비스듬하다. 서로 다른 직선 위에 있으므로 스팬은 평면 전체다. 성분에 0이 있다고 해서 스팬이 작아지지는 않는다.`,
        String.raw`벡터의 **개수**만으로는 정해지지 않는다. 두 벡터가 같은 직선 위에 있으면 둘째 벡터는 새로운 쪽을 보태지 못한다.`,
      ],
    },
    {
      id: 'p-shift',
      kind: 'choice',
      q: String.raw`$\mathbf{u}$, $\mathbf{w}$가 같은 직선 위에 있지 않다. 그렇다면 $\operatorname{span}(\mathbf{u},\ \mathbf{u} + \mathbf{w})$는 무엇일까?`,
      hints: [
        String.raw`$\mathbf{u}$와 $\mathbf{u} + \mathbf{w}$로 $\mathbf{w}$를 만들 수 있는가? 두 벡터를 [빼 보라](n:def.scalar-mul).`,
        String.raw`$\mathbf{w}$를 만들 수 있다면, $\mathbf{u}$와 $\mathbf{w}$로 만들 수 있던 모든 것을 만들 수 있다. $c_1\mathbf{u} + c_2\mathbf{w}$에서 $\mathbf{w}$ 자리에 $(\mathbf{u} + \mathbf{w}) - \mathbf{u}$를 넣어 보라.`,
      ],
      choices: ['평면 전체', String.raw`$\mathbf{u}$가 놓인 직선`, String.raw`$\mathbf{u} + \mathbf{w}$가 놓인 직선`, String.raw`$\mathbf{u}$, $\mathbf{w}$에 따라 다르다`],
      answer: 0,
      why: [
        String.raw`$\mathbf{w} = (\mathbf{u} + \mathbf{w}) - \mathbf{u}$이므로 $c_1\mathbf{u} + c_2\mathbf{w} = (c_1 - c_2)\mathbf{u} + c_2(\mathbf{u} + \mathbf{w})$다. $\mathbf{u}$, $\mathbf{w}$로 닿던 곳(평면 전체)에 모두 닿는다.`,
        String.raw`$\mathbf{u} + \mathbf{w}$ 안에 $\mathbf{u}$가 "들어 있으니" 새로운 것이 없다고 본 것이다. 그러나 $\mathbf{u} + \mathbf{w}$에는 $\mathbf{w}$도 들어 있고, 그 부분이 $\mathbf{u}$의 직선을 벗어난다.`,
        String.raw`$\mathbf{u}$ 자체가 $\mathbf{u} + \mathbf{w}$의 직선 위에 있지 않다. 두 벡터가 서로 다른 직선 위에 있으므로 직선 하나로 줄어들지 않는다.`,
        String.raw`$\mathbf{u}$, $\mathbf{w}$가 같은 직선 위에 있지 않다는 조건만 있으면 언제나 평면 전체다. 계수를 바꿔 적는 위의 계산이 어떤 $\mathbf{u}$, $\mathbf{w}$에도 통한다.`,
      ],
    },
  ],
  body: String.raw`계수를 마음대로 바꿀 수 있다면, [선형 결합](t:t.linear-combination)으로 닿을 수 있는 곳은 모두 어디일까?

**정의.** 벡터 $\mathbf{u}$, $\mathbf{w}$의 선형 결합으로 만들 수 있는 모든 벡터의 모임을 $\mathbf{u}$와 $\mathbf{w}$의 [스팬](def:t.span)이라 하고 다음처럼 쓴다. "스팬"은 영어 span을 소리 나는 대로 적은 이름이다. 우리말로 "생성"이라 옮기기도 하지만, 이 교재는 대학 강의와 현업에서 실제로 쓰는 "스팬"을 쓴다. 동사로는 "스팬한다"고 한다. 예를 들어 "두 벡터가 평면을 스팬한다"는 두 벡터의 스팬이 평면 전체라는 뜻이다.
$$\operatorname{span}(\mathbf{u}, \mathbf{w}) = \{\, c_1\mathbf{u} + c_2\mathbf{w} \;:\; c_1, c_2 \text{는 아무 수} \,\}$$
중괄호 $\{\ \}$는 "이런 것들을 모두 모은 모임"이라는 뜻이고, 쌍점 뒤는 그 조건이다. 벡터가 하나뿐이면 $\operatorname{span}(\mathbf{u}) = \{\, c\mathbf{u} \,\}$이고, 셋 이상이어도 같은 방식으로 정한다.

### 벡터 하나의 스팬
$\operatorname{span}(\mathbf{u})$는 $\mathbf{u}$의 스칼라 배 전체다. [앞에서 보았듯이](why:def.scalar-mul) $\mathbf{u} \ne \mathbf{0}$이면 이것은 원점을 지나는 직선이고, $\mathbf{u} = \mathbf{0}$이면 원점 한 점이다. 아래 그림에서 "점 200개 찍기"를 눌러 보라. 계수를 무작위로 골라 끝점을 찍는다.

::scene c1-span {"u": [1, 2], "one": true, "presets": false}

### 벡터 두 개의 스팬
두 벡터의 스팬은 두 경우로 나뉜다. 둘을 가르는 말을 먼저 정한다. 두 벡터 가운데 하나가 다른 하나의 스칼라 배일 때, 두 벡터가 [평행하다](def:t.parallel)고 하자. 예를 들어 $(1, 2)$와 $(-2, -4)$는 $(-2, -4) = -2\cdot(1, 2)$이므로 평행하다. 영벡터는 $\mathbf{0} = 0\mathbf{u}$이므로 어떤 벡터와도 평행하다.

- **평행하면** 스팬은 직선 하나(둘 다 영벡터이면 원점 한 점)다. 예를 들어 $\mathbf{w} = c\mathbf{u}$이면 $c_1\mathbf{u} + c_2\mathbf{w} = c_1\mathbf{u} + c_2c\,\mathbf{u} = (c_1 + c_2c)\mathbf{u}$로, [여덟 규칙](why:prop.vector-rules)에 따라 결국 $\mathbf{u}$의 스칼라 배이기 때문이다. 둘째 벡터는 새로운 곳을 하나도 보태지 못한다.
- **평행하지 않으면** 스팬은 평면 전체다. 이것은 아래에서 증명한다.

::predict p-parallel

답은 $t = 4$일 때뿐이다. 그때 $\mathbf{w} = (2, 4) = 2\mathbf{u}$로 평행하다. 아래 그림에서 단추를 눌러 네 경우를 비교해 보라. 점을 찍은 뒤 화살표 끝을 끌면, 점들이 계수를 그대로 둔 채 함께 움직인다. 두 화살표를 평행하게 만드는 순간 점들이 한 직선으로 납작해진다.

::scene c1-span {"u": [1, 2], "w": [2, -1], "fill": 400}

### 왜 평행하지 않으면 평면 전체인가
평면의 아무 점 $(x, y)$를 목표로 잡고, $c_1\mathbf{u} + c_2\mathbf{w} = (x, y)$가 되는 계수를 찾는다. [성분으로 적으면](why:prop.add-componentwise) 두 식이다.
$$c_1u_1 + c_2w_1 = x, \qquad c_1u_2 + c_2w_2 = y$$
첫 식에 $w_2$를, 둘째 식에 $w_1$을 곱해서 빼면 $c_2$가 사라지고, 첫 식에 $u_2$를, 둘째 식에 $u_1$을 곱해서 빼면 $c_1$이 사라진다.
$$c_1\,(u_1w_2 - u_2w_1) = xw_2 - yw_1, \qquad c_2\,(u_1w_2 - u_2w_1) = u_1y - u_2x$$
두 식에 같은 수 $u_1w_2 - u_2w_1$이 나온다. 이 수가 0이 아니면 그것으로 나누어
$$c_1 = \frac{xw_2 - yw_1}{u_1w_2 - u_2w_1}, \qquad c_2 = \frac{u_1y - u_2x}{u_1w_2 - u_2w_1}$$
를 얻는다. 거꾸로 이 $c_1$, $c_2$를 처음 두 식에 넣으면 실제로 성립한다. 첫 식의 왼쪽은 $\dfrac{(xw_2 - yw_1)u_1 + (u_1y - u_2x)w_1}{u_1w_2 - u_2w_1} = \dfrac{x(u_1w_2 - u_2w_1)}{u_1w_2 - u_2w_1} = x$이고, 둘째 식도 같은 계산으로 $y$가 된다. 그러므로 **$u_1w_2 - u_2w_1 \ne 0$이면 평면의 모든 점에 닿는다.**

남은 일은 "$u_1w_2 - u_2w_1 = 0$인 것은 정확히 두 벡터가 평행할 때"임을 보이는 것이다.

- 평행하면 0이다. $\mathbf{w} = c\mathbf{u}$이면 $u_1(cu_2) - u_2(cu_1) = 0$이다($\mathbf{u} = c\mathbf{w}$일 때도 같다).
- 0이면 평행하다. $\mathbf{u} = \mathbf{0}$이면 이미 평행하다. $\mathbf{u} \ne \mathbf{0}$이고 $u_1 \ne 0$이면 $c = w_1/u_1$로 두자. 그러면 $w_1 = cu_1$이고, $u_1w_2 = u_2w_1$을 $u_1$로 나누면 $w_2 = u_2w_1/u_1 = cu_2$이므로 $\mathbf{w} = c\mathbf{u}$다. $u_1 = 0$이면 $u_2 \ne 0$이고, $0 = u_1w_2 - u_2w_1 = -u_2w_1$이고 $-u_2 \ne 0$이므로, [곱이 0이면 한쪽은 0](why:prop.arith-first)이라는 사실에 따라 $w_1 = 0$이다. $c = w_2/u_2$로 두면 $\mathbf{w} = (0, w_2) = c\,(0, u_2) = c\mathbf{u}$다.

따라서 평행하지 않은 두 벡터의 스팬은 평면 전체다. 수 $u_1w_2 - u_2w_1$은 위 그림의 오른쪽 칸에도 나온다. 이 수는 4장에서 [행렬식](fwd:t.determinant)이라는 이름으로 다시 만난다.

수치로 두 번 확인한다.
- $\mathbf{u} = (2, 1)$, $\mathbf{w} = (-1, 1)$, 목표 $(1, 4)$: $u_1w_2 - u_2w_1 = 2 + 1 = 3$이고, $c_1 = \tfrac{1\cdot1 - 4\cdot(-1)}{3} = \tfrac{5}{3}$, $c_2 = \tfrac{2\cdot4 - 1\cdot1}{3} = \tfrac{7}{3}$이다. [앞 노드](n:def.linear-combination)에서 구한 답과 같다.
- $\mathbf{u} = (1, 2)$, $\mathbf{w} = (2, -1)$, 목표 $(3, 1)$: $u_1w_2 - u_2w_1 = -1 - 4 = -5$이고, $c_1 = \tfrac{3\cdot(-1) - 1\cdot2}{-5} = 1$, $c_2 = \tfrac{1\cdot1 - 2\cdot3}{-5} = 1$이다. 실제로 $(1, 2) + (2, -1) = (3, 1)$이다.

::predict p-shift

답은 평면 전체다. 이 관문이 보여 주는 것은, 스팬은 벡터를 바꿔 끼워도 같을 수 있다는 점이다. 스팬을 정하는 것은 벡터 하나하나가 아니라 **그 벡터들이 보태는 방향**이다.

### 정리
- 영벡터만: 원점 한 점
- 영벡터가 아닌 벡터 하나, 또는 평행한 두 벡터(둘 다 영벡터는 아님): 원점을 지나는 직선
- 평행하지 않은 두 벡터: 평면 전체

어느 경우든 스팬은 원점을 지나고, 그 안의 벡터끼리 더하거나 스칼라를 곱해도 스팬 밖으로 나가지 않는다. 이런 모임을 6장에서 [부분공간](fwd:t.subspace)이라 부른다.`,
  checks: [
    {
      q: String.raw`$\operatorname{span}\big((0, 0),\ (3, 1)\big)$은?`,
      choices: ['원점을 지나는 직선', '평면 전체', '원점 한 점', String.raw`직선 두 개`],
      answer: 0,
      explain: String.raw`영벡터는 $0\cdot(3, 1)$이므로 $(3, 1)$과 평행하다. 영벡터는 새로운 곳을 하나도 보태지 못한다. 그러므로 스팬은 $(3, 1)$의 직선이다. 벡터가 두 개라는 이유로 평면 전체를 고르기 쉽다.`,
    },
    {
      q: '다음 가운데 스팬이 평면 전체인 쌍은?',
      choices: [String.raw`$(1, 1)$과 $(1, -1)$`, String.raw`$(1, 2)$과 $(-1, -2)$`, String.raw`$(0, 0)$과 $(1, 0)$`, String.raw`$(2, 4)$와 $(1, 2)$`],
      answer: 0,
      explain: String.raw`$u_1w_2 - u_2w_1$을 계산하면 차례로 $-1 - 1 = -2$, $-2 + 2 = 0$, $0$, $4 - 4 = 0$이다. 0이 아닌 것은 첫째 쌍뿐이다. 둘째 쌍은 서로 반대쪽을 가리키지만 같은 직선 위에 있다. 반대쪽을 가리키는 것은 "다른 방향"이 아니다.`,
    },
  ],
  code: ['cross2', 'reachCoeffs'],
};

export default node;
