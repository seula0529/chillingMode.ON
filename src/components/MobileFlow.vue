<script setup>
import { computed, nextTick, ref } from 'vue'
import ChillMascot from './ChillMascot.vue'
import QuestionFrame from './QuestionFrame.vue'
import { LINES, QUESTIONS } from '../questions'
import { useSignupForm } from '../composables/useSignupForm'

const props = defineProps({
  status: { type: String, required: true },
})
const emit = defineEmits(['submit'])

const { form, validateStep } = useSignupForm()

// 0 = 인트로, 1..N = 문항
const step = ref(0)
const direction = ref('next')
const oops = ref(false)

const total = QUESTIONS.length
const current = computed(() => QUESTIONS[step.value - 1])
const isLast = computed(() => step.value === total)

const mood = computed(() => {
  if (oops.value || props.status === 'error') return 'oops'
  return 'calm'
})

const line = computed(() => {
  if (props.status === 'sending') return LINES.sending
  if (props.status === 'error' && isLast.value) return LINES.error
  if (oops.value) return LINES.oops
  return step.value === 0 ? LINES.intro : current.value.line
})

async function go(to) {
  direction.value = to > step.value ? 'next' : 'prev'
  step.value = to
  oops.value = false
  window.scrollTo({ top: 0 })
  await nextTick()
  if (step.value > 0) document.getElementById(`q-${current.value.key}-title`)?.focus()
}

function next() {
  if (step.value > 0 && !validateStep(current.value.key)) {
    oops.value = true
    return
  }
  if (isLast.value) {
    emit('submit')
    return
  }
  go(step.value + 1)
}

function prev() {
  if (step.value > 0) go(step.value - 1)
}
</script>

<template>
  <div class="m">
    <header class="m__top">
      <div class="m__bar">
        <button v-if="step > 0" type="button" class="m__back" aria-label="이전 문항" @click="prev">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span v-else class="m__back-spacer" aria-hidden="true"></span>
        <ol class="m__progress" :aria-label="`${total}개 중 ${step}번째 문항`">
          <li v-for="(q, i) in QUESTIONS" :key="q.key" :class="{ done: i < step - 1, now: i === step - 1 }"></li>
        </ol>
        <span class="m__count" aria-hidden="true">{{ step }}/{{ total }}</span>
      </div>
      <ChillMascot v-if="step > 0" :line="line" :mood="mood" />
    </header>

    <form class="m__main" novalidate @submit.prevent="next">
      <Transition :name="`slide-${direction}`" mode="out-in">
        <div v-if="step === 0" key="intro" class="intro">
          <ChillMascot variant="cover" :line="line" />
          <h1 class="t-title intro__title">칠링모드</h1>
          <div class="intro__story t-voice">
            <p>칠링모드에게 이런 사람들이 모여요</p>
            <p>1. 혼자하기 어려운 취미생활을 하고싶은 사람<br>ex.볼링,베이킹클래스 등등</p>
            <p>2. 잠시 숨 돌릴 틈이 필요한 사람</p>
            <p>3. 새로운 인맥을 늘리고 싶은 사람</p>
            <p>*매주 화7시에 진행</p>
          </div>
          <p class="intro__note"><span class="req">*</span> 표시는 필수 질문이에요.</p>
        </div>
        <QuestionFrame
          v-else
          :id="current.key"
          :key="current.key"
          :number="step"
          :title="current.title"
          :desc="current.desc"
          :required="current.required"
        >
          <component :is="current.component" />
        </QuestionFrame>
      </Transition>

      <div class="m__nav">
        <button type="submit" class="btn btn--primary m__next" :disabled="status === 'sending' || (isLast && !form.consent)">
          <template v-if="step === 0">시작하기</template>
          <template v-else-if="isLast">{{ status === 'sending' ? '보내는 중…' : '신청하기' }}</template>
          <template v-else-if="!current.required">다음 (건너뛰어도 돼요)</template>
          <template v-else>다음</template>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.m {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.m__top {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--ivory);
  padding: calc(env(safe-area-inset-top) + 10px) 0 10px;
  display: grid;
  gap: 15px;
  border-bottom: var(--line) solid var(--ink);
}

.m__bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.m__back,
.m__back-spacer {
  flex: none;
  width: 35px;
  height: 35px;
}

.m__back {
  display: grid;
  place-items: center;
  padding: 0;
  border: var(--line) solid var(--ink);
  border-radius: 50%;
  background: var(--ivory);
}

.m__back svg {
  width: 20px;
  height: 20px;
}

.m__progress {
  flex: 1;
  display: flex;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.m__progress li {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  border: var(--line) solid var(--ink);
  background: var(--ivory);
  transition: background-color 0.25s;
}

.m__progress li.done {
  background: var(--green);
  border-color: var(--green);
}

.m__progress li.now {
  background: var(--brown);
  border-color: var(--brown);
}

.m__count {
  flex: none;
  font-weight: 700;
  color: var(--green);
  min-width: 2.5em;
  text-align: right;
}

.m__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
}

.m__main > :first-child {
  flex: 1;
}

.intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding-bottom: 40px;
}

.intro__title {
  margin-top: 10px;
  text-align: center;
  color: var(--green);
}

.intro__story {
  display: grid;
  gap: 10px;
  padding: 20px;
  border: var(--line) dashed var(--brown);
  border-radius: var(--radius);
}

.intro__story p:first-child {
  color: var(--green);
}

.intro__note {
  text-align: center;
}

.intro .req {
  color: var(--brown);
  font-weight: 700;
}

.m__nav {
  position: sticky;
  bottom: 0;
  padding: 15px 0 calc(env(safe-area-inset-bottom) + 20px);
  background: var(--ivory);
}

.m__next {
  width: 100%;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.slide-next-enter-from,
.slide-prev-leave-to {
  transform: translateX(24px);
  opacity: 0;
}

.slide-next-leave-to,
.slide-prev-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
</style>
