import type { Book } from '../schema';
import def_vector from './def.vector';
import def_vector_add from './def.vector-add';
import prop_add_componentwise from './prop.add-componentwise';
import def_scalar_mul from './def.scalar-mul';
import prop_vector_rules from './prop.vector-rules';
import def_linear_combination from './def.linear-combination';
import def_span from './def.span';
import def_independence from './def.independence';
import def_basis from './def.basis';
import prop_coords_unique from './prop.coords-unique';
import def_dimension from './def.dimension';
import exp_space3 from './exp.space3';

// 1장 — 벡터
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c1',
  num: 1,
  title: '벡터',
  subtitle: '화살표와 숫자 묶음',
  nodes: [
    def_vector,
    def_vector_add,
    prop_add_componentwise,
    def_scalar_mul,
    prop_vector_rules,
    def_linear_combination,
    def_span,
    def_independence,
    def_basis,
    prop_coords_unique,
    def_dimension,
    exp_space3,
  ],
};

export default book;
