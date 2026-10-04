import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.rotation-matrix',
  kind: 'prop',
  title: '회전 행렬 R_θ',
  status: 'written',
  introduces: { symbols: [{ tex: String.raw`R_\theta`, meaning: '각 θ만큼 시계 반대 방향으로 돌리는 회전 행렬' }] },
  requires: ['exp.gallery', 'prop.cos-sin-identity'],
  predicts: [
    {
      id: 'p-e2',
      kind: 'point',
      q: String.raw`공식을 만들기 전에: 시계 반대 방향 60° 회전은 $\mathbf{e}_2$를 어디로 보낼까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`$\mathbf{e}_2$는 단위원 위 90° 자리에 있다. 60°를 더 돌면 몇 도 자리인가?`,
        String.raw`150° 자리는 왼쪽 위다. 그 점의 가로 좌표는 음수, 세로 좌표는 양수다. 30° 자리 $(\cos30°, \sin30°) \approx (0.87, 0.5)$를 세로축에 비친 점이다.`,
      ],
      A: [[0.5, -0.8660254037844386], [0.8660254037844386, 0.5]],
      x: [0, 1],
      target: 'Ax',
      show: ['circle', 'x'],
      tol: 0.15,
      reveal: String.raw`정답은 $(-0.87, 0.5)$, 곧 $(-\sin60°, \cos60°)$다. 일반적으로 $\theta$ 회전은 $\mathbf{e}_2$를 $(-\sin\theta, \cos\theta)$로 보낸다. 아래 증명이 그 이유다.`,
    },
  ],
  body: String.raw`[도감](n:exp.gallery)에서 30° 회전을 보았다. 아무 각 $\theta$의 [회전](t:t.rotation)의 행렬은 무엇일까? [행렬은 기저의 도착지를 열로 적은 것](why:def.matrix)이므로, $\mathbf{e}_1$과 $\mathbf{e}_2$가 어디로 가는지만 알면 된다.

::predict p-e2

**명제.** 원점을 중심으로 시계 반대 방향으로 $\theta$만큼 돌리는 회전의 행렬은

$$R_\theta = \begin{bmatrix} \ca{\cos\theta} & \cb{-\sin\theta} \\ \ca{\sin\theta} & \cb{\cos\theta} \end{bmatrix}$$

이다. 첫째 열이 $\mathbf{e}_1$의 도착지, 둘째 열이 $\mathbf{e}_2$의 도착지다.

### 두 개의 예
- $\theta = 90°$: $\cos90° = 0$, $\sin90° = 1$이므로 $R_{90°} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$. [행렬을 읽는 법](n:def.matrix)에서 본 행렬과 같다.
- $\theta = 30°$: $R_{30°} \approx \begin{bmatrix} 0.866 & -0.5 \\ 0.5 & 0.866 \end{bmatrix}$. 둘째 열 $(-0.5, 0.866)$의 길이는 $\sqrt{0.25 + 0.75} = 1$이다. 회전은 길이를 바꾸지 않는다.

> [!코드] 각의 단위
> 이 저장소의 \`rotation\`은 각을 [라디안](t:t.radian)으로 받는다(90° = $\pi/2$). 수학 함수 \`Math.cos\`가 라디안을 받기 때문이다.`,
  proof: String.raw`**첫째 열.** 회전은 $\mathbf{e}_1 = (1, 0)$, 곧 단위원 위 0° 자리의 점을 $\theta$ 자리로 옮긴다. [코사인과 사인은 단위원 위 θ 자리의 점의 좌표로 정의했으므로](why:def.angle-trig) 도착지는 $(\cos\theta, \sin\theta)$다.

**둘째 열.** 먼저 사실 하나를 보이자. **점 $(a, b)$를 원점 중심으로 시계 반대 방향 90° 돌리면 $(-b, a)$가 된다.** 원점, $(a, 0)$, $(a, b)$를 꼭짓점으로 하는 직각삼각형을 통째로 90° 돌려 보라. 가로 변(길이 $a$, 오른쪽 방향)은 세로 변(길이 $a$, 위쪽 방향)이 되고, 세로 변(길이 $b$, 위쪽 방향)은 가로 변(길이 $b$, 왼쪽 방향)이 된다. 그래서 꼭짓점 $(a, b)$는 $(-b, a)$로 간다. $a$, $b$가 음수일 때도 방향이 함께 뒤집히므로 같은 식이 성립한다.

$\mathbf{e}_2$는 $\mathbf{e}_1$을 90° 돌린 것이다. 회전을 두 번 하는 순서는 결과에 영향을 주지 않는다(90° 돌리고 $\theta$ 돌린 것과 $\theta$ 돌리고 90° 돌린 것은 둘 다 $90° + \theta$ 돌린 것이다). 그러므로 $\mathbf{e}_2$의 도착지는 "$\mathbf{e}_1$의 도착지 $(\cos\theta, \sin\theta)$를 90° 돌린 것", 곧 $(-\sin\theta, \cos\theta)$다. 검산으로 길이를 재면 $\sin^2\theta + \cos^2\theta = 1$([왜?](why:prop.cos-sin-identity))이다.`,
  code: ['rotation'],
};

export default node;
