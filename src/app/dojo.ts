// 눈 훈련장: "행렬을 보면 그림이, 그림을 보면 행렬이" 떠오르도록 반복한다.
// 이해(노드를 읽고 설명할 수 있음)와 숙련(빠르고 정확하게 읽음)은 다른 목표다. 이 화면은 숙련 쪽이다.
// 연습마다 선행 노드를 적어 둔다. 잠그지는 않는다(학습자가 스스로 판단한다).
import { Plane } from '../render/plane';
import { C } from '../render/colors';
import { matVec, col, det2, type Mat } from '../la/mat';
import { norm, type Vec } from '../la/vec';
import { svd2 } from '../la/svd';
import { eig2 } from '../la/eig';
import { fmt, el, buttons } from '../ui/widgets';
import { tex } from './render';
import { progress } from './state';
import { NODE_BY_ID } from './data';

interface Drill {
  id: string;
  title: string;
  desc: string;
  req: string;
  mount: (host: HTMLElement, done: (ok: boolean, msg: string) => void) => () => void;
}

const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const randMat = (lo = -2, hi = 2, minDet = 0.5): Mat => {
  let A: Mat;
  do A = [[ri(lo, hi), ri(lo, hi)], [ri(lo, hi), ri(lo, hi)]];
  while (Math.abs(det2(A)) < minDet);
  return A;
};
const texMat = (A: Mat) => `\\begin{bmatrix} ${A.map((r) => r.map((v) => fmt(v)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`.replace(/−/g, '-');
const angDiff = (a: Vec, b: Vec) => {
  // 직선(방향의 부호 무시) 사이의 각, 도
  const c = Math.abs(a[0] * b[0] + a[1] * b[1]) / (norm(a) * norm(b));
  return (Math.acos(Math.min(1, c)) * 180) / Math.PI;
};

