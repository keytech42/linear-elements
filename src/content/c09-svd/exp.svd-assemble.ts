import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'exp.svd-assemble',
  kind: 'exp',
  title: '세 다이얼로 행렬 조립하기',
  status: 'written',
  requires: ['prop.svd'],
  predicts: [
    {
      id: 'p-thv',
      kind: 'choice',
      q: String.raw`다른 다이얼은 그대로 두고 $\theta_V$(입력 쪽 회전)만 돌리면, 실선 타원은 어떻게 될까?`,
      hints: [
        String.raw`$V^{\mathsf{T}}$는 [길이를 바꾸지 않는다](n:prop.orthogonal-preserves). 그렇다면 단위원을 $V^{\mathsf{T}}$에 넣으면 무엇이 나오는가? 그 결과에 $\Sigma$와 $U$가 하는 일은 $\theta_V$와 상관이 있는가?`,
      ],
      choices: ['꿈쩍하지 않는다. 화살표 끝만 타원 위를 미끄러진다', '타원이 함께 돈다', '타원이 납작해졌다가 다시 펴진다'],
      answer: 0,
      why: [
        String.raw`$V^{\mathsf{T}}$는 단위원을 단위원 자신으로 보낸다. 그래서 그 뒤의 $\Sigma$와 $U$가 받는 "모양"은 늘 같은 원이다. 바뀌는 것은 원 위의 어느 점이 어디로 가는지뿐이다.`,
        String.raw`타원을 돌리는 것은 출력 쪽 회전 $\theta_U$다.`,
        String.raw`늘이는 배율은 $\sigma_1, \sigma_2$만 정한다. 회전은 길이를 바꾸지 않는다.`,
      ],
    },
  ],
  body: String.raw`[특이값 분해](t:t.svd)를 읽을 줄 아는 것과 손으로 조립할 줄 아는 것은 다른 능력이다. 이 노드는 둘째 능력을 기른다.

아래 장면의 점선은 목표 행렬 $A$가 만드는 것이다. 단위원의 상(점선 타원)과 $\mathbf{e}_1, \mathbf{e}_2$의 도착지(점선 화살표)가 그려져 있다. 다이얼 다섯 개로 $U\Sigma V^{\mathsf{T}}$를 조립해 실선을 점선에 정확히 겹쳐 보라.

- $\theta_V$: 입력 쪽 회전 $V$의 각. $V^{\mathsf{T}}$는 이 각만큼 **거꾸로** 돈다.
- $\sigma_1, \sigma_2$: 가로와 세로로 늘이는 배율.
- $\theta_U$: 출력 쪽 회전 $U$의 각.
- 뒤집기: $U$에 반사를 넣는다.

::predict p-thv

::scene c9-svd-assemble {}

### 해 보면 드러나는 것
- **타원의 모양**은 $\sigma_1, \sigma_2$만으로 정해지고, **타원이 놓인 방향**은 $\theta_U$만으로 정해진다. $\theta_V$를 아무리 돌려도 타원은 꿈쩍하지 않는다. 그 이유는 이렇다. $V^{\mathsf{T}}$는 단위원을 단위원으로 보낸다. 바뀌는 것은 원 위의 **어느 점이 어디로 가는지**뿐이다. 그래서 $\theta_V$를 돌리면 점선 화살표와 실선 화살표의 끝이 타원 위를 미끄러진다.
- 그래서 타원만 겹쳤다고 같은 행렬이 아니다. 주황·청록 화살표까지 겹쳐야 같은 변환이다. "같은 모양을 만든다"와 "같은 변환이다"는 다른 말이다.
- 목표의 [행렬식](t:t.determinant)이 음수인데 뒤집기를 끄면, 아무리 돌려도 화살표 순서(주황에서 청록으로 도는 방향)를 맞출 수 없다. [왜?](why:prop.det-sign)

> [!직관] 숙련의 기준
> 행렬 하나를 보고 "대략 몇 도 돌리고, 대략 몇 배와 몇 배로 늘이고, 다시 몇 도 돈다"를 어림할 수 있게 되면 이 장의 목표에 닿은 것이다. 훈련장의 "SVD 어림" 연습이 이 감각을 반복 훈련한다.`,
};

export default node;
