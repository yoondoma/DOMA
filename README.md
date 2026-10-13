# DOMA

흑백 토론 아레나. 오늘의 논제에 참전하고, 280자 진술로 여론을 움직이는 웹 앱의 **메인 골격**입니다.

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- 목 데이터만 사용 (인증·DB·비밀키 없음)

## 화면 구성

1. **Header** — `DOMA` 브랜드 + 실시간 카운트다운 + LIVE
2. **ArenaBar** — 논제 / NEXUS vs AEGIS 게이지 / 참전 버튼
3. **OpinionFeed** — 탭 필터 + Top 소수의견 고정 + 흑백 카드
4. **WieldBar** — 하단 고정 280자 진술 입력

## 실행

```bash
npm install
npm run dev -- -p 43123 -H 127.0.0.1
```

브라우저에서 [http://127.0.0.1:43123](http://127.0.0.1:43123) 을 엽니다.

```bash
npm run build
npm run start -- -p 43123
```

## 환경 변수

`.env.example` 참고. 현재 단계에서는 필수 비밀값이 없습니다.
