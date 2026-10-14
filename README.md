# DOMA

흑백 토론 아레나. X / Threads 감성의 **모바일 웹** 메인 골격입니다.

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- 목 데이터만 사용 (인증·DB·비밀키 없음)
- 결과 카드 캡처: `html2canvas`

## 폰트

| 용도 | 서체 | 라이선스 |
|---|---|---|
| 본문·UI | **Pretendard** (`pretendard` npm) | SIL OFL 1.1 |
| 주제·디스플레이·워드마크 | **Noto Serif KR** (`next/font`) | SIL OFL 1.1 |

폴백: `Apple SD Gothic Neo`, `Malgun Gothic`, `Noto Sans KR`, sans-serif / serif.  
고지: [`public/fonts/NOTICE`](public/fonts/NOTICE)

## 화면 구성

1. **Header** — `DOMA`(절제) · 빨간 카운트다운 · **[오늘 | 내일]** 1급 전환 · 달력/검색
2. **오늘 아레나** — 주제 우선 → 진영 펼침(2/3) · 실시간 의견
3. **내일 필드** — 후보를 하나씩 점검·지지/이끌기 (달력 미래 탭과 후보 공유)
4. **작성(+)** — 오늘 글 / 내일 주제 제안
5. **결과 증명 카드** — 알림「결과 확정」·프로필 전투 기록에서 열기 · PNG 저장/공유
6. **BottomNav** — 아레나 / 메시지 / + / 알림 / 프로필 (아이콘만)

빨강은 타이머·증명 카드 승 표시에만. 중앙 컬럼 max-width ≈ 560px.

## 실행

```bash
npm install
npm run dev -- -p 43123 -H 127.0.0.1
```

브라우저에서 [http://127.0.0.1:43123](http://127.0.0.1:43123) 을 엽니다.
