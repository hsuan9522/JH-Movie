<template>
    <div v-if="props.data">
        <div class="text-stone-400 font-medium mb-2">
            {{ props.title }}：
            <span v-if="props.data.length === 0" class="text-white"> - </span>
        </div>
        <div
            v-if="props.data.length > 0"
            class="flex flex-wrap gap-y-2 items-center"
        >
            <div
                v-for="item in topSix"
                :key="'cast' + item.id"
                class="cursor-pointer transition-transform transofrm hover:scale-110"
                @click="
                    $router.push({
                        path,
                        query: { ...query, p: item.id },
                    })
                "
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
                <div class="more-btn" @click="emit('clickMore')">
                    <van-icon name="arrow" size="12" />
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
        default: '主演',
    },
})

const topSix = computed(() => {
    return props.data.slice(0, 6)
})

const emit = defineEmits(['clickMore'])
</script>
