# Current Task

## Goal

- GitHub Actions 배포 워크플로우를 제거하고, Vercel/Render의 자동 배포만 사용한다.

## Plan

- [x] 현재 프론트/백엔드 배포 경로와 필요한 환경변수를 확인한다.
- [x] Vercel용 프론트 배포 워크플로우를 추가한다.
- [x] Render용 백엔드 배포 워크플로우를 추가한다.
- [x] Render Dockerfile을 추가한다.
- [x] 배포에 필요한 설정과 주석을 정리한다.
- [x] 가능한 범위에서 빌드/검증을 1회 수행한다.
- [x] GitHub Actions 배포 워크플로우를 제거한다.

## Progress

- 프론트는 `NEXT_PUBLIC_API_BASE_URL`로 Mock API 또는 실제 API를 선택하도록 되어 있다.
- 백엔드는 `backend/` 하위 Gradle 프로젝트로 분리되어 있고, 현재 Kotlin DSL을 사용한다.
- Vercel과 Render의 자동 배포가 이미 동작하면 GitHub Actions 배포 workflow는 중복이므로 제거한다.
- Render는 `Docker` 런타임으로 배포하고, 백엔드 루트에 `Dockerfile`을 둔다.
- 백엔드 CORS는 쉼표로 구분한 여러 origin을 허용한다.
- `frontend`는 `npm run build`가 통과했다.
- 백엔드는 `backend/Dockerfile`로 Render Docker 런타임에 맞췄다.

## Decisions

- 프론트 배포는 Vercel, 백엔드 배포는 Render의 기본 자동 배포를 사용한다.
- GitHub Actions 배포 workflow는 중복될 경우 제거한다.
- 배포 설정은 기존 동작을 바꾸지 않고, 환경변수와 시크릿 기반으로 연결한다.

## Pending

- Vercel 프로젝트 설정 값과 Render Docker 서비스 환경변수, GitHub Secrets 값은 사용자가 채워야 한다.
- 배포 후 실제 도메인과 환경변수 연결 확인이 남아 있다.
- 백엔드 검증은 이 환경에서 Gradle 배포본 다운로드가 막혀 완료하지 못했다.

## Issues

- `./gradlew test`는 로컬 Gradle 배포본 경로 권한 문제를 우회한 뒤, 외부 네트워크 차단으로 `services.gradle.org`에서 Gradle 배포본을 내려받지 못해 실패했다.

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
