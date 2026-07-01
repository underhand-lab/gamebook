# Current Task

## Goal

- `figma-plugin`의 디자인을 현재 프론트엔드 디자인 언어에 맞춘다.

## Plan

- [ ] 프론트 전역 스타일과 `figma-plugin` 토큰 차이를 확인한다.
- [ ] `figma-plugin`의 색상, 타이포, 라운드, 섀도우 톤을 프론트 기준으로 조정한다.
- [ ] Design System, screen copy, component sample을 현재 앱 용어와 톤으로 맞춘다.
- [ ] `code.js` 런타임 번들에도 동일한 변경을 반영한다.
- [ ] 표준 검증을 1회 수행한다.

## Progress

- 프론트는 따뜻한 베이지 배경, 선명한 파랑 포인트, `Avenir Next` 계열 타이포를 사용한다.
- `figma-plugin/src/tokens.ts`의 배경, 보더, 포인트 컬러와 폰트를 프론트 기준으로 조정했다.
- `figma-plugin/src/nodes.ts`의 기본 라운드 값을 더 크게 맞췄다.
- `figma-plugin/src/design-system.ts`의 설명 문구와 컴포넌트 예시를 현재 앱 톤으로 정리했다.
- `figma-plugin/src/spec.ts`와 `figma-plugin/src/tokens.ts`의 `Home Feed` 명칭을 `Home`으로 정리했다.
- `figma-plugin/code.js`에도 동일한 토큰/문구 변경을 일부 반영했다.

## Decisions

- 프론트 기준은 `frontend/app/globals.css`와 `frontend/src/components/app-shell.tsx`의 현재 시각 언어를 따른다.
- 플러그인 내부 와이어프레임은 구조를 유지하되, 색/타이포/라운드/카피를 우선 맞춘다.

## Pending

- `code.js`의 남은 버튼 라운드 및 세부 문구를 동기화해야 한다.

## Issues

- 없음.

## Change Log

- 2026-07-01: `figma-plugin` 디자인을 현재 프론트 디자인에 맞추는 작업 시작.
