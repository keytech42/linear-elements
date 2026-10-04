import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.distance',
  kind: 'def',
  title: '거리: 두 점 사이의 길이',
  status: 'written',
  introduces: { terms: [{ id: 't.distance', ko: '거리', en: 'distance', everyday: true, gloss: '두 점을 잇는 선분의 길이. 좌표로는 √(가로 차이² + 세로 차이²).' }] },
  requires: ['prop.pythagoras', 'def.plane'],
  predicts: [
    {
      id: 'p-d',
      kind: 'choice',
      q: String.raw`두 점 $(1, 1)$과 $(4, 5)$ 사이의 거리는?`,
      hints: [String.raw`한 점에서 다른 점으로 가로로 얼마, 세로로 얼마 움직이는가? 두 이동은 서로 수직이므로 직각삼각형의 두 직각변이 된다.`],
      choices: ['5', '7', String.raw`$\sqrt{7}$`, '25'],
      answer: 0,
      why: [
        String.raw`가로 차이 3, 세로 차이 4. $\sqrt{9 + 16} = 5$.`,
        String.raw`$3 + 4 = 7$은 가로로 갔다가 세로로 간 **길**의 길이다. 곧게 가는 거리는 그보다 짧다.`,
        String.raw`$3 + 4$의 제곱근이다. 제곱하기 전에 더해 버렸다.`,
        String.raw`$25$는 거리의 **제곱**이다. 제곱근을 빠뜨렸다. 거의 맞는 답이다.`,
      ],
    },
    {
      id: 'p-lattice',
      kind: 'choice',
      q: '원점에서 거리가 정확히 5이고, 두 좌표가 모두 정수인 점은 모두 몇 개일까?',
      hints: [
        String.raw`$x^2 + y^2 = 25$를 만족하는 정수 쌍을 찾는 문제다. 25를 두 제곱수의 합으로 쓰는 방법: $0 + 25$, $9 + 16$, $16 + 9$, $25 + 0$.`,
        String.raw`각 방법마다 좌표의 부호(±)를 바꿀 수 있다. 0은 부호를 바꿔도 같다는 점에 주의하라.`,
      ],
      choices: ['12개', '4개', '8개', '무한히 많다'],
      answer: 0,
      why: [
        String.raw`$(\pm5, 0)$, $(0, \pm5)$로 4개, $(\pm3, \pm4)$로 4개, $(\pm4, \pm3)$으로 4개. 모두 12개다.`,
        String.raw`축 위의 네 점 $(\pm5, 0)$, $(0, \pm5)$만 셌다. $9 + 16 = 25$인 점들도 있다.`,
        String.raw`$(\pm3, \pm4)$와 $(\pm4, \pm3)$만 셌다. 축 위의 네 점을 빠뜨렸다.`,
        String.raw`원 위의 점은 무한히 많지만, **두 좌표가 모두 정수인** 점은 12개뿐이다.`,
      ],
    },
  ],
  body: String.raw`좌표평면 위의 두 점 사이의 거리는 어떻게 계산할까? 자를 대고 재지 않고 좌표만으로 구하고 싶다.

::scene c0-distance {}

두 점 $P$, $Q$가 있다. $P$에서 가로로만 움직여 $Q$의 가로 좌표에 맞추고(주황), 이어서 세로로만 움직여 $Q$에 닿는다(청록). [가로 이동과 세로 이동은 서로 수직이므로](n:def.plane) 세 점은 직각삼각형을 이루고, 선분 $PQ$가 그 빗변이다.

**정의.** 두 점 $P = (p_1, p_2)$, $Q = (q_1, q_2)$ 사이의 [거리](def:t.distance)는

$$\sqrt{(q_1 - p_1)^2 + (q_2 - p_2)^2}$$

이다. [피타고라스 정리](why:prop.pythagoras)가 이 식의 근거다. 이 네 글자 $p_1, p_2, q_1, q_2$는 이 노드에서만 쓰는 이름이다.

::predict p-d

### 빼는 순서는 상관없다
$Q$에서 $P$로 재든 $P$에서 $Q$로 재든 거리는 같다. 차이의 부호가 바뀌어도 제곱하면 같기 때문이다: $(-3)^2 = 9 = 3^2$. [왜 음수의 제곱은 양수인가?](why:prop.neg-times-neg)

::predict p-lattice

::scene c0-distance {"lattice": 5}

### 두 개의 예
- $(1, 1)$과 $(4, 5)$: $\sqrt{3^2 + 4^2} = 5$.
- $(-2, 3)$과 $(1, -1)$: 가로 차이 3, 세로 차이 $-4$이므로 $\sqrt{9 + 16} = 5$. 부호가 달라도 같은 거리다.

원점 $(0, 0)$에서 점 $(x, y)$까지의 거리는 $\sqrt{x^2 + y^2}$이다. 이 식은 3장에서 화살표의 길이를 재는 [노름](fwd:t.norm)으로 다시 나온다.`,
  checks: [
    {
      q: String.raw`원점에서 점 $(-6, 8)$까지의 거리는?`,
      choices: ['10', '2', '14', '100'],
      answer: 0,
      explain: String.raw`$\sqrt{36 + 64} = \sqrt{100} = 10$. 음수 좌표도 제곱하면 양수가 된다. 100은 거리의 제곱이다.`,
    },
  ],
  code: ['distance'],
};

export default node;
