import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/index.css'
import './assets/css/main.scss'
import '@vant/touch-emulator' // 沒有這個，vant 有些 click 不會被觸發，例如: Search 裡的 clear
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome.js'
import { global } from './plugins/global'

import {
    Circle,
    Icon,
    Rate,
    Loading,
    List,
    Lazyload,
    Empty,
    Search,
    Image as VanImage,
} from 'vant'

const app = createApp(App)

app.component('fa', FontAwesomeIcon)

app.provide('$global', global)

app.use(Circle)
    .use(Icon)
    .use(Rate)
    .use(Loading)
    .use(List)
    .use(VanImage)
    .use(Lazyload)
    .use(Empty)
    .use(Search)

app.use(router).mount('#app')
