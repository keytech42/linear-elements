import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.sym-ellipse',
  kind: 'prop',
  title: '대칭 행렬은 단위원을 고유벡터 축의 타원으로 보낸다',
  status: 'written',
  introduces: { terms: [{ id: 't.ellipse', ko: '타원', en: 'ellipse', gloss: '원을 서로 수직인 두 방향으로 각각 다른 배율로 늘인 모양. 배율 하나가 0이면 선분으로 납작해진다.' }] },
  requires: ['prop.spectral', 'prop.orthogonal-preserves'],
  predicts: [
    {
      id: 'p-axis',
      kind: 'point',
      q: String.raw`$S = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이 단위원을 보낸 곡선에서 **가장 길게 늘어난 쪽**을 만드는 입력 방향을 노란 손잡이로 맞춰라.`,
      hints: [
        String.raw`[스펙트럼 정리](n:prop.spectral): 대칭 행렬은 서로 수직인 두 고유 방향을 따로 늘인다. 가장 많이 늘어나는 것은 어느 고윳값의 방향일까?`,
      ],
      A: [[2, 1], [1, 2]],
      target: 'v1',
      show: ['circle', 'tgrid'],
      reveal: String.raw`정답은 대각선 $(1, 1)$ 방향, 곧 가장 큰 고윳값 3의 고유벡터다. 가장 짧게 늘어나는 방향은 그와 수직인 $(1, -1)$, 고윳값 1의 고유벡터다. 흰 곡선(단위원의 상)의 두 축이 정확히 두 고유 방향 위에 놓인다.`,
    },
    {
      id: 'p-nonsym',
      kind: 'point',
      q: String.raw`이번에는 대칭이 **아닌** $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$이다. 고유 방향은 가로축 $(1, 0)$과 대각선 $(1, 1)$이다. 단위원 위에서 가장 많이 늘어나는 입력 방향을 노란 손잡이로 맞춰라.`,
      hints: [
        String.raw`대칭 행렬에서는 답이 고유 방향이었다. 이 행렬에서도 그런지 의심해 보라. 두 열 $(1, 0)$, $(2, 3)$ 가운데 어느 쪽이 더 긴가?`,
        String.raw`$\mathbf{e}_2$ 방향 입력은 길이 $\sqrt{13} \approx 3.6$인 둘째 열로 간다. 대각선 $(1, 1)/\sqrt{2}$은 $3/\sqrt{2}\cdot(1, 1)$, 길이 3으로 간다. 그 사이 어딘가를 찾아라.`,
      ],
      A: [[1, 2], [0, 3]],
      target: 'v1',
      show: ['cols', 'circle'],
      reveal: String.raw`정답은 약 80.8°, 곧 $(0.160, 0.987)$ 방향이다. 고유 방향 0°, 45° 어느 쪽과도 다르다. 그러므로 대칭이 아닌 행렬에서는 "가장 많이 늘어나는 방향"과 "자기 직선에 남는 방향"이 다른 것이다. 이 방향의 정체가 9장의 첫 주제다.`,
    },
  ],
  body: String.raw`[스펙트럼 정리](t:t.spectral)는 대칭 행렬을 "돌리고, 수직인 두 축 방향으로 늘이고, 되돌려 돌리는" 변환으로 읽게 해 준다. 그렇다면 대칭 행렬은 [단위원](t:t.unit-circle)을 무엇으로 보낼까?

::predict p-axis

### 이름 붙이기: 타원
원을 서로 수직인 두 방향으로 각각 다른 배율로 늘인 모양을 [타원](def:t.ellipse)이라 한다. 두 방향을 타원의 **축**, 각 방향으로 늘어난 길이를 **반지름**이라 부른다. 배율 하나가 0이면 타원은 선분으로 납작해지고, 두 배율이 같으면 원이다.

**명제.** 대칭 행렬 $S = Q\Lambda Q^{\mathsf{T}}$는 단위원을, 축이 $\mathbf{q}_1, \mathbf{q}_2$ 방향이고 반지름이 $|\lambda_1|, |\lambda_2|$인 타원으로 보낸다.

::scene c8-spectral {"probe": true}

그림에서 노란 탐침을 단위원 위에서 돌려 보라. 탐침이 하늘색 고유 방향에 오면 분홍 출력이 타원의 한 축 끝에 닿는다.

::predict p-nonsym

아래 그림은 대칭이 아닌 행렬 $\begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$이다. 흰 점선이 타원의 축이고, 하늘·연두 직선이 고유 방향이다. 둘이 어긋나 있다.

::scene c8-spectral {"S": [[1, 2], [0, 3]], "mirror": false, "axes": true}

그렇다면 대칭이 아닌 행렬에서 타원의 축은 어디서 오는가? 축을 만드는 입력 방향은 서로 수직인가? 이것이 9장의 첫 질문이다.`,
  proof: String.raw`$S\mathbf{x} = Q(\Lambda(Q^{\mathsf{T}}\mathbf{x}))$를 오른쪽부터 따라간다.

1. $Q^{\mathsf{T}}$는 직교 행렬이므로 [길이를 바꾸지 않는다](why:prop.orthogonal-preserves). 그래서 단위원 위의 점을 단위원 위의 점으로 보내고, 단위원 전체를 단위원 전체로 보낸다(되돌리는 $Q$도 단위원을 단위원으로 보내기 때문이다).
2. $\Lambda$는 가로 방향을 $\lambda_1$배, 세로 방향을 $\lambda_2$배 한다. 그래서 단위원을 축이 $\mathbf{e}_1, \mathbf{e}_2$이고 반지름이 $|\lambda_1|, |\lambda_2|$인 타원으로 보낸다. 배율이 음수이면 그 방향으로 뒤집히지만, 원은 원점에 대해 대칭이므로 상의 모양은 반지름 $|\lambda|$짜리와 같다. 이것이 [타원의 정의](t:t.ellipse) 그대로다.
3. $Q$는 $\mathbf{e}_1$을 $\mathbf{q}_1$로, $\mathbf{e}_2$를 $\mathbf{q}_2$로 보내면서 길이와 직각을 지킨다. 그래서 2의 타원을 축이 $\mathbf{q}_1, \mathbf{q}_2$인 같은 크기의 타원으로 옮긴다.`,
  checks: [
    {
      q: String.raw`$S = \begin{bmatrix} 3 & 0 \\ 0 & -1 \end{bmatrix}$은 단위원을 어떤 타원으로 보내는가?`,
      choices: ['가로 반지름 3, 세로 반지름 1인 타원', '가로 반지름 3, 세로로는 뒤집혀서 타원이 아니다', '가로 반지름 3인 선분', '반지름 3인 원'],
      answer: 0,
      explain: String.raw`세로 방향의 배율 $-1$은 뒤집기다. 그러나 원은 위아래가 대칭이므로 뒤집어도 모양이 같고, 반지름은 $|-1| = 1$이다. 뒤집힘은 모양이 아니라 "원 위의 어느 점이 어디로 가는지"에만 흔적을 남긴다. 9장에서 이 차이가 [특이값](fwd:t.singular-value)(언제나 0 이상)과 고윳값(음수일 수 있음)의 차이가 된다.`,
    },
  ],
};

export default node;
