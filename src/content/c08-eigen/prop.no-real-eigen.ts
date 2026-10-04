import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.no-real-eigen',
  kind: 'prop',
  title: '회전에는 실수 고유벡터가 없다',
  status: 'written',
  requires: ['prop.char-poly', 'prop.rotation-matrix'],
  predicts: [
    {
      id: 'p-angles',
      kind: 'choice',
      q: String.raw`회전 $R_\theta$ ($0° \le \theta < 360°$)가 실수 고유벡터를 **가지는** 각 $\theta$를 모두 고르면?`,
      hints: [String.raw`회전은 모든 방향을 같은 각 $\theta$만큼 돌린다. 화살표가 돌아간 뒤에도 처음과 **같은 직선** 위에 있으려면, 몇 도를 돌아야 하는가?`],
      choices: ['0°와 180°뿐', '0°뿐', '90°의 배수(0°, 90°, 180°, 270°)', '없다. 회전에는 언제나 고유벡터가 없다'],
      answer: 0,
      why: [
        String.raw`같은 직선 위에 남으려면 0°(같은 방향) 또는 180°(반대 방향)만큼 돌아야 한다. 아래에서 판별식으로 같은 결론을 얻는다.`,
        String.raw`180°를 빠뜨렸다. 180° 돌린 화살표는 반대쪽을 가리키지만 **같은 직선** 위에 있다. 고윳값 $-1$이다.`,
        String.raw`90° 돌린 화살표는 처음 직선과 **수직인** 직선 위에 있다. 직선이 바뀐다.`,
        String.raw`0°(아무것도 안 함)와 180°는 예외다.`,
      ],
    },
    {
      id: 'p-stretch',
      kind: 'choice',
      q: String.raw`30° 돌린 뒤 가로로 4배 늘이는 변환 $M = \begin{bmatrix} 4 & 0 \\ 0 & 1 \end{bmatrix}R_{30°}$에 실수 고유 방향이 있을까?`,
      hints: [
        String.raw`판별식 $(\operatorname{tr}M)^2 - 4\det M$의 부호만 알면 된다. [행렬식은 곱을 곱으로 보낸다](n:prop.det-product).`,
        String.raw`$\det M = 4\cdot\det R_{30°} = 4$. $M = \begin{bmatrix} 4\cos30° & -4\sin30° \\ \sin30° & \cos30° \end{bmatrix}$이므로 $\operatorname{tr}M = 5\cos30° \approx 4.33$이다.`,
      ],
      choices: ['있다. 늘이기가 회전을 이긴다', '없다. 회전이 들어 있으므로', '있다. 다만 고윳값이 음수다', '모든 방향이 고유 방향이다'],
      answer: 0,
      why: [
        String.raw`판별식은 $(5\cos30°)^2 - 16 = 18.75 - 16 = 2.75 > 0$이다. 서로 다른 실수 고윳값(약 2.99와 1.34)이 둘 있다.`,
        String.raw`회전이 "들어 있다"는 것만으로는 판정할 수 없다. 한 방향으로 강하게 늘이면, 돌아간 화살표가 그 방향으로 다시 끌려와 자기 직선에 돌아오는 방향이 생긴다. 판별식이 판정한다.`,
        String.raw`두 고윳값의 곱은 $\det M = 4 > 0$, 합은 $\operatorname{tr}M > 0$이므로 둘 다 양수다.`,
        String.raw`모든 방향이 고유 방향인 것은 $M$이 수의 배수 $cI$일 때뿐이다.`,
      ],
    },
  ],
  openWhys: [{ q: '판별식이 음수일 때 나오는 복소수 근은 기하적으로 무엇을 뜻하는가?', answeredBy: null }],
  body: String.raw`[회전](t:t.rotation)은 모든 벡터를 같은 각만큼 돌린다. 그렇다면 회전에서 자기 직선 위에 남는 벡터가 있을 수 있을까?

::predict p-angles

**명제.** 각 $\theta$가 0°도 180°도 아닌 회전 $R_\theta$에는 실수 [고윳값](t:t.eigenvalue)이 없다. 그러므로 [고유벡터](t:t.eigenvector)도 없다.

아래 그림은 90° 회전이다. 탐침을 어디에 두어도 "돌아간 각" 그래프가 90°에 붙어 있다. 0°나 180°를 지나는 자리가 없다.

::scene c8-eigen-hunt {"rot": 90}

### 계산과 그림이 같은 말을 한다
[회전 행렬](n:prop.rotation-matrix) $R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$의 대각합은 $2\cos\theta$, 행렬식은 $\cos^2\theta + \sin^2\theta = 1$이다([왜 1인가?](why:prop.cos-sin-identity)). 그러므로 [판별식](t:t.discriminant)은

$$(2\cos\theta)^2 - 4\cdot1 = 4(\cos^2\theta - 1) = -4\sin^2\theta$$

이다. $\sin\theta \ne 0$이면, 곧 $\theta$가 0°도 180°도 아니면, 이 값은 음수다. [판별식이 음수이면 실수 근이 없다](why:prop.char-poly). 그림의 말로는 이렇다. "모든 방향이 $\theta$만큼 돌아가는데, $\theta$가 0°도 180°도 아니므로 어떤 방향도 자기 직선에 돌아오지 않는다."

### 남은 두 각
- $\theta = 0°$: $R_0 = I$. 모든 벡터가 제자리에 있으므로 모든 방향이 고윳값 1의 고유 방향이다.
- $\theta = 180°$: $R_{180°} = -I$. 모든 벡터가 같은 직선 위에서 뒤집히므로 모든 방향이 고윳값 $-1$의 고유 방향이다. 판별식은 $-4\sin^2 180° = 0$으로 중근이다.

::predict p-stretch

### 돌리기와 늘이기의 줄다리기
30° 돌린 뒤 가로로 $a$배 늘이는 변환 $\begin{bmatrix} a & 0 \\ 0 & 1 \end{bmatrix}R_{30°}$의 대각합은 $(a + 1)\cos30°$, 행렬식은 $a$다. 판별식 $(a + 1)^2\cos^2 30° - 4a$를 계산하면 $a = 2$일 때 $-1.25$(실수 고유 방향 없음), $a = 3$일 때 정확히 0(중근), $a = 4$일 때 $2.75$(둘)이다. 회전은 고유 방향을 없애는 쪽으로, 한 방향 늘이기는 만드는 쪽으로 당긴다. 판별식의 부호가 둘 중 어느 쪽이 이기는지 정한다.

### 회전만 그런 것은 아니다
판별식이 음수인 행렬은 모두 "어느 정도 돌리는" 변환이다. 예를 들어 $\begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$은 45° 돌리면서 $\sqrt{2}$배 늘이는 변환이다. 대각합 2, 행렬식 2이므로 판별식은 $4 - 8 = -4 < 0$이고, 실수 고유 방향이 없다.

> [!참고] 복소수 고윳값
> 판별식이 음수일 때도, 수의 범위를 복소수로 넓히면 근 $\cos\theta \pm i\sin\theta$가 생긴다. 이 복소수들은 회전을 담는 다른 언어다. 이 교재는 실수 안에서만 다루므로, 이 뜻은 "아직 여기서 답하지 않은 질문"으로 남겨 둔다.`,
  checks: [
    {
      q: String.raw`$\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$에 실수 고유벡터가 있는가?`,
      choices: ['없다. 시계 방향 90° 회전이다', '있다. e₁ 방향', '있다. 모든 방향', '있다. 대각선 방향'],
      answer: 0,
      explain: String.raw`첫째 열 $(0, -1)$: $\mathbf{e}_1$이 아래쪽을 가리키게 된다. 둘째 열 $(1, 0)$: $\mathbf{e}_2$가 오른쪽을 가리키게 된다. 시계 방향 90° 회전이다. 대각합 0, 행렬식 1이므로 판별식은 $0 - 4 = -4 < 0$이다.`,
    },
  ],
};

export default node;
