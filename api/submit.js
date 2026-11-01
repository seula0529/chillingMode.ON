/*
 * Vercel 서버리스 함수: 가입 신청서를 받아 텔레그램 그룹으로 알림을 보냅니다.
 *
 * Vercel 프로젝트 → Settings → Environment Variables 에 아래 두 값을 넣어야 합니다.
 *   TELEGRAM_BOT_TOKEN  BotFather에게 받은 봇 토큰
 *   TELEGRAM_CHAT_ID    알림을 받을 그룹 Chat ID (-100으로 시작)
 * 토큰은 서버에서만 읽히고 브라우저에는 노출되지 않습니다.
 */

const ATTENDANCE_LABELS = {
  weekly: '매주 참석 가능 (화 저녁 7시)',
  biweekly: '2주에 한 번 참석 가능',
  weekend: '주말만 가능',
}

const GENDERS = ['여성', '남성']
const PHONE_RE = /^01[016789]-?\d{3,4}-?\d{4}$/
const MBTI_RE = /^([EI][SN][TF][JP]|모름)$/

function text(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

// 브라우저에서 온 값은 믿지 않고 여기서 다시 검사합니다.
function validate(body) {
  const data = {
    name: text(body.name, 20),
    age: Number(body.age),
    gender: text(body.gender, 10),
    mbti: text(body.mbti, 4).toUpperCase(),
    dong: text(body.dong, 20),
    attendance: text(body.attendance, 20),
    activities: Array.isArray(body.activities) ? body.activities.map((a) => text(a, 20)).filter(Boolean).slice(0, 20) : [],
    activitiesEtc: text(body.activitiesEtc, 200),
    contact: text(body.contact, 20),
    consent: body.consent === true,
  }

  const problems = []
  if (!data.name) problems.push('name')
  if (!Number.isInteger(data.age) || data.age < 20 || data.age > 35) problems.push('age')
  if (!GENDERS.includes(data.gender)) problems.push('gender')
  if (!MBTI_RE.test(data.mbti)) problems.push('mbti')
  if (!data.dong) problems.push('dong')
  if (!ATTENDANCE_LABELS[data.attendance]) problems.push('attendance')
  if (!PHONE_RE.test(data.contact)) problems.push('contact')
  if (!data.consent) problems.push('consent')

  return { data, problems }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatKst(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function buildMessage(d, receivedAt = new Date()) {
  const activities = [d.activities.join(', '), d.activitiesEtc].filter(Boolean).join(' / ') || '-'
  const rows = [
    ['이름', d.name],
    ['나이 / 성별', `${d.age} / ${d.gender}`],
    ['MBTI', d.mbti],
    ['사는 동', d.dong],
    ['정모 참석', ATTENDANCE_LABELS[d.attendance]],
    ['해보고 싶은 활동', activities],
    ['연락처', d.contact],
  ]
  return [
    '<b>🌿 칠링모드 새 가입 신청</b>',
    '',
    ...rows.map(([k, v]) => `<b>${k}</b>  ${escapeHtml(v)}`),
    '',
    `<i>${escapeHtml(formatKst(receivedAt))} 접수</i>`,
  ].join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 환경 변수가 없습니다.')
    return res.status(500).json({ ok: false, error: 'server_not_configured' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ ok: false, error: 'invalid_json' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' })
  }

  // 스팸 봇이 숨김 필드를 채웠다면 성공처럼 응답만 하고 보내지 않음
  if (body.website) {
    return res.status(200).json({ ok: true })
  }

  const { data, problems } = validate(body)
  if (problems.length) {
    return res.status(400).json({ ok: false, error: 'invalid_fields', fields: problems })
  }

  const tg = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: buildMessage(data),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!tg.ok) {
    console.error('텔레그램 전송 실패', tg.status, await tg.text())
    return res.status(502).json({ ok: false, error: 'telegram_failed' })
  }

  return res.status(200).json({ ok: true })
}
