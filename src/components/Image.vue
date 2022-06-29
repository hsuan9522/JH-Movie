<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  path: { type: String },
  alt: { type: String },
  css: { type: String },
})

const image = ref()

watchEffect(async () => {
  image.value = (await import(/* @vite-ignore */ `../assets/images/${props.path}`)).default
})
</script>

<template>
  <img :src="image" :alt="alt" :class="css" />
</template>