package com.gamelog.backend.catalog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "leagues")
public class LeagueEntity {
  @Id
  private String id;
  private String sportId;
  private String name;
  private String country;
  private String slug;

  protected LeagueEntity() {}

  public LeagueEntity(String id, String sportId, String name, String country, String slug) {
    this.id = id;
    this.sportId = sportId;
    this.name = name;
    this.country = country;
    this.slug = slug;
  }

  public String getId() { return id; }
  public String getSportId() { return sportId; }
  public String getName() { return name; }
  public String getCountry() { return country; }
  public String getSlug() { return slug; }
}
