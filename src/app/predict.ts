// 예측 관문의 화면. 학습자가 먼저 예측을 확정하고, 그다음에 정답과 "그 답을 골랐다면 무엇을 착각했는가"를 본다.
//  live:   아직 예측하지 않은 관문 → 예측을 받는다
//  review: 펼쳐 보기 모드 → 예측을 받지 않고, 정답을 접어 둔 채 보여 준다(원하면 그 자리에서 예측해 볼 수 있다)
import type { ParsedPredict } from '../verify/verify';
import type { Predict } from '../content/schema';
import { renderBlocks, renderInlines, type RenderCtx } from './render';
import { progress, type PredictRecord } from './state';
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, type Mat } from '../la/mat';
import { norm, type Vec } from '../la/vec';
import { eig2 } from '../la/eig';
import { svd2 } from '../la/svd';
import { fmt } from '../ui/widgets';

type PointDef = Extract<Predict, { kind: 'point' }>;

/** 직선 두 개(방향의 부호는 무시) 사이의 각, 도 */
function lineAngle(a: Vec, b: Vec): number {
  const c = Math.abs(a[0] * b[0] + a[1] * b[1]) / (norm(a) * norm(b));
  return (Math.acos(Math.min(1, c)) * 180) / Math.PI;
}

/** 그림 예측의 정답과 채점. 정답은 모두 src/la 로 계산한다. */
export function gradePoint(d: PointDef, v: Vec): { ok: boolean; msg: string; truth: Vec[] } {
  const A = d.A as Mat;
  if (d.target === 'Ax') {
    const t = matVec(A, d.x!);
    const err = norm([v[0] - t[0], v[1] - t[1]]);
    const tol = d.tol ?? 0.3;
    return { ok: err <= tol, msg: `정답 (${fmt(t[0])}, ${fmt(t[1])}) · 내 예측 (${fmt(v[0])}, ${fmt(v[1])}) · 거리 ${fmt(err, 2)}`, truth: [t] };
  }
  const truth = d.target === 'eig' ? (() => { const e = eig2(A); return e.kind === 'real' ? e.vectors : []; })() : [col(svd2(A).V, 0)];
  const err = Math.min(...truth.map((t) => lineAngle(t, v)));
  const tol = d.tol ?? 8;
  return { ok: err <= tol, msg: `가장 가까운 정답 방향과 ${fmt(err, 1)}° 차이`, truth };
}

