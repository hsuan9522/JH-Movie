<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const pathName = computed(() => {
    return route.path.replace(/\//g, '').toLowerCase()
})

const peopleId = computed(()=> {
    return route.query.p
})

</script>

<template>
    <div class="h-screen w-screen overflow-hidden">
        <div class="h-full overflow-hidden">
            <Home />
        </div>
        <transition name="van-slide-right">
            <div v-if="pathName === 'movie'" class="absolute top-0 h-screen w-full overflow-hidden">
                <Movie />
            </div>
        </transition>
        <transition name="van-slide-right">
            <div v-if="pathName === 'tv'" class="absolute top-0 h-screen w-full overflow-hidden">
                <TV />
            </div>
        </transition>
        <transition name="van-slide-right">
            <div v-if="peopleId" class="absolute top-0 h-screen w-full overflow-hidden z-10">
                <People :id="peopleId"/>
            </div>
        </transition>
    </div>

    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
    <!-- <router-view /> -->
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
