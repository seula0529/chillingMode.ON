<script setup>
import { useSignupForm } from '../../composables/useSignupForm'

const { form, errors, clearError, formatPhone } = useSignupForm()

function onInput(e) {
  form.contact = formatPhone(e.target.value)
  e.target.value = form.contact
  clearError('contact')
}
</script>

<template>
  <div class="field">
    <label class="field__label" for="f-contact">휴대폰 번호<span class="req">*</span></label>
    <input
      id="f-contact"
      :value="form.contact"
      class="input input--phone"
      type="tel"
      inputmode="numeric"
      autocomplete="tel"
      placeholder="010-0000-0000"
      :aria-invalid="!!errors.contact"
      aria-describedby="e-contact"
      @input="onInput"
    />
    <p v-if="errors.contact" id="e-contact" class="error-text">{{ errors.contact }}</p>
  </div>
</template>

<style scoped>
.input--phone {
  letter-spacing: 0.04em;
  font-weight: 500;
}
</style>
