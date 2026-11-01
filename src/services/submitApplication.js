/*
 * 신청서 전송.
 *
 * 텔레그램 봇 토큰은 브라우저에 두면 누구나 볼 수 있으므로, 이 페이지는 봇 API를 직접 부르지 않습니다.
 * 대신 VITE_SUBMIT_ENDPOINT(서버리스 함수 등)로 JSON을 보내고, 그 서버가
 * 텔레그램 그룹 알림 + (필요 시) 스프레드시트 저장을 맡습니다.
 */
const ENDPOINT = import.meta.env.VITE_SUBMIT_ENDPOINT

export async function submitApplication(payload) {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      console.info('[칠링모드] VITE_SUBMIT_ENDPOINT 미설정 — 전송 대신 출력합니다.', payload)
      await new Promise((r) => setTimeout(r, 700))
      return
    }
    throw new Error('전송 주소가 설정되지 않았습니다.')
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`전송 실패 (${res.status})`)
  }
}
