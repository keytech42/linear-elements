// 좌표평면: 수 두 개로 위치 하나 (def.plane)
//
// 흰 점 P를 끌면, P에서 두 축으로 수직으로 내린 점선과 함께 가로 좌표 x(주황, 가로축 위)와 세로 좌표 y(청록, 세로축 위)가 읽힌다.
//
// 매개변수
//   P:    처음 점 (기본 [2, 3])
//   swap: 두 좌표의 순서를 바꾼 점 Q = (y, x)와 대각선 y = x를 함께 그릴지 (기본 false)
//   move: 이동 (Δx, Δy)를 화살표로 그릴지, 그린다면 처음 값 (예: [3, −4]). 생략하면 숨김
//         move가 있으면 "가로 이동만 / 세로 이동만 / 둘 다 이어서" 단추가 생긴다. 이동을 가로 몫과 세로 몫으로 나눠
//         걸어 보여 주어, 한쪽 이동이 다른 쪽 좌표를 건드리지 않음을 눈으로 확인하게 한다. 처음 화면은 화살표 하나.
// 동기화 키: P, x (가로 좌표), y (세로 좌표), Q (순서를 바꾼 점), move (이동), diag (대각선), dx (가로 이동), dy (세로 이동)
import type { SceneFn } from "./_lib/scene";
import { layout, readout, hint } from "./_lib/scene";
import { Plane } from "../render/plane";
import { C } from "../render/colors";
import { axisLabels } from "./_lib/c0-kit";
import { chain, displacement } from "../la/ground";
import { fmt, chip, toggle, buttons, animate } from "../ui/widgets";
import type { Vec } from "../la/vec";

