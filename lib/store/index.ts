/**
 * DOMA 단일 목 스토어 — 읽기/쓰기 진입점.
 * 화면은 더미 배열 대신 여기를 점진적으로 바라본다.
 */
export { domaStore } from "@/lib/store/memory-store";
export { toUiOpinion, toUiOpinions } from "@/lib/store/adapters";
export { buildSeedSnapshot } from "@/lib/store/seed";
export type {
  ArenaMeta,
  CreateOpinionInput,
  StoreSnapshot,
} from "@/lib/store/types";
export {
  useDomaStore,
  useSession,
  useUiOpinions,
} from "@/lib/store/use-doma-store";
