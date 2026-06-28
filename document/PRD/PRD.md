# gamelog PRD Index

> Version 0.2
>
> Last Updated: 2026-06-28
>
> Source: `기획서.md`

---

## Document Set

이 문서는 gamelog PRD 세트의 인덱스다. 원본 `기획서.md`의 제품 철학, 핵심 기능, MVP 범위, 미래 기능, 성공 지표를 6개 PRD 문서로 분리했다.

0. [PRD Finalization](./PRD-FINAL.md)
1. [PRD 01 - Executive Summary & Vision](./PRD-01-executive-summary-vision.md)
2. [PRD 02 - User Flow & IA](./PRD-02-user-flow-ia.md)
3. [PRD 03 - Review / Rating / Community](./PRD-03-review-rating-community.md)
4. [PRD 04 - Badge / Ticket / Statistics](./PRD-04-badge-ticket-statistics.md)
5. [PRD 05 - DB Schema & API](./PRD-05-db-schema-api.md)
6. [PRD 06 - MVP / Roadmap / KPI](./PRD-06-mvp-roadmap-kpi.md)

## Implementation Docs

- [Implementation Plan](../IMPLEMENTATION_PLAN.md)
- [Domain Model](../DOMAIN_MODEL.md)
- [API Spec](../API/API_SPEC.md)
- [OpenAPI](../API/openapi.yaml)

## Product One-Liner

gamelog는 스포츠 팬이 자신이 본 경기, 직관한 경기, 응원하며 느낀 감정과 기억을 기록하고 공유하는 스포츠 라이프로그 플랫폼이다.

## Scope Summary

- 제품 철학: 경기 결과보다 팬의 기억과 이야기를 중심에 둔다.
- 핵심 경험: 경기 검색, 관람 기록, 리뷰 작성, 팬 관점별 커뮤니티 확인, 프로필 회고.
- MVP 범위: 회원가입, 프로필, 경기 검색, 리뷰, 평점, 태그, 좋아요, 경기 MVP, 관람 방식, 팬 관점, 통계.
- Post-MVP 범위: 리스트, 경기장 컬렉션, 티켓 연동, 배지, Wrapped, AI 요약, 하이라이트 연동, 친구 비교, Fantasy League, Wallet 연동.

## Notes

- DB/API 문서는 실제 마이그레이션이 아니라 구현 설계를 위한 요구사항 초안이다.
- 원본 기획서에 명시되지 않은 정책은 `Open Questions`로 남긴다.
