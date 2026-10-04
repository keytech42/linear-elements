import type { Book } from '../schema';
import def_linear_layer from './def.linear-layer';
import exp_lora from './exp.lora';

// 10장 — 신경망으로. 9장까지의 선형대수가 신경망의 어디에 그대로 놓여 있는지, 그리고 LoRA가 무엇을 하고 무엇을 하지 않는지.
// 노드의 순서가 곧 이 장 안의 읽는 순서이고, 검증기는 이 순서로 "정의 전 사용"을 판정한다.
// 노드 파일을 새로 만들면 여기 목록에도 넣어야 한다(검증기가 빠진 파일을 잡는다).
const book: Book = {
  id: 'c10',
  num: 10,
  title: '신경망으로',
  subtitle: '선형 레이어, 그리고 LoRA',
  nodes: [
    def_linear_layer,
    exp_lora,
  ],
};

export default book;
