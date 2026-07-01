# PRD 02 - User Flow & IA

> Product: gamelog
>
> Version: 0.2
>
> Last Updated: 2026-06-28
>
> Source: `document/plan.md`

---
## 1. Purpose

이 문서는 gamelog의 핵심 사용자 흐름과 정보 구조를 정의한다. 제품의 중심 흐름은 경기 검색, 관람 기록, 리뷰 작성, 커뮤니티 확인, 프로필 회고다.
## 2. Core Experience
1. 경기를 찾는다.
2. 관람을 기록한다.
3. 리뷰를 남긴다.
4. 다른 팬들과 소통한다.
5. 자신의 스포츠 인생을 돌아본다.
## 3. Primary IA
- Home: 홈 피드 탭(내 포스트, 친구 포스트, 전체 최신), 프로필/통계 진입점
- Timeline: 내 MatchLogAggregate 기반 개인 기록 피드
- Search: 경기 검색, 태그 검색
- Match Detail: 경기 정보, 리뷰, 평점, 경기 MVP, 감정, 태그 집계
- Tag Results: 태그 기반 경기 검색 결과
- Date Matches: 특정 일자의 경기 목록과 필터
- Calendar / Diary: 내 기록 달력과 일자별 기록 상세
- Log Match: 관람 방식, 응원팀, 팬 관점, 리뷰 입력
- Profile: 내 기록, 리그/팀 기준 통계 스코프, 다중 응원팀, 리뷰 목록
- Notifications: 좋아요 등 기본 활동 알림
## 4. Secondary IA
- Lists: 사용자 큐레이션 리스트
- Stadium Collection: 방문 경기장 지도
- Badges: 획득 배지
- Wrapped: 연간 스포츠 활동 요약
- Settings: 계정, 공개 범위, 연결 서비스
## 5. First-Time User Flow
### Main Flow
1. 사용자는 회원가입 또는 로그인 화면으로 진입한다.
2. 계정 생성 후 기본 프로필을 설정한다.
3. 응원팀을 설정하거나 건너뛴다.
4. 경기 검색 또는 기록 작성 흐름으로 이동한다.
### Required Outcomes
- 사용자는 자신의 프로필 페이지를 가진다.
- 사용자는 경기 검색 또는 기록 작성 흐름으로 이동할 수 있다.
### Open Policy
- 온보딩에서 응원팀을 필수로 받을지 여부는 미정이다.
## 6. Match Logging Flow
### Main Flow
1. 사용자가 경기 검색 화면에 진입한다.
2. 경기명, 팀명, 날짜 등으로 경기를 검색한다.
3. 검색 결과에서 경기를 선택한다.
4. 관람 방식을 선택한다.
5. 응원팀 또는 팬 관점을 선택한다.
6. 별점, 한줄평, 장문 리뷰, 스포일러 여부, 태그를 입력한다.
7. 대표 감정을 선택한다.
8. 경기 MVP를 선택한다.
9. 기록을 저장한다.
10. 저장 후 Timeline, 경기 페이지, 프로필에 반영된다.
### Required Fields
- 경기
- 관람 방식
- 팬 관점
- 별점
### Optional Fields
- 한줄평
- 장문 리뷰
- 스포일러 여부
- 태그
- 대표 감정
- 경기 MVP
### Watch Type
- 직관
- 라이브
- 기타

추가 관람 방식은 향후 결정한다.
## 7. Match Detail Flow
### Page Purpose

모든 경기는 하나의 페이지를 가진다. 경기 페이지는 해당 경기의 커뮤니티 기억을 집계하는 Community Hub다.
### Content Blocks
- 경기 기본 정보
- 전체 커뮤니티 평점
- 팬 관점별 평점
- 개인 별점 분포
- 리뷰 목록
- 경기 MVP 집계
- 감정 집계
- 공식 태그
- 사용자 태그
- 기록하기 CTA
- 팬 관점별 하이라이트
- 감정/태그 기반 경기 분위기 요약
### Filters
- 전체 리뷰
- 홈팀 팬 리뷰
- 원정팀 팬 리뷰
- 타팀 팬 리뷰
- 중립 팬 리뷰

팬 관점 필터는 데스크톱에서는 탭, 모바일에서는 segmented control로 제공한다.
### Sort Options
- 최신순
- 좋아요순
- 평점 높은순
- 평점 낮은순

정렬 정책은 MVP 구현 전 확정한다.
## 8. Review Interaction Flow
1. 사용자는 경기 페이지에서 리뷰 목록을 본다.
2. 팬 관점 필터를 선택한다.
3. 리뷰 상세 내용을 읽는다.
4. 공감하는 리뷰에 좋아요를 누른다.
5. 스포일러 리뷰는 명시적 표시 후 내용을 확인한다.
## 9. Profile Flow
### Page Purpose

프로필은 사용자의 모든 기록이 저장되는 공간이다.
### Content Blocks
- 사용자 기본 정보
- 응원팀
- 총 경기 수
- 직관 수
- 라이브 수
- 평균 평점
- 리뷰 수
- 좋아요 수
- 기록한 경기 목록
- 기본 통계
### Profile Actions
- 내 기록 보기
- 내 리뷰 보기
- 내 통계 보기
- 응원팀 확인 또는 수정
- 리그별 여러 응원팀 선택 또는 해제, 통계 스코프 전환

