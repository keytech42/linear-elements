import type { Book } from '../schema';
import def_change_of_basis from './def.change-of-basis';
import prop_similarity from './prop.similarity';

// 7장 — 기저 변환. 같은 벡터, 같은 변환을 다른 언어(기저)로 적기. 8장의 대각화가 바로 "좋은 언어 고르기"다.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c7',
  num: 7,
  title: '기저 변환',
  subtitle: '같은 대상, 다른 언어',
  nodes: [
    def_change_of_basis,
    prop_similarity,
  ],
};

export default book;
