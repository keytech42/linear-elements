import type { NodeDef } from '../schema';

const node: NodeDef = {
  id: 'exp.gallery',
  kind: 'exp',
  title: '변환 도감: 회전, 늘이기, 전단, 반사, 사영',
  status: 'written',
  introduces: {
    terms: [
      { id: 't.rotation', ko: '회전', en: 'rotation', everyday: true, gloss: '원점을 중심으로 모든 벡터를 같은 각만큼 돌리는 변환.' },
      { id: 't.shear', ko: '전단', en: 'shear', gloss: '한 축은 그대로 두고 다른 축을 옆으로 미는 변환. 카드 더미를 비스듬히 미는 모양.' },
      { id: 't.reflection', ko: '반사', en: 'reflection', gloss: '원점을 지나는 직선을 거울로 삼아 뒤집는 변환.' },
      { id: 't.projection', ko: '사영', en: 'projection', gloss: '공간을 더 낮은 차원(예: 직선) 위로 납작하게 누르는 변환.' },
    ],
  },
  requires: ['def.matvec', 'def.angle-trig'],
  predicts: [
    {
      id: 'p-mirror',
      kind: 'choice',
      q: String.raw`가로축($x$축)을 거울로 삼는 반사의 행렬은?`,
      hints: [String.raw`$\mathbf{e}_1$은 거울 위에 있다. $\mathbf{e}_2$는 거울에 비치면 어디로 가는가? 두 도착지를 차례로 세로로 적어라.`],
      choices: [String.raw`$\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$`, String.raw`$\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$`],
      answer: 0,
      why: [
        String.raw`$\mathbf{e}_1$은 제자리 $(1, 0)$, $\mathbf{e}_2$는 아래로 뒤집혀 $(0, -1)$이다.`,
        String.raw`그것은 **세로축**을 거울로 삼는 반사다. $\mathbf{e}_1$이 뒤집히고 $\mathbf{e}_2$가 제자리다.`,
        String.raw`그것은 대각선 $y = x$를 거울로 삼는 반사다.`,
        String.raw`그것은 가로축 위로 누르는 사영이다. 반사는 뒤집을 뿐 납작하게 누르지 않는다.`,
      ],
    },
    {
      id: 'p-proj',
      kind: 'point',
      q: String.raw`대각선 $y = x$ 위로 **수직으로** 눌러 내리는 사영은 $\mathbf{e}_1$을 어디로 보낼까? 분홍 점을 끌어 놓아라.`,
      hints: [
        String.raw`$\mathbf{e}_1$의 끝 $(1, 0)$에서 대각선으로 수직인 선을 그어 보라. 그 선이 대각선과 만나는 점이 도착지다.`,
        String.raw`원점, $(1, 0)$, 그리고 그 만나는 점은 직각이등변삼각형을 이룬다(대각선이 가로축과 45°를 이루므로). 만나는 점은 대각선 위에서 $(a, a)$ 꼴이다.`,
      ],
      A: [[0.5, 0.5], [0.5, 0.5]],
      x: [1, 0],
      target: 'Ax',
      show: ['x'],
      reveal: String.raw`정답은 $(0.5, 0.5)$다. 같은 이유로 $\mathbf{e}_2$도 $(0.5, 0.5)$로 간다. 그래서 이 사영의 행렬은 $\begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix}$이고, 두 열이 같다. 두 기저 벡터가 같은 곳으로 가므로 평면 전체가 대각선 하나로 납작해진다.`,
    },
  ],
  body: String.raw`[행렬](t:t.matrix)을 읽는 눈은 많은 예를 볼수록 빨라진다. 이 노드는 평면의 대표적인 선형 변환 다섯 가지를 모은 도감이다. 각각에 대해 같은 질문을 던진다. **$\mathbf{e}_1$과 $\mathbf{e}_2$는 어디로 가는가? 그래서 열은 무엇인가?**

::scene transform-grid {"A": [[1, 0], [0, 1]], "presets": true, "morph": false}

그림 오른쪽의 단추를 누르면 지금 행렬에서 그 변환으로 천천히 바뀐다. 각 변환을 보면서 아래 설명과 맞춰 보라.

### 다섯 가지
- [회전](def:t.rotation): 원점을 중심으로 모든 벡터를 같은 각만큼 돌린다. 30° 회전은 $\mathbf{e}_1$을 단위원 위 30° 자리 $(\cos30°, \sin30°)$로 보낸다([왜 그 좌표인가?](why:def.angle-trig)). 길이와 넓이가 그대로다. 일반 공식은 다음 노드에서 만든다.
- **늘이기**: $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$은 가로로 2배, 세로는 그대로다. 대각선 밖이 0인 행렬은 축 방향으로 따로따로 늘인다.
- [전단](def:t.shear): $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$은 $\mathbf{e}_1$을 제자리에 두고 $\mathbf{e}_2$를 옆으로 민다. 바닥은 그대로이고 위로 갈수록 더 많이 밀린다. 카드 더미를 비스듬히 미는 모양이다. 칸의 모양은 바뀌지만 칸의 밑변과 높이는 그대로다.
- [반사](def:t.reflection): $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$은 대각선 $y = x$를 거울로 삼아 뒤집는다. $\mathbf{e}_1$과 $\mathbf{e}_2$가 자리를 맞바꾼다. 주황에서 청록으로 도는 방향이 시계 반대 방향에서 시계 방향으로 바뀐다. 거울에 비치면 왼손이 오른손이 되는 것과 같다.
- [사영](def:t.projection): $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$은 평면을 가로축 위로 눌러 내린다. $\mathbf{e}_2$가 원점으로 사라지므로 평면 전체가 직선 하나로 납작해진다. 납작해진 것은 되돌릴 수 없다(어디서 왔는지 정보가 사라졌으므로).

::predict p-mirror

::predict p-proj

### 도감에서 읽어 낼 세 가지 질문
행렬을 볼 때마다 아래 세 가지를 물어보는 습관을 들이면, 뒤의 개념들이 차례로 이름을 얻는다.
1. 넓이는 몇 배가 되는가? 뒤집히는가? — 4장의 [행렬식](fwd:t.determinant)
2. 납작해지는가? 그렇다면 몇 차원으로? — 6장의 [랭크](fwd:t.rank)
3. 자기 직선 위에 남는 방향이 있는가? — 8장의 [고유벡터](fwd:t.eigenvector)`,
};

export default node;
