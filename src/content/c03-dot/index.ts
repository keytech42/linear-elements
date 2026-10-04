import type { Book } from '../schema';
import prop_law_of_cosines from './prop.law-of-cosines';
import def_norm from './def.norm';
import def_dot from './def.dot';
import prop_dot_geometric from './prop.dot-geometric';
import def_orthogonal from './def.orthogonal';
import prop_orth_projection from './prop.orth-projection';
import prop_row_picture from './prop.row-picture';
import def_transpose from './def.transpose';
import prop_transpose_dot from './prop.transpose-dot';
import def_orthogonal_matrix from './def.orthogonal-matrix';
import prop_orthogonal_preserves from './prop.orthogonal-preserves';

// 3장 — 길이, 각도, 내적. "곱해서 더하기"라는 숫자 계산이 왜 길이와 각도를 재는가.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c3',
  num: 3,
  title: '길이·각도·내적',
  subtitle: '두 벡터가 얼마나 같은 쪽을 보는가',
  nodes: [
    prop_law_of_cosines,
    def_norm,
    def_dot,
    prop_dot_geometric,
    def_orthogonal,
    prop_orth_projection,
    prop_row_picture,
    def_transpose,
    prop_transpose_dot,
    def_orthogonal_matrix,
    prop_orthogonal_preserves,
  ],
};

export default book;
