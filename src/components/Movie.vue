<template>
    <div class="relative text-white">
        <div class="backdrop">
            <div
                :style="{ backgroundImage: backgroundImage }"
                class="backdrop__image"
            ></div>
            <div class="backdrop__left"></div>
            <div class="backdrop__bottom"></div>
        </div>
        <div class="info">
            <div class="text-3xl font-bold">{{ data.info.title }}</div>
            <!-- genres -->
            <div class="flex items-center mt-2">
                <div v-for="item in data.info.genres" :key="item.id" class="tag">
                    <div>{{item.name}}</div>
                </div>
            </div>
            <!-- rating -->
            <div class="flex items-center mt-4">
                <!-- rate -->
                <div class="flex items-center">
                    <div class="mb-0.5">
                        <van-icon name="star" size="25"/>
                    </div>
                    <div class="flex flex-col ml-2">
                        <div class="flex items-center">
                            <span class="text-lg font-semibold leading-none">
                                {{ data.info.vote_average }}
                            </span>
                            <span class="text-sm pl-1 leading-none"> / 10</span>
                        </div>
                        <span class="text-xs leading-none">
                            {{ $filterNum(data.info.vote_count) }}
                        </span>
                    </div>
                </div>
                <div class="line"></div>
                <!-- self rate -->
                <div class="flex items-center">
                    <span class="mr-2">Rating:</span>
                    <van-rate v-model="rate" allow-half />
                </div>
            </div>
            <!-- desc -->
            <div>{{data.info.overview}}</div>
        </div>
    </div>
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
const { $axios, $filterNum, IMAGE_URL, API_KEY, LAN } = inject('$global')
const route = useRoute()
const data = reactive({
    info: null,
})

const backgroundImage = ref('url()')
const rate = ref(0)
onBeforeMount(async () => {
    const id = route.query.id

    const res = await $axios.get(
        `movie/${id}?api_key=${API_KEY}&language=${LAN}`
    )
    data.info = res.data
    backgroundImage.value = `url(${IMAGE_URL}w1280${data.info.backdrop_path})`
})

// onMounted(() => {
//     const id = route.params.id
// })
</script>

<style lang="scss" scoped>
.info {
    @apply w-1/2 text-left;
}

.tag {
    @apply text-sm text-stone-300;
    @apply px-2.5 py-0.5 ml-1;
    @apply rounded-md bg-gray-300 bg-opacity-20;
}
.line {
    @apply bg-gray-400 bg-opacity-25;
    @apply mx-4;
    height: 20px;
    width: 1px;
}
.backdrop {
    @apply absolute flex justify-end w-full bg-gray-500;
    z-index: -1;
    height: 500px;
    &__image {
        @apply w-3/4 bg-cover;
    }

    &__left {
        @apply absolute w-1/3 h-full left-0;
        transform: translate(68%);
        background-image: linear-gradient(
            270deg,
            rgba(17, 19, 25, 0) 0%,
            rgba(17, 19, 25, 0.05) 16%,
            rgba(17, 19, 25, 0.2) 30%,
            rgba(17, 19, 25, 0.39) 43%,
            rgba(17, 19, 25, 0.61) 55%,
            rgba(17, 19, 25, 0.8) 68%,
            rgba(17, 19, 25, 0.95) 82%,
            rgb(17, 19, 25) 98%
        );
    }

    &__bottom {
        @apply absolute w-full h-3/4 bottom-0;
        background-image: linear-gradient(
            179deg,
            rgba(17, 19, 25, 0) 1%,
            rgba(17, 19, 25, 0.05) 17%,
            rgba(17, 19, 25, 0.2) 31%,
            rgba(17, 19, 25, 0.39) 44%,
            rgba(17, 19, 25, 0.61) 56%,
            rgba(17, 19, 25, 0.8) 69%,
            rgba(17, 19, 25, 0.95) 83%,
            rgb(17, 19, 25) 99%
        );
    }
}
</style>
