import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.det-sign',
  kind: 'prop',
  title: '음수 행렬식 = 뒤집힘',
  status: 'written',
  requires: ['prop.det-formula'],
  predicts: [
    {
      id: 'p-swap',
      kind: 'choice',
      q: String.raw`행렬 $A$의 두 열을 맞바꾼 행렬의 행렬식은 $\det A$와 어떤 관계일까?`,
      hints: [String.raw`두 열이 만드는 평행사변형은 같다(넓이가 같다). 그런데 "$\mathbf{a}_1$에서 $\mathbf{a}_2$로 도는 쪽"과 "$\mathbf{a}_2$에서 $\mathbf{a}_1$로 도는 쪽"은?`],
      choices: [String.raw`$-\det A$`, String.raw`$\det A$`, '0', String.raw`$1/\det A$`],
      answer: 0,
      why: [
        String.raw`넓이는 같고 도는 방향만 반대가 된다. 공식으로도 $a_{12}a_{21} - a_{11}a_{22} = -(a_{11}a_{22} - a_{12}a_{21})$.`,
        String.raw`넓이만 보면 같다. 그러나 순서를 바꾸면 도는 방향이 뒤집힌다. 거의 맞는 답이다.`,
        String.raw`평행사변형이 납작해지지 않았다.`,
        String.raw`역수가 될 이유가 없다. 넓이가 같다.`,
      ],
    },
  ],
  body: String.raw`넓이는 음수일 수 없다. 그런데 [행렬식의 공식](n:prop.det-formula)은 음수를 내기도 한다. 그 음수는 정확히 무엇을 뜻할까?

**명제.** $\det A < 0$인 것은 $A$가 [향](t:t.orientation)을 뒤집는 것과 같다. 기하적으로 2×2 행렬식은

$$\det A = (R_{90°}\,\mathbf{a}_1)\cdot\mathbf{a}_2$$

곧 "첫째 열을 시계 반대 방향으로 90° 돌린 벡터"와 "둘째 열"의 [내적](t:t.dot)이다.

::scene c4-signed-area {"perp": true}

"a₁를 90° 돌림"을 켜 보라. 하늘색 화살표가 $\mathbf{a}_1$을 90° 돌린 것이다. $\mathbf{a}_2$가 그 화살표와 같은 쪽(내적 양수)에 있으면, $\mathbf{a}_1$에서 $\mathbf{a}_2$로 시계 반대 방향으로 돈다. 반대쪽(내적 음수)이면 시계 방향으로 돈다. [내적의 부호는 각이 90°보다 작은지를 말해 주었다](why:prop.dot-geometric).

::predict p-swap

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$: $\mathbf{a}_1 = (1, 3)$을 90° 돌리면 $(-3, 1)$, 이것과 $\mathbf{a}_2 = (2, 4)$의 내적은 $-6 + 4 = -2$. 공식의 답과 같다.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: $\mathbf{a}_1 = (0, 1)$을 돌리면 $(-1, 0)$, $\mathbf{a}_2 = (1, 0)$과의 내적은 $-1$. 반사는 향을 뒤집는다.

> [!비유] 왼손과 오른손
> 행렬식의 부호는 왼손 장갑과 오른손 장갑의 차이와 같다. 평면 위에서 손 모양을 아무리 돌리고 밀어도 왼손은 오른손이 되지 않는다(부호가 그대로). 거울에 비추면 바뀐다(부호가 뒤집힌다). 이 비유가 깨지는 지점은 행렬식이 0인 경우다. 손이 납작한 선이 되어 버리면 왼손도 오른손도 아니게 되는데, 장갑에는 그런 상태가 없다.`,
  proof: String.raw`[90° 회전](why:prop.rotation-matrix)은 $(p, q)$를 $(-q, p)$로 보내므로 $R_{90°}\mathbf{a}_1 = (-a_{21}, a_{11})$이다. 이것과 $\mathbf{a}_2 = (a_{12}, a_{22})$의 내적은 $-a_{21}a_{12} + a_{11}a_{22}$이고, 이것은 [2×2 공식](why:prop.det-formula) 그대로다. 내적이 양수인 것은 $\mathbf{a}_2$와 $R_{90°}\mathbf{a}_1$ 사이의 각이 90°보다 작다는 것, 곧 $\mathbf{a}_2$가 $\mathbf{a}_1$에서 시계 반대 방향으로 0°에서 180° 사이에 있다는 것이다. 그것이 향이 유지된다는 뜻이다.`,
};

export default node;
