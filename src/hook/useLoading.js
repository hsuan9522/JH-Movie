import { ref } from 'vue'

export default function useLoading(initVal = true) {
    const isLoading = ref(initVal)
    
    function startLoading() {
        isLoading.value = true
    }

    function finishLoading() {
        isLoading.value = false
    }

    return {
        isLoading,
        startLoading,
        finishLoading
    }
}