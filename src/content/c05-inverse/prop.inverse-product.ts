import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.inverse-product',
  kind: 'prop',
  title: '(AB)⁻¹ = B⁻¹A⁻¹ — 양말과 신발',
  status: 'written',
  requires: ['def.inverse', 'prop.associative'],
  predicts: [
    {
      id: 'p-order',
      kind: 'choice',
      q: String.raw`$A$, $B$가 가역일 때 $(AB)^{-1}$은?`,
      hints: [
        String.raw`$AB$는 "$B$를 먼저, 그다음 $A$"다. 이 둘을 되돌리려면 무엇을 먼저 되돌려야 하는가? 마지막에 한 일부터다.`,
        String.raw`후보를 $AB$에 곱해서 $I$가 되는지 확인하라. 괄호는 [결합법칙](n:prop.associative)으로 옮길 수 있다.`,
      ],
      choices: [String.raw`$B^{-1}A^{-1}$`, String.raw`$A^{-1}B^{-1}$`, String.raw`$(BA)^{-1}$과 같고, 따라서 $AB$와 상관없다`, String.raw`$AB$의 각 성분의 역수`],
      answer: 0,
      why: [
        String.raw`$(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}B = I$. 마지막에 한 $A$를 먼저 되돌리고, 처음에 한 $B$를 나중에 되돌린다.`,
        String.raw`순서를 그대로 두면 $(A^{-1}B^{-1})(AB) = A^{-1}(B^{-1}A)B$에서 가운데가 지워지지 않는다. 흔한 실수다.`,
        String.raw`$(BA)^{-1} = A^{-1}B^{-1}$이고, 일반적으로 $AB \ne BA$이므로 다르다.`,
        String.raw`[역행렬은 성분의 역수가 아니다](n:prop.inverse-exists).`,
      ],
    },
  ],
  body: String.raw`두 변환을 차례로 한 것을 되돌리려면 어떻게 해야 할까?

::predict p-order

**명제.** $A$, $B$가 [가역](t:t.invertible)이면 $AB$도 가역이고

$$(AB)^{-1} = B^{-1}A^{-1}$$

이다. 순서가 뒤집힌다.

> [!비유] 양말과 신발
> 아침에 양말을 신고($B$) 신발을 신는다($A$). 밤에 되돌릴 때는 신발을 먼저 벗고($A^{-1}$) 양말을 나중에 벗는다($B^{-1}$). 마지막에 한 일을 먼저 되돌린다. 이 비유가 덮는 것은 **순서**뿐이다. 양말이나 신발은 선형 변환이 아니므로, "되돌리는 변환도 선형"이라는 사실까지 설명해 주지는 않는다.

::scene c5-undo {"B": [[2, 0], [0, 1]]}

"순서를 틀리게" 상자를 켜고 다시 해 보라. $B^{-1}$을 먼저 하면 격자가 제자리로 돌아오지 않는다.

### 두 개의 예
- $A$ = 90° 회전, $B$ = 가로 2배: $(AB)^{-1} = B^{-1}A^{-1}$ = "−90° 돌린 뒤 가로 절반". 순서를 바꾼 "가로 절반 뒤 −90°"는 세로를 절반으로 만들어 버린다.
- 같은 행렬 두 번: $(AA)^{-1} = A^{-1}A^{-1}$. 두 번 한 것은 두 번 되돌린다.`,
  proof: String.raw`[결합법칙](why:prop.associative)으로 괄호를 옮기면

$$(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}IB = B^{-1}B = I$$

이고, 같은 방식으로 $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AA^{-1} = I$다. 두 식이 모두 성립하므로 [역행렬의 정의](why:def.inverse)에 따라 $B^{-1}A^{-1}$이 $AB$의 역행렬이다.`,
};

export default node;
