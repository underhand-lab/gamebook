# TODO: ActivityPub-ready Frontend Preparation

## 현재 상태

- 프론트엔드는 MockAPI 기반으로 이미 동작한다.
- GitHub Actions 설정은 아직 없다.
- Vercel 배포 설정도 아직 없다.
- Spring Boot 백엔드는 아직 없다.
- 이번 작업은 프론트엔드만 대상으로 한다.
- 현재 MVP에서 리뷰 대상은 오직 “경기”다.

## 목표

현재 MockAPI 기반 프론트엔드를 유지하면서, 나중에 Spring Boot 백엔드와 ActivityPub federation을 붙일 수 있도록 프론트 구조를 정리한다.

핵심 목표는 다음과 같다.

- MockAPI 직접 의존을 줄인다.
- API 호출부를 service/api layer로 분리한다.
- 환경변수 기반 API base URL을 사용한다.
- 경기 리뷰 중심의 타입을 명확히 한다.
- ActivityPub-ready 필드를 User와 Review 타입에 추가한다.
- 실제 federation 없이도 공개 범위, Fediverse 공개 여부, canonical URL, federation status를 화면에서 다룰 수 있게 한다.

## 범위 밖

이번 작업에서 아래 항목은 구현하지 않는다.

- GitHub Actions
- Vercel 배포
- Spring Boot 백엔드
- ActivityPub federation 실동작
- WebFinger
- HTTP Signature
- inbox/outbox delivery
- remote follow
- remote reply 수신
- remote like 수신
- 선수 리뷰
- 팀 리뷰
- 구장 리뷰
- 시즌 리뷰
- 특정 장면 리뷰
- 응원가 리뷰
- 유니폼 리뷰
- 자유 야구 감상 포스트
- targetType 선택 UI
- 자유 포스트 작성 기능

---

## 1단계: 현재 구조 분석

먼저 현재 프로젝트에서 아래를 확인한다.

- 프레임워크: Vite / Next.js / CRA 등
- 패키지 매니저: npm / pnpm / yarn
- API 호출 위치
- MockAPI base URL이 하드코딩되어 있는지 여부
- 타입 정의 위치
- 리뷰 작성 화면 위치
- 리뷰 상세 화면 위치
- 프로필 화면 위치
- 빌드/린트/타입체크 명령어

수정 전에 분석 결과를 요약한다.

---

## 2단계: API client layer 분리

목표:

컴포넌트가 MockAPI URL을 직접 알지 않도록 한다.

해야 할 일:

- src/api 또는 src/services 폴더를 만든다.
- API base URL을 환경변수에서 읽는다.
- 기존 MockAPI 호출부를 API client 함수로 이동한다.
- 기존 response shape은 최대한 유지한다.
- 실패 처리와 loading 처리가 기존 화면에서 깨지지 않게 한다.

예상 구조:

```txt
src/
  api/
    client.ts
    users.ts
    games.ts
    reviews.ts
    comments.ts
    likes.ts
  types/
    user.ts
    review.ts
    game.ts
```

환경변수 예시:

Vite 프로젝트라면:

```env
VITE_API_BASE_URL=https://mockapi.example.com
```

Next.js 프로젝트라면:

```env
NEXT_PUBLIC_API_BASE_URL=https://mockapi.example.com
```

주의:

- 기존 MockAPI를 계속 사용할 수 있어야 한다.
- 나중에 Spring Boot API base URL로 바꿔도 컴포넌트 코드는 크게 바뀌지 않아야 한다.
- 컴포넌트 안에서 fetch/axios로 MockAPI URL을 직접 호출하지 않도록 한다.

---

## 3단계: 타입 정의 정리

현재 MVP에서 Review는 항상 경기 리뷰다.

따라서 Review는 `gameId`를 필수로 가진다.

`targetType`, `targetId`는 현재 MVP에서 사용하지 않는다.

User 타입에 다음 필드를 optional로 추가한다.

```ts
handle?: string;
actorUrl?: string;
inboxUrl?: string;
outboxUrl?: string;
followersUrl?: string;
followingUrl?: string;
isLocalUser?: boolean;
```

Review 타입에 다음 필드를 추가한다.

```ts
gameId: string;

rating?: number;
body: string;
tags: string[];

watchedType?: "live" | "tv" | "highlight" | "memory" | "rewatch" | "radio" | "unknown";

visibility: "public" | "local" | "followers" | "private";
federated: boolean;

canonicalUrl?: string;
activityPubObjectUrl?: string;
activityPubActivityUrl?: string;
federatedAt?: string | null;
federationStatus?: "none" | "pending" | "published" | "failed";
```

주의:

- 기존 MockAPI 데이터에 새 필드가 없어도 화면이 깨지면 안 된다.
- 누락 필드에 대한 fallback을 둔다.
- 기존 필드명은 가능하면 바꾸지 않는다.
- `targetType` 기반 확장 구조는 이번 작업에서 만들지 않는다.
- 리뷰 대상은 항상 경기이므로 작성/상세 UI에서도 경기 중심 흐름을 유지한다.

---

## 4단계: 리뷰 작성 UI 확장

리뷰 작성 화면에 아래 상태를 추가한다.

### 공개 범위

선택지는 다음과 같다.

- public: 공개
- local: 앱 내부 공개
- followers: 팔로워 공개
- private: 비공개

### Fediverse 공개 여부

- `federated` boolean으로 저장한다.
- 기본값은 false로 둔다.
- `visibility`가 public일 때만 선택 가능하게 해도 된다.
- 실제 Fediverse 발행은 하지 않는다.

### 관람 방식

선택지는 다음과 같다.

