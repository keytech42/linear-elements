import type { NodeDef } from '../schema';

const node: NodeDef = {
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
        String.raw`분모가 1이 된다. 그래서 **단위벡터 방향의 좌표는 내적 한 번**으로 구한다. 9장의 증명이 이 사실을 쓴다.`,
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

::scene c3-dot-shadow {"mode": "proj"}

::predict p-unit

### 두 개의 예
- $\mathbf{v} = (3, 1)$, $\mathbf{u} = (1, 1)$: $\frac{4}{2}(1, 1) = (2, 2)$. 나머지 $(1, -1)$은 $(1, 1)$과 직교한다.
- $\mathbf{v} = (2, 5)$, $\mathbf{u} = \mathbf{e}_1$: $(\mathbf{e}_1\cdot\mathbf{v})\mathbf{e}_1 = (2, 0)$. 표준 기저 방향의 정사영은 성분 하나만 남긴 것이다. 그래서 성분 $v_1$은 "$\mathbf{e}_1$ 방향의 그림자"다.`,
  proof: String.raw`그림자는 직선 위에 있으므로 어떤 수 $t$에 대해 $t\mathbf{u}$다. 수직으로 내렸다는 것은 나머지 $\mathbf{v} - t\mathbf{u}$가 $\mathbf{u}$와 직교한다는 것이다. [내적의 계산 규칙](why:def.dot)으로

$$(\mathbf{v} - t\mathbf{u})\cdot\mathbf{u} = \mathbf{v}\cdot\mathbf{u} - t\,(\mathbf{u}\cdot\mathbf{u}) = 0$$

이고, $\mathbf{u} \ne \mathbf{0}$이므로 $\mathbf{u}\cdot\mathbf{u} > 0$이다. 그러므로 $t = \frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}$로 하나뿐이다. 이 $t$로 $\mathbf{v} = t\mathbf{u} + (\mathbf{v} - t\mathbf{u})$로 나누면 첫째 조각은 직선 위에, 둘째 조각은 직선과 직교한다.`,
  code: ['project'],
};

export default node;
