# DOMA

흑백 토론 아레나. X / Threads / Instagram 감성의 **모바일 웹** 메인 골격입니다.

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- 목 데이터만 사용 (인증·DB·비밀키 없음)

## 화면 구성

1. **Header** — `DOMA`+`kr` + 「판결까지」+ **빨간** 카운트다운
2. **ArenaBar(판결 블록)** — 회차·논제 / 검사·변호 탭 / 대표 인용 / 흑·백 스플릿 참전
3. **OpinionFeed** — Threads형 의견 스크롤
4. **WieldBar** — 작성(+) 바텀시트
5. **BottomNav** — 홈 / 아레나 / 작성 / 알림 / 프로필

빨강은 타이머에만. 중앙 컬럼 max-width ≈ 560px.

## 실행

```bash
npm install
npm run dev -- -p 43123 -H 127.0.0.1
```

브라우저에서 [http://127.0.0.1:43123](http://127.0.0.1:43123) 을 엽니다.

## 환경 변수

`.env.example` 참고. 현재 단계에서는 필수 비밀값이 없습니다.
