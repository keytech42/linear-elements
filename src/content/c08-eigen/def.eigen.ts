import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.eigen',
  kind: 'def',
  title: '고유벡터와 고윳값',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.eigenvector', ko: '고유벡터', en: 'eigenvector', surfaces: ['고유 벡터'], gloss: '변환 뒤에도 자기가 놓인 직선(스팬) 위에 그대로 있는, 영벡터가 아닌 벡터. A𝐯 = λ𝐯.' },
      { id: 't.eigenvalue', ko: '고윳값', en: 'eigenvalue', surfaces: ['고유값'], gloss: '고유벡터가 늘어나는 배율. 음수면 뒤집히며 늘어나고, 0이면 원점으로 사라진다.' },
    ],
    symbols: [{ tex: String.raw`\lambda`, meaning: '고윳값' }],
  },
  requires: ['exp.eigen-hunt', 'def.scalar-mul'],
  predicts: [
    {
      id: 'p-zero',
      kind: 'choice',
      q: String.raw`정의에서 "영벡터가 아닌"이라는 조건을 빼면 무슨 문제가 생길까?`,
      choices: ['모든 수가 고윳값이 되어 버린다', '아무 문제도 없다', '영벡터는 그림으로 그릴 수 없을 뿐이다', '고윳값 0이 생기지 않게 된다'],
      answer: 0,
      why: [
        String.raw`$A\mathbf{0} = \mathbf{0} = \lambda\mathbf{0}$이 $\lambda$가 무엇이든 성립하기 때문이다.`,
        String.raw`$A\mathbf{0} = \lambda\mathbf{0}$은 $\lambda$가 무엇이든 성립한다. 그러면 "고윳값"이라는 이름이 아무 수도 가려내지 못한다.`,
        String.raw`그림의 문제가 아니라 정의가 정보를 잃는 문제다. 영벡터를 넣으면 모든 수가 고윳값이 된다.`,
        String.raw`거꾸로다. 고윳값 0은 영벡터가 **아닌** $\mathbf{v}$가 $A\mathbf{v} = \mathbf{0}$일 때 생기는 정상적인 경우다. 영벡터를 허용하면 0을 포함해 모든 수가 고윳값이 된다.`,
      ],
    },
    {
      id: 'p-sum',
      kind: 'choice',
      q: String.raw`$A\mathbf{v} = 2\mathbf{v}$이고 $A\mathbf{w} = -\mathbf{w}$이다($\mathbf{v}$, $\mathbf{w}$는 서로 다른 직선 위에 있다). 두 고유벡터의 합 $\mathbf{v} + \mathbf{w}$도 $A$의 고유벡터일까?`,
      hints: [
        String.raw`[선형 변환은 덧셈을 그대로 통과시킨다](n:def.linear-map): $A(\mathbf{v} + \mathbf{w}) = A\mathbf{v} + A\mathbf{w}$.`,
        String.raw`$A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$이다. 이것이 어떤 수 $c$에 대해 $c(\mathbf{v} + \mathbf{w})$와 같을 수 있는가? $\mathbf{v}$와 $\mathbf{w}$의 계수를 따로 비교해 보라.`,
      ],
      choices: ['아니다. 고윳값이 다르면 합은 직선을 벗어난다', '그렇다. 고유벡터끼리 더하면 고유벡터다', '그렇다. 고윳값은 2 + (−1) = 1이다', '그렇다. 고윳값은 두 고윳값의 평균인 0.5다'],
      answer: 0,
      why: [
        String.raw`$A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$가 $c\mathbf{v} + c\mathbf{w}$와 같으려면 $c = 2$이면서 $c = -1$이어야 한다(서로 다른 직선 위의 두 벡터는 [계수가 하나로 정해지므로](n:prop.coords-unique)). 불가능하다.`,
        String.raw`**같은** 고윳값의 고유벡터끼리라면 맞는 말이다. 고윳값이 다르면 두 방향이 서로 다른 배율로 늘어나서, 합의 방향이 돌아간다.`,
        String.raw`고윳값은 더해지지 않는다. $A(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} - \mathbf{w}$이지 $1\cdot(\mathbf{v} + \mathbf{w})$가 아니다. 거의 맞는 추론에서 "더하기"를 고윳값에까지 적용한 것이다.`,
        String.raw`$0.5(\mathbf{v} + \mathbf{w})$와 $2\mathbf{v} - \mathbf{w}$는 계수가 다르다.`,
      ],
    },
  ],
  body: String.raw`[앞 탐구](n:exp.eigen-hunt)에서 찾은 벡터와 배율에 이름을 붙인다.

**정의.** 정사각 행렬 $A$에 대해, 영벡터가 아닌 벡터 $\mathbf{v}$와 수 $\lambda$가

$$\cy{A\mathbf{v}} = \lambda\,\cx{\mathbf{v}}, \qquad \mathbf{v} \ne \mathbf{0}$$

를 만족하면, $\mathbf{v}$를 $A$의 [고유벡터](def:t.eigenvector)라 하고 $\lambda$를 그 고유벡터의 [고윳값](def:t.eigenvalue)이라 한다.

식을 읽는 법은 이렇다. 왼쪽은 "$\mathbf{v}$에 $A$를 한 결과"이고, 오른쪽은 "같은 $\mathbf{v}$를 그냥 $\lambda$배 한 결과"다. 둘이 같다는 것은 이 변환이 $\mathbf{v}$에게는 [스칼라 곱](t:t.scalar-mul)만 했다는 뜻이다. 그림으로는 출력 $A\mathbf{v}$가 $\mathbf{v}$의 [스팬](t:t.span) 직선 위에 놓인다.

::predict p-zero

### 왜 영벡터는 빼는가
영벡터를 허용하면 $A\mathbf{0} = \mathbf{0} = \lambda\mathbf{0}$이 어떤 $\lambda$로도 성립하므로, 모든 수가 고윳값이 된다. 이름이 아무것도 가려내지 못하게 된다. 그래서 정의에서 영벡터를 뺀다.

반면 **고윳값 0은 허용한다.** $A\mathbf{v} = 0\mathbf{v} = \mathbf{0}$이고 $\mathbf{v} \ne \mathbf{0}$이라는 것은, $\mathbf{v}$가 원점으로 사라지는 방향, 곧 [영공간](t:t.null-space)의 방향이라는 뜻이다.

### 고윳값의 부호와 크기가 말하는 것
- $\lambda > 1$: 그 직선 위에서 늘어난다. $0 < \lambda < 1$: 줄어든다. $\lambda = 1$: 제자리에 있다.
- $\lambda = 0$: 원점으로 사라진다.
- $\lambda < 0$: 뒤집히면서 $|\lambda|$배가 된다.

예: $A = \begin{bmatrix} 2 & 3 \\ 0 & -1 \end{bmatrix}$에서 $A(1, 0) = (2, 0) = 2\cdot(1, 0)$이므로 가로축이 고윳값 2의 방향이다. 또 $A(1, -1) = (2 - 3,\ 0 + 1) = (-1, 1) = -1\cdot(1, -1)$이므로 $(1, -1)$ 방향은 고윳값 $-1$, 곧 같은 직선 위에서 뒤집힌다. 아래 그림에서 탐침을 그 방향에 놓으면 그래프가 180°를 지난다.

::scene c8-eigen-hunt {"A": [[2, 3], [0, -1]], "showEigen": true}

::predict p-sum

### 고유벡터는 직선으로 생각한다
$A\mathbf{v} = \lambda\mathbf{v}$이면 $A(c\mathbf{v}) = cA\mathbf{v} = c\lambda\mathbf{v} = \lambda(c\mathbf{v})$다. 그래서 고유벡터를 몇 배 해도(0배만 빼고) 같은 고윳값의 고유벡터다. "고유벡터 하나"라고 말할 때 실제로 가리키는 것은 그 직선이다. 계산할 때는 그 직선에서 길이가 1인 대표 하나를 고른다. 이 저장소의 \`eig2\`도 길이 1인 벡터를 돌려준다.

같은 고윳값의 고유벡터끼리는 더해도 고유벡터다: $A(\mathbf{v} + \mathbf{w}) = \lambda\mathbf{v} + \lambda\mathbf{w} = \lambda(\mathbf{v} + \mathbf{w})$. 그러나 **고윳값이 다르면 합은 고유벡터가 아니다.** 위 예 $A = \begin{bmatrix} 2 & 3 \\ 0 & -1 \end{bmatrix}$에서 $(1, 0) + (1, -1) = (2, -1)$을 넣으면 $A(2, -1) = (1, 1)$로, $(2, -1)$의 직선을 벗어난다. 고유벡터는 "방향마다 따로" 성립하는 성질이다.`,
  checks: [
    {
      q: String.raw`$A = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$의 고윳값과 그 고유 방향은?`,
      choices: ['고윳값 0(가로축)과 1(세로축)', '고윳값 1(세로축)만', '고윳값 0만', '고유벡터가 없다'],
      answer: 0,
      explain: String.raw`$A\mathbf{e}_1 = \mathbf{0} = 0\cdot\mathbf{e}_1$이므로 가로축은 고윳값 0의 방향(영공간)이다. $A\mathbf{e}_2 = \mathbf{e}_2$이므로 세로축은 고윳값 1의 방향이다. 고윳값 0을 빠뜨리는 것이 흔한 실수다. 0이 될 수 없는 것은 고유**벡터**이지 고윳값이 아니다.`,
    },
  ],
  code: ['eig2'],
};

export default node;
