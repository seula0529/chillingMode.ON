<script setup>
import { useSignupForm } from '../../composables/useSignupForm'

const { form, errors, clearError } = useSignupForm()

const TERMS = [
  ['수집 항목', '이름, 나이, 성별, MBTI, 사는 동, 연락처, 정모 참석 가능 여부, 희망 활동'],
  ['이용 목적', '신청 확인, 일정 안내 및 모임 운영'],
  ['보유 기간', '신청일로부터 2주 내 파기 (모임 참여자는 탈퇴 시까지)'],
]
</script>

<template>
  <div class="consent">
    <dl class="consent__terms t-consent">
      <div v-for="[k, v] in TERMS" :key="k" class="consent__row">
        <dt>{{ k }}</dt>
        <dd>{{ v }}</dd>
      </div>
    </dl>
    <p class="consent__note t-consent">동의를 거부할 수 있으나, 거부 시 신청이 어렵습니다.</p>

    <label class="agree" :class="{ 'is-on': form.consent }">
      <input
        v-model="form.consent"
        class="sr-only"
        type="checkbox"
        :aria-invalid="!!errors.consent"
        aria-describedby="e-consent"
        @change="clearError('consent')"
      />
      <span class="agree__box" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="agree__label t-consent">개인정보 수집·이용에 동의합니다. <span class="req">(필수)</span></span>
    </label>
    <p v-if="errors.consent" id="e-consent" class="error-text t-consent">{{ errors.consent }}</p>

    <!-- 스팸 봇 방지용. 사람에게는 보이지 않습니다. -->
    <input v-model="form.website" class="sr-only" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
  </div>
</template>

<style scoped>
.consent {
  display: grid;
  gap: 15px;
}

.consent__terms {
  margin: 0;
  padding: 15px 20px;
  border: var(--line) dashed var(--brown);
  border-radius: var(--radius);
  display: grid;
  gap: 10px;
}

.consent__row {
  display: grid;
  grid-template-columns: 5.5em 1fr;
  gap: 10px;
}

.consent__row dt {
  font-weight: 700;
  color: var(--green);
}

.consent__row dd {
  margin: 0;
}

.consent__note {
  color: var(--green);
}

.agree {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: var(--line) solid var(--ink);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.agree:focus-within {
  outline: 2px solid var(--brown);
  outline-offset: 3px;
}

.agree:has(input:focus:not(:focus-visible)) {
  outline: none;
}

.agree__box {
  flex: none;
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border: var(--line) solid currentColor;
  border-radius: 8px;
  color: var(--ivory);
}

.agree__box svg {
  width: 20px;
  height: 20px;
}

.agree__label {
  font-weight: 600;
}

.agree__label .req {
  color: var(--brown);
}

.agree.is-on {
  background: var(--green);
  border-color: var(--green);
  color: var(--ivory);
}

.agree.is-on .agree__box {
  border-color: var(--ivory);
}

.agree.is-on .req {
  color: var(--ivory);
}

.agree:not(.is-on) .agree__box {
  border-color: var(--ink);
}
</style>
