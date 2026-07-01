package com.gamelog.backend.catalog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sports")
public class SportEntity {
  @Id
  private String id;
  private String name;
  private String slug;

  protected SportEntity() {}

  public SportEntity(String id, String name, String slug) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public String getSlug() { return slug; }
}
