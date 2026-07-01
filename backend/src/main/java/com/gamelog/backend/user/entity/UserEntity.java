package com.gamelog.backend.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
  @Id
  private String id;
  private String email;
  private String displayName;
  private String avatarUrl;
  private String bio;
  private String primaryTeamId;

  protected UserEntity() {}

  public UserEntity(String id, String email, String displayName, String avatarUrl, String bio, String primaryTeamId) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
    this.primaryTeamId = primaryTeamId;
  }

  public String getId() { return id; }
  public String getEmail() { return email; }
  public String getDisplayName() { return displayName; }
  public String getAvatarUrl() { return avatarUrl; }
  public String getBio() { return bio; }
  public String getPrimaryTeamId() { return primaryTeamId; }
}
