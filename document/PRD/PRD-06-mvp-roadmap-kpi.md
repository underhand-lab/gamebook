# PRD 06 - MVP / Roadmap / KPI

> Product: gamelog
>
> Version: 0.2
>
> Last Updated: 2026-06-28
>
> Source: `기획서.md`

---

## 1. Purpose

이 문서는 gamelog의 MVP 범위, 출시 기준, 로드맵, 성공 지표를 정의한다.

## 2. MVP Product Goal

MVP의 목표는 사용자가 경기를 찾고, 관람을 기록하고, 리뷰와 별점을 남기고, 팬 관점별 커뮤니티 반응을 확인하며, 자신의 프로필에서 스포츠 기록을 돌아볼 수 있게 하는 것이다.

## 3. MVP Scope

- 회원가입
- 프로필
- 경기 검색
- 리뷰
- 평점
- 태그
- 좋아요
- 경기 MVP
- 관람 방식
- 팬 관점
- 통계

## 4. MVP Feature Requirements

### Account
- 사용자는 계정을 생성하고 로그인할 수 있다.
- 사용자는 프로필을 가진다.

### Match Search
- 사용자는 경기를 검색할 수 있다.
- 사용자는 검색 결과에서 기록할 경기를 선택할 수 있다.

### Match Logging
- 사용자는 경기 관람 기록을 저장할 수 있다.
- 관람 방식과 응원팀 또는 팬 관점을 저장할 수 있다.

### Review / Rating
- 사용자는 별점과 리뷰를 작성할 수 있다.
- 사용자는 스포일러 여부와 태그를 입력할 수 있다.

### Fan Perspective
- 리뷰는 홈팀 팬, 원정팀 팬, 타팀 팬, 중립 팬으로 분류된다.
- 사용자는 원하는 팬의 리뷰만 볼 수 있다.

### Community
- 경기 페이지는 리뷰, 평점, 경기 MVP, 감정, 태그를 집계한다.
- 사용자는 리뷰에 좋아요를 누를 수 있다.

### Profile / Statistics
- 프로필은 사용자의 모든 기록을 저장한다.
- 프로필은 총 경기 수, 직관 수, 라이브 수, 평균 평점, 리뷰 수, 좋아요 수, 응원팀을 보여준다.
- 기본 통계는 사용자 기록을 기반으로 자동 생성된다.

## 5. MVP Non-Scope

- 티켓 예매 사이트 연동
- Verified Attendance
- 배지
- Wrapped
- 리스트 생성
- 리스트 좋아요
- 경기장 지도 컬렉션
- AI 리뷰 요약
- AI 경기 요약
- 하이라이트 연동
- 친구 비교
- Fantasy League 연동
- Wallet 연동

## 6. Release Criteria

- 사용자가 계정을 만들고 로그인할 수 있다.
- 사용자가 경기를 검색하고 선택할 수 있다.
- 사용자가 관람 기록과 리뷰를 저장할 수 있다.
- 경기 페이지에 리뷰와 평점이 반영된다.
- 경기 페이지에 팬 관점별 리뷰 필터가 있다.
- 경기 페이지에 경기 MVP, 감정, 태그 집계가 표시된다.
- 사용자가 리뷰 좋아요를 누르고 취소할 수 있다.
- 프로필에서 핵심 누적 통계를 확인할 수 있다.

## 7. Roadmap

### Phase 0 - Foundation

- 제품 요구사항 확정
- 초기 지원 종목과 리그 결정
- 경기 데이터 확보 방식 결정
- 별점 정책 결정
- 데이터 모델 확정

### Phase 1 - MVP Build

- 회원가입과 프로필
- 경기 검색과 경기 상세
- 관람 기록
- 리뷰와 별점
- 팬 관점 필터
- 리뷰 좋아요
- 경기 MVP 투표
- 기본 통계

### Phase 2 - Community Expansion

- 리스트
- 리스트 좋아요
- 리뷰 탐색 개선
- 사용자 프로필 공개 범위 개선
- 알림

### Phase 3 - Lifelog Expansion

- 경기장 컬렉션
- 티켓 연동
- Verified Attendance
- 배지
- Wrapped

### Phase 4 - Intelligence / Integrations

- AI 리뷰 요약
- AI 경기 요약
- 하이라이트 연동
- 친구 비교
- Fantasy League 연동
- Apple Wallet 티켓 연동
- Google Wallet 티켓 연동

## 8. KPI

### Activation

- 회원가입 완료율
- 첫 경기 기록 완료율
- 첫 리뷰 작성률

### Engagement

- Daily Active Users
- Monthly Active Users
- 리뷰 작성률
- 경기당 리뷰 수
- 경기당 MVP 투표 수
- 평균 체류 시간

### Retention

- 재방문율
- 주간 기록 작성 사용자 수
- 월간 기록 작성 사용자 수

### Trust / Lifelog

- 직관 인증률
- 프로필 통계 조회율
- Wrapped 조회율

## 9. Analytics Events

- `sign_up_completed`
- `match_search_performed`
- `match_viewed`
- `match_log_created`
- `review_created`
- `rating_submitted`
- `fan_filter_used`
- `review_liked`
- `mvp_vote_submitted`
- `profile_stats_viewed`

## 10. Risks

- 경기 데이터 확보 방식이 늦게 결정되면 검색과 경기 페이지 구현이 지연된다.
- 종목별 데이터 구조 차이가 크면 Sports Neutral 원칙 구현이 어려워질 수 있다.
- 팬 관점과 응원팀 모델이 불명확하면 리뷰 필터와 평점 집계가 흔들릴 수 있다.
- 티켓 연동은 외부 서비스 의존성이 크다.

## 11. Open Questions

- MVP에서 지원할 첫 종목과 리그는 무엇인가?
- 경기 데이터는 누가 생성하고 검수하는가?
- 공개 리뷰와 비공개 기록을 모두 지원할 것인가?
- MVP 출시 기준에서 리스트를 제외하는 것이 맞는가?
- 직관 인증률은 티켓 연동 전에도 KPI로 추적할 것인가?
