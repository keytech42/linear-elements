import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.matmul-columns',
  kind: 'prop',
  title: 'AB의 j번째 열 = A × (B의 j번째 열)',
  status: 'written',
  requires: ['def.composition'],
  predicts: [
    {
      id: 'p-col2',
      kind: 'point',
      q: String.raw`$A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 3 & 0 \\ 1 & 2 \end{bmatrix}$이다. 곱 $AB$의 **둘째 열**을 분홍 점으로 끌어 놓아라.`,
      hints: [
        String.raw`$AB$의 둘째 열은 $AB$가 $\mathbf{e}_2$를 보내는 곳이다. [합성의 정의](n:def.composition)에 따라 그것은 $A(B\mathbf{e}_2)$다.`,
        String.raw`$B\mathbf{e}_2$는 $B$의 둘째 열 $(0, 2)$다. 이제 $A(0, 2) = 0\cdot\mathbf{a}_1 + 2\cdot\mathbf{a}_2$를 계산하라.`,
      ],
      A: [[5, 4], [1, 2]],
      x: [0, 1],
      target: 'Ax',
      reveal: String.raw`정답은 $(4, 2)$다: $A(0, 2) = 0\cdot(1, 0) + 2\cdot(2, 1)$. 첫째 열도 같은 방식으로 $A(3, 1) = 3\cdot(1, 0) + 1\cdot(2, 1) = (5, 1)$이다.`,
    },
  ],
  body: String.raw`[행렬 곱](t:t.matmul) $AB$는 합성 변환의 행렬로 정의했다. 실제로 숫자를 어떻게 계산할까?

::predict p-col2

**명제.** $AB$의 $j$번째 열은 $A$에 $B$의 $j$번째 열을 곱한 것이다.

$$AB = A\begin{bmatrix} | & | \\ B\mathbf{e}_1 & B\mathbf{e}_2 \\ | & | \end{bmatrix} = \begin{bmatrix} | & | \\ A(B\mathbf{e}_1) & A(B\mathbf{e}_2) \\ | & | \end{bmatrix}$$

말로 하면 이렇다. "$B$가 $\mathbf{e}_j$를 보낸 곳을, $A$가 다시 어디로 보내는가." 열 하나하나는 [행렬-벡터 곱](t:t.matvec)이고, 행렬-벡터 곱은 열들의 선형 결합이다.

### 성분으로 풀어 쓰기
위 관문의 $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 3 & 0 \\ 1 & 2 \end{bmatrix}$에서

$$AB = \begin{bmatrix} 1\cdot3 + 2\cdot1 & 1\cdot0 + 2\cdot2 \\ 0\cdot3 + 1\cdot1 & 0\cdot0 + 1\cdot2 \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 1 & 2 \end{bmatrix}$$

성분 하나만 보면 "$A$의 $i$행"과 "$B$의 $j$열"을 같은 자리끼리 곱해서 더한 것이다. 이 "곱해서 더하기"는 3장에서 [내적](fwd:t.dot)이라는 이름을 얻는다. 그러나 이 계산은 정의가 아니라 **결과**다. 정의는 어디까지나 "열마다 $A$를 곱한다"이다.

::scene c2-compose {"A": [[1, 2], [0, 1]], "B": [[3, 0], [1, 2]], "x": [0, 1]}

> [!코드] 정의대로 구현하기
> \`matMul\`은 $B$의 열을 하나씩 꺼내 \`matVec\`으로 $A$를 곱하고, 그 결과를 다시 열로 세운다(\`fromCols\`). 학교에서 배운 "행 × 열" 계산을 쓰지 않았다. 둘이 언제나 같은 답을 낸다는 것은 테스트(\`(AB)x = A(Bx)\`, 오라클 비교)가 확인한다.`,
  proof: String.raw`[행렬의 j번째 열은 그 변환이 eⱼ를 보내는 곳이다](why:def.matrix). $AB$가 나타내는 변환은 "$B$ 다음 $A$"이므로 $\mathbf{e}_j$를 $A(B\mathbf{e}_j)$로 보낸다([왜?](why:def.composition)). 그리고 $B\mathbf{e}_j$는 $B$의 $j$번째 열이다.`,
  code: ['matMul'],
};

export default node;
