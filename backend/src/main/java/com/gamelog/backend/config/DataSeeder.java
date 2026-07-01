package com.gamelog.backend.config;

import com.gamelog.backend.catalog.entity.LeagueEntity;
import com.gamelog.backend.catalog.entity.SportEntity;
import com.gamelog.backend.catalog.entity.TeamEntity;
import com.gamelog.backend.catalog.repository.LeagueRepository;
import com.gamelog.backend.catalog.repository.SportRepository;
import com.gamelog.backend.catalog.repository.TeamRepository;
import com.gamelog.backend.match.entity.MatchEntity;
import com.gamelog.backend.match.repository.MatchRepository;
import com.gamelog.backend.review.entity.ReviewEntity;
import com.gamelog.backend.review.repository.ReviewRepository;
import com.gamelog.backend.user.entity.FavoriteTeamEntity;
import com.gamelog.backend.user.entity.UserEntity;
import com.gamelog.backend.user.repository.FavoriteTeamRepository;
import com.gamelog.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(
      SportRepository sports,
      LeagueRepository leagues,
      TeamRepository teams,
      UserRepository users,
      FavoriteTeamRepository favoriteTeams,
      MatchRepository matches,
      ReviewRepository reviews) {
    return args -> {
      if (sports.count() > 0) return;

      SportEntity baseball = sports.save(new SportEntity("sport-baseball", "Baseball", "baseball"));
      SportEntity football = sports.save(new SportEntity("sport-football", "Football", "football"));
      LeagueEntity kbo = leagues.save(new LeagueEntity("league-kbo", baseball.getId(), "KBO", "KR", "kbo"));
      LeagueEntity k1 = leagues.save(new LeagueEntity("league-k1", football.getId(), "K League 1", "KR", "k-league-1"));
      TeamEntity lg = teams.save(new TeamEntity("team-lg", baseball.getId(), kbo.getId(), "LG Twins", "LGT", "lg-twins"));
      TeamEntity doosan = teams.save(new TeamEntity("team-doosan", baseball.getId(), kbo.getId(), "Doosan Bears", "DOO", "doosan-bears"));
      TeamEntity seoul = teams.save(new TeamEntity("team-fc-seoul", football.getId(), k1.getId(), "FC Seoul", "SEO", "fc-seoul"));
      TeamEntity jeonbuk = teams.save(new TeamEntity("team-jeonbuk", football.getId(), k1.getId(), "Jeonbuk Hyundai Motors", "JEO", "jeonbuk-hyundai"));

      users.save(new UserEntity("user-me", "easyh@gamelog.local", "easyh", null, "홈 응원석과 원정석의 공기를 모두 기록하는 팬.", seoul.getId()));
      users.save(new UserEntity("user-ana", "ana@gamelog.local", "ana", null, "스코어보다 장면을 오래 기억합니다.", null));
      users.save(new UserEntity("user-min", "min@gamelog.local", "min", null, "야구장 외야석 수집가.", null));

      favoriteTeams.save(new FavoriteTeamEntity("favorite-team-fc-seoul", "user-me", football.getId(), k1.getId(), seoul.getId(), "2026-06-01T00:00:00.000Z"));
      favoriteTeams.save(new FavoriteTeamEntity("favorite-team-doosan", "user-me", baseball.getId(), kbo.getId(), doosan.getId(), "2026-06-01T00:00:00.000Z"));

      matches.save(new MatchEntity("match-seoul-jeonbuk", football.getId(), k1.getId(), seoul.getId(), jeonbuk.getId(), "stadium-seoul-wc", "2026-06-21T13:00:00.000Z", "FINAL", 2, 1));
      matches.save(new MatchEntity("match-doosan-lg", baseball.getId(), kbo.getId(), doosan.getId(), lg.getId(), "stadium-jamsil", "2026-06-18T12:00:00.000Z", "FINAL", 5, 6));

      reviews.save(new ReviewEntity("review-me-seoul", "match-seoul-jeonbuk", "user-me", 4.5, "첫 골 이후 경기장이 바뀌었다", "역전골 순간의 함성까지 오래 남을 경기.", false, "MOVED", "HOME_FAN", 42, false, "2026-06-21T13:20:00.000Z", "2026-06-21T13:20:00.000Z"));
      reviews.save(new ReviewEntity("review-me-baseball", "match-doosan-lg", "user-me", 3.5, null, "응원팀 경기는 아니지만 9회 흐름 하나로 충분히 남길 만했다.", false, "TENSE", "OTHER_TEAM_FAN", 11, false, "2026-06-18T13:30:00.000Z", "2026-06-18T13:30:00.000Z"));
    };
  }
}
