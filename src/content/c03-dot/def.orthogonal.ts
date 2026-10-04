import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.orthogonal',
  kind: 'def',
  title: '직교와 정규직교',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.orthogonal', ko: '직교', en: 'orthogonal', gloss: '두 벡터의 내적이 0인 관계. 기하적으로는 서로 수직. 영벡터는 모든 벡터와 직교한다.' },
      { id: 't.orthonormal', ko: '정규직교', en: 'orthonormal', gloss: '서로 직교하고 각각의 길이가 1인 벡터들의 모임.' },
    ],
  },
  requires: ['prop.dot-geometric'],
  predicts: [
    {
      id: 'p-zerovec',
      kind: 'choice',
      q: String.raw`영벡터 $\mathbf{0}$은 $(1, 2)$와 직교할까?`,
      hints: [String.raw`"수직"을 각으로 정의하면 영벡터는 방향이 없어서 판정할 수 없다. 그런데 아래 정의는 각이 아니라 무엇으로 직교를 판정하는가?`],
      choices: ['그렇다. 내적이 0이므로', '아니다. 영벡터는 방향이 없어 각을 잴 수 없으므로', '판정할 수 없다', '아니다. 영벡터는 길이가 0이므로'],
      answer: 0,
      why: [
        String.raw`$\mathbf{0}\cdot(1, 2) = 0$이다. 직교를 내적으로 정의하면 영벡터도 판정되고, 모든 벡터와 직교한다.`,
        String.raw`각으로는 판정할 수 없다는 것은 맞다. 그래서 직교를 각이 **아니라** 내적으로 정의한다. 그러면 영벡터도 빠짐없이 판정된다. 정의를 고르는 이유가 바로 이것이다.`,
        String.raw`내적으로 정의했으므로 언제나 판정할 수 있다.`,
        String.raw`길이가 0이라는 것이 오히려 내적을 0으로 만든다.`,
      ],
    },
    {
      id: 'p-perp',
      kind: 'choice',
      q: String.raw`$(a, b)$에 직교하고 길이가 같은 벡터는? (영벡터가 아닌 $(a, b)$)`,
      hints: [String.raw`$(a, b)\cdot(p, q) = ap + bq$가 0이 되려면 $(p, q)$를 어떻게 고르면 되는가? 성분의 자리를 바꾸고 한쪽에 부호를 붙여 보라.`],
      choices: ['(−b, a)', '(b, a)', '(−a, −b)', '(a, −b)'],
      answer: 0,
      why: [
        String.raw`$a(-b) + ba = 0$이고 길이는 $\sqrt{b^2 + a^2}$로 같다. 2장에서 본 [90° 회전](n:prop.rotation-matrix)의 결과와 같다. 반대쪽 $(b, -a)$도 답이다.`,
        String.raw`$(a, b)\cdot(b, a) = 2ab$이므로 $a$나 $b$가 0일 때만 직교한다. 부호 하나를 빠뜨렸다.`,
        String.raw`그것은 반대 방향(180°)이다. 내적이 $-(a^2 + b^2)$로 가장 작다.`,
        String.raw`그것은 가로축에 비친 것이다. 내적은 $a^2 - b^2$이다.`,
      ],
    },
  ],
  body: String.raw`"수직"이라는 말을 그림 없이, 계산만으로 판정하고 싶다.

**정의.** 두 벡터의 [내적](t:t.dot)이 0이면 두 벡터가 [직교](def:t.orthogonal)한다고 한다. 영벡터가 아닌 두 벡터라면 [앞 노드](why:prop.dot-geometric)에 따라 $\cos\theta = 0$, 곧 사이의 각이 90°라는 뜻이다.

::predict p-zerovec

**정의.** 벡터들이 서로 둘씩 모두 직교하고, 각각의 길이가 1이면 [정규직교](def:t.orthonormal)라 한다.

정규직교인 벡터들은 "서로 독립적인 방향을 하나씩 맡은 길이 1짜리 자"다. 표준 기저 $\mathbf{e}_1, \mathbf{e}_2$가 대표적인 예다: $\mathbf{e}_1\cdot\mathbf{e}_2 = 0$, $\|\mathbf{e}_1\| = \|\mathbf{e}_2\| = 1$.

::predict p-perp

### 두 개의 예
- $(1, 1)/\sqrt{2}$와 $(1, -1)/\sqrt{2}$: 내적 $(1 - 1)/2 = 0$, 길이 각각 1. 정규직교다. 표준 기저를 45° 돌린 것이다.
- $(1, 2, 2)/3$, $(2, 1, -2)/3$, $(2, -2, 1)/3$: 둘씩 내적하면 $(2 + 2 - 4)/9 = 0$, $(2 - 4 + 2)/9 = 0$, $(4 - 2 - 2)/9 = 0$이고 길이는 모두 1이다. 3차원의 정규직교 벡터 셋이다.

정규직교 벡터들은 9장까지 계속 등장한다. 9장의 [특이값 분해](fwd:t.svd)가 만드는 $U$와 $V$의 열이 바로 정규직교 벡터들이다.`,
  checks: [
    {
      q: String.raw`$(3, t)$가 $(2, -6)$과 직교하는 $t$는?`,
      choices: ['1', '−1', '3', '9'],
      answer: 0,
      explain: String.raw`$3\cdot2 + t\cdot(-6) = 6 - 6t = 0$에서 $t = 1$. 직교 조건은 방정식 하나로 바뀐다.`,
    },
  ],
};

export default node;
