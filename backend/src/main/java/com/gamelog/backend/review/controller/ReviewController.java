package com.gamelog.backend.review.controller;

import com.gamelog.backend.api.dto.ApiDtos.PageDto;
import com.gamelog.backend.api.dto.ApiDtos.ReviewDto;
import com.gamelog.backend.review.service.ReviewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {
  private final ReviewService reviews;

  public ReviewController(ReviewService reviews) {
    this.reviews = reviews;
  }

  @GetMapping("/matches/{matchId}/reviews")
  public PageDto<ReviewDto> byMatch(@PathVariable String matchId) {
    return reviews.byMatch(matchId);
  }

  @GetMapping("/me/timeline")
  public PageDto<ReviewDto> timeline(@RequestParam(required = false) String userId) {
    return reviews.timeline(userId == null ? "user-me" : userId);
  }

  @GetMapping("/users/{userId}/reviews")
  public PageDto<ReviewDto> byUser(@PathVariable String userId) {
    return reviews.byUser(userId);
  }
}
