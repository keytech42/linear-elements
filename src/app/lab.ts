// 장면 실험실: 장면 하나를 본문 없이 띄운다. #/lab/<장면id>?p=<JSON 매개변수>
// 장면을 만들거나 고칠 때, 그리고 UX를 논의할 때 쓴다. 장면 id 없이 열면 목록을 보여 준다.
import { SCENES } from './data';
import { SyncBus } from '../sync/bus';

export async function renderLab(main: HTMLElement, id?: string, p?: string): Promise<() => void> {
  if (!id) {
    main.innerHTML = `<section class="page"><h1>장면 실험실</h1><p class="dim">장면 ${SCENES.size}개. 누르면 본문 없이 장면만 띄웁니다.</p><ul>${[...SCENES.keys()]
      .sort()
      .map((k) => `<li><a href="#/lab/${k}">${k}</a></li>`)
      .join('')}</ul></section>`;
    return () => {};
  }
  const load = SCENES.get(id);
  main.innerHTML = `<section class="node"><div class="kicker">장면 실험실 · <a href="#/lab">목록</a></div><h1><code>${id}</code></h1><div class="lab-host"></div></section>`;
  if (!load) {
    main.querySelector('.lab-host')!.textContent = '없는 장면';
    return () => {};
  }
  const bus = new SyncBus();
  const host = main.querySelector<HTMLElement>('.lab-host')!;
  const off = bus.bindDom(host);
  const fn = await load();
  const clean = fn(host, { bus, params: p ? JSON.parse(p) : {} });
  return () => {
    off();
    clean?.();
  };
}
