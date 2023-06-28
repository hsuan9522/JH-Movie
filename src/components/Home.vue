<template>
    <div
        v-if="isLoading"
        class="bg-black w-full h-full flex justify-center items-center"
    >
        <van-loading size="40" />
    </div>
    <div class="flex flex-col p-8 h-full bg-gray-500 text-white">
        <div
            class="flex items-center justify-between flex-wrap sm:flex-initial"
        >
            <div class="flex items-center">
                <img src="/images/logo.png" class="w-12 h-12" />
                <div class="line"></div>
                <div class="type hide-scrollbar">
                    <div
                        v-for="item in menu"
                        :key="`type-${item.id}`"
                        :class="{
                            'type__label-active': item.key === current.key,
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
                    v-model="current.search"
                    placeholder="Search"
                    shape="round"
                    background="#121319"
                    @search="onSearch"
                    @click-left-icon="onSearch(current.search)"
                    @clear="onClear"
                />
            </div>
        </div>
        <div class="filter" :class="{ 'active': showFilter }">
            <div class="cursor-pointer" @click="showFilter = !showFilter">
                <van-icon name="wap-nav" size="20" />
            </div>
            <Transition :duration="{ enter: 150, leave: 0 }" @after-enter="isTransitionEnd = true" @before-enter="isTransitionEnd = false">
                <div v-show="showFilter" class="pt-4 pb-2 px-2">
                    <div v-show="isTransitionEnd">
                        <span>語言：</span>
                        <span v-for="item in lang" :key="`filter-${item}`">{{ item.label }}</span>
                    </div>
                </div>
            </Transition>
        </div>
        <div
            v-if="filmTv.list.length > 0"
            class="h-full w-full overflow-y-auto hide-scrollbar mt-4 md:mt-8"
        >
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
                >
                    <div
                        v-for="(item, index) in filmTv.list"
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
                            <div v-if="item.country_tag" class="country-tag">
                                {{ item.country_tag }}
                            </div>
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
                                    v-model:current-rate="filmTv.rates[index]"
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
                                                    ? Math.round(item.vote_average * 10)
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
        <div v-else class="flex items-center justify-center h-full" :data="``">
            <van-empty
                image="search"
                :description="`\'${searchTmp}'，找不到哇`"
            />
        </div>
    </div>
    <div class="version">{VERSION}</div>
</template>

<script setup>
import { reactive, inject, ref, onBeforeMount,toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'

const { $axios, IMAGE_URL, $getCountryTag } = inject('$global')
const router = useRouter()
const route = useRoute()

const { state, startLoading, finishLoading } = store
const { isLoading } = toRefs(state)

const initFilmTv = {
    list: [],
    rates: [],
    page: 1,
    totalPages: 1,
}
const initCurrent = {
    type: 'movie',
    key: 'popular',
    search: '',
    searchTmp: '',
}

const filmTv = reactive({ ...initFilmTv })
const current = reactive({ ...initCurrent })

const menu = ref([
    { label: '熱門電影', id: 1, key: 'popular', type: 'movie' },
    { label: '現正熱映', id: 3, key: 'now_playing', type: 'movie' },
    { label: '即將上映', id: 4, key: 'upcoming', type: 'movie' },
    { label: '電視劇', id: 5, key: 'tv_popular', type: 'tv' }, // 正在寫
])

const showFilter = ref(false)
const isTransitionEnd = ref(false)

const lang = ref([
    { label: '中文', key: 'zh' },
    { label: '英文', key: 'en' },
    { label: '日語', key: 'ja' },
    { label: '韓語', key: 'ko' },
])

const loading = ref(false)
const finished = ref(false)

function onLoad() {
    if (filmTv.page > filmTv.totalPages) {
        finished.value = true
        return
    }
    loading.value = false

    getData()
}

function getData() {
    if (filmTv.page === 1) {
        startLoading() // 因為是全屏，首次有 loading 就好
    }
    switch (current.type) {
        case 'movie':
            getMovieList()
            break
        case 'tv':
            getTVList()
            break
        case 'search':
            getSearchList(current.search)
    }
}

async function getMovieList() {
    const res = await $axios.get(
        `/movie/${current.key}?page=${filmTv.page}&region=TW`
    )
    setData(res.data, 'movie')
}

async function getTVList() {
    const key = current.key.replace(/tv_/, '')
    const res = await $axios.get(`/tv/${key}?page=${filmTv.page}&region=TW`)
    setData(res.data, 'tv')
}

async function getSearchList(val) {
    const res = await $axios.get(
        `search/multi?page=${filmTv.page}&query=${val}`
    )
    res.data.results = res.data.results.filter(el =>
        ['movie', 'tv'].includes(el.media_type)
    )
    setData(res.data)
}

function setData(items, type = null) {
    items.results.forEach(el => {
        filmTv.rates.push(0)
        el.media_type = el.media_type ? el.media_type : type
        if (el.media_type === 'tv') {
            el.country_tag = $getCountryTag(el.origin_country[0], 'tv')
        }
    })
    filmTv.list = filmTv.list.concat(items.results)
    if (filmTv.page === 1) {
        filmTv.totalPages = items.total_pages
    }
    filmTv.page++
    finishLoading()
}

function selectType(item) {
    reset()
    const { search, searchTmp } = initCurrent
    const { type, key } = item
    Object.assign(current, {
        type,
        key,
        search,
        searchTmp,
    })
    router.push(`?t=${key}`)
    getData()
}

function onSearch(val) {
    if (!val) return
    reset()
    current.key = 'search'
    current.type = 'search'
    current.searchTmp = val
    getData()
}

function onClear(val) {
    if (!val || current.type !== 'search') return
    reset()
    init()
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

function reset() {
    const { type, key } = initCurrent
    Object.assign(current, { type, key })

    Object.assign(filmTv, initFilmTv)
    loading.value = false
    finished.value = false
}

async function init() {
    await router.isReady()
    current.key = route.query.t ? route.query.t : current.key
    const regex = new RegExp(/tv_(.*)/)
    const tv = regex.test(current.key)
    current.type = tv ? 'tv' : 'movie'
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
    @apply relative overflow-hidden w-full;
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
    @apply ml-0 md:ml-8 flex items-end gap-x-8 font-semibold overflow-x-auto overflow-y-hidden;
    &__label {
        @apply flex-shrink-0 px-1;
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
    :deep(.van-field__left-icon) {
        @apply cursor-pointer;
    }
    :deep(.van-search__content) {
        @apply bg-black;
    }
    :deep(.van-field__control) {
        @apply text-white;
    }
    :deep(input::placeholder) {
        @apply text-gray-400 text-opacity-80;
    }
}

.country-tag {
    @apply absolute top-1 right-1 text-xs py-0.5 px-1 rounded;
    @apply transform scale-90 origin-top-right bg-purple-600 bg-opacity-90 text-white;
}

.filter {
    @apply mt-6 p-4 text-left rounded-lg bg-gray-400;
    width: 52px;
    height: 52px;
    transition: width 1s ease, height 1.5s ease-out;
    &.active {
        width: 100%;
        height: auto;
    }
}
</style>
