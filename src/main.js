import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { tmdb, omdb } from './axios'
import './assets/css/index.css'

import {
    Circle,
    Icon,
    Rate,
    Loading,
    List,
    Lazyload,
    Empty,
    Image as VanImage,
} from 'vant'

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

app.use(Circle)
    .use(Icon)
    .use(Rate)
    .use(Loading)
    .use(List)
    .use(VanImage)
    .use(Lazyload)
    .use(Empty)

app.use(router).mount('#app')
