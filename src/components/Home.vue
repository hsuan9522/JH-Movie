<template>
    <div class="flex py-14 px-8 h-full bg-gray-500 text-white">
        <!-- <div class="w-1/4 h-full">block</div> -->
        <div class="h-full w-full overflow-y-auto hide-scrollbar">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="Finished"
                offset="0"
                @load="onLoad"
            >
                <div
                    class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-y-10"
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
import { reactive, inject, ref, onBeforeMount } from 'vue'
const { $axios, IMAGE_URL } = inject('$global')

const data = reactive({
    movies: [],
})

const currentRate = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const finished = ref(false)

const onLoad = () => {
    if(page.value > totalPages.value) {
        finished.value = true
        return
    } 
    loading.value = false
    getPopularMovies()
}

async function getPopularMovies() {
    console.log(page.value)
    const res = await $axios.get(`/movie/popular?page=${page.value}`)
    data.movies = data.movies.concat(res.data.results)
    data.movies.forEach(el => currentRate.value.push(0))
    if(page.value === 1) {
        totalPages.value = res.data.total_pages
    }
    page.value++
}

function getColor(val) {
    const rate = parseInt(val)
    if (rate <= 40) {
        return '#C93861'
    } else if (rate > 40 && rate <= 70) {
        return '#D4D553'
    } else if (rate > 70) {
        return '#63CE82'
    } else {
        return '#666666'
    }
}
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
</style>
