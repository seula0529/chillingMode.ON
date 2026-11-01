import ProfileQuestion from './components/questions/ProfileQuestion.vue'
import AttendanceQuestion from './components/questions/AttendanceQuestion.vue'
import ActivitiesQuestion from './components/questions/ActivitiesQuestion.vue'
import ContactQuestion from './components/questions/ContactQuestion.vue'
import ConsentQuestion from './components/questions/ConsentQuestion.vue'

export const QUESTIONS = [
  {
    key: 'profile',
    short: '나를 소개해요',
    title: '이름 / 나이 / 성별 / MBTI / 사는 동',
    required: true,
    line: '먼저 서로 알아가 볼까요?',
    component: ProfileQuestion,
  },
  {
    key: 'attendance',
    short: '정모 참석',
    title: '정모 참석 가능 여부',
    required: true,
    line: '언제 만날 수 있는지 알려줘요!',
    component: AttendanceQuestion,
  },
  {
    key: 'activities',
    short: '하고 싶은 것',
    title: '해보고 싶은 게더링 활동이 있다면?',
    required: false,
    line: '같이 해보고 싶은 거, 뭐든 좋아요.',
    component: ActivitiesQuestion,
  },
  {
    key: 'contact',
    short: '연락처',
    title: '모임장과 소통할 연락처를 남겨주세요.',
    desc: '도착 여부, 일정 공유 용도 외에 2차 도용하지 않습니다.',
    required: true,
    line: '약속 날 도착 확인할 때만 연락할게요.',
    component: ContactQuestion,
  },
  {
    key: 'consent',
    short: '개인정보 동의',
    title: '개인정보 수집·이용 동의',
    required: true,
    line: '마지막이에요! 동의만 해주면 끝.',
    component: ConsentQuestion,
  },
]

export const LINES = {
  intro: '어서 와요, 잠깐 쉬어가요.',
  oops: '앗, 빠진 곳이 있어요!',
  sending: '두근두근, 보내는 중이에요…',
  error: '전송이 안 됐어요. 한 번만 다시 눌러줄래요?',
  done: '신청 고마워요! 곧 연락할게요.',
}
