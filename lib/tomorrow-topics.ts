export type TomorrowCandidate = {
  id: string;
  title: string;
  votes: number;
  /** 필드 점검용 한 줄 — 실공유에서는 비움 */
  note: string;
  /** 이 주제를 이끄는 수(목) */
  stewards: number;
};

export type FieldOpinion = {
  id: string;
  topicId: string;
  author: string;
  text: string;
  likes: number;
  stance: "support" | "lead" | "question";
  /** 올린 시각 (UTC ISO) — 없으면 표시 생략 */
  createdAtUtc?: string;
};

/** 내일의 주제 — 실공유: 후보·필러 에세이 없음 */
export const INITIAL_TOMORROW_TOPICS: TomorrowCandidate[] = [];

/** 내일 필드 의견 — 실공유: 비움 */
export const FIELD_OPINIONS: FieldOpinion[] = [];

export function opinionsForTopic(topicId: string): FieldOpinion[] {
  return FIELD_OPINIONS.filter((o) => o.topicId === topicId).sort(
    (a, b) => b.likes - a.likes,
  );
}
