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
- Discovery: 경기 검색, 태그 검색, 일자별 경기 모아보기
- Statistics: 사용자 통계, 경기 집계, Calendar / Diary 집계
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
### FavoriteTeam
- `id`
- `userId`
- `sportId`
- `leagueId`
- `teamId`
- `createdAt`
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
### MatchLogTag
- `matchLogId`
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
- User 1:N FavoriteTeam
- FavoriteTeam N:1 Sport
- FavoriteTeam N:1 League
- FavoriteTeam N:1 Team
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
- MatchLog N:M Tag through MatchLogTag
- User N:M Review through ReviewLike
- User 1:N MvpVote
- Match 1:N MvpVote
- Player 1:N MvpVote
## 5. Domain Rules
- 한 사용자는 한 경기당 하나의 MatchLog를 가진다.
- 한 MatchLog는 최대 하나의 Review를 가진다.
- 한 사용자는 한 경기당 하나의 Review를 기본으로 한다.
- MatchLog의 `fanPerspective`는 필수다.
- Review의 `rating`은 1.0 이상 5.0 이하이며 0.5 단위다.
- Review의 `fanPerspective`는 필수다.
- Review의 `emotion`은 선택이지만 선택 시 하나만 저장한다.
- User Tag는 사용자가 생성할 수 있다.
- Official Tag는 시스템 또는 관리자만 생성할 수 있다.
- Official Tag와 User Tag는 API와 UI에서 항상 구분되어야 한다.
- 한 사용자는 같은 리뷰에 좋아요를 한 번만 누를 수 있다.
- 한 사용자는 한 경기당 한 명의 MVP만 투표할 수 있다.
- MVP 후보는 해당 경기의 MatchPlayer에 포함되어야 한다.
- Timeline은 MatchLogAggregate를 최신순으로 보여준다.
- 사용자는 리그별로 여러 응원팀을 선택할 수 있다.
- `UserProfile.primaryTeamId`는 대표 표시용 하위 호환 필드이며, 실제 응원팀 관리는 `FavoriteTeam`을 기준으로 한다.
- 태그 선택은 태그 검색 결과 페이지(`/tags/{tagName}`)로 연결된다.
- 태그 검색은 Official Tag와 User Tag를 모두 대상으로 하며 `tagType`으로 필터링할 수 있다.
- 일자별 경기 목록은 `sportId`, `leagueId`, `favoriteTeamId`, `favoriteOnly` 필터를 지원한다.
- Calendar / Diary는 사용자의 MatchLogAggregate를 날짜 단위로 묶어 보여준다.
## 6. Aggregate Models
### MatchLogAggregate
- Fields: `matchLog`, `review`, `userTags`, `emotion`, `mvpVote`, `matchSummary`, `timelineDate`

MatchLogAggregate는 개인 기록의 기본 단위다. 리뷰가 없어도 MatchLogAggregate는 존재할 수 있다.
### MatchAggregate
- Fields: `reviewCount`, `averageRating`, `ratingByFanPerspective`, `ratingDistribution`, `ratingDistributionByFanPerspective`, `mvpLeaders`, `emotionDistribution`, `topTags`
### FanRatingDistribution
- Fields: `fanPerspective`, `averageRating`, `reviewCount`, `ratingDistribution`, `emotionDistribution`
### RatingBucket
- Fields: `rating`, `count`, `percentage`
### TagSearchResult
- Fields: `tag`, `reviewCount`, `matchCount`
### TagDetail
- Fields: `tag`, `reviewCount`, `matchCount`, `topMatches`
### DateMatchPage
- Fields: `date`, `items`, `page`, `size`, `total`
### CalendarDaySummary
- Fields: `date`, `logCount`, `reviewCount`, `averageRating`, `matches`
### CalendarMonth
- Fields: `month`, `days`
### CalendarDiaryDay
- Fields: `date`, `entries`, `logCount`, `reviewCount`, `averageRating`
### UserStats
- Fields: `totalMatches`, `inPersonMatches`, `liveMatches`, `averageRating`, `reviewCount`, `receivedLikes`, `mostWatchedTeams`, `mostWatchedPlayers`, `mostVisitedStadiums`, `inPersonWinRate`, `supportingTeamWinRate`, `topEmotions`, `timelineCount`
