# gamelog Domain Model

> Status: Finalized for MVP API
>
> Last Updated: 2026-06-28

---

## 1. Domain Boundaries

gamelog MVP 도메인은 다음 영역으로 나뉜다.
- Identity: 사용자, 프로필
- Sports Catalog: 종목, 리그, 팀, 선수, 경기장, 경기
- Lifelog: 관람 기록, 리뷰, 태그, 감정
- Community: 리뷰 좋아요, 경기 MVP 투표, 팬 관점별 집계
- Statistics: 사용자 통계, 경기 집계

## 2. Core Entities
### User
- `id`
- `email`
- `displayName`
- `avatarUrl`
- `createdAt`
- `updatedAt`
### UserProfile
- `userId`
- `bio`
- `primaryTeamId`
- `visibility`
### Sport
- `id`
- `name`
- `slug`
### League
- `id`
- `sportId`
- `name`
- `country`
- `slug`
### Team
- `id`
- `sportId`
- `leagueId`
- `name`
- `shortName`
- `slug`
### Player
- `id`
- `sportId`
- `currentTeamId`
- `name`
- `slug`
### Stadium
- `id`
- `name`
- `city`
- `country`
- `latitude`
- `longitude`
### Match
- `id`
- `sportId`
- `leagueId`
- `stadiumId`
- `matchDate`
- `status`
- `homeTeamId`
- `awayTeamId`
- `homeScore`
- `awayScore`
### MatchPlayer
- `matchId`
- `playerId`
- `teamId`
### MatchLog
- `id`
- `userId`
- `matchId`
- `watchedAt`
- `watchType`
- `supportingTeamId`
- `fanPerspective`
- `attendanceVerified`
### Review
- `id`
- `userId`
- `matchId`
- `matchLogId`
- `rating`
- `title`
- `body`
- `spoiler`
- `emotion`
- `fanPerspective`
- `createdAt`
- `updatedAt`
### Tag
- `id`
- `name`
- `tagType`
- `createdByUserId`
### ReviewTag
- `reviewId`
- `tagId`
### ReviewLike
- `reviewId`
- `userId`
- `createdAt`
### MvpVote
- `id`
- `userId`
- `matchId`
- `playerId`
- `createdAt`
- `updatedAt`

## 3. Enums
### MatchStatus
- `SCHEDULED`
- `LIVE`
- `FINAL`
- `POSTPONED`
- `CANCELED`
### WatchType
- `IN_PERSON`
- `LIVE`
- `OTHER`
### FanPerspective
- `HOME_FAN`
- `AWAY_FAN`
- `OTHER_TEAM_FAN`
- `NEUTRAL_FAN`
### Emotion
- `HAPPY`
- `MOVED`
- `TENSE`
- `ANGRY`
- `SHOCKED`
### TagType
- `OFFICIAL`
- `USER`
### ProfileVisibility
- `PUBLIC`
- `PRIVATE`

## 4. Relationships
- User 1:1 UserProfile
- Sport 1:N League
- Sport 1:N Team
- League 1:N Team
- League 1:N Match
- Team 1:N Player
- Team 1:N Match as home team
- Team 1:N Match as away team
- Stadium 1:N Match
- Match N:M Player through MatchPlayer
- User 1:N MatchLog
- Match 1:N MatchLog
- MatchLog 0:1 Review
- User 1:N Review
- Match 1:N Review
- Review N:M Tag through ReviewTag
- User N:M Review through ReviewLike
- User 1:N MvpVote
- Match 1:N MvpVote
- Player 1:N MvpVote

## 5. Domain Rules
- 한 사용자는 한 경기당 하나의 MatchLog를 가진다.
- 한 MatchLog는 최대 하나의 Review를 가진다.
- Review의 `rating`은 1.0 이상 5.0 이하이며 0.5 단위다.
- Review의 `fanPerspective`는 필수다.
- Review의 `emotion`은 선택이지만 선택 시 하나만 저장한다.
- User Tag는 사용자가 생성할 수 있다.
- Official Tag는 시스템 또는 관리자만 생성할 수 있다.
- 한 사용자는 같은 리뷰에 좋아요를 한 번만 누를 수 있다.
- 한 사용자는 한 경기당 한 명의 MVP만 투표할 수 있다.
- MVP 후보는 해당 경기의 MatchPlayer에 포함되어야 한다.

## 6. Aggregate Models
### MatchAggregate
- `reviewCount`
- `averageRating`
- `ratingByFanPerspective`
- `mvpLeaders`
- `emotionDistribution`
- `topTags`
### UserStats
- `totalMatches`
- `inPersonMatches`
- `liveMatches`
- `averageRating`
- `reviewCount`
- `receivedLikes`
- `mostWatchedTeams`
- `mostWatchedPlayers`
- `mostVisitedStadiums`
- `inPersonWinRate`
- `supportingTeamWinRate`
