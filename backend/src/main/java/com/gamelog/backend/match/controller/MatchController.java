package com.gamelog.backend.match.controller;

import com.gamelog.backend.api.dto.ApiDtos.MatchAggregateDto;
import com.gamelog.backend.api.dto.ApiDtos.MatchDetailDto;
import com.gamelog.backend.api.dto.ApiDtos.MatchLogAggregatePageDto;
import com.gamelog.backend.api.dto.ApiDtos.PageDto;
import com.gamelog.backend.match.service.MatchService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class MatchController {
  private final MatchService matches;

  public MatchController(MatchService matches) {
    this.matches = matches;
  }

  @GetMapping("/matches")
  public PageDto<?> matches(@RequestParam(required = false) String q) { return matches.matches(q); }

  @GetMapping("/games/date/{date}")
  public PageDto<?> matchesByDate(@PathVariable String date) { return matches.matchesByDate(date); }

  @GetMapping("/matches/{matchId}")
  public MatchDetailDto match(@PathVariable String matchId) { return matches.match(matchId); }

  @GetMapping("/matches/{matchId}/aggregate")
  public MatchAggregateDto aggregate(@PathVariable String matchId) { return matches.aggregate(matchId); }

  @GetMapping("/matches/{matchId}/players")
  public List<Object> players(@PathVariable String matchId) { return matches.players(matchId); }
}
