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
        <Backdrop v-if="!isError" :bg="data.backgroundImage" />
        <div class="flex py-4 pl-4" @click="$router.go(-1)">
            <div class="cursor-pointer">
                <van-icon name="arrow-left" size="30" />
            </div>
        </div>
        <div v-if="isError" class="h-full flex items-center justify-center">
            <van-empty image="error" description="發生錯誤，回去重來吧！" />
        </div>

        <div class="content-body hide-scrollbar" v-if="data.info" ref="infoRef">
            <!-- title -->
            <div class="text-3xl font-bold">{{ data.info.name }}</div>
            <div class="text-sm font-medium">
                {{ data.info.original_name }}
            </div>
            <!-- runtime & date -->
            <div class="pl-0.5 mt-3 font-sans">
                TV series ·
                {{ data.info.first_air_date.replace(/-(.*)/g, '') }} ·
                {{ data.info.episode_run_time[0] }} min
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
            </div>

            <!-- desc -->
            <div class="mt-4 w-full lg:w-1/2">
                <span class="text-stone-400 font-medium"> 描述： </span>
                <span v-html="overview"></span>
            </div>
            <!-- cast -->
            <CastList
                class="mt-5"
                :data="data.cast"
                @click-more="moreCast = true"
            />

            <!-- self rate -->
            <div class="flex items-center mt-8">
                <span class="text-stone-400 font-medium mr-1"> 評分： </span>
                <van-rate v-model="usrRate" allow-half />
            </div>

            <!-- 集數 -->
            <div v-if="data.info.seasons.length === 1" class="mt-8">
                <span class="text-stone-400 font-medium mr-2"> 集數：</span>
                <span class="font-medium">
                    {{ data.info.seasons[0].episode_count }} 集
                </span>
            </div>

            <!-- networks -->
            <div
                v-if="data.info.networks.length > 0"
                class="mt-8 flex items-center"
            >
                <span class="text-stone-400 font-medium mr-2"> 平台： </span>
                <div
                    v-for="item in data.info.networks"
                    :key="item.name"
                    class="streaming-icon"
                    @click="goStreamHomepage(item.homepage, item.name)"
                >
                    <van-image
                        height="20px"
                        fit="cover"
                        lazy-load
                        :src="`${IMAGE_URL}w154${item.logo_path}`"
                    />
                </div>
            </div>

            <!-- season -->
            <div v-if="data.info.seasons.length > 1" class="mt-8">
                <span class="inline-block text-stone-400 font-medium mr-2 mb-2">
                    季數：
                </span>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3"
                >
                    <div
                        v-for="item in data.info.seasons"
                        :key="`season-${item.id}`"
                        class="season-block"
                    >
                        <div class="poster sm flex-shrink-0">
                            <van-image
                                width="100%"
                                height="100%"
                                lazy-load
                                :src="`${IMAGE_URL}w185${item.poster_path}`"
                            />
                        </div>
                        <div class="py-4 px-6">
                            <div class="text-lg font-medium">
                                {{ item.name }}
                            </div>
                            <div v-if="item.air_date" class="text-sm">
                                {{ item.air_date.replace(/-(.*)/g, '') }} |
                                {{ item.episode_count }} 集
                            </div>
                            <div
                                class="text-sm text-stone-400 three-lines pt-0.5"
                            >
                                {{ item.overview || '-' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- trailer -->
            <!-- <div v-if="data.trailer" class="w-full md:w-1/2 mt-8">
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
            </div> -->
            <!-- similar -->
            <FilmList :data="data.similar" title="相似劇集" type="tv" />
        </div>
    </div>
    <!-- more cast -->
    <CastDialog v-model="moreCast" :data="data.cast"></CastDialog>
</template>

<script setup>
import {
    inject,
    onBeforeMount,
    reactive,
    ref,
    computed,
    watch,
    toRefs,
} from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'

// 找不到解法，全域引入 notify 使用會噴 undefined，只能個別 import 了
import { Notify } from 'vant'
import 'vant/lib/index.css'

const { $axios, $filterNum, IMAGE_URL, $getCountryTag } = inject('$global')
const route = useRoute()

const { state, startLoading, finishLoading, setError, unsetError } = store
const { isLoading, isError } = toRefs(state)

const initData = {
    info: null,
    cast: null,
    backgroundImage: 'url()',
}

const data = reactive({ ...initData })
const infoRef = ref(null)
const usrRate = ref(0)

const moreCast = ref(false)

const id = computed(() => {
    return route.query.id
})

const overview = computed(() => {
    // overview 有可能帶有中文的段落縮兩格，開頭不需要，其餘塞 <br /> 斷行
    return data.info.overview.replace(/(^　　)/, '').replace(/　　/g, '<br />') || '-'
})

async function getTV() {
    try {
        // 拿電視劇資訊
        const res = await $axios.get(`tv/${id.value}`)
        data.info = res.data
        data.backgroundImage = `url(${IMAGE_URL}w1280${data.info.backdrop_path})`
        data.info.country = data.info.origin_country.map(el => {
            return $getCountryTag(el, 'tv')
        })

        // 卡司
        const res_cast = await $axios.get(`tv/${id.value}/credits`)
        data.cast = res_cast.data.cast
            .slice(0, 20)
            .filter(el => el.profile_path)

        // 串流平台
        data.info.networks.forEach(async el => {
            const res_network = await $axios.get(`network/${el.id}`)
            el.homepage = res_network.data.homepage
        })
        // // 預告片
        // const res_video = await $axios.get(`movie/${id.value}/videos`)
        // data.trailer = res_video.data.results.find(el => el.site === 'YouTube')

        // 相似電視劇
        const res_similar = await $axios.get(`tv/${id.value}/similar?page=1`)
        data.similar = res_similar.data.results.splice(0, 8)

        // const seriesId = data.info.belongs_to_collection?.id
        // if (seriesId) {
        //     // 系列電影
        //     const res_series = await $axios.get(`collection/${seriesId}`)
        //     data.series = res_series.data
        // }
    } catch (err) {
        console.log(err)
        setError()
    } finally {
        finishLoading()
    }
}

function reset() {
    startLoading()
    unsetError()
    usrRate.value = 0
    moreCast.value = false
    Object.assign(data, initData)
}

function goStreamHomepage(url, name) {
    if (url) {
        window.open(url)
    } else {
        Notify({
            background: '#ee0a24ba',
            message: `無連結，請自行搜尋 ${name}。`,
            duration: 2000,
        })
    }
}

onBeforeMount(async () => {
    reset()
    getTV()
})

watch(id, () => {
    if (route.path.replace(/\//g, '').toLowerCase() !== 'tv') return // go(-1) 會觸發，所以不是 movie 頁面 return
    reset()
    getTV()
    if (infoRef.value) {
        infoRef.value.scrollTo(0, 0)
    }
})
</script>

<style lang="scss" scoped>
.streaming-icon {
    @apply flex items-center py-2 px-3 bg-white mx-1 rounded-full cursor-pointer;
    transition: all 0.3s;
    &:hover {
        @apply mx-4;
        transform: scale(1.15);
        &:first-of-type {
            @apply ml-0;
        }
    }
}

.season-block {
    @apply flex items-center;
    @apply bg-gray-800 bg-opacity-60 my-2 rounded-lg overflow-hidden;
}

.three-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
