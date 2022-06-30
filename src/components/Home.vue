<template>
    <div class="flex px-14">
        <div class="w-1/4">block</div>
        <div class="pl-6">
            <div class="grid grid-cols-4 lg:grid-cols-5 gap-10">
                <div
                    v-for="(item, index) in data.movies"
                    :key="item.id"
                    ref="itemRefs"
                    class="movie"
                    @click="$router.push(`/movie?id=${item.id}`)"
                >
                    <div class="poster" :style="{ height: height + 'px' }">
                        <img :src="`${IMAGE_URL}w342${item.poster_path}`" />
                    </div>

                    <div class="p-2 text-left relative flex-grow">
                        <div class="font-semibold">{{ item.title }}</div>
                        <div class="flex items-c">
                            {{ item.release_date }}
                        </div>
                        <div class="absolute right-2 bottom-0">
                            <van-circle
                                v-model:current-rate="currentRate[index]"
                                :rate="item.vote_average * 10"
                                :stroke-width="100"
                                layer-color="#ebedf0"
                                :color="getColor(item.vote_average * 10)"
                                size="40"
                                :text="item.vote_average * 10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, inject, ref, onBeforeMount, onUpdated } from 'vue'
const { $axios, IMAGE_URL } = inject('$global')

const data = reactive({
    movies: null,
})
const itemRefs = ref([])
const height = ref(0)
const currentRate = ref([])

onBeforeMount(async () => {
    const res = await $axios.get(
        `/movie/popular?page=1`
    )
    data.movies = res.data.results
    data.movies.forEach(el => currentRate.value.push(0))
})

onUpdated(() => {
    const width = itemRefs.value[0].clientWidth
    height.value = Math.floor((143 * width) / 100)
})

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
    @apply rounded-md shadow-md overflow-hidden;
}
.poster {
    @apply overflow-hidden;
    img {
        @apply w-full h-full;
    }
}
</style>
