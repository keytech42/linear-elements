// 장면(살아 있는 그림) 규약.
// 장면 파일 하나 = src/scenes/<장면id>.ts, default export 로 SceneFn 하나.
// 본문에서는 `::scene 장면id {"매개변수": 값}` 으로 부른다. 파일 이름이 곧 장면 id다(등록 파일이 따로 없다).
import type { SyncBus } from '../../sync/bus';
import { el } from '../../ui/widgets';

export interface SceneCtx {
  bus: SyncBus;
  /** 본문의 ::scene 줄에 적은 JSON */
  params: Record<string, any>;
}

/** 장면을 host 안에 그리고, 치우는 함수를 돌려준다. */
export type SceneFn = (host: HTMLElement, ctx: SceneCtx) => (() => void) | void;

/**
 * 표준 배치: 왼쪽(넓은 쪽) = 그림, 오른쪽 = 조작 도구와 읽기 칸.
 * 화면이 좁으면 위아래로 쌓인다(CSS).
 */
export function layout(host: HTMLElement, opts: { side?: boolean } = {}) {
  const root = el('div', opts.side === false ? 'scene-grid stacked' : 'scene-grid');
  const stage = el('div', 'scene-stage');
  const panel = el('div', 'scene-panel');
  root.append(stage, panel);
  host.appendChild(root);
  return { root, stage, panel };
}

/** 읽기 칸: 매 프레임 바뀌는 수식/수치를 HTML로 갈아 끼운다(KaTeX를 다시 돌리지 않는다: 60fps를 지키기 위해). */
export function readout(host: HTMLElement, cls = 'readout') {
  const box = el('div', cls);
  host.appendChild(box);
  let last = '';
  return {
    el: box,
    set(html: string) {
      if (html !== last) {
        box.innerHTML = html;
        last = html;
      }
    },
  };
}

/** 장면 아래의 짧은 지시문 */
export function hint(host: HTMLElement, html: string) {
  host.appendChild(el('p', 'scene-hint', html));
}
