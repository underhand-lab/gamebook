package com.gamelog.backend.review.service;

import com.gamelog.backend.api.dto.ApiDtos.PageDto;
import com.gamelog.backend.api.dto.ApiDtos.ReviewDto;
import com.gamelog.backend.api.dto.ApiDtos.UserSummaryDto;
import com.gamelog.backend.review.entity.ReviewEntity;
import com.gamelog.backend.review.repository.ReviewRepository;
import com.gamelog.backend.user.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
  private final ReviewRepository reviews;
  private final UserRepository users;

  public ReviewService(ReviewRepository reviews, UserRepository users) {
    this.reviews = reviews;
    this.users = users;
  }

  public PageDto<ReviewDto> byMatch(String matchId) {
    List<ReviewDto> items = reviews.findByMatchId(matchId).stream().map(this::review).toList();
    return new PageDto<>(items, 0, items.size(), items.size());
  }

  public PageDto<ReviewDto> byUser(String userId) {
    List<ReviewDto> items = reviews.findByUserId(userId).stream().map(this::review).toList();
    return new PageDto<>(items, 0, items.size(), items.size());
  }

  public PageDto<ReviewDto> timeline(String userId) {
    return byUser(userId);
  }

  private ReviewDto review(ReviewEntity entity) {
    return new ReviewDto(
        entity.getId(),
        entity.getMatchId(),
        new UserSummaryDto(entity.getUserId(), users.findById(entity.getUserId()).map(u -> u.getDisplayName()).orElse(entity.getUserId()), null),
        entity.getRating(),
        entity.getTitle(),
        entity.getBody(),
        entity.getSpoiler(),
        entity.getEmotion(),
        entity.getFanPerspective(),
        entity.getLikeCount(),
        entity.isLikedByMe(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }
}
