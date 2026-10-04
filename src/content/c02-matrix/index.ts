import type { Book } from '../schema';
import def_transformation from './def.transformation';
import def_linear_map from './def.linear-map';
import prop_linear_grid from './prop.linear-grid';
import prop_basis_determines from './prop.basis-determines';
import def_matrix from './def.matrix';
import def_matvec from './def.matvec';
import exp_gallery from './exp.gallery';
import prop_rotation_matrix from './prop.rotation-matrix';
import def_composition from './def.composition';
import prop_matmul_columns from './prop.matmul-columns';
import def_identity from './def.identity';
import prop_noncommutative from './prop.noncommutative';
import prop_associative from './prop.associative';
import def_shape from './def.shape';
import prop_shape_rule from './prop.shape-rule';

// 2장 — 선형 변환과 행렬 (뼈대; 본문은 곧 채운다)
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c2',
  num: 2,
  title: '선형 변환과 행렬',
  subtitle: '공간을 움직이는 규칙, 그 규칙을 적는 표',
  nodes: [
    def_transformation,
    def_linear_map,
    prop_linear_grid,
    prop_basis_determines,
    def_matrix,
    def_matvec,
    exp_gallery,
    prop_rotation_matrix,
    def_composition,
    prop_matmul_columns,
    def_identity,
    prop_noncommutative,
    prop_associative,
    def_shape,
    prop_shape_rule,
  ],
};

export default book;
