import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.neg-times-neg',
  kind: 'prop',
  title: '음수 × 음수 = 양수',
  status: 'written',
  requires: ['prop.arith-first'],
  predicts: [
    {
      id: 'p-why',
      kind: 'choice',
      q: String.raw`$(-1) \times (-1)$이 1이어야 하는 이유로 가장 정확한 것은?`,
      hints: [
        String.raw`[앞 노드](n:prop.arith-first)에서 $0 \times a = 0$을 증명했다. 그렇다면 $(-1) \times 0$은?`,
        String.raw`$0 = (-1) \times 0 = (-1) \times \big(1 + (-1)\big)$이다. 여기에 분배법칙을 써 보라.`,
      ],
      choices: ['분배법칙을 지키려면 그럴 수밖에 없다', '"아니다"의 "아니다"는 "그렇다"이므로', '그렇게 하자고 정한 공리이기 때문이다', '직선 위에서 두 번 뒤집으면 제자리이므로'],
      answer: 0,
      why: [
        String.raw`$(-1)\times(-1)$이 1이 아니라면, 분배법칙이 $(-1)\times(1 + (-1))$에서 깨진다. 아래 [명제 1](ref:neg-one)과 [명제 2](ref:minus-one-sq)의 증명이 이것이다.`,
        String.raw`말의 비유는 기억에는 도움이 되지만 증명이 아니다. 비유가 맞는 이유 자체를 설명해야 한다.`,
        String.raw`공리 목록에는 음수끼리의 곱이 없다. 이것은 공리가 아니라 결과다.`,
        String.raw`좋은 그림이다(아래 장면). 그러나 "$-1$을 곱하는 것 = 뒤집기"라는 그림이 맞는 이유도 결국 이 노드의 증명이다. 그림은 결과를 보여 주고, 증명은 이유를 보여 준다.`,
      ],
    },
    {
      id: 'p-sq',
      kind: 'choice',
      q: String.raw`아무 수 $a$에 대해 $a \times a$는 언제나 0 이상일까?`,
      hints: [String.raw`$a$가 0 이상일 때와 음수일 때로 나눠 보라. 음수 $a$는 어떤 양수 $p$에 대해 $a = -p$로 쓸 수 있다. $(-p)(-p)$는?`],
      choices: ['언제나 0 이상이다', '$a$가 음수면 음수다', '$a$가 0과 1 사이이면 음수다', '알 수 없다'],
      answer: 0,
      why: [
        String.raw`$a \ge 0$이면 0 이상끼리의 곱이고, $a = -p$이면 $(-p)(-p) = p \times p \ge 0$이다. 이 사실은 8장에서 "[판별식](fwd:t.discriminant)이 음수면 실수 근이 없다"는 판정의 근거가 된다.`,
        String.raw`음수 × 음수는 양수다. 이 노드의 명제다.`,
        String.raw`0과 1 사이의 수를 제곱하면 **작아지지만** 음수가 되지는 않는다: $0.5 \times 0.5 = 0.25$.`,
        String.raw`두 경우로 나누면 언제나 판정할 수 있다.`,
      ],
    },
  ],
  body: String.raw`"음수 × 음수는 양수"는 학교에서 규칙으로 외웠을 것이다. 그런데 이것은 [공리 목록](n:ax.arith)에 없다. 그렇다면 증명할 수 있어야 한다.

::predict p-why

**명제.** 아무 수 $a, b$에 대해 다음이 성립한다. 이 두 글자와 [명제 5](ref:sqrt-unique)의 $s, t$는 이 노드와 증명에서만 쓰는 이름이다. 여섯 명제는 다루는 것에 따라 두 묶음으로 나뉜다. 명제마다 어느 명제로 증명하는지 적었다.

**가. 음수의 곱셈**

- [명제 1](label:neg-one) $(-1) \times a = -a$. 곧 $-1$을 곱하는 것은 덧셈 역원을 취하는 것이다. 그러므로 $a(-b) = -(ab)$이기도 하다. [앞 노드](n:prop.arith-first)의 결과로 증명한다.
- [명제 2](label:minus-one-sq) $(-1) \times (-1) = 1$. [명제 1](ref:neg-one)로 증명한다.
- [명제 3](label:neg-prod) $(-a)(-b) = ab$. 특히 음수와 음수를 곱하면 양수다. [명제 1](ref:neg-one)과 [명제 2](ref:minus-one-sq)로 증명한다.
- [명제 4](label:square-nonneg) $a \times a \ge 0$. 곧 어떤 수를 제곱해도 음수가 되지 않는다. [명제 3](ref:neg-prod)으로 증명한다.

**나. 제곱근과 1**

- [명제 5](label:sqrt-unique) $s$와 $t$가 0 이상이고 $s \times s = t \times t$이면 $s = t$다. 그러므로 0 이상인 수 $a$의 제곱근 $\sqrt{a}$는 하나뿐이다. [명제 1](ref:neg-one)로 증명한다.
- [명제 6](label:one-pos) 1은 양수다. 그러므로 $2 = 1 + 1$도 양수이고 0이 아니며, $-1$은 음수다. [명제 2](ref:minus-one-sq)로 증명한다.

### 그림으로: $-1$을 곱하는 것은 뒤집기
[수직선](fwd:t.numberline) 위의 점들에 $-1$을 곱하면, 모든 점이 0을 축으로 반대쪽으로 넘어간다. 한 번 더 곱하면 모두 제자리로 돌아온다. "두 번 뒤집으면 제자리"가 $(-1)\times(-1) = 1$의 그림이다. 이 그림은 2장에서 [반사](fwd:t.reflection)를 두 번 하면 제자리라는 사실로 다시 나온다.

::scene c0-flip {}

::predict p-sq

### 예
- $(-3) \times (-4) = 12$: $(-3)(-4) = (-1)\cdot3\cdot(-1)\cdot4 = \big((-1)(-1)\big)\cdot(3 \cdot 4) = 12$. 교환법칙과 결합법칙으로 $-1$끼리 모았다.
- $(-2.5)^2 = 6.25 \ge 0$, $0.3^2 = 0.09 \ge 0$, $0^2 = 0$.
- 제곱해서 9가 되는 수는 $3$과 $-3$ 둘이다. 그 가운데 0 이상인 수는 3 하나뿐이므로 $\sqrt{9} = 3$이다. 마찬가지로 $\sqrt{0.09} = 0.3$이다. $-0.3$도 제곱하면 $0.09$지만 0 이상이 아니다.`,
  proof: String.raw`### 가. 음수의 곱셈

::proves neg-one

**$(-1) \times a = -a$, 그리고 $a(-b) = -(ab)$.**

**방법.** $(-1)a$가 $a$의 덧셈 역원이라는 것을 보이면 된다. 어떤 수가 $a$의 덧셈 역원인지 알아보는 방법은 하나뿐이다. $a$에 더해 0이 되는지 본다. 그리고 그런 수는 [하나뿐](why:prop.arith-first#inverse-unique)이다.

::chain
a + (-1)a = 1a + (-1)a ∵ [1의 공리](ref:ax.arith#one-mul) $1 \times a = a$를 대입
= \big(1 + (-1)\big)a ∵ [오른쪽 분배법칙](why:prop.arith-first#right-dist)
= 0 \times a ∵ [공리 5](ref:ax.arith#neg)
= 0 ∵ [0을 곱하면 0](why:prop.arith-first#zero-times)

∴ $(-1)a$는 $a$에 더해 0을 만드는 수이고, 그런 수는 하나뿐이므로 $(-1)a = -a$다.

뒤의 식 $a(-b) = -(ab)$는 앞의 식을 두 번 쓰고 괄호를 옮겨 얻는다.

::chain
a(-b) = a\big((-1)b\big) ∵ 앞의 식 $-b = (-1)b$를 대입
= \big(a(-1)\big)b ∵ 곱셈의 결합법칙
= \big((-1)a\big)b ∵ 곱셈의 교환법칙 $a(-1) = (-1)a$를 대입
= (-1)(ab) ∵ 곱셈의 결합법칙
= -(ab) ∵ 앞의 식

∴ $a(-b) = -(ab)$다.

::proves minus-one-sq

**$(-1) \times (-1) = 1$.**

**방법.** [명제 1](ref:neg-one)의 $a$ 자리에 $-1$을 넣는다. 관문에서 본 대로, 이 값이 1이 아니면 분배법칙이 깨진다. 실제로 분배법칙은 [명제 1](ref:neg-one)의 증명 둘째 줄에서 쓰였다.

::chain
(-1) \times (-1) = -(-1) ∵ [명제 1](ref:neg-one)에 $a = -1$을 넣음
= 1 ∵ [덧셈 역원의 덧셈 역원은 자기 자신](why:prop.arith-first#double-neg)

∴ $(-1) \times (-1) = 1$이다.

::proves neg-prod

**$(-a)(-b) = ab$. 특히 음수와 음수를 곱하면 양수다.**

**방법.** [명제 1](ref:neg-one)로 $-a$와 $-b$를 $(-1)a$와 $(-1)b$로 바꿔 적는다. 그다음 곱셈의 결합법칙과 교환법칙으로 $-1$ 둘을 한데 모으고, [명제 2](ref:minus-one-sq)로 1로 바꾼다.

::chain
(-a)(-b) = \big((-1)a\big)\big((-1)b\big) ∵ [명제 1](ref:neg-one)을 두 번 대입
= (-1)\Big(a\big((-1)b\big)\Big) ∵ 곱셈의 결합법칙
= (-1)\Big(\big(a(-1)\big)b\Big) ∵ 곱셈의 결합법칙
= (-1)\Big(\big((-1)a\big)b\Big) ∵ 곱셈의 교환법칙 $a(-1) = (-1)a$를 대입
= (-1)\big((-1)(ab)\big) ∵ 곱셈의 결합법칙
= \big((-1)(-1)\big)(ab) ∵ 곱셈의 결합법칙
= 1 \times (ab) ∵ [명제 2](ref:minus-one-sq)
= ab ∵ [1의 공리](ref:ax.arith#one-mul)

∴ $(-a)(-b) = ab$다.

이제 $a$와 $b$가 음수라 하자. 음수의 뜻에 따라 $-a$와 $-b$는 양수다. 보일 것은 $ab$가 양수라는 것이다.

::chain
ab = \big(-(-a)\big)\big(-(-b)\big) ∵ [덧셈 역원의 덧셈 역원은 자기 자신](why:prop.arith-first#double-neg)을 대입
= (-a)(-b) ∵ 바로 위의 식에 $a$ 대신 $-a$, $b$ 대신 $-b$를 넣음

∴ $ab$는 양수 $-a$와 양수 $-b$의 곱이므로, [공리 8](ref:ax.arith#pos-closed)에 따라 양수다.

::proves square-nonneg

**$a \times a \ge 0$.**

**방법.** [공리 7](ref:ax.arith#positive)에 따라 $a$는 양수, 0, 음수 가운데 꼭 하나다. 세 경우를 하나씩 본다.

- $a$가 양수이면, 양수끼리의 곱이므로 [공리 8](ref:ax.arith#pos-closed)에 따라 $a \times a$도 양수다.
- $a = 0$이면, [0을 곱하면 0](why:prop.arith-first#zero-times)이므로 $a \times a = 0 \times 0 = 0$이다.
- $a$가 음수이면, 음수끼리의 곱이므로 [명제 3](ref:neg-prod)에 따라 $a \times a$는 양수다.

∴ 어느 경우든 $a \times a$는 양수이거나 0이다. [앞 노드](n:prop.arith-first)에서 본 대로 "양수다"는 "0보다 크다"와 같은 말이므로, 곧 $a \times a \ge 0$이다.

### 나. 제곱근과 1

::proves sqrt-unique

**제곱근은 하나뿐이다.**

[공리 9](ref:ax.arith#sqrt)는 0 이상인 수 $a$에 대해 "제곱하면 $a$가 되는 0 이상의 수"가 있다고 말하고, 그 수를 $\sqrt{a}$라 부른다. 그런데 하나를 가리키는 이름을 붙이려면 그런 수가 하나뿐이어야 한다. 앞 노드에서 $-a$라는 이름을 붙이기 전에 [덧셈 역원이 하나뿐](why:prop.arith-first#inverse-unique)임을 먼저 보인 것과 같은 까닭이다.

$s \ge 0$, $t \ge 0$이고 $s \times s = t \times t$라 하자. 보일 것은 $s = t$다.

**방법.** $s \times s - t \times t$를 두 수의 곱 $(s + t)(s - t)$로 바꿔 적는다(1단계). 가정에 따라 이 곱은 0이다. 그러면 [곱이 0이면 한쪽은 0](why:prop.arith-first#zero-product)이므로, $s + t = 0$인 경우와 $s - t = 0$인 경우만 따지면 된다(2단계). 두 경우 모두 $s = t$가 나온다.

1단계. 등식 줄의 셋째, 다섯째, 일곱째 줄에서 [명제 1](ref:neg-one)을 쓴다.

::chain
(s + t)(s - t) = (s + t)\big(s + (-t)\big) ∵ 빼기의 뜻([공리 5](ref:ax.arith#neg))
= (s + t)s + (s + t)(-t) ∵ 분배법칙([공리 3](ref:ax.arith#distrib))
= (s + t)s + \big(-((s + t)t)\big) ∵ [명제 1](ref:neg-one)의 $a(-b) = -(ab)$
= (ss + ts) + \big(-(st + tt)\big) ∵ [오른쪽 분배법칙](why:prop.arith-first#right-dist), 두 번
= (ss + ts) + (-1)(st + tt) ∵ [명제 1](ref:neg-one)의 $(-1)a = -a$를 거꾸로 대입
= (ss + ts) + \big((-1)(st) + (-1)(tt)\big) ∵ 분배법칙([공리 3](ref:ax.arith#distrib))
= (ss + ts) + \big(-(st) + (-(tt))\big) ∵ [명제 1](ref:neg-one)
= ss + \Big(\big(ts + (-(st))\big) + (-(tt))\Big) ∵ 덧셈의 결합법칙, 두 번
= ss + \big(0 + (-(tt))\big) ∵ $ts = st$(곱셈의 교환법칙)이므로 [공리 5](ref:ax.arith#neg)에 따라 $ts + (-(st)) = 0$
= ss + (-(tt)) ∵ 덧셈의 교환법칙과 [0의 공리](ref:ax.arith#zero-add)
= ss - tt ∵ 빼기의 뜻

가정 $ss = tt$를 대입하면 $ss - tt = tt - tt = 0$이다([공리 5](ref:ax.arith#neg)). ∴ $(s + t)(s - t) = 0$이다.

2단계. [곱이 0이면 한쪽은 0](why:prop.arith-first#zero-product)이므로, $s + t \neq 0$이면 $s - t = 0$이다. 두 경우를 본다.

- $s - t = 0$인 경우: 양쪽에 $t$를 더하면 $(s - t) + t = 0 + t$다([대입](t:t.substitution)). 왼쪽은 $s + \big((-t) + t\big) = s + 0 = s$(덧셈의 결합법칙과 교환법칙, [공리 5](ref:ax.arith#neg), [0의 공리](ref:ax.arith#zero-add))이고, 오른쪽은 $t$다. 곧 $s = t$다.
- $s + t = 0$인 경우: $s$가 양수라고 해 보자. $t = 0$이면 $s + t = s$이므로 양수이고, $t$가 양수이면 [공리 8](ref:ax.arith#pos-closed)에 따라 $s + t$가 양수다. 어느 쪽이든 $s + t$는 양수인데, 이것은 $s + t = 0$과 함께 성립할 수 없다([공리 7](ref:ax.arith#positive): 셋 가운데 꼭 하나). 그러므로 $s$는 양수가 아니고, $s \ge 0$이므로 $s = 0$이다. 같은 이유로 $t = 0$이다. 곧 $s = t$다.

∴ 어느 경우든 $s = t$다. 그러므로 [공리 9](ref:ax.arith#sqrt)가 보장하는 수 $\sqrt{a}$는 하나뿐이다.

::proves one-pos

**1은 양수다. 그러므로 $2 = 1 + 1$도 양수이고 0이 아니며, $-1$은 음수다.**

당연해 보이지만, 공리 목록에 "1은 양수다"는 없다. [공리 7](ref:ax.arith#positive)은 1이 양수, 0, 음수 가운데 꼭 하나라고만 말한다. 이 명제가 있어야 2로 나눌 수 있고(2가 0이 아니어야 [공리 6](ref:ax.arith#recip)이 역수 $\tfrac{1}{2}$을 준다), [계수](fwd:t.coefficient) $-1$이 0이 아니라고 말할 수 있다.

**방법.** 1이 0이 아니라는 것은 공리에 있다. 그러면 1은 양수이거나 음수다. $-1$이 양수라고 하면 모순이 생긴다는 것을 보인다.

[공리 4](ref:ax.arith#zero-one)에 따라 $1 \neq 0$이므로, [공리 7](ref:ax.arith#positive)에 따라 1이 양수이거나 $-1$이 양수다. $-1$이 양수라고 해 보자. 그러면 [공리 8](ref:ax.arith#pos-closed)에 따라 양수끼리의 곱 $(-1)(-1)$도 양수인데, [명제 2](ref:minus-one-sq)에 따라 $(-1)(-1) = 1$이다. 그러면 1과 $-1$이 모두 양수가 되어, "셋 가운데 꼭 하나"라는 [공리 7](ref:ax.arith#positive)에 어긋난다. ∴ 1은 양수다.

그러므로 [공리 8](ref:ax.arith#pos-closed)에 따라 $2 = 1 + 1$도 양수이고, [공리 7](ref:ax.arith#positive)에 따라 양수는 0이 아니다. 또 $-(-1) = 1$이 양수이므로 음수의 뜻에 따라 $-1$은 음수이고, 마찬가지로 0이 아니다. 같은 방법으로 $3 = 2 + 1$, $4 = 3 + 1$, …도 모두 양수다.`,
};

export default node;
