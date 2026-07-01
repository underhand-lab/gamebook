package com.gamelog.backend.user.controller;

import com.gamelog.backend.api.dto.ApiDtos.FavoriteTeamDto;
import com.gamelog.backend.api.dto.ApiDtos.UserDetailDto;
import com.gamelog.backend.user.service.UserService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserController {
  private final UserService users;

  public UserController(UserService users) {
    this.users = users;
  }

  @GetMapping("/me")
  public UserDetailDto me() { return users.me(); }

  @GetMapping("/me/favorite-teams")
  public List<FavoriteTeamDto> favoriteTeams() { return users.favoriteTeams("user-me"); }

  @GetMapping("/users/{userId}")
  public ResponseEntity<UserDetailDto> user(@PathVariable String userId) {
    var user = users.user(userId);
    return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
  }
}
