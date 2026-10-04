import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.svd-ata',
  kind: 'prop',
  title: '가장 많이 늘어나는 방향 = AᵀA의 고유벡터',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.singular-value', ko: '특이값', en: 'singular value', gloss: '행렬이 단위원을 보낸 타원의 반지름들. σ₁ ≥ σ₂ ≥ … ≥ 0. AᵀA의 고윳값의 제곱근.' },
      { id: 't.right-singular', ko: '오른쪽 특이벡터', en: 'right singular vector', surfaces: ['우특이벡터'], gloss: '줄여서 우특이벡터. 입력 공간에서, 변환 뒤에도 서로 수직으로 남는 단위 방향들(𝐯ᵢ). AᵀA의 고유벡터.' },
      { id: 't.left-singular', ko: '왼쪽 특이벡터', en: 'left singular vector', surfaces: ['좌특이벡터'], gloss: '줄여서 좌특이벡터. 출력 공간에서, 타원의 축 방향을 가리키는 단위 방향들(𝐮ᵢ = A𝐯ᵢ/σᵢ).' },
    ],
    symbols: [
      { tex: String.raw`\sigma_i`, meaning: 'i번째 특이값' },
      { tex: String.raw`\mathbf{v}_i`, meaning: 'i번째 오른쪽 특이벡터', note: '첨자 없는 𝐯(이름 없는 벡터), 가는 v₁(성분)과 구별' },
      { tex: String.raw`\mathbf{u}_i`, meaning: 'i번째 왼쪽 특이벡터' },
    ],
  },
  requires: ['prop.ata-symmetric', 'prop.spectral', 'exp.circle-to-ellipse'],
  predicts: [
    {
      id: 'p-dir',
      kind: 'point',
      q: String.raw`계산하기 전에 손으로 찾아보자. $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$에서 가장 많이 늘어나는 입력 방향을 노란 손잡이로 맞춰라. 두 열(주황, 청록)을 참고하라.`,
      hints: [
        String.raw`두 열 $\mathbf{a}_1 = (1.2, 0.3)$, $\mathbf{a}_2 = (0.9, 1.1)$은 대체로 같은 쪽(오른쪽 위)을 향한다. 입력 $(\cos\theta, \sin\theta)$의 출력은 $\cos\theta\,\mathbf{a}_1 + \sin\theta\,\mathbf{a}_2$다.`,
        String.raw`두 열을 **같은 부호로** 섞으면 서로 보태고, 반대 부호로 섞으면 서로 깎는다. 그리고 $\mathbf{a}_2$가 $\mathbf{a}_1$보다 길다($\sqrt{2.02}$ 대 $\sqrt{1.53}$).`,
      ],
      A: [[1.2, 0.9], [0.3, 1.1]],
      target: 'v1',
      show: ['cols', 'circle'],
      reveal: String.raw`정답 방향은 약 49.9°, 곧 $(0.644, 0.765)$ 쪽이다. 두 열이 대체로 같은 쪽을 향하므로, 두 열을 같은 부호로 섞는 방향이 많이 늘어난다. 흰 곡선이 단위원의 상이고, 초록 직선이 그 타원의 긴 축을 만드는 입력 방향이다. 아래에서 이 방향을 계산으로 정확히 찾는다.`,
    },
    {
      id: 'p-max',
      kind: 'choice',
      q: String.raw`$c_1^2 + c_2^2 = 1$이라는 조건 아래에서 $\lambda_1 c_1^2 + \lambda_2 c_2^2$이 가질 수 있는 가장 큰 값은? ($\lambda_1 \ge \lambda_2 \ge 0$)`,
      hints: [
        String.raw`$\lambda_1 c_1^2 + \lambda_2 c_2^2$에서 $c_2^2 = 1 - c_1^2$를 넣어 $c_1^2$ 하나에 대한 식으로 바꿔 보라.`,
      ],
      choices: [String.raw`$\lambda_1$`, String.raw`$\lambda_1 + \lambda_2$`, String.raw`$\sqrt{\lambda_1}$`, String.raw`$(\lambda_1 + \lambda_2)/2$`],
      answer: 0,
      why: [
        String.raw`조건 $c_1^2 + c_2^2 = 1$을 전부 $c_1^2$에 몰아주면($c_1^2 = 1$, $c_2 = 0$) 된다. 아래 문단이 이것을 "가중 평균"으로 설명한다.`,
        String.raw`$c_1 = c_2 = 1$로 두고 싶어지지만, 그러면 $c_1^2 + c_2^2 = 2$가 되어 조건을 어긴다. 두 계수는 1을 나눠 가져야 한다.`,
        String.raw`$\sqrt{\lambda_1}$은 늘어난 **길이**의 최댓값이다. 이 식은 길이의 **제곱**이다. 이 차이가 곧 아래의 특이값 정의로 이어진다.`,
        String.raw`$c_1^2 = c_2^2 = 1/2$일 때의 값이다. 가장 큰 값이 아니라 중간값이다.`,
      ],
    },
  ],
  body: String.raw`앞 노드의 식 $\|A\mathbf{x}\|^2 = \mathbf{x}\cdot(A^{\mathsf{T}}A\mathbf{x})$에서 $S = A^{\mathsf{T}}A$라고 쓰자. [S는 대칭이다](why:prop.ata-symmetric). 그러면 8장의 [스펙트럼 정리](t:t.spectral)를 쓸 수 있다. 서로 직교하는 단위 [고유벡터](t:t.eigenvector) $\mathbf{q}_1, \mathbf{q}_2$가 있고, 그 [고윳값](t:t.eigenvalue)을 $\lambda_1 \ge \lambda_2$라 하자. [왜 이런 고유벡터가 있는가?](why:prop.spectral) 그리고 [이 고윳값은 0 이상이다](why:prop.ata-symmetric).

이제 질문은 이것이다. **길이가 1인 입력 $\mathbf{x}$ 가운데 $\mathbf{x}\cdot S\mathbf{x}$를 가장 크게 만드는 것은 무엇인가?**

::predict p-dir

### 고유벡터를 자로 삼아 x를 다시 적기
$\mathbf{q}_1, \mathbf{q}_2$는 [정규직교](t:t.orthonormal) [기저](t:t.basis)이므로 모든 $\mathbf{x}$를 $\mathbf{x} = c_1\mathbf{q}_1 + c_2\mathbf{q}_2$로 쓸 수 있다. 계수는 [정사영](t:t.orth-projection)으로 바로 구한다: $c_i = \mathbf{q}_i\cdot\mathbf{x}$. [왜 내적이 곧 좌표인가?](why:prop.orth-projection)

이 기저로 적으면 두 가지 계산이 아주 단순해진다.

- **길이:** $\|\mathbf{x}\|^2 = (c_1\mathbf{q}_1 + c_2\mathbf{q}_2)\cdot(c_1\mathbf{q}_1 + c_2\mathbf{q}_2) = c_1^2 + c_2^2$. 전개하면 $\mathbf{q}_1\cdot\mathbf{q}_2 = 0$인 항은 사라지고, $\mathbf{q}_i\cdot\mathbf{q}_i = 1$인 항만 남는다. 그래서 $\mathbf{x}$가 단위원 위에 있다는 조건은 $c_1^2 + c_2^2 = 1$이 된다.
- **늘어난 길이:** $S\mathbf{x} = c_1\lambda_1\mathbf{q}_1 + c_2\lambda_2\mathbf{q}_2$ (선형성, 그리고 고유벡터의 정의). 그러므로

$$\|A\mathbf{x}\|^2 = \mathbf{x}\cdot S\mathbf{x} = \lambda_1 c_1^2 + \lambda_2 c_2^2, \qquad c_1^2 + c_2^2 = 1$$

::predict p-max

이 식은 $\lambda_1$과 $\lambda_2$를 $c_1^2 : c_2^2$의 비율로 섞은 **가중 평균**이다. 가중 평균은 두 값 사이에 있다. 그러므로 가장 큰 값 $\lambda_1$은 $c_1^2 = 1$, 곧 $\mathbf{x} = \pm\mathbf{q}_1$일 때 나오고, 가장 작은 값 $\lambda_2$는 $\mathbf{x} = \pm\mathbf{q}_2$일 때 나온다.

### 이름 붙이기
**정의.** $A^{\mathsf{T}}A$의 고윳값을 큰 것부터 $\lambda_1 \ge \lambda_2 \ge 0$이라 할 때,
- $\sigma_i = \sqrt{\lambda_i}$를 $A$의 $i$번째 [특이값](def:t.singular-value)이라 한다. $\sigma_1$은 단위 입력이 가장 많이 늘어난 길이, $\sigma_2$는 가장 적게 늘어난 길이다.
- 그 고유벡터 $\mathbf{v}_i = \mathbf{q}_i$를 [오른쪽 특이벡터](def:t.right-singular)라 한다(입력 공간의 방향).
- $\sigma_i > 0$이면 $\mathbf{u}_i = A\mathbf{v}_i / \sigma_i$를 [왼쪽 특이벡터](def:t.left-singular)라 한다(출력 공간의 방향). 정의에서 바로 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$이다.

이 교재에서는 이 뒤로 두 이름을 줄여서 각각 **우특이벡터**, **좌특이벡터**라 적는다.

::scene c9-svd-ellipse {"svd": true}

### 앞 노드의 "놀라운 사실"이 풀린다
- **입력 쪽 두 방향이 수직인 이유:** $\mathbf{v}_1, \mathbf{v}_2$는 대칭 행렬 $A^{\mathsf{T}}A$의 서로 다른 고윳값의 고유벡터다. 대칭 행렬의 그런 고유벡터는 언제나 직교한다. [왜?](why:prop.spectral)
- **출력 쪽 두 축도 수직인 이유:** 아래 증명의 둘째 부분.
- **고유 방향과 다른 이유:** 특이벡터는 $A$의 고유벡터가 아니라 $A^{\mathsf{T}}A$의 고유벡터다. $A$가 대칭이면 $A^{\mathsf{T}}A = A^2$이 되고, 이때는 $A$의 고유벡터가 그대로 $A^2$의 고유벡터이므로 두 방향이 같아진다. 8장에서 본 그림이 바로 이 특별한 경우였다.

### 예
- 앞 노드의 $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$: $A^{\mathsf{T}}A = \begin{bmatrix} 1.53 & 1.41 \\ 1.41 & 2.02 \end{bmatrix}$의 [특성방정식](t:t.char-eq)은 $\lambda^2 - 3.55\lambda + 1.1025 = 0$이고, 근은 $\lambda_1 \approx 3.2062$, $\lambda_2 \approx 0.3439$다. 따라서 $\sigma_1 \approx 1.7906$, $\sigma_2 \approx 0.5864$. 그림의 수치와 비교해 보라. 검산: $\sigma_1\sigma_2 \approx 1.05$이고 $\det A = 1.2\cdot1.1 - 0.9\cdot0.3 = 1.05$다. 이 일치는 우연이 아니다(다음 노드의 점검 문제).
- 랭크 1인 $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $A^{\mathsf{T}}A = \begin{bmatrix} 5 & 10 \\ 10 & 20 \end{bmatrix}$의 고윳값은 25와 0이므로 $\sigma_1 = 5$, $\sigma_2 = 0$이다. $\mathbf{v}_1 = (1, 2)/\sqrt{5}$를 넣으면 $A\mathbf{v}_1 = (5, 10)/\sqrt{5}$이고 그 길이는 $\sqrt{125/5} = 5$로 정확히 $\sigma_1$이다. $\mathbf{v}_2 = (-2, 1)/\sqrt{5}$는 $A\mathbf{v}_2 = \mathbf{0}$, 곧 [영공간](t:t.null-space)의 방향이다. 단위원이 길이 10인 선분으로 납작해진다.

> [!코드] 증명의 순서가 곧 코드의 순서다
> 아래 \`svd2\`는 이 노드의 증명을 한 단계씩 그대로 옮겼다: (1) $A^{\mathsf{T}}A$를 만들고, (2) 대칭 행렬의 고유분해(\`symEig\`, 야코비 회전)로 $\mathbf{v}_i$와 $\lambda_i$를 얻고, (3) $\sigma_i = \sqrt{\lambda_i}$, (4) $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$. $\sigma_2 = 0$이면 (4)의 나눗셈을 할 수 없으므로 $\mathbf{u}_1$에 수직인 아무 단위벡터로 $\mathbf{u}_2$를 채운다. 수치 계산 전문 라이브러리는 정밀도 때문에 $A^{\mathsf{T}}A$를 만들지 않는 다른 길(이 저장소의 \`svd\`가 쓰는 한쪽 야코비 방법 등)을 쓴다. $A^{\mathsf{T}}A$를 만들면 작은 특이값의 유효 숫자가 절반쯤 사라지기 때문이다. 교과서의 증명과 실무의 알고리즘이 갈라지는 지점이다.

### n차원으로
위 논증은 차원과 상관없다. $n \times n$ 대칭 행렬 $A^{\mathsf{T}}A$의 정규직교 고유벡터 $\mathbf{q}_1, \dots, \mathbf{q}_n$으로 $\mathbf{x}$를 적으면 $\|A\mathbf{x}\|^2 = \sum_i \lambda_i c_i^2$, $\sum_i c_i^2 = 1$이 되어 똑같이 가중 평균이다. 그래서 $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_n \ge 0$이 생긴다. 다만 이 일반화는 $n$차원의 스펙트럼 정리에 기댄다. 8장에서 그 정리를 어디까지 증명했는지 확인하라.`,
  proof: String.raw`**최대·최소.** 본문에서 보였듯 $\mathbf{x} = c_1\mathbf{q}_1 + c_2\mathbf{q}_2$, $c_1^2 + c_2^2 = 1$일 때 $\|A\mathbf{x}\|^2 = \lambda_1c_1^2 + \lambda_2c_2^2$이다. $c_2^2 = 1 - c_1^2$을 넣으면

$$\|A\mathbf{x}\|^2 = \lambda_2 + (\lambda_1 - \lambda_2)\,c_1^2$$

$\lambda_1 - \lambda_2 \ge 0$이고 $0 \le c_1^2 \le 1$이므로, 이 값은 $c_1^2 = 1$일 때 $\lambda_1$로 가장 크고 $c_1^2 = 0$일 때 $\lambda_2$로 가장 작다. 따라서 단위 입력이 늘어나는 길이는 $\sigma_2 = \sqrt{\lambda_2}$와 $\sigma_1 = \sqrt{\lambda_1}$ 사이에 있다. 양 끝은 $\mathbf{x} = \pm\mathbf{v}_2$와 $\mathbf{x} = \pm\mathbf{v}_1$에서 나온다.

**출력 쪽 직교.** $\sigma_1, \sigma_2 > 0$이라 하자. [전치의 정체](why:prop.transpose-dot)를 쓰면

$$(A\mathbf{v}_1)\cdot(A\mathbf{v}_2) = \mathbf{v}_1\cdot(A^{\mathsf{T}}A\mathbf{v}_2) = \mathbf{v}_1\cdot(\lambda_2\mathbf{v}_2) = \lambda_2(\mathbf{v}_1\cdot\mathbf{v}_2) = 0$$

그러므로 $\mathbf{u}_1\cdot\mathbf{u}_2 = (A\mathbf{v}_1)\cdot(A\mathbf{v}_2)/(\sigma_1\sigma_2) = 0$이다. 또 $\|A\mathbf{v}_i\|^2 = \lambda_i = \sigma_i^2$이므로 $\|\mathbf{u}_i\| = 1$이다. 따라서 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교다. 입력 쪽의 직각 한 쌍이 출력 쪽에서도 직각으로 남는 이유가 이 한 줄이다. 직교하는 입력들이 $A$를 지난 뒤에도 직교하려면 $A^{\mathsf{T}}A$가 그 입력들을 방향을 바꾸지 않고 보내야 하고, 그런 입력이 곧 $A^{\mathsf{T}}A$의 고유벡터다.`,
  checks: [
    {
      q: String.raw`$A^{\mathsf{T}}A$의 고윳값이 9와 4이다. $A$의 특이값은?`,
      choices: ['3과 2', '9와 4', '81과 16', 'A를 모르면 알 수 없다'],
      answer: 0,
      explain: String.raw`$\sigma_i = \sqrt{\lambda_i}$다. $\lambda_i = \|A\mathbf{v}_i\|^2$은 **길이의 제곱**이기 때문이다. $A$ 자체를 몰라도 특이값은 정해진다. 다만 $A$의 특이벡터(특히 $\mathbf{u}_i$)는 $A$를 알아야 구할 수 있다.`,
    },
    {
      q: String.raw`대칭 행렬 $S = \begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix}$의 특이값은?`,
      choices: ['3과 2', '2와 −3', '−3과 2', '4와 9'],
      answer: 0,
      explain: String.raw`특이값은 늘어난 **길이**이므로 음수가 될 수 없다. $S^{\mathsf{T}}S = \begin{bmatrix} 4 & 0 \\ 0 & 9 \end{bmatrix}$이므로 $\sigma_1 = 3$, $\sigma_2 = 2$다(큰 것부터). 고윳값 $-3$의 부호(뒤집힘)는 특이값이 아니라 특이벡터 쪽에 담긴다. 실제로 $\mathbf{v}_1 = \mathbf{e}_2$일 때 $\mathbf{u}_1 = S\mathbf{e}_2/3 = -\mathbf{e}_2$로 방향이 뒤집힌다. 대칭 행렬의 특이값은 고윳값의 **절댓값**이다.`,
    },
  ],
  code: ['svd2', 'symEig'],
};

export default node;
