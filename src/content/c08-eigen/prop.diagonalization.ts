import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.diagonalization',
  kind: 'prop',
  title: '고유기저에서는 늘이기뿐: A = PDP⁻¹',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.diagonal', ko: '대각 행렬', en: 'diagonal matrix', gloss: '대각선 밖의 성분이 모두 0인 행렬. 축 방향으로 따로따로 늘이기만 한다.' },
      { id: 't.diagonalize', ko: '대각화', en: 'diagonalization', gloss: '고유벡터들을 기저로 삼아 변환을 대각 행렬로 다시 적는 일: A = PDP⁻¹.' },
    ],
    symbols: [{ tex: 'D', meaning: '대각 행렬(대각화에서 고윳값을 대각에 놓은 것)' }],
  },
  requires: ['prop.char-poly', 'prop.similarity'],
  predicts: [
    {
      id: 'p-diag',
      kind: 'choice',
      q: String.raw`서로 다른 직선 위의 두 고유벡터 $\mathbf{v}_1, \mathbf{v}_2$(고윳값 $\lambda_1, \lambda_2$)를 새 기저로 삼아, 같은 변환을 그 기저의 좌표로 다시 적으면 어떤 행렬이 될까?`,
      hints: [
        String.raw`새 좌표 $(c_1, c_2)$는 벡터 $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$를 뜻한다. 여기에 $A$를 곱하면 무엇이 되는지, 그리고 그 결과를 다시 새 좌표로 적으면 무엇인지 써 보라.`,
      ],
      choices: [String.raw`대각선에 $\lambda_1, \lambda_2$가 놓이고 나머지는 0인 행렬`, String.raw`$A$와 똑같은 행렬`, '항등 행렬', '회전 행렬'],
      answer: 0,
      why: [
        String.raw`새 좌표 $(c_1, c_2)$로 적힌 벡터 $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$는 $c_1\lambda_1\mathbf{v}_1 + c_2\lambda_2\mathbf{v}_2$로 간다. 새 좌표로는 $(\lambda_1c_1, \lambda_2c_2)$, 곧 좌표마다 따로 늘이기만 한다.`,
        String.raw`같은 변환이라도 기저를 바꾸면 적는 숫자가 바뀐다. [7장](n:prop.similarity)에서 본 것처럼, 새 기저로 적은 행렬은 $P^{-1}AP$다.`,
        String.raw`그것은 모든 고윳값이 1일 때뿐이다.`,
        String.raw`고유 방향 위에서는 늘이기만 할 뿐 돌리지 않는다.`,
      ],
    },
    {
      id: 'p-shear',
      kind: 'choice',
      q: String.raw`[전단](t:t.shear) $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$은 대각화될까?`,
      choices: ['안 된다. 고유 방향이 하나뿐이다', '된다. 고윳값 1이 실수이므로', '된다. 모든 행렬은 대각화된다', '된다. 고윳값이 두 개이므로'],
      answer: 0,
      why: [
        String.raw`$A - I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$이 0으로 보내는 방향은 가로축 하나뿐이다. 기저를 이루려면 서로 다른 직선 위의 고유벡터가 둘 필요하다.`,
        String.raw`고윳값이 실수인 것만으로는 부족하다. 서로 다른 직선 위의 고유벡터가 **둘** 있어야 한다.`,
        String.raw`회전(실수 고윳값 없음)과 전단(고유 방향 하나)이 반례다.`,
        String.raw`특성방정식 $(\lambda - 1)^2 = 0$의 근은 1 하나(중근)다. 그리고 그 하나에 딸린 직선도 하나뿐이다.`,
      ],
    },
  ],
  body: String.raw`[고유벡터](t:t.eigenvector)가 서로 다른 직선 위에 두 개 있으면, 그 두 방향은 평면의 [기저](t:t.basis)가 된다. 그 기저의 좌표로 변환을 다시 적으면 어떻게 보일까?

::predict p-diag

새 좌표로 적은 행렬은 대각선에만 고윳값이 있고 나머지는 0이다. 이런 행렬을 [대각 행렬](def:t.diagonal)이라 하고, 이렇게 다시 적는 일을 [대각화](def:t.diagonalize)라 한다.

**명제.** 2×2 행렬 $A$가 서로 다른 직선 위의 고유벡터 $\mathbf{v}_1, \mathbf{v}_2$(고윳값 $\lambda_1, \lambda_2$)를 가진다고 하자. $P$를 두 고유벡터를 열로 세운 행렬, $D$를 고윳값을 대각에 놓은 행렬이라 하면

$$P = \begin{bmatrix} | & | \\ \mathbf{v}_1 & \mathbf{v}_2 \\ | & | \end{bmatrix}, \quad D = \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix}, \qquad A = PDP^{-1}$$

이다.

### 오른쪽부터 읽기: 번역 → 늘이기 → 번역
[기저 변환](t:t.change-of-basis)에서 $P$는 "새 좌표 → 표준 좌표"였다. 그러므로 $A\mathbf{x} = P(D(P^{-1}\mathbf{x}))$는 세 단계다.
1. $P^{-1}$: 입력을 고유 기저의 좌표로 **번역**한다.
2. $D$: 각 좌표를 고윳값만큼 따로 **늘인다**.
3. $P$: 결과를 다시 표준 좌표로 **번역**한다.

[같은 변환을 다른 언어로 적은 것](why:prop.similarity)이 바로 이 모양이다. 대각화는 "고유 기저라는 언어로 말하면 이 변환은 늘이기뿐"이라는 뜻이다.

::scene c8-diagonalize {}

예: 그림의 처음 행렬 $A = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$은 [앞 노드](n:prop.char-poly)에서 고윳값 3, 2와 고유벡터 $(2, 1)$, $(1, 1)$을 얻었다. 그러므로 $P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$, $D = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}$, $P^{-1} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$이다($\det P = 1$). 검산하면 $PD = \begin{bmatrix} 6 & 2 \\ 3 & 2 \end{bmatrix}$이고, $(PD)P^{-1} = \begin{bmatrix} 6 - 2 & -6 + 4 \\ 3 - 2 & -3 + 4 \end{bmatrix} = \begin{bmatrix} 4 & -2 \\ 1 & 1 \end{bmatrix}$으로 $A$와 같다.

### 언제 대각화되는가
- **고윳값이 서로 다르면 언제나 된다.** 서로 다른 고윳값의 고유벡터는 같은 직선 위에 있을 수 없기 때문이다(아래 증명의 첫 부분).
- **실수 고윳값이 없으면 안 된다.** [회전](n:prop.no-real-eigen)이 그렇다.
- **고윳값이 하나(중근)이면 경우에 따라 다르다.** $2I$처럼 모든 방향이 고유 방향이면 이미 대각 행렬이다. 그렇지 않으면 고유 방향이 하나뿐이어서 대각화되지 않는다.

::predict p-shear

::scene c8-eigen-hunt {"A": [[1, 1], [0, 1]], "showEigen": true}

### 대각화가 주는 것: 여러 번 하기가 쉬워진다
$A^2 = (PDP^{-1})(PDP^{-1}) = PD(P^{-1}P)DP^{-1} = PD^2P^{-1}$이다([결합법칙](why:prop.associative)으로 가운데를 묶었다). 같은 방식으로 $A^k = PD^kP^{-1}$이고, $D^k$는 대각선을 $\lambda_1^k, \lambda_2^k$로 바꾸기만 하면 된다. 위 예에서 $A^{10}$은 $(2, 1)$ 방향으로 $3^{10} = 59049$배, $(1, 1)$ 방향으로 $2^{10} = 1024$배 늘인다. 그래서 변환을 여러 번 되풀이하면 거의 모든 입력이 가장 큰 고윳값의 방향으로 쏠린다.`,
  proof: String.raw`**서로 다른 고윳값의 고유벡터는 같은 직선 위에 없다.** $\lambda_1 \ne \lambda_2$인데 $\mathbf{v}_2 = c\mathbf{v}_1$이라고 해 보자. 그러면 $A\mathbf{v}_2 = \lambda_2\mathbf{v}_2$이고, 한편 $A\mathbf{v}_2 = cA\mathbf{v}_1 = c\lambda_1\mathbf{v}_1 = \lambda_1\mathbf{v}_2$다. 두 식을 빼면 $(\lambda_1 - \lambda_2)\mathbf{v}_2 = \mathbf{0}$이고, $\mathbf{v}_2 \ne \mathbf{0}$이므로 $\lambda_1 = \lambda_2$가 되어 가정과 어긋난다.

**$A = PDP^{-1}$.** [곱의 j번째 열은 왼쪽 행렬 × 오른쪽 행렬의 j번째 열이다](why:prop.matmul-columns). 그러므로 $AP$의 열은 $A\mathbf{v}_1 = \lambda_1\mathbf{v}_1$, $A\mathbf{v}_2 = \lambda_2\mathbf{v}_2$이고, $PD$의 열은 $P(\lambda_1\mathbf{e}_1) = \lambda_1\mathbf{v}_1$, $P(\lambda_2\mathbf{e}_2) = \lambda_2\mathbf{v}_2$다. 열이 모두 같으므로 $AP = PD$다. $P$의 두 열은 서로 다른 직선 위에 있으므로 [선형 독립](t:t.lin-indep)이고, [그래서 행렬식이 0이 아니며](why:prop.det-zero) [역행렬이 있다](why:prop.inverse-exists). 양쪽의 오른쪽에 $P^{-1}$을 곱하면 $A = PDP^{-1}$이다.`,
  checks: [
    {
      q: String.raw`$A = PDP^{-1}$이고 $D = \begin{bmatrix} 2 & 0 \\ 0 & 0.5 \end{bmatrix}$이다. $\det A$는?`,
      choices: ['1', '2.5', 'P를 모르면 알 수 없다', '0'],
      answer: 0,
      explain: String.raw`[행렬식은 곱을 곱으로 보낸다](n:prop.det-product). $\det A = \det P\cdot\det D\cdot\det P^{-1} = \det D = 2\times0.5 = 1$이다($\det P\cdot\det P^{-1} = \det I = 1$). 같은 변환을 어느 언어로 적든 넓이 배율은 같다. 그리고 그것은 고윳값의 곱이다.`,
    },
  ],
};

export default node;
