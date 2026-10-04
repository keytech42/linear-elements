import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.vector-add',
  kind: 'def',
  title: '벡터 덧셈: 이어 붙이기',
  status: 'written',
  introduces: {
    terms: [{ id: 't.vector-add', ko: '벡터 덧셈', en: 'vector addition', gloss: '두 이동을 차례로 하는 것과 같은 이동 하나.' }],
    symbols: [
      { tex: String.raw`\mathbf{u}`, meaning: '이름 없는 벡터(둘째)', note: '굵은+첨자 𝐮ᵢ는 왼쪽 특이벡터(9장)' },
      { tex: String.raw`\mathbf{w}`, meaning: '이름 없는 벡터(셋째)' },
    ],
  },
  requires: ['def.vector'],
  predicts: [
    {
      id: 'p-sum',
      kind: 'point',
      q: String.raw`주황 화살표가 $\mathbf{u} = (2, 1)$, 청록 화살표가 $\mathbf{w} = (-3, 1)$이다. 원점에서 $\mathbf{u}$만큼 간 뒤 이어서 $\mathbf{w}$만큼 가면 어디에 도착할까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`$\mathbf{u}$만큼 간 도착점에서 **다시 출발**한다. [벡터는 출발점과 상관없는 이동](n:def.vector)이므로, 청록 화살표를 그 도착점으로 평행하게 옮겨 붙이면 된다.`,
        String.raw`첫 도착점은 $(2, 1)$이다. 거기서 왼쪽으로 3칸, 위로 1칸 움직여라.`,
      ],
      A: [[2, -3], [1, 1]],
      x: [1, 1],
      target: 'Ax',
      show: ['cols'],
      colLabels: ['u', 'w'],
      colColors: ['u', 'w'],
      reveal: String.raw`정답은 $(-1, 2)$다(초록 화살표). $(2, 1)$에서 왼쪽으로 3, 위로 1을 가면 $(-1, 2)$다. $(-3, 1)$ 근처에 놓았다면 둘째 이동을 원점에서 다시 시작한 것이다. 둘째 이동은 **첫째 이동이 끝난 자리에서** 시작한다.`,
    },
    {
      id: 'p-loop',
      kind: 'choice',
      q: String.raw`세 벡터 $(2, 1)$, $(-3, 1)$, $(1, -2)$를 차례로 이어 붙이면, 원점에서 출발해 어디에 도착할까?`,
      hints: [String.raw`앞 관문에서 처음 두 벡터를 이어 붙인 도착점을 이미 구했다. 거기서 셋째 이동을 하라.`],
      choices: [String.raw`원점으로 돌아온다`, String.raw`$(6, 4)$`, String.raw`$(1, -2)$`, String.raw`세 벡터는 차례로 이어 붙일 수 없다`],
      answer: 0,
      why: [
        String.raw`$(-1, 2)$에서 $(1, -2)$만큼 움직이면 $(0, 0)$이다. 세 화살표가 삼각형을 이루며 닫힌다.`,
        String.raw`성분의 부호를 떼고 크기만 더했다. 왼쪽으로 3칸은 오른쪽으로 2칸과 상쇄된다. 이동에서 부호는 방향이다.`,
        String.raw`마지막 화살표만 보았다. 마지막 이동은 원점이 아니라 앞의 두 이동이 끝난 자리 $(-1, 2)$에서 시작한다.`,
        String.raw`이어 붙이기는 몇 번이든 할 수 있다. 앞의 이동이 끝난 자리에서 다음 이동을 시작하면 된다.`,
      ],
    },
  ],
  body: String.raw`두 이동을 차례로 하면, 그 전체는 이동 하나와 같다. 그 이동 하나는 처음 두 이동과 어떻게 이어져 있을까?

앞으로 벡터 여러 개를 함께 다루므로 이름을 더 정해 둔다. $\mathbf{v}$ 말고 이름 없는 벡터가 더 필요하면 $\mathbf{u}$, $\mathbf{w}$를 쓴다. 성분은 앞 노드와 같은 방식으로 $u_1, u_2$, $w_1, w_2$라고 쓴다.

**정의.** 벡터 $\mathbf{u}$만큼 움직인 뒤, 그 도착점에서 다시 벡터 $\mathbf{w}$만큼 움직이는 것을 이동 하나로 본 것을 $\mathbf{u}$와 $\mathbf{w}$의 [벡터 덧셈](def:t.vector-add)이라 하고 $\mathbf{u} + \mathbf{w}$로 쓴다.

그림으로는 이렇게 그린다. $\mathbf{w}$의 화살표를 평행하게 옮겨 꼬리를 $\mathbf{u}$의 머리(화살촉)에 붙인다. 그다음 $\mathbf{u}$의 꼬리에서 $\mathbf{w}$의 머리까지 화살표를 하나 긋는다. 그 화살표가 $\mathbf{u} + \mathbf{w}$다. 화살표를 옮겨 붙여도 되는 이유는 [벡터에 출발점이 들어 있지 않기 때문](why:def.vector)이다.

::predict p-sum

답은 $(-1, 2)$다. 아래 그림의 처음 상태가 바로 이 경우다. 하늘 화살표 $\mathbf{u}$의 끝에 라일락 화살표 $\mathbf{w}$가 붙어 있고, 흰 화살표가 둘을 이어 붙인 결과다.

::scene c1-add {"u": [2, 1], "w": [-3, 1], "parToggle": false}

하늘, 라일락 화살표의 끝을 끌어 보라. 흰 화살표 $\mathbf{u} + \mathbf{w}$는 언제나 "하늘 화살표의 꼬리에서 라일락 화살표의 머리까지"다.

### 예
- $\mathbf{u} = (1, 0)$, $\mathbf{w} = (0, 1)$: 오른쪽으로 1, 이어서 위로 1. 도착점은 $(1, 1)$이므로 $\mathbf{u} + \mathbf{w} = (1, 1)$, 대각선 방향의 이동이다.
- $\mathbf{u} = (3, 2)$, $\mathbf{w} = (-3, -2)$: 갔다가 같은 만큼 되돌아온다. 도착점은 출발점 그 자리이므로 $\mathbf{u} + \mathbf{w}$는 [영벡터](t:t.zero-vector) $\mathbf{0}$이다.
- $\mathbf{u} + \mathbf{0}$: $\mathbf{u}$만큼 간 뒤 움직이지 않는다. 그러므로 $\mathbf{u} + \mathbf{0} = \mathbf{u}$다. 영벡터는 수의 0처럼 더해도 아무것도 바꾸지 않는다.

::predict p-loop

답은 "원점으로 돌아온다"이다. 세 화살표를 이어 붙이면 삼각형이 닫힌다. 일반적으로, 이어 붙인 화살표들이 닫힌 다각형을 이루면 그 합은 영벡터다. 거꾸로 합이 영벡터이면 마지막 화살표의 머리가 첫 화살표의 꼬리로 돌아온다.

> [!참고] 이어 붙인 결과는 출발점과 상관이 없는가?
> 정의에서는 "$\mathbf{u}$만큼 움직인 뒤"라고만 했고 어디서 출발하는지는 말하지 않았다. 출발점을 바꾸면 화살표 두 개가 모두 같은 만큼 평행하게 옮겨지므로, 처음 꼬리와 마지막 머리도 같은 만큼 옮겨진다. 그래서 그 둘을 잇는 이동은 바뀌지 않는다. 다음 노드에서 이 사실을 성분으로 정확히 증명한다.

> [!질문] 순서를 바꿔, $\mathbf{w}$ 다음에 $\mathbf{u}$를 하면?
> 그림에서는 다른 길로 간다. 도착점도 다를까? 다음 노드에서 예측하고 증명한다.`,
  checks: [
    {
      q: String.raw`$\mathbf{w}$를 $\mathbf{u}$의 머리에 이어 붙인 그림에서, $\mathbf{u} + \mathbf{w}$의 화살표는 어디에서 어디까지인가?`,
      choices: [String.raw`$\mathbf{u}$의 꼬리에서 $\mathbf{w}$의 머리까지`, String.raw`$\mathbf{u}$의 머리에서 $\mathbf{w}$의 머리까지`, String.raw`$\mathbf{w}$의 꼬리에서 $\mathbf{u}$의 꼬리까지`, String.raw`$\mathbf{u}$의 머리에서 $\mathbf{w}$의 꼬리까지`],
      answer: 0,
      explain: String.raw`$\mathbf{u} + \mathbf{w}$는 "처음 출발한 곳에서 마지막에 도착한 곳까지"의 이동이다. 처음 출발한 곳은 $\mathbf{u}$의 꼬리, 마지막 도착점은 $\mathbf{w}$의 머리다. 둘째 보기는 $\mathbf{w}$ 하나만의 이동이다. 이어 붙인 그림에서는 $\mathbf{u}$의 머리와 $\mathbf{w}$의 꼬리가 같은 점이므로, 넷째 보기는 길이가 없는 영벡터다.`,
    },
    {
      q: String.raw`$\mathbf{u} + \mathbf{w} = \mathbf{u}$이다. $\mathbf{w}$는 무엇인가?`,
      choices: [String.raw`$\mathbf{0}$`, String.raw`$\mathbf{u}$`, String.raw`$\mathbf{u}$와 반대쪽을 가리키는 벡터`, String.raw`정할 수 없다`],
      answer: 0,
      explain: String.raw`$\mathbf{u}$만큼 간 도착점에서 $\mathbf{w}$만큼 더 움직였는데도 도착점이 $\mathbf{u}$만 했을 때와 같다. 그러므로 $\mathbf{w}$는 움직이지 않는 이동, 곧 영벡터다. 반대쪽을 가리키는 같은 크기의 벡터를 더하면 결과는 $\mathbf{u}$가 아니라 $\mathbf{0}$이다.`,
    },
  ],
};

export default node;
