package com.gamelog.backend.match.repository;

import com.gamelog.backend.match.entity.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<MatchEntity, String> {}
