<script setup>
import { MBTI_AXES, useSignupForm } from '../../composables/useSignupForm'
import { GWANGJU_DONGS } from '../../gwangjuDongs'

const { form, errors, clearError } = useSignupForm()

const GENDERS = ['여성', '남성']

function pickMbti(index, letter) {
  form.mbti[index] = letter
  form.mbtiUnknown = false
  clearError('mbti')
}

function toggleUnknown() {
  form.mbtiUnknown = !form.mbtiUnknown
  if (form.mbtiUnknown) form.mbti = ['', '', '', '']
  clearError('mbti')
}

// 구를 바꾸면 이전 구의 동은 맞지 않으므로 비웁니다.
function onGuChange() {
  form.dong = ''
  clearError('dong')
}

function onAgeInput(e) {
  form.age = e.target.value.replace(/\D/g, '').slice(0, 2)
  e.target.value = form.age
  clearError('age')
}
</script>

<template>
  <div class="profile">
    <div class="profile__row">
      <div class="field">
        <label class="field__label" for="f-name">이름<span class="req">*</span></label>
        <input
          id="f-name"
          v-model="form.name"
          class="input"
          type="text"
          autocomplete="name"
          maxlength="20"
          placeholder="당신의 이름을 알려주세요"
          :aria-invalid="!!errors.name"
          aria-describedby="e-name"
          @input="clearError('name')"
        />
        <p v-if="errors.name" id="e-name" class="error-text">{{ errors.name }}</p>
      </div>

      <div class="field field--age">
        <label class="field__label" for="f-age">나이<span class="req">*</span></label>
        <div class="age">
          <input
            id="f-age"
            :value="form.age"
            class="input"
            type="text"
            inputmode="numeric"
            placeholder="00"
            :aria-invalid="!!errors.age"
            aria-describedby="e-age"
            @input="onAgeInput"
          />
          <span class="age__unit" aria-hidden="true">살</span>
        </div>
        <p v-if="errors.age" id="e-age" class="error-text">{{ errors.age }}</p>
      </div>
    </div>

    <fieldset class="field">
      <legend class="field__label">성별<span class="req">*</span></legend>
      <div class="chips" role="radiogroup">
        <label v-for="g in GENDERS" :key="g" class="chip" :class="{ 'is-on': form.gender === g }">
          <input v-model="form.gender" class="sr-only" type="radio" name="gender" :value="g" @change="clearError('gender')" />
          {{ g }}
        </label>
      </div>
      <p v-if="errors.gender" class="error-text">{{ errors.gender }}</p>
    </fieldset>

    <fieldset class="field">
      <legend class="field__label">MBTI<span class="req">*</span></legend>
      <div class="mbti">
        <div v-for="(pair, i) in MBTI_AXES" :key="pair.join('')" class="mbti__axis" role="radiogroup" :aria-label="pair.join(' 또는 ')">
          <label v-for="letter in pair" :key="letter" class="mbti__cell" :class="{ 'is-on': form.mbti[i] === letter }">
            <input
              class="sr-only"
              type="radio"
              :name="`mbti-${i}`"
              :value="letter"
              :checked="form.mbti[i] === letter"
              @change="pickMbti(i, letter)"
            />
            {{ letter }}
          </label>
        </div>
      </div>
      <div class="mbti__foot">
        <label class="chip" :class="{ 'is-on': form.mbtiUnknown }">
          <input class="sr-only" type="checkbox" :checked="form.mbtiUnknown" @change="toggleUnknown" />
          잘 모르겠어요
        </label>
        <span v-if="!form.mbtiUnknown && form.mbti.every(Boolean)" class="mbti__result t-title">{{ form.mbti.join('') }}</span>
      </div>
      <p v-if="errors.mbti" class="error-text">{{ errors.mbti }}</p>
    </fieldset>

    <fieldset class="field">
      <legend class="field__label">사는 동<span class="req">*</span></legend>
      <div class="place">
        <select
          v-model="form.gu"
          class="input"
          required
          aria-label="구"
          :aria-invalid="!!errors.dong && !form.gu"
          aria-describedby="e-dong"
          @change="onGuChange"
        >
          <option value="" disabled>구</option>
          <option v-for="gu in Object.keys(GWANGJU_DONGS)" :key="gu" :value="gu">{{ gu }}</option>
        </select>
        <select
          v-model="form.dong"
          class="input"
          required
          aria-label="동"
          :disabled="!form.gu"
          :aria-invalid="!!errors.dong"
          aria-describedby="e-dong"
          @change="clearError('dong')"
        >
          <option value="" disabled>{{ form.gu ? '동' : '구를 먼저 골라주세요' }}</option>
          <option v-for="d in GWANGJU_DONGS[form.gu] || []" :key="d" :value="`${form.gu} ${d}`">{{ d }}</option>
        </select>
      </div>
      <p v-if="errors.dong" id="e-dong" class="error-text">{{ errors.dong }}</p>
    </fieldset>
  </div>
</template>

<style scoped>
.profile {
  display: grid;
  gap: 30px;
}

.profile__row {
  display: grid;
  grid-template-columns: 1fr 95px;
  gap: 20px;
  align-items: start;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

legend {
  padding: 0;
  margin-bottom: 10px;
}

.age {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.age .input {
  text-align: center;
}

.mbti {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.mbti__axis {
  display: grid;
  border: var(--line) solid var(--ink);
  border-radius: 14px;
  overflow: hidden;
}

.mbti__cell {
  display: grid;
  place-items: center;
  height: 50px;
  font-weight: 700;
  cursor: pointer;
  background: var(--ivory);
  transition: background-color 0.15s, color 0.15s;
}

.mbti__cell + .mbti__cell {
  border-top: var(--line) solid var(--ink);
}

.mbti__cell.is-on {
  background: var(--green);
  color: var(--ivory);
}

.mbti__cell:focus-within {
  outline: 2px solid var(--brown);
  outline-offset: -4px;
}

.mbti__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.place {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 20px;
}

select.input {
  cursor: pointer;
}

select.input:disabled {
  cursor: default;
}

/* 아직 고르지 않았을 때는 placeholder처럼 보이게 */
select.input:invalid {
  color: var(--brown);
}

select.input option {
  color: var(--ink);
}

.mbti__result {
  color: var(--green);
}
</style>
