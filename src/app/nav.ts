// 다른 노드로 건너가는 길. 왜? 칩, 이름표 참조, 답으로 바로가기, 앞질러 가기가 모두 이 한 길을 쓴다.
// 떠나는 쪽은 지금 자리를 돌아가기 막대에 쌓고 "도착 지시"를 남긴다. 도착한 노드는 지시를 한 번 읽고 지운 뒤,
// 펼쳐 열고(답이나 근거를 찾으러 온 사람에게 퀴즈를 내지 않는다), 가리킨 자리로 내려가 잠깐 빛나게 한다.
import { trail, type TrailStep } from "./state";

/** 어떤 길로 왔는가 */
export type Via =
  | "why" // 왜? 칩: 앞 노드의 답을 보러 왔다
  | "ref" // 이름표 참조(공리 5, 명제 2 …): 앞 노드의 그 항목을 찾아보러 왔다
  | "shortcut" // 답으로 바로가기: 미뤄 둔 질문의 답으로 순서를 건너뛰어 왔다
  | "ahead"; // 앞질러 가기: 뒤에서 증명하는 자리로 순서를 건너뛰어 왔다

export interface Arrival {
  to: string;
  via: Via;
  /** 도착해서 보일 자리의 id. 앞의 것부터 찾아 처음 있는 것으로 간다(증명 머리가 없으면 이름표로). */
  targets: string[];
}

const KEY = "le.arrival";

export function depart(from: TrailStep, arrival: Arrival): void {
  trail.push(from);
  sessionStorage.setItem(KEY, JSON.stringify(arrival));
}

/** 이 노드로 온 도착 지시. 한 번 읽으면 지운다(새로 고침이나 다른 길로 다시 들어오면 지시가 없다). */
export function takeArrival(id: string): Arrival | null {
  let a: Arrival | null = null;
  try {
    a = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch {
    a = null;
  }
  sessionStorage.removeItem(KEY);
  return a?.to === id ? a : null;
}

/** 순서를 건너뛰어 온 길인가. 그렇다면 착지한 자리에 건너뛴 관문 수와 두 갈래 길(처음부터 / 돌아가기)을 알린다. */
export const skipsOrder = (via: Via) => via === "shortcut" || via === "ahead";

/** 머리의 읽기 모드 옆에 적는, 펼쳐 연 까닭 */
export const OPENED_BECAUSE: Record<Via, string> = {
  why: "왜? 칩을 따라와서 펼쳐 열었습니다",
  ref: "이름표를 찾아와서 펼쳐 열었습니다",
  shortcut:
    '바로가기로 와서 펼쳐 열었습니다. 관문의 예측은 기록되지 않았으니, 처음부터 순서대로 읽으려면 "예측하며 읽기"를 고르세요',
  ahead:
    '앞질러 와서 펼쳐 열었습니다. 관문의 예측은 기록되지 않았으니, 처음부터 순서대로 읽으려면 "예측하며 읽기"를 고르세요',
};

/** 착지 알림의 돌아가기 단추 */
export const BACK_LABEL: Record<Via, string> = {
  why: "← 질문으로 돌아가기",
  ref: "← 원래 자리로 돌아가기",
  shortcut: "← 질문으로 돌아가기",
  ahead: "← 원래 자리로 돌아가기",
};
