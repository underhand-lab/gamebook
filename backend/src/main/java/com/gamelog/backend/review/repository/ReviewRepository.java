package com.gamelog.backend.review.repository;

import com.gamelog.backend.review.entity.ReviewEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, String> {
  List<ReviewEntity> findByMatchId(String matchId);
  List<ReviewEntity> findByUserId(String userId);
}
