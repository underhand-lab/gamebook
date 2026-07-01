package com.gamelog.backend.match.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gamebook_matches")
public class MatchEntity {
  @Id
  private String id;
  private String sportId;
  private String leagueId;
  private String homeTeamId;
  private String awayTeamId;
  private String stadiumId;
  private String matchDate;
  private String status;
  private Integer homeScore;
  private Integer awayScore;

  protected MatchEntity() {}

  public MatchEntity(String id, String sportId, String leagueId, String homeTeamId, String awayTeamId, String stadiumId, String matchDate, String status, Integer homeScore, Integer awayScore) {
    this.id = id;
    this.sportId = sportId;
    this.leagueId = leagueId;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.stadiumId = stadiumId;
    this.matchDate = matchDate;
    this.status = status;
    this.homeScore = homeScore;
    this.awayScore = awayScore;
  }

  public String getId() { return id; }
  public String getSportId() { return sportId; }
  public String getLeagueId() { return leagueId; }
  public String getHomeTeamId() { return homeTeamId; }
  public String getAwayTeamId() { return awayTeamId; }
  public String getStadiumId() { return stadiumId; }
  public String getMatchDate() { return matchDate; }
  public String getStatus() { return status; }
  public Integer getHomeScore() { return homeScore; }
  public Integer getAwayScore() { return awayScore; }
}
