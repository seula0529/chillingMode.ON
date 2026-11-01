<script setup>
import { ATTENDANCE_OPTIONS, useSignupForm } from '../../composables/useSignupForm'

const { form, errors, clearError } = useSignupForm()
</script>

<template>
  <fieldset class="options">
    <legend class="sr-only">정모 참석 가능 여부</legend>
    <label
      v-for="(opt, i) in ATTENDANCE_OPTIONS"
      :key="opt.value"
      class="option"
      :class="{ 'is-on': form.attendance === opt.value }"
    >
      <input
        v-model="form.attendance"
        class="sr-only"
        type="radio"
        name="attendance"
        :value="opt.value"
        @change="clearError('attendance')"
      />
      <span class="option__idx" aria-hidden="true">{{ i + 1 }}</span>
      <span class="option__text">
        <strong>{{ opt.label }}</strong>
        <span v-if="opt.sub" class="option__sub">{{ opt.sub }}</span>
      </span>
      <svg class="option__check" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </label>
    <p v-if="errors.attendance" class="error-text">{{ errors.attendance }}</p>
  </fieldset>
</template>

<style scoped>
.options {
  display: grid;
  gap: 10px;
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: var(--line) solid var(--ink);
  border-radius: var(--radius);
  background: var(--ivory);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, transform 0.15s;
}

.option:active {
  transform: scale(0.99);
}

.option:focus-within {
  outline: 2px solid var(--brown);
  outline-offset: 3px;
}

.option:has(input:focus:not(:focus-visible)) {
  outline: none;
}

.option__idx {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: var(--line) solid currentColor;
  font-weight: 700;
}

.option__text {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option__text strong {
  font-weight: 600;
}

.option__sub {
  color: var(--green);
}

.option__check {
  flex: none;
  width: 25px;
  height: 25px;
  visibility: hidden;
}

.option.is-on {
  background: var(--green);
  border-color: var(--green);
  color: var(--ivory);
}

.option.is-on .option__sub {
  color: var(--ivory);
}

.option.is-on .option__check {
  visibility: visible;
}
</style>
