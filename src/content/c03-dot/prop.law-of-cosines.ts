import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.law-of-cosines',
  kind: 'prop',
  title: '코사인 법칙',
  status: 'written',
  introduces: { terms: [{ id: 't.law-of-cosines', ko: '코사인 법칙', en: 'law of cosines', gloss: '삼각형의 두 변 a, b와 끼인각 θ로 맞은편 변 c를 구하는 식: c² = a² + b² − 2ab cos θ. 피타고라스 정리를 직각이 아닌 삼각형으로 넓힌 것.' }] },
  requires: ['prop.pythagoras', 'def.angle-trig'],
  predicts: [
    {
      id: 'p-obtuse',
      kind: 'choice',
      q: String.raw`두 변 $a$, $b$ 사이의 끼인각이 90°보다 **큰** 삼각형에서, 맞은편 변 $c$의 제곱 $c^2$은 $a^2 + b^2$과 비교해 어떨까?`,
      hints: [String.raw`끼인각이 정확히 90°이면 [피타고라스 정리](n:prop.pythagoras)에 따라 $c^2 = a^2 + b^2$이다. 두 변을 그대로 둔 채 끼인각을 더 벌리면, 두 변의 끝 사이 거리 $c$는 길어지는가 짧아지는가?`],
      choices: [String.raw`$a^2 + b^2$보다 크다`, String.raw`$a^2 + b^2$보다 작다`, String.raw`같다`, '삼각형마다 다르다'],
      answer: 0,
      why: [
        String.raw`각을 벌릴수록 두 끝이 멀어진다. 아래 식에서 보정항 $-2ab\cos\theta$는 $\cos\theta < 0$이므로 양수가 된다.`,
        String.raw`그것은 끼인각이 90°보다 **작을** 때다. 두 변이 오므라들면 끝이 가까워진다.`,
        String.raw`같은 것은 정확히 90°일 때뿐이다.`,
        String.raw`끼인각이 90°보다 크기만 하면 언제나 크다. 아래 식이 보여 준다.`,
      ],
    },
    {
      id: 'p-calc',
      kind: 'choice',
      q: String.raw`두 변이 3과 2이고 끼인각이 60°인 삼각형의 맞은편 변의 길이는?`,
      hints: [
        String.raw`$\cos60° = 0.5$다(단위원 위 60° 자리의 가로 좌표).`,
        String.raw`$c^2 = 3^2 + 2^2 - 2\cdot3\cdot2\cdot0.5$. 보정항의 부호에 주의하라.`,
      ],
      choices: [String.raw`$\sqrt{7} \approx 2.65$`, String.raw`$\sqrt{13} \approx 3.61$`, String.raw`$\sqrt{19} \approx 4.36$`, '1'],
      answer: 0,
      why: [
        String.raw`$9 + 4 - 6 = 7$.`,
        String.raw`보정항을 빠뜨렸다. 그것은 끼인각이 90°일 때의 답이다.`,
        String.raw`보정항의 부호를 반대로 썼다($+6$). 60°는 90°보다 작으므로 맞은편 변은 피타고라스의 값보다 **짧아야** 한다.`,
        String.raw`그것은 끼인각이 0°일 때($c = 3 - 2$)다.`,
      ],
    },
  ],
  body: String.raw`[피타고라스 정리](t:t.pythagoras)는 직각삼각형에만 쓸 수 있다. 직각이 아닌 삼각형에서 피타고라스 정리는 **얼마나** 틀리는가? 그 틀린 양이 정확히 무엇인가?

::predict p-obtuse

**명제([코사인 법칙](def:t.law-of-cosines)).** 두 변의 길이가 $a$, $b$이고 그 사이의 각이 $\theta$인 삼각형에서, 맞은편 변의 길이 $c$는

$$c^2 = a^2 + b^2 - 2ab\cos\theta$$

를 만족한다. 이 세 글자는 이 노드와 증명에서만 쓰는 이름이다.

피타고라스 정리와 비교하면 **보정항** $-2ab\cos\theta$가 붙었다. 끼인각이 90°이면 [$\cos90° = 0$](why:def.angle-trig)이므로 보정항이 사라지고 피타고라스 정리가 된다. 90°보다 작으면 $\cos\theta > 0$이라 $c$가 짧아지고, 크면 $\cos\theta < 0$이라 길어진다.

::scene c3-cosines {"foot": true}

두 변의 끝(U, V)을 끌어 보라. 읽기 칸에 $c^2$과 $a^2 + b^2$이 나란히 나오고, 그 차이가 보정항과 같다.

::predict p-calc

### 두 개의 예
- $a = 3$, $b = 2$, $\theta = 60°$: $c^2 = 9 + 4 - 6 = 7$, $c = \sqrt{7}$.
- $a = b = 1$, $\theta = 120°$: $\cos120° = -0.5$이므로 $c^2 = 1 + 1 + 1 = 3$, $c = \sqrt{3}$. 끼인각이 커서 피타고라스의 값 $\sqrt{2}$보다 길다.`,
  proof: String.raw`꼭짓점 O를 원점에, 변 $a$를 가로축의 양의 방향에 놓는다. 그러면 한 끝은 $U = (a, 0)$이다. 다른 끝 $V$는 원점에서 거리 $b$, 각 $\theta$인 점이다. 단위원 위 $\theta$ 자리의 점 $(\cos\theta, \sin\theta)$를 원점에서 $b$배 늘인 점이므로 $V = (b\cos\theta,\ b\sin\theta)$다(같은 방향으로 $b$배 늘이면 [두 좌표가 모두 b배가 된다](why:def.scalar-mul)).

맞은편 변 $c$는 $U$와 $V$ 사이의 [거리](why:def.distance)이므로

$$c^2 = (a - b\cos\theta)^2 + (0 - b\sin\theta)^2 = a^2 - 2ab\cos\theta + b^2\cos^2\theta + b^2\sin^2\theta$$

이다. 전개에는 [$(p - q)^2 = p^2 - 2pq + q^2$](why:prop.arith-first)을 썼다. 마지막 두 항을 묶으면 $b^2(\cos^2\theta + \sin^2\theta) = b^2$이다([왜 1인가?](why:prop.cos-sin-identity)). 그러므로 $c^2 = a^2 + b^2 - 2ab\cos\theta$다. 이 계산은 $\theta$가 예각이든 둔각이든 그대로 통한다. 좌표의 부호가 제곱 속에서 처리되기 때문이다.`,
};

export default node;
