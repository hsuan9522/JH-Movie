<template>
    <div v-if="formatData.length > 0" class="mt-10">
        <div class="text-stone-400 font-medium mb-2">{{ title }}：</div>
        <div class="flex justify-start gap-x-5 overflow-x-auto hide-scrollbar">
            <div
                v-for="item in formatData"
                :key="`similar-${item.id}`"
                class="movie-block"
                @click="$router.replace(`/${type}?id=${item.id}`)"
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
                    <span class="mr-2">{{ item.name }}</span>
                    <span class="font-semibold text-yellow-500">
                        {{ item.vote_average.toFixed(1) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const { IMAGE_URL } = inject('$global')
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'movie',
    },
})
const formatData = computed(() => {
    return props.data.map(e => {
        return {
            ...e,
            name: e.title || e.name,
        }
    })
})
</script>

<style lang="scss" scoped>
.movie-block {
    ::v-deep .van-image {
        transition: transform 0.2s ease-in-out;
    }
    &:hover {
        .poster {
            ::v-deep .van-image {
                transform: scale(1.15);
            }
        }
    }
}
</style>
