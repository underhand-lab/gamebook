# PRD 05 - DB Schema & API

> Product: gamelog
>
> Version: 0.2
>
> Last Updated: 2026-06-28
>
> Source: `기획서.md`

---

## 1. Purpose

이 문서는 gamelog 구현을 위한 개념적 DB Schema와 API 요구사항 초안을 정의한다. 실제 마이그레이션이나 최종 API 계약은 아니다.

## 2. Design Principles

- 스포츠 종목에 종속되지 않는 구조여야 한다.
- 경기, 리뷰, 기록, 팬 관점, 집계 데이터를 분리한다.
- 사용자 기록은 장기 보존을 전제로 설계한다.
- 커뮤니티 집계는 재계산 가능해야 한다.
- 티켓, 배지, Wrapped 같은 Post-MVP 기능을 확장할 수 있어야 한다.

## 3. Core Entities

- `users`: id, email, display_name, avatar_url, created_at, updated_at
- `user_profiles`: user_id, bio, primary_team_id, visibility, created_at, updated_at
- `sports`: id, name, slug
- `leagues`: id, sport_id, name, country, slug
- `teams`: id, sport_id, league_id, name, short_name, slug
- `players`: id, sport_id, current_team_id, name, slug
- `stadiums`: id, name, city, country, latitude, longitude
- `matches`: id, sport_id, league_id, stadium_id, match_date, status, home_team_id, away_team_id, home_score, away_score, created_at, updated_at
- `match_players`: id, match_id, player_id, team_id
- `match_logs`: id, user_id, match_id, watched_at, watch_type, supporting_team_id, fan_perspective, attendance_verified, created_at, updated_at
- `reviews`: id, user_id, match_id, match_log_id, rating, title, body, spoiler, emotion, fan_perspective, created_at, updated_at
- `tags`: id, name, tag_type, created_by_user_id
- `review_tags`: review_id, tag_id
- `review_likes`: review_id, user_id, created_at
- `mvp_votes`: id, user_id, match_id, player_id, created_at, updated_at
- `lists`: id, user_id, title, description, visibility, created_at, updated_at
- `list_items`: id, list_id, match_id, position, note
- `badges`: id, name, category, condition_key
- `user_badges`: user_id, badge_id, earned_at
- `attendance_verifications`: id, user_id, match_id, match_log_id, provider, verification_status, verified_at

## 4. Enums

### fan_perspective

- `home_fan`
- `away_fan`
- `other_team_fan`
- `neutral_fan`

### watch_type

- `in_person`
- `live`
- `other`

### tag_type

- `official`
- `user`

### emotion

- `happy`
- `moved`
- `tense`
- `angry`
- `shocked`

## 5. Key Constraints

- `review_likes`는 `review_id + user_id` 조합이 유니크해야 한다.
- `mvp_votes`는 MVP 정책에 따라 `match_id + user_id` 조합 유니크 여부를 결정한다.
- 리뷰는 반드시 사용자와 경기에 연결되어야 한다.
- 공식 태그는 시스템 또는 관리자만 생성할 수 있어야 한다.
- 사용자는 본인의 기록, 리뷰, 리스트만 수정할 수 있어야 한다.

## 6. Aggregate Requirements

### Match Aggregates

- 전체 평균 평점
- 팬 관점별 평균 평점
- 리뷰 수
- 팬 관점별 리뷰 수
- 경기 MVP 투표 결과
- 감정 분포
- 사용자 태그 빈도
- 좋아요 수

### Profile Aggregates

- 총 경기 수
- 직관 수
- 라이브 수
- 평균 평점
- 리뷰 수
- 받은 좋아요 수
- 가장 많이 본 팀
- 가장 많이 본 선수
- 가장 많이 본 경기장
- 직관 승률
- 응원팀 승률

## 7. API Requirements

### Auth / Profile

- `POST /auth/signup`
- `POST /auth/login`
- `GET /me`
- `GET /users/{userId}`
- `PATCH /me/profile`

### Matches

- `GET /matches`
- `GET /matches/{matchId}`
- `GET /matches/{matchId}/reviews`
- `GET /matches/{matchId}/ratings`
- `GET /matches/{matchId}/mvp`
- `GET /matches/{matchId}/tags`

### Match Logs / Reviews

- `POST /matches/{matchId}/logs`
- `PATCH /logs/{logId}`
- `DELETE /logs/{logId}`
- `POST /matches/{matchId}/reviews`
- `PATCH /reviews/{reviewId}`
- `DELETE /reviews/{reviewId}`

### Community Actions

- `POST /reviews/{reviewId}/like`
- `DELETE /reviews/{reviewId}/like`
- `POST /matches/{matchId}/mvp-votes`
- `PATCH /matches/{matchId}/mvp-votes/me`

### Profile / Statistics

- `GET /users/{userId}/logs`
- `GET /users/{userId}/reviews`
- `GET /users/{userId}/stats`
- `GET /users/{userId}/badges`

### Post-MVP

- `POST /lists`
- `GET /users/{userId}/lists`
- `POST /lists/{listId}/items`
- `POST /tickets/connect`
- `GET /users/{userId}/stadiums`
- `GET /users/{userId}/wrapped/{year}`

## 8. API Response Principles

- 경기 상세 API는 기본 경기 정보와 집계 요약을 함께 제공해야 한다.
- 리뷰 목록 API는 팬 관점 필터를 지원해야 한다.
- 프로필 통계 API는 재계산 또는 캐시 전략을 선택할 수 있어야 한다.
- Post-MVP API는 MVP 출시 전 구현하지 않아도 되지만 확장 가능성을 고려한다.

## 9. Open Questions

- 인증 시스템은 자체 계정 기반인가, 소셜 로그인 중심인가?
- 경기 데이터는 외부 API에서 동기화할 것인가, 내부 관리자가 등록할 것인가?
- 평점 자료형과 범위는 어떻게 정의할 것인가?
- 리뷰와 경기 기록은 항상 1:1인가, 별점만 있는 기록도 허용할 것인가?
- 집계 데이터는 실시간 계산인가, 배치 또는 캐시 기반인가?
