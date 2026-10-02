// 마크업 파서 고정 테스트. 검증기는 이 파서를 믿으므로, 파서가 틀리면 검증기도 틀린다.
import { describe, it, expect } from 'vitest';
import { parseBlocks, parseInline, syncKeysInTex, expandSyncMacros } from './markup';
import { verify } from '../verify/verify';
import type { Book } from './schema';

describe('인라인', () => {
  it('용어/왜?/링크/수식/굵게/코드', () => {
    const r = parseInline(String.raw`a [벡터](t:t.vector) $x_1$ **굵게 [b](def:t.b)** [왜?](why:n.a) [보기](n:n.b) \`f()\` [x](fwd:t.c)`);
    expect(r.map((x) => x.t)).toEqual(['text', 'term', 'text', 'math', 'text', 'b', 'text', 'why', 'text', 'link', 'text', 'code', 'text', 'fwd']);
  });
  it('수식 안의 대괄호는 링크로 읽지 않는다', () => {
    const r = parseInline(String.raw`[$[a]$ 이다](t:t.x)`);
    expect(r[0].t).toBe('term');
  });
  it('일반 대괄호는 글자 그대로', () => {
    expect(parseInline('[참고] 끝')).toEqual([{ t: 'text', v: '[참고] 끝' }]);
  });
  it('\\$ 는 달러 글자', () => {
    expect(parseInline(String.raw`가격 \$5`)).toEqual([{ t: 'text', v: '가격 $5' }]);
  });
});

describe('블록', () => {
  it('문단/수식/장면/목록/상자', () => {
    const b = parseBlocks(String.raw`첫 문단
이어지는 줄

$$a = b$$

::scene transform-grid {"A": [[1,0],[0,1]]}

- 하나
- 둘

> [!비유] 수도꼭지
> 둘째 줄`);
    expect(b.map((x) => x.t)).toEqual(['p', 'math', 'scene', 'ul', 'note']);
    expect(b[2]).toMatchObject({ t: 'scene', id: 'transform-grid', params: { A: [[1, 0], [0, 1]] } });
    expect(b[4]).toMatchObject({ t: 'note', kind: '비유' });
  });
  it('여러 줄 수식', () => {
    const b = parseBlocks('$$\na\n+ b\n$$');
    expect(b).toEqual([{ t: 'math', tex: 'a\n+ b' }]);
  });
});

describe('번호 목록', () => {
  it('1. 2. 는 ol, 문단과 섞이지 않는다', () => {
    const b = parseBlocks('앞 문단\n1. 하나\n2. 둘\n\n뒤');
    expect(b.map((x) => x.t)).toEqual(['p', 'ul', 'p']);
    expect(b[1]).toMatchObject({ ordered: true });
    expect((b[1] as { items: unknown[] }).items.length).toBe(2);
  });
});

describe('동기화 매크로', () => {
  it('키 추출과 확장', () => {
    expect(syncKeysInTex(String.raw`\h{col1}{a} + \h{x}{b}`)).toEqual(['col1', 'x']);
    expect(expandSyncMacros(String.raw`\h{col1}{a}`)).toBe(String.raw`\htmlData{sync=col1}{a}`);
  });
});

describe('검증기 규칙', () => {
  const mk = (nodes: Book['nodes']): Book[] => [{ id: 'b', num: 0, title: '', subtitle: '', nodes }];
  const rules = (books: Book[]) => verify(books, new Set(['s']), new Map()).issues.map((i) => i.rule);
  const T = { id: 't.a', ko: '가나다', gloss: '' };
  it('P001 정의 전 사용', () => {
    expect(rules(mk([
      { id: 'n1', kind: 'def', title: '', status: 'written', body: '[가나다](t:t.a)' },
      { id: 'n2', kind: 'def', title: '', status: 'written', introduces: { terms: [T] }, body: '[가나다](def:t.a)' },
    ]))).toContain('P001');
  });
  it('P003 뒤쪽을 가리키는 왜?', () => {
    expect(rules(mk([
      { id: 'n1', kind: 'def', title: '', status: 'written', body: '[왜?](why:n2)' },
      { id: 'n2', kind: 'def', title: '', status: 'written', body: 'x' },
    ]))).toContain('P003');
  });
  it('P008 표시 없는 언급', () => {
    expect(rules(mk([
      { id: 'n1', kind: 'def', title: '', status: 'written', body: '가나다를 쓴다' },
      { id: 'n2', kind: 'def', title: '', status: 'written', introduces: { terms: [T] }, body: '[가나다](def:t.a)' },
    ]))).toContain('P008');
  });
  it('P015 선언했지만 def: 자리가 없음', () => {
    expect(rules(mk([{ id: 'n1', kind: 'def', title: '', status: 'written', introduces: { terms: [T] }, body: '가나다' }]))).toContain('P015');
  });
  it('P020 예측 배치 오류, P022 정답 범위, P023 그림 예측 행렬', () => {
    const r = rules(mk([
      {
        id: 'n1', kind: 'exp', title: '', status: 'written', body: '::predict a\n\n::predict ghost\n\n> 상자\n> ::predict b',
        predicts: [
          { id: 'a', kind: 'choice', q: '?', choices: ['x'], answer: 3 },
          { id: 'b', kind: 'choice', q: '?', choices: ['x'], answer: 0 },
          { id: 'c', kind: 'point', q: '?', A: [[0, -1], [1, 0]], target: 'eig' },
        ],
      },
    ]));
    expect(r.filter((x) => x === 'P020').length).toBeGreaterThanOrEqual(3); // ghost 없음, 상자 안, c 배치 안 됨
    expect(r).toContain('P022');
    expect(r).toContain('P023'); // 회전에는 실수 고유 방향이 없다
  });
  it('P010 없는 장면', () => {
    expect(rules(mk([{ id: 'n1', kind: 'exp', title: '', status: 'written', body: '::scene nope' }]))).toContain('P010');
  });
  it('fwd: 예고는 허용', () => {
    const r = rules(mk([
      { id: 'n1', kind: 'def', title: '', status: 'written', body: '[가나다](fwd:t.a)' },
      { id: 'n2', kind: 'def', title: '', status: 'written', introduces: { terms: [T] }, body: '[가나다](def:t.a)' },
    ]));
    expect(r.filter((x) => x !== 'P014' && x !== 'P006')).toEqual([]);
  });
});
