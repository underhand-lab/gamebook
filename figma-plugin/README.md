# gamelog Wireframe Generator

Figma에서 gamelog 와이어프레임과 Design System 페이지를 자동 생성하는 플러그인입니다. 현재 프론트엔드의 따뜻한 배경, 파란 포인트, 둥근 카드 톤을 반영합니다.

## 생성 내용

- Design System 페이지
- Color tokens
- Typography tokens
- Spacing tokens
- Buttons
- Cards
- Tabs
- Review Card
- Match Card
- Sidebar Navigation
- 1440px Desktop wireframes

## 생성 화면

1. Home Feed
2. Timeline
3. Match Detail
4. Write Review
5. Profile
6. Stadium Collection
7. Badges
8. Lists
9. Wrapped

## 최근 반영 사항

- Home 화면을 `내 포스트`, `친구 포스트`, `전체 최신` 탭 구조로 반영
- Profile 화면을 상단 별도 프로필 카드 없이, 좌측 프로필 정보 + 우측 통계 모음 구조로 반영
- Design System의 버튼/탭 예시를 현재 UI 용어와 라운드 톤으로 정리

## 실행 방법

1. Figma Desktop을 엽니다.
2. `Plugins > Development > Import plugin from manifest...`를 선택합니다.
3. 이 폴더의 `manifest.json`을 선택합니다.
4. `Plugins > Development > gamelog Wireframe Generator`를 실행합니다.
5. `gamelog Design System`과 `gamelog Wireframes` 페이지가 생성됩니다.

## 파일 구조

- `manifest.json`: Figma plugin manifest
- `code.ts`: TypeScript source entry
- `src/`: TypeScript source modules
- `code.js`: Figma runtime bundle used by `manifest.json`

## 메모

- PNG/SVG 이미지를 사용하지 않습니다.
- 생성되는 UI는 Frame, Text, Rectangle, Component 기반의 편집 가능한 Figma 레이어입니다.
- 별도 npm 의존성 없이 실행할 수 있도록 `code.js`를 함께 포함했습니다.
- 소스를 수정한 경우 같은 변경을 `code.js` 런타임 번들에도 반영해야 합니다.
