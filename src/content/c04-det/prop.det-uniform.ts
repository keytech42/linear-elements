import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.det-uniform',
  kind: 'prop',
  title: '모든 도형의 넓이가 같은 배율로 변한다',
  status: 'written',
  requires: ['def.det', 'prop.linear-grid'],
  predicts: [
    {
      id: 'p-circle',
      kind: 'choice',
      q: String.raw`$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$이 반지름 1인 원(넓이 $\pi$)을 보낸 도형의 넓이는?`,
      hints: [
        String.raw`단위 정사각형의 넓이는 몇 배가 되는가? 그것이 행렬식이다.`,
        String.raw`원을 아주 작은 정사각형들로 빈틈없이 채웠다고 상상하라. 작은 정사각형 하나하나는 모두 똑같은 배율로 바뀐다.`,
      ],
      choices: [String.raw`$6\pi$`, String.raw`$5\pi$`, String.raw`$\pi$ (원은 회전해도 원이므로)`, String.raw`$36\pi$`],
      answer: 0,
      why: [
        String.raw`$\det A = 6$이므로 모든 도형의 넓이가 6배가 된다. 원은 가로 반지름 2, 세로 반지름 3인 [타원](fwd:t.ellipse) 모양이 된다.`,
        String.raw`배율을 더했다($2 + 3$). 넓이 배율은 두 방향의 배율을 곱한 것이다.`,
        String.raw`이 변환은 돌리기가 아니라 늘이기다.`,
        String.raw`배율을 제곱했다. 넓이 배율은 이미 "두 방향의 곱"이므로 6이다.`,
      ],
    },
  ],
  openWhys: [{ q: '휘어진 경계를 가진 도형의 넓이를 작은 정사각형으로 "끝없이 가깝게" 맞춘다는 것을 엄밀하게 하려면?', answeredBy: null }],
  body: String.raw`[행렬식](t:t.determinant)은 단위 정사각형 하나의 넓이 배율로 정의했다. 원, 삼각형, 아무렇게나 그린 얼룩의 넓이도 같은 배율로 바뀔까?

::predict p-circle

**명제.** 선형 변환 $A$는 평면의 **모든** 도형의 넓이를 똑같이 $|\det A|$배 한다.

::scene c4-area-ratio {}

도형 단추로 원, 얼룩, F를 바꿔 가며 두 넓이의 비가 언제나 $|\det A|$인지 확인하라. "작은 정사각형" 상자를 켜면 증명의 핵심이 보인다. 도형 안의 작은 정사각형들이 모두 **똑같은 모양**의 평행사변형으로 옮겨진다.

### 두 개의 예
- 위 관문: $\det = 6$이므로 원(넓이 $\pi$)이 넓이 $6\pi$인 납작한 원 모양이 된다.
- 전단 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$: $\det = 1$이므로 어떤 도형을 밀어도 넓이가 그대로다. 카드 더미를 비스듬히 밀어도 카드의 양은 그대로인 것과 같다.`,
  proof: String.raw`**작은 정사각형 하나.** 꼭짓점이 $\mathbf{p}$이고 두 변이 $h\mathbf{e}_1$, $h\mathbf{e}_2$인 작은 정사각형을 생각하자($h$는 한 변의 길이). [선형 변환은 선형 결합을 그대로 통과시키므로](why:def.linear-map), 이 정사각형의 점 $\mathbf{p} + s\,h\mathbf{e}_1 + t\,h\mathbf{e}_2$($0 \le s, t \le 1$)는 $A\mathbf{p} + s\,h\mathbf{a}_1 + t\,h\mathbf{a}_2$로 간다. 곧 작은 정사각형은 꼭짓점이 $A\mathbf{p}$이고 두 변이 $h\mathbf{a}_1$, $h\mathbf{a}_2$인 평행사변형이 된다. 이것은 단위 정사각형의 상(두 변 $\mathbf{a}_1$, $\mathbf{a}_2$)을 가로세로 모두 $h$배로 줄여 $A\mathbf{p}$로 옮긴 것이다. [넓이의 규칙](why:ax.area)에 따라 옮겨도 넓이는 그대로이고, 가로세로를 모두 $h$배 하면 넓이는 $h^2$배다. 그러므로 그 넓이는 $|\det A|\,h^2$, 곧 작은 정사각형 넓이 $h^2$의 $|\det A|$배다.

**아무 도형.** 도형을 한 변 $h$인 작은 정사각형들로 덮는다. 안쪽에 완전히 들어가는 정사각형들과, 도형에 조금이라도 걸치는 정사각형들을 생각하면, 도형의 넓이는 그 두 합 사이에 있다. 변환 뒤에도 같은 관계가 그대로 옮겨지고(포함 관계는 변환 뒤에도 유지된다), 정사각형마다 넓이가 정확히 $|\det A|$배가 된다. $h$를 작게 할수록 두 합의 차이는 도형의 경계 근처의 얇은 띠만큼으로 줄어든다. 그러므로 도형의 넓이도 $|\det A|$배다. (이 "끝없이 가깝게 맞추기"를 완전히 엄밀하게 하는 일은 이 교재의 범위 밖이다. 아래 열린 질문에 남겨 둔다.)`,
};

export default node;
