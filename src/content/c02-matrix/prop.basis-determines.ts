import type { NodeDef } from '../schema';

const node: NodeDef = {
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
};

export default node;
