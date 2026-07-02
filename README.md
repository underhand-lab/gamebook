# gamelog

스포츠 팬을 위한 Letterboxd 스타일 경기 기록 앱입니다. 팬이 본 경기, 응원 관점, 별점, 리뷰, 감정, 즐겨찾는 팀을 중심으로 개인 타임라인과 경기 상세 기록을 만드는 것을 목표로 합니다.

## 현재 구현 상태

- `frontend`: Next.js 15 App Router 기반 웹 앱
- `backend`: Spring Boot 3.5 REST API
- `docs`, `document`: 제품 맥락, PRD, API/도메인 설계 문서
- `figma-plugin`: 디자인 시스템/화면 스펙 산출용 Figma 플러그인 코드

프론트엔드는 기본적으로 mock API를 사용합니다. 실제 백엔드와 연결하려면 `NEXT_PUBLIC_API_BASE_URL`을 설정해야 합니다.

## 주요 화면

- `/`: 기본 프로필/타임라인 화면
- `/calendar`: 날짜별 기록 캘린더와 통합 경기/내 기록 화면
- `/matches/[matchId]`: 경기 상세, 리뷰, 집계 패널
- `/users/[userId]`: 사용자 프로필

## 기술 스택

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- Recharts

### Backend

- Java 24
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- PostgreSQL
- H2 test profile
- Dockerfile 포함

## 로컬 실행

### Frontend

```bash
cd frontend
npm install
npm run dev
```

기본 상태에서는 mock API를 사용합니다.

백엔드와 연결하려면 `frontend/.env.local`에 다음 값을 설정합니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

mock API를 명시적으로 사용하려면 다음처럼 설정할 수 있습니다.

```bash
NEXT_PUBLIC_API_BASE_URL=mock
```

### Backend

Java 24가 필요합니다.

```bash
cd backend
./gradlew bootRun
```

기본 PostgreSQL 연결값은 다음과 같습니다.

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gamelog
SPRING_DATASOURCE_USERNAME=gamelog
SPRING_DATASOURCE_PASSWORD=gamelog
```

주요 환경 변수:

- `SERVER_PORT`: 로컬 서버 포트, 기본값 `8080`
- `APP_CORS_ALLOWED_ORIGINS`: 허용할 프론트엔드 origin, 기본값 `http://localhost:3000`
- `SPRING_DATASOURCE_URL`: PostgreSQL JDBC URL
- `SPRING_DATASOURCE_USERNAME`: DB 사용자명
- `SPRING_DATASOURCE_PASSWORD`: DB 비밀번호
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Hibernate DDL 모드, 기본값 `update`

현재 JPA 테이블은 공유 DB 충돌을 줄이기 위해 `gamebook_` 접두사를 사용합니다.

## 현재 백엔드 API

기본 prefix는 `/api/v1`입니다.

- `GET /sports`
- `GET /leagues`
- `GET /teams`
- `GET /matches?q=...`
- `GET /games/date/{date}`
- `GET /matches/{matchId}`
- `GET /matches/{matchId}/aggregate`
- `GET /matches/{matchId}/players`
- `GET /matches/{matchId}/reviews`
- `GET /me`
- `GET /me/favorite-teams`
- `GET /me/timeline`
- `GET /users/{userId}`
- `GET /users/{userId}/reviews`

현재 백엔드는 seed data 기반 조회 API 중심입니다. 프론트엔드 API 타입에는 향후 쓰기/팔로우/태그/MVP/캘린더 확장 메서드가 포함되어 있지만, 백엔드 구현은 아직 위 엔드포인트 범위에 머물러 있습니다.

리뷰 응답은 내부 호출 기준으로 ActivityPub 배포용 메타 필드를 포함하지 않습니다.

## 검증

### Frontend

```bash
cd frontend
npm run lint
```

### Backend

```bash
cd backend
./gradlew test
```

Gradle Java toolchain이 Java 24를 찾지 못하면 `JAVA_HOME`을 Java 24 JDK로 지정한 뒤 실행합니다.

## 배포 메모

- 프론트엔드는 Vercel 배포를 전제로 구성되어 있습니다.
- 백엔드는 `backend/Dockerfile`로 컨테이너 빌드가 가능하며, 런타임 포트는 `PORT` 환경 변수를 사용할 수 있습니다.
- 운영 DB는 PostgreSQL 호환 환경을 사용합니다. Supabase 같은 공유 DB를 사용할 경우 현재 테이블명은 `gamebook_*` 형태로 생성됩니다.

## 참고 문서

- `docs/PRODUCT_CONTEXT.md`
- `document/PRD/PRD-FINAL.md`
- `document/API/API_SPEC.md`
- `document/API/openapi.yaml`
- `document/DOMAIN_MODEL.md`
