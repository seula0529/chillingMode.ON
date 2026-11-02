<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ChillMascot from './ChillMascot.vue'
import QuestionFrame from './QuestionFrame.vue'
import { LINES, QUESTIONS } from '../questions'
import { useSignupForm } from '../composables/useSignupForm'

const props = defineProps({
  status: { type: String, required: true },
})
const emit = defineEmits(['submit'])

const { form, validateAll, isStepComplete } = useSignupForm()

// 선택 문항은 무언가 골랐을 때만 '완료'로 표시
function isAnswered(q) {
  if (q.required) return isStepComplete(q.key)
  return form.activities.length > 0 || form.activitiesEtc.trim() !== ''
}

const activeKey = ref(null)
const oops = ref(false)

const activeQuestion = computed(() => QUESTIONS.find((q) => q.key === activeKey.value))

const mood = computed(() => (oops.value || props.status === 'error' ? 'oops' : 'calm'))

const line = computed(() => {
  if (props.status === 'sending') return LINES.sending
  if (props.status === 'error') return LINES.error
  if (oops.value) return LINES.oops
  return activeQuestion.value ? activeQuestion.value.line : LINES.intro
})

function setActive(key) {
  if (activeKey.value !== key) oops.value = false
  activeKey.value = key
}

function jumpTo(key) {
  const el = document.getElementById(`q-${key}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  document.getElementById(`q-${key}-title`)?.focus({ preventScroll: true })
  setActive(key)
}

async function onSubmit() {
  const firstInvalid = validateAll()
  if (firstInvalid) {
    oops.value = true
    activeKey.value = firstInvalid
    await nextTick()
    const el = document.getElementById(`q-${firstInvalid}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.querySelector('[aria-invalid="true"], input')?.focus({ preventScroll: true })
    return
  }
  emit('submit')
}

// 스크롤 위치에 맞춰 캐릭터 대사와 왼쪽 목록을 바꿉니다.
let observer
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id.replace(/^q-/, ''))
      })
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  QUESTIONS.forEach((q) => {
    const el = document.getElementById(`q-${q.key}`)
    if (el) observer.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="d">
    <aside class="d__side">
      <div class="d__side-inner">
        <p class="d__eyebrow">바쁜 일상 속 잠깐의 여유를 즐기고 싶다면?</p>
        <h1 class="t-title d__title">칠링모드</h1>

        <ChillMascot class="d__mascot" variant="side" :line="line" :mood="mood" />

        <nav class="d__toc" aria-label="문항 바로가기">
          <ol>
            <li v-for="(q, i) in QUESTIONS" :key="q.key">
              <button
                type="button"
                :class="{ 'is-active': activeKey === q.key, 'is-done': isAnswered(q) }"
                @click="jumpTo(q.key)"
              >
                <span class="d__toc-mark" aria-hidden="true">
                  <svg v-if="isAnswered(q)" viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <template v-else>{{ i + 1 }}</template>
                </span>
                {{ q.short }}<span v-if="q.required" class="d__toc-req">*</span>
              </button>
            </li>
          </ol>
        </nav>
        <p class="d__note"><span>*</span> 표시는 필수 질문이에요.</p>
      </div>
    </aside>

    <form class="d__sheet" novalidate @submit.prevent="onSubmit">
      <QuestionFrame
        v-for="(q, i) in QUESTIONS"
        :id="q.key"
        :key="q.key"
        class="d__card"
        :number="i + 1"
        :title="q.title"
        :desc="q.desc"
        :required="q.required"
        :active="activeKey === q.key"
        @focusin="setActive(q.key)"
      >
        <component :is="q.component" />
      </QuestionFrame>

      <div class="d__submit">
        <button type="submit" class="btn btn--primary d__submit-btn" :disabled="status === 'sending' || !form.consent">
          {{ status === 'sending' ? '보내는 중…' : '신청하기' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.d {
  display: grid;
  grid-template-columns: minmax(250px, 350px) 1fr;
  min-height: 100vh;
}

.d__side {
  background: var(--green);
  color: var(--ivory);
}

.d__side-inner {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 50px 30px 30px;
}

.d__eyebrow {
  font-weight: 600;
}

.d__mascot {
  margin-bottom: 25px;
}

.d__mascot :deep(.mascot__bubble) {
  background: var(--ivory);
  color: var(--ink);
}

.d__toc ol {
  display: grid;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.d__toc button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--ivory);
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
}

.d__toc button:hover,
.d__toc button.is-active {
  background: var(--ivory);
  color: var(--ink);
}

.d__toc-mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: var(--line) solid currentColor;
  font-weight: 700;
}

.d__toc-mark svg {
  width: 15px;
  height: 15px;
}

.d__toc button.is-done .d__toc-mark {
  background: var(--brown);
  border-color: var(--brown);
  color: var(--ivory);
}

.d__toc-req {
  margin-left: 5px;
}

.d__note {
  margin-top: auto;
  padding-top: 25px;
}

.d__note span {
  font-weight: 700;
}

.d__sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 80px clamp(30px, 5vw, 80px) 120px;
  width: 100%;
}

.d__card {
  width: min(100%, 680px);
  padding: 35px 40px;
  border: var(--line) solid var(--ink);
  border-radius: 28px;
  background: var(--ivory);
  scroll-margin: 40px;
  transition: box-shadow 0.25s, transform 0.25s;
}

.d__card.q--active {
  box-shadow: 10px 10px 0 var(--green);
  transform: translate(-4px, -4px);
}

.d__submit {
  display: flex;
  justify-content: center;
  padding-top: 15px;
}

.d__submit-btn {
  min-width: 280px;
  min-height: 65px;
}
</style>
