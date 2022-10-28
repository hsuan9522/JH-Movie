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
                :style="{ backgroundImage: data.backgroundImage }"
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
                {{ data.info?.release_date.replace(/-/g, '/') }} ·
                {{ data.info.runtime }} min
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
                                {{ data.info.vote_average.toFixed(1) }}
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
                        <img :src="item.icon" class="icon" />
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
                        class="cursor-pointer transition-transform transofrm hover:scale-110"
                        @click="$router.push({ path, query: {...query, p: item.id} })"
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
                <van-rate v-model="usrRate" allow-half />
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
            <div v-if="data.series" class="series">
                <div class="relative w-full h-full">
                    <van-image
                        v-if="data.series.backdrop_path"
                        width="100%"
                        height="100%"
                        position="left top"
                        fit="cover"
                        lazy-load
                        :src="`${IMAGE_URL}w780${data.series.backdrop_path}`"
                    />
                    <div
                        v-show="
                            seriesEl.scrollWidth > seriesEl.clientWidth &&
                            seriesEl.clientWidth + seriesEl.scrollLeft !=
                                seriesEl.scrollWidth
                        "
                        class="series-arrow next"
                        @click="scrollSeries('next')"
                    >
                        <van-icon name="arrow" size="28" />
                    </div>
                    <div
                        v-show="seriesEl.scrollLeft != 0"
                        class="series-arrow prev"
                        @click="scrollSeries('prev')"
                    >
                        <van-icon name="arrow-left" size="28" />
                    </div>
                    <div class="series-mask"></div>
                </div>
                <div class="series-name">{{ data.series.name }}</div>
                <div class="series-movies-wrapper">
                    <div class="series-movies hide-scrollbar" ref="seriesRef">
                        <!-- 沒有 poster 就不要顯示了 -->
                        <template v-for="item in data.series.parts">
                            <div
                                v-if="item.poster_path"
                                :key="`series-${item.id}`"
                                class="movie-block flex-shrink-0"
                                @click="$router.replace(`/movie?id=${item.id}`)"
                            >
                                <div class="poster">
                                    <van-image
                                        width="100%"
                                        height="100%"
                                        lazy-load
                                        :src="`${IMAGE_URL}w185${item.poster_path}`"
                                    />
                                </div>
                                <div class="text-xs mt-1">
                                    {{ item.title }}
                                    <span
                                        class="ml-2 font-semibold text-yellow-500"
                                    >
                                        {{ toFixed(item.vote_average) }}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="series-right-mask"></div>
                <div class="series-left-mask"></div>
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
    <CastDialog v-model="moreCast" :data="data.cast"></CastDialog>
</template>

<script setup>
import image_IMDB from '/images/IMDb.png'
import image_Metacritic from '/images/Metacritic.png'
import image_Tomatoes from '/images/Rotten_Tomatoes.png'

import {
    inject,
    onBeforeMount,
    reactive,
    ref,
    computed,
    watch,
    onUpdated,
} from 'vue'
import { useRoute } from 'vue-router'
import { useLoading, useError } from '@/hook'

const { $axios, $filterNum, $omdb, IMAGE_URL } = inject('$global')
const route = useRoute()
const { isLoading, startLoading, finishLoading } = useLoading()
const { isError, setError, unsetError } = useError()

const initData = {
    info: null,
    ratings: null,
    cast: null,
    trailer: null,
    similar: null,
    series: null,
    backgroundImage: 'url()',
}

const data = reactive({ ...initData })

const infoRef = ref(null)
const usrRate = ref(0)
const moreCast = ref(false)
const seriesRef = ref(null)
const seriesEl = reactive({
    scrollWidth: 0,
    clientWidth: 0,
    scrollLeft: 0,
})
const id = computed(() => {
    return route.query.id
})
const path = computed(()=> {
    return route.path
})
const query = computed(()=> {
    return route.query
})

