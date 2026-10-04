import type { Book } from '../schema';
import exp_eigen_hunt from './exp.eigen-hunt';
import def_eigen from './def.eigen';
import def_trace from './def.trace';
import prop_char_poly from './prop.char-poly';
import prop_no_real_eigen from './prop.no-real-eigen';
import prop_diagonalization from './prop.diagonalization';
import def_symmetric from './def.symmetric';
import prop_spectral from './prop.spectral';
import prop_sym_ellipse from './prop.sym-ellipse';

// 8장 — 고윳값과 고유벡터. 9장(SVD)의 발판: 9장은 "AᵀA는 대칭 → 스펙트럼 정리"로 증명을 시작한다.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c8',
  num: 8,
  title: '고윳값과 고유벡터',
  subtitle: '변환이 방향을 바꾸지 않는 축',
  nodes: [
    exp_eigen_hunt,
    def_eigen,
    def_trace,
    prop_char_poly,
    prop_no_real_eigen,
    prop_diagonalization,
    def_symmetric,
    prop_spectral,
    prop_sym_ellipse,
  ],
};

export default book;
