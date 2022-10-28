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
        <div class="info hide-scrollbar">
            <div class="flex items-center text-3xl font-bold mb-12">
                {{ data.info.name }}
                <span class="ml-4 text-lg">
                    <fa v-if="data.info.gender === 1" icon="fa fa-venus" />
                    <fa v-else-if="data.info.gender === 2" icon="fa fa-mars" />
                </span>
            </div>
            <div class="w-1 h-1 rounded-full bg-white mb-12"></div>
            <div>
                <span class="text-stone-400 font-medium"> 別名： </span>
                <span>{{ data.info.also_known_as?.join('、') }}</span>
            </div>
            <div class="flex mt-4">
                <span class="flex-shrink-0 text-stone-400 font-medium">
                    生日：
                </span>
                <span class="flex flex-col">
                    <div>
                        <span>{{ data.info.birthday }}</span>
                        <span class="text-sm"> ({{ getAge() }}歲)</span>
                    </div>
                    <div class="text-sm pl-0.5 -mt-0.5">
                        {{ data.info.place_of_birth }}
                    </div>
                </span>
            </div>
            <!-- tv -->
            <div v-if="tv" class="mt-8">
                <div class="text-stone-400 font-medium mb-2">最新電視劇：</div>
                <div
                    class="flex justify-start gap-x-5 overflow-x-auto hide-scrollbar"
                >
                    <div
                        v-for="item in tv"
                        :key="`similar-${item.id}`"
                        class="movie-block"
                        @click="$router.replace(`/tv?id=${item.id}`)"
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
                            {{ item.name }}
                            <span class="ml-2 font-semibold text-yellow-500">
                                {{ toFixed(item.vote_average) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- movie -->
            <div v-if="movie" class="mt-8">
                <div class="text-stone-400 font-medium mb-2">最新電影：</div>
                <div
                    class="flex justify-start gap-x-5 overflow-x-auto hide-scrollbar"
                >
                    <div
                        v-for="item in movie"
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
                            {{ item.name }}
                            <span class="ml-2 font-semibold text-yellow-500">
                                {{ toFixed(item.vote_average) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- all -->
            <div v-if="data.credits" class="mt-8">
                <div class="text-stone-400 font-medium mb-4">演出時間軸：</div>
                <div class="px-6 py-4 bg-slate-700 bg-opacity-30 rounded-md">
                    <div v-for="(year, i) in allYear" :key="`detail-${year}`">
                        <div
                            v-for="(item, index) in allByYear[year]"
                            :key="`detail-${year}-${index}`"
                            class="mb-4 flex items-baseline"
                        >
                            <span class="inline-block w-14 flex-shrink-0">
                                {{ item.year }}
                            </span>
                            <fa
                                icon="fa-regular fa-circle"
                                class="relative top-0.5 mr-6"
                            />
                            <span class="inline-flex items-center flex-wrap">
                                <span
                                    class="font-medium flex-shrink-0 mr-1.5 cursor-pointer hover:underline"
                                    @click="
                                        $router.replace(
                                            `/${item.media_type}?id=${item.id}`
                                        )
                                    "
                                >
                                    {{ item.name }}
                                </span>
                                <span v-if="item.character">
                                    <span class="text-stone-500">as</span>
                                    <span class="text-sm text-stone-300 ml-1.5">
                                        {{ item.character }}
                                    </span>
                                </span>
                            </span>
                        </div>
                        <div v-if="allYear.length !== i + 1" class="line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLoading, useError } from '@/hook'
import { computed, inject, onBeforeMount, reactive } from 'vue'

const { isLoading, startLoading, finishLoading } = useLoading()
const { isError, setError, unsetError } = useError()
const { $axios, IMAGE_URL } = inject('$global')

const props = defineProps({
    id: {
        type: String || Number,
        default: null,
    },
})

const initData = {
    info: {},
    credits: [],
    backgroundImage: 'url()',
}

const data = reactive({ ...initData })

const tv = computed(() => {
    return data.credits.filter(e => e.media_type === 'tv').slice(0, 10)
})
const movie = computed(() => {
    return data.credits.filter(e => e.media_type === 'movie').slice(0, 10)
})

const allByYear = computed(() => {
    const tmp = {}
    data.credits.forEach(e => {
        if (tmp[e.year]) {
            tmp[e.year].push(e)
        } else {
            tmp[e.year] = [e]
        }
    })
    return tmp
})

const allYear = computed(() => {
    let tmp = Object.keys(allByYear.value)
        .sort((a, b) => b - a)
        .filter(e => e !== '-')
    tmp.unshift('-')
    return tmp
})

async function getPeopleInfo() {
    try {
        const res = await $axios.get(`/person/${props.id}`)
        data.info = res.data
        data.backgroundImage = `url(${IMAGE_URL}h632${data.info.profile_path})`
        const res_credits = await $axios.get(
            `/person/${props.id}/combined_credits`
        )
        data.credits = res_credits.data.cast
            .map(e => {
                const time =
                    e.media_type === 'tv' ? e.first_air_date : e.release_date
                const name = e.media_type === 'tv' ? e.name : e.title
                return {
                    ...e,
                    date: time,
                    year: time ? new Date(time).getFullYear() : '-',
                    name,
                }
            })
            .sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
    } catch {
        setError()
    } finally {
        finishLoading()
    }
}
// https://www.imdb.com/name/nm8784654/ imdb
function getAge() {
    return new Date().getFullYear() - new Date(data.info.birthday).getFullYear()
}

function toFixed(val) {
    return val.toFixed(1)
}

onBeforeMount(() => {
    getPeopleInfo()
})
</script>

<style lang="scss" scoped>
.info {
    @apply w-full;
    @apply relative h-full overflow-y-auto overflow-x-hidden;
    @apply text-left p-10 pt-2;
    z-index: 1;
}

.backdrop {
    @apply absolute flex justify-end w-full bg-gray-500;
    height: 500px;
    &__image {
        @apply w-1/2 bg-cover;
        background-position: 20% 20%;
    }

    &__left {
        @apply absolute w-4/5 h-full left-0;
        transform: translate(58%);
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
        @apply absolute bottom-0 w-full h-1/3;
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
    &.sm {
        width: 100px;
        height: 143px;
    }
}

.line {
    @apply w-full mb-4 bg-gray-700;
    height: 1px;
}
</style>