async function getMovie() {
    try {
        // 拿電影資訊
        const res = await $axios.get(`movie/${id.value}`)
        data.info = res.data
        data.backgroundImage = `url(${IMAGE_URL}w1280${data.info.backdrop_path})`
        const imdbId = data.info.imdb_id
        if (imdbId) {
            const omdb = await $omdb.get(`?i=${imdbId}`)
            data.ratings = omdb.data.Ratings?.map(el => {
                const path = '@/assets/images/'
                switch (el.Source) {
                    case 'Internet Movie Database':
                        el.icon = image_IMDB //'IMDb.png'
                        const tmpI = el.Value.split('/')
                        el.value = tmpI[0]
                        el.base = tmpI[1]
                        break
                    case 'Rotten Tomatoes':
                        el.icon = image_Tomatoes //'Rotten_Tomatoes.png'
                        el.value = el.Value
                        el.base = ''
                        break
                    case 'Metacritic':
                        el.icon = image_Metacritic //'Metacritic.png'
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

        // 系列電影
        const seriesId = data.info.belongs_to_collection?.id
        if (seriesId) {
            const res_series = await $axios.get(`collection/${seriesId}`)
            data.series = res_series.data
        }
    } catch (err) {
        console.log(err)
        setError()
    } finally {
        finishLoading()
    }
}

function scrollSeries(direction) {
    const $el = seriesRef.value
    const moveDistance = 173 * 3 // 173 is poster width

    switch (direction) {
        case 'next':
            $el.scrollLeft += moveDistance
            break
        case 'prev':
            $el.scrollLeft -= moveDistance
            break
    }
    setTimeout(() => {
        // 應該是因為 smooth 的關西，導致他會有時間差
        seriesEl.scrollLeft = $el.scrollLeft
    }, 300)
}

function reset() {
    startLoading()
    unsetError()
    usrRate.value = 0
    moreCast.value = false
    Object.assign(data, initData)
}

function toFixed(val) {
    return val.toFixed(1)
}

onBeforeMount(async () => {
    reset()
    getMovie()
})

onUpdated(() => {
    // 因為 series 有 v-if 的關西，會導致 ref 即便在 onMounted 也會是 undefinded
    seriesEl.scrollWidth = seriesRef.value?.scrollWidth
    seriesEl.clientWidth = seriesRef.value?.clientWidth
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
    @apply relative w-full;
    @apply mt-8 rounded-xl overflow-hidden;
    height: 400px;
    .movie-block {
        width: 173px;
    }
    .poster {
        height: 260px;
        width: 100%;
    }

    .series-mask {
        @apply absolute bottom-0 w-full h-full;
        background: rgba(26, 17, 5, 0.85);
    }
    .series-movies-wrapper {
        @apply absolute top-1/2 w-full;
        transform: translateY(-48%);
        @apply pl-28 pr-16 pt-2;
    }
    .series-movies {
        @apply flex justify-start items-start gap-x-5 overflow-x-auto;
        scroll-behavior: smooth;
    }
    .series-name {
        @apply absolute top-0 h-full text-center px-9 py-4 text-lg font-medium;
        @apply overflow-hidden whitespace-nowrap;
        z-index: 1;
        writing-mode: vertical-lr;
        background: rgba(19, 12, 3, 0.9);
        text-overflow: ellipsis;
    }

    .series-right-mask {
        @apply absolute right-0 bottom-0 w-40 h-full;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(11, 10, 9, 1) 80%
        );
    }
    .series-left-mask {
        @apply absolute left-0 bottom-0 w-36 h-full;
        background: linear-gradient(
            90deg,
            rgba(11, 10, 9, 1) 20%,
            rgba(255, 255, 255, 0) 80%
        );
    }

    .series-arrow {
        @apply absolute top-1/2 transform -translate-y-1/2;
        @apply mr-5 cursor-pointer;
        z-index: 1;
        &.next {
            @apply right-0;
        }
        &.prev {
            @apply left-28;
        }
    }
}
</style>
