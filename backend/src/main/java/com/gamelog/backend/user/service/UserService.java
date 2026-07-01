package com.gamelog.backend.user.service;

import com.gamelog.backend.api.dto.ApiDtos.FavoriteTeamDto;
import com.gamelog.backend.api.dto.ApiDtos.TeamDto;
import com.gamelog.backend.api.dto.ApiDtos.UserDetailDto;
import com.gamelog.backend.catalog.entity.TeamEntity;
import com.gamelog.backend.catalog.service.CatalogService;
import com.gamelog.backend.user.entity.FavoriteTeamEntity;
import com.gamelog.backend.user.entity.UserEntity;
import com.gamelog.backend.user.repository.FavoriteTeamRepository;
import com.gamelog.backend.user.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository users;
  private final FavoriteTeamRepository favoriteTeams;
  private final CatalogService catalog;

  public UserService(UserRepository users, FavoriteTeamRepository favoriteTeams, CatalogService catalog) {
    this.users = users;
    this.favoriteTeams = favoriteTeams;
    this.catalog = catalog;
  }

  public UserDetailDto me() { return user("user-me"); }

  public List<FavoriteTeamDto> favoriteTeams(String userId) {
    return favoriteTeams.findByUserId(userId).stream().map(this::favoriteTeam).toList();
  }

  public UserDetailDto user(String userId) {
    UserEntity user = users.findById(userId).orElse(null);
    if (user == null) return null;
    TeamDto primaryTeam = user.getPrimaryTeamId() == null ? null : catalog.team(catalog.teamEntity(user.getPrimaryTeamId()));
    return new UserDetailDto(
        user.getId(),
        user.getEmail(),
        user.getDisplayName(),
        user.getAvatarUrl(),
        user.getBio(),
        primaryTeam,
        favoriteTeams(userId));
  }

  private FavoriteTeamDto favoriteTeam(FavoriteTeamEntity entity) {
    return new FavoriteTeamDto(
        entity.getId(),
        entity.getUserId(),
        catalog.sport(catalog.sportEntity(entity.getSportId())),
        catalog.league(catalog.leagueEntity(entity.getLeagueId())),
        catalog.team(catalog.teamEntity(entity.getTeamId())),
        entity.getCreatedAt());
  }
}
