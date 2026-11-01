<script setup>
defineProps({
  id: { type: String, required: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  required: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <section :id="`q-${id}`" class="q" :class="{ 'q--active': active }" :aria-labelledby="`q-${id}-title`">
    <header class="q__head">
      <span class="q__num" aria-hidden="true">{{ String(number).padStart(2, '0') }}</span>
      <h2 :id="`q-${id}-title`" class="q__title t-title" tabindex="-1">
        {{ title }}<span v-if="required" class="q__req" aria-label="필수">*</span>
      </h2>
      <p v-if="desc" class="q__desc">{{ desc }}</p>
    </header>
    <div class="q__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.q__head {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.q__num {
  font-family: var(--font-title);
  font-size: var(--title-size);
  line-height: var(--title-lh);
  color: var(--brown);
}

.q__title {
  color: var(--ink);
}

.q__title:focus {
  outline: none;
}

.q__req {
  color: var(--brown);
  margin-left: 5px;
}

.q__desc {
  color: var(--green);
}

.q__body {
  display: grid;
  gap: 25px;
}
</style>
