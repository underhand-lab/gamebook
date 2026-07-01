package com.gamelog.backend.catalog.entity;

public record MatchStub(
    String id,
    SportEntity sport,
    LeagueEntity league,
    TeamEntity homeTeam,
    TeamEntity awayTeam,
    String stadiumId,
    String stadiumName,
    String stadiumCity,
    String stadiumCountry,
    Double stadiumLatitude,
    Double stadiumLongitude,
    String matchDate,
    String status,
    Integer homeScore,
    Integer awayScore) {}
