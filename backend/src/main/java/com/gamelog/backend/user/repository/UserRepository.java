package com.gamelog.backend.user.repository;

import com.gamelog.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {}
