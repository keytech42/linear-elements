[English](README.md)

# 선형 원론

독자가 산수만 안다고 가정하고, 특이값 분해(SVD)와 LoRA까지 가는 상호작용 선형대수 교재다.

**사이트:** https://keytech42.github.io/linear-elements/

- **유클리드식 구성**: 모든 명제는 앞의 공리, 정의, 명제에서 증명한다. 본문의 "왜?" 칩은 그 답이 있는 앞쪽 노드를 가리킨다. 증명하지 않고 받아들인 것은 "아직 여기서 답하지 않은 질문"에 그대로 적어 둔다.
- **예측 먼저**: 본문 중간의 관문에서 먼저 예측을 걸어야 노드의 뒷부분이 열린다. 어려운 관문에는 단계별 힌트가 있다.
- **살아 있는 그림**: 행렬, 수식, 그림이 같은 색과 같은 키로 함께 움직인다. 그림의 모든 수는 직접 짠 수치 코어(`src/la`)로 계산한다.
- **교수법 검증기**: 빌드할 때 정의 전에 쓴 용어, 뒤쪽을 가리키는 "왜?", 두 뜻을 가진 이름을 잡아낸다. 앞에서 정의한 용어는 페이지마다 처음 나오는 자리가 링크가 되고, 마우스를 올리면 정의가 뜬다.

## 실행

```sh
npm install
npm run dev        # 개발 서버
npm run build      # 교수법 검증기를 돌린 뒤 dist/에 빌드
```

## 검사

```sh
npm run verify     # 교수법 검증기 (error가 0이어야 한다)
npm test           # 수치 코어와 마크업 파서 테스트
npm run typecheck
npm run e2e        # 관문 동작 (이 컴퓨터의 Chrome 필요)
npm run sweep      # 모든 노드를 열어 오류 확인 (Chrome 필요)
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/content/` | 0~10권 본문(노드 데이터)과 마크업 파서 |
| `src/verify/` | 교수법 검증기, 첫 등장 자동 링크 |
| `src/la/` | 직접 짠 수치 코어(벡터, 행렬, 고윳값, SVD) |
| `src/scenes/` | 노드별 상호작용 장면 |
| `src/render/`, `src/app/` | Canvas 렌더러와 읽기 화면 |
| `docs/` | 집필 지침(STYLE), 기호 예약표(SYMBOLS), 작성 절차(AUTHORING) |

## 배포

`main`에 올라오면 GitHub Actions(`.github/workflows/deploy.yml`)가 테스트, 타입 검사, 빌드를 거쳐 GitHub Pages에 배포한다. 검증기에 error가 하나라도 있으면 배포하지 않는다.

## 라이선스

이 저장소는 조건이 다른 두 부분으로 이루어진다. 정확한 범위는 [LICENSE](LICENSE)에 적었다.

- **소스 코드**: MIT 라이선스.
- **교재 콘텐츠**(`src/content/b*.ts`의 본문, `src/scenes/`의 장면, `docs/`): © 2026 keytech42, 모든 권리 보유.
