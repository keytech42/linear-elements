import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'prop.rank-nullity',
  kind: 'prop',
  title: '차원 세기: n = rank A + dim N(A)',
  status: 'written',
  introduces: { terms: [{ id: 't.rank-nullity', ko: '랭크–영공간 차원 정리', en: 'rank–nullity theorem', gloss: '입력 차원 = 살아남는 차원(랭크) + 사라지는 차원(영공간의 차원).' }] },
  requires: ['def.rank', 'def.null-space'],
  predicts: [
    {
      id: 'p-count',
      kind: 'choice',
      q: '3×5 행렬의 랭크가 2이다. 영공간의 차원은?',
      hints: [String.raw`입력 공간은 몇 차원인가? (입력 성분의 수 = 열의 수) 그 방향들은 "살아남는 것"과 "사라지는 것"으로 나뉜다.`],
      choices: ['3', '1', '2', '0'],
      answer: 0,
      why: [
        String.raw`입력 차원 5 = 랭크 2 + 영공간 3.`,
        String.raw`출력 차원(행의 수 3)에서 뺐다. 이 정리는 **입력** 차원을 나눈다.`,
        String.raw`랭크와 영공간의 차원이 같을 이유는 없다.`,
        String.raw`열이 5개인데 독립인 방향은 2개뿐이므로, 사라지는 방향이 반드시 있다.`,
      ],
    },
    {
      id: 'p-geom',
      kind: 'choice',
      q: '랭크가 1인 3×3 행렬은 입력 공간을 어떻게 다룰까?',
      hints: [String.raw`입력 차원 3 = 랭크 1 + 영공간의 차원. 영공간은 몇 차원이고, 3차원 공간 안의 그런 부분공간은 무슨 모양인가?`],
      choices: ['평면 하나(영공간)를 통째로 지우고, 나머지 한 방향만 직선 위로 살린다', '직선 하나를 지우고 평면을 살린다', '아무것도 지우지 않는다', '공간 전체를 지운다'],
      answer: 0,
      why: [
        String.raw`영공간의 차원은 $3 - 1 = 2$, 곧 평면이다. 그 평면 위의 입력은 모두 원점으로 간다. 출력은 직선 하나(열공간) 위에 모인다.`,
        String.raw`그것은 랭크 2일 때다.`,
        String.raw`랭크가 3보다 작으면 무언가 지워진다.`,
        String.raw`그것은 랭크 0(영행렬)일 때다.`,
      ],
    },
  ],
  openWhys: [{ q: '소거의 피벗 열들이 열공간의 기저가 된다는 것(그래서 랭크 = 피벗의 개수)의 완전한 증명은?', answeredBy: null }],
  body: String.raw`입력 공간의 방향들은 [변환](t:t.transformation)을 지나면서 살아남거나 사라진다. 살아남는 것과 사라지는 것의 개수 사이에 정확한 관계가 있을까?

::predict p-count

**명제([랭크–영공간 차원 정리](def:t.rank-nullity)).** $A$가 $m \times n$ 행렬이면

$$n = \operatorname{rank}A + \dim N(A)$$

이다. 입력 차원 = 살아남는 차원 + 사라지는 차원.

::scene c6-space {"mode": "both"}

랭크 단추를 바꿔 가며 읽기 칸의 차원 세기를 보라. 랭크가 하나 줄 때마다 영공간이 하나 커진다.

::predict p-geom

### 두 개의 예
- $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$: 입력 2차원 = 랭크 1(직선) + 영공간 1(직선).
- $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}$: 입력 3차원 = 랭크 2(평면 전체가 출력) + 영공간 1(직선 $(-2, 1, 1)$ 방향).

> [!코드] 세는 방법은 소거다
> \`rank\`와 \`nullBasis\`는 [가우스 소거](t:t.elimination)로 계단 모양을 만든 뒤 피벗(계단의 첫 0 아닌 수)이 있는 열과 없는 열을 센다. 테스트는 여러 행렬에서 $\operatorname{rank} + \dim N = n$을 확인한다.`,
  proof: String.raw`[가우스 소거](why:prop.elimination)로 $A$를 계단 모양 $R$로 바꾼다. 행 연산은 [해를 바꾸지 않으므로](why:prop.elimination) $A\mathbf{x} = \mathbf{0}$과 $R\mathbf{x} = \mathbf{0}$은 같은 해, 곧 같은 영공간을 가진다. $R$의 열 $n$개는 피벗이 있는 열(피벗 열)과 없는 열(자유 열)로 나뉜다. 그 개수를 각각 $p$, $f$라 하면 $p + f = n$이다.

**영공간의 차원 = f.** 자유 열의 변수는 아무 값이나 고를 수 있고, 그 값을 정하면 피벗 열의 변수는 계단을 거슬러 올라가며 하나로 정해진다. 자유 변수 하나만 1, 나머지 자유 변수는 0으로 둔 해를 자유 열마다 하나씩 만들면, 이 $f$개의 해는 독립이고(각각 자기 자유 자리에만 1이 있으므로) 모든 해가 그 선형 결합이다. 그러므로 $\dim N(A) = f$다.

**랭크 = p.** 피벗 열에 해당하는 $A$의 원래 열들이 열공간의 기저가 된다는 것은 이렇게 본다. 자유 열은 위의 해에 따라 피벗 열들의 선형 결합으로 적히므로 새 방향을 보태지 않는다. 그리고 피벗 열들끼리는, 자유 변수를 모두 0으로 두면 $A\mathbf{x} = \mathbf{0}$의 해가 $\mathbf{0}$뿐이므로 독립이다. 그러므로 $\operatorname{rank}A = p$다. (이 문단은 개요다. 완전한 증명은 아래 열린 질문에 남긴다.)

따라서 $n = p + f = \operatorname{rank}A + \dim N(A)$다.`,
  code: ['rref', 'rank', 'nullBasis'],
};

export default node;
