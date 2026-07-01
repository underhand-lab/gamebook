package com.gamelog.backend.catalog.repository;

import com.gamelog.backend.catalog.entity.SportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SportRepository extends JpaRepository<SportEntity, String> {}
