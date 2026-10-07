import { describe, it, expect } from 'vitest';
import { isoLocal, stampLabel } from './review';

describe('검토 시각', () => {
  it('지역 시간대를 붙인 ISO 8601로 적는다', () => {
    const s = isoLocal(new Date(2026, 9, 7, 17, 42, 5));
    expect(s).toMatch(/^2026-10-07T17:42:05[+-]\d{2}:\d{2}$/);
    expect(new Date(s).getTime()).toBe(new Date(2026, 9, 7, 17, 42, 5).getTime()); // 되읽으면 같은 순간
  });
  it('사람이 읽는 표기는 분까지, 날짜만 있는 예전 기록은 그대로', () => {
    expect(stampLabel({ on: '2026-10-07T17:42:05+09:00', hash: 'x' })).toBe('2026-10-07 17:42');
    expect(stampLabel({ on: '2026-10-04', hash: 'x' })).toBe('2026-10-04');
  });
});
