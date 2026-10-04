import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.rank',
  kind: 'def',
  title: '랭크: 출력 공간의 차원',
  status: 'written',
  introduces: {
    terms: [{ id: 't.rank', ko: '랭크', en: 'rank', gloss: '열공간의 차원. 변환이 살려 두는 독립 방향의 개수.' }],
    symbols: [{ tex: String.raw`\operatorname{rank} A`, meaning: '행렬 A의 랭크' }],
  },
  requires: ['def.column-space'],
  predicts: [
    {
      id: 'p-r3',
      kind: 'choice',
      q: String.raw`3×3 행렬의 세 열이 $(1, 0, 0)$, $(0, 1, 0)$, $(1, 1, 0)$이다. 랭크는?`,
      hints: [String.raw`셋째 열은 앞의 두 열로 만들 수 있는가? 그렇다면 [새 방향을 보태지 못한다](n:def.independence).`],
      choices: ['2', '3', '1', '0'],
      answer: 0,
      why: [
        String.raw`셋째 열 = 첫째 + 둘째이므로 열공간은 앞의 두 열이 펼치는 평면(바닥, $z = 0$)이다. 차원 2.`,
        String.raw`열이 셋이라고 랭크가 3인 것은 아니다. 독립인 방향의 수를 센다.`,
        String.raw`첫째와 둘째 열은 같은 직선 위에 있지 않다.`,
        String.raw`0은 모든 열이 영벡터일 때뿐이다.`,
      ],
    },
    {
      id: 'p-max',
      kind: 'choice',
      q: '3×5 행렬(행 3개, 열 5개)의 랭크가 될 수 있는 가장 큰 값은?',
      hints: [String.raw`열은 5개이지만, 열 하나하나는 성분이 몇 개인 벡터인가? 그 공간 안에서 독립인 벡터는 최대 몇 개인가?`],
      choices: ['3', '5', '15', '8'],
      answer: 0,
      why: [
        String.raw`열 5개는 모두 $\mathbb{R}^3$의 벡터이고, $\mathbb{R}^3$에서 독립인 벡터는 최대 3개다([차원](n:def.dimension)). 그래서 랭크는 $\min(\text{행}, \text{열}) = 3$을 넘지 못한다.`,
        String.raw`열의 개수만 보았다. 열이 사는 공간의 차원(행의 수)도 한계를 준다.`,
        String.raw`성분의 개수는 랭크와 관계없다.`,
        String.raw`행과 열의 수를 더할 이유가 없다.`,
      ],
    },
  ],
  body: String.raw`[열공간](t:t.column-space)이 직선인지, 평면인지, 공간 전체인지를 수 하나로 말하고 싶다.

**정의.** 열공간의 [차원](t:t.dimension)을 행렬의 [랭크](def:t.rank)라 하고 $\operatorname{rank} A$로 쓴다. 곧 열들 가운데 서로 독립인 것의 최대 개수다. 기하적으로는 "변환이 출력 쪽에 살려 두는 방향의 수"다.

::scene c6-space {"mode": "col"}

::predict p-r3

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 랭크 1. 평면이 직선으로 눌린다.
- 2×2 회전: 랭크 2. 아무것도 눌리지 않는다.

::predict p-max

> [!직관] 9장으로 가는 길
> 랭크 1인 행렬은 모든 출력을 직선 하나로 모은다. 9장에서 모든 행렬을 "랭크 1 행렬들의 합"으로 쪼개고, 그 가운데 중요한 몇 개만 남겨 행렬을 압축한다. 10장의 [LoRA](fwd:t.lora)는 처음부터 랭크가 낮은 행렬만 배운다. 랭크는 "이 변환에 실제로 들어 있는 정보의 차원"이다.`,
  checks: [
    {
      q: '랭크가 1인 3×3 행렬은 3차원 공간을 어떻게 보이게 하는가?',
      choices: ['공간 전체를 원점을 지나는 직선 하나로 누른다', '공간을 평면 하나로 누른다', '공간 전체를 원점 하나로 누른다', '공간을 그대로 두고 돌리기만 한다'],
      answer: 0,
      explain: String.raw`열공간의 차원이 1이므로 모든 출력이 한 직선 위에 있다. 평면으로 누르는 것은 랭크 2, 점으로 누르는 것은 랭크 0(영행렬)이다.`,
    },
  ],
  code: ['rank'],
};

export default node;
