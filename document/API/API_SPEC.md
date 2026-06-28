# gamelog API Spec
> Status: Finalized for frontend mock and backend implementation
>
> Last Updated: 2026-06-28
>
> OpenAPI: `document/API/openapi.yaml`

---
## 1. Scope

이 API Spec은 MVP 프론트엔드 mock adapter와 Spring Boot 백엔드 구현이 공유할 계약을 정의한다.

MVP API는 다음 기능을 지원한다.
- 인증
- 내 프로필
- 경기 검색과 상세 조회
- 관람 기록
- Timeline
- 리뷰
- 리뷰 좋아요
- 경기 MVP 투표
- 사용자 통계
## 2. Base Contract
- Base URL: `/api/v1`
- Format: JSON
- Auth: Bearer token
- Time format: ISO-8601
- ID format: string
## 3. Error Response

모든 오류는 동일한 형태를 사용한다.
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request",
  "details": [
    { "field": "rating", "reason": "must be between 1.0 and 5.0" }
  ]
}
```
## 4. Endpoints
### Auth

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/auth/signup` | 회원가입 | No |
| POST | `/auth/login` | 로그인 | No |
| GET | `/me` | 내 계정과 프로필 조회 | Yes |
| PATCH | `/me/profile` | 내 프로필 수정 | Yes |
### Catalog

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/sports` | 종목 목록 | No |
| GET | `/leagues` | 리그 목록 | No |
| GET | `/teams` | 팀 목록 | No |
### Matches

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/matches` | 경기 검색 | No |
| GET | `/matches/{matchId}` | 경기 상세 | No |
| GET | `/matches/{matchId}/reviews` | 경기 리뷰 목록 | No |
| GET | `/matches/{matchId}/aggregate` | 경기 집계 | No |
| GET | `/matches/{matchId}/players` | 경기 MVP 후보 선수 | No |
### Match Logs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/matches/{matchId}/logs` | 관람 기록 생성 | Yes |
| GET | `/me/logs` | 내 관람 기록 목록 | Yes |
| GET | `/me/timeline` | 내 Timeline 조회 | Yes |
| PATCH | `/logs/{logId}` | 관람 기록 수정 | Yes |
| DELETE | `/logs/{logId}` | 관람 기록 삭제 | Yes |
### Reviews

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/matches/{matchId}/reviews` | 리뷰 생성 | Yes |
| PATCH | `/reviews/{reviewId}` | 리뷰 수정 | Yes |
| DELETE | `/reviews/{reviewId}` | 리뷰 삭제 | Yes |
| POST | `/reviews/{reviewId}/like` | 리뷰 좋아요 | Yes |
| DELETE | `/reviews/{reviewId}/like` | 리뷰 좋아요 취소 | Yes |
### MVP Votes

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| PUT | `/matches/{matchId}/mvp-vote` | 내 경기 MVP 투표 생성 또는 변경 | Yes |
| DELETE | `/matches/{matchId}/mvp-vote` | 내 경기 MVP 투표 취소 | Yes |
### Profile / Statistics

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/users/{userId}` | 공개 프로필 조회 | No |
| GET | `/users/{userId}/timeline` | 사용자 공개 Timeline 조회 | No |
| GET | `/users/{userId}/reviews` | 사용자 리뷰 목록 | No |
| GET | `/users/{userId}/stats` | 사용자 통계 조회 | No |
## 5. Query Parameters
### GET `/matches`
- `q`: 경기명, 팀명 검색어
- `sportId`: 종목 필터
- `leagueId`: 리그 필터
- `teamId`: 팀 필터
- `from`: 경기 시작일
- `to`: 경기 종료일
- `page`: 페이지 번호
- `size`: 페이지 크기
### GET `/matches/{matchId}/reviews`
- `fanPerspective`: `HOME_FAN`, `AWAY_FAN`, `OTHER_TEAM_FAN`, `NEUTRAL_FAN`
- `sort`: `LATEST`, `MOST_LIKED`, `RATING_HIGH`, `RATING_LOW`
- `page`
- `size`
## 6. Request DTOs
### SignupRequest
- Fields: `email`, `password`, `displayName`
### LoginRequest
- Fields: `email`, `password`
### UpdateProfileRequest
- Fields: `displayName`, `bio`, `primaryTeamId`
### CreateMatchLogRequest
- Fields: `watchedAt`, `watchType`, `supportingTeamId`, `fanPerspective`
### UpdateMatchLogRequest
- Same fields as `CreateMatchLogRequest`
### CreateReviewRequest
- Fields: `matchLogId`, `rating`, `title`, `body`, `spoiler`, `emotion`, `userTagNames`
### UpdateReviewRequest
- Fields: `rating`, `title`, `body`, `spoiler`, `emotion`, `userTagNames`
### UpsertMvpVoteRequest
- Fields: `playerId`
## 7. Response DTOs
### AuthResponse
- Fields: `accessToken`, `user`
### UserDetail
- Fields: `id`, `email`, `displayName`, `avatarUrl`, `bio`, `primaryTeam`
### UserSummary
- Fields: `id`, `displayName`, `avatarUrl`
### Sport
- Fields: `id`, `name`, `slug`
### League
- Fields: `id`, `sportId`, `name`, `country`, `slug`
### Team
- Fields: `id`, `sportId`, `leagueId`, `name`, `shortName`, `slug`
### Player
- Fields: `id`, `sportId`, `currentTeamId`, `name`, `slug`
### Stadium
- Fields: `id`, `name`, `city`, `country`, `latitude`, `longitude`
### Score
- Fields: `home`, `away`
### MatchSummary
- Fields: `id`, `sport`, `league`, `homeTeam`, `awayTeam`, `matchDate`, `status`, `score`, `averageRating`, `reviewCount`
### MatchDetail
- Fields: `id`, `sport`, `league`, `stadium`, `homeTeam`, `awayTeam`, `matchDate`, `status`, `score`, `aggregate`
### MatchAggregate
- Fields: `reviewCount`, `averageRating`, `ratingByFanPerspective`, `mvpLeaders`, `emotionDistribution`, `topTags`
### FanRating
- Fields: `fanPerspective`, `averageRating`, `reviewCount`
### MvpLeader
- Fields: `player`, `voteCount`, `percentage`
### EmotionCount
- Fields: `emotion`, `count`
### TagCount
- Fields: `tag`, `count`
### MatchLog
- Fields: `id`, `userId`, `match`, `watchedAt`, `watchType`, `supportingTeam`, `fanPerspective`, `attendanceVerified`
### Review
- Fields: `id`, `matchId`, `user`, `rating`, `title`, `body`, `spoiler`, `emotion`, `fanPerspective`, `tags`, `likeCount`, `likedByMe`, `createdAt`, `updatedAt`
### Tag
- Fields: `id`, `name`, `tagType`
### MvpVote
- Fields: `id`, `matchId`, `userId`, `player`, `createdAt`, `updatedAt`
### MatchLogAggregate
- Fields: `matchLog`, `review`, `userTags`, `emotion`, `mvpVote`, `matchSummary`, `timelineDate`
### Page Responses
- `MatchPage`, `ReviewPage`, `MatchLogPage`, `MatchLogAggregatePage`: `items`, `page`, `size`, `total`
### RankedTeam
- Fields: `team`, `count`
### RankedPlayer
- Fields: `player`, `count`
### RankedStadium
- Fields: `stadium`, `count`
### UserStats
- Fields: `totalMatches`, `inPersonMatches`, `liveMatches`, `averageRating`, `reviewCount`, `receivedLikes`, `mostWatchedTeams`, `mostWatchedPlayers`, `mostVisitedStadiums`, `inPersonWinRate`, `supportingTeamWinRate`, `topEmotions`, `timelineCount`
## 8. Implementation Notes
- 프론트 mock adapter는 이 문서의 DTO 이름과 필드명을 그대로 사용한다.
- Spring Boot 백엔드는 `openapi.yaml`을 기준으로 controller contract를 맞춘다.
- Timeline은 `MatchLogAggregatePage` 응답을 사용한다.
- `Review.tags`, `MatchAggregate.topTags`, `MatchLogAggregate.userTags`는 Typed Tag를 사용한다.
- Post-MVP 기능은 MVP API에 포함하지 않는다.
