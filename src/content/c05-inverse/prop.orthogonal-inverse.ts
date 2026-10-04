import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.orthogonal-inverse',
  kind: 'prop',
  title: '직교 행렬의 역행렬은 전치다',
  status: 'written',
  requires: ['def.inverse', 'def.orthogonal-matrix'],
  predicts: [
    {
      id: 'p-cost',
      kind: 'choice',
      q: String.raw`직교 행렬 $Q$의 역행렬을 구하는 데 필요한 계산은?`,
      hints: [String.raw`[직교 행렬의 조건](n:def.orthogonal-matrix)은 $Q^{\mathsf{T}}Q = I$였다. 이 식을 [역행렬의 정의](n:def.inverse)와 나란히 놓아 보라.`],
      choices: ['행과 열을 맞바꾸기만 하면 된다. 곱셈도 나눗셈도 없다', '일반 역행렬 공식을 써야 한다', '행렬식으로 나누는 일만 하면 된다', '직교 행렬은 역행렬이 없다'],
      answer: 0,
      why: [
        String.raw`$Q^{\mathsf{T}}Q = I$이므로 $Q^{\mathsf{T}}$가 바로 되돌리는 행렬이다. 아래에서 반대 순서 $QQ^{\mathsf{T}} = I$도 보인다. 회전을 되돌리는 계산이 이렇게 싼 이유가 이것이다.`,
        String.raw`써도 같은 답이 나오지만, 공식을 쓸 필요가 없다. 전치 한 번이면 된다.`,
        String.raw`직교 행렬의 행렬식은 ±1이라 나눠도 부호만 바뀐다. 그것만으로는 부족하다.`,
        String.raw`길이를 지키는 변환은 납작해지지 않으므로 언제나 되돌릴 수 있다.`,
      ],
    },
    {
      id: 'p-rows',
      kind: 'choice',
      q: '열이 정규직교인 정사각 행렬(직교 행렬)은 행도 정규직교일까?',
      hints: [String.raw`$Q^{-1} = Q^{\mathsf{T}}$이면 $QQ^{\mathsf{T}} = I$이기도 하다. $QQ^{\mathsf{T}}$의 성분은 $Q$의 무엇끼리의 내적인가?`],
      choices: ['그렇다. 행도 정규직교다', '아니다. 열만 정규직교다', '회전일 때만 그렇다', '반사일 때만 그렇다'],
      answer: 0,
      why: [
        String.raw`$QQ^{\mathsf{T}}$의 $i$행 $j$열 성분은 $Q$의 $i$번째 행과 $j$번째 행의 내적이다. 그것이 $I$이므로 행들도 정규직교다.`,
        String.raw`정사각 행렬에서는 열이 정규직교이면 행도 정규직교다. 정사각이 아니면(예: 3×2) 열만 정규직교일 수 있다.`,
        String.raw`반사도 마찬가지다.`,
        String.raw`회전도 마찬가지다.`,
      ],
    },
  ],
  body: String.raw`[회전의 전치는 되돌리는 회전](n:def.transpose)이었다. 이것은 회전만의 우연일까, 아니면 [직교 행렬](t:t.orth-matrix) 전체의 성질일까?

::predict p-cost

**명제.** 직교 행렬 $Q$는 가역이고 $Q^{-1} = Q^{\mathsf{T}}$이다. 그러므로 $QQ^{\mathsf{T}} = I$이기도 하고, $Q$의 행들도 정규직교다.

::scene c5-undo {"A": [[0.8, -0.6], [0.6, 0.8]], "showT": true}

읽기 칸에서 $A^{-1}$과 $A^{\mathsf{T}}$를 비교해 보라. 성분이 똑같다.

::predict p-rows

### 두 개의 예
- $R_\theta^{-1} = R_\theta^{\mathsf{T}} = R_{-\theta}$.
- 반사 $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: 전치가 자기 자신이므로 역행렬도 자기 자신이다.`,
  proof: String.raw`**가역이다.** 2×2 행렬에서 $\det(A^{\mathsf{T}}) = \det A$다(공식 $a_{11}a_{22} - a_{12}a_{21}$은 행과 열을 바꿔도 같다). $Q^{\mathsf{T}}Q = I$의 양쪽에 행렬식을 취하면 [곱의 행렬식](why:prop.det-product)으로 $(\det Q)^2 = 1$이다. 그러므로 $\det Q = \pm1 \ne 0$이고, [Q는 가역이다](why:prop.inverse-exists).

**역행렬은 전치다.** $Q^{-1}$이 있으므로, 결합법칙으로

$$Q^{\mathsf{T}} = Q^{\mathsf{T}}(QQ^{-1}) = (Q^{\mathsf{T}}Q)Q^{-1} = IQ^{-1} = Q^{-1}$$

이다. 그러므로 $QQ^{\mathsf{T}} = QQ^{-1} = I$이기도 하다. $QQ^{\mathsf{T}}$의 $i$행 $j$열 성분은 [행의 관점](why:prop.row-picture)으로 $Q$의 $i$번째 행과 $Q^{\mathsf{T}}$의 $j$번째 열($= Q$의 $j$번째 행)의 내적이므로, 행들이 정규직교다.`,
};

export default node;
