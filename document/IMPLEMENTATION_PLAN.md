# gamelog Implementation Plan

> Status: Planned through OpenAPI
>
> Last Updated: 2026-06-28

---

## 1. Execution Order

1. PRD 확정
2. 도메인 모델 확정
3. API Spec 작성
4. OpenAPI 문서 작성
5. 프론트엔드 생성
6. 프론트는 mock adapter로 API 응답 흉내
7. Spring Boot 백엔드 생성
8. 백엔드가 OpenAPI 스펙을 만족하도록 구현
9. 프론트 mock adapter를 실제 API client로 교체

## 2. Current Task Scope

이번 작업의 완료 범위는 1~4번이다.

- PRD 확정
- 도메인 모델 확정
- API Spec 작성
- OpenAPI 문서 작성

이번 작업에서 하지 않는 항목은 다음과 같다.

- 프론트엔드 생성
- mock adapter 구현
- Spring Boot 백엔드 생성
- 실제 API 구현
- mock adapter를 실제 API client로 교체

## 3. Completed Artifacts

- PRD 확정 문서: `document/PRD/PRD-FINAL.md`
- UX 검토 문서: `document/UX_REVIEW.md`
- 도메인 모델: `document/DOMAIN_MODEL.md`
- API Spec: `document/API/API_SPEC.md`
- OpenAPI 문서: `document/API/openapi.yaml`

## 4. Development Gates

### Gate 1. Product Gate

- MVP 범위가 확정되어야 한다.
- Post-MVP 기능이 MVP에서 분리되어야 한다.
- 별점, 팬 관점, 감정, MVP 투표 정책이 확정되어야 한다.

### Gate 2. Domain Gate

- 핵심 엔티티와 관계가 확정되어야 한다.
- enum 값과 제약 조건이 확정되어야 한다.
- 프론트 mock과 백엔드 구현이 같은 모델명을 사용할 수 있어야 한다.

### Gate 3. API Gate

- MVP API endpoint가 정의되어야 한다.
- 요청/응답 DTO가 정의되어야 한다.
- 공통 에러 응답과 인증 정책이 정의되어야 한다.

### Gate 4. OpenAPI Gate

- OpenAPI 문서가 API Spec과 일치해야 한다.
- 프론트 mock adapter와 Spring Boot 구현이 같은 계약을 참조할 수 있어야 한다.

## 5. Next Step After This Task

다음 작업은 5번 `프론트엔드 생성`이다.

프론트엔드는 `document/UX_REVIEW.md`와 `document/API/openapi.yaml`을 기준으로 Timeline 중심 UX와 mock adapter 응답 형태를 맞춘다.
