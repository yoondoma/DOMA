# DOMA

흑백 토론 아레나. X / Threads / Instagram 감성의 **모바일 웹** 메인 골격입니다.

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- 목 데이터만 사용 (인증·DB·비밀키 없음)

## 화면 구성

1. **Header** — 슬림 `DOMA` + 실시간 카운트다운 + LIVE
2. **ArenaBar** — 논제 / NEXUS vs AEGIS 게이지 / 참전
3. **OpinionFeed** — 탭 필터 + Top 소수의견 + 피드형 카드
4. **WieldBar** — 작성(+) 탭 → 바텀시트로 280자 진술 제출
5. **BottomNav** — 홈 / 아레나 / 작성 / 알림 / 프로필

중앙 컬럼 max-width ≈ 560px.

## 실행

```bash
npm install
npm run dev -- -p 43123 -H 127.0.0.1
```

브라우저에서 [http://127.0.0.1:43123](http://127.0.0.1:43123) 을 엽니다.

## 환경 변수

`.env.example` 참고. 현재 단계에서는 필수 비밀값이 없습니다.
