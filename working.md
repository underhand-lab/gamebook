# Current Task

## Goal

- 같은 Supabase DB를 공유해도 충돌하지 않도록 현재 프로젝트 JPA 테이블에 `gamebook_` 접두사를 붙인다.

## Plan

- [x] 기존 JPA 테이블명과 SQL 사용 여부를 확인한다.
- [x] 엔티티 `@Table` 이름에 `gamebook_` 접두사를 적용한다.
- [x] 표준 검증 workflow를 1회 실행한다.
- [x] 결과와 남은 배포 설정을 `working.md`에 기록한다.

## Progress

- 네이티브 SQL은 없고 JPA 엔티티의 `@Table` 이름만 사용한다.
- 기존 테이블명은 `sports`, `leagues`, `teams`, `matches`, `reviews`, `users`, `favorite_teams`이다.
- 엔티티 테이블명을 `gamebook_sports`, `gamebook_leagues`, `gamebook_teams`, `gamebook_matches`, `gamebook_reviews`, `gamebook_users`, `gamebook_favorite_teams`로 변경했다.
- `./gradlew test`는 기본 Java 환경에서 `26` 오류로 실패했다.
- Java 24 지정 후 `/bin/zsh -lc "JAVA_HOME=/Users/easyh/Library/Java/JavaVirtualMachines/temurin-24.0.2/Contents/Home ./gradlew test"`가 통과했다.
- 테스트 로그에서 Hibernate가 `gamebook_*` 테이블을 사용함을 확인했다.

## Decisions

- 프로젝트 접두사는 저장소/배포명 기준으로 `gamebook_`를 사용한다.
- 기존 공유 DB의 다른 프로젝트 테이블은 건드리지 않고 새 prefixed 테이블을 생성하도록 한다.

## Pending

- Render 재배포 후 Supabase에 `gamebook_*` 테이블이 생성되는지 확인해야 한다.

## Issues

- 기존 unprefixed 테이블의 데이터는 새 `gamebook_` 테이블로 자동 이전되지 않는다.
- 로컬 기본 Java 환경은 Gradle 실행에 부적합해 Java 24 지정이 필요했다.

## Change Log

- 2026-07-01: Spring Boot 백엔드 프로젝트 생성 작업 시작.
- 2026-07-01: Spring Boot 백엔드 프로젝트 생성 및 테스트 통과.
- 2026-07-01: in-memory REST API 추가 및 재검증 통과.
- 2026-07-01: JPA/MySQL 기반 구조로 재구성 및 테스트 통과.
- 2026-07-01: log 제거, review 단일 개념으로 통합 및 테스트 통과.
- 2026-07-01: Gradle Kotlin DSL로 전환 및 테스트 통과.
- 2026-07-01: Vercel/Render 배포용 GitHub Actions 작업 시작.
- 2026-07-01: 프론트 Vercel 배포 워크플로우와 백엔드 Render 배포 워크플로우 추가.
- 2026-07-01: 자동 배포가 이미 동작해 GitHub Actions 배포 워크플로우 제거 작업으로 전환.
- 2026-07-01: Render 배포 실패 원인 진단 작업 시작.
- 2026-07-01: Render 배포 실패 원인을 Supabase 직접 연결 IPv6 접근 실패로 정리.
- 2026-07-01: 새 Render 로그를 `leagues.code` NOT NULL 제약과 현재 엔티티 불일치로 정리.
- 2026-07-01: JPA 테이블명에 `gamebook_` 접두사 적용 작업 시작.
- 2026-07-01: JPA 테이블명 `gamebook_` 접두사 적용 및 Java 24 기반 테스트 통과.
