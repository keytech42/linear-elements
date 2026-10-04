# 기호 예약표

교재 전체에서 한 기호는 한 대상만 가리킨다. 아래 표에 없는 기호를 새로 쓰려면 먼저 이 표에 추가한다.
실제 선언은 각 노드의 `introduces.symbols`에서 하고, 검증기(P004)가 중복을 잡는다. 앱의 "기호표" 화면은 선언에서 자동으로 만들어진다.

## 글자 모양으로 구별하는 규칙
표준 교과서 표기를 지키기 위해 같은 글자를 모양으로 구별하는 경우가 있다. 아래 규칙은 교재 전체에서 고정이다.
- **가는 글씨 + 아래 첨자** (v₁, x₂): 벡터의 **성분**(숫자 하나)
- **굵은 글씨, 첨자 없음** (𝐯, 𝐱): 벡터 하나
- **굵은 글씨 + 아래 첨자** (𝐞₁, 𝐚₂, 𝐮ᵢ, 𝐯ᵢ): 이름 붙은 벡터들의 목록 중 하나(표준 기저, 행렬의 열, 특이벡터)
- **가는 글씨, 첨자 없음, x와 y** : 0권의 좌표평면에서 가로·세로 좌표

## 예약표
| 기호 | 가리키는 것 | 처음 나오는 노드 | 비고 |
|---|---|---|---|
| x, y | 좌표평면 위 점의 가로, 세로 좌표 | def.plane | |
| θ | 각 | def.angle-trig | |
| 𝐯 | 이름 없는 벡터 | def.vector | 𝐯ᵢ(굵은+첨자)는 9권의 오른쪽 특이벡터 |
| v₁, v₂ | 벡터 𝐯의 성분 | def.vector | |
| 𝐮, 𝐰 | 이름 없는 벡터(둘째, 셋째) | def.vector-add | 𝐮ᵢ는 9권의 왼쪽 특이벡터 |
| 𝟎 | 영벡터 | def.vector | |
| c | 스칼라 | def.scalar-mul | c₁, c₂: 선형 결합의 계수 |
| span | 생성(span): 벡터들의 선형 결합 전체 | def.span | |
| 𝐞₁, 𝐞₂, 𝐞₃ | 표준 기저 벡터 | def.basis | |
| ℝⁿ | 숫자 n개짜리 벡터 전체 | def.dimension | |
| n, m | 입력 차원(열 개수), 출력 차원(행 개수) | def.shape | |
| T | 변환 | def.transformation | |
| A, B | 이름 없는 행렬 | def.matrix | LoRA의 두 인자도 논문 표기를 따라 B, A |
| a_{ij} | A의 i행 j열 성분 | def.matrix | 2×2 행렬식도 a_{ij}로만 쓴다(ad−bc 표기 금지: c가 스칼라와 겹침) |
| 𝐚ⱼ | A의 j번째 열 | def.matrix | |
| 𝐱 | 변환에 넣는 입력 벡터 | def.matvec | 성분 x₁, x₂ |
| R_θ | 각 θ만큼의 회전 행렬 | prop.rotation-matrix | |
| I | 항등 행렬 | def.identity | |
| ‖𝐯‖ | 길이(노름) | def.norm | |
| 𝐮·𝐯 | 내적 | def.dot | |
| Aᵀ | 전치 | def.transpose | |
| Q | 직교 행렬 | def.orthogonal-matrix | |
| det A | 행렬식 | def.det | |
| A⁻¹ | 역행렬 | def.inverse | |
| 𝐛 | 연립방정식 A𝐱 = 𝐛의 오른쪽 벡터 | def.linear-system | B의 열은 𝐛ⱼ로 쓰지 않는다(B𝐞ⱼ로 쓴다) |
| C(A) | 열공간 | def.column-space | |
| N(A) | 영공간 | def.null-space | |
| rank A | 랭크 | def.rank | 글자 r은 LoRA의 랭크 전용 |
| P | 기저 변환 행렬 | def.change-of-basis | 3D 렌더러의 화면 사영 행렬은 Π |
| λ | 고윳값 | def.eigen | |
| λᵢ | i번째 고윳값(큰 것부터) | prop.char-poly | 9권에서는 AᵀA의 고윳값 |
| tr A | 대각합 | def.trace | |
| D | 대각 행렬(대각화) | prop.diagonalization | |
| S | 대칭 행렬 | def.symmetric | |
| s_{ij} | 대칭 행렬 S의 i행 j열 성분 | def.symmetric | a_{ij}(행렬 A의 성분)와 구별 |
| Λ | 고윳값을 대각에 놓은 행렬 | prop.spectral | |
| 𝐪ᵢ | 대칭 행렬의 i번째 단위 고유벡터(Q의 열) | prop.spectral | 9권 증명에서도 같은 뜻 |
| σᵢ | i번째 특이값 | prop.svd-ata | |
| 𝐯ᵢ, 𝐮ᵢ | 오른쪽/왼쪽 특이벡터 | prop.svd-ata | |
| U, Σ, V | SVD의 세 인자 | prop.svd | |
| k | 저랭크 근사에서 남기는 '층' 수 | prop.eckart-young | |
| A_k | 랭크 k 근사 | prop.eckart-young | |
| W | 신경망 레이어의 가중치 행렬 | def.linear-layer | |
| r | LoRA의 랭크 | exp.lora | |
| ΔW | 가중치의 변화량 | exp.lora | |
| Π | 3D 장면의 화면 사영 행렬(2×3) | (3D 장면 설명) | P와 겹치지 않도록 |