const DRILLS: Drill[] = [
  {
    id: 'read-cols',
    title: '열 읽기: 행렬 → 그림',
    desc: '행렬을 보고, e₁과 e₂가 도착할 자리로 두 화살표 끝을 끌어 놓는다.',
    req: 'def.matrix',
    mount(host, done) {
      const A = randMat();
      let g1: Vec = [1, 0], g2: Vec = [0, 1];
      let revealed = false;
      host.innerHTML = `<div class="dojo-q">${tex(`A = ${texMat(A)}`, true)}</div>`;
      const p = new Plane(host, { range: 3.5, height: 360 });
      p.handles.push({ key: 'g1', get: () => g1, set: (v) => ((g1 = v), p.invalidate()), snap: 1 }, { key: 'g2', get: () => g2, set: (v) => ((g2 = v), p.invalidate()), snap: 1 });
      p.draw = (p) => {
        p.grid();
        p.arrow([0, 0], g1, { color: C.c1, label: 'Ae₁?' });
        p.arrow([0, 0], g2, { color: C.c2, label: 'Ae₂?' });
        if (revealed) {
          p.tgrid(A, { color: 'rgba(120,170,255,0.25)' });
          p.arrow([0, 0], col(A, 0), { color: C.ink, dash: [5, 4], width: 1.5 });
          p.arrow([0, 0], col(A, 1), { color: C.ink, dash: [5, 4], width: 1.5 });
        }
      };
      buttons(host, [
        {
          label: '확인',
          on: () => {
            if (revealed) return;
            revealed = true;
            p.invalidate();
            const e = Math.max(norm([g1[0] - A[0][0], g1[1] - A[1][0]]), norm([g2[0] - A[0][1], g2[1] - A[1][1]]));
            done(e < 0.3, e < 0.3 ? '정확합니다. 1열이 e₁의 도착지, 2열이 e₂의 도착지.' : `점선이 정답입니다. 1열 (${fmt(A[0][0])}, ${fmt(A[1][0])}), 2열 (${fmt(A[0][1])}, ${fmt(A[1][1])})을 세로로 읽었는지 확인하세요.`);
          },
        },
      ]);
      return () => p.destroy();
    },
  },
  {
    id: 'read-grid',
    title: '격자 읽기: 그림 → 행렬',
    desc: '변환된 격자만 보고 행렬의 네 성분(정수)을 적는다.',
    req: 'def.matrix',
    mount(host, done) {
      const A = randMat();
      let revealed = false;
      const p = new Plane(host, { range: 3.5, height: 360 });
      p.draw = (p) => {
        p.grid();
        p.tgrid(A);
        p.dot([0, 0], { color: C.ink });
        if (revealed) {
          p.arrow([0, 0], col(A, 0), { color: C.c1, label: 'Ae₁' });
          p.arrow([0, 0], col(A, 1), { color: C.c2, label: 'Ae₂' });
        } else {
          // 어느 선이 e₁의 상인지 알 수 있도록 e₁, e₂의 상의 끝점만 작게 표시
          p.dot(col(A, 0), { color: C.c1, r: 5 });
          p.dot(col(A, 1), { color: C.c2, r: 5 });
        }
      };
      const form = el('div', 'dojo-form');
      form.innerHTML = `<span>A =</span><div class="mat"><div class="mcol" style="color:${C.c1}"><input class="num-in" data-k="00"><input class="num-in" data-k="10"></div><div class="mcol" style="color:${C.c2}"><input class="num-in" data-k="01"><input class="num-in" data-k="11"></div></div><span class="dim">주황 점 = e₁의 도착지, 청록 점 = e₂의 도착지</span>`;
      host.appendChild(form);
      buttons(host, [
        {
          label: '확인',
          on: () => {
            if (revealed) return;
            revealed = true;
            p.invalidate();
            let ok = true;
            form.querySelectorAll<HTMLInputElement>('input').forEach((inp) => {
              const [i, j] = inp.dataset.k!.split('').map(Number);
              const v = parseFloat(inp.value.replace('−', '-'));
              const good = v === A[i][j];
              ok &&= good;
              inp.style.borderColor = good ? C.ok : C.bad;
            });
            done(ok, ok ? '정확합니다.' : `정답 ${tex(texMat(A))}. 점의 좌표를 위에서 아래로 읽어 열에 넣습니다.`);
          },
        },
      ]);
      return () => p.destroy();
    },
  },
  {
    id: 'det-guess',
    title: '행렬식 어림',
    desc: '평행사변형을 보고 넓이 배율과 뒤집힘(부호)을 고른다.',
    req: 'def.det',
    mount(host, done) {
      const A = randMat(-2, 2, 1);
      const d = det2(A);
      const opts = [...new Set([d, -d, d * 2, d / 2, d + (d > 0 ? 1 : -1)])].slice(0, 4).sort(() => Math.random() - 0.5);
      let revealed = false;
      const p = new Plane(host, { range: 3.5, height: 340 });
      p.draw = (p) => {
        p.grid();
        const a1 = col(A, 0), a2 = col(A, 1);
        p.poly([[0, 0], a1, [a1[0] + a2[0], a1[1] + a2[1]], a2], { fill: revealed ? (d > 0 ? C.area : C.areaNeg) : 'rgba(255,255,255,0.08)' });
        p.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { color: C.dim, dash: [3, 3] });
        p.arrow([0, 0], a1, { color: C.c1, label: 'Ae₁' });
        p.arrow([0, 0], a2, { color: C.c2, label: 'Ae₂' });
      };
      const row = el('div', 'btn-row');
      host.appendChild(row);
      for (const o of opts) {
        const b = el('button', 'btn', `det = ${fmt(o)}`);
        b.onclick = () => {
          if (revealed) return;
          revealed = true;
          p.invalidate();
          b.classList.add(o === d ? 'right' : 'wrong');
          done(o === d, o === d ? '정확합니다.' : `정답은 ${fmt(d)}. ${Math.sign(o) !== Math.sign(d) ? '부호를 보세요: 주황에서 청록으로 짧게 도는 쪽이 시계 반대 방향이면 양수입니다.' : '넓이를 단위 정사각형(점선)과 비교해 보세요.'}`);
        };
        row.appendChild(b);
      }
      return () => p.destroy();
    },
  },
  {
    id: 'eigen-guess',
    title: '고유 방향 찾기',
    desc: '변환을 보고, 자기 직선 위에 머무는 방향을 하나 끌어 맞춘다.',
    req: 'def.eigen',
    mount(host, done) {
      let A: Mat, e: ReturnType<typeof eig2>;
      do {
        A = randMat(-2, 3);
        e = eig2(A);
      } while (e.kind !== 'real' || e.vectors.length < 2 || Math.abs(e.values[0] - e.values[1]) < 0.5);
      let g: Vec = [1, 0.3];
      let revealed = false;
      host.innerHTML = `<div class="dojo-q">${tex(`A = ${texMat(A)}`, true)}</div>`;
      const p = new Plane(host, { range: 3.5, height: 360 });
      p.handles.push({ key: 'g', get: () => g, set: (v) => ((g = v), p.invalidate()), snap: 0 });
      p.draw = (p) => {
        p.grid();
        p.tgrid(A, { color: 'rgba(120,170,255,0.22)' });
        p.line([0, 0], g, { color: C.x, width: 1, dash: [4, 4] });
        p.arrow([0, 0], g, { color: C.x, label: 'x' });
        p.arrow([0, 0], matVec(A, g), { color: C.y, label: 'Ax' });
        if (revealed && e.kind === 'real') for (const v of e.vectors) p.line([0, 0], v, { color: C.ok, width: 1.5 });
      };
      buttons(host, [
        {
          label: '확인',
          on: () => {
            if (revealed || e.kind !== 'real') return;
            revealed = true;
            p.invalidate();
            const err = Math.min(...e.vectors.map((v) => angDiff(v, g)));
            done(err < 6, `가장 가까운 고유 방향과 ${fmt(err, 1)}° 차이. 초록 직선이 고유 방향(고윳값 ${e.values.map((v) => fmt(v)).join(', ')}).`);
          },
        },
      ]);
      return () => p.destroy();
    },
  },
  {
    id: 'svd-guess',
    title: 'SVD 어림',
    desc: '행렬을 보고, 단위원 위에서 가장 많이 늘어나는 입력 방향(v₁)을 맞춘다. 타원은 확인한 뒤에 보인다.',
    req: 'prop.svd-ata',
    mount(host, done) {
      const A = randMat(-2, 2, 0.5);
      const r = svd2(A);
      let th = 0;
      let revealed = false;
      host.innerHTML = `<div class="dojo-q">${tex(`A = ${texMat(A)}`, true)}</div>`;
      const p = new Plane(host, { range: 3.5, height: 360 });
      const g = (): Vec => [Math.cos(th), Math.sin(th)];
      p.handles.push({ key: 'g', get: g, set: (v) => ((th = Math.atan2(v[1], v[0])), p.invalidate()), snap: 0 });
      p.draw = (p) => {
        p.grid();
        p.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 80, { color: C.dim, dash: [3, 4], width: 1 });
        p.arrow([0, 0], col(A, 0), { color: C.c1, width: 1.5, alpha: 0.7 });
        p.arrow([0, 0], col(A, 1), { color: C.c2, width: 1.5, alpha: 0.7 });
        p.arrow([0, 0], g(), { color: C.v, label: 'v₁?' });
        if (revealed) {
          p.curve((t) => matVec(A, [Math.cos(t), Math.sin(t)]), 0, 2 * Math.PI, 120, { color: C.ink, width: 2 });
          p.line([0, 0], col(r.V, 0), { color: C.v, width: 1, dash: [6, 4] });
          p.arrow([0, 0], matVec(A, g()), { color: C.y, label: 'Av₁?' });
        }
      };
      buttons(host, [
        {
          label: '확인',
          on: () => {
            if (revealed) return;
            revealed = true;
            p.invalidate();
            const err = angDiff(col(r.V, 0), g());
            const got = norm(matVec(A, g()));
            done(err < 10, `정답 방향과 ${fmt(err, 1)}° 차이. 당신의 방향은 ${fmt(got, 2)}배, 최대는 σ₁ = ${fmt(r.S[0], 2)}배(최소 σ₂ = ${fmt(r.S[1], 2)}). 힌트: 두 열 화살표가 같은 쪽을 향할수록 그 사이 방향이 많이 늘어난다.`);
          },
        },
      ]);
      return () => p.destroy();
    },
  },
];

