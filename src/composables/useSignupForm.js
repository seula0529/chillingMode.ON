import { reactive } from 'vue'

export const ATTENDANCE_OPTIONS = [
  { value: 'weekly', label: '매주 참석 가능', sub: '화요일 저녁 7시' },
  { value: 'biweekly', label: '2주에 한 번 참석 가능' },
  { value: 'weekend', label: '주말만 가능' },
]

export const ACTIVITY_EXAMPLES = [
  '글쓰기',
  '영화',
  '독서',
  '맛집 탐방',
  '카페',
  '보드게임',
  '롤플레잉',
  '산책',
  '베이킹 클래스',
]

export const MBTI_AXES = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
]

const PHONE_RE = /^01[016789]-?\d{3,4}-?\d{4}$/

function initialForm() {
  return {
    name: '',
    age: '',
    gender: '',
    mbti: ['', '', '', ''],
    mbtiUnknown: false,
    gu: '',
    // '광산구 우산동'처럼 구 이름까지 붙은 값
    dong: '',
    attendance: '',
    activities: [],
    activitiesEtc: '',
    contact: '',
    consent: false,
    // 스팸 봇 방지용 숨김 필드 (사람은 비워둠)
    website: '',
  }
}

// 모듈 단위로 한 번만 만들어 모든 컴포넌트가 같은 상태를 공유합니다.
const form = reactive(initialForm())
const errors = reactive({})

const validators = {
  profile() {
    const e = {}
    if (!form.name.trim()) e.name = '이름을 알려주세요.'
    const age = Number(form.age)
    if (!form.age) e.age = '나이를 알려주세요.'
    else if (age < 20 || age > 35) e.age = '20세~35세만 신청할 수 있어요.'
    else if (!Number.isInteger(age)) e.age = '나이를 숫자로 정확히 적어주세요.'
    if (!form.gender) e.gender = '성별을 골라주세요.'
    if (!form.mbtiUnknown && form.mbti.some((v) => !v)) e.mbti = 'MBTI 네 자리를 모두 골라주세요.'
    if (!form.gu) e.dong = '사는 구를 골라주세요.'
    else if (!form.dong) e.dong = '사는 동을 골라주세요.'
    return e
  },
  attendance() {
    return form.attendance ? {} : { attendance: '참석 가능한 일정을 하나 골라주세요.' }
  },
  activities() {
    return {}
  },
  contact() {
    const v = form.contact.trim()
    if (!v) return { contact: '연락처를 남겨주세요.' }
    if (!PHONE_RE.test(v)) return { contact: '휴대폰 번호 형식을 확인해주세요. (예: 010-1234-5678)' }
    return {}
  },
  consent() {
    return form.consent ? {} : { consent: '동의해주셔야 신청할 수 있어요.' }
  },
}

export const STEP_FIELDS = {
  profile: ['name', 'age', 'gender', 'mbti', 'dong'],
  attendance: ['attendance'],
  activities: [],
  contact: ['contact'],
  consent: ['consent'],
}

function validateStep(key) {
  STEP_FIELDS[key].forEach((f) => delete errors[f])
  const result = validators[key]()
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

function validateAll() {
  // 모든 문항을 검사하고, 처음 실패한 문항 키를 돌려줍니다.
  let firstInvalid = null
  for (const key of Object.keys(validators)) {
    if (!validateStep(key) && !firstInvalid) firstInvalid = key
  }
  return firstInvalid
}

function clearError(field) {
  delete errors[field]
}

function isStepComplete(key) {
  return Object.keys(validators[key]()).length === 0
}

function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function buildPayload() {
  const attendance = ATTENDANCE_OPTIONS.find((o) => o.value === form.attendance)
  return {
    submittedAt: new Date().toISOString(),
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender,
    mbti: form.mbtiUnknown ? '모름' : form.mbti.join(''),
    dong: form.dong.trim(),
    attendance: attendance ? attendance.value : '',
    attendanceLabel: attendance ? attendance.label : '',
    activities: [...form.activities],
    activitiesEtc: form.activitiesEtc.trim(),
    contact: form.contact.trim(),
    consent: form.consent,
    website: form.website,
  }
}

function reset() {
  Object.assign(form, initialForm())
  Object.keys(errors).forEach((k) => delete errors[k])
}

export function useSignupForm() {
  return {
    form,
    errors,
    validateStep,
    validateAll,
    clearError,
    isStepComplete,
    formatPhone,
    buildPayload,
    reset,
  }
}
