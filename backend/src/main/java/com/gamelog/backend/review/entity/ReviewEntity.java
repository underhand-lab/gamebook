package com.gamelog.backend.review.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gamebook_reviews")
public class ReviewEntity {
  @Id
  private String id;
  private String matchId;
  private String userId;
  private Double rating;
  private String title;
  private String body;
  private Boolean spoiler;
  private String emotion;
  private String fanPerspective;
  private int likeCount;
  private boolean likedByMe;
  private String createdAt;
  private String updatedAt;
  private String watchedAt;

  protected ReviewEntity() {}

  public ReviewEntity(String id, String matchId, String userId, Double rating, String title, String body, Boolean spoiler, String emotion, String fanPerspective, int likeCount, boolean likedByMe, String createdAt, String updatedAt) {
    this.id = id;
    this.matchId = matchId;
    this.userId = userId;
    this.rating = rating;
    this.title = title;
    this.body = body;
    this.spoiler = spoiler;
    this.emotion = emotion;
    this.fanPerspective = fanPerspective;
    this.likeCount = likeCount;
    this.likedByMe = likedByMe;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.watchedAt = createdAt;
  }

  public String getId() { return id; }
  public String getMatchId() { return matchId; }
  public String getUserId() { return userId; }
  public Double getRating() { return rating; }
  public String getTitle() { return title; }
  public String getBody() { return body; }
  public Boolean getSpoiler() { return spoiler; }
  public String getEmotion() { return emotion; }
  public String getFanPerspective() { return fanPerspective; }
  public int getLikeCount() { return likeCount; }
  public boolean isLikedByMe() { return likedByMe; }
  public String getCreatedAt() { return createdAt; }
  public String getUpdatedAt() { return updatedAt; }
  public String getWatchedAt() { return watchedAt; }
}
