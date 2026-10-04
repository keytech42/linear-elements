import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.svd-sum',
  kind: 'prop',
  title: '행렬 = 랭크 1 \'층\'들의 합',
  status: 'written',
  introduces: {
    terms: [{ id: 't.svd-layer', ko: "'층'", en: 'rank-one term', surfaces: ["'층'"], gloss: 'SVD의 한 항 σᵢuᵢvᵢᵀ(랭크 1 행렬)를 이 교재가 비유로 부르는 이름. 행렬은 \'층\'들의 합이고, σᵢ가 큰 \'층\'부터 줄을 선다. 비유이므로 언제나 작은따옴표를 붙인다.' }],
  },
  requires: ['prop.svd', 'def.outer-product'],
  predicts: [
    {
      id: 'p-drop',
      kind: 'choice',
      q: String.raw`'층' 2를 버리고 '층' 1 $\sigma_1\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}}$만 남기면, 출력은 어떻게 될까?`,
      choices: [String.raw`모든 출력이 $\mathbf{u}_1$ 방향의 직선 위로 모인다`, String.raw`$\mathbf{x}$가 $\mathbf{v}_1$ 위에 있을 때만 바뀌고, 나머지는 그대로다`, '\'층\' 2는 작으니 아무것도 눈에 띄게 바뀌지 않는다', '모든 출력이 0이 된다'],
      answer: 0,
      why: [
        String.raw`'층' 1은 바깥곱이므로 랭크 1이다. 출력은 $(\mathbf{v}_1\cdot\mathbf{x})$배 한 $\mathbf{u}_1$뿐이다.`,
        String.raw`거꾸로다. $\mathbf{x}$가 $\mathbf{v}_1$ 위에 있으면 '층' 2는 원래 0을 내므로 아무것도 바뀌지 않는다. 바뀌는 것은 나머지 방향들이다.`,
        String.raw`출력의 **크기**로는 크게 다르지 않을 수 있다($\sigma_2$가 작다면). 그러나 **모양**은 크게 바뀐다. 평면 전체가 직선 하나로 접힌다.`,
        String.raw`$\mathbf{v}_1$에 수직인 입력만 0으로 간다.`,
      ],
    },
  ],
  body: String.raw`[특이값 분해](t:t.svd) $A = U\Sigma V^{\mathsf{T}}$를 "회전, 늘이기, 회전"이 아닌 다른 방식으로 읽을 수 있을까? [바깥곱](t:t.outer-product)을 써서 읽어 보자.

**명제.**

$$A = \sigma_1\,\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}} + \sigma_2\,\mathbf{u}_2\mathbf{v}_2^{\mathsf{T}} \quad\left(n\text{차원에서는 } A = \sum_i \sigma_i\,\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}\right)$$

각 항 $\sigma_i\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}$는 랭크 1 행렬이다. 이 항을 ['층'](def:t.svd-layer)이라 부르자. '층' $i$는 입력을 $\mathbf{v}_i$ 방향으로 읽고, $\sigma_i$배 해서, $\mathbf{u}_i$ 방향으로 쓴다.

> [!비유] '층'이라는 이름
> 행렬을 랭크 1 행렬들의 합으로 나눈 것을, 층을 쌓은 것에 빗댄다. 비유가 덮는 것은 둘이다. '층'을 모두 합치면 원래 행렬이 되고, 빠지거나 남는 것이 없다. 그리고 '층'마다 두께에 해당하는 $\sigma_i$가 있어서, 두꺼운 '층'부터 차례로 놓인다. 비유가 깨지는 곳도 있다. 실제 층은 서로 다른 높이에 따로 놓이지만, 이 '층'들은 같은 자리에 겹쳐 **더해진다**. 그래서 한 '층'의 성분이 음수일 수 있고, 다른 '층'과 더해져 서로 지워질 수도 있다.
>
> 이 교재는 이 뜻으로 쓸 때 언제나 작은따옴표를 붙여 '층'이라 적는다. 비유로 붙인 이름이라는 표시다. 교과서에서는 보통 풀어서 "랭크 1 항"(rank-one term)이라 부른다.

$$A\mathbf{x} = \sigma_1(\cv{\mathbf{v}_1}\cdot\cx{\mathbf{x}})\,\cu{\mathbf{u}_1} + \sigma_2(\cv{\mathbf{v}_2}\cdot\cx{\mathbf{x}})\,\cu{\mathbf{u}_2}$$

'층'은 $\sigma$가 큰 것부터, 곧 **중요한 것부터** 줄을 선다.

::predict p-drop

::scene c9-layers {}

### 장면에서 볼 것
- 노란 $\mathbf{x}$를 끌면 초록 점 두 개가 움직인다. 초록 점은 $\mathbf{x}$를 $\mathbf{v}_1$, $\mathbf{v}_2$ 방향으로 [정사영](t:t.orth-projection)한 자리다. '층'마다 그 길이에 $\sigma_i$를 곱해 $\mathbf{u}_i$ 방향의 하늘색 화살표를 내보낸다. 두 화살표를 이어 붙이면 분홍 $A\mathbf{x}$다.
- '층' 2를 끄면 격자 전체가 $\mathbf{u}_1$ 방향의 직선 하나로 접힌다. 남은 것은 랭크 1이다. 그래도 분홍 화살표는 원래 $A\mathbf{x}$에서 크게 벗어나지 않는다. $\sigma_2$가 $\sigma_1$보다 작아서 '층' 2의 기여가 작기 때문이다.

### 예
$A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$이면 $\sigma_1 \approx 1.7906$, $\mathbf{u}_1 \approx (0.8161, 0.5780)$, $\mathbf{v}_1 \approx (0.6437, 0.7652)$이고

$$\sigma_1\mathbf{u}_1\mathbf{v}_1^{\mathsf{T}} \approx \begin{bmatrix} 0.9406 & 1.1182 \\ 0.6662 & 0.7919 \end{bmatrix}, \qquad \sigma_2\mathbf{u}_2\mathbf{v}_2^{\mathsf{T}} \approx \begin{bmatrix} 0.2594 & -0.2182 \\ -0.3662 & 0.3081 \end{bmatrix}$$

두 '층'을 더하면 정확히 $A$로 돌아온다. 첫째 '층'만으로도 $A$의 성분과 대략 비슷하다. 둘째 '층'은 "보정"에 해당한다. 장면의 수치와 맞춰 보라.`,
  proof: String.raw`두 행렬이 같다는 것은 모든 입력에 대해 같은 출력을 낸다는 것이다([왜 그것으로 충분한가?](why:prop.basis-determines) 특히 $\mathbf{x} = \mathbf{e}_j$를 넣으면 두 행렬의 $j$번째 열이 같아진다). 그러므로 아무 $\mathbf{x}$에서 양쪽을 비교한다.

왼쪽: $A\mathbf{x} = U(\Sigma(V^{\mathsf{T}}\mathbf{x}))$. [행의 관점](why:prop.row-picture)에서 $V^{\mathsf{T}}$의 행은 $\mathbf{v}_1^{\mathsf{T}}, \mathbf{v}_2^{\mathsf{T}}$이므로 $V^{\mathsf{T}}\mathbf{x} = (\mathbf{v}_1\cdot\mathbf{x}, \mathbf{v}_2\cdot\mathbf{x})$이다. $\Sigma$를 곱하면 $(\sigma_1\,\mathbf{v}_1\cdot\mathbf{x},\ \sigma_2\,\mathbf{v}_2\cdot\mathbf{x})$가 된다. 이 벡터를 $U$에 넣으면, [행렬-벡터 곱의 정의](why:def.matvec)에 따라 성분을 계수로 삼아 $U$의 열 $\mathbf{u}_1, \mathbf{u}_2$를 섞는다.

$$A\mathbf{x} = (\sigma_1\,\mathbf{v}_1\cdot\mathbf{x})\,\mathbf{u}_1 + (\sigma_2\,\mathbf{v}_2\cdot\mathbf{x})\,\mathbf{u}_2$$

오른쪽: [바깥곱의 작용](why:def.outer-product) $(\mathbf{u}\mathbf{v}^{\mathsf{T}})\mathbf{x} = (\mathbf{v}\cdot\mathbf{x})\mathbf{u}$를 '층'마다 쓰면 바로 위 식과 같다. 모든 $\mathbf{x}$에서 같으므로 두 행렬은 같다.`,
  checks: [
    {
      q: '\'층\' 2를 끄고 \'층\' 1만 남긴 행렬 σ₁u₁v₁ᵀ의 랭크와 열공간은?',
      choices: ['랭크 1, 열공간은 u₁ 방향의 직선', '랭크 1, 열공간은 v₁ 방향의 직선', '랭크 2, 열공간은 평면 전체', 'σ₁에 따라 다르다'],
      answer: 0,
      explain: String.raw`바깥곱 $\mathbf{u}\mathbf{v}^{\mathsf{T}}$의 모든 열은 $\mathbf{u}$의 배수다. 그래서 출력은 모두 $\mathbf{u}_1$ 방향의 직선 위에 있다. $\mathbf{v}_1$은 "읽는" 방향이다. $\sigma_1 > 0$이기만 하면 랭크는 1이다.`,
    },
  ],
};

export default node;
