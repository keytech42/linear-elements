import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c2-warp {"map": "linear", "line": true}

그림의 단추로 휘기와 소용돌이로 바꿔 보라. 같은 간격의 점들이 간격을 잃고, 곧은 선이 휜다. 평행 이동은 2~4번을 모두 지키지만 원점을 옮기므로(1번) 선형이 아니다.

### 이 성질이 주는 눈
격자가 고르게 남는다는 것은 **칸 하나만 보면 전체를 안다**는 뜻이다. 원점에 붙은 칸 하나(단위 정사각형)가 어떤 평행사변형으로 가는지 보면, 나머지 칸들은 그것을 옆으로 이어 붙인 것이다. 다음 노드에서 이 관찰을 정확한 명제로 만든다.`,
  proof: String.raw`1번은 [앞 노드](why:def.linear-map)에서 보였다.

점 $\mathbf{p}$를 지나고 방향이 $\mathbf{d}$인 직선 위의 점은 $\mathbf{p} + s\mathbf{d}$($s$는 아무 수) 꼴이다. 여기에 $T$를 하면

$$T(\mathbf{p} + s\mathbf{d}) = T(\mathbf{p}) + sT(\mathbf{d})$$

이다([두 조건을 차례로 썼다](why:def.linear-map)). 오른쪽은 점 $T(\mathbf{p})$를 지나고 방향이 $T(\mathbf{d})$인 직선 위의 점이다(2번). 만약 $T(\mathbf{d}) = \mathbf{0}$이면 모든 점이 $T(\mathbf{p})$ 하나로 모인다.

평행한 직선들은 방향 $\mathbf{d}$가 같다. 그 상들의 방향은 모두 $T(\mathbf{d})$이므로 서로 평행하다(3번).

같은 간격의 점들은 $s = 0, 1, 2, \dots$처럼 고르게 놓인 $s$에 해당한다. 상 $T(\mathbf{p}) + sT(\mathbf{d})$에서도 $s$가 한 칸 늘 때마다 같은 $T(\mathbf{d})$만큼 나아가므로 간격이 고르다(4번).`,
};

export default node;
