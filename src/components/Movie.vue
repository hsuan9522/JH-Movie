<template>
    <div class="relative text-white w-full h-full bg-gray-500">
        <div class="backdrop">
            <div
                :style="{ backgroundImage: backgroundImage }"
                class="backdrop__image"
            ></div>
            <div class="backdrop__left"></div>
            <div class="backdrop__bottom"></div>
        </div>
        <div class="info">
            <!-- title -->
            <div class="text-3xl font-bold">{{ data.info.title }}</div>
            <!-- runtime & date -->
            <div class="pl-0.5">
                {{ data.info.release_date.replace(/-/g, '/') }} · {{ runTime }}
            </div>
            <!-- genres -->
            <div class="flex items-center mt-4">
                <div
                    v-for="item in data.info.genres"
                    :key="item.id"
                    class="tag"
                >
                    <div>{{ item.name }}</div>
                </div>
            </div>
            <!-- ratings -->
            <div class="flex items-center mt-4">
                <!-- tmdb rating -->
                <div class="flex items-center">
                    <div class="mb-0.5">
                        <van-icon name="star" size="25" color="#EDC748" />
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
                <!-- other ratings -->
                <div class="flex">
                    <div
                        v-for="item in data.ratings"
                        :key="item.Source"
                        class="flex items-center mx-3"
                    >
                        <Image :path="item.icon" :css="'icon'" />
                        <div class="flex items-center">
                            <span class="text-lg font-semibold leading-none">
                                {{ item.value }}
                            </span>
                            <span
                                v-if="item.base"
                                class="text-sm pl-1 leading-none"
                            >
                                / {{ item.base }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- desc -->
            <div class="mt-4 w-3/4">
                <span class="text-stone-400 font-medium"> 描述： </span>
                <span>{{ data.info.overview }}</span>
            </div>
            <!-- cast -->
            <div class="mt-4">
                <div class="text-stone-400 font-medium mb-2"> 主演： </div>
                <div class="flex">
                    <div v-for="item in data.cast" :key="'cast'+item.id">
                        <div class="avator">
                            <img :src="`${IMAGE_URL}w185${item.profile_path}`" :alt="item.name" />
                        </div>
                        <!-- <div class="text-xs">{{item.name}}</div> -->
                    </div>
                </div>

            </div>

            <!-- self rate -->
            <div class="flex items-center mt-4">
                <span class="text-stone-400 font-medium mr-1"> 評分： </span>
                <van-rate v-model="rate" allow-half />
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import Image from './Image.vue'
const { $axios, $filterNum, $omdb, IMAGE_URL, API_KEY, LAN, OMDB_KEY } =
    inject('$global')
const route = useRoute()
const data = reactive({
    info: null,
    ratings: null,
    cast: null
})

const backgroundImage = ref('url()')
const rate = ref(0)
const runTime = ref('')

onBeforeMount(async () => {
    // 拿電影資訊
    const id = route.query.id
    const res = await $axios.get(
        `movie/${id}?api_key=${API_KEY}&language=${LAN}`
    )
    data.info = res.data
    backgroundImage.value = `url(${IMAGE_URL}w1280${data.info.backdrop_path})`
    // tmdb 時長抓不到，所以打 omdb 拿時間和其他評分
    const imdbId = data.info.imdb_id
    const omdb = await $omdb.get(`?i=${imdbId}&apikey=${OMDB_KEY}&t=`)
    runTime.value = omdb.data.Runtime
    data.ratings = omdb.data.Ratings.map(el => {
        const path = '@/assets/images/'
        switch (el.Source) {
            case 'Internet Movie Database':
                el.icon = 'IMDb.png'
                const tmpI = el.Value.split('/')
                el.value = tmpI[0]
                el.base = tmpI[1]
                break
            case 'Rotten Tomatoes':
                el.icon = 'Rotten_Tomatoes.png'
                el.value = el.Value
                el.base = ''
                break
            case 'Metacritic':
                el.icon = 'Metacritic.png'
                const tmpM = el.Value.split('/')
                el.value = tmpM[0]
                el.base = tmpM[1]
                break
        }
        return el
    })


    // 電影卡司
    const res_cast = await $axios.get(`movie/${id}/credits?api_key=${API_KEY}&language=${LAN}`)
    data.cast = res_cast.data.cast.slice(0,6)
})

</script>

<style lang="scss" scoped>
.icon {
    @apply mr-2;
    height: 25px;
    width: 25px;
}
.avator {
    @apply w-16 h-16 rounded-full overflow-hidden;
    @apply mx-2;
    img {
        @apply w-full h-full object-cover;
        object-position: 50% 30%;
    }
}
.info {
    @apply relative;
    @apply w-1/2 text-left py-8 px-10;
    z-index: 1;
}

.tag {
    @apply text-sm text-stone-300;
    @apply px-2.5 py-0.5 ml-1;
    @apply rounded-md bg-gray-300 bg-opacity-20;
}
.line {
    @apply bg-gray-400 bg-opacity-25;
    @apply mr-3 ml-5;
    height: 20px;
    width: 1px;
}
.backdrop {
    @apply absolute flex justify-end w-full bg-gray-500;
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
