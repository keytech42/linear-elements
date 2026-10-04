import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.spectral',
  kind: 'prop',
  title: '스펙트럼 정리: S = QΛQᵀ',
  status: 'written',
  introduces: {
    terms: [{ id: 't.spectral', ko: '스펙트럼 정리', en: 'spectral theorem', gloss: '대칭 행렬은 고윳값이 모두 실수이고, 서로 수직인 단위 고유벡터로 이루어진 기저를 가진다: S = QΛQᵀ.' }],
    symbols: [
      { tex: String.raw`\Lambda`, meaning: '고윳값을 대각에 놓은 대각 행렬' },
      { tex: String.raw`\mathbf{q}_i`, meaning: '대칭 행렬의 i번째 단위 고유벡터 (Q의 i번째 열)' },
    ],
  },
  requires: ['def.symmetric', 'prop.diagonalization', 'prop.transpose-dot', 'prop.orthogonal-inverse'],
  predicts: [
    {
      id: 'p-orth',
      kind: 'choice',
      q: '대칭 행렬에서, 고윳값이 서로 다른 두 고유벡터 사이의 각은?',
      choices: ['언제나 90°', '행렬마다 다르다', '언제나 45°', '0° (같은 직선)'],
      answer: 0,
      why: [
        String.raw`아래 그림에서 행렬을 바꿔 확인하고, 증명은 이 노드의 끝에 있다. 앞 노드의 등식 $(S\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(S\mathbf{y})$ 한 줄이면 된다.`,
        String.raw`대칭이 **아닌** 행렬에서는 그렇다. 앞 노드의 예 $\begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$의 고유벡터 $(2, 1)$, $(1, 1)$은 수직이 아니다.`,
        String.raw`45°가 나오는 대칭 행렬은 없다. 그림에서 확인해 보라.`,
        String.raw`[서로 다른 고윳값의 고유벡터는 같은 직선 위에 있을 수 없다](n:prop.diagonalization).`,
      ],
    },
    {
      id: 'p-disc',
      kind: 'choice',
      q: String.raw`대칭 행렬 $\begin{bmatrix} s_{11} & s_{12} \\ s_{12} & s_{22} \end{bmatrix}$의 특성방정식의 판별식은 음수가 될 수 있을까?`,
      hints: [
        String.raw`대칭 행렬의 대각합은 $s_{11} + s_{22}$, 행렬식은 $s_{11}s_{22} - s_{12}^2$이다. 판별식 $(\operatorname{tr})^2 - 4\det$에 넣고 전개해 보라.`,
        String.raw`전개하면 $s_{11}^2 - 2s_{11}s_{22} + s_{22}^2 + 4s_{12}^2$이 된다. 앞의 세 항은 무엇의 제곱인가?`,
      ],
      choices: ['될 수 없다', '될 수 있다. 회전처럼', String.raw`$\det S < 0$이면 음수가 된다`, String.raw`$s_{12}$가 크면 음수가 된다`],
      answer: 0,
      why: [
        String.raw`판별식을 정리하면 $(s_{11} - s_{22})^2 + 4s_{12}^2$, 곧 제곱의 합이 된다. 증명의 1번이다.`,
        String.raw`회전은 대칭 행렬이 아니다(각이 0°, 180°일 때만 빼고). 대칭 행렬은 무언가를 돌리는 변환이 될 수 없다.`,
        String.raw`$\det S < 0$이면 판별식 $(\operatorname{tr}S)^2 - 4\det S$는 오히려 더 커진다.`,
        String.raw`$s_{12}$는 판별식에 $4s_{12}^2$로, 곧 0 이상의 값으로만 들어간다. 클수록 판별식이 커진다.`,
      ],
    },
  ],
  openWhys: [
    { q: 'n×n 대칭 행렬도 고윳값이 모두 실수이고, 서로 수직인 단위 고유벡터 n개를 언제나 가지는가? (일반적인 증명)', answeredBy: null },
  ],
  body: String.raw`[대칭 행렬](t:t.symmetric)의 고유벡터는 어떻게 생겼을까?

::predict p-orth

아래 그림은 대칭 행렬 $S$와 그 고유 방향(하늘, 연두)이다. "대칭 고정"을 켠 채로 성분을 바꿔 보면 두 고유 방향이 언제나 서로 수직이다. 고정을 끄고 대칭을 깨면 수직이 무너진다.

::scene c8-spectral {}

::predict p-disc

**명제(스펙트럼 정리, 2×2).** 2×2 대칭 행렬 $S$에 대해
1. 고윳값은 모두 실수다.
2. 서로 다른 고윳값의 고유벡터는 서로 [직교](t:t.orthogonal)한다.
3. 그러므로 서로 수직인 단위 고유벡터 $\mathbf{q}_1, \mathbf{q}_2$가 있다. 이 둘을 열로 세운 [직교 행렬](t:t.orth-matrix) $Q$와, 고윳값을 대각에 놓은 $\Lambda$로

$$S = Q\Lambda Q^{\mathsf{T}}, \qquad Q = \begin{bmatrix} | & | \\ \mathbf{q}_1 & \mathbf{q}_2 \\ | & | \end{bmatrix}, \quad \Lambda = \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix}$$

이것을 [스펙트럼 정리](def:t.spectral)라 한다. [대각화](t:t.diagonalize) $A = PDP^{-1}$과 같은 모양인데, 두 가지가 더 좋다. 대각화가 **언제나** 되고, 번역을 되돌리는 $P^{-1}$ 자리에 계산하기 쉬운 $Q^{\mathsf{T}}$가 온다. 기하로 읽으면 $S$는 "돌리고(또는 뒤집고) → 서로 수직인 두 축 방향으로 따로 늘이고 → 되돌려 돌리는" 변환이다.

### 두 개의 예
- $S = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$: 고윳값 3, 1, 단위 고유벡터 $\mathbf{q}_1 = (1, 1)/\sqrt{2}$, $\mathbf{q}_2 = (1, -1)/\sqrt{2}$. 내적은 $(1 - 1)/2 = 0$이다.
- $S = \begin{bmatrix} 1 & 2 \\ 2 & -2 \end{bmatrix}$: 대각합 $-1$, 행렬식 $-2 - 4 = -6$이므로 $\lambda^2 + \lambda - 6 = (\lambda - 2)(\lambda + 3) = 0$, 고윳값 2와 $-3$. 고유벡터는 $(2, 1)$과 $(1, -2)$이고 내적은 $2 - 2 = 0$이다. 고윳값 $-3$의 방향은 뒤집힌다.

### n차원에 대해 정직하게
같은 정리가 $n \times n$ 대칭 행렬에서도 성립한다. 아래 증명의 2번은 차원과 상관없이 그대로 통한다. 그러나 1번(고윳값이 실수)과 "서로 수직인 고유벡터가 $n$개 모두 있다"는 부분은, 이 교재가 다루지 않는 도구(복소수, 또는 수학적 귀납법과 최댓값 논증)가 있어야 증명된다. 이 교재 안에서는 $n \times n$의 경우를 증명 없이 받아들이고, 그 사실을 아래 "아직 여기서 답하지 않은 질문"에 남긴다.

> [!코드] 야코비 방법은 정리를 "만들어 보인다"
> 이 저장소의 \`symEig\`는 $n \times n$ 대칭 행렬에 대해 실제로 $Q$와 $\Lambda$를 계산한다. 대각선 밖의 성분 하나를 0으로 만드는 회전을 계속 곱해 나가는 방법(야코비 방법)이다. 회전들의 곱이 $Q$가 된다. 테스트는 무작위 2, 3, 5차원 대칭 행렬에서 $S = Q\Lambda Q^{\mathsf{T}}$와 $Q^{\mathsf{T}}Q = I$를 확인한다. 다만 이것은 정리의 증거이지 증명은 아니다. 이 방법이 언제나 끝까지 수렴한다는 사실 역시 이 교재 밖의 결과다.`,
  proof: String.raw`**1. 고윳값은 실수다.** $S = \begin{bmatrix} s_{11} & s_{12} \\ s_{12} & s_{22} \end{bmatrix}$의 [판별식](why:prop.char-poly)을 정리하면

$$(s_{11} + s_{22})^2 - 4(s_{11}s_{22} - s_{12}^2) = s_{11}^2 - 2s_{11}s_{22} + s_{22}^2 + 4s_{12}^2 = (s_{11} - s_{22})^2 + 4s_{12}^2$$

이다. [실수의 제곱은 0 이상이므로](why:prop.neg-times-neg) 판별식은 0 이상이고, 고윳값은 실수다.

**2. 서로 다른 고윳값의 고유벡터는 직교한다.** $S\mathbf{q}_1 = \lambda_1\mathbf{q}_1$, $S\mathbf{q}_2 = \lambda_2\mathbf{q}_2$, $\lambda_1 \ne \lambda_2$라 하자. [대칭 행렬은 어느 쪽에 걸어도 같으므로](why:def.symmetric)

$$\lambda_1(\mathbf{q}_1\cdot\mathbf{q}_2) = (S\mathbf{q}_1)\cdot\mathbf{q}_2 = \mathbf{q}_1\cdot(S\mathbf{q}_2) = \lambda_2(\mathbf{q}_1\cdot\mathbf{q}_2)$$

이다. 양쪽을 빼면 $(\lambda_1 - \lambda_2)(\mathbf{q}_1\cdot\mathbf{q}_2) = 0$이고, $\lambda_1 \ne \lambda_2$이므로 $\mathbf{q}_1\cdot\mathbf{q}_2 = 0$이다.

**3. 직교 행렬로 대각화된다.** 판별식이 0인 경우는 $(s_{11} - s_{22})^2 + 4s_{12}^2 = 0$, 곧 $s_{11} = s_{22}$이고 $s_{12} = 0$인 경우뿐이다. 이때 $S = s_{11}I$이므로 모든 벡터가 고유벡터이고, $\mathbf{q}_1 = \mathbf{e}_1$, $\mathbf{q}_2 = \mathbf{e}_2$로 고르면 된다. 판별식이 양수이면 고윳값이 서로 다르므로 2번에 따라 두 고유벡터가 직교한다. 각각을 길이 1로 맞춰([단위벡터](t:t.unit-vector)) $\mathbf{q}_1, \mathbf{q}_2$라 하자. 그러면 $Q$의 열은 [정규직교](t:t.orthonormal)이므로 [$Q^{-1} = Q^{\mathsf{T}}$](why:prop.orthogonal-inverse)이고, [대각화](why:prop.diagonalization)에서 $P = Q$로 놓으면 $S = Q\Lambda Q^{-1} = Q\Lambda Q^{\mathsf{T}}$다.`,
  checks: [
    {
      q: String.raw`$Q\Lambda Q^{\mathsf{T}}$ 꼴의 행렬(Q는 직교, Λ는 대각)은 언제나 대칭인가?`,
      choices: ['언제나 대칭이다', 'Q가 회전일 때만 대칭이다', 'Λ의 성분이 양수일 때만 대칭이다', '대칭일 수 없다'],
      answer: 0,
      explain: String.raw`$(Q\Lambda Q^{\mathsf{T}})^{\mathsf{T}} = (Q^{\mathsf{T}})^{\mathsf{T}}\Lambda^{\mathsf{T}}Q^{\mathsf{T}} = Q\Lambda Q^{\mathsf{T}}$이다(대각 행렬은 전치해도 같다). 그러므로 스펙트럼 정리는 양방향이다. 대칭 행렬은 정확히 "서로 수직인 축 방향으로 따로 늘이는 변환"이다.`,
    },
  ],
  code: ['symEig'],
};

export default node;