export function renderGate(pp: ParsedPredict, node: string, index: number, review: boolean, ctx: RenderCtx, onResolve: () => void): HTMLElement {
  const card = document.createElement('section');
  card.className = 'gate';
  let cleanup: (() => void) | null = null;
  ctx.cleanups.push(() => cleanup?.());

  const draw = (forceLive = false) => {
    cleanup?.();
    cleanup = null;
    card.innerHTML = '';
    const rec = progress.predict(node, pp.def.id);
    const head = document.createElement('div');
    head.className = 'gate-head';
    head.innerHTML = `<span class="gate-badge">예측 ${index + 1}</span>`;
    const q = document.createElement('div');
    q.className = 'gate-q';
    q.appendChild(renderInlines(pp.q));
    card.append(head, q);
    card.classList.toggle('resolved', !!rec);
    if (rec) return resolved(rec);
    if (review && !forceLive) return reviewView();
    live();
  };

  // ── 예측 받기 ──
  const live = () => {
    const d = pp.def;
    let hintsOpen = 0;
    const commit = (r: PredictRecord) => {
      r.hints = hintsOpen;
      progress.setPredict(node, d.id, r);
      draw();
      onResolve();
    };
    const skip = document.createElement('button');
    skip.className = 'gate-skip';
    skip.textContent = '예측 없이 보기';
    skip.title = '건너뛴 것도 기록에 남습니다';
    skip.onclick = () => commit({ v: null, ok: null, skipped: true });
    // 힌트: 한 단계씩 연다. 연 개수는 확정할 때 함께 기록한다.
    const hintBox = document.createElement('div');
    hintBox.className = 'gate-hints';
    if (pp.hints.length) {
      const btn = document.createElement('button');
      btn.className = 'gate-hint-btn';
      const label = () => (btn.textContent = `힌트 보기 (${hintsOpen + 1}/${pp.hints.length})`);
      label();
      btn.onclick = () => {
        const h = document.createElement('div');
        h.className = 'gate-hint-box';
        h.innerHTML = `<span class="gate-hint-n">힌트 ${hintsOpen + 1}</span>`;
        h.appendChild(renderBlocks(pp.hints[hintsOpen], ctx));
        hintBox.insertBefore(h, btn);
        hintsOpen++;
        if (hintsOpen >= pp.hints.length) btn.remove();
        else label();
      };
      hintBox.appendChild(btn);
      card.appendChild(hintBox);
    }
    if (d.kind === 'choice') {
      const opts = document.createElement('div');
      opts.className = 'gate-opts';
      pp.choices.forEach((ch, k) => {
        const b = document.createElement('button');
        b.className = 'check-opt';
        b.appendChild(renderInlines(ch));
        b.onclick = () => commit({ v: k, ok: k === d.answer, skipped: false });
        opts.appendChild(b);
      });
      const hint = document.createElement('div');
      hint.className = 'gate-hint';
      hint.textContent = '고르면 바로 확정됩니다. 확정하기 전에 이유를 한 문장으로 떠올려 보세요.';
      card.append(opts, hint, skip);
    } else {
      let v: Vec = d.target === 'Ax' ? [0.5, -0.5] : [Math.cos(0.3) * 1.6, Math.sin(0.3) * 1.6];
      const host = document.createElement('div');
      host.className = 'gate-plane';
      card.appendChild(host);
      const p = pointPlane(host, d, () => v, (nv) => (v = nv), null);
      cleanup = () => p.destroy();
      const ok = document.createElement('button');
      ok.className = 'btn primary';
      ok.textContent = '확정';
      ok.onclick = () => {
        const g = gradePoint(d, v);
        commit({ v, ok: g.ok, skipped: false });
      };
      const row = document.createElement('div');
      row.className = 'btn-row';
      row.append(ok, skip);
      card.appendChild(row);
    }
  };

  // ── 확정된 뒤 ──
  const resolved = (rec: PredictRecord) => {
    const d = pp.def;
    const verdict = document.createElement('div');
    verdict.className = 'gate-verdict';
    if (rec.skipped) verdict.innerHTML = '<span class="dim">예측 없이 넘어갔습니다.</span>';
    else verdict.innerHTML = rec.ok ? '<span class="verdict ok">예측이 맞았습니다</span>' : '<span class="verdict bad">예측과 다릅니다</span> <span class="dim">— 틀린 예측이 가장 많은 것을 알려 줍니다.</span>';
    if (rec.hints) verdict.innerHTML += ` <span class="gate-hint-used">힌트 ${rec.hints}개를 보고 예측함</span>`;
    card.appendChild(verdict);
    if (d.kind === 'choice') {
      const opts = document.createElement('div');
      opts.className = 'gate-opts';
      pp.choices.forEach((ch, k) => {
        const b = document.createElement('div');
        b.className = `check-opt ${k === d.answer ? 'right' : ''} ${k === rec.v && k !== d.answer ? 'wrong' : ''}`;
        b.appendChild(renderInlines(ch));
        opts.appendChild(b);
      });
      card.appendChild(opts);
      const chosen = typeof rec.v === 'number' ? pp.why[rec.v] : null;
      if (chosen && rec.v !== d.answer) {
        const w = document.createElement('div');
        w.className = 'gate-why';
        w.appendChild(renderBlocks(chosen, ctx));
        card.appendChild(w);
      }
      const right = pp.why[d.answer];
      if (right) {
        const w = document.createElement('div');
        w.className = 'gate-why right';
        w.appendChild(renderBlocks(right, ctx));
        card.appendChild(w);
      }
    } else {
      const host = document.createElement('div');
      host.className = 'gate-plane';
      card.appendChild(host);
      const v = (rec.v as number[] | null) ?? null;
      const p = pointPlane(host, d, () => v ?? [0, 0], () => {}, { mine: v });
      cleanup = () => p.destroy();
      const m = document.createElement('div');
      m.className = 'gate-hint';
      m.textContent = v ? gradePoint(d, v).msg : '정답을 초록으로 표시했습니다.';
      card.appendChild(m);
    }
    if (pp.reveal) {
      const r = document.createElement('div');
      r.className = 'gate-reveal';
      r.appendChild(renderBlocks(pp.reveal, ctx));
      card.appendChild(r);
    }
    const again = document.createElement('button');
    again.className = 'gate-skip';
    again.textContent = '이 예측 다시 하기';
    again.onclick = () => {
      progress.clearPredict(node, d.id);
      draw(true);
    };
    card.appendChild(again);
  };

  // ── 펼쳐 보기 ──
  const reviewView = () => {
    const det = document.createElement('details');
    det.className = 'gate-review';
    det.innerHTML = '<summary>정답 보기</summary>';
    const d = pp.def;
    if (d.kind === 'choice') {
      const a = document.createElement('div');
      a.className = 'check-opt right';
      a.appendChild(renderInlines(pp.choices[d.answer]));
      det.appendChild(a);
      if (pp.why[d.answer]) det.appendChild(renderBlocks(pp.why[d.answer]!, ctx));
    } else {
      const host = document.createElement('div');
      host.className = 'gate-plane';
      det.appendChild(host);
      det.addEventListener('toggle', () => {
        if (det.open && !host.childElementCount) {
          const p = pointPlane(host, d, () => [0, 0], () => {}, { mine: null });
          cleanup = () => p.destroy();
        }
      });
    }
    if (pp.reveal) det.appendChild(renderBlocks(pp.reveal, ctx));
    pp.hints.forEach((h, i) => {
      const box = document.createElement('div');
      box.className = 'gate-hint-box';
      box.innerHTML = `<span class="gate-hint-n">힌트 ${i + 1}</span>`;
      box.appendChild(renderBlocks(h, ctx));
      det.appendChild(box);
    });
    const tryIt = document.createElement('button');
    tryIt.className = 'gate-skip';
    tryIt.textContent = '여기서 예측해 보기';
    tryIt.onclick = () => draw(true);
    card.append(det, tryIt);
  };

  draw();
  return card;
}

