<template>
    <Dialog v-model="isShow" class="divide-y divide-gray-800">
        <div
            v-for="item in props.data"
            :key="`cast-m-${item.id}`"
            class="text-center py-4 border-b border-gray-800 last:border-b-0"
        >
            <div class="font-bold">{{ item.name }}</div>
            <div class="text-sm text-stone-400">
                {{ item.character.replace(/ \/.*/g, '') }}
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    data: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue'])

const isShow = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
})
</script>

<style lang="scss" scoped>
::v-deep .popup-dialog {
    min-width: 500px;
}

@media (max-width: 480px) {
    ::v-deep .popup-dialog {
        min-width: 85%;
    }
}
</style>
