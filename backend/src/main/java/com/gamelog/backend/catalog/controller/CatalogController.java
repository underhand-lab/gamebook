package com.gamelog.backend.catalog.controller;

import com.gamelog.backend.api.dto.ApiDtos.LeagueDto;
import com.gamelog.backend.api.dto.ApiDtos.SportDto;
import com.gamelog.backend.api.dto.ApiDtos.TeamDto;
import com.gamelog.backend.catalog.service.CatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {
  private final CatalogService catalog;

  public CatalogController(CatalogService catalog) {
    this.catalog = catalog;
  }

  @GetMapping("/sports")
  public List<SportDto> sports() { return catalog.sports(); }

  @GetMapping("/leagues")
  public List<LeagueDto> leagues() { return catalog.leagues(); }

  @GetMapping("/teams")
  public List<TeamDto> teams() { return catalog.teams(); }
}
