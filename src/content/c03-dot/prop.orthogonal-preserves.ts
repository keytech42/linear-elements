import type { NodeDef } from '../schema';

const node: NodeDef = {
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

::scene c3-orthogonal {"reflect": true}

::predict p-angle

### 거꾸로: 길이를 지키는 선형 변환은 직교 행렬이다
관문에서 본 것처럼, 길이를 지키는 선형 변환은 내적도 지킨다. 그러면 $\mathbf{e}_1$, $\mathbf{e}_2$의 도착지(열)도 서로 직교하고 길이가 1이다. 곧 직교 행렬이다. 그러므로 **"길이를 지키는 선형 변환"과 "직교 행렬"은 같은 것**이다.

::predict p-all

그러므로 평면의 직교 행렬은 회전 $R_\theta$와 반사 $\begin{bmatrix} \cos\theta & \sin\theta \\ \sin\theta & -\cos\theta \end{bmatrix}$ 두 종류뿐이다. 9장의 [특이값 분해](fwd:t.svd) $U\Sigma V^{\mathsf{T}}$에서 $U$와 $V$가 바로 이것들이다.`,
  proof: String.raw`[전치의 정체](why:prop.transpose-dot)를 $A = Q$, $\mathbf{y}$ 자리에 $Q\mathbf{y}$를 넣어 쓰면

$$(Q\mathbf{x})\cdot(Q\mathbf{y}) = \mathbf{x}\cdot(Q^{\mathsf{T}}Q\mathbf{y}) = \mathbf{x}\cdot(I\mathbf{y}) = \mathbf{x}\cdot\mathbf{y}$$

이다. 가운데 등호는 [직교 행렬의 조건](why:def.orthogonal-matrix) $Q^{\mathsf{T}}Q = I$다. $\mathbf{y} = \mathbf{x}$로 두면 $\|Q\mathbf{x}\|^2 = \|\mathbf{x}\|^2$, 곧 길이가 같다. 각도는 [내적과 두 길이로 정해지므로](why:prop.dot-geometric) $\cos\theta = \frac{\mathbf{x}\cdot\mathbf{y}}{\|\mathbf{x}\|\|\mathbf{y}\|}$가 그대로이고, 각도도 같다.`,
};

export default node;
