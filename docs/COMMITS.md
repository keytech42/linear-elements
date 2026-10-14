# 커밋 메시지 (2026-10-14 결정)

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따른다. 태그(type)는 **소문자**로 쓴다.

```
<태그>(<범위>): <요약>

<본문: 무엇을, 왜. 필요하면 "- " 목록>
```

- 요약은 영어 명령형으로, 첫 글자는 소문자, 끝에 마침표를 찍지 않는다. 예: `feat(review): show diffs by section and sentence`
- 범위는 선택이고, 소문자로 쓴다. 원고는 장 id(`c0` … `c10`), 코드는 영역 이름(`reader`, `nav`, `verify`, `markup`, `review`, `scenes`, `e2e`).
- 커밋 하나에는 태그 하나. 성격이 다른 변경은 커밋을 나눈다. 특히 기능(코드)과 원고, 그리고 검토 기록은 섞지 않는다.
- 나눈 커밋도 하나하나 검사(`npm run verify`, `npm test`, `npm run typecheck`)가 통과해야 한다. 새 검증 규칙이 기존 원고를 잡으면, 그 수정은 규칙과 같은 커밋에 넣는다.

## 태그 목록

| 태그 | 쓰는 곳 | 예 |
|---|---|---|
| `feat` | 새 기능: 화면, 마크업 문법, 검증 규칙, 도구의 새 명령. 그 기능의 문서(STYLE의 규칙, AUTHORING의 사용법)도 함께 넣는다 | `feat(nav): add ahead links to where a later node proves it` |
| `fix` | 코드의 잘못을 고친다 | `fix(reader): keep proof headings clear of the sticky bar` |
| `refactor` | 동작을 바꾸지 않는 코드 정리 | `refactor(reader): route every cross-node link through nav.ts` |
| `perf` | 동작은 같고 더 빠르게 | |
| `test` | 테스트만 더하거나 고친다 | `test(e2e): cover shortcut landings` |
| `content` | 교재 원고: `src/content/c*/`의 노드 파일과 `src/scenes/`의 장면 | `content(c0): mark reversed uses of equalities` |
| `review` | 저자 검토 기록 `src/content/reviews.json`만. 요약에 노드와 기준 커밋을 적는다 | `review: ax.arith, prop.arith-first (stamped on 63ec797)` |
| `audit` | 감사 기록 `docs/audit/`과 그 지적을 받아 고친 기록 | `audit(c2): record findings` |
| `docs` | 기능 하나에 딸리지 않은 문서: `docs/STYLE.md`, `docs/AUTHORING.md`, `docs/SYMBOLS.md`, README, 이 파일 | `docs: add commit message conventions` |
| `build` | 빌드·배포 설정: `vite.config.ts`, `package.json`의 의존성, `.github/` | `build: skip .claude/ worktrees in vitest` |
| `chore` | 그 밖의 잡일: `.gitignore`, 코드 서식만 맞추기 | |
| `revert` | 앞 커밋을 되돌린다. 요약에 되돌린 커밋을 적는다 | `revert: content(c0): …` |

`style` 태그는 쓰지 않는다. 이 저장소에서 "style"은 글쓰기 규칙(`docs/STYLE.md`)을 가리키므로, 코드 서식 정리와 헷갈리지 않게 서식 정리는 `chore`로 적는다.

2026-10-14 이전의 커밋은 이 형식이 아니다(대문자로 시작하는 영어 요약, `Review:`).
