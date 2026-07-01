package com.gamelog.backend.catalog.repository;

import com.gamelog.backend.catalog.entity.TeamEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<TeamEntity, String> {
  List<TeamEntity> findBySportId(String sportId);
  List<TeamEntity> findByLeagueId(String leagueId);
  List<TeamEntity> findBySportIdAndLeagueId(String sportId, String leagueId);
}
