# 집필 담당자 작업 지시 (에이전트 공통)

이 교재는 독자가 산수만 안다고 가정하고 SVD와 LoRA까지 가는, 상호작용하는 웹 선형대수 교재(한국어)다.
Vite + TypeScript, 프레임워크 없음, Canvas2D 렌더러와 수치 코어를 직접 작성했다.

## 맡은 일
배정받은 장 파일에서 `status: 'stub'`인 노드를 모두 `status: 'written'`으로 완성한다.
- 본문을 완성하고, 모든 `prop`에 증명을 단다.
- 예제를 두 개 이상 넣고, `checks`(점검 문제)를 1~3개 넣는다.
- 장면을 넣는다.
- stub 본문에 적힌 질문에 모두 답한다.

## 형식: 예측 먼저 (어려운 관문 + 힌트)
`docs/STYLE.md` 4-1절(난이도와 힌트 규칙 포함)을 따른다. 관문은 읽은 것을 되풀이시키지 말고 추론 한 걸음 이상을 요구해야 하며, 어려운 관문에는 `hints`(최대 3개, 답을 말하지 않음)를 단다. 기준 예시: `prop.no-real-eigen`의 `p-stretch`(경계를 묻는 관문 + 힌트 2개), `def.eigen`의 `p-sum`(거의 맞는 오답 보기), `prop.sym-ellipse`의 `p-nonsym`(그림형 + 힌트). 노드마다 `predicts`(관문 1~3개)를 정의하고 본문에 `::predict id`로 놓는다. 기준 예시: `def.matrix`, `def.matvec`(2장), `prop.svd-ata`(9장, 그림형 + 선택형).

## 먼저 읽을 것 (필수)
1. `docs/STYLE.md`: 문체 규칙. 엄격하므로 그대로 따른다.
2. `docs/SYMBOLS.md`: 기호 예약표.
3. `src/content/b02-matrix.ts`의 `def.matrix`, `def.matvec`: **기준 완성본**이다. 문체, 밀도, 왜? 칩, 점검 문제 설계를 여기에 맞춘다.
4. `src/content/markup.ts`, `src/content/schema.ts`, `src/verify/verify.ts`
5. 장면과 그리기 도구:
   - `src/scenes/transform-grid.ts`(기준 장면), `src/scenes/_lib/scene.ts`
   - `src/render/plane.ts`, `src/render/space.ts`(3D)
   - `src/ui/widgets.ts`, `src/render/colors.ts`, `src/sync/bus.ts`
6. 수치 코어: `src/la/*.ts`. `solve.ts`에는 rref, rank, nullBasis, colBasis, rowBasis, solve, inverse, eliminationSteps, coords, orthonormalize가 있다.
7. 앞 장들의 뼈대. 다른 사람이 병렬로 쓰고 있지만 id, 용어, 기호는 확정이므로 자유롭게 링크한다.

## 반드시 지킬 것
- **독자가 아는 것**: 독자는 산수와 앞 노드에서 정의한 것만 안다. 독자가 물을 만한 "왜?"마다 그 답이 있는 **앞쪽** 노드로 `[질문?](why:노드id)`를 단다. 답이 뒤쪽에 있으면 `openWhys`에 적는다.
- **엄밀성**:
  - 증명은 앞의 공리, 정의, 명제만 쓴다.
  - 규칙을 적기 전에 수치 예 두 개 이상으로 교차 확인한다. `npx tsx -e '…'`로 계산해 보면 된다.
  - 숫자 오류는 0이어야 한다.
  - 증명하지 않고 말만 하는 것은 숨기지 않는다. `openWhys`에 `answeredBy: null`로 적는다.
- **기하가 먼저**: 노드마다 손으로 만질 수 있는 그림을 주고, 행렬을 기하적으로 *읽는* 눈을 기른다.
- **비유**: 개념을 빠짐없이, 넘치지 않게 덮을 때만 쓴다. `> [!비유]` 상자에 쓰고, 비유가 깨지는 지점을 함께 적는다. 맞는 비유가 없으면 쓰지 않는다.
- **id 고정**: 이미 선언된 노드 id, 용어 id, 기호 tex를 바꾸지 않는다. 다른 장이 이것들에 기댄다.
  - 꼭 필요하면 자기 노드에 용어나 기호를 추가할 수 있다. 추가할 때는 SYMBOLS.md와 `npm run verify`로 충돌을 확인한다.
  - 추가한 것은 최종 보고에 적는다.
- **편집해도 되는 파일**:
  - 자기 장 파일
  - 새 장면 파일 `src/scenes/b{장번호}-*.ts`. 파일 이름이 곧 장면 id다.
  - 보조 파일 `src/scenes/_lib/b{장번호}-*.ts`
  - `src/la/`의 **새** 파일(테스트 포함)
  - 그 밖의 기존 파일은 고치지 않는다. 공유 코드에서 버그를 발견하면 자기 파일에서 우회하고 보고한다.
- **장면 규칙**:
  - 화면의 모든 수는 `src/la` 함수로 계산한다.
  - 색은 `C`만 쓴다. 색도 기호다: 주황 = 1열/e₁, 청록 = 2열/e₂, 보라 = 3열/e₃, 노랑 = 입력 x, 분홍 = 출력 Ax.
  - 60fps를 지킨다. 매 프레임 DOM을 새로 만들지 말고 `readout()`을 쓴다.
  - 머리 주석에 매개변수와 동기화 키를 적는다.
  - 정리 함수를 반환한다.
  - DOM 동기화는 읽기 화면이 해 준다. `bus.bindDom`을 부르지 않는다.
- `transform-grid`는 매개변수로 재사용할 수 있다. `square: true`는 단위 정사각형과 넓이, `circle: true`는 단위원의 상을 보여 준다.

## 완료 조건 (직접 돌린다)
- `npm run verify` → error 0. 자기 장에 P008, P007 경고가 없어야 한다. 단, 정직하게 남긴 열린 질문은 예외다.
- `npm run typecheck` → 깨끗함
- `npm test` → 통과
- `npm run e2e` → 관문 흐름 검사 통과
- `npm run sweep` → 모든 노드의 KaTeX·장면 오류 0
- `npx tsx scripts/shot.ts <노드id> [<노드id> …]` → `/tmp/le-shots/*.png`를 Read 도구로 보고 시각적 문제를 고친다. 콘솔 오류도 0이어야 한다.

## 최종 보고 (300단어 이하, 한국어)
다음을 적는다.
- 쓴 것
- 만든 장면
- 추가한 용어와 기호
- 발견한 공유 코드 문제
- 수학적·교육적으로 확신이 없는 부분

## 저자 검토 기록 (2026-10-04 결정)
- 저자가 노드를 검토하면 `npm run review -- mark <노드id>`(장 전체는 `b0` 등)로 그때의 내용 지문을 `src/content/reviews.json`에 남긴다.
- 그 뒤 노드 내용이 바뀌면 검증기가 P026(검토 뒤 바뀜)으로 경고하고, 그 노드 페이지에는 "검토 뒤 고친 노드" 배너가 뜬다. 검토하지 않은 노드에는 "초안" 배너가 뜬다.
- 지문에는 장면 코드가 들어가지 않는다. 장면을 고치면 그 노드를 손으로 다시 검토 대상으로 돌린다(`unmark`).
- 홈과 그 밖의 페이지의 배너는 `src/main.ts`의 `DRAFT`가 정한다.
