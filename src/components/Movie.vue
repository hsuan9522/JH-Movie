<template>
    <div
        v-if="isLoading"
        class="bg-black w-full h-full flex justify-center items-center"
    >
        <van-loading size="40" />
    </div>
    <div
        class="relative text-white w-full h-full bg-gray-500 pb-5 flex flex-col"
    >
        <div v-if="!isError" class="backdrop">
            <div
                :style="{ backgroundImage: backgroundImage }"
                class="backdrop__image"
            ></div>
            <div class="backdrop__left"></div>
            <div class="backdrop__bottom"></div>
        </div>
        <div class="flex py-4 pl-4" @click="$router.go(-1)">
            <div class="cursor-pointer">
                <van-icon name="arrow-left" size="30" />
            </div>
        </div>
        <div v-if="isError" class="h-full flex items-center justify-center">
            <van-empty image="error" description="發生錯誤，回去重來吧！" />
        </div>

        <div class="info hide-scrollbar" v-if="data.info" ref="infoRef">
            <!-- title -->
            <div class="text-3xl font-bold">{{ data.info.title }}</div>
            <div class="text-sm font-medium">
                {{ data.info.original_title }}
            </div>
            <!-- runtime & date -->
            <div class="pl-0.5 mt-3 font-sans">
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
            <div class="flex items-center mt-6 flex-wrap gap-y-4">
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
                        class="flex items-center mr-4"
                    >
                        <img :src="`/images/${item.icon}`" class="icon" />
                        <!-- 下面的方法 github page 還是吃不到 -->
                        <!-- <Image :path="item.icon" :css="'icon'" /> -->
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
            <div class="mt-4 w-full lg:w-1/2">
                <span class="text-stone-400 font-medium"> 描述： </span>
                <span>{{ data.info.overview || '-' }}</span>
            </div>
            <!-- cast -->
            <div class="mt-5" v-if="data.cast">
                <div class="text-stone-400 font-medium mb-2">
                    主演：
                    <span v-if="data.cast.length === 0" class="text-white">
                        -
                    </span>
                </div>
                <div
                    v-if="data.cast.length > 0"
                    class="flex flex-wrap gap-y-2 items-center"
                >
                    <div
                        v-for="item in data.cast.slice(0, 6)"
                        :key="'cast' + item.id"
                    >
                        <div class="avator">
                            <van-image
                                width="100%"
                                height="100%"
                                fit="cover"
                                lazy-load
                                :src="`${IMAGE_URL}w185${item.profile_path}`"
                            />
                        </div>
                        <!-- <div class="text-xs">{{item.name}}</div> -->
                    </div>
                    <div class="ml-4">
                        <div class="more" @click="moreCast = true">
                            <van-icon name="arrow" size="12" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- self rate -->
            <div class="flex items-center mt-8">
                <span class="text-stone-400 font-medium mr-1"> 評分： </span>
                <van-rate v-model="rate" allow-half />
            </div>
            <!-- trailer -->
            <div v-if="data.trailer" class="w-full md:w-1/2 mt-8">
                <div class="trailer">
                    <iframe
                        width="950"
                        height="534"
                        :src="`https://www.youtube.com/embed/${data.trailer.key}`"
                        :title="data.trailer.name"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
            <!-- series -->
            <div class="series mt-8 rounded-xl overflow-hidden">
                <van-image
                    height="100%"
                    lazy-load
                    :src="`${IMAGE_URL}w780${data.info.belongs_to_collection.backdrop_path}`"
                />
                <van-image
                    height="100%"
                    lazy-load
                    :src="`${IMAGE_URL}w185${data.info.belongs_to_collection.poster_path}`"
                />
            </div>
            <!-- similar -->
            <div v-if="data.similar" class="mt-10">
                <div class="text-stone-400 font-medium mb-2">相似電影：</div>
                <div
                    class="flex justify-start gap-x-5 overflow-x-auto hide-scrollbar"
                >
                    <div
                        v-for="item in data.similar"
                        :key="`similar-${item.id}`"
                        class="movie-block"
                        @click="$router.replace(`/movie?id=${item.id}`)"
                    >
                        <div class="poster">
                            <van-image
                                width="100%"
                                height="100%"
                                lazy-load
                                :src="`${IMAGE_URL}w185${item.poster_path}`"
                            />
                            <div class="poster__bottom"></div>
                        </div>
                        <div class="text-xs mt-1">
                            {{ item.title }}
                            <span class="ml-2 font-semibold text-yellow-500">
                                {{ toFixed(item.vote_average) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- more cast -->
    <transition name="van-fade">
        <div
            v-show="moreCast"
            class="w-full h-full absolute top-0 z-10 text-white bg-black bg-opacity-80"
            @click="moreCast = false"
        >
            <div class="flex h-full justify-center items-center">
                <div class="popup-dialog">
                    <div class="flex justify-end -mt-3 -mr-2">
                        <span class="cursor-pointer" @click="moreCast = false">
                            <van-icon name="cross" />
                        </span>
                    </div>
                    <div
                        class="divide-y divide-gray-800 h-full px-10 overflow-y-auto hide-scrollbar"
                    >
                        <div
                            v-for="item in data.cast"
                            :key="`cast-m-${item.id}`"
                            class="text-center py-4"
                        >
                            <div class="font-bold">{{ item.name }}</div>
                            <div class="text-sm text-stone-400">
                                {{ item.character.replace(/ \/.*/g, '') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import {
    inject,
    onBeforeMount,
    reactive,
    ref,
    computed,
    watch,
    onMounted,
} from 'vue'
import { useRoute } from 'vue-router'

const { $axios, $filterNum, $omdb, IMAGE_URL } = inject('$global')
const route = useRoute()

const data = reactive({
    info: null,
    ratings: null,
    cast: null,
    trailer: null,
    similar: null,
})
const isError = ref(false)
const isLoading = ref(true)
const infoRef = ref(null)
const backgroundImage = ref('url()')
const rate = ref(0)
const runTime = ref('')
const moreCast = ref(false)

const id = computed(() => {
    return route.query.id
})

async function getMovie() {
    try {
        // 拿電影資訊
        const res = await $axios.get(`movie/${id.value}`)
        data.info = res.data
        backgroundImage.value = `url(${IMAGE_URL}w1280${data.info.backdrop_path})`
        // tmdb 時長抓不到，所以打 omdb 拿時間和其他評分
        const imdbId = data.info.imdb_id
        if (imdbId) {
            const omdb = await $omdb.get(`?i=${imdbId}`)
            runTime.value = omdb.data.Runtime
            data.ratings = omdb.data.Ratings?.map(el => {
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
        }

        // 電影卡司
        const res_cast = await $axios.get(`movie/${id.value}/credits`)
        data.cast = res_cast.data.cast
            .slice(0, 20)
            .filter(el => el.profile_path)

        // 預告片
        const res_video = await $axios.get(`movie/${id.value}/videos`)
        data.trailer = res_video.data.results.find(el => el.site === 'YouTube')

        // 相關影片
        const res_similar = await $axios.get(`movie/${id.value}/similar?page=1`)
        data.similar = res_similar.data.results.splice(0, 8)

        isLoading.value = false
    } catch {
        isLoading.value = false
        isError.value = true
    }
}

function reset() {
    isLoading.value = true
    backgroundImage.value = 'url()'
    rate.value = 0
    runTime.value = ''
    moreCast.value = false
    isError.value = false
    data.info = null
    data.ratings = null
    data.cast = null
    data.trailer = null
    data.similar = null
}

function toFixed(val) {
    return val.toFixed(1)
}
onBeforeMount(async () => {
    reset()
    getMovie()
})

watch(id, () => {
    if (route.path.replace(/\//g, '').toLowerCase() !== 'movie') return // go(-1) 會觸發，所以不是 movie 頁面 return
    reset()
    getMovie()
    if (infoRef.value) {
        infoRef.value.scrollTo(0, 0)
    }
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
    ::v-deep img {
        object-position: 50% 30%;
    }
}
.info {
    @apply w-full;
    @apply relative h-full overflow-y-auto overflow-x-hidden;
    @apply text-left p-10 pt-2;
    z-index: 1;
}

.tag {
    @apply text-sm text-stone-300;
    @apply px-2.5 py-0.5 mr-1.5;
    @apply rounded-md bg-gray-300 bg-opacity-20;
}
.line {
    @apply bg-gray-400 bg-opacity-25;
    @apply mx-5;
    height: 20px;
    width: 1px;
}
.trailer {
    @apply relative w-full h-0;
    padding-bottom: 56.25%;
    iframe {
        @apply absolute top-0 left-0 w-full h-full;
    }
}
.movie-block {
    @apply cursor-pointer;
    width: 150px;
}
.poster {
    @apply overflow-hidden relative;
    width: 150px;

    height: 214px;
    img {
        @apply w-full h-full;
    }
    &__bottom {
        @apply absolute bottom-0 w-full h-1/2;
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
.more {
    @apply flex items-center justify-center;
    @apply w-5 h-5;
    @apply border rounded-full cursor-pointer;
    &:hover {
        @apply bg-gray-200 bg-opacity-20;
    }
}

.popup-dialog {
    @apply rounded-lg;
    @apply bg-gray-500 p-8 overflow-hidden h-full;
    box-shadow: 0px 1px 7px #494949;
    min-width: 500px;
    max-height: 600px;
}
.series {
    height: 280px;
}
</style>
