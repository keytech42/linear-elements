import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.angle-trig',
  kind: 'def',
  title: '단위원, 각, 코사인과 사인',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.unit-circle', ko: '단위원', en: 'unit circle', gloss: '원점을 중심으로 하고 반지름이 1인 원.' },
      { id: 't.angle', ko: '각', en: 'angle', everyday: true, gloss: '원점을 중심으로 돌아간 양. 단위원 위에서 (1, 0)부터 시계 반대 방향으로 잰 호의 길이.' },
      { id: 't.cos', ko: '코사인', en: 'cosine', gloss: '단위원 위에서 각 θ만큼 돈 점의 가로 좌표.' },
      { id: 't.sin', ko: '사인', en: 'sine', gloss: '단위원 위에서 각 θ만큼 돈 점의 세로 좌표.' },
      { id: 't.radian', ko: '라디안', en: 'radian', gloss: '각을 단위원의 호의 길이로 재는 단위. 한 바퀴 = 2π, 180° = π.' },
    ],
    symbols: [{ tex: String.raw`\theta`, meaning: '각' }],
  },
  requires: ['def.distance'],
  predicts: [
    {
      id: 'p-sign',
      kind: 'choice',
      q: String.raw`$\theta = 150°$일 때 $\cos\theta$와 $\sin\theta$의 부호는?`,
      hints: [String.raw`150°는 90°(위쪽)와 180°(왼쪽) 사이다. 단위원 위에서 그 점은 원점의 어느 쪽에 있는가? 코사인은 가로 좌표, 사인은 세로 좌표다.`],
      choices: ['cos는 음수, sin은 양수', '둘 다 양수', 'cos는 양수, sin은 음수', '둘 다 음수'],
      answer: 0,
      why: [
        String.raw`150° 자리는 왼쪽 위다. 가로 좌표는 음수, 세로 좌표는 양수다.`,
        String.raw`둘 다 양수인 것은 0°와 90° 사이(오른쪽 위)다.`,
        String.raw`그것은 270°와 360° 사이(오른쪽 아래)다. 가로와 세로를 바꿔 읽었을 수 있다.`,
        String.raw`그것은 180°와 270° 사이(왼쪽 아래)다.`,
      ],
    },
    {
      id: 'p-level',
      kind: 'choice',
      q: String.raw`$0° \le \theta < 360°$에서 $\sin\theta = 0.5$가 되는 $\theta$는 몇 개일까?`,
      hints: [String.raw`$\sin\theta$는 단위원 위 점의 세로 좌표다. 높이가 0.5인 가로선을 그으면, 그 선이 단위원과 몇 번 만나는가?`],
      choices: ['2개', '1개', '4개', '무한히 많다'],
      answer: 0,
      why: [
        String.raw`높이 0.5인 가로선은 단위원과 두 번 만난다. 오른쪽 위(30°)와 왼쪽 위(150°)다.`,
        String.raw`30°만 떠올렸다. 가로선은 원의 왼쪽에서도 한 번 더 만난다.`,
        String.raw`세로 좌표가 0.5인 점은 위쪽 반원에만 있다. 아래쪽 반원의 점은 세로 좌표가 음수다.`,
        String.raw`한 바퀴(0° 이상 360° 미만) 안에서는 2개다. 바퀴 수를 제한하지 않으면 무한히 많다.`,
      ],
    },
  ],
  body: String.raw`[회전](fwd:t.rotation)을 수로 다루려면 "얼마나 돌았는가"를 재야 한다. 그리고 돌아간 점의 좌표를 구할 수 있어야 한다.

**정의.** 원점을 중심으로 하고 반지름이 1인 원을 [단위원](def:t.unit-circle)이라 한다. 점 $(1, 0)$에서 출발해 단위원을 따라 시계 반대 방향으로 움직인 호의 길이를 [각](def:t.angle) $\theta$라 하고, 이렇게 잰 각의 단위를 [라디안](def:t.radian)이라 한다. 시계 방향으로 움직이면 각은 음수다.

단위원의 둘레의 절반을 $\pi$($\approx 3.14159$)라 부른다. 그러므로 한 바퀴는 $2\pi$ 라디안이다. 흔히 쓰는 "도"와의 관계는 $360° = 2\pi$, $180° = \pi$, $90° = \pi/2$다.

**정의.** 각 $\theta$만큼 돈 단위원 위의 점의 가로 좌표를 [코사인](def:t.cos) $\cos\theta$, 세로 좌표를 [사인](def:t.sin) $\sin\theta$라 한다.

$$\text{각 } \theta \text{ 자리의 점} = (\cos\theta,\ \sin\theta)$$

::scene c0-unit-circle {}

흰 점을 원을 따라 끌어 보라. 노란 호의 길이가 $\theta$이고, 점에서 가로축으로 내린 발까지가 $\cos\theta$(주황), 세로축으로 건넌 발까지가 $\sin\theta$(청록)다.

### 예
- $\theta = 0$: 점 $(1, 0)$이므로 $\cos 0 = 1$, $\sin 0 = 0$.
- $\theta = 90°$: 점 $(0, 1)$이므로 $\cos90° = 0$, $\sin90° = 1$.
- $\theta = 180°$: 점 $(-1, 0)$이므로 $\cos180° = -1$, $\sin180° = 0$.

::predict p-sign

::predict p-level

::scene c0-unit-circle {"level": 0.5}

> [!코드] 각은 라디안으로
> 이 저장소의 계산(\`circlePoint\`, 그리고 2장의 \`rotation\`)은 각을 라디안으로 받는다. 대부분의 프로그래밍 언어의 \`cos\`, \`sin\` 함수가 라디안을 받기 때문이다.`,
  checks: [
    {
      q: String.raw`$\theta = -90°$(시계 방향으로 90°)일 때 $(\cos\theta, \sin\theta)$는?`,
      choices: ['(0, −1)', '(0, 1)', '(−1, 0)', '(1, 0)'],
      answer: 0,
      explain: String.raw`$(1, 0)$에서 시계 방향으로 4분의 1바퀴 돌면 원의 맨 아래 $(0, -1)$에 닿는다. 음수 각은 시계 방향이다.`,
    },
  ],
  code: ['circlePoint', 'angleOf'],
};

export default node;
