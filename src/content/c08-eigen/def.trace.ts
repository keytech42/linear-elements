import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.trace',
  kind: 'def',
  title: '대각합',
  status: 'written',
  introduces: {
    terms: [{ id: 't.trace', ko: '대각합', en: 'trace', gloss: '정사각 행렬의 대각선 성분을 모두 더한 수. 아주 조금 변환할 때 넓이가 늘어나는 빠르기이자, 고윳값들의 합.' }],
    symbols: [{ tex: String.raw`\operatorname{tr} A`, meaning: '행렬 A의 대각합' }],
  },
  requires: ['def.matrix', 'prop.det-formula'],
  predicts: [
    {
      id: 'p-nudge',
      kind: 'choice',
      q: String.raw`$A$를 아주 조금만($t$배, $t$는 작은 수) 더한 변환 $I + tA$를 생각하자. 단위 정사각형의 넓이는 대략 몇 배가 될까?`,
      hints: [
        String.raw`[2×2 행렬식 공식](n:prop.det-formula)을 $I + tA$의 네 성분에 그대로 써 보라.`,
        String.raw`대각선 두 칸은 $1 + ta_{11}$, $1 + ta_{22}$이고 나머지 두 칸은 $ta_{12}$, $ta_{21}$이다. 곱을 전개한 뒤 $t$의 차수별로 모아 보라.`,
      ],
      choices: [String.raw`$1 + t\cdot\operatorname{tr}A$`, String.raw`$1 + t\cdot\det A$`, String.raw`$\det A$`, '1 (아주 조금이므로 그대로)'],
      answer: 0,
      why: [
        String.raw`아래에서 정확히 계산한다. $t$에 비례하는 항의 계수가 대각합이다.`,
        String.raw`$\det A$는 $A$ 전체를 했을 때의 넓이 배율이다. $A$를 $t$배만 더하면 $\det A$는 $t^2$에 붙어서 나오므로, $t$가 작을 때는 훨씬 작은 항이 된다.`,
        String.raw`그것은 $I$ 없이 $A$만 했을 때($t = 1$에서 $I$를 뺀 경우)의 배율이다.`,
        String.raw`대략은 맞지만, 가장 큰 변화인 $t$에 비례하는 항을 버렸다. 그 항의 계수가 바로 대각합이다.`,
      ],
    },
  ],
  body: String.raw`다음 노드에서 고윳값을 계산하는 공식을 세우면, 그 공식에 [행렬식](t:t.determinant)과 함께 수 하나가 더 나온다. 그 수를 먼저 정의하고, 기하적인 뜻을 찾아보자.

**정의.** 정사각 행렬 $A$의 대각선 성분을 모두 더한 수를 $A$의 [대각합](def:t.trace)이라 하고 $\operatorname{tr} A$로 쓴다. 2×2에서는 $\operatorname{tr}A = a_{11} + a_{22}$다.

예: $\begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$의 대각합은 5, 90° 회전 $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$의 대각합은 0, 항등 행렬 $I$의 대각합은 2다.

### 첫째 뜻: 열이 자기 축에 남긴 몫
$a_{11}$은 첫째 열 $A\mathbf{e}_1$의 첫째 성분이다. 이것은 $A\mathbf{e}_1$을 $\mathbf{e}_1$ 방향으로 [정사영](t:t.orth-projection)한 길이와 같다: $a_{11} = \mathbf{e}_1\cdot(A\mathbf{e}_1)$. [왜 내적이 정사영의 길이인가?](why:prop.orth-projection) 마찬가지로 $a_{22} = \mathbf{e}_2\cdot(A\mathbf{e}_2)$다. 그래서 대각합은 "각 기저 벡터가 변환 뒤에도 **자기 축 방향으로** 남긴 몫의 합"이다. 90° 회전의 대각합이 0인 것은 두 열이 모두 자기 축과 수직으로 돌아갔기 때문이다.

::scene c8-trace {}

::predict p-nudge

### 둘째 뜻: 아주 조금 변환할 때 넓이가 늘어나는 빠르기
$I + tA = \begin{bmatrix} 1 + ta_{11} & ta_{12} \\ ta_{21} & 1 + ta_{22} \end{bmatrix}$의 행렬식을 [2×2 공식](why:prop.det-formula)으로 계산하면

$$\det(I + tA) = (1 + ta_{11})(1 + ta_{22}) - t^2a_{12}a_{21} = 1 + t\,\operatorname{tr}A + t^2\det A$$

이다. 가운데에서 괄호를 [분배법칙](t:t.distributive)으로 풀었다. $t$가 작으면 $t^2$은 훨씬 더 작으므로, 넓이 배율은 대략 $1 + t\,\operatorname{tr}A$다. 곧 **대각합은 항등 변환 근처에서 넓이가 늘어나는 빠르기**다. 대각합이 0이면 아주 조금 변환할 때 넓이가 (첫 근사로) 변하지 않는다. 회전을 아주 조금 하는 경우가 그렇다.

예: $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$, $t = 0.05$이면 정확한 값은 $1 + 0.25 + 0.0025\times6 = 1.265$이고, 근사 $1 + 0.05\times5 = 1.25$와 $0.015$만큼 차이 난다. 아래 그림에서 $t$를 줄이면 이 차이가 $t^2$의 빠르기로 사라진다.

::scene c8-trace {"nudge": true, "t": 0.05}

> [!주의] 대각합만으로는 행렬식을 알 수 없다
> 대각합은 "조금 했을 때"의 변화이고, 행렬식은 "다 했을 때"의 배율이다. 대각합이 같아도 행렬식은 다를 수 있다. 예를 들어 $I$와 $\begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix}$은 대각합이 둘 다 2이지만 행렬식은 1과 0이다. 다음 노드에서는 두 수가 함께 고윳값을 정한다.`,
  checks: [
    {
      q: String.raw`회전 행렬 $R_\theta$의 대각합은?`,
      choices: [String.raw`$2\cos\theta$`, '0', '1', String.raw`$\cos\theta + \sin\theta$`],
      answer: 0,
      explain: String.raw`$R_\theta$의 대각선은 $\cos\theta$와 $\cos\theta$다. 각 기저 벡터가 $\theta$만큼 돌아가면 자기 축 방향의 몫이 $\cos\theta$로 줄어든다. $\theta = 90°$일 때만 0이다.`,
    },
  ],
  code: ['trace'],
};

export default node;
