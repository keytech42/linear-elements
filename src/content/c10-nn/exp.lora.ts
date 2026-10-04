import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'exp.lora',
  kind: 'exp',
  title: 'LoRA: 변화량을 랭크 r로 제한하기',
  status: 'written',
  introduces: {
    terms: [{ id: 't.lora', ko: 'LoRA', en: 'Low-Rank Adaptation', gloss: '미리 학습된 W₀는 얼려 두고, 변화량 ΔW를 두 얇은 행렬의 곱 BA(랭크 ≤ r)로만 학습하는 방법.' }],
    symbols: [
      { tex: 'r', meaning: 'LoRA의 랭크' },
      { tex: String.raw`\Delta W`, meaning: '가중치의 변화량' },
      { tex: 'W_0', meaning: '미리 학습된(얼려 둔) 가중치' },
    ],
  },
  requires: ['def.linear-layer', 'prop.eckart-young', 'prop.shape-rule'],
  openWhys: [
    { q: '미세조정에 필요한 변화량 ΔW가 실제로 저랭크라는 가정은 왜 맞는가?', answeredBy: null },
    { q: '이 장면의 경사 하강은 왜 언제나 바닥에 닿는가(나쁜 극소점이 없는가)?', answeredBy: null },
  ],
  predicts: [
    {
      id: 'p-rank',
      kind: 'choice',
      q: String.raw`$B$가 $m \times r$, $A$가 $r \times n$일 때 곱 $BA$의 랭크는 최대 얼마일까?`,
      choices: [String.raw`$r$`, String.raw`$\min(m, n)$`, String.raw`$r(m + n)$`, String.raw`$r^2$`],
      answer: 0,
      why: [
        String.raw`모든 출력이 $B$의 열 $r$개의 선형 결합이다. 그래서 출력이 놓이는 공간의 차원은 $r$을 넘지 못한다.`,
        String.raw`$m \times n$ 행렬 일반의 한계다. 가운데 차원이 $r$로 좁으면 그보다 훨씬 작다.`,
        String.raw`$r(m + n)$은 학습할 숫자의 개수다. 랭크는 숫자의 개수가 아니라 출력이 펼치는 독립 방향의 수다.`,
        String.raw`행렬을 곱한다고 랭크가 늘어나지는 않는다.`,
      ],
    },
    {
      id: 'p-floor',
      kind: 'choice',
      q: String.raw`이상적인 변화량 $\Delta W^*$를 미리 안다고 하자. LoRA로 학습한 $BA$와 $\Delta W^*$ 사이의 거리를, $\Delta W^*$의 SVD에서 앞의 $r$개 '층'만 남긴 것과 $\Delta W^*$ 사이의 거리와 비교하면?`,
      hints: [
        String.raw`$BA$는 어떤 방법으로 찾든 랭크가 $r$ 이하인 행렬이다. [에카르트–영 정리](n:prop.eckart-young)는 그런 행렬 **모두** 가운데 무엇이 가장 가까운지 말한다.`,
      ],
      choices: [String.raw`$BA$ 쪽 거리는 SVD를 자른 쪽보다 작을 수 없다`, 'LoRA는 학습 중에 SVD를 계산하므로 둘은 같다', String.raw`$BA$ 쪽이 더 가까울 수 있다. 데이터로 학습하기 때문이다`],
      answer: 0,
      why: [
        String.raw`$BA$도 랭크 $r$ 이하의 행렬이고, 그런 행렬 가운데 가장 가까운 것이 SVD를 자른 것이다(에카르트–영). 아래 장면에서 직접 확인한다.`,
        String.raw`흔한 오해다. LoRA는 어떤 SVD도 계산하지 않는다. 바로 아래에서 다룬다.`,
        String.raw`어떤 방법으로 찾든 "랭크 $r$ 이하"라는 제약은 같다. 그 제약 안에서의 최선은 이미 정해져 있다.`,
      ],
    },
  ],
  body: String.raw`큰 모델을 새 일에 맞게 다시 학습시키는 것을 미세조정이라 한다. 미리 학습된 가중치 $W_0$($m \times n$)를 $W_0 + \Delta W$로 바꾸는 일이다. 전체 미세조정은 $\Delta W$의 성분 $mn$개를 모두 학습한다. $m = n = 4096$이면 레이어 하나에 1678만 개다. 이것을 훨씬 적은 수로 할 수 있을까?

### LoRA의 한 줄
[LoRA](def:t.lora)는 $W_0$를 얼려 두고, 변화량을 두 얇은 행렬의 곱으로만 허락한다.

$$\Delta W = BA, \qquad B: m \times r, \quad A: r \times n, \quad r \ll \min(m, n)$$

[모양 규칙](why:prop.shape-rule)으로 검산하면 $(m \times r)(r \times n) = m \times n$이다. 학습할 숫자는 $r(m + n)$개다. (원 논문은 가중치를 $d \times k$로 쓰지만, 이 교재의 $m \times n$과 같은 것이다.)

::scene c10-lora-count {}

::predict p-rank

### 기하로 읽기: r개 방향으로 읽고, r개 방향으로 쓴다
$\Delta W\mathbf{x} = B(A\mathbf{x})$를 오른쪽부터 읽는다.
1. $A\mathbf{x}$: $A$의 행 $r$개와 각각 내적한다([행의 관점](why:prop.row-picture)). 입력을 $r$개 방향으로만 **읽어서** 숫자 $r$개로 줄인다.
2. $B(\cdot)$: 그 $r$개 숫자를 계수로 삼아 $B$의 열 $r$개를 섞는다([열의 관점](why:def.matvec)). 출력 공간의 $r$개 방향으로만 **쓴다**.

그래서 $\Delta W$의 출력은 모두 $B$의 열 $r$개가 펼치는 공간 안에 있고, [랭크](t:t.rank)는 $r$ 이하다. 이 구조는 [특이값 분해의 '층'](why:prop.svd-sum) $\sum_i \sigma_i\mathbf{u}_i\mathbf{v}_i^{\mathsf{T}}$와 같은 꼴이다. $BA$도 "$B$의 $k$번째 열 × $A$의 $k$번째 행"이라는 [바깥곱](t:t.outer-product) $r$개의 합이기 때문이다. 다른 점은 둘이다. $B$의 열들과 $A$의 행들은 정규직교일 필요가 없고, 중요한 순서로 줄을 서지도 않는다.

::predict p-floor

### SVD와의 관계: LoRA는 SVD를 계산하지 않는다
가장 흔한 오해부터 바로잡는다. **LoRA는 어떤 행렬의 SVD도 계산하지 않는다.** LoRA가 하는 일은 탐색 범위를 "랭크 $r$ 이하의 행렬"로 좁히는 것뿐이고, 그 안에서 $B$와 $A$는 경사 하강으로 학습된다. SVD가 들어오는 자리는 **한계**를 말할 때다. 만약 이상적인 변화량 $\Delta W^*$를 미리 안다면, 랭크 $r$로 그것에 가장 가까이 갈 수 있는 것은 $\Delta W^*$의 SVD에서 앞의 $r$개 '층'만 남긴 것이다. 그때 남는 오차는 버린 특이값의 제곱의 합이다. [에카르트–영 정리](why:prop.eckart-young)가 이 사실을 보장한다. 어떤 학습 방법도 이 바닥 아래로는 내려갈 수 없다.

아래 장면은 이 한계를 직접 보여 준다. 특이값이 $3, 2, 1.2, 0.6, \dots$인 목표 $T$(8×8)를 정해 두고, $\|BA - T\|_F^2$를 경사 하강으로 줄인다. 손실은 점선(바닥)에 닿고 멈춘다. 뚫고 내려가지 않는다.

::scene c10-lora-fit {"r": 2}

### 장면이 보여 주는 설계 결정 세 가지
- **$B = 0$으로 시작하는 이유.** 처음에 $\Delta W = B A = 0$이어야 미세조정 전의 모델과 정확히 같은 곳에서 출발한다. 그런데 $A$까지 0이면 학습이 시작되지 않는다. 기울기가 $\partial L/\partial B = 2(BA - T)A^{\mathsf{T}}$, $\partial L/\partial A = 2B^{\mathsf{T}}(BA - T)$이므로 둘 다 0이 되기 때문이다. $A$를 작은 무작위 값으로 두면 $\partial L/\partial B = -2TA^{\mathsf{T}} \ne 0$이 되어 $B$부터 움직인다.
- **$B$와 $A$ 각각에는 뜻이 없다.** 아무 $r \times r$ 가역 행렬 $G$에 대해 $BA = (BG)(G^{-1}A)$이다. [결합법칙](why:prop.associative)과 [역행렬의 정의](why:def.inverse)만으로 나온다. "B×2, A÷2" 단추가 $G = 2I$인 경우다. 손실이 그대로다. 그러므로 "$A$의 첫째 행이 무엇을 배웠는가"라는 질문은 답이 하나로 정해지지 않는다. 뜻을 갖는 것은 곱 $BA$, 그리고 그 곱의 SVD뿐이다.
- **추론 비용은 0으로 만들 수 있다.** 학습이 끝나면 $W_0 + BA$를 미리 더해 행렬 하나로 저장할 수 있다. 행렬을 따로 두면 일에 따라 $B, A$만 갈아 끼울 수 있다. 앞의 것은 속도를, 뒤의 것은 유연성을 얻는 선택이다.

### 정직하게 말해 둘 것
- 실제 미세조정에서는 $\Delta W^*$를 모른다. LoRA는 $\|BA - \Delta W^*\|$가 아니라 그 일의 손실(예: 다음 단어 예측)을 줄인다. 위 장면은 "랭크 $r$로 갈 수 있는 한계"를 보이기 위한 단순화다.
- "쓸모 있는 $\Delta W$는 저랭크로 충분하다"는 것은 정리가 아니다. LoRA 논문(Hu 외, 2021)이 실험으로 관찰한 가설이다.
- 장면에서 경사 하강이 바닥에 정확히 닿은 것은 이 문제(제곱 오차로 행렬을 두 인자로 나누는 문제)의 성질이다. 이 교재에서는 증명하지 않는다.

> [!직관] 이 교재 전체를 한 문단으로
> 행렬은 기저의 도착지다(2장). 그 도착지들이 만드는 모양은 회전, 축 방향 늘이기, 회전으로 나뉜다(9장). 늘이기의 배율인 특이값이 빠르게 작아진다면, 앞의 '층' 몇 개만으로 행렬의 거의 전부를 담을 수 있다. LoRA는 미세조정의 변화량이 그런 행렬이라는 가설에 기대어, 처음부터 '층' 몇 개짜리 행렬만 배우기로 한 설계다.`,
  checks: [
    {
      q: 'm = n = 4096, r = 8일 때 LoRA가 학습하는 숫자의 개수와 전체 대비 비율은?',
      choices: ['65,536개, 약 0.39%', '32,768개, 약 0.2%', '16,777,216개, 100%', '8,192개, 약 0.05%'],
      answer: 0,
      explain: String.raw`$r(m + n) = 8 \times 8192 = 65{,}536$이고, $mn = 16{,}777{,}216$이므로 약 0.39%다. 32,768은 $B$나 $A$ 한쪽만 센 것이다.`,
    },
    {
      q: 'LoRA에서 B와 A를 둘 다 0으로 초기화하면?',
      choices: ['두 기울기가 모두 0이라 학습이 시작되지 않는다', '정상적으로 학습된다', 'ΔW가 처음부터 0이 아니게 된다', 'A만 학습된다'],
      answer: 0,
      explain: String.raw`$\partial L/\partial B = 2(BA - T)A^{\mathsf{T}}$에는 $A$가, $\partial L/\partial A = 2B^{\mathsf{T}}(BA - T)$에는 $B$가 곱해져 있다. 둘 다 0이면 두 기울기가 모두 0이다. 그래서 한쪽(B)만 0으로 두어 $\Delta W = 0$에서 출발하면서도, 다른 쪽(A)을 무작위로 두어 학습이 움직이게 한다.`,
    },
  ],
};

export default node;
