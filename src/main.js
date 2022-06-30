import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { tmdb, omdb } from './axios'
import './assets/css/index.css'

import { Circle, Icon, Rate, Loading, Overlay } from 'vant'

const app = createApp(App)

const global = {
    $axios: tmdb,
    IMAGE_URL: import.meta.env.VITE_IMAGE_URL,
    API_KEY: import.meta.env.VITE_API_KEY,
    OMDB_KEY: import.meta.env.VITE_OMDB_API_KEY,
    LAN: 'zh-TW',
    $filterNum: num => {
        return Math.abs(num) > 999
            ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
            : Math.sign(num) * Math.abs(num)
    },
    $omdb: omdb,
}

app.provide('$global', global)

app.use(Circle).use(Icon).use(Rate).use(Loading).use(Overlay)

app.use(router).mount('#app')
