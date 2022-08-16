import { ref } from 'vue'

export default function useError(initVal = false) {
    const isError = ref(false)

    function setError() {
        isError.value = true
    }

    function unsetError() {
        isError.value = false
    }

    return {
        isError,
        setError,
        unsetError
    }
}