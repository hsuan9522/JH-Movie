<template>
    <div class="flex flex-col p-8 h-full bg-gray-500 text-white">
        <div
            class="flex items-center justify-between flex-wrap sm:flex-initial"
        >
            <div class="flex items-center">
                <img src="/images/logo.png" class="w-12 h-12" />
                <div class="line"></div>
                <div class="type">
                    <div
                        v-for="item in data.type"
                        :key="`type-${item.id}`"
                        :class="{
                            'type__label-active': item.key === data.selected,
                        }"
                        class="type__label"
                        @click="selectType(item)"
                    >
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
            <div class="search">
                <van-search
                    v-model="search"
                    placeholder="Search"
                    shape="round"
                    background="#121319"
                    @search="onSearch"
                    @click-left-icon="onSearch(search)"
                    @clear="onClear"
                />
            </div>
        </div>
        <div class="h-full w-full overflow-y-auto hide-scrollbar mt-10">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="沒啦"
                offset="0"
                :immediate-check="false"
                @load="onLoad"
            >
                <div
                    class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-y-10 pb-3"
                    v-if="data.movies.length > 0"
                >
                    <div
                        v-for="(item, index) in data.movies"
                        :key="item.id"
                        ref="itemRefs"
                        class="movie"
                        @click="
                            $router.push(`/${item.media_type}?id=${item.id}`)
                        "
                    >
                        <div class="poster">
                            <van-image
                                width="100%"
                                height="100%"
                                lazy-load
                                :src="`${IMAGE_URL}w342${item.poster_path}`"
                            />
                            <!-- <img  /> -->
                        </div>

                        <div class="detail">
                            <div class="font-semibold w-4/5">
                                <!-- 電影名字 title, 電視劇名字 name -->
                                {{
                                    item.media_type === 'movie'
                                        ? item.title
                                        : item.name
                                }}
                            </div>
                            <div class="flex text-stone-400">
                                <!-- 電影上映日 release_date, 電視劇首播 first_air_date -->
                                {{
                                    item.media_type === 'movie'
                                        ? item.release_date
                                        : item.first_air_date?.split('-')[0]
                                }}
                            </div>
                            <div class="absolute right-2 bottom-2">
                                <van-circle
                                    v-model:current-rate="currentRate[index]"
                                    :rate="
                                        item.vote_average
                                            ? item.vote_average * 10
                                            : 100
                                    "
                                    :stroke-width="100"
                                    :color="getColor(item.vote_average * 10)"
                                    layer-color="#ebedf0"
                                    size="42"
                                >
                                    <div
                                        class="h-full flex justify-center items-center"
                                    >
                                        <span
                                            class="text-white font-semibold font-mono"
                                            :class="{
                                                '-mr-0.5': item.vote_average,
                                            }"
                                        >
                                            {{
                                                item.vote_average
                                                    ? item.vote_average * 10
                                                    : 'NaN'
                                            }}
                                        </span>
                                        <span
                                            v-if="item.vote_average"
                                            class="text-xs leading-none -mb-1 transfrom scale-75 -mr-0.5"
                                        >
                                            %
                                        </span>
                                    </div>
                                </van-circle>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
    <div class="version">{VERSION}</div>
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
    nowType: 'movie',
    selected: 'popular',
    movies: [],
    type: [
        { label: '熱門電影', id: 1, key: 'popular', type: 'movie' },
        { label: '現正熱映', id: 3, key: 'now_playing', type: 'movie' },
        { label: '即將上映', id: 4, key: 'upcoming', type: 'movie' },
        // { label: '電視劇', id: 5, key: 'tv_popular', type: 'tv' }, // 正在寫
    ],
})

const currentRate = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const finished = ref(false)
const search = ref('')

function onLoad() {
    console.log('onLoad')
    if (page.value > totalPages.value) {
        finished.value = true
        return
    }
    loading.value = false

    getData()
}

function getData() {
    switch (data.nowType) {
        case 'movie':
            getMovieList()
            break
        case 'tv':
            getTVList()
            break
        case 'search':
            getSearchList(search.value)
    }
}

function reset() {
    data.selected = 'popular'
    data.nowType = 'movie'
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
    data.movies.forEach(el => {
        currentRate.value.push(0)
        el.media_type = 'movie'
    })
    if (page.value === 1) {
        totalPages.value = res.data.total_pages
    }
    page.value++
}

async function getTVList() {
    const key = data.selected.replace(/tv_/, '')
    const res = await $axios.get(`/tv/${key}?page=${page.value}&region=TW`)
    data.movies = data.movies.concat(res.data.results)
    data.movies.forEach(el => {
        currentRate.value.push(0)
        el.media_type = 'tv'
    })
    if (page.value === 1) {
        totalPages.value = res.data.total_pages
    }
    page.value++
}

function selectType(item) {
    reset()
    search.value = ''
    data.selected = item.key
    data.nowType = item.type
    router.push(`?t=${item.key}`)
    getData()
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

async function getSearchList(val) {
    if (!val) return
    data.selected = 'search'
    data.nowType = 'search'
    const res = await $axios.get(`search/multi?page=${page.value}&query=${val}`)

    data.movies = data.movies
        .concat(res.data.results)
        .filter(el => ['movie', 'tv'].includes(el.media_type))
    data.movies.forEach(el => currentRate.value.push(0))
    if (page.value === 1) {
        totalPages.value = res.data.total_pages
    }
    page.value++
}

function onSearch(val) {
    reset()
    getSearchList(val)
}

function onClear(val) {
    if (!val || data.nowType !== 'search') return
    reset()
    init()
}

async function init() {
    await router.isReady()
    data.selected = route.query.t ? route.query.t : data.selected
    const regex = new RegExp(/tv_(.*)/)
    const tv = regex.test(data.selected)
    data.nowType = tv ? 'tv' : 'movie'
    getData()
}
onBeforeMount(async () => {
    init()
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
    @apply ml-0 md:ml-8 flex items-end gap-x-8 font-semibold;
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

.version {
    @apply absolute bottom-2 right-2 text-white text-opacity-20 text-xs;
}

.search {
    @apply w-64 ml-auto pt-4 sm:pt-0;
    ::v-deep .van-field__left-icon {
        @apply cursor-pointer;
    }
    ::v-deep .van-search__content {
        @apply bg-black;
    }
    ::v-deep .van-field__control {
        @apply text-white;
    }
    ::v-deep input::placeholder {
        @apply text-gray-400 text-opacity-80;
    }
}
</style>
