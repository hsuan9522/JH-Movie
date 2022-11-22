import { reactive, readonly } from 'vue'

const state = reactive({
    isLoading: true,
    isError: false,
})

const startLoading = () => {
    state.isLoading = true
}

const finishLoading = () => {
    state.isLoading = false
}

const setError = () => {
    state.isError = true
}

const unsetError = () => {
    state.isError = false
}

export default {
    state: readonly(state),
    startLoading,
    finishLoading,
    setError,
    unsetError,
}
