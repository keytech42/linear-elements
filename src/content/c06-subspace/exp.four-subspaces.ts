import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'exp.four-subspaces',
  kind: 'exp',
  title: '네 기본 부분공간 지도',
  status: 'written',
  introduces: { terms: [{ id: 't.left-null', ko: '왼쪽 영공간', en: 'left null space', surfaces: ['좌영공간'], gloss: 'Aᵀ의 영공간. 줄여서 좌영공간. 열공간과 직교하는, 출력 공간에서 닿을 수 없는 방향들.' }] },
  requires: ['prop.rank-nullity', 'prop.row-null-perp', 'def.transpose'],
  predicts: [
    {
      id: 'p-split',
      kind: 'choice',
      q: String.raw`입력 $\mathbf{x}$를 행공간 조각 $\mathbf{x}_r$과 영공간 조각 $\mathbf{x}_n$의 합으로 나누었다. $A\mathbf{x}$는?`,
      hints: [String.raw`[선형이므로](n:def.linear-map) $A\mathbf{x} = A\mathbf{x}_r + A\mathbf{x}_n$이다. $A\mathbf{x}_n$은?`],
      choices: [String.raw`$A\mathbf{x}_r$`, String.raw`$A\mathbf{x}_n$`, String.raw`$\mathbf{0}$`, String.raw`$\mathbf{x}_r + \mathbf{x}_n$`],
      answer: 0,
      why: [
        String.raw`$A\mathbf{x}_n = \mathbf{0}$이므로 출력은 행공간 조각만으로 정해진다. 영공간 쪽은 출력에 아무 흔적도 남기지 않는다.`,
        String.raw`영공간의 조각은 원점으로 사라진다. 거꾸로다.`,
        String.raw`$\mathbf{x}$가 영공간에 있을 때만 그렇다.`,
        String.raw`그것은 $\mathbf{x}$ 자신이다. 변환을 하지 않았다.`,
      ],
    },
    {
      id: 'p-dims',
      kind: 'choice',
      q: '랭크 1인 2×2 행렬의 네 공간(행공간, 영공간, 열공간, 좌영공간)의 차원은 차례로?',
      hints: [String.raw`입력 2 = 행공간 + 영공간, 출력 2 = 열공간 + 좌영공간. 행공간과 열공간의 차원은 둘 다 랭크다(아래).`],
      choices: ['1, 1, 1, 1', '1, 1, 2, 0', '2, 0, 1, 1', '1, 2, 1, 2'],
      answer: 0,
      why: [
        String.raw`네 공간이 모두 직선이다. 입력 평면은 행공간 직선과 영공간 직선으로, 출력 평면은 열공간 직선과 좌영공간 직선으로 나뉜다.`,
        String.raw`랭크가 1이면 열공간은 직선(1차원)이다.`,
        String.raw`행공간의 차원도 랭크(1)다.`,
        String.raw`입력 평면은 2차원뿐이라 1 + 2가 될 수 없다.`,
      ],
    },
  ],
  openWhys: [],
  body: String.raw`지금까지 본 공간들을 한 장의 지도로 모으자. 모든 행렬 $A$($m \times n$)에는 네 개의 기본 부분공간이 있다.

- **입력 공간 $\mathbb{R}^n$**: [행공간](t:t.row-space)(살아남는 방향, 차원 = 랭크)과 [영공간](t:t.null-space)(사라지는 방향, 차원 = $n$ − 랭크). [둘은 서로 직교한다](why:prop.row-null-perp).
- **출력 공간 $\mathbb{R}^m$**: [열공간](t:t.column-space)(닿을 수 있는 곳, 차원 = 랭크)과 [왼쪽 영공간](def:t.left-null)(닿을 수 없는 방향, 차원 = $m$ − 랭크). 이 교재에서는 이 뒤로 이 공간을 줄여서 **좌영공간**이라 적는다. 좌영공간은 $A^{\mathsf{T}}$의 영공간이고, 열공간과 직교한다($A^{\mathsf{T}}$에 같은 명제를 쓰면 된다).

::scene c6-four {}

왼쪽은 입력 평면, 오른쪽은 출력 평면이다. 노란 $\mathbf{x}$를 끌면 왼쪽에서 행공간 조각과 영공간 조각으로 나뉘고, 오른쪽의 출력은 행공간 조각만으로 정해진다.

::predict p-split

### 행공간의 차원도 랭크다
열공간의 차원을 랭크라 불렀는데, 행공간의 차원도 똑같이 랭크다. [가우스 소거](t:t.elimination)로 보면 이렇다. 행 연산은 행들을 서로 섞고 되돌릴 수 있으므로 행공간을 바꾸지 않는다. 소거가 끝난 계단 모양에서 0이 아닌 행의 수는 피벗의 수 $p$이고, 그 행들은 계단 모양 때문에 서로 독립이다. 그러므로 행공간의 차원은 $p$이고, [p는 랭크와 같았다](n:prop.rank-nullity). 따라서

$$\dim(\text{행공간}) = \dim(\text{열공간}) = \operatorname{rank}A$$

이고, 입력 공간에서 $\dim(\text{행공간}) + \dim N(A) = n$이다. 행공간과 영공간은 직교하고 차원의 합이 $n$이므로, 입력 공간의 모든 벡터는 "행공간 조각 + 영공간 조각"으로 하나뿐인 방식으로 나뉜다.

::predict p-dims

### 이 지도에 아직 없는 것
이 지도는 각 공간이 몇 차원인지는 말해 주지만, 각 공간을 펼치는 **좋은 기저**, 그리고 행공간의 방향 하나하나가 열공간의 어느 방향으로 얼마나 늘어나 가는지는 말해 주지 않는다. 9장의 [특이값 분해](fwd:t.svd)가 이 지도에 좌표를 그려 넣는다.`,
  checks: [
    {
      q: '4×3 행렬의 랭크가 3이다. 영공간과 좌영공간의 차원은?',
      choices: ['0과 1', '1과 0', '0과 0', '1과 1'],
      answer: 0,
      explain: String.raw`입력 3 − 랭크 3 = 0(영공간은 원점뿐, 서로 다른 입력은 서로 다른 출력). 출력 4 − 랭크 3 = 1(출력 공간에 닿지 못하는 방향이 하나 남는다). 그래서 $A\mathbf{x} = \mathbf{b}$는 해가 없거나 하나다.`,
    },
  ],
};

export default node;
