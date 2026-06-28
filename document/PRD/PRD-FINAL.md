# gamelog PRD Finalization

> Status: Finalized for MVP planning
>
> Last Updated: 2026-06-28
>
> Source: `document/plan.md`, `document/PRD/`

---

## 1. Product Definition

gamelog는 스포츠 팬이 본 경기, 직관한 경기, 응원하며 느낀 감정과 기억을 기록하고 공유하는 스포츠 라이프로그 플랫폼이다.

핵심 가치는 경기 결과 데이터가 아니라 팬 개인의 스포츠 경험을 장기적으로 저장하는 것이다.

## 2. MVP Goal

사용자가 경기를 검색하고, 관람을 기록하고, 별점과 리뷰를 남기고, 팬 관점별 커뮤니티 반응을 확인하며, 프로필에서 자신의 스포츠 기록을 돌아볼 수 있게 한다.

## 3. MVP Scope

- 회원가입 및 로그인
- 내 프로필 조회와 수정
- 경기 검색과 경기 상세 조회
- 관람 기록 생성과 조회
- 리뷰 작성, 수정, 삭제
- 별점
- 팬 관점
- 대표 감정
- 사용자 태그
- 리뷰 좋아요
- 경기 MVP 투표
- 기본 통계

## 4. MVP Non-Scope

- 리스트 생성과 리스트 좋아요
- 경기장 지도 컬렉션
- 티켓 예매 사이트 연동
- Verified Attendance 자동 인증
- 배지 자동 지급
- Wrapped
- AI 리뷰 요약
- AI 경기 요약
- 하이라이트 연동
- 친구 비교
- Fantasy League 연동
- Wallet 연동

## 5. Finalized Product Decisions

- 첫 구현은 sports-neutral 구조를 유지한다.
- MVP 데이터는 내부 seed 또는 관리자 등록 데이터를 전제로 한다.
- 리뷰 공개 범위는 MVP에서 공개 리뷰만 지원한다.
- 별점은 1.0~5.0 범위, 0.5 단위를 지원한다.
- 대표 감정은 리뷰당 1개만 선택한다.
- 팬 관점은 리뷰 작성 시 필수다.
- 팬 관점 값은 홈팀 팬, 원정팀 팬, 타팀 팬, 중립 팬으로 고정한다.
- 한 사용자는 한 경기당 하나의 관람 기록을 기본으로 한다.
- 한 사용자는 한 경기당 하나의 리뷰를 기본으로 한다.
- 한 사용자는 한 경기당 한 명의 MVP만 투표할 수 있다.
- MVP는 승리팀 선수로 제한하지 않는다.
- 좋아요는 추천이 아니라 공감의 의미로 사용한다.
- 동일 사용자는 동일 리뷰에 중복 좋아요를 남길 수 없다.

## 6. Core Screens For Frontend

- Home Feed
- Match Detail
- Write Review
- Profile
- Statistics
- Stadium Collection
- Badges
- Lists
- Wrapped

MVP API는 Home Feed, Match Detail, Write Review, Profile, Statistics를 우선 지원한다. Stadium Collection, Badges, Lists, Wrapped는 Post-MVP 화면으로 분리하되 읽기용 placeholder API는 확장 영역으로 남긴다.

## 7. Release Criteria

- 사용자가 계정을 만들고 로그인할 수 있다.
- 사용자가 경기를 검색하고 상세 정보를 볼 수 있다.
- 사용자가 관람 기록과 리뷰를 저장할 수 있다.
- 경기 페이지에 리뷰, 평점, 팬 관점별 평점이 반영된다.
- 경기 페이지에 경기 MVP, 감정, 태그 집계가 표시된다.
- 사용자가 리뷰 좋아요를 누르고 취소할 수 있다.
- 프로필에서 핵심 누적 통계를 확인할 수 있다.

## 8. KPI

- Daily Active Users
- Monthly Active Users
- 첫 경기 기록 완료율
- 리뷰 작성률
- 경기당 리뷰 수
- 경기당 MVP 투표 수
- 평균 체류 시간
- 재방문율
- 프로필 통계 조회율

## 9. Deferred Questions

아래 항목은 프론트엔드 개발을 막지 않으므로 Post-MVP 또는 백엔드 구현 단계에서 확정한다.

- 소셜 로그인 제공 여부
- 외부 스포츠 데이터 API 연동 여부
- 티켓 연동 제공사
- 비공개 기록 지원 여부
- 배지 지급 조건의 세부 수치
