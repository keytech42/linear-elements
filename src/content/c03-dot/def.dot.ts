import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'def.dot',
  kind: 'def',
  title: '내적',
  status: 'written',
  introduces: {
    terms: [{ id: 't.dot', ko: '내적', en: 'dot product', gloss: '두 벡터의 같은 자리 성분끼리 곱해서 모두 더한 수. 길이와 각도를 함께 담는다.' }],
    symbols: [{ tex: String.raw`\mathbf{u}\cdot\mathbf{v}`, meaning: '벡터 u와 v의 내적' }],
  },
  requires: ['def.norm'],
  predicts: [
    {
      id: 'p-cross',
      kind: 'choice',
      q: String.raw`$\|\mathbf{u} + \mathbf{w}\|^2$을 성분으로 전개하면, $\|\mathbf{u}\|^2 + \|\mathbf{w}\|^2$에 무엇이 더 붙을까? (2차원)`,
      hints: [
        String.raw`$\mathbf{u} + \mathbf{w}$의 첫째 성분은 $u_1 + w_1$이다. $(u_1 + w_1)^2$을 [전개](n:prop.arith-first)하면?`,
        String.raw`$(u_1 + w_1)^2 + (u_2 + w_2)^2$을 전개해 $u$끼리, $w$끼리, 섞인 것끼리 모아 보라.`,
      ],
      choices: [String.raw`$2(u_1w_1 + u_2w_2)$`, '아무것도 붙지 않는다 (언제나 피타고라스)', String.raw`$2\|\mathbf{u}\|\,\|\mathbf{w}\|$`, String.raw`$u_1w_2 + u_2w_1$`],
      answer: 0,
      why: [
        String.raw`$(u_1 + w_1)^2 + (u_2 + w_2)^2 = (u_1^2 + u_2^2) + (w_1^2 + w_2^2) + 2(u_1w_1 + u_2w_2)$. 가운데의 "섞인 항"이 이 노드의 주인공이다.`,
        String.raw`그것은 $\mathbf{u}$와 $\mathbf{w}$가 수직일 때뿐이다(피타고라스). 일반적으로는 섞인 항이 남는다.`,
        String.raw`두 벡터가 **같은 방향**일 때만 맞는다. 일반적으로는 그보다 작다(다음 노드).`,
        String.raw`첫째와 둘째 성분을 엇갈려 곱했다. 섞인 항은 **같은 자리** 성분끼리의 곱이다.`,
      ],
    },
    {
      id: 'p-zero',
      kind: 'choice',
      q: String.raw`$(2, -1)\cdot(1, 2)$는?`,
      hints: [String.raw`같은 자리끼리 곱한 뒤 **더한다**. 결과는 벡터가 아니라 수 하나다.`],
      choices: ['0', '4', '벡터 (2, −2)', '−4'],
      answer: 0,
      why: [
        String.raw`$2\cdot1 + (-1)\cdot2 = 2 - 2 = 0$. 내적이 0이라는 것의 뜻은 다음다음 노드에서 밝혀진다(그림을 그려 두 화살표가 어떻게 놓였는지 보라).`,
        String.raw`$2 + 2$로 계산했다. 둘째 항의 부호를 놓쳤다.`,
        String.raw`곱하기만 하고 더하지 않았다. 내적은 수 **하나**다.`,
        String.raw`첫째 항의 부호를 놓쳤다.`,
      ],
    },
  ],
  body: String.raw`[노름](t:t.norm)의 제곱 $\|\mathbf{v}\|^2 = v_1^2 + v_2^2$은 "같은 자리 성분끼리 곱해서 더한 것"이다. 이 계산을 서로 **다른** 두 벡터에 하면 무엇이 될까? 그것이 왜 쓸모 있을까?

::predict p-cross

전개해 보면 $\|\mathbf{u} + \mathbf{w}\|^2$은 $\|\mathbf{u}\|^2 + \|\mathbf{w}\|^2$에 섞인 항 $2(u_1w_1 + u_2w_2)$가 더해진 것이다. 섞인 항이 0이면 피타고라스 정리와 같은 꼴이 된다. 이 섞인 항을 정확히 다루기 위해 이름을 붙인다.

**정의.** 두 벡터 $\mathbf{u}$, $\mathbf{v}$의 [내적](def:t.dot)은 같은 자리 성분끼리 곱해서 모두 더한 수다.

$$\mathbf{u}\cdot\mathbf{v} = u_1v_1 + u_2v_2 \quad (\text{성분이 } n\text{개면 } u_1v_1 + \cdots + u_nv_n)$$

이 이름으로 쓰면 $\|\mathbf{v}\|^2 = \mathbf{v}\cdot\mathbf{v}$이고, $\|\mathbf{u} + \mathbf{w}\|^2 = \|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{w} + \|\mathbf{w}\|^2$이다. 내적은 **피타고라스 정리가 틀리는 양**을 재는 수다.

::predict p-zero

### 계산 규칙
아래 규칙은 모두 [수의 계산 규칙](why:ax.arith)을 성분마다 쓰면 나온다.
- 순서를 바꿔도 같다: $\mathbf{u}\cdot\mathbf{v} = \mathbf{v}\cdot\mathbf{u}$.
- 덧셈 위로 나뉜다: $\mathbf{u}\cdot(\mathbf{v} + \mathbf{w}) = \mathbf{u}\cdot\mathbf{v} + \mathbf{u}\cdot\mathbf{w}$.
- 스칼라가 밖으로 나온다: $(c\mathbf{u})\cdot\mathbf{v} = c(\mathbf{u}\cdot\mathbf{v})$.
- 자기 자신과의 내적은 0 이상이고, 0인 것은 영벡터뿐이다: $\mathbf{v}\cdot\mathbf{v} = \|\mathbf{v}\|^2$.

### 두 개의 예
- $(3, 1)\cdot(1, 2) = 3 + 2 = 5$.
- $(1, 2, 2)\cdot(2, 0, -1) = 2 + 0 - 2 = 0$.

::scene c3-dot-shadow {"mode": "dot"}

그림에서 두 벡터를 끌면 내적의 값이 바뀐다. 값이 양수일 때, 0일 때, 음수일 때 두 화살표가 어떻게 놓이는지 보라. 그 이유는 다음 노드에서 증명한다.`,
  checks: [
    {
      q: String.raw`$\mathbf{u}\cdot\mathbf{u} = 9$이고 $\mathbf{w}\cdot\mathbf{w} = 4$, $\mathbf{u}\cdot\mathbf{w} = -3$이다. $\|\mathbf{u} + \mathbf{w}\|^2$은?`,
      choices: ['7', '13', '19', '10'],
      answer: 0,
      explain: String.raw`$\|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{w} + \|\mathbf{w}\|^2 = 9 - 6 + 4 = 7$. 성분을 몰라도 세 내적만으로 계산된다. 13은 섞인 항을 빠뜨린 것, 10은 섞인 항에 2를 곱하지 않은 것이다.`,
    },
  ],
  code: ['dot'],
};

export default node;
