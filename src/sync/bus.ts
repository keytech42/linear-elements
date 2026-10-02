// 삼중 동기화 버스: 숫자(행렬 칸) ↔ 그림(캔버스) ↔ 식(KaTeX/본문)
// 모든 표현은 같은 "키"(예: col1, a21, x)를 공유한다. 어느 쪽에서 가리켜도 경로는 이 버스 하나다.
//   DOM 쪽:  data-sync="키" 속성을 가진 요소 (KaTeX의 \htmlData{sync=키}, 본문의 [..](sync:키), 행렬 편집기의 칸)
//   캔버스:  장면이 bus.on()으로 구독하고, 자기가 그린 대상에 키를 붙여 다시 그린다.

export type Listener = (key: string | null) => void;

export class SyncBus {
  key: string | null = null;
  private subs = new Set<Listener>();

  set(key: string | null) {
    if (key === this.key) return;
    this.key = key;
    for (const f of this.subs) f(key);
  }

  on(f: Listener): () => void {
    this.subs.add(f);
    return () => this.subs.delete(f);
  }

  /** 키가 같은지. 키 "col1"은 "a11", "a21"(1열의 칸)이 가리켜질 때도 빛나야 하므로 관계를 함께 본다. */
  is(...keys: string[]): boolean {
    const k = this.key;
    if (!k) return false;
    return keys.some((q) => q === k || related(k, q));
  }

  /** root 안의 data-sync 요소들을 버스에 묶는다. */
  bindDom(root: HTMLElement): () => void {
    const over = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.('[data-sync]') as HTMLElement | null;
      if (el && root.contains(el)) this.set(el.dataset.sync!);
    };
    const out = (e: PointerEvent) => {
      const to = (e.relatedTarget as HTMLElement | null)?.closest?.('[data-sync]');
      if (!to) this.set(null);
    };
    root.addEventListener('pointerover', over);
    root.addEventListener('pointerout', out);
    const off = this.on((key) => {
      root.querySelectorAll<HTMLElement>('[data-sync]').forEach((el) => {
        const k = el.dataset.sync!;
        el.classList.toggle('sync-hot', !!key && (k === key || related(key, k)));
      });
    });
    return () => {
      root.removeEventListener('pointerover', over);
      root.removeEventListener('pointerout', out);
      off();
    };
  }
}

/**
 * 키 사이의 관계: 행렬 칸 aIJ(i행 j열)를 가리키면 그 칸이 속한 열 colJ 도 빛난다. 그 반대도 같다.
 * 접두어가 붙은 키(예: B.a12 ↔ B.col2)도 같은 규칙을 따른다.
 */
function related(a: string, b: string): boolean {
  const pa = splitPrefix(a), pb = splitPrefix(b);
  if (pa.prefix !== pb.prefix) return false;
  const ea = /^a(\d)(\d)$/.exec(pa.key), cb = /^col(\d)$/.exec(pb.key);
  if (ea && cb) return ea[2] === cb[1];
  const eb = /^a(\d)(\d)$/.exec(pb.key), ca = /^col(\d)$/.exec(pa.key);
  if (eb && ca) return eb[2] === ca[1];
  return false;
}

function splitPrefix(k: string): { prefix: string; key: string } {
  const i = k.lastIndexOf('.');
  return i < 0 ? { prefix: '', key: k } : { prefix: k.slice(0, i), key: k.slice(i + 1) };
}
