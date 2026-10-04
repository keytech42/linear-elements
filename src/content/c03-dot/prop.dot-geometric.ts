import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.dot-geometric',
  kind: 'prop',
  title: '내적의 기하: u·v = ‖u‖‖v‖cos θ',
  status: 'written',
  requires: ['prop.law-of-cosines', 'def.dot'],
  predicts: [
    {
      id: 'p-max',
      kind: 'choice',
      q: String.raw`$\mathbf{u} = (3, 1)$로 고정하고, 길이가 2인 벡터 $\mathbf{v}$를 아무 방향으로나 돌린다. $\mathbf{u}\cdot\mathbf{v}$가 가장 커지는 것은 언제이고, 그 값은?`,
      hints: [
        String.raw`아래 식 $\mathbf{u}\cdot\mathbf{v} = \|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$에서 $\|\mathbf{u}\|$와 $\|\mathbf{v}\|$는 정해져 있다. $\cos\theta$가 가장 큰 $\theta$는?`,
        String.raw`$\|\mathbf{u}\| = \sqrt{9 + 1} = \sqrt{10}$이다.`,
      ],
      choices: [String.raw`$\mathbf{v}$가 $\mathbf{u}$와 같은 방향일 때, $2\sqrt{10} \approx 6.32$`, String.raw`$\mathbf{v}$가 $\mathbf{u}$와 같은 방향일 때, $2\times(3 + 1) = 8$`, String.raw`$\mathbf{v}$가 $\mathbf{u}$에 수직일 때, 0`, '방향과 상관없이 같다'],
      answer: 0,
      why: [
        String.raw`$\cos\theta$는 $\theta = 0$일 때 가장 크다(1). 그때 값은 $\sqrt{10}\times2$다. 9장에서 "가장 많이 늘어나는 방향"을 찾을 때 같은 생각을 쓴다.`,
        String.raw`방향은 맞지만 값이 틀렸다. 같은 방향의 길이 2인 벡터는 $2\mathbf{u}/\|\mathbf{u}\|$이고, 성분을 그냥 더한 $3 + 1$은 길이가 아니다.`,
        String.raw`수직일 때는 내적이 가장 작은 것이 아니라 0이다. 가장 작은(가장 음수인) 것은 반대 방향일 때다.`,
        String.raw`$\cos\theta$가 방향에 따라 바뀐다.`,
      ],
    },
    {
      id: 'p-eq',
      kind: 'choice',
      q: String.raw`언제나 $|\mathbf{u}\cdot\mathbf{v}| \le \|\mathbf{u}\|\,\|\mathbf{v}\|$이다. 등호가 성립하는 것은 언제일까?`,
      hints: [String.raw`$|\cos\theta| \le 1$이고, 등호는 $\cos\theta = \pm1$일 때다. 그 각은 몇 도인가?`],
      choices: ['두 벡터가 같은 직선 위에 있을 때 (같은 방향이든 반대 방향이든)', '두 벡터가 수직일 때', '두 벡터의 길이가 같을 때', '같은 방향일 때만'],
      answer: 0,
      why: [
        String.raw`$\theta = 0°$ 또는 $180°$일 때 $|\cos\theta| = 1$이다. 둘 중 하나가 영벡터일 때도 양쪽이 0이 되어 등호가 성립한다.`,
        String.raw`수직이면 왼쪽이 0이 되어 가장 멀리 떨어진다.`,
        String.raw`길이는 상관이 없다. 방향만 상관있다.`,
        String.raw`반대 방향($\theta = 180°$)도 $|\cos\theta| = 1$이다. 절댓값을 놓쳤다.`,
      ],
    },
  ],
  body: String.raw`[내적](t:t.dot)은 "곱해서 더하기"라는 숫자 계산으로 정의했다. 그런데 앞 노드의 그림에서는 두 화살표가 이루는 각에 따라 내적의 부호가 바뀌었다. 숫자 계산과 각도는 왜 이어져 있을까?

**명제.** 영벡터가 아닌 두 벡터 $\mathbf{u}$, $\mathbf{v}$ 사이의 각을 $\theta$($0° \le \theta \le 180°$)라 하면

$$\mathbf{u}\cdot\mathbf{v} = \|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$$

이다.

### 그림자로 읽기
$\|\mathbf{v}\|\cos\theta$는 $\mathbf{v}$의 끝에서 $\mathbf{u}$ 방향 직선으로 수직인 선을 내렸을 때 생기는 **그림자의 부호 있는 길이**다(직각삼각형의 밑변이므로). 그러므로 내적은 "$\mathbf{u}$의 길이 × $\mathbf{u}$ 방향으로 드리운 $\mathbf{v}$의 그림자"다. 그림자가 $\mathbf{u}$와 같은 쪽이면 양수, 반대쪽이면 음수, 그림자가 없으면(수직이면) 0이다.

::scene c3-dot-shadow {"mode": "sign"}

::predict p-max

### 부호가 각을 말한다
- $\mathbf{u}\cdot\mathbf{v} > 0$: 각이 90°보다 작다(대체로 같은 쪽을 본다).
- $\mathbf{u}\cdot\mathbf{v} = 0$: 각이 정확히 90°다.
- $\mathbf{u}\cdot\mathbf{v} < 0$: 각이 90°보다 크다(대체로 반대쪽을 본다).

그래서 각을 직접 재지 않아도, 곱해서 더하기 한 번으로 두 벡터가 얼마나 같은 쪽을 보는지 안다. 10장의 신경망에서 뉴런 하나가 하는 일이 바로 이것이다.

::predict p-eq

### 두 개의 예
- $(3, 1)$과 $(1, 2)$: 내적 5, 길이 $\sqrt{10}$과 $\sqrt{5}$. $\cos\theta = 5/\sqrt{50} \approx 0.707$이므로 $\theta = 45°$다.
- $(2, -1)$과 $(1, 2)$: 내적 0이므로 정확히 수직이다.`,
  proof: String.raw`$\mathbf{u}$, $\mathbf{v}$를 원점에서 그리면, 두 끝점과 원점이 삼각형을 이룬다. 두 변의 길이는 $\|\mathbf{u}\|$, $\|\mathbf{v}\|$, 끼인각은 $\theta$, 맞은편 변(두 끝점 사이)은 벡터 $\mathbf{u} - \mathbf{v}$의 길이다. [코사인 법칙](why:prop.law-of-cosines)으로

$$\|\mathbf{u} - \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2\|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$$

한편 왼쪽을 [내적의 계산 규칙](why:def.dot)으로 전개하면

$$\|\mathbf{u} - \mathbf{v}\|^2 = (\mathbf{u} - \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \|\mathbf{u}\|^2 - 2\,\mathbf{u}\cdot\mathbf{v} + \|\mathbf{v}\|^2$$

두 식의 오른쪽을 같게 놓으면 $\|\mathbf{u}\|^2$과 $\|\mathbf{v}\|^2$이 지워지고, $-2\,\mathbf{u}\cdot\mathbf{v} = -2\|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$가 남는다. 양쪽을 $-2$로 나누면 명제가 된다.`,
};

export default node;
