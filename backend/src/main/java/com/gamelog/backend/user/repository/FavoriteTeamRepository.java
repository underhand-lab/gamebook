package com.gamelog.backend.user.repository;

import com.gamelog.backend.user.entity.FavoriteTeamEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteTeamRepository extends JpaRepository<FavoriteTeamEntity, String> {
  List<FavoriteTeamEntity> findByUserId(String userId);
}
