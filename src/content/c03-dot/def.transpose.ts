import type { NodeDef } from '../schema';

const node: NodeDef = {
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
        String.raw`첫째 열이 $-\theta$ 자리의 점, 둘째 열 $(\sin\theta, \cos\theta)$는 그것을 90° 돌린 점이다. 곧 $R_{-\theta}$다. 회전의 전치는 회전을 되돌린다. 5장에서 이것이 "[직교 행렬](fwd:t.orth-matrix)의 [역행렬](fwd:t.inverse)은 전치"가 된다.`,
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

::scene c3-transpose-grids {}

그림 왼쪽은 $A$가 만드는 격자, 오른쪽은 $A^{\mathsf{T}}$가 만드는 격자다. 왼쪽의 점선 화살표(A의 행)가 오른쪽의 실선 화살표($A^{\mathsf{T}}$의 열)와 똑같다는 것을 확인하라.

::predict p-rot

### 전치는 기하적으로 무엇인가
숫자 배치로는 "행과 열을 바꾼 것"이지만, 기하적인 뜻은 이 정의만으로는 잘 보이지 않는다. 전단 $A$와 그 전치는 서로 다른 방향으로 미는 전단이고, 회전의 전치는 되돌리는 회전이다. 이 둘을 하나로 묶는 성질이 다음 노드의 명제다.`,
  checks: [
    {
      q: String.raw`$A$가 4×3이면 $A^{\mathsf{T}}A$와 $AA^{\mathsf{T}}$의 모양은?`,
      choices: ['3×3과 4×4', '4×4와 3×3', '둘 다 4×3', '곱할 수 없다'],
      answer: 0,
      explain: String.raw`$A^{\mathsf{T}}$는 3×4다. $(3\times4)(4\times3) = 3\times3$, $(4\times3)(3\times4) = 4\times4$. [안쪽 차원이 맞는다](n:prop.shape-rule). 9장에서 $A^{\mathsf{T}}A$가 주인공이 된다.`,
    },
  ],
  code: ['transpose'],
};

export default node;
