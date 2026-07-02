# Mock Auth TODO

## Goal

- 현재 프론트의 비회원/회원 분기를 실제 백엔드 인증으로 치환한다.

## Backend

- `POST /auth/login`, `POST /auth/logout`, `GET /auth/session`를 실제 인증 로직으로 구현한다.
- Mock 전용 `accessToken` 대신 HttpOnly cookie 또는 JWT 기반 세션 정책을 확정한다.
- 비회원은 `public`/`local` 포스트만 조회 가능하게 하고, `followers`/`private`은 서버에서 차단한다.
- 팔로잉 피드, 포스트 작성, 프로필 수정, 응원팀 수정 API에 인증 체크를 추가한다.
- 내부 호출 전용 응답에서는 ActivityPub 배포용 내부 필드를 숨기는 직렬화 분기를 둔다.

## Frontend

- `HttpMatchlogApi`에 실제 로그아웃 엔드포인트와 세션 갱신 흐름을 연결한다.
- 앱 시작 시 세션을 전역으로 hydrate하는 store/provider를 도입한다.
- 비회원 CTA 문구와 로그인 유도 위치를 화면별로 정리한다.
- 좋아요/팔로우 같은 상호작용도 비회원 정책에 맞게 추가 제한할지 확정한다.

## QA

- 비회원: 홈/달력/경기 상세/공개 프로필 조회 가능 여부를 확인한다.
- 회원: 로그인 후 포스트 작성, 팔로우, 비공개/팔로워 포스트 노출 여부를 확인한다.
- 회원 -> 로그아웃 직후 작성 버튼, 팔로잉 피드, 수정 버튼이 즉시 사라지는지 확인한다.
