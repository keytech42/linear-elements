import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.char-poly',
  kind: 'prop',
  title: '특성방정식: det(A − λI) = 0',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.char-eq', ko: '특성방정식', en: 'characteristic equation', gloss: 'det(A − λI) = 0. 2×2에서는 λ² − (tr A)λ + det A = 0. 근이 고윳값이다.' },
      { id: 't.discriminant', ko: '판별식', en: 'discriminant', gloss: '2×2 특성방정식에서 (tr A)² − 4 det A. 양수면 서로 다른 실수 고윳값 둘, 0이면 하나, 음수면 실수 고윳값이 없다.' },
    ],
    symbols: [{ tex: String.raw`\lambda_i`, meaning: 'i번째 고윳값 (큰 것부터)' }],
  },
  requires: ['def.eigen', 'def.trace', 'prop.det-zero', 'def.identity'],
  predicts: [
    {
      id: 'p-why',
      kind: 'choice',
      q: String.raw`$(A - \lambda I)\mathbf{v} = \mathbf{0}$이고 $\mathbf{v} \ne \mathbf{0}$이라면, 행렬 $A - \lambda I$에 대해 무엇을 알 수 있을까?`,
      choices: ['평면을 직선이나 점으로 납작하게 누른다. 그래서 행렬식이 0이다', String.raw`$A - \lambda I$는 영행렬이다`, String.raw`$A - \lambda I$는 역행렬을 가진다`, '아무것도 알 수 없다'],
      answer: 0,
      why: [
        String.raw`영벡터가 아닌 입력이 원점으로 간다는 것은 영공간이 원점보다 크다는 뜻이고, [그것은 행렬식이 0이라는 것과 같다](n:prop.det-zero).`,
        String.raw`영행렬이면 **모든** 벡터가 0으로 간다(그 경우는 $A = \lambda I$다). 필요한 것은 영벡터가 아닌 벡터 **하나**가 0으로 가는 것뿐이다.`,
        String.raw`거꾸로다. $\mathbf{v}$와 $\mathbf{0}$, 서로 다른 두 입력이 같은 출력 $\mathbf{0}$으로 가므로 [되돌릴 수 없다](n:prop.inverse-exists).`,
        String.raw`영벡터가 아닌 입력이 0으로 간다는 것은 강한 정보다. 넓이가 0이 된다는 것까지 알 수 있다.`,
      ],
    },
    {
      id: 'p-shift',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$의 고윳값은 3과 1이다(아래에서 계산한다). 그렇다면 $A + 2I$의 고윳값은?`,
      hints: [
        String.raw`$A$의 고유벡터 $\mathbf{v}$에 $A + 2I$를 곱하면 어떻게 되는가? 행렬 곱은 덧셈 위로 나뉜다: $(A + 2I)\mathbf{v} = A\mathbf{v} + 2I\mathbf{v}$.`,
        String.raw`$A\mathbf{v} = \lambda\mathbf{v}$이고 $I\mathbf{v} = \mathbf{v}$다. 두 항을 합쳐 $(\ \cdot\ )\mathbf{v}$ 꼴로 써 보라.`,
      ],
      choices: ['5와 3', '3과 1 그대로', '6과 2 (두 배)', '특성방정식을 새로 풀기 전에는 알 수 없다'],
      answer: 0,
      why: [
        String.raw`$(A + 2I)\mathbf{v} = \lambda\mathbf{v} + 2\mathbf{v} = (\lambda + 2)\mathbf{v}$. 고유벡터는 그대로이고 고윳값만 2씩 옮겨진다.`,
        String.raw`$2I$를 더하면 모든 벡터에 "자기 자신의 2배"가 더해진다. 고유 방향은 같지만 배율이 바뀐다.`,
        String.raw`두 배가 되는 것은 $2A$의 고윳값이다. $A + 2I$는 배율에 2를 **더한다**. 거의 맞는 추론에서 곱과 합을 바꾼 것이다.`,
        String.raw`새로 풀어도 되지만, 고유벡터에 직접 곱해 보면 계산 없이 알 수 있다. 특성방정식으로 검산하면 대각합 8, 행렬식 15이므로 $\lambda^2 - 8\lambda + 15 = (\lambda - 5)(\lambda - 3)$이다.`,
      ],
    },
  ],
  openWhys: [{ q: '판별식이 음수일 때 나오는 복소수 근은 기하적으로 무엇을 뜻하는가?', answeredBy: 'prop.no-real-eigen' }],
  body: String.raw`[앞의 탐구](n:exp.eigen-hunt)처럼 그림에서 고유벡터를 찾을 수는 있다. 그러나 정확한 값을 얻으려면 계산이 필요하다. $A\mathbf{v} = \lambda\mathbf{v}$를 만족하는 $\lambda$는 어떻게 구할까? 미지수가 $\lambda$와 $\mathbf{v}$ 둘이라 막막해 보인다. 먼저 식을 옮겨 써 보자.

$$A\mathbf{v} = \lambda\mathbf{v} \iff A\mathbf{v} - \lambda I\mathbf{v} = \mathbf{0} \iff (A - \lambda I)\mathbf{v} = \mathbf{0}$$

가운데에서 $\lambda\mathbf{v}$를 $\lambda I\mathbf{v}$로 바꿔 썼다. [항등 행렬](t:t.identity)은 모든 벡터를 제자리에 두기 때문이다. 이렇게 쓰면 행렬 하나 $A - \lambda I$가 영벡터가 아닌 $\mathbf{v}$를 원점으로 보내는지를 묻는 문제가 된다.

::predict p-why

**명제.** 수 $\lambda$가 $A$의 [고윳값](t:t.eigenvalue)인 것과 $\det(A - \lambda I) = 0$인 것은 같은 말이다. 2×2 행렬에서 이 식을 풀어 쓰면

$$\lambda^2 - (\operatorname{tr}A)\,\lambda + \det A = 0$$

이고, 이 식을 $A$의 [특성방정식](def:t.char-eq)이라 한다. 미지수가 $\lambda$ 하나뿐인 이차방정식이다. $\mathbf{v}$는 $\lambda$를 구한 뒤에 따로 구한다.

### 그림으로 보기
아래 그림 위쪽은 $A - \lambda I$가 격자를 보내는 모습이고, 아래쪽은 $\lambda$에 따른 $\det(A - \lambda I)$의 그래프(포물선)다. $\lambda$를 움직여 포물선이 가로축과 만나는 자리에 두면, 위쪽 격자가 직선으로 납작해진다. 그때 원점으로 사라지는 방향이 바로 그 고윳값의 고유 방향이다.

::scene c8-char-poly {}

::predict p-shift

$(A + cI)\mathbf{v} = A\mathbf{v} + c\mathbf{v} = (\lambda + c)\mathbf{v}$이므로, 항등 행렬의 $c$배를 더하면 **고유벡터는 그대로이고 고윳값만 $c$만큼 옮겨진다.** 이 사실은 뒤에서도 자주 쓴다. 이제 고윳값을 직접 구하는 방법으로 돌아가자.

### 푸는 법: 완전제곱
근의 공식을 외우지 않고 만들어 보자. 특성방정식을 $\lambda^2 - (\operatorname{tr}A)\lambda = -\det A$로 옮기고, 양쪽에 $(\operatorname{tr}A)^2/4$를 더하면 왼쪽이 완전제곱이 된다([분배법칙](t:t.distributive)으로 전개해 확인하라).

$$\Big(\lambda - \tfrac{\operatorname{tr}A}{2}\Big)^2 = \frac{(\operatorname{tr}A)^2 - 4\det A}{4}$$

오른쪽 분자 $(\operatorname{tr}A)^2 - 4\det A$를 [판별식](def:t.discriminant)이라 한다.
- 판별식 > 0: 제곱근이 두 개(±)이므로 서로 다른 실수 고윳값이 둘이다. $\lambda_{1,2} = \big(\operatorname{tr}A \pm \sqrt{(\operatorname{tr}A)^2 - 4\det A}\big)/2$.
- 판별식 = 0: 고윳값이 하나(중근)다.
- 판별식 < 0: 실수 고윳값이 없다. 실수의 제곱은 음수가 될 수 없기 때문이다. [왜 음수 × 음수는 양수인가?](why:prop.neg-times-neg)

### 고윳값의 합과 곱
실수 고윳값이 $\lambda_1, \lambda_2$이면 특성방정식은 $(\lambda - \lambda_1)(\lambda - \lambda_2) = \lambda^2 - (\lambda_1 + \lambda_2)\lambda + \lambda_1\lambda_2$로 인수분해된다. 계수를 맞추면

$$\lambda_1 + \lambda_2 = \operatorname{tr}A, \qquad \lambda_1\lambda_2 = \det A$$

둘째 식은 기하적으로도 자연스럽다. 두 고유 방향을 따라 각각 $\lambda_1$배, $\lambda_2$배 늘이는 변환은 넓이를 $\lambda_1\lambda_2$배 한다. 그것이 [행렬식의 뜻](t:t.determinant)이다.

### 고유벡터 구하기
$\lambda$를 구했으면 $(A - \lambda I)\mathbf{v} = \mathbf{0}$을 푼다. [행의 관점](why:prop.row-picture)으로 읽으면 이 식은 "$\mathbf{v}$가 $A - \lambda I$의 두 행과 모두 수직"이라는 뜻이다. 그러므로 0이 아닌 행 하나를 90° 돌리면 $\mathbf{v}$가 된다. 이 저장소의 \`eig2\`가 정확히 이렇게 계산한다.

### 두 개의 예
- $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$: $\operatorname{tr}A = 4$, $\det A = 3$이므로 $\lambda^2 - 4\lambda + 3 = (\lambda - 3)(\lambda - 1) = 0$. $\lambda = 3$이면 $A - 3I = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}$의 행 $(-1, 1)$을 90° 돌려 $\mathbf{v} = (1, 1)$을 얻는다. $\lambda = 1$이면 $A - I$의 행 $(1, 1)$에서 $\mathbf{v} = (1, -1)$을 얻는다. 검산: 합 $3 + 1 = 4$, 곱 $3 \times 1 = 3$.
- $A = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$: $\operatorname{tr}A = 5$, $\det A = 4 + 2 = 6$이므로 $\lambda^2 - 5\lambda + 6 = (\lambda - 3)(\lambda - 2) = 0$. $\lambda = 3$이면 $A - 3I = \begin{bmatrix} 1 & -2 \\ 1 & -2 \end{bmatrix}$에서 $\mathbf{v} = (2, 1)$, $\lambda = 2$이면 $A - 2I = \begin{bmatrix} 2 & -2 \\ 1 & -1 \end{bmatrix}$에서 $\mathbf{v} = (1, 1)$이다.`,
  proof: String.raw`**같은 말인 이유.** $\lambda$가 고윳값이라는 것은 영벡터가 아닌 $\mathbf{v}$가 있어 $(A - \lambda I)\mathbf{v} = \mathbf{0}$이라는 것이다. 영벡터도 $(A - \lambda I)\mathbf{0} = \mathbf{0}$이므로, 이것은 서로 다른 두 입력 $\mathbf{v}$와 $\mathbf{0}$이 같은 출력으로 간다는 것, 곧 $A - \lambda I$가 평면을 납작하게 누른다는 것이다. [평면을 납작하게 누르는 것과 행렬식이 0인 것은 같은 말이다](why:prop.det-zero). 거꾸로 $\det(A - \lambda I) = 0$이면 $A - \lambda I$의 두 열이 종속이어서 어떤 영벡터가 아닌 입력이 원점으로 가고, 그 입력이 고유벡터다.

**2×2 전개.** [2×2 행렬식 공식](why:prop.det-formula)으로

$$\det\begin{bmatrix} a_{11} - \lambda & a_{12} \\ a_{21} & a_{22} - \lambda \end{bmatrix} = (a_{11} - \lambda)(a_{22} - \lambda) - a_{12}a_{21} = \lambda^2 - (a_{11} + a_{22})\lambda + (a_{11}a_{22} - a_{12}a_{21})$$

이다. 마지막 식의 $\lambda$의 계수는 $-\operatorname{tr}A$, 상수항은 $\det A$다.`,
  checks: [
    {
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$의 고윳값은?`,
      choices: ['1과 3', '1과 2', '3과 2', '4와 3'],
      answer: 0,
      explain: String.raw`특성방정식은 $\lambda^2 - 4\lambda + 3 = 0$이고 근은 1과 3이다. 대각선 아래가 0인 행렬(삼각 행렬)에서는 $\det(A - \lambda I) = (1 - \lambda)(3 - \lambda)$이므로 대각 성분이 그대로 고윳값이다. 대각선 밖의 2는 고윳값이 아니라 고유벡터의 방향에 영향을 준다(고윳값 3의 방향은 $(1, 1)$).`,
    },
    {
      q: '2×2 행렬의 고윳값이 2와 −3이다. 대각합과 행렬식은?',
      choices: ['대각합 −1, 행렬식 −6', '대각합 −6, 행렬식 −1', '대각합 5, 행렬식 6', '행렬을 모르면 알 수 없다'],
      answer: 0,
      explain: String.raw`합 $2 + (-3) = -1$이 대각합, 곱 $2\times(-3) = -6$이 행렬식이다. 행렬식이 음수이므로 이 변환은 넓이를 6배 하면서 뒤집는다. 고윳값 $-3$의 방향이 뒤집히는 방향이다.`,
    },
  ],
  code: ['eig2'],
};

export default node;