const scene: SceneFn = (host, { bus, params }) => {
  let P: Vec = params.P ?? [2, 3];
  let swap: boolean = params.swap ?? false;
  let d: Vec | null = params.move ?? null;
  const { stage, panel } = layout(host);
  const p = new Plane(stage, { range: 5, bus, height: 380 });
  const to = (): Vec => [chain(P[0], [d![0]]), chain(P[1], [d![1]])];

  // 이동을 가로 몫과 세로 몫으로 나눠 걸어 보는 상태. ax, ay는 각 몫을 얼마나 적용했는가(0 = 아직, 1 = 전부).
  let split = false;
  let ax = 0;
  let ay = 0;
  let stop: (() => void) | null = null;
  const cur = (): Vec => [P[0] + ax * d![0], P[1] + ay * d![1]];

  p.handles.push({
    key: "P",
    get: () => P,
    set: (v) => ((P = v), sync()),
    snap: 1,
  });
  if (d)
    p.handles.push({
      key: "move",
      get: to,
      set: (v) => (
        (d = [displacement(P[0], v[0]), displacement(P[1], v[1])]),
        sync()
      ),
      snap: 1,
    });

  const drops = (Q: Vec, cx: string, cy: string, alpha = 1, keyed = true) => {
    p.seg(Q, [Q[0], 0], { color: C.dim, width: 1, dash: [4, 4], alpha });
    p.seg(Q, [0, Q[1]], { color: C.dim, width: 1, dash: [4, 4], alpha });
    p.seg([0, 0], [Q[0], 0], {
      color: cx,
      width: 4,
      alpha,
      ...(keyed ? { key: "x" } : {}),
    });
    p.seg([0, 0], [0, Q[1]], {
      color: cy,
      width: 4,
      alpha,
      ...(keyed ? { key: "y" } : {}),
    });
  };

  let splitHud: { text: string; color: string }[] = [];
  p.draw = (p) => {
    splitHud = [];
    p.grid();
    axisLabels(p);
    p.text([p.bounds.x1, 0], "x", {
      color: C.ink,
      dx: -14,
      dy: -12,
      bold: true,
    });
    p.text([0, p.bounds.y1], "y", { color: C.ink, dx: 10, dy: 14, bold: true });
    if (swap) {
      p.line([0, 0], [1, 1], {
        color: C.dim,
        width: 1,
        dash: [6, 5],
        key: "diag",
      });
      const Q: Vec = [P[1], P[0]];
      p.seg(Q, [Q[0], 0], { color: C.dim, width: 1, dash: [2, 4] });
      p.seg(Q, [0, Q[1]], { color: C.dim, width: 1, dash: [2, 4] });
      p.dot(Q, { color: C.u, r: 6, key: "Q" });
      p.text(Q, `Q (${fmt(Q[0])}, ${fmt(Q[1])})`, {
        color: C.u,
        dx: 10,
        dy: 14,
      });
    }
    // 나눠 보는 중이면 좌표 막대와 점선은 지금 점을 따른다. 가로 이동만 했다면 세로 막대는 처음 그대로 남는다.
    const at: Vec = split ? cur() : P;
    if (!split) {
      drops(P, C.c1, C.c2);
      p.text([P[0] / 2, 0], `x = ${fmt(P[0])}`, {
        color: C.c1,
        dy: P[1] >= 0 ? 26 : -26,
        align: "center",
      });
      p.text([0, P[1] / 2], `y = ${fmt(P[1])}`, {
        color: C.c2,
        dx: P[0] >= 0 ? -30 : 30,
        align: P[0] >= 0 ? "right" : "left",
      });
    } else {
      // 나눠 볼 때는 출발 자리 P를 기준으로 삼는다. 출발 좌표의 막대는 흐리게 남기고, 움직인 몫은 출발 좌표에서 시작해
      // 지금 좌표까지 진하게 그린다(원점에서 다시 그리지 않으므로 "얼마가 바뀌었는가"가 출발과 견주어 보인다).
      drops(P, C.c1, C.c2, 0.35, false);
      p.seg(at, [at[0], 0], { color: C.dim, width: 1, dash: [4, 4] });
      p.seg(at, [0, at[1]], { color: C.dim, width: 1, dash: [4, 4] });
      if (ax > 0)
        p.seg([P[0], 0], [at[0], 0], { color: C.c1, width: 6, key: "x" });
      if (ay > 0)
        p.seg([0, P[1]], [0, at[1]], { color: C.c2, width: 6, key: "y" });
      // 글자는 점을 끌면 어디서든 막대와 화살표에 겹칠 수 있으므로, 평면 위가 아니라 구석의 표시 줄에 적는다.
      const label = (a: number, b: number, moved: boolean, name: string) =>
        moved
          ? `${name}: ${fmt(a)} → ${fmt(b)} (바뀜)`
          : `${name} = ${fmt(a)} (그대로)`;
      splitHud = [
        { text: label(P[0], at[0], ax > 0, "x"), color: C.c1 },
        { text: label(P[1], at[1], ay > 0, "y"), color: C.c2 },
      ];
    }
    if (d) {
      const T = to();
      p.arrow(P, T, { color: C.u, key: "move", alpha: split ? 0.3 : 1 });
      p.dot(T, { color: C.ink, r: 4, alpha: split ? 0.5 : 1 });
      p.text(T, `(${fmt(T[0])}, ${fmt(T[1])})`, {
        color: C.ink,
        dx: 10,
        dy: 14,
      });
      if (split) {
        // 이동의 가로 몫(주황, 가로 좌표만 바꿈)과 세로 몫(청록, 세로 좌표만 바꿈)
        const mid: Vec = [P[0] + ax * d[0], P[1]];
        if (ax > 0 && d[0] !== 0)
          p.arrow(P, mid, { color: C.c1, width: 3, key: "dx" });
        if (ay > 0 && d[1] !== 0)
          p.arrow(mid, at, { color: C.c2, width: 3, key: "dy" });
      }
    }
    if (split) {
      p.dot(P, { color: C.dim, r: 5, key: "P" });
      p.text(P, "P (처음 자리)", { color: C.dim, dx: 10, dy: -12 });
      p.dot(at, { color: C.ink, r: 6 });
    } else {
      p.dot(P, { color: C.ink, r: 6, key: "P" });
      p.text(P, `P (${fmt(P[0])}, ${fmt(P[1])})`, {
        color: C.ink,
        dx: 10,
        dy: -12,
        bold: true,
      });
    }
    p.hud(
      [
        {
          text: d
            ? "흰 점 P와 화살표 끝을 끌어 보세요"
            : "흰 점 P를 끌어 보세요",
        },
      ],
      "bl",
    );
    if (splitHud.length) p.hud(splitHud, "tl");
  };

  const ro = readout(panel);
  if (params.swap !== undefined)
    toggle(
      panel,
      "순서를 바꾼 점 Q = (y, x) 보기",
      () => swap,
      (v) => ((swap = v), sync()),
    );
  // 이동을 나눠 걸어 보는 단추. 누르면 지금 상태에서 그 상태로 천천히 바뀐다(둘 다는 가로 다음 세로).
  const go = (nx: number, ny: number) => {
    stop?.();
    split = true;
    const [x0, y0] = [ax, ay];
    const staged = nx !== x0 && ny !== y0;
    stop = animate(
      staged ? 1100 : 700,
      (u) => {
        const ux = staged ? Math.min(1, 2 * u) : u;
        const uy = staged ? Math.max(0, 2 * u - 1) : u;
        ax = x0 + (nx - x0) * ux;
        ay = y0 + (ny - y0) * uy;
        sync();
      },
      () => ((ax = nx), (ay = ny), (stop = null), sync()),
    );
  };
  if (d)
    buttons(panel, [
      {
        label: "가로 이동만",
        on: () => go(1, 0),
        title: "이동의 가로 몫만 적용한다. 세로 좌표는 그대로다",
      },
      {
        label: "세로 이동만",
        on: () => go(0, 1),
        title: "이동의 세로 몫만 적용한다. 가로 좌표는 그대로다",
      },
      {
        label: "둘 다 이어서",
        on: () => go(1, 1),
        title: "가로 몫을 적용한 다음 세로 몫을 적용한다",
      },
      {
        label: "화살표 하나로",
        on: () => {
          stop?.();
          stop = null;
          split = false;
          ax = ay = 0;
          sync();
        },
      },
    ]);
  hint(
    panel,
    "점에서 가로축으로 수직으로 내려가 닿는 눈금이 가로 좌표, 세로축으로 수직으로 건너가 닿는 눈금이 세로 좌표입니다.",
  );

  function sync() {
    let html = `<div>${chip("P", C.ink, "P")} = (${chip(fmt(P[0]), C.c1, "x")}, ${chip(fmt(P[1]), C.c2, "y")})</div>`;
    if (swap)
      html += `<div>${chip("Q", C.u, "Q")} = (${fmt(P[1])}, ${fmt(P[0])}) ${P[0] === P[1] ? '<span class="dim">= P (두 좌표가 같을 때만)</span>' : '<span class="dim">≠ P</span>'}</div>`;
    if (d) {
      const T = to();
      html += `<div class="eq">이동 ${chip(`(${fmt(d[0])}, ${fmt(d[1])})`, C.u, "move")}: 가로 ${fmt(P[0])} + (${fmt(d[0])}) = ${fmt(T[0])}, 세로 ${fmt(P[1])} + (${fmt(d[1])}) = ${fmt(T[1])}</div>`;
      if (split) {
        const c = cur();
        html += `<div>${chip(`가로 이동 ${fmt(d[0])}`, C.c1, "dx")}: ${ax > 0 ? `가로 좌표 ${fmt(P[0])} + (${fmt(d[0] * ax)}) = ${fmt(c[0])}` : "아직 안 함 · 가로 좌표 그대로"}</div>`;
        html += `<div>${chip(`세로 이동 ${fmt(d[1])}`, C.c2, "dy")}: ${ay > 0 ? `세로 좌표 ${fmt(P[1])} + (${fmt(d[1] * ay)}) = ${fmt(c[1])}` : "아직 안 함 · 세로 좌표 그대로"}</div>`;
        if (ax > 0 !== ay > 0)
          html += `<div class="dim">${ax > 0 ? "가로만 움직였으므로 세로 좌표는 처음 그대로다." : "세로만 움직였으므로 가로 좌표는 처음 그대로다."}</div>`;
      }
    }
    ro.set(html);
    p.invalidate();
  }
  sync();
  return () => {
    stop?.();
    p.destroy();
  };
};

export default scene;
