// 장의 순서가 곧 노드의 전체 순서다. 검증기는 이 순서로 "정의 전 사용"을 판정한다.
import type { Book, NodeDef } from './schema';
import b0 from './b00-ground';
import b1 from './b01-vector';
import b2 from './b02-matrix';
import b3 from './b03-dot';
import b4 from './b04-det';
import b5 from './b05-inverse';
import b6 from './b06-subspace';
import b7 from './b07-basis-change';
import b8 from './b08-eigen';
import b9 from './b09-svd';
import b10 from './b10-nn';

export const BOOKS: Book[] = [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10];
export const ALL_NODES: NodeDef[] = BOOKS.flatMap((b) => b.nodes);
export const NODE_BY_ID = new Map(ALL_NODES.map((n) => [n.id, n]));
export const BOOK_OF = new Map(BOOKS.flatMap((b) => b.nodes.map((n) => [n.id, b] as const)));
