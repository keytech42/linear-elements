import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c3-norm {}

::predict p-3d

### 3차원: 피타고라스 정리를 두 번
3차원의 $\mathbf{v} = (v_1, v_2, v_3)$를 바닥 이동 $(v_1, v_2, 0)$과 높이 이동 $(0, 0, v_3)$로 나눈다. 바닥 이동의 길이 $d$는 바닥 평면에서의 피타고라스 정리로 $d^2 = v_1^2 + v_2^2$이다. 높이 이동은 바닥 평면 전체에 수직이므로 바닥 대각선과도 수직이다. 그래서 $d$와 $v_3$을 두 직각변으로 하는 직각삼각형이 생기고, 그 빗변이 $\mathbf{v}$다: $\|\mathbf{v}\|^2 = d^2 + v_3^2 = v_1^2 + v_2^2 + v_3^2$. 성분이 $n$개여도 같은 걸음을 되풀이하면 $\|\mathbf{v}\|^2 = v_1^2 + \cdots + v_n^2$이다.

::scene c3-norm3d {}

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
};

export default node;
