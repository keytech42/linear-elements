// 색도 기호다. 한 색은 앱 전체에서 한 대상만 가리킨다(기호표 화면에 같은 표가 나온다).
export const C = {
  bg: '#0e1116',
  grid: 'rgba(160,175,200,0.10)',
  gridStrong: 'rgba(160,175,200,0.22)',
  axis: 'rgba(200,210,230,0.45)',
  tgrid: 'rgba(120,170,255,0.42)', // 변환된 격자
  ink: '#e7ebf3',
  dim: '#8b93a7',
  c1: '#ff7a59', // 첫째 기저 e₁, 행렬의 1열, 그리고 그 도착지
  c2: '#35c9b4', // 둘째 기저 e₂, 행렬의 2열
  c3: '#b48cff', // 셋째 기저 e₃, 행렬의 3열 (3차원)
  x: '#f5c542', // 입력 벡터 x
  y: '#ff6bd5', // 출력 벡터 Ax
  u: '#7cc4ff', // 일반 벡터 u (벡터 덧셈 등)
  v: '#a6e36a', // 일반 벡터 v
  ok: '#5fd38d',
  bad: '#ff5d6c',
  area: 'rgba(245,197,66,0.16)',
  areaNeg: 'rgba(255,93,108,0.18)',
  hot: '#ffffff',
} as const;

export const COLOR_TABLE: { color: string; name: string; meaning: string }[] = [
  { color: C.c1, name: '주황', meaning: '첫째 표준 기저 벡터 e₁, 그리고 행렬의 1열 = e₁의 도착지' },
  { color: C.c2, name: '청록', meaning: '둘째 표준 기저 벡터 e₂, 그리고 행렬의 2열 = e₂의 도착지' },
  { color: C.c3, name: '보라', meaning: '셋째 표준 기저 벡터 e₃, 그리고 행렬의 3열 (3차원 장면)' },
  { color: C.x, name: '노랑', meaning: '변환에 넣는 입력 벡터 x' },
  { color: C.y, name: '분홍', meaning: '변환이 내놓는 출력 벡터 Ax' },
  { color: C.u, name: '하늘', meaning: '이름 없는 일반 벡터 u (덧셈·결합 장면)' },
  { color: C.v, name: '연두', meaning: '이름 없는 일반 벡터 v (덧셈·결합 장면)' },
  { color: C.tgrid, name: '파란 격자', meaning: '변환된 뒤의 격자' },
];
