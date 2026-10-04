import type { Book } from '../schema';
import def_inverse from './def.inverse';
import prop_inverse_exists from './prop.inverse-exists';
import prop_inverse_product from './prop.inverse-product';
import prop_orthogonal_inverse from './prop.orthogonal-inverse';
import def_linear_system from './def.linear-system';
import prop_elimination from './prop.elimination';

// 5장 — 되돌리기. 역행렬, 그리고 "어떤 입력이 이 출력에 도착하는가"(연립일차방정식).
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c5',
  num: 5,
  title: '되돌리기',
  subtitle: '역행렬과 연립일차방정식',
  nodes: [
    def_inverse,
    prop_inverse_exists,
    prop_inverse_product,
    prop_orthogonal_inverse,
    def_linear_system,
    prop_elimination,
  ],
};

export default book;
