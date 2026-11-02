# 칠링모드 가입양식

Vue 3 + Vite로 만든 칠링모드 가입 신청 페이지입니다.

- **모바일 (767px 이하)**: 인트로 → 한 화면에 한 문항씩 → 신청하기
- **PC (768px 이상)**: 왼쪽 초록 패널(캐릭터 대사 + 문항 목록)과 오른쪽 문항 카드. 스크롤하거나 입력하면 해당 카드가 강조되고 캐릭터 대사가 바뀝니다.

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 에 배포용 결과물 생성
```

## 폰트

CDN을 쓰지 않고 `public/fonts/`에 넣은 파일만 사용합니다.

| 용도 | 폰트 | 파일 이름 |
| --- | --- | --- |
| 제목 | 낭만있구미체 | `public/fonts/GumiRomance.otf` |
| 본문 | Pretendard | `public/fonts/Pretendard-{Regular,Medium,SemiBold,Bold}.woff2`|
| 캐릭터 대사 | 온글잎 윤탱체 | `public/fonts/온글잎윤탱체.ttf` |

## 색상

[src/styles/base.css](src/styles/base.css)의 네 가지 토큰만 사용합니다. 다른 색(투명도 변형 포함)을 추가하지 마세요.

## 신청서 전송 (텔레그램 봇)

"신청하기"를 누르면 `VITE_SUBMIT_ENDPOINT`로 아래 JSON을 `POST`합니다.
배포 빌드에서는 [.env.production](.env.production)에 따라 같은 Vercel 프로젝트의 [api/submit.js](api/submit.js)로 보내고,
이 함수가 값을 다시 검사한 뒤 텔레그램 그룹에 알림을 보냅니다.
`npm run dev`에서는 주소가 비어 있으므로 콘솔에 출력만 하고 완료 화면으로 넘어갑니다.

### Vercel 설정

1. Vercel에서 이 GitHub 저장소를 Import (Framework Preset: Vite — 자동 인식)
2. Settings → Environment Variables 에 추가
   - `TELEGRAM_BOT_TOKEN` : BotFather에게 받은 봇 토큰
   - `TELEGRAM_CHAT_ID` : 알림 받을 그룹 Chat ID (`-100…`)
   - `TELEGRAM_THREAD_ID` : (선택) 알림 받을 토픽 번호. 토픽 메시지 링크 `t.me/c/123…/5/…`의 가운데 숫자. 비워두면 General
3. 환경 변수를 넣거나 바꾼 뒤에는 Deployments에서 **Redeploy** 해야 반영됩니다.

봇 토큰은 Vercel 환경 변수에만 두고, 코드나 `.env.production`에는 절대 넣지 마세요.

```json
{
  "submittedAt": "2026-11-01T09:00:00.000Z",
  "name": "홍길동",
  "age": 28,
  "gender": "여성",
  "mbti": "INFP",
  "dong": "광산구 송정1동",
  "attendance": "weekly",
  "attendanceLabel": "매주 참석 가능",
  "activities": ["독서", "산책"],
  "activitiesEtc": "",
  "contact": "010-1234-5678",
  "consent": true
}
```

`.env.example`을 `.env`로 복사한 뒤 주소를 넣으면 됩니다.

### 봇 토큰을 이 페이지에 넣으면 안 되는 이유

브라우저에서 텔레그램 API를 직접 부르면 봇 토큰이 그대로 노출되어 누구나 그룹에 메시지를 보낼 수 있습니다.
그래서 중간에 작은 서버(Cloudflare Workers, Vercel/Netlify Functions, Google Apps Script 등)를 두고, 그 서버가 토큰을 가진 채 텔레그램으로 보내는 구조를 권장합니다.

```
[가입 페이지] --POST JSON--> [중계 서버] --sendMessage--> [텔레그램 그룹]
                                  └--append row--> [스프레드시트]
```

### 스프레드시트 연결이 필요한가?

**필요합니다.** 신청 알림만 보내는 것은 서버 없이 저장 없이도 되지만,
"특정 날짜에 만나기로 한 사람 목록"을 봇이 답하려면 신청자와 일정 데이터가 어딘가에 쌓여 있어야 합니다.
텔레그램 봇은 지난 메시지를 다시 조회할 수 없기 때문입니다.

추천 구성: **Google Sheets + Google Apps Script**

- 별도 서버 비용 없이 Apps Script 웹 앱 URL을 `VITE_SUBMIT_ENDPOINT`로 사용
- `신청자` 시트: 신청서 응답을 한 줄씩 저장 (운영진이 바로 보고 수정 가능)
- `일정` 시트: 날짜 / 참석자 이름을 관리 → 봇이 `/명단 11-04` 같은 명령에 이 시트를 읽어 답장
- 개인정보 보유 기간(신청일로부터 2주) 지난 미참여자 행을 지우는 트리거도 Apps Script로 설정 가능

참고: 현재 양식은 참석 **성향**(매주/격주/주말)만 받고 특정 **날짜**는 받지 않습니다.
날짜별 명단은 운영진이 `일정` 시트에 배정하거나, 이후 봇에서 참석 확인을 받는 방식으로 채워야 합니다.
