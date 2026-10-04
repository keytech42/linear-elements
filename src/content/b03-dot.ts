import type { Book } from './schema';

// 3권 — 길이, 각도, 내적. "곱해서 더하기"라는 숫자 계산이 왜 길이와 각도를 재는가.
const book: Book = {
  id: 'b3',
  num: 3,
  title: '길이·각도·내적',
  subtitle: '두 벡터가 얼마나 같은 쪽을 보는가',
  nodes: [
    {
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

::scene b3-cosines {"foot": true}

두 변의 끝(U, V)을 끌어 보라. 읽기 칸에 $c^2$과 $a^2 + b^2$이 나란히 나오고, 그 차이가 보정항과 같다.

::predict p-calc

### 두 개의 예
- $a = 3$, $b = 2$, $\theta = 60°$: $c^2 = 9 + 4 - 6 = 7$, $c = \sqrt{7}$.
- $a = b = 1$, $\theta = 120°$: $\cos120° = -0.5$이므로 $c^2 = 1 + 1 + 1 = 3$, $c = \sqrt{3}$. 끼인각이 커서 피타고라스의 값 $\sqrt{2}$보다 길다.`,
      proof: String.raw`꼭짓점 O를 원점에, 변 $a$를 가로축의 양의 방향에 놓는다. 그러면 한 끝은 $U = (a, 0)$이다. 다른 끝 $V$는 원점에서 거리 $b$, 각 $\theta$인 점이다. 단위원 위 $\theta$ 자리의 점 $(\cos\theta, \sin\theta)$를 원점에서 $b$배 늘인 점이므로 $V = (b\cos\theta,\ b\sin\theta)$다(같은 방향으로 $b$배 늘이면 [두 좌표가 모두 b배가 된다](why:def.scalar-mul)).

맞은편 변 $c$는 $U$와 $V$ 사이의 [거리](why:def.distance)이므로

$$c^2 = (a - b\cos\theta)^2 + (0 - b\sin\theta)^2 = a^2 - 2ab\cos\theta + b^2\cos^2\theta + b^2\sin^2\theta$$

이다. 전개에는 [$(p - q)^2 = p^2 - 2pq + q^2$](why:prop.arith-first)을 썼다. 마지막 두 항을 묶으면 $b^2(\cos^2\theta + \sin^2\theta) = b^2$이다([왜 1인가?](why:prop.cos-sin-identity)). 그러므로 $c^2 = a^2 + b^2 - 2ab\cos\theta$다. 이 계산은 $\theta$가 예각이든 둔각이든 그대로 통한다. 좌표의 부호가 제곱 속에서 처리되기 때문이다.`,
    },
    {
      id: 'def.norm',
      kind: 'def',
      title: '벡터의 길이(노름)',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.norm', ko: '노름', en: 'norm', surfaces: ['벡터의 길이'], gloss: '벡터의 길이. 성분을 제곱해서 더한 값의 제곱근.' },
          { id: 't.unit-vector', ko: '단위벡터', en: 'unit vector', surfaces: ['단위 벡터'], gloss: '길이가 1인 벡터. 방향만 담는다.' },
        ],
        symbols: [{ tex: String.raw`\|\mathbf{v}\|`, meaning: '벡터 v의 길이(노름)' }],
      },
      requires: ['def.distance', 'def.vector'],
      predicts: [
        {
          id: 'p-3d',
          kind: 'choice',
          q: String.raw`3차원 벡터 $\mathbf{v} = (1, 2, 2)$의 길이는?`,
          hints: [
            String.raw`먼저 바닥(가로·세로 평면)에서 $(1, 2)$만큼 가는 대각선의 길이를 구하라. 그다음 그 대각선과 높이 2가 직각삼각형의 두 직각변이 된다.`,
            String.raw`바닥 대각선은 $\sqrt{1 + 4} = \sqrt{5}$. 이제 $\sqrt{(\sqrt5)^2 + 2^2}$.`,
          ],
          choices: ['3', '5', String.raw`$\sqrt{5}$`, '9'],
          answer: 0,
          why: [
            String.raw`$\sqrt{1 + 4 + 4} = 3$. 피타고라스 정리를 두 번 쓴 결과가 "세 성분의 제곱의 합의 제곱근"이다.`,
            String.raw`성분을 그냥 더했다. 길이는 제곱해서 더한 뒤 제곱근이다.`,
            String.raw`바닥 대각선에서 멈췄다. 높이 2가 남아 있다.`,
            String.raw`길이의 **제곱**이다. 제곱근을 빠뜨렸다.`,
          ],
        },
        {
          id: 'p-scale',
          kind: 'choice',
          q: String.raw`벡터 $\mathbf{v}$를 $c$배 한 $c\mathbf{v}$의 길이는 $\|\mathbf{v}\|$와 어떤 관계일까?`,
          hints: [String.raw`성분이 모두 $c$배가 된다. 제곱하면 $c^2$배, 그 합도 $c^2$배다. 그 제곱근은? $c$가 음수일 수 있다는 것을 잊지 마라.`],
          choices: [String.raw`$|c|\,\|\mathbf{v}\|$`, String.raw`$c\,\|\mathbf{v}\|$`, String.raw`$c^2\,\|\mathbf{v}\|$`, String.raw`$\|\mathbf{v}\|$ (변하지 않는다)`],
          answer: 0,
          why: [
            String.raw`$\sqrt{c^2v_1^2 + c^2v_2^2} = \sqrt{c^2}\sqrt{v_1^2 + v_2^2} = |c|\,\|\mathbf{v}\|$. 뒤집어도($c < 0$) 길이는 음수가 되지 않는다.`,
            String.raw`$c$가 음수이면 길이가 음수가 되어 버린다. 거의 맞는 답이다. $\sqrt{c^2} = |c|$이다.`,
            String.raw`제곱한 뒤 제곱근을 빠뜨렸다.`,
            String.raw`스칼라 곱은 [늘이거나 줄인다](n:def.scalar-mul). 길이가 바뀐다.`,
          ],
        },
      ],
      body: String.raw`화살표의 길이를 좌표만으로 잴 수 있을까? 2차원에서는 [거리의 식](n:def.distance)이 답이다. 3차원 이상에서도 같은 식이 통할까?

**정의.** 벡터 $\mathbf{v}$의 성분을 모두 제곱해 더한 값의 제곱근을 $\mathbf{v}$의 [노름](def:t.norm)(길이)이라 하고 $\|\mathbf{v}\|$로 쓴다.

$$\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2} \quad (\text{2차원}), \qquad \|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2 + v_3^2} \quad (\text{3차원})$$

2차원에서는 원점에서 끝점까지의 거리 그대로다.

::scene b3-norm {}

::predict p-3d

### 3차원: 피타고라스 정리를 두 번
3차원의 $\mathbf{v} = (v_1, v_2, v_3)$를 바닥 이동 $(v_1, v_2, 0)$과 높이 이동 $(0, 0, v_3)$로 나눈다. 바닥 이동의 길이 $d$는 바닥 평면에서의 피타고라스 정리로 $d^2 = v_1^2 + v_2^2$이다. 높이 이동은 바닥 평면 전체에 수직이므로 바닥 대각선과도 수직이다. 그래서 $d$와 $v_3$을 두 직각변으로 하는 직각삼각형이 생기고, 그 빗변이 $\mathbf{v}$다: $\|\mathbf{v}\|^2 = d^2 + v_3^2 = v_1^2 + v_2^2 + v_3^2$. 성분이 $n$개여도 같은 걸음을 되풀이하면 $\|\mathbf{v}\|^2 = v_1^2 + \cdots + v_n^2$이다.

::scene b3-norm3d {}

::predict p-scale

### 단위벡터: 방향만 남기기
길이가 1인 벡터를 [단위벡터](def:t.unit-vector)라 한다. 영벡터가 아닌 $\mathbf{v}$를 자기 길이로 나누면 $\mathbf{v}/\|\mathbf{v}\|$는 같은 방향의 단위벡터다. 위 관문의 결과에 $c = 1/\|\mathbf{v}\|$를 넣으면 길이가 $\|\mathbf{v}\|/\|\mathbf{v}\| = 1$이 되기 때문이다. 영벡터는 길이가 0이라 나눌 수 없다. 방향이 없기 때문이다.

### 두 개의 예
- $(3, 4)$: 길이 5, 단위벡터 $(0.6, 0.8)$.
- $(1, 2, 2)$: 길이 3, 단위벡터 $(1/3, 2/3, 2/3)$.`,
      checks: [
        {
          q: String.raw`$\|\mathbf{v}\| = 0$인 벡터는?`,
          choices: ['영벡터뿐이다', '모든 성분이 서로 같은 벡터', '성분의 합이 0인 벡터', '그런 벡터는 없다'],
          answer: 0,
          explain: String.raw`제곱의 합이 0이려면, [제곱은 모두 0 이상](n:prop.neg-times-neg)이므로 각 제곱이 0이어야 한다. 곧 모든 성분이 0이다. 성분의 합이 0인 $(1, -1)$의 길이는 $\sqrt{2}$다.`,
        },
      ],
      code: ['norm', 'normalize'],
    },
    {
      id: 'def.dot',
      kind: 'def',
      title: '내적',
      status: 'written',
      introduces: {
        terms: [{ id: 't.dot', ko: '내적', en: 'dot product', gloss: '두 벡터의 같은 자리 성분끼리 곱해서 모두 더한 수. 길이와 각도를 함께 담는다.' }],
        symbols: [{ tex: String.raw`\mathbf{u}\cdot\mathbf{v}`, meaning: '벡터 u와 v의 내적' }],
      },
      requires: ['def.norm'],
      predicts: [
        {
          id: 'p-cross',
          kind: 'choice',
          q: String.raw`$\|\mathbf{u} + \mathbf{w}\|^2$을 성분으로 전개하면, $\|\mathbf{u}\|^2 + \|\mathbf{w}\|^2$에 무엇이 더 붙을까? (2차원)`,
          hints: [
            String.raw`$\mathbf{u} + \mathbf{w}$의 첫째 성분은 $u_1 + w_1$이다. $(u_1 + w_1)^2$을 [전개](n:prop.arith-first)하면?`,
            String.raw`$(u_1 + w_1)^2 + (u_2 + w_2)^2$을 전개해 $u$끼리, $w$끼리, 섞인 것끼리 모아 보라.`,
          ],
          choices: [String.raw`$2(u_1w_1 + u_2w_2)$`, '아무것도 붙지 않는다 (언제나 피타고라스)', String.raw`$2\|\mathbf{u}\|\,\|\mathbf{w}\|$`, String.raw`$u_1w_2 + u_2w_1$`],
          answer: 0,
          why: [
            String.raw`$(u_1 + w_1)^2 + (u_2 + w_2)^2 = (u_1^2 + u_2^2) + (w_1^2 + w_2^2) + 2(u_1w_1 + u_2w_2)$. 가운데의 "섞인 항"이 이 노드의 주인공이다.`,
            String.raw`그것은 $\mathbf{u}$와 $\mathbf{w}$가 수직일 때뿐이다(피타고라스). 일반적으로는 섞인 항이 남는다.`,
            String.raw`두 벡터가 **같은 방향**일 때만 맞는다. 일반적으로는 그보다 작다(다음 노드).`,
            String.raw`첫째와 둘째 성분을 엇갈려 곱했다. 섞인 항은 **같은 자리** 성분끼리의 곱이다.`,
          ],
        },
        {
          id: 'p-zero',
          kind: 'choice',
          q: String.raw`$(2, -1)\cdot(1, 2)$는?`,
          hints: [String.raw`같은 자리끼리 곱한 뒤 **더한다**. 결과는 벡터가 아니라 수 하나다.`],
          choices: ['0', '4', '벡터 (2, −2)', '−4'],
          answer: 0,
          why: [
            String.raw`$2\cdot1 + (-1)\cdot2 = 2 - 2 = 0$. 내적이 0이라는 것의 뜻은 다음다음 노드에서 밝혀진다(그림을 그려 두 화살표가 어떻게 놓였는지 보라).`,
            String.raw`$2 + 2$로 계산했다. 둘째 항의 부호를 놓쳤다.`,
            String.raw`곱하기만 하고 더하지 않았다. 내적은 수 **하나**다.`,
            String.raw`첫째 항의 부호를 놓쳤다.`,
          ],
        },
      ],
      body: String.raw`[노름](t:t.norm)의 제곱 $\|\mathbf{v}\|^2 = v_1^2 + v_2^2$은 "같은 자리 성분끼리 곱해서 더한 것"이다. 이 계산을 서로 **다른** 두 벡터에 하면 무엇이 될까? 그것이 왜 쓸모 있을까?

::predict p-cross

전개해 보면 $\|\mathbf{u} + \mathbf{w}\|^2$은 $\|\mathbf{u}\|^2 + \|\mathbf{w}\|^2$에 섞인 항 $2(u_1w_1 + u_2w_2)$가 더해진 것이다. 섞인 항이 0이면 피타고라스 정리와 같은 꼴이 된다. 이 섞인 항을 정확히 다루기 위해 이름을 붙인다.

**정의.** 두 벡터 $\mathbf{u}$, $\mathbf{v}$의 [내적](def:t.dot)은 같은 자리 성분끼리 곱해서 모두 더한 수다.

$$\mathbf{u}\cdot\mathbf{v} = u_1v_1 + u_2v_2 \quad (\text{성분이 } n\text{개면 } u_1v_1 + \cdots + u_nv_n)$$

이 이름으로 쓰면 $\|\mathbf{v}\|^2 = \mathbf{v}\cdot\mathbf{v}$이고, $\|\mathbf{u} + \mathbf{w}\|^2 = \|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{w} + \|\mathbf{w}\|^2$이다. 내적은 **피타고라스 정리가 틀리는 양**을 재는 수다.

::predict p-zero

### 계산 규칙
아래 규칙은 모두 [수의 계산 규칙](why:ax.arith)을 성분마다 쓰면 나온다.
- 순서를 바꿔도 같다: $\mathbf{u}\cdot\mathbf{v} = \mathbf{v}\cdot\mathbf{u}$.
- 덧셈 위로 나뉜다: $\mathbf{u}\cdot(\mathbf{v} + \mathbf{w}) = \mathbf{u}\cdot\mathbf{v} + \mathbf{u}\cdot\mathbf{w}$.
- 스칼라가 밖으로 나온다: $(c\mathbf{u})\cdot\mathbf{v} = c(\mathbf{u}\cdot\mathbf{v})$.
- 자기 자신과의 내적은 0 이상이고, 0인 것은 영벡터뿐이다: $\mathbf{v}\cdot\mathbf{v} = \|\mathbf{v}\|^2$.

### 두 개의 예
- $(3, 1)\cdot(1, 2) = 3 + 2 = 5$.
- $(1, 2, 2)\cdot(2, 0, -1) = 2 + 0 - 2 = 0$.

::scene b3-dot-shadow {"mode": "dot"}

그림에서 두 벡터를 끌면 내적의 값이 바뀐다. 값이 양수일 때, 0일 때, 음수일 때 두 화살표가 어떻게 놓이는지 보라. 그 이유는 다음 노드에서 증명한다.`,
      checks: [
        {
          q: String.raw`$\mathbf{u}\cdot\mathbf{u} = 9$이고 $\mathbf{w}\cdot\mathbf{w} = 4$, $\mathbf{u}\cdot\mathbf{w} = -3$이다. $\|\mathbf{u} + \mathbf{w}\|^2$은?`,
          choices: ['7', '13', '19', '10'],
          answer: 0,
          explain: String.raw`$\|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{w} + \|\mathbf{w}\|^2 = 9 - 6 + 4 = 7$. 성분을 몰라도 세 내적만으로 계산된다. 13은 섞인 항을 빠뜨린 것, 10은 섞인 항에 2를 곱하지 않은 것이다.`,
        },
      ],
      code: ['dot'],
    },
    {
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
            String.raw`$\cos\theta$는 $\theta = 0$일 때 가장 크다(1). 그때 값은 $\sqrt{10}\times2$다. 9권에서 "가장 많이 늘어나는 방향"을 찾을 때 같은 생각을 쓴다.`,
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

::scene b3-dot-shadow {"mode": "sign"}

::predict p-max

### 부호가 각을 말한다
- $\mathbf{u}\cdot\mathbf{v} > 0$: 각이 90°보다 작다(대체로 같은 쪽을 본다).
- $\mathbf{u}\cdot\mathbf{v} = 0$: 각이 정확히 90°다.
- $\mathbf{u}\cdot\mathbf{v} < 0$: 각이 90°보다 크다(대체로 반대쪽을 본다).

그래서 각을 직접 재지 않아도, 곱해서 더하기 한 번으로 두 벡터가 얼마나 같은 쪽을 보는지 안다. 10권의 신경망에서 뉴런 하나가 하는 일이 바로 이것이다.

::predict p-eq

### 두 개의 예
- $(3, 1)$과 $(1, 2)$: 내적 5, 길이 $\sqrt{10}$과 $\sqrt{5}$. $\cos\theta = 5/\sqrt{50} \approx 0.707$이므로 $\theta = 45°$다.
- $(2, -1)$과 $(1, 2)$: 내적 0이므로 정확히 수직이다.`,
      proof: String.raw`$\mathbf{u}$, $\mathbf{v}$를 원점에서 그리면, 두 끝점과 원점이 삼각형을 이룬다. 두 변의 길이는 $\|\mathbf{u}\|$, $\|\mathbf{v}\|$, 끼인각은 $\theta$, 맞은편 변(두 끝점 사이)은 벡터 $\mathbf{u} - \mathbf{v}$의 길이다. [코사인 법칙](why:prop.law-of-cosines)으로

$$\|\mathbf{u} - \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2\|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$$

한편 왼쪽을 [내적의 계산 규칙](why:def.dot)으로 전개하면

$$\|\mathbf{u} - \mathbf{v}\|^2 = (\mathbf{u} - \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \|\mathbf{u}\|^2 - 2\,\mathbf{u}\cdot\mathbf{v} + \|\mathbf{v}\|^2$$

두 식의 오른쪽을 같게 놓으면 $\|\mathbf{u}\|^2$과 $\|\mathbf{v}\|^2$이 지워지고, $-2\,\mathbf{u}\cdot\mathbf{v} = -2\|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$가 남는다. 양쪽을 $-2$로 나누면 명제가 된다.`,
    },
    {
      id: 'def.orthogonal',
      kind: 'def',
      title: '직교와 정규직교',
      status: 'written',
      introduces: {
        terms: [
          { id: 't.orthogonal', ko: '직교', en: 'orthogonal', gloss: '두 벡터의 내적이 0인 관계. 기하적으로는 서로 수직. 영벡터는 모든 벡터와 직교한다.' },
          { id: 't.orthonormal', ko: '정규직교', en: 'orthonormal', gloss: '서로 직교하고 각각의 길이가 1인 벡터들의 모임.' },
        ],
      },
      requires: ['prop.dot-geometric'],
      predicts: [
        {
          id: 'p-zerovec',
          kind: 'choice',
          q: String.raw`영벡터 $\mathbf{0}$은 $(1, 2)$와 직교할까?`,
          hints: [String.raw`"수직"을 각으로 정의하면 영벡터는 방향이 없어서 판정할 수 없다. 그런데 아래 정의는 각이 아니라 무엇으로 직교를 판정하는가?`],
          choices: ['그렇다. 내적이 0이므로', '아니다. 영벡터는 방향이 없어 각을 잴 수 없으므로', '판정할 수 없다', '아니다. 영벡터는 길이가 0이므로'],
          answer: 0,
          why: [
            String.raw`$\mathbf{0}\cdot(1, 2) = 0$이다. 직교를 내적으로 정의하면 영벡터도 판정되고, 모든 벡터와 직교한다.`,
            String.raw`각으로는 판정할 수 없다는 것은 맞다. 그래서 직교를 각이 **아니라** 내적으로 정의한다. 그러면 영벡터도 빠짐없이 판정된다. 정의를 고르는 이유가 바로 이것이다.`,
            String.raw`내적으로 정의했으므로 언제나 판정할 수 있다.`,
            String.raw`길이가 0이라는 것이 오히려 내적을 0으로 만든다.`,
          ],
        },
        {
          id: 'p-perp',
          kind: 'choice',
          q: String.raw`$(a, b)$에 직교하고 길이가 같은 벡터는? (영벡터가 아닌 $(a, b)$)`,
          hints: [String.raw`$(a, b)\cdot(p, q) = ap + bq$가 0이 되려면 $(p, q)$를 어떻게 고르면 되는가? 성분의 자리를 바꾸고 한쪽에 부호를 붙여 보라.`],
          choices: ['(−b, a)', '(b, a)', '(−a, −b)', '(a, −b)'],
          answer: 0,
          why: [
            String.raw`$a(-b) + ba = 0$이고 길이는 $\sqrt{b^2 + a^2}$로 같다. 2권에서 본 [90° 회전](n:prop.rotation-matrix)의 결과와 같다. 반대쪽 $(b, -a)$도 답이다.`,
            String.raw`$(a, b)\cdot(b, a) = 2ab$이므로 $a$나 $b$가 0일 때만 직교한다. 부호 하나를 빠뜨렸다.`,
            String.raw`그것은 반대 방향(180°)이다. 내적이 $-(a^2 + b^2)$로 가장 작다.`,
            String.raw`그것은 가로축에 비친 것이다. 내적은 $a^2 - b^2$이다.`,
          ],
        },
      ],
      body: String.raw`"수직"이라는 말을 그림 없이, 계산만으로 판정하고 싶다.

**정의.** 두 벡터의 [내적](t:t.dot)이 0이면 두 벡터가 [직교](def:t.orthogonal)한다고 한다. 영벡터가 아닌 두 벡터라면 [앞 노드](why:prop.dot-geometric)에 따라 $\cos\theta = 0$, 곧 사이의 각이 90°라는 뜻이다.

::predict p-zerovec

**정의.** 벡터들이 서로 둘씩 모두 직교하고, 각각의 길이가 1이면 [정규직교](def:t.orthonormal)라 한다.

정규직교인 벡터들은 "서로 독립적인 방향을 하나씩 맡은 길이 1짜리 자"다. 표준 기저 $\mathbf{e}_1, \mathbf{e}_2$가 대표적인 예다: $\mathbf{e}_1\cdot\mathbf{e}_2 = 0$, $\|\mathbf{e}_1\| = \|\mathbf{e}_2\| = 1$.

::predict p-perp

### 두 개의 예
- $(1, 1)/\sqrt{2}$와 $(1, -1)/\sqrt{2}$: 내적 $(1 - 1)/2 = 0$, 길이 각각 1. 정규직교다. 표준 기저를 45° 돌린 것이다.
- $(1, 2, 2)/3$, $(2, 1, -2)/3$, $(2, -2, 1)/3$: 둘씩 내적하면 $(2 + 2 - 4)/9 = 0$, $(2 - 4 + 2)/9 = 0$, $(4 - 2 - 2)/9 = 0$이고 길이는 모두 1이다. 3차원의 정규직교 벡터 셋이다.

정규직교 벡터들은 9권까지 계속 등장한다. 9권의 [특이값 분해](fwd:t.svd)가 만드는 $U$와 $V$의 열이 바로 정규직교 벡터들이다.`,
      checks: [
        {
          q: String.raw`$(3, t)$가 $(2, -6)$과 직교하는 $t$는?`,
          choices: ['1', '−1', '3', '9'],
          answer: 0,
          explain: String.raw`$3\cdot2 + t\cdot(-6) = 6 - 6t = 0$에서 $t = 1$. 직교 조건은 방정식 하나로 바뀐다.`,
        },
      ],
    },
    {
      id: 'prop.orth-projection',
      kind: 'prop',
      title: '정사영: 그림자의 길이',
      status: 'written',
      introduces: { terms: [{ id: 't.orth-projection', ko: '정사영', en: 'orthogonal projection', gloss: '한 벡터를 어떤 직선(또는 평면) 위로 수직으로 내려 얻은 벡터. 𝐮 방향 직선 위로는 (𝐮·𝐯 / 𝐮·𝐮)𝐮.' }] },
      requires: ['def.orthogonal'],
      predicts: [
        {
          id: 'p-shadow',
          kind: 'point',
          q: String.raw`$\mathbf{v} = (3, 1)$(노랑)을 대각선 방향 $\mathbf{u} = (1, 1)$의 직선 위로 **수직으로** 내리면 그림자는 어디에 생길까? 분홍 점을 끌어 놓아라.`,
          hints: [
            String.raw`그림자는 직선 위에 있으므로 $t(1, 1)$ 꼴이다. 그리고 $\mathbf{v}$에서 그림자로 가는 화살표 $\mathbf{v} - t\mathbf{u}$는 직선과 [직교](n:def.orthogonal)해야 한다.`,
            String.raw`$(3 - t,\ 1 - t)\cdot(1, 1) = 0$을 풀어라.`,
          ],
          A: [[0.5, 0.5], [0.5, 0.5]],
          x: [3, 1],
          target: 'Ax',
          show: ['x'],
          reveal: String.raw`정답은 $(2, 2)$다: $(3 - t) + (1 - t) = 0$에서 $t = 2$. 아래 공식으로는 $\frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}\mathbf{u} = \frac{4}{2}(1, 1)$이다.`,
        },
        {
          id: 'p-unit',
          kind: 'choice',
          q: String.raw`$\mathbf{u}$가 **단위벡터**라면 정사영의 공식은 어떻게 줄어들까?`,
          hints: [String.raw`공식 $\frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}\mathbf{u}$에서 분모 $\mathbf{u}\cdot\mathbf{u} = \|\mathbf{u}\|^2$은 얼마인가?`],
          choices: [String.raw`$(\mathbf{u}\cdot\mathbf{v})\,\mathbf{u}$`, String.raw`$\mathbf{u}\cdot\mathbf{v}$ (수 하나)`, String.raw`$\mathbf{v}$ 그대로`, String.raw`$\mathbf{u}$ 그대로`],
          answer: 0,
          why: [
            String.raw`분모가 1이 된다. 그래서 **단위벡터 방향의 좌표는 내적 한 번**으로 구한다. 9권의 증명이 이 사실을 쓴다.`,
            String.raw`내적은 그림자의 부호 있는 **길이**(수)다. 정사영은 그 길이만큼 $\mathbf{u}$ 방향으로 간 **벡터**다. 거의 맞는 답이다.`,
            String.raw`$\mathbf{v}$가 이미 그 직선 위에 있을 때만 그렇다.`,
            String.raw`$\mathbf{u}$ 방향이지만 길이가 $\mathbf{v}$에 따라 달라야 한다.`,
          ],
        },
      ],
      body: String.raw`[내적은 그림자의 길이를 잰다](n:prop.dot-geometric). 그렇다면 그림자 **자체**, 곧 직선 위에 생기는 벡터는 무엇일까?

::predict p-shadow

**명제.** 영벡터가 아닌 $\mathbf{u}$ 방향의 직선 위로 $\mathbf{v}$를 수직으로 내린 벡터([정사영](def:t.orth-projection))는

$$\frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}\,\mathbf{u}$$

이다. 그리고 $\mathbf{v}$에서 이 그림자를 뺀 나머지는 $\mathbf{u}$와 [직교](t:t.orthogonal)한다. 그래서 $\mathbf{v}$는 "$\mathbf{u}$ 방향 조각"과 "$\mathbf{u}$에 수직인 조각"의 합으로 하나뿐인 방식으로 나뉜다.

::scene b3-dot-shadow {"mode": "proj"}

::predict p-unit

### 두 개의 예
- $\mathbf{v} = (3, 1)$, $\mathbf{u} = (1, 1)$: $\frac{4}{2}(1, 1) = (2, 2)$. 나머지 $(1, -1)$은 $(1, 1)$과 직교한다.
- $\mathbf{v} = (2, 5)$, $\mathbf{u} = \mathbf{e}_1$: $(\mathbf{e}_1\cdot\mathbf{v})\mathbf{e}_1 = (2, 0)$. 표준 기저 방향의 정사영은 성분 하나만 남긴 것이다. 그래서 성분 $v_1$은 "$\mathbf{e}_1$ 방향의 그림자"다.`,
      proof: String.raw`그림자는 직선 위에 있으므로 어떤 수 $t$에 대해 $t\mathbf{u}$다. 수직으로 내렸다는 것은 나머지 $\mathbf{v} - t\mathbf{u}$가 $\mathbf{u}$와 직교한다는 것이다. [내적의 계산 규칙](why:def.dot)으로

$$(\mathbf{v} - t\mathbf{u})\cdot\mathbf{u} = \mathbf{v}\cdot\mathbf{u} - t\,(\mathbf{u}\cdot\mathbf{u}) = 0$$

이고, $\mathbf{u} \ne \mathbf{0}$이므로 $\mathbf{u}\cdot\mathbf{u} > 0$이다. 그러므로 $t = \frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}$로 하나뿐이다. 이 $t$로 $\mathbf{v} = t\mathbf{u} + (\mathbf{v} - t\mathbf{u})$로 나누면 첫째 조각은 직선 위에, 둘째 조각은 직선과 직교한다.`,
      code: ['project'],
    },
    {
      id: 'prop.row-picture',
      kind: 'prop',
      title: '행의 관점: (Ax)ᵢ = (i행)·x',
      status: 'written',
      requires: ['def.dot', 'def.matvec'],
      predicts: [
        {
          id: 'p-row',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 2 & 1 \\ -1 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 2)$일 때 $A\mathbf{x}$의 **둘째 성분**만 구하려면 무엇이 있으면 되고, 그 값은?`,
          hints: [String.raw`[행렬-벡터 곱의 정의](n:def.matvec) $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2$에서 둘째 성분만 떼어 보라. 각 열의 **둘째 성분**만 쓰인다. 그 둘째 성분들을 모으면 $A$의 무엇이 되는가?`],
          choices: [String.raw`$A$의 둘째 행과 $\mathbf{x}$. 값은 1`, String.raw`$A$의 둘째 열과 $\mathbf{x}$. 값은 3`, String.raw`$A$ 전체. 값은 4`, String.raw`$A$의 둘째 행과 $\mathbf{x}$. 값은 −3`],
          answer: 0,
          why: [
            String.raw`$x_1a_{21} + x_2a_{22} = (-1)(1) + (1)(2) = 1$. 둘째 행 $(-1, 1)$과 $\mathbf{x}$의 내적이다.`,
            String.raw`둘째 **열** $(1, 1)$과 내적했다. 출력의 $i$번째 성분은 $i$번째 **행**에서 나온다. 행과 열의 혼동이다.`,
            String.raw`4는 첫째 성분이다. 둘째 성분은 둘째 행만으로 정해진다.`,
            String.raw`행은 맞지만 부호 계산이 틀렸다: $(-1)\cdot1 + 1\cdot2 = 1$.`,
          ],
        },
        {
          id: 'p-line',
          kind: 'choice',
          q: String.raw`$A$의 첫째 행이 $(1, 2)$이다. $A\mathbf{x}$의 첫째 성분이 0이 되는 입력 $\mathbf{x}$들은 평면에서 어떤 모양을 이룰까?`,
          hints: [String.raw`첫째 성분은 $(1, 2)\cdot\mathbf{x}$다. 내적이 0이라는 것은 무슨 뜻이었는가?`],
          choices: [String.raw`원점을 지나고 $(1, 2)$에 수직인 직선`, String.raw`$(1, 2)$ 방향의 직선`, '원점 한 점', '평면 전체'],
          answer: 0,
          why: [
            String.raw`$(1, 2)\cdot\mathbf{x} = 0$은 $\mathbf{x}$가 $(1, 2)$와 [직교](n:def.orthogonal)한다는 뜻이다. 그런 $\mathbf{x}$는 $(-2, 1)$ 방향의 직선을 이룬다. 6권에서 이 생각이 "[행공간](fwd:t.row-space)과 [영공간](fwd:t.null-space)은 직교한다"가 된다.`,
            String.raw`그 방향의 입력은 오히려 첫째 성분을 크게 만든다: $(1, 2)\cdot(1, 2) = 5$.`,
            String.raw`$(-2, 1)$도 첫째 성분이 0이다. 원점만이 아니다.`,
            String.raw`$(1, 0)$을 넣으면 첫째 성분이 1이다.`,
          ],
        },
      ],
      openWhys: [],
      body: String.raw`2권에서 [행렬-벡터 곱](t:t.matvec)을 "열들의 선형 결합"으로 정의했다. 그런데 학교에서는 "행 × 열"로 곱셈을 배웠을 것이다. 두 계산법은 어떻게 같은 답을 내는가?

::predict p-row

**명제.** $A\mathbf{x}$의 $i$번째 성분은 $A$의 $i$번째 행과 $\mathbf{x}$의 [내적](t:t.dot)이다.

$$(A\mathbf{x})_i = (A\text{의 } i\text{번째 행})\cdot\mathbf{x}$$

같은 출력을 두 눈으로 읽을 수 있다.
- **열의 관점**: 출력 = 열들을 $\mathbf{x}$의 성분만큼 섞은 것. 출력 공간에서 화살표를 이어 붙인다.
- **행의 관점**: 출력의 성분 하나하나 = 입력이 각 행과 얼마나 같은 쪽을 보는가(내적). 입력 공간에서 잰다.

::scene b3-row-col {}

그림 왼쪽은 열의 관점, 오른쪽은 행의 관점이다. 오른쪽의 두 점선은 "그 행과의 내적이 지금 값과 같은 점들"이 이루는 직선이고, 각 행에 수직이다. 두 직선이 만나는 점이 $\mathbf{x}$다.

::predict p-line

### 두 개의 예
- $A = \begin{bmatrix} 2 & 1 \\ -1 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 2)$: 행의 관점으로 $(2, 1)\cdot(1, 2) = 4$, $(-1, 1)\cdot(1, 2) = 1$이므로 $A\mathbf{x} = (4, 1)$. 열의 관점으로 $1\cdot(2, -1) + 2\cdot(1, 1) = (4, 1)$. 같다.
- 3×2 행렬 $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}$과 $\mathbf{x} = (3, 4)$: 세 행과 내적하면 $(3, 4, 7)$. 행이 세 개이므로 출력의 성분도 셋이다.

