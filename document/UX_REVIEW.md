# gamelog UX Review

> Status: Applied to PRD, Domain Model, API Spec, and OpenAPI
>
> Last Updated: 2026-06-28

---

## 1. Review Summary

gamelog의 서비스 철학은 “경기 결과보다 팬의 기억을 기록한다”는 방향과 일치한다. 다만 기존 문서는 리뷰와 커뮤니티 기능이 상대적으로 강하게 드러나고, 사용자의 개인 기록 축적 경험이 IA/API에서 충분히 전면화되지 않았다.

이번 리뷰에서는 기록 중심 UX를 강화하기 위해 `Timeline`, `MatchLogAggregate`, 감정 기반 통계, Typed Tag, 모바일 UX 요구사항을 문서에 반영한다.

## 2. Checklist Findings

### 서비스 철학과 UX가 일치하는가

- 상태: 부분적으로 일치
- 문제: 철학은 기록 중심이지만 주요 화면과 API는 리뷰/경기 상세 중심으로 보인다.
- 수정: `Timeline`을 MVP 핵심 화면/API로 추가하고, 기록 저장 후 프로필/타임라인 회고 흐름을 명시한다.

### 리뷰보다 기록 중심으로 설계되어 있는가

- 상태: 보완 필요
- 문제: `Review`가 커뮤니티 콘텐츠로 강하게 정의되어 있고 `MatchLog`의 UX 역할이 약하다.
- 수정: `MatchLogAggregate`를 도입해 관람 기록, 리뷰, 감정, 태그, MVP 선택을 하나의 개인 기록 단위로 묶는다.

### Match Log Aggregate가 적절한가

- 상태: 누락
- 문제: `MatchAggregate`는 경기 커뮤니티 집계지만, 사용자 개인 기록 집계가 없다.
- 수정: `MatchLogAggregate`를 도메인 모델과 API/OpenAPI에 추가한다.

### 경기 상세 페이지가 Community Hub 역할을 하는가

- 상태: 대체로 일치
- 문제: Community Hub라는 역할이 명시되지 않아 리뷰 목록 중심으로 해석될 수 있다.
- 수정: 경기 상세 페이지를 리뷰, 팬 관점별 평점, MVP, 감정, 태그가 모이는 Community Hub로 명시한다.

### Fan Perspective가 UX에 충분히 반영되었는가

- 상태: 보완 필요
- 문제: 필터와 평점에는 반영되어 있으나 리뷰 카드, 집계, 작성 흐름에서 핵심 UX 원칙으로 고정되어 있지 않다.
- 수정: 팬 관점을 작성 필수값, 카드 표시값, 필터, 평점 집계, 모바일 segmented control로 정의한다.

### Emotion이 통계와 Wrapped까지 연결되는가

- 상태: 보완 필요
- 문제: 경기 페이지 감정 집계는 있으나 사용자 통계/Wrapped 연결이 약하다.
- 수정: `UserStats.topEmotions`, `MatchLogAggregate.emotion`, Wrapped 감정 요약 요구사항을 추가한다.

### Official Tag와 User Tag가 구분되는가

- 상태: 도메인에서는 구분, API에서는 보완 필요
- 문제: API Review 응답은 `tags: string[]`라 타입 구분이 사라진다.
- 수정: `Tag` DTO에 `tagType`을 포함하고 Review/TagCount 응답에서 Typed Tag를 사용한다.

### Diary / Timeline 기능이 Roadmap에 포함되어 있는가

- 상태: 누락
- 문제: Profile 기록 목록은 있으나 Diary/Timeline이 명시되어 있지 않다.
- 수정: Timeline은 MVP 핵심 화면/API로 추가하고, private Diary는 Post-MVP로 분리한다.

### 모바일 앱 UX를 고려했을 때 수정해야 할 부분이 있는가

- 상태: 보완 필요
- 수정: 모바일 우선 기록 CTA, 하단 탭, 팬 관점 segmented control, 작성 단계 분리, 타임라인 중심 프로필, 스포일러 접기 상태를 PRD에 추가한다.

## 3. Applied Document Updates

- `document/PRD/PRD-FINAL.md`
- `document/plan.md`
- `document/PRD/PRD-02-user-flow-ia.md`
- `document/PRD/PRD-03-review-rating-community.md`
- `document/PRD/PRD-04-badge-ticket-statistics.md`
- `document/PRD/PRD-05-db-schema-api.md`
- `document/PRD/PRD-06-mvp-roadmap-kpi.md`
- `document/DOMAIN_MODEL.md`
- `document/API/API_SPEC.md`
- `document/API/openapi.yaml`
