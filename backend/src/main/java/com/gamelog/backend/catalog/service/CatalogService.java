package com.gamelog.backend.catalog.service;

import com.gamelog.backend.api.dto.ApiDtos.LeagueDto;
import com.gamelog.backend.api.dto.ApiDtos.SportDto;
import com.gamelog.backend.api.dto.ApiDtos.TeamDto;
import com.gamelog.backend.catalog.entity.LeagueEntity;
import com.gamelog.backend.catalog.entity.SportEntity;
import com.gamelog.backend.catalog.entity.TeamEntity;
import com.gamelog.backend.catalog.repository.LeagueRepository;
import com.gamelog.backend.catalog.repository.SportRepository;
import com.gamelog.backend.catalog.repository.TeamRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CatalogService {
  private final SportRepository sports;
  private final LeagueRepository leagues;
  private final TeamRepository teams;

  public CatalogService(SportRepository sports, LeagueRepository leagues, TeamRepository teams) {
    this.sports = sports;
    this.leagues = leagues;
    this.teams = teams;
  }

  public List<SportDto> sports() {
    return sports.findAll().stream().map(this::sport).toList();
  }

  public List<LeagueDto> leagues() {
    return leagues.findAll().stream().map(this::league).toList();
  }

  public List<TeamDto> teams() {
    return teams.findAll().stream().map(this::team).toList();
  }

  public SportEntity sportEntity(String id) { return sports.findById(id).orElseThrow(); }
  public LeagueEntity leagueEntity(String id) { return leagues.findById(id).orElseThrow(); }
  public TeamEntity teamEntity(String id) { return id == null ? null : teams.findById(id).orElseThrow(); }

  public SportDto sport(SportEntity entity) { return new SportDto(entity.getId(), entity.getName(), entity.getSlug()); }
  public LeagueDto league(LeagueEntity entity) { return new LeagueDto(entity.getId(), entity.getSportId(), entity.getName(), entity.getCountry(), entity.getSlug()); }
  public TeamDto team(TeamEntity entity) { return new TeamDto(entity.getId(), entity.getSportId(), entity.getLeagueId(), entity.getName(), entity.getShortName(), entity.getSlug()); }
}
