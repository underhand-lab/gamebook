package com.gamelog.backend.api.dto;

import java.util.List;

public final class ApiDtos {
  private ApiDtos() {}

  public record SportDto(String id, String name, String slug) {}
  public record LeagueDto(String id, String sportId, String name, String country, String slug) {}
  public record TeamDto(String id, String sportId, String leagueId, String name, String shortName, String slug) {}
  public record UserSummaryDto(String id, String displayName, String avatarUrl) {}
  public record FavoriteTeamDto(String id, String userId, SportDto sport, LeagueDto league, TeamDto team, String createdAt) {}
  public record UserDetailDto(String id, String email, String displayName, String avatarUrl, String bio, TeamDto primaryTeam, List<FavoriteTeamDto> favoriteTeams) {}
  public record ScoreDto(Integer home, Integer away) {}
  public record MatchSummaryDto(String id, SportDto sport, LeagueDto league, TeamDto homeTeam, TeamDto awayTeam, String matchDate, String status, ScoreDto score, Double averageRating, Integer reviewCount) {}
  public record StadiumDto(String id, String name, String city, String country, Double latitude, Double longitude) {}
  public record MatchAggregateDto(Integer reviewCount, Double averageRating) {}
  public record MatchDetailDto(String id, SportDto sport, LeagueDto league, StadiumDto stadium, TeamDto homeTeam, TeamDto awayTeam, String matchDate, String status, ScoreDto score, MatchAggregateDto aggregate) {}
  public record ReviewDto(String id, String matchId, UserSummaryDto user, Double rating, String title, String body, Boolean spoiler, String emotion, String fanPerspective, int likeCount, boolean likedByMe, String createdAt, String updatedAt) {}
  public record MatchLogDto(String id, String userId, MatchSummaryDto match, String watchedAt, String watchType, TeamDto supportingTeam, String fanPerspective, boolean attendanceVerified) {}
  public record MatchLogAggregateItemDto(MatchLogDto matchLog, ReviewDto review, MatchSummaryDto matchSummary, String timelineDate) {}
  public record MatchLogAggregatePageDto(List<MatchLogAggregateItemDto> items, int page, int size, int total) {}
  public record PageDto<T>(List<T> items, int page, int size, int total) {}
}
