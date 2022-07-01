<template>
    <div class="flex flex-col p-8 h-full bg-gray-500 text-white">
        <div class="flex items-center">
            <Image path="logo.png" css="w-12 h-12" />
            <div class="line"></div>
            <div class="type">
                <div
                    v-for="item in data.type"
                    :key="`type-${item.id}`"
                    :class="{
                        'type__label-active': item.key === data.selected,
                    }"
                    class="type__label"
                    @click="selectType(item.key)"
                >
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </div>
        <div class="h-full w-full overflow-y-auto hide-scrollbar mt-10">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="Finished"
                offset="0"
                :immediate-check="false"
                @load="onLoad"
            >
                <div
                    class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-y-10"
                    v-if="data.movies.length > 0"
                >
                    <div
                        v-for="(item, index) in data.movies"
                        :key="item.id"
                        ref="itemRefs"
                        class="movie"
                        @click="$router.push(`/movie?id=${item.id}`)"
                    >
                        <div class="poster">
                            <img :src="`${IMAGE_URL}w342${item.poster_path}`" />
                        </div>

                        <div class="detail">
                            <div class="font-semibold w-4/5">
                                {{ item.title }}
                            </div>
                            <div class="flex text-stone-400">
                                {{ item.release_date }}
                            </div>
                            <div class="absolute right-2 bottom-2">
                                <van-circle
                                    v-model:current-rate="currentRate[index]"
                                    :rate="item.vote_average * 10"
                                    :stroke-width="100"
                                    :color="getColor(item.vote_average * 10)"
                                    layer-color="#ebedf0"
                                    size="42"
                                >
                                    <div
                                        class="h-full flex justify-center items-center"
                                    >
                                        <span
                                            class="text-white font-semibold font-mono -mr-0.5"
                                            >{{ item.vote_average * 10 }}</span
                                        >
                                        <span
                                            class="text-xs leading-none -mb-1 transfrom scale-75 -mr-0.5"
                                            >%</span
                                        >
                                    </div>
                                </van-circle>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script setup>
import {
    reactive,
    inject,
    ref,
    onBeforeMount,
    computed,
    watch,
    watchEffect,
    onMounted,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { $axios, IMAGE_URL } = inject('$global')
const router = useRouter()
const route = useRoute()

const data = reactive({
    selected: 'popular',
    movies: [],
    type: [
        { label: '熱門', id: 1, key: 'popular' },
        // { label: '最新', id: 2, key: 'latest' },
        { label: '現正熱映', id: 3, key: 'now_playing' },
        { label: '即將上映', id: 4, key: 'upcoming' },
    ],
})

const currentRate = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const finished = ref(false)

function onLoad() {
    if (page.value > totalPages.value) {
        finished.value = true
        return
    }
    loading.value = false
    getMovieList()
}

function reset() {
    data.selected = 'popular'
    data.movies = []
    currentRate.value = []
    page.value = 1
    totalPages.value = 1
    loading.value = false
    finished.value = false
}

async function getMovieList() {
    const res = await $axios.get(
        `/movie/${data.selected}?page=${page.value}&region=TW`
    )
    data.movies = data.movies.concat(res.data.results)
    data.movies.forEach(el => currentRate.value.push(0))
    if (page.value === 1) {
        totalPages.value = res.data.total_pages
    }
    page.value++
}

function selectType(val) {
    reset()
    data.selected = val
    router.push(`?t=${val}`)
    getMovieList()
}

function getColor(val) {
    const rate = parseInt(val)
    if (rate > 0 && rate <= 40) {
        return '#C93861'
    } else if (rate > 40 && rate <= 70) {
        return '#D4D553'
    } else if (rate > 70) {
        return '#63CE82'
    } else {
        return '#666666'
    }
}

onBeforeMount(async () => {
    await router.isReady()
    data.selected = route.query.t ? route.query.t : data.selected
    getMovieList()
})
</script>

<style lang="scss" scoped>
.movie {
    @apply flex flex-col cursor-pointer;
    @apply rounded-md overflow-hidden;
    @apply w-36 md:w-50;
}
.poster {
    @apply overflow-hidden w-full;
    @apply h-50 md:h-72;

    img {
        @apply w-full h-full;
    }
}
.detail {
    @apply p-2 text-left relative flex-grow;
    background-color: rgb(29 29 29);
}

.line {
    @apply bg-gray-400 bg-opacity-25;
    @apply mx-5;
    height: 20px;
    width: 1px;
}

.type {
    @apply ml-8 flex items-end gap-x-8 font-semibold;
    &__label {
        @apply px-1;
        @apply cursor-pointer;
        &-active {
            @apply relative;
            &:before {
                @apply absolute -bottom-2;
                content: '';
                width: 25px;
                left: 50%;
                transform: translateX(-50%);
                height: 4px;
                background: #edc748;
            }
        }
        &:hover {
            color: #ebd489;
        }
    }
}
</style>
