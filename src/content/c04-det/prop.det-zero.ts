import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.det-zero',
  kind: 'prop',
  title: 'det = 0 ⇔ 평면이 납작해진다 ⇔ 열이 종속',
  status: 'written',
  requires: ['prop.det-formula', 'def.independence'],
  predicts: [
    {
      id: 'p-t',
      kind: 'choice',
      q: String.raw`두 열이 $(2, 1)$과 $(t, 3)$인 행렬의 행렬식이 0이 되는 $t$는?`,
      hints: [String.raw`$\det = 2\cdot3 - t\cdot1$. 기하로는 $(t, 3)$이 $(2, 1)$과 같은 직선 위에 오는 $t$다. $(2, 1)$을 몇 배 하면 둘째 성분이 3이 되는가?`],
      choices: ['6', '1.5', '−6', String.raw`$\tfrac{2}{3}$`],
      answer: 0,
      why: [
        String.raw`$6 - t = 0$. 그때 $(6, 3) = 3\cdot(2, 1)$로 두 열이 같은 직선 위에 있다.`,
        String.raw`$2t - 3 = 0$으로 풀었다. 공식의 엇갈린 곱을 잘못 짝지었다.`,
        String.raw`부호를 반대로 풀었다.`,
        String.raw`$3t = 2$로 풀었다. 성분을 거꾸로 맞췄다.`,
      ],
    },
    {
      id: 'p-lost',
      kind: 'choice',
      q: String.raw`$\det A = 0$인 2×2 행렬 $A$에서, 서로 다른 두 입력이 같은 출력으로 갈 수 있을까?`,
      hints: [
        String.raw`$\det A = 0$이면 두 열이 종속이다. 그러면 $c_1\mathbf{a}_1 + c_2\mathbf{a}_2 = \mathbf{0}$인, 0이 아닌 계수가 있다. 그 계수를 입력으로 넣으면?`,
        String.raw`$A\mathbf{z} = \mathbf{0}$인 영벡터가 아닌 $\mathbf{z}$가 있다면, $A(\mathbf{x} + \mathbf{z})$와 $A\mathbf{x}$를 비교해 보라.`,
      ],
      choices: ['있다. 그런 쌍이 끝없이 많다', '없다. 선형 변환은 서로 다른 입력을 서로 다른 출력으로 보낸다', '출력이 0일 때만 있다', '열이 같은 행렬일 때만 있다'],
      answer: 0,
      why: [
        String.raw`$A\mathbf{z} = \mathbf{0}$이면 $A(\mathbf{x} + \mathbf{z}) = A\mathbf{x} + \mathbf{0} = A\mathbf{x}$. 모든 $\mathbf{x}$에 대해 $\mathbf{x}$와 $\mathbf{x} + \mathbf{z}$가 같은 곳으로 간다. 그래서 5장에서 이런 변환은 "되돌릴 수 없다"가 된다.`,
        String.raw`납작해지는 선형 변환은 그렇지 않다. 회전처럼 행렬식이 0이 아닌 변환만 서로 다른 입력을 서로 다른 출력으로 보낸다.`,
        String.raw`출력이 0인 입력들만이 아니라, **모든** 출력에 대해 그런 쌍이 있다.`,
        String.raw`두 열이 같은 직선 위에 있기만 하면 된다. 같을 필요는 없다.`,
      ],
    },
  ],
  body: String.raw`[행렬식](t:t.determinant)이 0이라는 것은 정확히 무슨 일이 일어났다는 뜻일까?

**명제.** 2×2 행렬 $A$에 대해 다음 셋은 같은 말이다.
1. $\det A = 0$.
2. 두 열 $\mathbf{a}_1$, $\mathbf{a}_2$가 [선형 종속](t:t.lin-dep)이다(같은 직선 위에 있거나 하나가 영벡터다).
3. $A$는 평면 전체를 직선 하나(또는 점 하나)로 납작하게 누른다.

::scene c4-collapse {}

"▶ 납작하게"를 누르면 둘째 열이 첫째 열의 직선 위로 옮겨 가면서, 평행사변형의 넓이(행렬식)가 0으로 줄고 격자 전체가 직선 하나로 눌린다.

::predict p-t

::predict p-lost

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: $4 - 4 = 0$. 둘째 열이 첫째 열의 2배다. 모든 출력이 $(1, 2)$ 방향의 직선 위에 있다.
- 사영 $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$: $\det = 0$. 평면이 가로축으로 눌린다. 세로 방향의 정보가 모두 사라진다.`,
  proof: String.raw`**1 ⇔ 2.** [행렬식의 크기는 두 열이 만드는 평행사변형의 넓이](why:def.det)다. 넓이가 0인 것은 평행사변형이 납작한 것, 곧 두 열이 한 직선 위에 있거나 하나가 영벡터인 것이다. 그것이 [선형 종속](why:def.independence)이다(한 열이 다른 열의 몇 배로 적히거나, 영벡터다).

**2 ⇒ 3.** 두 열이 한 직선 위에 있으면, 모든 출력 $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2$는 그 직선 위의 벡터들의 [선형 결합](t:t.linear-combination)이므로 그 직선 위에 있다. 두 열이 모두 영벡터이면 모든 출력이 원점이다.

**3 ⇒ 1.** 평면이 직선이나 점으로 눌리면 단위 정사각형도 넓이가 0인 도형으로 간다. 그러므로 행렬식이 0이다.`,
};

export default node;