응원팀 관리는 `/profile/favorite-teams`에서 제공한다.
## 10. Timeline Flow
### Page Purpose

Timeline은 사용자의 기록이 시간순으로 쌓이는 MVP 핵심 화면이다. 리뷰 목록이 아니라 MatchLogAggregate 목록을 보여준다.
### Content Blocks
- 관람 날짜
- 경기 요약
- 관람 방식
- 팬 관점
- 별점
- 대표 감정
- 태그
- 리뷰 요약
- 경기 MVP 선택
### Requirements
- 기본 정렬은 최신순이다.
- 리뷰가 없어도 관람 기록은 Timeline에 표시된다.
- 모바일에서는 하단 탭의 중심 항목으로 둔다.
## 11. Tag Search Flow
### Page Purpose

태그 검색은 같은 감정과 기억으로 묶인 경기를 찾는 진입점이다.
### Requirements
- 사용자는 태그명을 검색할 수 있다.
- 태그 선택 시 `/tags/{tagName}`으로 이동한다.
- 태그 결과 페이지는 태그 요약, 리뷰 수, 경기 수, 연결된 경기 목록을 보여준다.
- 태그 결과의 경기 선택은 `/matches/{matchId}`로 이동한다.
## 12. Date Match Browse Flow
### Page Purpose

일자별 경기 목록은 특정 날짜에 열린 경기를 종목, 리그, 응원팀 기준으로 모아본다.
### Requirements
- 라우트는 `/games/date/YYYY-MM-DD`를 사용한다.
- 필터는 응원팀, 종목, 리그를 지원한다.
- 응원팀 필터는 사용자의 `FavoriteTeam[]`을 기준으로 한다.
## 13. Calendar / Diary Flow
### Page Purpose

Calendar / Diary는 사용자가 자신의 관람 기록을 날짜 단위로 회고하는 화면이다.
### Requirements
- `/calendar`는 월별 기록 요약을 보여준다.
- `/calendar?date=YYYY-MM-DD`는 선택 날짜의 Diary를 함께 보여준다.
- Diary 항목은 MatchLogAggregate를 사용한다.
## 14. Routing
- `/matches`
- `/matches/{matchId}`
- `/tags/{tagName}`
- `/calendar`
- `/calendar?date=YYYY-MM-DD`
- `/games/date/YYYY-MM-DD`
- `/profile/favorite-teams`
## 15. Empty States
- No Match Logs: 경기 검색과 기록 작성으로 이동할 수 있어야 한다.
- No Reviews on Match: 첫 리뷰 작성을 유도한다.
- No Search Results: 검색어 수정 또는 경기 등록 요청 정책을 제공할 수 있다.
## 16. Permission States
- 로그인하지 않은 사용자는 경기 페이지와 공개 리뷰를 볼 수 있다.
- 리뷰 작성, 좋아요, 경기 MVP 투표는 로그인한 사용자만 가능하다.
- 본인 기록과 리뷰는 본인만 수정할 수 있다.
## 17. Mobile UX Requirements
- 하단 탭은 Home, Search, Record, Timeline, Profile을 우선한다.
- Record CTA는 엄지 접근이 쉬운 고정 액션으로 제공한다.
- Write Review는 경기 선택, 기록 정보, 리뷰 입력, 확인 단계로 분리한다.
- 팬 관점 필터는 한 손 조작 가능한 segmented control로 제공한다.
- 긴 리뷰와 스포일러는 기본 접힘 상태를 지원한다.
## 18. Acceptance Criteria
- 사용자는 검색에서 기록 저장까지 하나의 흐름으로 완료할 수 있다.
- 기록 저장 후 Timeline, 경기 페이지, 프로필에 반영된다.
- 경기 페이지에서 팬 관점별 리뷰 필터를 사용할 수 있다.
- 경기 페이지에서 평균 평점과 개인 별점 분포를 함께 확인할 수 있다.
- 태그를 선택하면 태그 검색 결과 페이지로 이동한다.
- 일자별 경기 목록에서 응원팀, 종목, 리그 필터를 사용할 수 있다.
- Calendar / Diary에서 날짜별 내 기록을 확인할 수 있다.
- 프로필에서 리그별 여러 응원팀을 관리할 수 있다.
- 프로필에서 누적 기록과 기본 통계를 확인할 수 있다.
- 프로필의 통계 영역은 리그/팀 스코프에 따라 전환된다.
- 스포일러 리뷰는 일반 리뷰와 구분된다.
## 19. Open Questions
- 경기 검색 결과가 없을 때 사용자가 직접 경기를 등록할 수 있는가?
- 리뷰 작성과 관람 기록 저장을 하나의 화면에서 처리할 것인가?
- 팬 관점과 응원팀은 별도 필드인가, 하나의 선택 흐름으로 묶을 것인가?
- 비로그인 사용자가 볼 수 있는 정보 범위는 어디까지인가?