- live: 직관
- tv: 중계
- highlight: 하이라이트
- memory: 기억으로 씀
- rewatch: 재관람
- radio: 라디오
- unknown: 선택 안 함

### 별점

- rating은 optional이어야 한다.
- 별점 없이도 리뷰 작성이 가능해야 한다.

주의:

- 저장 payload에 새 필드를 포함한다.
- 실제 ActivityPub 객체 JSON-LD를 프론트에서 생성하지 않는다.
- 실제 외부 서버로 요청을 보내지 않는다.
- 리뷰 대상 선택은 경기만 유지한다.

---

## 5단계: 리뷰 상세 UI 확장

리뷰 상세 화면에 아래 정보를 표시할 수 있게 한다.

- 공개 범위
- 관람 방식
- Fediverse 공개 상태
- canonical URL

federation status 표시는 다음 값을 기준으로 한다.

- none: 미연동
- pending: 발행 대기
- published: 발행됨
- failed: 발행 실패

주의:

- canonicalUrl이 있으면 표시하거나 복사할 수 있게 한다.
- activityPubObjectUrl, activityPubActivityUrl은 값이 있을 때만 표시한다.
- 외부 답글/좋아요 수집 UI는 구현하지 않는다.
- 필요하면 TODO placeholder만 남긴다.

---

## 6단계: 프로필 UI 확장

프로필 화면에 아래 정보를 표시할 수 있게 한다.

- handle
  - 예: @[minsu@baseball-review.app](mailto:minsu@baseball-review.app)

- actorUrl
- Fediverse 연동 상태 placeholder

주의:

- handle이 없으면 기존 username/displayName만 표시한다.
- actorUrl이 없으면 해당 영역은 숨기거나 “준비 중” 상태로 표시한다.
- 외부 팔로워 수, 외부 팔로우, 원격 계정 검색은 구현하지 않는다.

---

## 7단계: mock 데이터 보강

MockAPI 또는 로컬 mock seed가 있다면 ActivityPub-ready 필드를 추가한다.

Review 예시:

```json
{
  "id": "review_001",
  "userId": "user_001",
  "gameId": "game_20260701_lg_doosan",
  "rating": 4.5,
  "body": "이 경기는 스코어보다 9회말의 공기가 오래 남을 것 같다.",
  "tags": ["낭만", "끝내기", "잠실"],
  "watchedType": "tv",
  "visibility": "public",
  "federated": false,
  "canonicalUrl": "https://baseball-review.app/reviews/review_001",
  "activityPubObjectUrl": null,
  "activityPubActivityUrl": null,
  "federatedAt": null,
  "federationStatus": "none",
  "likesCount": 12,
  "commentsCount": 3,
  "createdAt": "2026-07-01T12:00:00.000Z",
  "updatedAt": "2026-07-01T12:00:00.000Z"
}
```

User 예시:

```json
{
  "id": "user_001",
  "username": "minsu",
  "displayName": "민수",
  "avatarUrl": "https://example.com/avatar.png",
  "bio": "롯데 경기를 보고 짧게 씁니다.",
  "handle": "@minsu@baseball-review.app",
  "actorUrl": "https://baseball-review.app/users/minsu",
  "inboxUrl": "https://baseball-review.app/users/minsu/inbox",
  "outboxUrl": "https://baseball-review.app/users/minsu/outbox",
  "followersUrl": "https://baseball-review.app/users/minsu/followers",
  "followingUrl": "https://baseball-review.app/users/minsu/following",
  "isLocalUser": true
}
```

주의:

- MockAPI 스키마를 바꾸기 어렵다면 프론트 fallback으로 처리한다.
- 새 필드가 없어도 기존 데이터가 정상 렌더링되어야 한다.

---

## 8단계: 환경변수 문서화

`.env.example`을 추가하거나 갱신한다.

Vite라면:

```env
VITE_API_BASE_URL=
```

Next.js라면:

```env
NEXT_PUBLIC_API_BASE_URL=
```

주의:

- 실제 `.env` 값은 커밋하지 않는다.
- `.env`, `.env.local`, `.env.production`은 `.gitignore`에 포함되어야 한다.
- 현재 작업에서는 Vercel 배포 설정을 하지 않는다.
- 현재 작업에서는 GitHub Actions 설정을 하지 않는다.

---

## 9단계: 후속 백엔드 TODO 문서화

프론트 코드 또는 문서에 후속 백엔드 작업 지점을 남긴다.

후속 Spring Boot 백엔드 예상 endpoint:

```txt
GET /users
GET /users/:id
GET /games
GET /games/:id
GET /reviews
GET /reviews/:id
POST /reviews
PATCH /reviews/:id
DELETE /reviews/:id
GET /comments
POST /comments
POST /likes
DELETE /likes/:id
```

후속 ActivityPub 예상 endpoint:

```txt
GET /.well-known/webfinger
GET /users/:username
GET /users/:username/outbox
POST /users/:username/inbox
GET /reviews/:id
GET /ap/reviews/:id
```

주의:

- 이번 프론트 작업에서 위 ActivityPub endpoint를 실제 호출하지 않는다.
- URL 구조와 타입만 대비한다.
- ActivityPub 객체 생성, 서명, delivery는 백엔드 후속 작업으로 남긴다.

---

## 10단계: 검증

가능한 명령을 실행한다.

예:

```bash
npm run lint
npm run build
npm run typecheck
```

또는:

```bash
pnpm lint
pnpm build
pnpm typecheck
```

명령이 없으면 package.json 기준으로 가능한 검증만 수행한다.

최종 보고에 포함할 것:

- 변경 파일 목록
- 주요 변경 요약
- 실행한 검증 명령
- 실패한 검증이 있다면 원인
- 남은 TODO
- 기존 기능 유지 여부
