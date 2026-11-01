<script setup>
import { ACTIVITY_EXAMPLES, useSignupForm } from '../../composables/useSignupForm'

const { form } = useSignupForm()
</script>

<template>
  <div class="activities">
    <fieldset class="field">
      <legend class="field__label">끌리는 걸 모두 골라주세요</legend>
      <div class="chips">
        <label v-for="a in ACTIVITY_EXAMPLES" :key="a" class="chip" :class="{ 'is-on': form.activities.includes(a) }">
          <input v-model="form.activities" class="sr-only" type="checkbox" :value="a" />
          {{ a }}
        </label>
      </div>
    </fieldset>

    <div class="field">
      <label class="field__label" for="f-etc">또 해보고 싶은 게 있다면</label>
      <textarea
        id="f-etc"
        v-model="form.activitiesEtc"
        class="input"
        rows="3"
        maxlength="200"
        placeholder="자유롭게 적어주세요"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.activities {
  display: grid;
  gap: 30px;
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
</style>
