import type { Book } from '../schema';
import exp_circle_to_ellipse from './exp.circle-to-ellipse';
import prop_ata_symmetric from './prop.ata-symmetric';
import prop_svd_ata from './prop.svd-ata';
import prop_svd from './prop.svd';
import exp_svd_assemble from './exp.svd-assemble';
import def_outer_product from './def.outer-product';
import prop_svd_sum from './prop.svd-sum';
import prop_eckart_young from './prop.eckart-young';
import exp_image_lowrank from './exp.image-lowrank';
import prop_svd_four_subspaces from './prop.svd-four-subspaces';

// 9장 — 특이값 분해. 이 교재 전체가 향하는 목적지.
// 증명의 뼈대: AᵀA는 대칭 → 스펙트럼 정리 → "가장 많이 늘어나는 방향"이 서로 수직 → A = UΣVᵀ
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c9',
  num: 9,
  title: '특이값 분해',
  subtitle: '모든 행렬은 회전, 늘이기, 회전이다',
  nodes: [
    exp_circle_to_ellipse,
    prop_ata_symmetric,
    prop_svd_ata,
    prop_svd,
    exp_svd_assemble,
    def_outer_product,
    prop_svd_sum,
    prop_eckart_young,
    exp_image_lowrank,
    prop_svd_four_subspaces,
  ],
};

export default book;
