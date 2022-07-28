<template>
    <img :src="image" :alt="alt" :class="css" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
    path: { type: String },
    alt: { type: String },
    css: { type: String },
})

const fileType = props.path.match(/\.[0-9a-z]+$/i)
const imageName = props.path.replace(fileType, '')
const image = ref()
// https://stackoverflow.com/questions/68758939/github-pages-vite-js-build-not-showing-the-images
// 放在 src 裡好像會讓 github.io 讀取不到
watchEffect(async () => {
    switch (fileType[0]) {
        case '.jpg':
            image.value = (
                await import(
                    /* @vite-ignore */ `/images/${imageName}.jpg`
                )
            ).default
        case '.png':
            image.value = (
                await import(
                    /* @vite-ignore */ `/images/${imageName}.png`
                )
            ).default
            break
        case '.svg':
            image.value = (
                await import(
                    /* @vite-ignore */ `../assets/images/${imageName}.svg`
                )
            ).default
            break
        default:
            console.log(
                `Sorry, the image component can't recognize the ${fileType} file type just yet.`
            )
    }
})
</script>
