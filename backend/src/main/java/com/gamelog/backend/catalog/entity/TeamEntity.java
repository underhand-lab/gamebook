package com.gamelog.backend.catalog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gamebook_teams")
public class TeamEntity {
  @Id
  private String id;
  private String sportId;
  private String leagueId;
  private String name;
  private String shortName;
  private String slug;

  protected TeamEntity() {}

  public TeamEntity(String id, String sportId, String leagueId, String name, String shortName, String slug) {
    this.id = id;
    this.sportId = sportId;
    this.leagueId = leagueId;
    this.name = name;
    this.shortName = shortName;
    this.slug = slug;
  }

  public String getId() { return id; }
  public String getSportId() { return sportId; }
  public String getLeagueId() { return leagueId; }
  public String getName() { return name; }
  public String getShortName() { return shortName; }
  public String getSlug() { return slug; }
}