export function renderDojo(main: HTMLElement, d?: string): () => void {
  const drill = DRILLS.find((x) => x.id === d);
  if (!drill) {
    main.innerHTML = `<section class="dojo"><h1>눈 훈련장</h1>
      <p>노드를 읽고 설명할 수 있게 되는 것(이해)과, 행렬을 보자마자 그림이 떠오르는 것(숙련)은 다른 목표입니다. 여기서는 숙련을 반복 훈련합니다. 연습마다 먼저 읽을 노드를 적어 두었습니다.</p>
      <div class="dojo-list">${DRILLS.map((x) => {
        const s = progress.dojo(x.id);
        return `<a class="dojo-card" href="#/dojo?d=${x.id}"><h3>${x.title}</h3><p>${x.desc}</p><div class="req">선행: ${NODE_BY_ID.get(x.req)?.title ?? x.req}${progress.isDone(x.req) ? ' ✓' : ''} · 시도 ${s.tries} · 최고 연속 ${s.best}</div></a>`;
      }).join('')}</div></section>`;
    return () => {};
  }
  const s = progress.dojo(drill.id);
  main.innerHTML = `<section class="dojo"><div class="kicker"><a href="#/dojo">훈련장</a> · 선행 <a href="#/n/${drill.req}">${NODE_BY_ID.get(drill.req)?.title}</a></div><h1>${drill.title}</h1><p class="dim">${drill.desc}</p>
    <div class="dojo-score"><span>연속 <b class="streak">${s.streak}</b></span><span>최고 <b class="best">${s.best}</b></span><span>시도 <b class="tries">${s.tries}</b></span></div>
    <div class="dojo-stage"></div><div class="dojo-feedback"></div></section>`;
  const stage = main.querySelector<HTMLElement>('.dojo-stage')!;
  const fb = main.querySelector<HTMLElement>('.dojo-feedback')!;
  let clean = () => {};
  const next = () => {
    clean();
    stage.innerHTML = '';
    fb.innerHTML = '';
    clean = drill.mount(stage, (ok, msg) => {
      s.tries++;
      s.streak = ok ? s.streak + 1 : 0;
      s.best = Math.max(s.best, s.streak);
      progress.saveDojo();
      main.querySelector('.streak')!.textContent = String(s.streak);
      main.querySelector('.best')!.textContent = String(s.best);
      main.querySelector('.tries')!.textContent = String(s.tries);
      fb.innerHTML = `<p><span class="verdict ${ok ? 'ok' : 'bad'}">${ok ? '맞음' : '다시 보기'}</span> ${msg}</p>`;
      buttons(fb, [{ label: '다음 문제 →', on: next }]);
    });
  };
  next();
  return () => clean();
}