> [!코드] 두 구현, 한 답
> \`matVec\`은 열의 관점으로, \`matVecRows\`는 행의 관점으로 계산한다. 테스트는 무작위 행렬 100개에서 두 함수의 답이 소수점 아래 12자리까지 같은지 확인한다. 2권의 미뤄 둔 질문, "학교에서 배운 행 × 열 계산은 정의와 어떻게 같은가?"의 답이 이 노드다.`,
      proof: String.raw`[행렬-벡터 곱의 정의](why:def.matvec)에 따라 $A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + \cdots + x_n\mathbf{a}_n$이다. 이 벡터의 $i$번째 성분만 보면, 각 열 $\mathbf{a}_j$의 $i$번째 성분 $a_{ij}$에 $x_j$를 곱해 더한 것이다([벡터 덧셈과 스칼라 곱은 성분마다 한다](why:prop.add-componentwise)).

$$(A\mathbf{x})_i = x_1a_{i1} + x_2a_{i2} + \cdots + x_na_{in}$$

그런데 $(a_{i1}, a_{i2}, \dots, a_{in})$은 $A$의 $i$번째 행이다. 그러므로 오른쪽은 [내적의 정의](why:def.dot) 그대로 ($i$번째 행)$\cdot\mathbf{x}$다.`,
      code: ['matVecRows', 'matVec'],
    },
    {
      id: 'def.transpose',
      kind: 'def',
      title: '전치',
      status: 'written',
      introduces: {
        terms: [{ id: 't.transpose', ko: '전치', en: 'transpose', gloss: '행렬의 행과 열을 맞바꾼 행렬. m×n이 n×m이 된다.' }],
        symbols: [{ tex: String.raw`A^{\mathsf{T}}`, meaning: '행렬 A의 전치' }],
      },
      requires: ['prop.row-picture'],
      predicts: [
        {
          id: 'p-rot',
          kind: 'choice',
          q: String.raw`회전 행렬 $R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$의 전치는 어떤 변환일까?`,
          hints: [
            String.raw`행과 열을 맞바꾸면 $\begin{bmatrix} \cos\theta & \sin\theta \\ -\sin\theta & \cos\theta \end{bmatrix}$이다. 첫째 열 $(\cos\theta, -\sin\theta)$는 단위원 위 몇 도 자리의 점인가?`,
            String.raw`단위원 위 $-\theta$ 자리의 점은 $\theta$ 자리의 점을 가로축에 비친 것이므로 $(\cos\theta, -\sin\theta)$다.`,
          ],
          choices: [String.raw`반대로 $\theta$만큼 돌리는 회전 $R_{-\theta}$`, '같은 회전 그대로', '가로축에 비치는 반사', String.raw`$\theta + 90°$ 회전`],
          answer: 0,
          why: [
            String.raw`첫째 열이 $-\theta$ 자리의 점, 둘째 열 $(\sin\theta, \cos\theta)$는 그것을 90° 돌린 점이다. 곧 $R_{-\theta}$다. 회전의 전치는 회전을 되돌린다. 5권에서 이것이 "[직교 행렬](fwd:t.orth-matrix)의 [역행렬](fwd:t.inverse)은 전치"가 된다.`,
            String.raw`$\theta = 0°$, $180°$일 때만 같다. 일반적으로는 대각선 밖의 부호가 바뀐다.`,
            String.raw`첫째 열만 보면 그렇게 보이지만, 둘째 열 $(\sin\theta, \cos\theta)$까지 보면 회전이다.`,
            String.raw`$\theta + 90°$ 회전의 첫째 열은 $(-\sin\theta, \cos\theta)$다.`,
          ],
        },
      ],
      body: String.raw`[행의 관점](n:prop.row-picture)에서는 행렬의 **행**이 주인공이었다. 행을 열로 바꿔 세우면 어떻게 될까?

**정의.** 행렬 $A$의 행과 열을 맞바꾼 행렬을 $A$의 [전치](def:t.transpose)라 하고 $A^{\mathsf{T}}$로 쓴다. 성분으로는 $(A^{\mathsf{T}})_{ij} = a_{ji}$이고, $A$가 $m \times n$이면 $A^{\mathsf{T}}$는 $n \times m$이다.

$$A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \ \Rightarrow\ A^{\mathsf{T}} = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}, \qquad \begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}^{\mathsf{T}} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 2 & -1 \end{bmatrix}$$

$A$의 $i$번째 행이 $A^{\mathsf{T}}$의 $i$번째 열이 된다. 그래서 [모양](t:t.shape)도 뒤집힌다. 2×3 행렬(성분 3개 → 2개)의 전치는 3×2 행렬(성분 2개 → 3개)이다. 두 번 전치하면 원래대로 돌아온다: $(A^{\mathsf{T}})^{\mathsf{T}} = A$.

::scene b3-transpose-grids {}

그림 왼쪽은 $A$가 만드는 격자, 오른쪽은 $A^{\mathsf{T}}$가 만드는 격자다. 왼쪽의 점선 화살표(A의 행)가 오른쪽의 실선 화살표($A^{\mathsf{T}}$의 열)와 똑같다는 것을 확인하라.

::predict p-rot

### 전치는 기하적으로 무엇인가
숫자 배치로는 "행과 열을 바꾼 것"이지만, 기하적인 뜻은 이 정의만으로는 잘 보이지 않는다. 전단 $A$와 그 전치는 서로 다른 방향으로 미는 전단이고, 회전의 전치는 되돌리는 회전이다. 이 둘을 하나로 묶는 성질이 다음 노드의 명제다.`,
      checks: [
        {
          q: String.raw`$A$가 4×3이면 $A^{\mathsf{T}}A$와 $AA^{\mathsf{T}}$의 모양은?`,
          choices: ['3×3과 4×4', '4×4와 3×3', '둘 다 4×3', '곱할 수 없다'],
          answer: 0,
          explain: String.raw`$A^{\mathsf{T}}$는 3×4다. $(3\times4)(4\times3) = 3\times3$, $(4\times3)(3\times4) = 4\times4$. [안쪽 차원이 맞는다](n:prop.shape-rule). 9권에서 $A^{\mathsf{T}}A$가 주인공이 된다.`,
        },
      ],
      code: ['transpose'],
    },
    {
      id: 'prop.transpose-dot',
      kind: 'prop',
      title: '전치의 정체: (Ax)·y = x·(Aᵀy)',
      status: 'written',
      requires: ['def.transpose'],
      predicts: [
        {
          id: 'p-same',
          kind: 'choice',
          q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $\mathbf{x} = (1, 1)$, $\mathbf{y} = (2, -1)$이다. $(A\mathbf{x})\cdot\mathbf{y} = 5$다. 그렇다면 $\mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$는?`,
          hints: [String.raw`직접 계산해 보라. $A^{\mathsf{T}} = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$이므로 $A^{\mathsf{T}}\mathbf{y} = (2,\ 4 - 1)$이다. 그다음 $\mathbf{x}$와 내적.`],
          choices: ['5', '3', '−5', '계산해 보기 전에는 아무 관계도 없다'],
          answer: 0,
          why: [
            String.raw`$A^{\mathsf{T}}\mathbf{y} = (2, 3)$, $(1, 1)\cdot(2, 3) = 5$. 우연이 아니다. 아래 명제가 언제나 같다고 말한다.`,
            String.raw`$A^{\mathsf{T}}\mathbf{y}$의 성분 하나만 더했다.`,
            String.raw`부호가 바뀔 이유가 없다. 전치는 뒤집기가 아니다.`,
            String.raw`언제나 같다. 이것이 전치의 정체다.`,
          ],
        },
        {
          id: 'p-order',
          kind: 'choice',
          q: String.raw`$(AB)^{\mathsf{T}}$는 무엇과 같을까?`,
          hints: [
            String.raw`$((AB)\mathbf{x})\cdot\mathbf{y} = (A(B\mathbf{x}))\cdot\mathbf{y}$에 이 노드의 식을 써서, $A$를 $\mathbf{y}$ 쪽으로 넘겨 보라.`,
            String.raw`$(B\mathbf{x})\cdot(A^{\mathsf{T}}\mathbf{y})$가 된다. 한 번 더, 이번에는 $B$를 넘겨라.`,
          ],
          choices: [String.raw`$B^{\mathsf{T}}A^{\mathsf{T}}$`, String.raw`$A^{\mathsf{T}}B^{\mathsf{T}}$`, String.raw`$AB$`, String.raw`$BA$`],
          answer: 0,
          why: [
            String.raw`$\mathbf{x}\cdot(B^{\mathsf{T}}(A^{\mathsf{T}}\mathbf{y}))$가 되므로 $\mathbf{y}$에 $A^{\mathsf{T}}$를 먼저, $B^{\mathsf{T}}$를 나중에 한다. 곧 $B^{\mathsf{T}}A^{\mathsf{T}}$다. 넘기는 순서대로 쌓이므로 순서가 뒤집힌다.`,
            String.raw`순서를 그대로 둔 것이다. 2×2에서 아무 예로 계산해 보면 대개 다르다. 거의 맞는 답이다.`,
            String.raw`전치를 빠뜨렸다.`,
            String.raw`순서는 뒤집혔지만 각각을 전치하지 않았다.`,
          ],
        },
      ],
      body: String.raw`[전치](t:t.transpose)는 숫자 배치로 정의했다. 그 기하적인 뜻은 무엇일까? [내적](t:t.dot)이 그 답을 준다.

::predict p-same

**명제.** 모든 $\mathbf{x}$, $\mathbf{y}$에 대해

$$(A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$$

이다. 그리고 $(AB)^{\mathsf{T}} = B^{\mathsf{T}}A^{\mathsf{T}}$이다.

### 읽는 법: 재는 자리를 옮긴다
왼쪽은 "$\mathbf{x}$를 $A$로 출력 공간에 보낸 뒤, 거기서 $\mathbf{y}$와 잰다"이다. 오른쪽은 "$\mathbf{y}$를 $A^{\mathsf{T}}$로 **입력 공간에** 보낸 뒤, 거기서 $\mathbf{x}$와 잰다"이다. 두 값이 언제나 같다. $A$가 입력을 출력 쪽으로 보낸다면, $A^{\mathsf{T}}$는 출력 쪽의 "재는 방향"을 입력 쪽으로 가져온다. $A$가 $m \times n$이면 $A^{\mathsf{T}}$는 $n \times m$이라 방향이 정확히 반대인 것도 이 때문이다.

::scene b3-transpose {}

::predict p-order

### 두 개의 예
- 위 관문: $A\mathbf{x} = (3, 1)$이고 $(3, 1)\cdot(2, -1) = 5$. $A^{\mathsf{T}}\mathbf{y} = (2, 3)$이고 $(1, 1)\cdot(2, 3) = 5$.
- $A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$(90° 회전): $(A\mathbf{x})\cdot\mathbf{y}$는 "$\mathbf{x}$를 90° 돌린 것과 $\mathbf{y}$의 내적"이다. $A^{\mathsf{T}}$는 −90° 회전이므로 오른쪽은 "$\mathbf{y}$를 거꾸로 90° 돌린 것과 $\mathbf{x}$의 내적"이다. 두 벡터 사이의 각은 둘 중 어느 쪽을 돌려도 같은 만큼 바뀐다.`,
      proof: String.raw`**내적 등식.** [행의 관점](why:prop.row-picture)으로 $(A\mathbf{x})_i = \sum_j a_{ij}x_j$이므로

$$(A\mathbf{x})\cdot\mathbf{y} = \sum_i\Big(\sum_j a_{ij}x_j\Big)y_i = \sum_j x_j\Big(\sum_i a_{ij}y_i\Big)$$

이다. 가운데에서 오른쪽으로는 [분배·교환·결합법칙](why:ax.arith)으로 같은 항들을 다른 순서로 묶었을 뿐이다($\sum$는 "모두 더한다"를 줄여 쓴 것이다). 그런데 $\sum_i a_{ij}y_i = \sum_i (A^{\mathsf{T}})_{ji}y_i = (A^{\mathsf{T}}\mathbf{y})_j$이다. 그러므로 오른쪽은 $\mathbf{x}\cdot(A^{\mathsf{T}}\mathbf{y})$다.

**곱의 전치.** 아무 $\mathbf{x}$, $\mathbf{y}$에서, 내적 등식을 두 번 쓰면

$$\mathbf{x}\cdot\big((AB)^{\mathsf{T}}\mathbf{y}\big) = ((AB)\mathbf{x})\cdot\mathbf{y} = (A(B\mathbf{x}))\cdot\mathbf{y} = (B\mathbf{x})\cdot(A^{\mathsf{T}}\mathbf{y}) = \mathbf{x}\cdot\big(B^{\mathsf{T}}A^{\mathsf{T}}\mathbf{y}\big)$$

이다. 이 등식에 $\mathbf{x} = \mathbf{e}_j$를 넣으면 양쪽 벡터의 $j$번째 성분이 같다($\mathbf{e}_j\cdot\mathbf{w} = w_j$이므로). 모든 $j$와 모든 $\mathbf{y}$에서 그러므로 $(AB)^{\mathsf{T}}\mathbf{y} = B^{\mathsf{T}}A^{\mathsf{T}}\mathbf{y}$이고, 두 행렬은 같다.`,
    },
    {
      id: 'def.orthogonal-matrix',
      kind: 'def',
      title: '직교 행렬',
      status: 'written',
      introduces: {
        terms: [{ id: 't.orth-matrix', ko: '직교 행렬', en: 'orthogonal matrix', gloss: '열들이 정규직교인 정사각 행렬. QᵀQ = I. 평면에서는 회전과 반사.' }],
        symbols: [{ tex: 'Q', meaning: '직교 행렬' }],
      },
      requires: ['def.orthogonal', 'def.transpose'],
      predicts: [
        {
          id: 'p-check',
          kind: 'choice',
          q: String.raw`열이 $(0.6, 0.8)$과 $(-0.8, 0.6)$인 행렬은 직교 행렬일까?`,
          hints: [String.raw`두 가지를 확인하면 된다. 각 열의 길이가 1인가? 두 열의 내적이 0인가?`],
          choices: ['그렇다. 두 열의 길이가 1이고 서로 직교한다', '아니다. 성분이 0과 1이 아니므로', '아니다. 두 열의 성분 합이 다르므로', '열의 길이만 1이면 된다'],
          answer: 0,
          why: [
            String.raw`$0.36 + 0.64 = 1$, $0.64 + 0.36 = 1$, 내적 $-0.48 + 0.48 = 0$. 단위원 위 약 53° 자리의 점을 첫째 열로 하는 회전이다.`,
            String.raw`성분은 아무 실수여도 된다. 조건은 길이와 직교뿐이다.`,
            String.raw`성분의 합은 조건과 관계없다.`,
            String.raw`길이가 1인 두 열이 직교하지 않으면 그 사이의 각이 바뀐다. 직교도 필요하다.`,
          ],
        },
      ],
      body: String.raw`길이와 각도를 그대로 두는 변환, 곧 도형을 옮기기만 하고 찌그러뜨리지 않는 변환은 어떤 행렬일까?

**정의.** 열들이 [정규직교](t:t.orthonormal)인 정사각 행렬을 [직교 행렬](def:t.orth-matrix)이라 하고 $Q$로 쓴다.

[행렬의 열은 기저의 도착지](why:def.matrix)이므로, 직교 행렬은 "서로 수직인 길이 1짜리 자 $\mathbf{e}_1, \mathbf{e}_2$를 다시 서로 수직인 길이 1짜리 자로 보내는" 변환이다.

::predict p-check

### 열의 조건 = 한 줄의 식 $Q^{\mathsf{T}}Q = I$
$Q^{\mathsf{T}}Q$의 $i$행 $j$열 성분은 $Q^{\mathsf{T}}$의 $i$번째 행($= Q$의 $i$번째 열 $\mathbf{q}_i$)과 $Q$의 $j$번째 열의 내적, 곧 $\mathbf{q}_i\cdot\mathbf{q}_j$다([행의 관점](why:prop.row-picture)). 열이 정규직교라는 것은 $i = j$이면 1, $i \ne j$이면 0이라는 것이다. 그것이 바로 [항등 행렬](t:t.identity)이다.

$$\text{열이 정규직교} \iff Q^{\mathsf{T}}Q = I$$

::scene b3-orthogonal {}

그림의 각과 "반사" 상자로 직교 행렬을 만들어 보라. 노란 F가 모양 그대로 옮겨진다. 행렬 칸을 직접 바꾸면 직교가 깨지고, 그 순간 F가 찌그러진다.

### 두 개의 예
- 회전 $R_\theta$: 첫째 열 $(\cos\theta, \sin\theta)$와 둘째 열 $(-\sin\theta, \cos\theta)$는 길이가 1이고 내적이 $-\cos\theta\sin\theta + \sin\theta\cos\theta = 0$이다.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: 열 $(0, 1)$, $(1, 0)$은 표준 기저의 순서를 바꾼 것이다.`,
      checks: [
        {
          q: String.raw`$\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$(전단)은 직교 행렬인가?`,
          choices: ['아니다. 둘째 열의 길이가 √2이고 첫째 열과 직교하지 않는다', '그렇다. 넓이를 바꾸지 않으므로', '그렇다. 대각선이 모두 1이므로', '아니다. 첫째 열의 길이가 1이 아니므로'],
          answer: 0,
          explain: String.raw`둘째 열 $(1, 1)$은 길이 $\sqrt{2}$이고, 첫째 열 $(1, 0)$과의 내적은 1이다. 전단은 넓이는 지키지만 길이와 각도는 바꾼다. 넓이를 지키는 것과 모양을 지키는 것은 다르다.`,
        },
      ],
    },
    {
      id: 'prop.orthogonal-preserves',
      kind: 'prop',
      title: '직교 행렬은 길이와 각도를 지킨다',
      status: 'written',
      requires: ['def.orthogonal-matrix', 'prop.transpose-dot'],
      predicts: [
        {
          id: 'p-angle',
          kind: 'choice',
          q: '모든 벡터의 길이를 지키는 선형 변환은, 두 벡터 사이의 각도도 반드시 지킬까?',
          hints: [
            String.raw`[내적 노드](n:def.dot)의 식 $\|\mathbf{u} + \mathbf{w}\|^2 = \|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{w} + \|\mathbf{w}\|^2$을 $\mathbf{u}\cdot\mathbf{w}$에 대해 풀어 보라. 내적이 길이들만으로 적힌다.`,
            String.raw`변환이 $\mathbf{u}$, $\mathbf{w}$, $\mathbf{u} + \mathbf{w}$의 길이를 모두 지킨다면, 그 식의 오른쪽도 그대로다.`,
          ],
          choices: ['그렇다. 내적을 길이만으로 쓸 수 있으므로', '아니다. 길이는 그대로이고 각만 바꾸는 변환이 있다', '길이와 각도는 서로 관계가 없다', '회전일 때만 그렇다'],
          answer: 0,
          why: [
            String.raw`$\mathbf{u}\cdot\mathbf{w} = \tfrac{1}{2}(\|\mathbf{u} + \mathbf{w}\|^2 - \|\mathbf{u}\|^2 - \|\mathbf{w}\|^2)$. 길이가 모두 그대로이면 내적도 그대로이고, 그래서 각도도 그대로다. 그리고 선형이므로 $T(\mathbf{u} + \mathbf{w}) = T(\mathbf{u}) + T(\mathbf{w})$의 길이도 지켜진다.`,
            String.raw`그런 선형 변환을 찾으려 하면 실패한다. 각을 바꾸려면 어떤 대각선의 길이를 바꿔야 하기 때문이다.`,
            String.raw`[코사인 법칙](n:prop.law-of-cosines)이 세 변의 길이로 각을 정한다. 길이가 각을 정한다.`,
            String.raw`반사도 길이와 각도를 지킨다.`,
          ],
        },
        {
          id: 'p-all',
          kind: 'choice',
          q: '평면에서 길이를 지키는 선형 변환을 모두 고르면?',
          hints: [
            String.raw`첫째 열(e₁의 도착지)은 길이가 1이므로 단위원 위의 점 $(\cos\theta, \sin\theta)$다.`,
            String.raw`둘째 열은 길이가 1이고 첫째 열과 직교해야 한다. [그런 벡터는 두 개뿐이다](n:def.orthogonal): $(-\sin\theta, \cos\theta)$와 $(\sin\theta, -\cos\theta)$.`,
          ],
          choices: ['회전과 반사뿐', '회전뿐', '회전, 반사, 전단', '회전, 반사, 그리고 크기가 1인 늘이기'],
          answer: 0,
          why: [
            String.raw`둘째 열이 $(-\sin\theta, \cos\theta)$이면 회전 $R_\theta$, $(\sin\theta, -\cos\theta)$이면 반사다. 다른 가능성은 없다.`,
            String.raw`반사도 길이를 지킨다. 왼손이 오른손이 될 뿐이다.`,
            String.raw`전단은 대각선의 길이를 바꾼다: $(0, 1) \to (1, 1)$.`,
            String.raw`"크기가 1인 늘이기"는 아무것도 하지 않는 것, 곧 0° 회전이다. 이미 회전에 들어 있다.`,
          ],
        },
      ],
      body: String.raw`[직교 행렬](t:t.orth-matrix)은 기저의 자들을 모양 그대로 옮긴다. 그렇다면 **모든** 벡터의 길이와 각도도 그대로일까?

**명제.** 직교 행렬 $Q$는 내적을 지킨다: $(Q\mathbf{x})\cdot(Q\mathbf{y}) = \mathbf{x}\cdot\mathbf{y}$. 그러므로 길이도($\|Q\mathbf{x}\| = \|\mathbf{x}\|$), 각도도 지킨다.

::scene b3-orthogonal {"reflect": true}

::predict p-angle

### 거꾸로: 길이를 지키는 선형 변환은 직교 행렬이다
관문에서 본 것처럼, 길이를 지키는 선형 변환은 내적도 지킨다. 그러면 $\mathbf{e}_1$, $\mathbf{e}_2$의 도착지(열)도 서로 직교하고 길이가 1이다. 곧 직교 행렬이다. 그러므로 **"길이를 지키는 선형 변환"과 "직교 행렬"은 같은 것**이다.

::predict p-all

그러므로 평면의 직교 행렬은 회전 $R_\theta$와 반사 $\begin{bmatrix} \cos\theta & \sin\theta \\ \sin\theta & -\cos\theta \end{bmatrix}$ 두 종류뿐이다. 9권의 [특이값 분해](fwd:t.svd) $U\Sigma V^{\mathsf{T}}$에서 $U$와 $V$가 바로 이것들이다.`,
      proof: String.raw`[전치의 정체](why:prop.transpose-dot)를 $A = Q$, $\mathbf{y}$ 자리에 $Q\mathbf{y}$를 넣어 쓰면

$$(Q\mathbf{x})\cdot(Q\mathbf{y}) = \mathbf{x}\cdot(Q^{\mathsf{T}}Q\mathbf{y}) = \mathbf{x}\cdot(I\mathbf{y}) = \mathbf{x}\cdot\mathbf{y}$$

이다. 가운데 등호는 [직교 행렬의 조건](why:def.orthogonal-matrix) $Q^{\mathsf{T}}Q = I$다. $\mathbf{y} = \mathbf{x}$로 두면 $\|Q\mathbf{x}\|^2 = \|\mathbf{x}\|^2$, 곧 길이가 같다. 각도는 [내적과 두 길이로 정해지므로](why:prop.dot-geometric) $\cos\theta = \frac{\mathbf{x}\cdot\mathbf{y}}{\|\mathbf{x}\|\|\mathbf{y}\|}$가 그대로이고, 각도도 같다.`,
    },
  ],
};
export default book;
