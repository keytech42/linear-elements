import type { Book } from '../schema';
import ax_arith from './ax.arith';
import prop_arith_first from './prop.arith-first';
import prop_neg_times_neg from './prop.neg-times-neg';
import def_numberline from './def.numberline';
import def_plane from './def.plane';
import ax_area from './ax.area';
import prop_pythagoras from './prop.pythagoras';
import def_distance from './def.distance';
import def_angle_trig from './def.angle-trig';
import prop_cos_sin_identity from './prop.cos-sin-identity';

// 0장 — 출발점. 산수만 아는 독자의 첫 만남. 무엇을 받아들이고(공리), 무엇을 증명하는지(명제)를 처음부터 분명히 한다.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c0',
  num: 0,
  title: '출발점',
  subtitle: '산수에서 평면으로',
  nodes: [
    ax_arith,
    prop_arith_first,
    prop_neg_times_neg,
    def_numberline,
    def_plane,
    ax_area,
    prop_pythagoras,
    def_distance,
    def_angle_trig,
    prop_cos_sin_identity,
  ],
};

export default book;
