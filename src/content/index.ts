// 장의 순서가 곧 노드의 전체 순서다. 검증기는 이 순서로 "정의 전 사용"을 판정한다.
import type { Book, NodeDef } from './schema';
import b0 from './c00-ground/index';
import b1 from './c01-vector/index';
import b2 from './c02-matrix/index';
import b3 from './c03-dot/index';
import b4 from './c04-det/index';
import b5 from './c05-inverse/index';
import b6 from './c06-subspace/index';
import b7 from './c07-basis-change/index';
import b8 from './c08-eigen/index';
import b9 from './c09-svd/index';
import b10 from './c10-nn/index';

export const BOOKS: Book[] = [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10];
export const ALL_NODES: NodeDef[] = BOOKS.flatMap((b) => b.nodes);
export const NODE_BY_ID = new Map(ALL_NODES.map((n) => [n.id, n]));
export const BOOK_OF = new Map(BOOKS.flatMap((b) => b.nodes.map((n) => [n.id, b] as const)));
