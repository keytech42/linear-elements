import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.linear-combination',
  kind: 'def',
  title: '선형 결합: 손잡이 두 개로 섞기',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.linear-combination', ko: '선형 결합', en: 'linear combination', gloss: '벡터들에 각각 스칼라를 곱해서 더한 것: c₁𝐮 + c₂𝐰.' },
      { id: 't.coefficient', ko: '계수', en: 'coefficient', gloss: '선형 결합에서 각 벡터에 곱하는 스칼라. (랭크와 혼동하지 않도록 rank는 "랭크"라 부른다)' },
    ],
    symbols: [
      { tex: 'c_1', meaning: '선형 결합의 첫째 계수' },
      { tex: 'c_2', meaning: '선형 결합의 둘째 계수' },
    ],
  },
  requires: ['prop.vector-rules'],
  predicts: [
    {
      id: 'p-combo',
      kind: 'point',
      q: String.raw`주황 화살표가 $\mathbf{u} = (2, 1)$, 청록 화살표가 $\mathbf{w} = (-1, 1)$이다. $0.5\,\mathbf{u} + 2\,\mathbf{w}$는 어디에서 끝날까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`[스칼라 곱](n:def.scalar-mul)을 먼저 하고, 그다음 [이어 붙인다](n:def.vector-add).`,
        String.raw`$0.5\,\mathbf{u} = (1, 0.5)$, $2\,\mathbf{w} = (-2, 2)$이다.`,
      ],
      A: [[2, -1], [1, 1]],
      x: [0.5, 2],
      target: 'Ax',
      show: ['cols'],
      colLabels: ['u', 'w'],
      colColors: ['u', 'w'],
      reveal: String.raw`정답은 $(-1, 2.5)$다(초록 화살표. 이름표 "Ax"는 2장의 표기다). 주황 화살표를 절반만 간 $(1, 0.5)$에서, 청록 화살표를 두 번 이어 가면 $(1 - 2,\ 0.5 + 2) = (-1, 2.5)$다. 계수를 서로 바꿔 $2\mathbf{u} + 0.5\mathbf{w}$를 계산했다면 $(4 - 0.5,\ 2 + 0.5) = (3.5, 2.5)$로, 그림의 범위 밖으로 나간다.`,
    },
    {
      id: 'p-coef',
      kind: 'choice',
      q: String.raw`이번에는 거꾸로다. 같은 $\mathbf{u} = (2, 1)$, $\mathbf{w} = (-1, 1)$로 $c_1\mathbf{u} + c_2\mathbf{w} = (1, 4)$를 만들려면 $(c_1, c_2)$가 얼마여야 할까?`,
      hints: [
        String.raw`성분마다 식을 하나씩 세워라. 첫째 성분: $2c_1 - c_2 = 1$. 둘째 성분: $c_1 + c_2 = 4$.`,
        String.raw`두 식을 그대로 더하면 $c_2$가 사라진다. $3c_1 = $ 몇인가?`,
      ],
      choices: [String.raw`$\left(\tfrac{5}{3}, \tfrac{7}{3}\right)$`, String.raw`$(1, 4)$`, String.raw`$(2, 3)$`, '만들 수 없다'],
      answer: 0,
      why: [
        String.raw`두 식을 더하면 $3c_1 = 5$, 그러므로 $c_1 = \tfrac{5}{3}$이고 $c_2 = 4 - \tfrac{5}{3} = \tfrac{7}{3}$이다. 계수가 정수일 필요는 없다.`,
        String.raw`목표의 성분을 그대로 계수로 썼다. $1\cdot(2, 1) + 4\cdot(-1, 1) = (-2, 5)$로 목표와 다르다. 목표의 성분이 곧 계수인 것은 $\mathbf{u} = (1, 0)$, $\mathbf{w} = (0, 1)$일 때뿐이다.`,
        String.raw`거의 맞다. $2\mathbf{u} + 3\mathbf{w} = (4 - 3,\ 2 + 3) = (1, 5)$로 첫째 성분은 맞지만 둘째 성분이 1 넘친다. 두 식을 모두 맞춰야 한다.`,
        String.raw`$\mathbf{u}$와 $\mathbf{w}$는 서로 다른 쪽을 가리키므로 두 손잡이로 평면의 어느 점에나 닿을 수 있다. 다음 노드에서 이것을 증명한다.`,
      ],
    },
  ],
  body: String.raw`벡터 두 개 $\mathbf{u}$, $\mathbf{w}$가 있고, 할 수 있는 일은 스칼라 곱과 덧셈뿐이다. 그 두 가지로 어디까지 갈 수 있을까? 먼저 한 점에 가는 방법부터 이름을 붙인다.

$$\h{combo}{c_1\mathbf{u} + c_2\mathbf{w}}$$

**정의.** 벡터 $\mathbf{u}$, $\mathbf{w}$에 각각 스칼라 $c_1$, $c_2$를 곱해서 더한 벡터 $c_1\mathbf{u} + c_2\mathbf{w}$를 $\mathbf{u}$와 $\mathbf{w}$의 [선형 결합](def:t.linear-combination)이라 한다. 이때 $c_1$, $c_2$를 그 선형 결합의 [계수](def:t.coefficient)라 한다. 벡터가 셋 이상이어도 같다. 각 벡터에 계수를 하나씩 곱해 모두 더한 것이 선형 결합이다.

계수 두 개는 손잡이 두 개와 같다. $c_1$은 "$\mathbf{u}$ 방향으로 몇 걸음", $c_2$는 "$\mathbf{w}$ 방향으로 몇 걸음"이다. 걸음 수는 음수(반대로 걷기)도, 소수(반 걸음)도 될 수 있다. [여덟 규칙](why:prop.vector-rules)이 있으므로 걷는 순서는 상관없다: $c_1\mathbf{u} + c_2\mathbf{w} = c_2\mathbf{w} + c_1\mathbf{u}$.

::predict p-combo

답은 $(-1, 2.5)$다. 아래 그림의 처음 상태가 이 계산이다. 하늘 점선이 $0.5\,\mathbf{u}$, 거기에 이어 붙인 라일락 점선이 $2\,\mathbf{w}$, 흰 화살표가 그 합이다.

::scene c1-combo {"u": [2, 1], "w": [-1, 1], "c1": 0.5, "c2": 2}

### 예
- $c_1 = c_2 = 1$이면 그냥 덧셈 $\mathbf{u} + \mathbf{w}$다. $c_2 = 0$이면 $c_1\mathbf{u}$, 곧 스칼라 곱 하나다. 덧셈과 스칼라 곱은 둘 다 선형 결합의 특별한 경우다.
- $c_1 = c_2 = 0$이면 $0\mathbf{u} + 0\mathbf{w} = \mathbf{0}$이다. $\mathbf{u}$, $\mathbf{w}$가 무엇이든 영벡터는 언제나 만들 수 있다.
- $\mathbf{u} = (1, 0)$, $\mathbf{w} = (0, 1)$이면 $3\mathbf{u} + 2\mathbf{w} = (3, 0) + (0, 2) = (3, 2)$다. 이 두 벡터로는 성분이 곧 계수다. 모든 벡터 $(v_1, v_2)$가 $v_1(1, 0) + v_2(0, 1)$로 쓰인다.
- $\mathbf{u} = (2, 1)$, $\mathbf{w} = (-1, 1)$이면 $1\cdot\mathbf{u} + (-1)\cdot\mathbf{w} = (2 + 1,\ 1 - 1) = (3, 0)$이다.

::predict p-coef

답은 $\left(\tfrac{5}{3}, \tfrac{7}{3}\right)$이다. 계수를 찾는 일은 성분마다 식을 하나씩 세워 푸는 일이다.
$$2c_1 - c_2 = 1, \qquad c_1 + c_2 = 4$$
두 식을 더하면 $3c_1 = 5$이므로 $c_1 = \tfrac{5}{3}$이고, 둘째 식에서 $c_2 = \tfrac{7}{3}$이다. 확인: $\tfrac{5}{3}(2, 1) + \tfrac{7}{3}(-1, 1) = \left(\tfrac{10 - 7}{3},\ \tfrac{5 + 7}{3}\right) = (1, 4)$.

아래 그림에서 직접 손잡이를 돌려 목표에 닿아 보라. 막대로는 $\tfrac{5}{3}$ 같은 수에 정확히 닿기 어려우므로, 가까이 간 뒤 "계수 알려 주기"로 확인하면 된다. "새 목표"를 누르면 다른 점이 나온다.

::scene c1-combo {"u": [2, 1], "w": [-1, 1], "c1": 0, "c2": 0, "target": [1, 4]}

> [!질문] 목표가 어디에 있든 언제나 닿을 수 있을까?
> 위 그림에서 $\mathbf{w}$를 끌어 $\mathbf{u}$와 같은 직선 위에 놓아 보라. 그때는 손잡이를 아무리 돌려도 그 직선을 벗어나지 못한다. 닿을 수 있는 곳 전체가 무엇인지가 다음 노드의 주제, [스팬](fwd:t.span)이다.

> [!코드] 정의가 곧 구현이다
> \`linComb\`은 계수 목록과 벡터 목록을 받아, 각 벡터를 [스칼라 곱](t:t.scalar-mul)(\`scale\`)한 뒤 차례로 [더한다](t:t.vector-add)(\`add\`). 정의를 한 줄씩 옮긴 것이다. 영벡터에서 시작해 하나씩 더해 가므로, 벡터가 몇 개이든 같은 코드가 돈다.`,
  checks: [
    {
      q: String.raw`$\mathbf{u} = (1, 0)$, $\mathbf{w} = (1, 1)$일 때 $c_1\mathbf{u} + c_2\mathbf{w} = (3, 2)$가 되는 계수 $(c_1, c_2)$는?`,
      choices: [String.raw`$(1, 2)$`, String.raw`$(3, 2)$`, String.raw`$(2, 1)$`, '만들 수 없다'],
      answer: 0,
      explain: String.raw`둘째 성분은 $\mathbf{w}$에서만 오므로 $c_2 = 2$다. 첫째 성분 $c_1 + c_2 = 3$에서 $c_1 = 1$이다. 확인: $(1, 0) + 2(1, 1) = (3, 2)$. $(3, 2)$를 고르면 $3(1, 0) + 2(1, 1) = (5, 2)$가 된다. 목표의 성분을 계수로 그대로 쓸 수 있는 것은 $(1, 0)$, $(0, 1)$로 섞을 때뿐이다.`,
    },
    {
      q: String.raw`$\mathbf{u}$, $\mathbf{w}$가 무엇이든 **언제나** 선형 결합으로 만들 수 있는 벡터를 모두 고르면?`,
      choices: [String.raw`$\mathbf{0}$, $\mathbf{u}$, $\mathbf{w}$, $\mathbf{u} + \mathbf{w}$ 모두`, String.raw`$\mathbf{0}$만`, String.raw`$\mathbf{u}$와 $\mathbf{w}$만`, '평면의 모든 벡터'],
      answer: 0,
      explain: String.raw`계수를 $(0, 0)$, $(1, 0)$, $(0, 1)$, $(1, 1)$로 두면 차례로 $\mathbf{0}$, $\mathbf{u}$, $\mathbf{w}$, $\mathbf{u} + \mathbf{w}$다. "평면의 모든 벡터"는 $\mathbf{u}$와 $\mathbf{w}$가 같은 직선 위에 있으면 틀린다. 그때는 그 직선 위의 벡터만 만들 수 있다.`,
    },
  ],
  code: ['linComb'],
};

export default node;
