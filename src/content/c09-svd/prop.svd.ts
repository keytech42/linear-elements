import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.svd',
  kind: 'prop',
  title: 'A = UΣVᵀ: 회전, 늘이기, 회전',
  status: 'written',
  introduces: {
    terms: [{ id: 't.svd', ko: '특이값 분해', en: 'singular value decomposition', surfaces: ['SVD'], gloss: '모든 행렬을 (직교 행렬)(대각 행렬)(직교 행렬)의 곱 UΣVᵀ로 쓰는 것. 회전(또는 반사) → 축 방향 늘이기 → 회전(또는 반사).' }],
    symbols: [
      { tex: 'U', meaning: '열 = 왼쪽 특이벡터인 직교 행렬' },
      { tex: String.raw`\Sigma`, meaning: '특이값을 대각에 놓은 행렬' },
      { tex: 'V', meaning: '열 = 오른쪽 특이벡터인 직교 행렬' },
    ],
  },
  requires: ['prop.svd-ata', 'prop.orthogonal-inverse'],
  predicts: [
    {
      id: 'p-vt',
      kind: 'choice',
      q: String.raw`세 단계 가운데 첫째인 $V^{\mathsf{T}}$는 우특이벡터 $\mathbf{v}_1$을 어디로 보낼까?`,
      choices: [String.raw`$\mathbf{e}_1$`, String.raw`$\mathbf{v}_1$ 그대로`, String.raw`$\sigma_1\mathbf{u}_1$`, String.raw`$\mathbf{u}_1$`],
      answer: 0,
      why: [
        String.raw`$V^{\mathsf{T}}$의 행이 $\mathbf{v}_1, \mathbf{v}_2$이므로 $V^{\mathsf{T}}\mathbf{v}_1 = (\mathbf{v}_1\cdot\mathbf{v}_1,\ \mathbf{v}_2\cdot\mathbf{v}_1) = (1, 0)$이다.`,
        String.raw`제자리에 두는 것은 항등 행렬이다. $V^{\mathsf{T}}$는 $\mathbf{v}_1$을 좌표축 위로 옮기는 회전이다.`,
        String.raw`$\sigma_1\mathbf{u}_1$은 세 단계를 모두 거친 결과, 곧 $A\mathbf{v}_1$이다. 첫 단계에서는 아직 늘이지도, 출력 쪽으로 돌리지도 않았다.`,
        String.raw`$\mathbf{u}_1$은 마지막 단계 $U$가 만드는 방향이다.`,
      ],
    },
    {
      id: 'p-flip',
      kind: 'choice',
      q: String.raw`$\det A < 0$인 행렬(거울에 비친 것처럼 뒤집는 변환)을 $U\Sigma V^{\mathsf{T}}$로 쓰면, 뒤집힘은 어디에 들어갈까?`,
      hints: [
        String.raw`직교 행렬의 행렬식은 $+1$ 또는 $-1$이고, $\det\Sigma = \sigma_1\sigma_2 \ge 0$이다. [행렬식은 곱을 곱으로 보낸다](n:prop.det-product).`,
      ],
      choices: [String.raw`$U$와 $V$ 가운데 한쪽 (반사인 직교 행렬)`, String.raw`$\Sigma$의 음수 특이값`, '뒤집는 변환은 이렇게 분해할 수 없다', String.raw`$U$와 $V$ 양쪽 모두`],
      answer: 0,
      why: [
        String.raw`직교 행렬의 행렬식은 $+1$(회전) 또는 $-1$(반사)이다. $\det A = \det U\cdot\sigma_1\sigma_2\cdot\det V^{\mathsf{T}}$가 음수가 되려면 둘 가운데 한쪽만 $-1$이어야 한다.`,
        String.raw`특이값은 늘어난 길이이므로 0 이상이다. 부호는 대각 행렬이 아니라 직교 행렬 쪽이 맡는다.`,
        String.raw`이 노드의 증명에는 행렬식의 부호를 가정한 곳이 없다. 그러므로 모든 행렬이 이렇게 분해된다.`,
        String.raw`양쪽 모두 뒤집으면 뒤집힘이 두 번 일어나 서로 지워진다. 그러면 행렬식은 양수가 된다.`,
      ],
    },
  ],
  body: String.raw`앞 노드에서 얻은 것은 방정식 두 개다: $A\mathbf{v}_1 = \sigma_1\mathbf{u}_1$, $A\mathbf{v}_2 = \sigma_2\mathbf{u}_2$. 그리고 $\mathbf{v}_1, \mathbf{v}_2$는 정규직교이고 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교다. 이 두 방정식을 행렬 하나로 묶으면 무엇이 되는가?

벡터들을 열로 세워 행렬을 만든다.

$$V = \begin{bmatrix} | & | \\ \cv{\mathbf{v}_1} & \cv{\mathbf{v}_2} \\ | & | \end{bmatrix}, \quad \Sigma = \begin{bmatrix} \sigma_1 & 0 \\ 0 & \sigma_2 \end{bmatrix}, \quad U = \begin{bmatrix} | & | \\ \cu{\mathbf{u}_1} & \cu{\mathbf{u}_2} \\ | & | \end{bmatrix}$$

**명제(특이값 분해).** 모든 2×2 행렬 $A$는

$$A = \h{s3}{U}\,\h{s2}{\Sigma}\,\h{s1}{V^{\mathsf{T}}}$$

로 쓸 수 있다. 여기서 $U$와 $V$는 [직교 행렬](t:t.orth-matrix)이고, $\Sigma$는 대각선에 특이값 $\sigma_1 \ge \sigma_2 \ge 0$을 놓은 [대각 행렬](t:t.diagonal)이다. 이것을 $A$의 [특이값 분해](def:t.svd)라 한다(줄여서 SVD).

### 오른쪽부터 읽기: 세 단계
[행렬 곱은 오른쪽부터 읽는다](why:def.composition). 입력 $\mathbf{x}$에 $A = U\Sigma V^{\mathsf{T}}$를 곱하는 일은 다음 세 단계다.

::predict p-vt

1. $V^{\mathsf{T}}$: **회전(또는 반사).** $V^{\mathsf{T}}\mathbf{v}_1 = \mathbf{e}_1$, $V^{\mathsf{T}}\mathbf{v}_2 = \mathbf{e}_2$다. $V^{\mathsf{T}}$의 행이 $\mathbf{v}_1, \mathbf{v}_2$이므로 [행의 관점](why:prop.row-picture)으로 $V^{\mathsf{T}}\mathbf{v}_1 = (\mathbf{v}_1\cdot\mathbf{v}_1, \mathbf{v}_2\cdot\mathbf{v}_1) = (1, 0)$이기 때문이다. 특별한 두 방향을 좌표축 위에 올려놓는 단계다.
2. $\Sigma$: **축 방향으로 따로따로 늘이기.** 가로축을 $\sigma_1$배, 세로축을 $\sigma_2$배 한다.
3. $U$: **회전(또는 반사).** $\mathbf{e}_1$을 $\mathbf{u}_1$로, $\mathbf{e}_2$를 $\mathbf{u}_2$로 보낸다.

아래 장면에서 단계를 하나씩 실행해 보라. 노란 F가 회전인지 반사인지를 구별해 준다.

::scene c9-svd-steps {}

### 그래서 단위원의 상은 정확히 타원이다
[앞에서 미뤄 둔 질문](n:exp.circle-to-ellipse)의 답이다. 1단계의 직교 행렬은 [길이를 바꾸지 않으므로](why:prop.orthogonal-preserves) 단위원을 단위원으로 보낸다. 2단계는 원을 서로 수직인 두 축 방향으로 각각 $\sigma_1$배, $\sigma_2$배 늘인다. 이것이 [타원의 정의](t:t.ellipse) 그대로다. 3단계는 타원을 돌리거나 뒤집을 뿐이므로 타원은 타원으로 남는다. $\sigma_2 = 0$이면 2단계에서 원이 선분으로 납작해진다.

::predict p-flip

### 예
- 앞 노드의 $A = \begin{bmatrix} 1.2 & 0.9 \\ 0.3 & 1.1 \end{bmatrix}$: $V$는 약 49.9° 회전, $\Sigma = \operatorname{diag}(1.7906, 0.5864)$, $U$는 약 35.3° 회전이다. 오른쪽부터 읽으면 이렇다. 먼저 $-49.9°$ 돌려 $\mathbf{v}_1$을 가로축에 놓는다. 다음에 가로로 1.79배, 세로로 0.59배 늘인다. 마지막에 35.3° 돌린다.
- 반사가 들어간 $A = \begin{bmatrix} 2 & 1 \\ 0 & -1 \end{bmatrix}$ ($\det A = -2$): $\sigma_1 \approx 2.2882$, $\sigma_2 \approx 0.8740$이고, $V$를 회전으로 고르면 $U$에 반사가 하나 들어간다($\det U = -1$). 장면의 행렬을 이 값으로 바꾸고 3단계를 보라. 반사는 회전을 이어 붙여서는 만들 수 없다. 그래서 애니메이션에서는 한 축이 0을 지나며 뒤집힌다.

### 직사각 행렬도
$A$가 $m \times n$이어도 같은 논증이 된다. $A^{\mathsf{T}}A$($n \times n$)에서 $\mathbf{v}_i$와 $\sigma_i$를 얻고, $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$는 $\mathbb{R}^m$의 정규직교 벡터들이다. 예를 들어 $A = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$이면 $A^{\mathsf{T}}A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$이고 고윳값은 3과 1이다. 그래서 $\sigma_1 = \sqrt{3}$, $\sigma_2 = 1$, $\mathbf{v}_1 = (1, 1)/\sqrt{2}$, $\mathbf{u}_1 = A\mathbf{v}_1/\sqrt{3} = (1, 1, 2)/\sqrt{6}$이다. 평면의 단위원이 3차원 공간 안의 기울어진 평면 위에 놓인 타원이 된다. 출력 공간은 3차원인데 [열공간](t:t.column-space)은 2차원이므로, $\mathbf{u}_1, \mathbf{u}_2$에 수직인 방향 $\mathbf{u}_3$가 하나 남는다. 어떤 입력으로도 닿지 않는 방향이다. 이 방향의 정체는 이 장의 마지막 노드에서 다룬다. 이 저장소의 \`svd\`는 이런 직사각 행렬을 위한 함수다.

### 무엇이 유일한가
특이값 $\sigma_i$는 $A$만으로 정해진다($A^{\mathsf{T}}A$의 고윳값이므로). 특이벡터는 그렇지 않다. $\mathbf{v}_i$와 $\mathbf{u}_i$의 부호를 **함께** 바꿔도 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$가 유지된다. 또 $\sigma_1 = \sigma_2$이면(예: 회전 행렬) 어느 직교 쌍이든 $\mathbf{v}_1, \mathbf{v}_2$가 될 수 있다. 그러므로 "A의 SVD"는 하나의 분해가 아니라, 같은 $\Sigma$를 공유하는 분해들의 모임이다.`,
  proof: String.raw`[행렬 곱의 j번째 열은 왼쪽 행렬 × 오른쪽 행렬의 j번째 열이다](why:prop.matmul-columns). 그러므로 $AV$의 열은 $A\mathbf{v}_1, A\mathbf{v}_2$이고, $U\Sigma$의 열은 $U(\sigma_1\mathbf{e}_1) = \sigma_1\mathbf{u}_1$, $U(\sigma_2\mathbf{e}_2) = \sigma_2\mathbf{u}_2$다. [앞 노드](why:prop.svd-ata)에서 $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$이므로 두 행렬의 열이 모두 같다.

$$AV = U\Sigma$$

$\sigma_2 = 0$인 경우에도 이 식은 성립한다. $A\mathbf{v}_2 = \mathbf{0} = 0\cdot\mathbf{u}_2$이기 때문이다($\|A\mathbf{v}_2\|^2 = \lambda_2 = 0$).

이제 양변의 오른쪽에 $V^{\mathsf{T}}$를 곱한다. $V$는 열이 정규직교인 직교 행렬이므로 [역행렬이 전치](why:prop.orthogonal-inverse)다. 따라서 $VV^{\mathsf{T}} = I$이고

$$A = A(VV^{\mathsf{T}}) = (AV)V^{\mathsf{T}} = U\Sigma V^{\mathsf{T}}$$

가운데 등호에서는 [결합법칙](why:prop.associative)을 썼다. $U$의 열 $\mathbf{u}_1, \mathbf{u}_2$도 정규직교이므로 $U$는 직교 행렬이다.`,
  checks: [
    {
      q: String.raw`2×2 행렬에서 $\sigma_1\sigma_2 = |\det A|$인 이유는?`,
      choices: [
        String.raw`$\det A = \det U \cdot \det\Sigma \cdot \det V^{\mathsf{T}}$이고, 직교 행렬의 행렬식은 ±1이며 $\det\Sigma = \sigma_1\sigma_2$이기 때문`,
        '특이값은 원래 행렬식을 나눠 가진 것이라고 정의했기 때문',
        '우연히 위 예에서만 성립한다',
      ],
      answer: 0,
      explain: String.raw`[행렬식은 곱을 곱으로 보낸다](n:prop.det-product). 직교 행렬은 넓이를 바꾸지 않으므로 행렬식이 $+1$(회전) 또는 $-1$(반사)이다. 남는 넓이 배율은 $\Sigma$의 $\sigma_1\sigma_2$뿐이다. 기하로 말하면, 단위원(넓이 π)이 반지름 $\sigma_1, \sigma_2$인 타원(넓이 $\pi\sigma_1\sigma_2$)이 된다. 부호는 $U$와 $V$에 반사가 홀수 번 들어갔는지가 정한다.`,
    },
    {
      q: String.raw`$A = U\Sigma V^{\mathsf{T}}$에서 $A\mathbf{v}_2$는?`,
      choices: [String.raw`$\sigma_2\mathbf{u}_2$`, String.raw`$\sigma_2\mathbf{v}_2$`, String.raw`$\mathbf{u}_2$`, String.raw`$\sigma_1\mathbf{u}_1$`],
      answer: 0,
      explain: String.raw`세 단계로 따라가면 $V^{\mathsf{T}}\mathbf{v}_2 = \mathbf{e}_2 \to \Sigma\mathbf{e}_2 = \sigma_2\mathbf{e}_2 \to U(\sigma_2\mathbf{e}_2) = \sigma_2\mathbf{u}_2$다. $\sigma_2\mathbf{v}_2$를 고른 경우는 $\mathbf{v}_2$를 $A$의 고유벡터로 착각한 것이다. 특이벡터는 출발 방향($\mathbf{v}$)과 도착 방향($\mathbf{u}$)이 다르다.`,
    },
  ],
  code: ['svd2', 'svd'],
};

export default node;
