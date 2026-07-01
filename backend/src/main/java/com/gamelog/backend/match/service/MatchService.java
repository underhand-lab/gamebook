package com.gamelog.backend.match.service;

import com.gamelog.backend.api.dto.ApiDtos.MatchAggregateDto;
import com.gamelog.backend.api.dto.ApiDtos.MatchDetailDto;
import com.gamelog.backend.api.dto.ApiDtos.MatchSummaryDto;
import com.gamelog.backend.api.dto.ApiDtos.PageDto;
import com.gamelog.backend.api.dto.ApiDtos.ReviewDto;
import com.gamelog.backend.api.dto.ApiDtos.ScoreDto;
import com.gamelog.backend.api.dto.ApiDtos.StadiumDto;
import com.gamelog.backend.api.dto.ApiDtos.TeamDto;
import com.gamelog.backend.catalog.service.CatalogService;
import com.gamelog.backend.match.entity.MatchEntity;
import com.gamelog.backend.match.repository.MatchRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
  private final CatalogService catalog;
  private final MatchRepository matches;
  private final com.gamelog.backend.review.service.ReviewService reviews;

  public MatchService(CatalogService catalog, MatchRepository matches, com.gamelog.backend.review.service.ReviewService reviews) {
    this.catalog = catalog;
    this.matches = matches;
    this.reviews = reviews;
  }

  public PageDto<MatchSummaryDto> matches(String q) {
    var items = matches.findAll().stream().map(this::summary).filter(match -> q == null || q.isBlank() || queryMatch(match, q)).toList();
    return new PageDto<>(items, 0, items.size(), items.size());
  }

  public PageDto<MatchSummaryDto> matchesByDate(String date) {
    var items = matches.findAll().stream().map(this::summary).filter(match -> match.matchDate().startsWith(date)).toList();
    return new PageDto<>(items, 0, items.size(), items.size());
  }

  public MatchDetailDto match(String matchId) {
    MatchEntity entity = matches.findById(matchId).orElse(null);
    return entity == null ? null : detail(entity);
  }

  public PageDto<ReviewDto> reviews(String matchId) {
    return reviews.byMatch(matchId);
  }

  public MatchAggregateDto aggregate(String matchId) {
    var rs = reviews.byMatch(matchId).items();
    int count = rs.size();
    double average = count == 0 ? 0 : rs.stream().mapToDouble(r -> r.rating() == null ? 0 : r.rating()).average().orElse(0);
    return new MatchAggregateDto(count, average);
  }

  public List<Object> players(String matchId) {
    MatchEntity match = matches.findById(matchId).orElse(null);
    if (match == null) return List.of();
    return List.of(
        new com.gamelog.backend.api.dto.ApiDtos.TeamDto(match.getHomeTeamId(), match.getSportId(), match.getLeagueId(), "home", "home", "home"),
        new com.gamelog.backend.api.dto.ApiDtos.TeamDto(match.getAwayTeamId(), match.getSportId(), match.getLeagueId(), "away", "away", "away"));
  }

  public MatchSummaryDto summary(String matchId) { return summary(matchEntity(matchId)); }

  private boolean queryMatch(MatchSummaryDto match, String q) {
    String lower = q.toLowerCase();
    return match.homeTeam().name().toLowerCase().contains(lower)
        || match.awayTeam().name().toLowerCase().contains(lower)
        || match.league().name().toLowerCase().contains(lower);
  }

  private MatchEntity matchEntity(String matchId) { return matches.findById(matchId).orElseThrow(); }

  private MatchSummaryDto summary(MatchEntity match) {
    MatchAggregateDto aggregate = aggregate(match.getId());
    return new MatchSummaryDto(
        match.getId(),
        catalog.sport(catalog.sportEntity(match.getSportId())),
        catalog.league(catalog.leagueEntity(match.getLeagueId())),
        catalog.team(catalog.teamEntity(match.getHomeTeamId())),
        catalog.team(catalog.teamEntity(match.getAwayTeamId())),
        match.getMatchDate(),
        match.getStatus(),
        new ScoreDto(match.getHomeScore(), match.getAwayScore()),
        aggregate.averageRating(),
        aggregate.reviewCount());
  }

  private MatchDetailDto detail(MatchEntity match) {
    MatchAggregateDto aggregate = aggregate(match.getId());
    return new MatchDetailDto(
        match.getId(),
        catalog.sport(catalog.sportEntity(match.getSportId())),
        catalog.league(catalog.leagueEntity(match.getLeagueId())),
        new StadiumDto(match.getStadiumId(), match.getStadiumId(), null, null, null, null),
        catalog.team(catalog.teamEntity(match.getHomeTeamId())),
        catalog.team(catalog.teamEntity(match.getAwayTeamId())),
        match.getMatchDate(),
        match.getStatus(),
        new ScoreDto(match.getHomeScore(), match.getAwayScore()),
        aggregate);
  }

}
