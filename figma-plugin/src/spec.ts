export type PanelKind =
  | "match"
  | "review"
  | "chips"
  | "score"
  | "bars"
  | "form"
  | "profile"
  | "map"
  | "stadium"
  | "badges"
  | "list"
  | "wrapped";

export type ScreenSpec = {
  name: string;
  subtitle: string;
  tabs: string[];
  metrics: string[];
  panels: { title: string; kind: PanelKind; items: string[] }[];
};

export const screens: ScreenSpec[] = [
  {
    name: "Home Feed",
    subtitle: "Remember Every Game.",
    tabs: ["For You", "Following", "KBO", "Football", "eSports"],
    metrics: ["12 games this week", "4.6 avg rating", "128 new reviews"],
    panels: [
      { title: "Featured Matches", kind: "match", items: ["FC Seoul vs Jeonbuk", "KBO Playoff Game 5", "Lakers vs Warriors"] },
      { title: "Latest Reviews", kind: "review", items: ["올해 최고의 직관이었다", "원정 팬 입장에서는 너무 아쉬운 경기", "마지막 10분이 모든 것을 바꿨다"] },
      { title: "Trending Tags", kind: "chips", items: ["플레이오프", "올해최고", "다시보고싶다", "최고의직관"] }
    ]
  },
  {
    name: "Timeline",
    subtitle: "MatchLogAggregate 기반 개인 기록 피드",
    tabs: ["All Logs", "In Person", "Live", "High Rating"],
    metrics: ["148 timeline items", "38 in person", "Top emotion: moved"],
    panels: [
      { title: "MatchLogAggregate Feed", kind: "match", items: ["FC Seoul vs Jeonbuk / 4.5", "KBO Playoff Game 5 / moved", "Worlds Finals / 최고의직관"] },
      { title: "Record Snapshot", kind: "review", items: ["fanPerspective: HOME_FAN", "emotion: MOVED", "mvpVote: player-10"] },
      { title: "Typed Tags", kind: "chips", items: ["OFFICIAL: 결승전", "USER: 올해최고", "USER: 다시보고싶다"] }
    ]
  },
  {
    name: "Match Detail",
    subtitle: "경기 정보, 팬 관점별 리뷰, 평점, MVP, 감정, 태그 집계",
    tabs: ["전체", "홈팬", "원정팬", "타팀 팬", "중립 팬"],
    metrics: ["4.7 community rating", "832 reviews", "MVP 42%"],
    panels: [
      { title: "Scoreboard", kind: "score", items: ["FC Seoul 3", "Jeonbuk 2", "2026.06.28 / Seoul World Cup Stadium"] },
      { title: "Fan Perspective Rating", kind: "bars", items: ["전체 94", "홈팬 98", "원정팬 71", "중립 88"] },
      { title: "Reviews", kind: "review", items: ["첫 직관으로 평생 기억될 경기", "패배했지만 MVP는 원정팀 골키퍼", "스포일러 포함 리뷰 예시"] }
    ]
  },
  {
    name: "Write Review",
    subtitle: "관람 방식, 팬 관점, 별점, 리뷰, 감정, 태그, MVP 입력",
    tabs: ["경기 선택", "리뷰 작성", "확인"],
    metrics: ["Required: match", "Required: rating", "Required: fan view"],
    panels: [
      { title: "Selected Match", kind: "match", items: ["FC Seoul vs Jeonbuk", "Final / 3-2", "직관 인증 대기"] },
      { title: "Review Form", kind: "form", items: ["관람 방식", "팬 관점", "별점", "한줄평", "장문 리뷰", "대표 감정", "MVP", "태그"] },
      { title: "Preview", kind: "review", items: ["홈팀 팬 / 4.5", "스포일러 표시", "좋아요는 공감의 의미"] }
    ]
  },
  {
    name: "Profile",
    subtitle: "사용자의 모든 경기 기록과 리뷰를 저장하는 공간",
    tabs: ["Overview", "Reviews", "Matches", "Lists"],
    metrics: ["148 total games", "38 in person", "4.2 avg rating"],
    panels: [
      { title: "Profile Header", kind: "profile", items: ["easyh", "응원팀 FC Seoul", "첫 직관 2019"] },
      { title: "Recent Logs", kind: "match", items: ["FC Seoul vs Jeonbuk", "KBO Playoff Game 5", "Worlds Finals"] },
      { title: "Recent Reviews", kind: "review", items: ["첫 직관은 평생 기억된다", "올해 최고의 경기", "다시 보고 싶은 경기"] }
    ]
  },
  {
    name: "Statistics",
    subtitle: "가장 많이 본 팀, 선수, 경기장, 직관 승률, 응원팀 승률",
    tabs: ["Summary", "Teams", "Players", "Stadiums"],
    metrics: ["Most watched: FC Seoul", "In-person win rate 61%", "Support team win rate 54%"],
    panels: [
      { title: "Top Teams", kind: "bars", items: ["FC Seoul 88", "Doosan Bears 56", "Lakers 34", "T1 29"] },
      { title: "Top Stadiums", kind: "bars", items: ["Seoul WC 72", "Jamsil 31", "Gocheok 14"] },
      { title: "Rating Distribution", kind: "bars", items: ["5 stars 64", "4 stars 48", "3 stars 21", "2 stars 8"] }
    ]
  },
  {
    name: "Stadium Collection",
    subtitle: "방문한 경기장을 수집하고 지도 형태로 확인",
    tabs: ["Map", "Visited", "Wishlist"],
    metrics: ["14 stadiums visited", "38 verified visits", "3 countries"],
    panels: [
      { title: "Visited Map", kind: "map", items: ["Seoul", "Busan", "Incheon", "Daegu"] },
      { title: "Stadium Cards", kind: "stadium", items: ["Seoul World Cup Stadium", "Jamsil Baseball Stadium", "Gocheok Sky Dome"] },
      { title: "Verification", kind: "chips", items: ["Verified Attendance", "Ticket linked", "Manual log"] }
    ]
  },
  {
    name: "Badges",
    subtitle: "경험, 활동, 특별 순간을 배지로 보관",
    tabs: ["All", "Experience", "Activity", "Special"],
    metrics: ["18 earned", "7 experience", "4 special"],
    panels: [
      { title: "Experience", kind: "badges", items: ["첫 경기", "첫 직관", "첫 승리", "첫 포스트시즌", "첫 해외 직관"] },
      { title: "Activity", kind: "badges", items: ["첫 리뷰", "리뷰왕", "출석왕"] },
      { title: "Special", kind: "badges", items: ["우승 직관", "노히트노런 직관", "해트트릭 직관"] }
    ]
  },
  {
    name: "Lists",
    subtitle: "사용자가 자신만의 경기 리스트를 만드는 공간",
    tabs: ["My Lists", "Liked", "Discover"],
    metrics: ["8 lists", "312 likes", "42 saved matches"],
    panels: [
      { title: "My Lists", kind: "list", items: ["최고의 경기", "최고의 직관", "울었던 경기"] },
      { title: "List Detail", kind: "match", items: ["2019 첫 직관", "2026 최고의 경기", "2031 우승 직관"] },
      { title: "Community Likes", kind: "review", items: ["리스트 좋아요는 Post-MVP", "공감 기반 인터랙션", "큐레이션 공유"] }
    ]
  },
  {
    name: "Wrapped",
    subtitle: "매년 스포츠 활동을 자동 요약",
    tabs: ["2026", "Highlights", "Share"],
    metrics: ["72 games watched", "18 in person", "4.5 avg rating"],
    panels: [
      { title: "Year Summary", kind: "wrapped", items: ["올해 본 경기 72", "직관 횟수 18", "최고의 경기 FC Seoul Final"] },
      { title: "Top Memories", kind: "match", items: ["첫 원정 직관", "우승 직관", "올해 최고의 리뷰"] },
      { title: "Share Preview", kind: "chips", items: ["팬의 스포츠 인생", "기억 중심", "연간 회고"] }
    ]
  }
];
