[한국어](README.ko.md)

# Linear Elements (선형 원론)

An interactive linear algebra textbook that assumes the reader knows only arithmetic, and goes all the way to the singular value decomposition (SVD) and LoRA. **The textbook itself is written in Korean.**

**Live site:** https://keytech42.github.io/linear-elements/

- **Built like Euclid's *Elements*.** Every proposition is proved from earlier axioms, definitions, and propositions. Each "why?" chip in the text points to the earlier node that answers it. Anything accepted without proof is listed openly as an unanswered question.
- **Predict first.** Gates in the middle of the text ask you to commit to a prediction before the rest of the node unlocks. Harder gates offer optional step-by-step hints.
- **Live figures.** Matrices, formulas, and figures move together, linked by shared colors and keys. Every number in a figure is computed by a hand-written numeric core (`src/la`).
- **A pedagogical verifier.** A build-time checker rejects terms used before their definition, "why?" links that point forward, and names that carry two meanings. The first mention of each defined term on a page becomes a link with a hover preview.

## Run

```sh
npm install
npm run dev        # development server
npm run build      # runs the verifier, then builds into dist/
```

## Checks

```sh
npm run verify     # pedagogical verifier (must report 0 errors)
npm test           # numeric core and markup parser tests
npm run typecheck
npm run e2e        # gate behavior (needs a local Chrome)
npm run sweep      # opens every node and checks for errors (needs a local Chrome)
```

## Structure

| Path | Contents |
|---|---|
| `src/content/` | Books 0–10 (node data) and the markup parser |
| `src/verify/` | Pedagogical verifier and first-mention term links |
| `src/la/` | Hand-written numeric core (vectors, matrices, eigenvalues, SVD) |
| `src/scenes/` | Interactive scenes for each node |
| `src/render/`, `src/app/` | Canvas renderers and the reading view |
| `docs/` | Writing guide (STYLE), symbol registry (SYMBOLS), authoring steps (AUTHORING) |

## Deployment

On every push to `main`, GitHub Actions (`.github/workflows/deploy.yml`) runs the tests, the type check, and the build, then deploys to GitHub Pages. If the verifier reports any error, nothing is deployed.

## License

This repository has two parts under different terms. See [LICENSE](LICENSE) for the exact scope.

- **Source code**: MIT License.
- **Textbook content** (the book text in `src/content/b*.ts`, the scenes in `src/scenes/`, and `docs/`): © 2026 keytech42, all rights reserved.
