import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.add-componentwise',
  kind: 'prop',
  title: '이어 붙이기 = 성분끼리 더하기',
  status: 'written',
  requires: ['def.vector-add', 'ax.arith'],
  predicts: [
    {
      id: 'p-rule',
      kind: 'choice',
      q: String.raw`그림 없이 숫자만으로 $\mathbf{u} + \mathbf{w}$의 성분을 구하는 식은 무엇일까? 앞 노드의 관문 $(2, 1) + (-3, 1) = (-1, 2)$로 시험해 보라.`,
      hints: [String.raw`$\mathbf{u}$만큼 움직이면 가로로 $u_1$, 세로로 $u_2$만큼 간다. 이어서 $\mathbf{w}$만큼 움직이면 가로로, 세로로 각각 얼마를 더 가는가?`],
      choices: [
        String.raw`$\begin{bmatrix} u_1 + w_1 \\ u_2 + w_2 \end{bmatrix}$`,
        String.raw`$\begin{bmatrix} u_1 + u_2 \\ w_1 + w_2 \end{bmatrix}$`,
        String.raw`$\begin{bmatrix} u_1 w_1 \\ u_2 w_2 \end{bmatrix}$`,
        String.raw`$u_1 + u_2 + w_1 + w_2$ (수 하나)`,
      ],
      answer: 0,
      why: [
        String.raw`가로 이동은 가로 이동끼리, 세로 이동은 세로 이동끼리 쌓인다. $(2 + (-3),\ 1 + 1) = (-1, 2)$로 앞의 답과 맞는다.`,
        String.raw`한 벡터 안의 가로와 세로를 더했다. 시험해 보면 $(2 + 1,\ -3 + 1) = (3, -2)$로 앞의 답 $(-1, 2)$와 다르다. 가로 이동과 세로 이동은 서로 다른 쪽이므로 섞이지 않는다.`,
        String.raw`곱하면 $(2 \cdot (-3),\ 1 \cdot 1) = (-6, 1)$로 앞의 답과 다르다. 이어 붙이기는 이동을 쌓는 것이므로 더하기다.`,
        String.raw`이어 붙인 결과는 여전히 이동, 곧 벡터다. 가로와 세로 두 정보가 남아야 한다.`,
      ],
    },
    {
      id: 'p-order',
      kind: 'choice',
      q: String.raw`$\mathbf{u}$ 다음 $\mathbf{w}$로 가는 길과, $\mathbf{w}$ 다음 $\mathbf{u}$로 가는 길은 그림에서 서로 다른 길이다. 두 길의 도착점은 어떨까?`,
      hints: [
        String.raw`위 명제의 식을 두 순서에 각각 써 보라. $\mathbf{w} + \mathbf{u}$의 첫째 성분은 $w_1 + u_1$이다.`,
        String.raw`[수의 덧셈은 순서를 바꿔도 결과가 같다](n:ax.arith). 이 규칙이 성분마다 쓰일 수 있는가?`,
      ],
      choices: ['언제나 같은 점이다', String.raw`두 벡터가 [평행할](fwd:t.parallel) 때만 같다`, String.raw`다르다. 평행사변형의 서로 다른 두 꼭짓점이다`, '두 화살표의 길이가 같을 때만 같다'],
      answer: 0,
      why: [
        String.raw`두 길은 평행사변형의 두 변을 따라가며, 같은 맞은편 꼭짓점에서 만난다. 아래에서 그림과 계산으로 확인한다.`,
        String.raw`두 벡터가 [평행할](fwd:t.parallel) 때는 두 길이 한 직선 위에 겹치므로 같다는 것이 눈에 잘 보일 뿐이다. 그렇지 않아도 같다.`,
        String.raw`거의 맞는 그림이다. 두 길은 평행사변형의 서로 다른 변을 지나지만, 지나는 꼭짓점이 다를 뿐 **마지막 꼭짓점**은 같다. 아래 그림에서 점선(반대 순서)을 켜 보라.`,
        String.raw`길이는 상관이 없다. 성분마다 덧셈의 순서만 바뀌므로 언제나 같다.`,
      ],
    },
  ],
  body: String.raw`이어 붙인 화살표의 끝을 그림 없이, 숫자만으로 계산할 수 있을까?

::predict p-rule

답은 성분끼리 더하는 식이다.

**명제.** 두 벡터 $\mathbf{u}$, $\mathbf{w}$에 대해
$$\h{sum}{\mathbf{u} + \mathbf{w}} = \begin{bmatrix} u_1 \\ u_2 \end{bmatrix} + \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} \h{h}{\ca{u_1 + w_1}} \\ \h{vv}{\cb{u_2 + w_2}} \end{bmatrix}$$
이다. 곧 [벡터 덧셈](t:t.vector-add)은 **같은 자리의 [성분](t:t.component)끼리 더하는 것**과 같다.

아래 그림은 가로 이동(주황)과 세로 이동(청록)을 바닥과 왼쪽에 따로 이어 그린다. 화살표를 끌어 보면, 주황 막대 두 개의 합이 흰 화살표의 가로 이동이고, 청록 막대 두 개의 합이 세로 이동이다.

::scene c1-add {"u": [2, 1], "w": [-3, 1], "comp": true, "parToggle": false}

### 예
- $(2, 1) + (-3, 1) = (2 - 3,\ 1 + 1) = (-1, 2)$. [앞 노드](n:def.vector-add)에서 그림으로 찾은 답과 같다.
- $(1.5, -2) + (-0.5, 4) = (1.5 - 0.5,\ -2 + 4) = (1, 2)$. 소수 성분도 같은 방식이다. 그림으로 확인하려면 위 그림의 오른쪽 칸에 숫자를 직접 넣어 보라.
- 성분이 세 개여도 같다: $(1, 2, 3) + (4, -2, 0) = (5, 0, 3)$. 높이 이동은 높이 이동끼리 더한다.

::predict p-order

답은 "언제나 같은 점이다". 아래 그림에서 반대 순서(점선)를 켜면, 두 길이 평행사변형의 두 변을 따라가 같은 꼭짓점에서 만나는 것이 보인다.

::scene c1-add {"u": [2, 1], "w": [-1, 2], "par": true}

그림은 확인일 뿐이다. 모든 경우에 성립한다는 것은 계산으로 보인다. 위 명제에 따라 $\mathbf{w} + \mathbf{u}$의 첫째 성분은 $w_1 + u_1$이고, [수의 덧셈은 순서를 바꿔도 같으므로](why:ax.arith) $u_1 + w_1$과 같다. 둘째 성분도 같다. 그러므로
$$\mathbf{u} + \mathbf{w} = \mathbf{w} + \mathbf{u}$$
이다. 벡터 덧셈에서도 [교환법칙](t:t.commutative)이 성립한다. 이 짧은 계산이 보여 주는 요령은 앞으로 계속 쓰인다. **벡터의 규칙을 증명하려면 성분 하나하나에서 수의 규칙을 쓰면 된다.**

> [!코드] 정의가 곧 구현이다
> 아래 "이 노드의 코드"에 있는 \`add\`는 이 명제를 그대로 옮긴 것이다. 같은 자리의 성분끼리 더하고, 성분 개수가 다르면 더하기를 거부한다. 성분이 2개인 벡터와 3개인 벡터는 서로 다른 세계의 이동이기 때문이다.`,
  proof: String.raw`원점 $(0, 0)$이 아닌 아무 점 $(x, y)$에서 출발해도 되도록 일반적으로 증명한다.

1. [점 $(x, y)$에서 $\mathbf{u}$만큼 움직이면](why:def.vector) 점 $(x + u_1,\ y + u_2)$에 도착한다.
2. 그 점에서 다시 $\mathbf{w}$만큼 움직이면 점 $\big((x + u_1) + w_1,\ (y + u_2) + w_2\big)$에 도착한다.
3. [$\mathbf{u} + \mathbf{w}$는 처음 출발점에서 마지막 도착점까지의 이동](why:def.vector-add)이므로, 그 성분은 도착점 − 출발점이다. 첫째 성분은
$$\big((x + u_1) + w_1\big) - x = u_1 + w_1$$
이다. 이 등호에서는 [덧셈의 결합법칙과 교환법칙](why:ax.arith)으로 $x$를 앞으로 모은 뒤 $x - x = 0$을 썼다. 둘째 성분도 같은 계산으로 $u_2 + w_2$다.

결과에 $x$, $y$가 남지 않았다. 그러므로 이어 붙인 이동은 출발점과 상관없이 정해지고, 그 성분은 $(u_1 + w_1,\ u_2 + w_2)$다. 성분이 세 개인 공간의 이동에서도 각 자리에서 같은 계산이 그대로 통한다. 성분이 넷 이상인 벡터에는 이어 붙일 "이동"이 없다. 그래서 그런 벡터의 덧셈은 이 명제의 공식, 곧 같은 자리의 성분끼리 더하는 것을 **정의**로 삼는다. 평면과 공간에서는 그 정의가 이동을 이어 붙이는 것과 같다는 것을 이 명제가 보여 준다.`,
  checks: [
    {
      q: String.raw`$(1, 2, 3) + (4, -2, 0)$은?`,
      choices: [String.raw`$(5, 0, 3)$`, String.raw`$(4, -4, 0)$`, '수 8', String.raw`$(5, 0)$`],
      answer: 0,
      explain: String.raw`같은 자리끼리 더한다: $(1 + 4,\ 2 - 2,\ 3 + 0) = (5, 0, 3)$. $(4, -4, 0)$은 더하지 않고 곱했다. 수 8은 성분을 모두 더해 버린 것으로, 벡터 덧셈의 결과는 벡터여야 한다. 셋째 성분 $3 + 0 = 3$도 그대로 남긴다.`,
    },
    {
      q: String.raw`$\mathbf{u} = (3, -2)$일 때 $\mathbf{u} + \mathbf{w} = \mathbf{0}$이 되는 $\mathbf{w}$는?`,
      choices: [String.raw`$(-3, 2)$`, String.raw`$(3, -2)$`, String.raw`$(-3, -2)$`, String.raw`$(2, 3)$`],
      answer: 0,
      explain: String.raw`성분마다 $3 + w_1 = 0$, $-2 + w_2 = 0$이어야 하므로 $\mathbf{w} = (-3, 2)$다. 그림으로는 $\mathbf{u}$와 크기가 같고 반대쪽을 가리키는 화살표다. $(-3, -2)$는 첫째 성분의 부호만 바꾼 것이다. $(2, 3)$은 $\mathbf{u}$를 직각으로 돌린 화살표로, 더하면 $(5, 1)$이 된다.`,
    },
  ],
  code: ['add'],
};

export default node;
