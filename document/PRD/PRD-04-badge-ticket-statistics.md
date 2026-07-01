# PRD 04 - Badge / Ticket / Statistics

> Product: gamelog
>
> Version: 0.2
>
> Last Updated: 2026-06-28
>
> Source: `document/plan.md`

---

## 1. Purpose

이 문서는 gamelog의 프로필 통계, 경기장 컬렉션, 티켓 연동, 직관 인증, 배지, Wrapped 요구사항을 정의한다.

## 2. Scope Summary

### MVP Scope

- 프로필 기본 통계
- 사용자 기록 기반 자동 통계

### Post-MVP Scope

- 경기장 컬렉션
- 티켓 예매 사이트 연동
- 자동 기록
- 직관 인증
- Verified Attendance
- 배지
- 연간 Wrapped

## 3. Profile Statistics

프로필에는 사용자의 모든 기록이 저장되며, 통계는 선택한 리그 또는 응원팀 범위로 전환될 수 있다.

### Required Metrics

- 총 경기 수
- 직관 수
- 라이브 수
- 평균 평점
- 별점 분포
- 가장 많이 선택한 감정
- 리뷰 수
- 좋아요 수
- 리그별 다중 응원팀
- 월별 기록 일수
- 일자별 기록 수

### Requirements

- 프로필은 사용자의 누적 기록을 보여줘야 한다.
- 기록 작성, 수정, 삭제 이후 프로필 통계가 갱신되어야 한다.
- 통계는 사용자 본인의 스포츠 활동을 회고하기 쉽게 제공되어야 한다.
- 프로필 통계는 전체, 리그, 팀 스코프 전환을 지원해야 한다.

## 4. Generated Statistics

시스템은 사용자 기록을 기반으로 통계를 자동 생성한다.

### Required Statistics

- 가장 많이 본 팀
- 가장 많이 본 선수
- 가장 많이 본 경기장
- 직관 승률
- 응원팀 승률
- 평균 평점
- 별점 분포
- Calendar / Diary 월별 요약

### Calculation Requirements

- 통계는 사용자가 저장한 경기 기록을 기준으로 계산한다.
- 직관 승률은 관람 방식이 직관인 기록을 기준으로 계산한다.
- 응원팀 승률은 MatchLog의 supportingTeam 및 FavoriteTeam과 경기 결과를 기준으로 계산한다.
- 평균 평점은 사용자가 남긴 별점을 기준으로 계산한다.
- 별점 분포는 사용자가 남긴 별점을 1.0~5.0 구간으로 묶어 계산한다.
- 감정 통계는 MatchLogAggregate에 연결된 대표 감정을 기준으로 계산한다.
- Calendar / Diary는 MatchLogAggregate를 날짜 단위로 묶어 계산한다.
- 승률 계산은 경기 결과 데이터와 팀 매핑이 필요하다.

## 5. Stadium Collection

사용자는 방문한 경기장을 수집한다. 경기장 컬렉션은 지도 형태로 제공한다.

### Requirements

- 직관 기록에 경기장 정보가 연결되어야 한다.
- 사용자가 방문한 경기장 목록을 확인할 수 있어야 한다.
- 경기장 컬렉션은 지도 UI로 확장될 수 있어야 한다.
- 경기장별 방문 횟수를 표시할 수 있어야 한다.

### Scope Decision

경기장 컬렉션은 Post-MVP로 분류한다.

## 6. Ticket Integration

예매 사이트 연동을 통해 자동 기록과 직관 인증을 제공한다.

### Expected Capabilities

- 예매 사이트 연동
- 티켓 기반 자동 기록
- 직관 인증
- Verified Attendance 표시

### Requirements

- 사용자는 티켓 또는 예매 내역을 연결할 수 있어야 한다.
- 연결된 티켓은 특정 경기와 매칭되어야 한다.
- 인증된 직관 기록에는 Verified Attendance가 표시되어야 한다.
- 인증 상태는 프로필, 경기 기록, 리뷰에 표시될 수 있어야 한다.

### Scope Decision

티켓 연동은 외부 서비스 의존성이 크므로 Post-MVP로 분류한다.

## 7. Badges

배지는 사용자의 스포츠 경험과 활동을 상징한다.

### Experience Badges

- 첫 경기
- 첫 직관
- 첫 승리
- 첫 포스트시즌
- 첫 해외 직관

### Activity Badges

- 첫 리뷰
- 리뷰왕
- 출석왕

### Special Badges

- 우승 직관
- 노히트노런 직관
- 해트트릭 직관

### Requirements

- 배지는 조건 충족 시 사용자에게 부여되어야 한다.
- 배지는 프로필에 표시될 수 있어야 한다.
- 배지 조건은 기록, 경기 결과, 경기 태그, 직관 인증 여부를 기반으로 할 수 있다.

### Scope Decision

배지는 Post-MVP로 분류한다.

## 8. Wrapped

Wrapped는 매년 사용자의 스포츠 활동을 자동으로 요약한다.

### Summary Items

- 올해 본 경기
- 직관 횟수
- 최고의 경기
- 평균 평점
- 올해 가장 많이 느낀 감정
- 감정별 기억에 남는 경기

### Requirements

- 사용자의 연간 기록을 기반으로 요약을 생성해야 한다.
- Wrapped는 사용자가 자신의 스포츠 인생을 돌아보는 회고 기능이어야 한다.
- Wrapped는 별점뿐 아니라 감정, 팬 관점, 태그를 함께 요약해야 한다.
- 공유 기능은 별도 정책으로 분리한다.

### Scope Decision

Wrapped는 충분한 기록 데이터가 쌓인 이후 제공하는 Post-MVP 기능이다.

## 9. Data Dependencies

- 사용자 기록
- 경기 정보
- 경기 결과
- 팀 정보
- 선수 정보
- 경기장 정보
- 관람 방식
- 티켓 또는 인증 정보
- 공식 태그
- FavoriteTeam
- CalendarMonth
- CalendarDiaryDay

## 10. Acceptance Criteria

- 프로필에서 총 경기 수, 직관 수, 라이브 수, 평균 평점, 별점 분포, 리뷰 수, 좋아요 수를 확인할 수 있다.
- 사용자의 기록을 기반으로 가장 많이 본 팀, 선수, 경기장을 계산할 수 있다.
- 직관 승률과 응원팀 승률 계산에 필요한 데이터 의존성이 명확하다.
- Calendar / Diary에서 월별 기록 요약과 일자별 MatchLogAggregate 목록을 확인할 수 있다.
- 경기장 컬렉션, 티켓 연동, 배지, Wrapped는 Post-MVP 요구사항으로 분리된다.
- Emotion은 사용자 통계와 Wrapped 요약에 반영된다.

## 11. Open Questions

- 라이브 관람과 기타 관람 방식의 세부 분류는 어떻게 정의할 것인가?
- 직관 인증은 티켓 연동만 인정할 것인가, 수동 인증도 허용할 것인가?
- 티켓 연동 대상 예매 사이트는 어디부터 지원할 것인가?
- 배지는 공개 프로필에 노출할 것인가?
- Wrapped는 자동 생성만 제공할 것인가, 사용자가 직접 편집할 수 있는가?
