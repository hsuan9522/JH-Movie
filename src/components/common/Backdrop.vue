<template>
    <div class="backdrop">
        <div
            :style="{ backgroundImage: props.bg }"
            class="backdrop__image"
        ></div>
        <div class="backdrop__left"></div>
        <div class="backdrop__bottom"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    bg: {
        type: String,
        default: 'url()'
    }
})
</script>
