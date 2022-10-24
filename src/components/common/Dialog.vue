<template>
    <transition name="van-fade">
        <div
            v-show="isShow"
            class="w-full h-full absolute top-0 z-10 text-white bg-black bg-opacity-80"
            @click="isShow = false"
        >
            <div class="flex h-full justify-center items-center">
                <div class="popup-dialog" :style="{width: width}">
                    <div class="flex justify-end -mt-3 -mr-2">
                        <span class="cursor-pointer" @click="isShow = false">
                            <van-icon name="cross" />
                        </span>
                    </div>
                    <div class="px-10 overflow-y-auto hide-scrollbar">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: 'initial'
    }
})

const emit = defineEmits(['update:modelValue'])

const isShow = computed({
    get:() => props.modelValue,
    set:(val) => emit('update:modelValue', val) 
})

</script>

<style lang="scss" scoped>
.popup-dialog {
    @apply rounded-lg;
    @apply bg-gray-500 p-8 overflow-hidden;
    box-shadow: 0px 1px 7px #494949;
    max-height: 80%;
}
</style>