/**
 * 그림 예측용 평면. reveal이 null이면 끌어 놓기, 아니면 정답을 겹쳐 그린다.
 *  Ax:   분홍 "?" 점을 끈다
 *  방향: 반지름 1.6 위의 노란 손잡이를 돌린다(직선으로 채점하므로 앞뒤 구별 없음)
 */
function pointPlane(host: HTMLElement, d: PointDef, get: () => Vec, set: (v: Vec) => void, reveal: { mine: number[] | null } | null) {
  const A = d.A as Mat;
  const show = new Set(d.show ?? []);
  const p = new Plane(host, { range: 3.2, height: 320 });
  const isDir = d.target !== 'Ax';
  if (!reveal) {
    p.handles.push({
      key: 'guess',
      get,
      set: (v) => {
        if (isDir) {
          const a = Math.atan2(v[1], v[0]);
          set([1.6 * Math.cos(a), 1.6 * Math.sin(a)]);
        } else set(v);
        p.invalidate();
      },
      snap: isDir ? 0 : 0.5,
    });
  }
  p.draw = (p) => {
    p.grid();
    if (show.has('tgrid')) p.tgrid(A, { color: 'rgba(120,170,255,0.25)' });
    if (show.has('circle') || d.target === 'v1') p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 80, { color: C.dim, width: 1, dash: [3, 4] });
    if (show.has('cols')) {
      const [l1, l2] = d.colLabels ?? ['Ae₁', 'Ae₂'];
      p.arrow([0, 0], col(A, 0), { color: C.c1, label: l1, width: 2 });
      p.arrow([0, 0], col(A, 1), { color: C.c2, label: l2, width: 2 });
    }
    if (show.has('x') && d.x) p.arrow([0, 0], d.x, { color: C.x, label: 'x', width: 2 });
    const mine = reveal ? reveal.mine : get();
    if (mine) {
      if (isDir) {
        p.line([0, 0], mine, { color: C.x, width: 1, dash: [4, 4] });
        p.arrow([0, 0], mine, { color: C.x, label: '내 예측' });
      } else p.dot(mine, { color: C.y, r: 6 }), p.text(mine, reveal ? '내 예측' : '?', { color: C.y, dx: 10, dy: -10 });
    }
    if (reveal) {
      const g = gradePoint(d, mine ?? [1, 0]);
      for (const t of g.truth) {
        if (isDir) p.line([0, 0], t, { color: C.ok, width: 2 });
        else p.arrow([0, 0], t, { color: C.ok, label: '정답 Ax' });
      }
      if (d.target === 'v1') p.curve((t) => matVec(A, [Math.cos(t), Math.sin(t)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 1.5 });
      if (d.target === 'Ax' && !show.has('tgrid')) p.tgrid(A, { color: 'rgba(95,211,141,0.18)' });
    }
    p.hud([{ text: reveal ? '초록 = 정답' : isDir ? '노란 손잡이를 돌려 방향을 맞추세요' : '분홍 점을 끌어 놓으세요' }], 'bl');
  };
  return p;
}
