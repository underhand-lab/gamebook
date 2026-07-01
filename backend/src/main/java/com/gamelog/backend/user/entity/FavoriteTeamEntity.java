package com.gamelog.backend.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gamebook_favorite_teams")
public class FavoriteTeamEntity {
  @Id
  private String id;
  private String userId;
  private String sportId;
  private String leagueId;
  private String teamId;
  private String createdAt;

  protected FavoriteTeamEntity() {}

  public FavoriteTeamEntity(String id, String userId, String sportId, String leagueId, String teamId, String createdAt) {
    this.id = id;
    this.userId = userId;
    this.sportId = sportId;
    this.leagueId = leagueId;
    this.teamId = teamId;
    this.createdAt = createdAt;
  }

  public String getId() { return id; }
  public String getUserId() { return userId; }
  public String getSportId() { return sportId; }
  public String getLeagueId() { return leagueId; }
  public String getTeamId() { return teamId; }
  public String getCreatedAt() { return createdAt; }
}
