package com.gamelog.backend.catalog.repository;

import com.gamelog.backend.catalog.entity.LeagueEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueRepository extends JpaRepository<LeagueEntity, String> {
  List<LeagueEntity> findBySportId(String sportId);
}
