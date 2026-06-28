# gamelog Product Specification

> Version 0.1
>
> Last Updated: 2026-06-28

---

# gamelog

## Remember Every Game.

> We don't record scores.
>
> We record memories.

---

# 1. Overview

## What is gamelog?

gamelog는 스포츠 팬들을 위한 라이프로그(Lifelog) 플랫폼이다.

팬들은 단순히 경기 결과를 소비하는 것이 아니라,

- 경기를 보고
- 감정을 느끼고
- 응원하고
- 기록한다.

gamelog는 이러한 경험을 평생 저장하는 서비스이다.

영화 팬에게 Letterboxd가 있다면,

스포츠 팬에게는 gamelog가 있다.

---

# 2. Vision

모든 스포츠 팬의 스포츠 인생을 기록한다.

우리는 경기의 결과보다

그 경기를 경험한 사람의 이야기에 집중한다.

---

# 3. Mission

누구나

자신이 본 경기,

직관한 경기,

가장 좋아하는 경기,

잊지 못할 순간을

쉽게 기록하고 공유할 수 있도록 한다.

---

# 4. Core Philosophy

## Sports are Memories.

스포츠는 결과보다 기억이다.

오늘의 승패는 잊혀져도

첫 직관은 평생 기억된다.

우리는 그 기억을 저장한다.

---

# 5. Target Users

## Primary

20~40대 스포츠 팬

특징

- 직관을 자주 간다.
- SNS 사용량이 많다.
- 리뷰를 읽고 쓰는 것을 좋아한다.
- 자신의 기록을 남기는 것을 좋아한다.

---

## Secondary

- 해외축구 팬
- KBO 팬
- K리그 팬
- NBA 팬
- MLB 팬
- eSports 팬

---

# 6. Core Experience

사용자는

1. 경기를 찾는다.

↓

2. 관람을 기록한다.

↓

3. 리뷰를 남긴다.

↓

4. 다른 팬들과 소통한다.

↓

5. 자신의 스포츠 인생을 돌아본다.

---

# 7. Product Principles

## Record First

기록이 가장 중요하다.

SNS보다 기록을 우선한다.

---

## Fans First

팬의 감정을 존중한다.

데이터보다 팬을 중심으로 설계한다.

---

## Community Driven

리뷰와 평점은 커뮤니티가 만든다.

---

## Sports Neutral

특정 종목에 종속되지 않는다.

축구

야구

농구

배구

eSports

모두 지원한다.

---

# 8. Core Features

## Match Logging

경기를 기록한다.

기록 항목

- 경기
- 날짜
- 관람 방식
- 별점
- 리뷰
- 태그
- MVP
- 응원팀

---

## Review

리뷰 작성

포함 내용

- 별점
- 한줄평
- 장문 리뷰
- 스포일러
- 태그

---

## Match Page

모든 경기는 하나의 페이지를 가진다.

경기 페이지에는

- 경기 정보
- 리뷰
- 평점
- MVP
- 감정
- 태그

가 집계된다.

---

## Fan Perspective

모든 리뷰는

응원팀 기준으로 분류된다.

리뷰 작성 시 선택

- 홈팀 팬
- 원정팀 팬
- 타팀 팬
- 중립 팬

사용자는

원하는 팬의 리뷰만 볼 수 있다.

---

## Community Rating

경기마다

커뮤니티 평점이 존재한다.

또한

팬별 평점도 존재한다.

예시

- 전체
- 홈팬
- 원정팬
- 타팀 팬
- 중립 팬

---

## Community MVP

모든 사용자는 MVP를 선택할 수 있다.

패배팀 선수도 가능하다.

---

## Emotion

리뷰 작성 시

대표 감정을 선택한다.

예시

- 😄 행복
- 😭 감동
- 😱 긴장
- 😡 분노
- 🤯 충격

경기 페이지에서 집계된다.

---

## Tags

두 종류의 태그를 지원한다.

### Official Tags

자동 생성

예시

- 플레이오프
- 연장전
- 승부차기
- 결승전
- 노히트노런
- 퍼펙트게임

### User Tags

자유 입력

예시

- 올해최고
- 다시보고싶다
- 심장아프다
- 최고의직관

---

## Likes

사용자는

- 리뷰
- 리스트

에 좋아요를 누를 수 있다.

좋아요는

추천 시스템이 아니라

공감의 의미이다.

---

## Lists

사용자는

자신만의 리스트를 만든다.

예시

- 최고의 경기
- 최고의 직관
- 최고의 월드컵
- 울었던 경기

---

## Profile

프로필에는

모든 기록이 저장된다.

예시

- 총 경기
- 직관
- 라이브
- 평균 평점
- 리뷰 수
- 좋아요 수
- 응원팀

---

## Timeline

사용자는

자신의 모든 관람 기록을

시간순으로 돌아본다.

Timeline은

리뷰 목록이 아니라

경기 경험의 기록 피드이다.

포함 내용

- 경기
- 관람 방식
- 팬 관점
- 별점
- 대표 감정
- 태그
- 리뷰 요약
- MVP

---

## Statistics

자동 생성

예시

- 가장 많이 본 팀
- 가장 많이 본 선수
- 가장 많이 본 경기장
- 직관 승률
- 응원팀 승률
- 평균 평점
- 가장 많이 느낀 감정

---

## Stadium Collection

방문한 경기장을 수집한다.

지도 형태로 제공한다.

---

## Ticket Integration

예매 사이트 연동

자동 기록

직관 인증

Verified Attendance 제공

---

## Badges

### Experience

- 첫 경기
- 첫 직관
- 첫 승리
- 첫 포스트시즌
- 첫 해외 직관

### Activity

- 첫 리뷰
- 리뷰왕
- 출석왕

### Special

- 우승 직관
- 노히트노런 직관
- 해트트릭 직관

---

## Wrapped

매년

자동으로

스포츠 활동을 요약한다.

예시

- 올해 본 경기
- 직관 횟수
- 최고의 경기
- 평균 평점
- 올해 가장 많이 느낀 감정

---

# 9. MVP Scope

초기 버전에서 제공

- 회원가입
- 프로필
- 경기 검색
- 리뷰
- 평점
- 태그
- 좋아요
- MVP
- 관람 방식
- 팬 관점
- Timeline
- 통계

---

# 10. Future Features

- AI 리뷰 요약
- AI 경기 요약
- 하이라이트 연동
- 친구 비교
- Diary
- Fantasy League 연동
- Apple Wallet 티켓 연동
- Google Wallet 티켓 연동

---

# 11. Success Metrics

서비스 성공 지표

- Daily Active Users
- Monthly Active Users
- 리뷰 작성률
- 경기당 리뷰 수
- 경기당 MVP 투표 수
- 평균 체류 시간
- 재방문율
- 직관 인증률

---

# 12. Long-term Goal

gamelog는 스포츠 결과를 보여주는 서비스가 아니다.

팬의 스포츠 인생을 기록하는 플랫폼이다.

10년 후 사용자는

"2019년 첫 직관"

"2026년 최고의 경기"

"2031년 우승 직관"

을 gamelog에서 다시 추억하게 된다.

우리는 스포츠의 데이터를 만드는 것이 아니라,

스포츠 팬들의 추억을 기록한다.
