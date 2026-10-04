import type { Book } from '../schema';
import def_subspace from './def.subspace';
import def_column_space from './def.column-space';
import def_rank from './def.rank';
import def_null_space from './def.null-space';
import prop_rank_nullity from './prop.rank-nullity';
import prop_row_null_perp from './prop.row-null-perp';
import exp_four_subspaces from './exp.four-subspaces';

// 6장 — 부분공간과 랭크. 변환이 무엇을 살리고(열공간, 랭크) 무엇을 지우는가(영공간).
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c6',
  num: 6,
  title: '부분공간과 랭크',
  subtitle: '무엇이 살아남고 무엇이 사라지는가',
  nodes: [
    def_subspace,
    def_column_space,
    def_rank,
    def_null_space,
    prop_rank_nullity,
    prop_row_null_perp,
    exp_four_subspaces,
  ],
};

export default book;
