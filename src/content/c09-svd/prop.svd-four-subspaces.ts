import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.svd-four-subspaces',
  kind: 'prop',
  title: 'SVD는 네 기본 부분공간에 좌표를 준다',
  status: 'written',
  requires: ['prop.svd', 'exp.four-subspaces'],
  predicts: [
    {
      id: 'p-v3',
      kind: 'choice',
      q: String.raw`랭크가 2인 3×3 행렬에서, 특이값이 0인 우특이벡터 $\mathbf{v}_3$는 네 부분공간 가운데 어디에 속할까?`,
      choices: ['영공간', '행공간', '열공간', '좌영공간'],
      answer: 0,
      why: [
        String.raw`$\|A\mathbf{v}_3\| = \sigma_3 = 0$이므로 $A\mathbf{v}_3 = \mathbf{0}$이다. 0으로 사라지는 입력, 곧 영공간이다.`,
        String.raw`행공간의 0이 아닌 벡터는 0이 아닌 출력을 낸다(행공간은 영공간과 직교하므로 영공간과 겹치는 벡터는 $\mathbf{0}$뿐이다). $\mathbf{v}_3$의 출력은 0이다.`,
        String.raw`$\mathbf{v}$들은 입력 공간의 벡터다. 열공간은 출력 공간에 있다.`,
        String.raw`$\mathbf{v}$들은 입력 공간의 벡터다. 좌영공간은 출력 공간에 있다.`,
      ],
    },
  ],
  body: String.raw`6장에서 모든 행렬에 [네 기본 부분공간](n:exp.four-subspaces)이 있다는 것을 보았다. 입력 쪽의 [행공간](t:t.row-space)과 [영공간](t:t.null-space), 출력 쪽의 [열공간](t:t.column-space)과 [좌영공간](t:t.left-null)이다. 그런데 그 지도에는 좌표가 없었다. 각 공간이 몇 차원인지는 알았지만, 각 공간을 펼치는 "좋은" 기저가 무엇인지는 몰랐다. SVD는 네 공간 모두에 **정규직교** 기저를 한꺼번에 준다.

::predict p-v3

**명제.** $A$가 $m \times n$이고 $\operatorname{rank} A$개의 특이값이 0보다 크다고 하자(나머지는 0). 그러면
- $\mathbf{v}_1, \dots$ 가운데 앞의 $\operatorname{rank} A$개는 **행공간**의 정규직교 기저이고, 나머지 $\mathbf{v}_i$들은 **영공간**의 정규직교 기저다.
- $\mathbf{u}_1, \dots$ 가운데 앞의 $\operatorname{rank} A$개는 **열공간**의 정규직교 기저이고, 나머지 $\mathbf{u}_i$들은 **좌영공간**의 정규직교 기저다.
- 행공간의 $\mathbf{v}_i$는 $A$에 의해 열공간의 $\mathbf{u}_i$로, 정확히 $\sigma_i$배 늘어나 짝지어진다.

이렇게 보면 행렬이 하는 일 전체가 한 문장으로 요약된다. **입력 공간을 "살아남는 방향들"과 "사라지는 방향들"로 직교하게 나누고, 살아남는 방향들을 하나씩 출력의 방향에 짝지어 늘인다. 출력의 나머지 방향에는 아무것도 닿지 않는다.**

::scene c9-subspaces3 {}

### 장면에서 볼 것
행렬 $A = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 1 & 2 & 1 \end{bmatrix}$의 셋째 행은 첫째 행 + 둘째 행이다. 그래서 랭크가 2다. 특이값은 정확히 $3,\ 1,\ 0$이다($A^{\mathsf{T}}A$의 고윳값이 9, 1, 0).
- 왼쪽(입력): 노란 단위 구 위에 초록 $\mathbf{v}_1, \mathbf{v}_2$가 행공간 평면을 펼친다. 점선 $\mathbf{v}_3$이 영공간이다.
- 오른쪽(출력): 단위 구가 분홍 **납작한 타원판**이 된다. 그 판이 놓인 평면이 열공간이고, 판에 수직인 점선 $\mathbf{u}_3$이 좌영공간이다.
- 행렬의 셋째 행을 바꿔 랭크를 3으로 만들면 판이 부풀어 타원체가 된다. 영공간과 좌영공간은 사라진다.

### 예 (2×2)
랭크 1인 $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: [앞에서](n:prop.svd-ata) 구한 대로 $\sigma_1 = 5$, $\sigma_2 = 0$, $\mathbf{v}_1 = (1, 2)/\sqrt{5}$, $\mathbf{v}_2 = (-2, 1)/\sqrt{5}$다. 행공간은 $\mathbf{v}_1$ 방향(행 $(1, 2)$의 방향과 같다), 영공간은 $\mathbf{v}_2$ 방향이다. $\mathbf{u}_1 = A\mathbf{v}_1/5 = (1, 2)/\sqrt{5}$는 열공간의 방향(열 $(1, 2)$의 방향과 같다), $\mathbf{u}_2 = (-2, 1)/\sqrt{5}$는 좌영공간의 방향이다. 이 행렬은 대칭이라 입력 쪽과 출력 쪽 공간이 같은 직선이지만, 일반적으로는 다르다.`,
  proof: String.raw`**영공간.** 특이값이 0인 $i$에 대해 $\|A\mathbf{v}_i\|^2 = \sigma_i^2 = 0$이므로 $A\mathbf{v}_i = \mathbf{0}$이다. 그래서 이런 $\mathbf{v}_i$들은 영공간에 있다. 그 개수는 $n - \operatorname{rank}A$이고, [영공간의 차원도 정확히 그만큼](why:prop.rank-nullity)이다. 정규직교 벡터들은 [선형 독립](t:t.lin-indep)이므로, 영공간 안에서 그 차원만큼의 독립 벡터는 기저가 된다.

**행공간.** [행공간은 영공간과 직교한다](why:prop.row-null-perp). 앞의 $\operatorname{rank}A$개의 $\mathbf{v}_i$는 영공간의 기저인 나머지 $\mathbf{v}_j$와 모두 직교한다. 그런데 입력 공간 $\mathbb{R}^n$에서 영공간에 수직인 벡터 전체가 행공간이고, 행공간의 차원은 $\operatorname{rank}A$다. 그 안에서 $\operatorname{rank}A$개의 정규직교 벡터는 기저가 된다. (여기서 "영공간에 수직인 것 전체 = 행공간"은 [6장의 네 부분공간 지도에서 차원을 세어 얻은 사실](why:exp.four-subspaces)이다.)

**열공간.** $\sigma_i > 0$이면 $\mathbf{u}_i = A(\mathbf{v}_i/\sigma_i)$이므로 $\mathbf{u}_i$는 출력이 닿는 곳, 곧 열공간에 있다. 개수가 $\operatorname{rank}A$ = [열공간의 차원](why:def.rank)이고 정규직교이므로 기저다.

**좌영공간.** 나머지 $\mathbf{u}_i$는 앞의 $\mathbf{u}$들, 곧 열공간의 기저와 모두 직교한다. 그러므로 열공간 전체와 직교하고, 그것이 좌영공간이다. 다른 식으로 보면, $A^{\mathsf{T}} = V\Sigma^{\mathsf{T}}U^{\mathsf{T}}$에서 $A^{\mathsf{T}}\mathbf{u}_i = \sigma_i\mathbf{v}_i = \mathbf{0}$이다.`,
  checks: [
    {
      q: '5×3 행렬의 특이값이 4, 2, 0이다. 네 부분공간의 차원은 (행공간, 영공간, 열공간, 좌영공간) 순서로?',
      choices: ['(2, 1, 2, 3)', '(3, 0, 3, 2)', '(2, 1, 2, 1)', '(2, 3, 2, 1)'],
      answer: 0,
      explain: String.raw`0보다 큰 특이값이 2개이므로 랭크는 2다. 입력은 $\mathbb{R}^3$이므로 영공간은 $3 - 2 = 1$차원이다. 출력은 $\mathbb{R}^5$이므로 좌영공간은 $5 - 2 = 3$차원이다. 입력 쪽 두 공간의 차원을 더하면 열의 수 3, 출력 쪽 두 공간의 차원을 더하면 행의 수 5다.`,
    },
  ],
  code: ['svd'],
};

export default node;
