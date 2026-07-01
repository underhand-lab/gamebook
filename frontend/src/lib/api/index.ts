import { HttpMatchlogApi } from "./http-matchlog-api";
import { mockMatchlogApi } from "./mock-matchlog-api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const useMockApi = !baseUrl || baseUrl === "mock";
// TODO: 실제 Spring Boot 백엔드가 준비되면 HttpMatchlogApi를 기본 경로로 전환한다.

export const matchlogApi = useMockApi ? mockMatchlogApi : new HttpMatchlogApi();

export type * from "./matchlog-api";
