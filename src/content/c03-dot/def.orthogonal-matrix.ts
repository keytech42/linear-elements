import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c3-orthogonal {}

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
};

export default node;
