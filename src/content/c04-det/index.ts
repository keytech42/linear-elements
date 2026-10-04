import type { Book } from '../schema';
import def_det from './def.det';
import prop_det_uniform from './prop.det-uniform';
import prop_det_formula from './prop.det-formula';
import prop_det_sign from './prop.det-sign';
import prop_det_product from './prop.det-product';
import prop_det_zero from './prop.det-zero';
import exp_det_3d from './exp.det-3d';

// 4장 — 행렬식. "넓이는 몇 배가 되었고, 뒤집혔는가"를 수 하나로.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c4',
  num: 4,
  title: '행렬식',
  subtitle: '넓이는 몇 배가 되었고, 뒤집혔는가',
  nodes: [
    def_det,
    prop_det_uniform,
    prop_det_formula,
    prop_det_sign,
    prop_det_product,
    prop_det_zero,
    exp_det_3d,
  ],
};

export default book;
