import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.cos-sin-identity',
  kind: 'prop',
  title: 'cos²θ + sin²θ = 1',
  status: 'written',
  requires: ['def.angle-trig', 'prop.pythagoras'],
  predicts: [
    {
      id: 'p-cos',
      kind: 'choice',
      q: String.raw`$\sin\theta = 0.6$이고 $\theta$가 90°와 180° 사이에 있다. $\cos\theta$는?`,
      hints: [
        String.raw`점 $(\cos\theta, \sin\theta)$는 단위원 위에 있으므로 원점에서의 거리가 1이다. [거리의 식](n:def.distance)을 써 보라.`,
        String.raw`$\cos^2\theta = 1 - 0.36 = 0.64$이므로 $\cos\theta$는 $0.8$ 또는 $-0.8$이다. 어느 쪽인지는 $\theta$가 원의 어느 쪽에 있는지가 정한다.`,
      ],
      choices: ['−0.8', '0.8', '0.4', '−0.4'],
      answer: 0,
      why: [
        String.raw`$\cos^2\theta = 0.64$이고, 90°와 180° 사이의 점은 왼쪽 위에 있으므로 가로 좌표가 음수다. 그래서 $-0.8$이다.`,
        String.raw`크기는 맞지만 부호를 놓쳤다. 90°와 180° 사이는 원의 왼쪽이다. 거의 맞는 답이다.`,
        String.raw`$1 - 0.6$을 계산했다. 제곱을 빠뜨렸다: $1 - 0.6^2$.`,
        String.raw`제곱을 빠뜨리고 부호만 맞췄다.`,
      ],
    },
  ],
  body: String.raw`코사인과 사인은 각마다 따로 정해지는 두 수다. 두 수 사이에는 어떤 관계가 있을까?

**명제.** 모든 각 $\theta$에 대해

$$\cos^2\theta + \sin^2\theta = 1$$

이다. ($\cos^2\theta$는 $(\cos\theta)^2$을 줄여 쓴 것이다.)

::scene c0-unit-circle {"identity": true}

그림의 직각삼각형을 보라. 원점, 가로축 위의 발, 원 위의 점이 이루는 직각삼각형의 두 직각변은 $|\cos\theta|$와 $|\sin\theta|$이고, 빗변은 반지름 1이다.

::predict p-cos

### 두 개의 예
- $\theta = 30°$: $\cos30° = \sqrt{3}/2 \approx 0.866$, $\sin30° = 0.5$. $0.75 + 0.25 = 1$.
- $\theta = 45°$: 점이 대각선 위에 있으므로 $\cos45° = \sin45°$이고, $2\cos^2 45° = 1$에서 $\cos45° = \sin45° = 1/\sqrt{2} \approx 0.707$.

이 식은 2장에서 회전 [행렬](fwd:t.matrix)의 열이 길이 1이라는 것을 보일 때, 그리고 8장에서 회전에 실수 [고유벡터](fwd:t.eigenvector)가 없다는 것을 보일 때 다시 쓰인다.`,
  proof: String.raw`점 $(\cos\theta, \sin\theta)$는 [정의에 따라](why:def.angle-trig) 단위원 위에 있으므로 원점에서의 거리가 1이다. [거리의 식](why:def.distance)으로 쓰면 $\sqrt{\cos^2\theta + \sin^2\theta} = 1$이고, 양쪽을 제곱하면 $\cos^2\theta + \sin^2\theta = 1$이다. 이 논증은 점이 원의 어느 쪽에 있든(좌표가 음수여도) 그대로 통한다. 거리의 식은 차이를 제곱하므로 [부호가 상관없기 때문이다](why:prop.neg-times-neg).`,
};

export default node;
