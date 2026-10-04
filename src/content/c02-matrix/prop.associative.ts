import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.associative',
  kind: 'prop',
  title: '(AB)C = A(BC): 결합법칙은 공짜다',
  status: 'written',
  requires: ['def.composition'],
  predicts: [
    {
      id: 'p-twelve',
      kind: 'choice',
      q: String.raw`30° 회전 $R_{30°}$를 12번 곱한 $R_{30°}R_{30°}\cdots R_{30°}$ (12개)는?`,
      hints: [String.raw`곱 하나하나를 계산하지 말고 기하로 생각하라. 30°씩 12번 돌리면 모두 몇 도를 돈 것인가? 그리고 괄호를 어디에 치든 결과가 같은가?`],
      choices: [String.raw`항등 행렬 $I$`, String.raw`$12R_{30°}$`, String.raw`$R_{30°}$`, '괄호를 어떻게 치느냐에 따라 다르다'],
      answer: 0,
      why: [
        String.raw`30° × 12 = 360°, 한 바퀴를 돌아 제자리다. 어떤 순서로 묶어 계산해도 "차례로 12번 돌린다"는 같은 변환이다.`,
        String.raw`행렬을 12번 **곱하는** 것과 12배 하는 것은 다르다. 12배는 모든 벡터를 12배 늘인다.`,
        String.raw`그것은 13번 곱했을 때(390° = 30°)다.`,
        String.raw`이 노드의 명제가 바로 "괄호의 위치는 결과를 바꾸지 않는다"이다.`,
      ],
    },
  ],
  body: String.raw`행렬 셋을 곱할 때 $(AB)C$로 계산하든 $A(BC)$로 계산하든 같을까? 성분을 다 전개해서 확인할 수도 있지만, 그럴 필요가 없다.

**명제.** $(AB)C = A(BC)$이다. 그래서 괄호 없이 $ABC$라고 써도 된다.

::predict p-twelve

### 계산 없이 증명되는 이유
두 쪽 모두 같은 변환, "**$C$를 하고, $B$를 하고, $A$를 한다**"를 나타낸다. [합성](t:t.composition)은 "차례로 한다"는 뜻이고, 차례로 하는 일을 둘씩 어떻게 묶어 부르든 일어나는 일은 같다. 아래 증명은 이 말을 식으로 옮긴 것이다.

### 숫자로 한 번 확인
$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$, $C = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$이라 하자. 이 이름 $C$는 이 문단에서만 쓴다.
- $AB = \begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$이고 $(AB)C = \begin{bmatrix} 1 & -2 \\ 1 & 0 \end{bmatrix}$.
- $BC = \begin{bmatrix} 0 & -2 \\ 1 & 0 \end{bmatrix}$이고 $A(BC) = \begin{bmatrix} 1 & -2 \\ 1 & 0 \end{bmatrix}$.

같다. 계산 경로는 달랐지만 도착점은 같다.

> [!주의] 결합법칙과 교환법칙은 다르다
> [순서를 바꾸면 달라진다](n:prop.noncommutative). 괄호의 **위치**를 바꾸는 것은 괜찮지만, 행렬의 **순서**를 바꾸면 안 된다.`,
  proof: String.raw`아무 입력 $\mathbf{x}$에서 두 쪽의 출력을 비교한다. [행렬 곱의 정의](why:def.composition)를 되풀이해 쓰면

$$((AB)C)\mathbf{x} = (AB)(C\mathbf{x}) = A(B(C\mathbf{x})), \qquad (A(BC))\mathbf{x} = A((BC)\mathbf{x}) = A(B(C\mathbf{x}))$$

이다. 모든 입력에서 출력이 같으므로 두 행렬은 같다. ($\mathbf{x} = \mathbf{e}_j$를 넣으면 두 행렬의 $j$번째 열이 같아진다.)`,
};

export default node;
