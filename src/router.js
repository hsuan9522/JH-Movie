import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/components/Home.vue') },
    { path: '/home', component: () => import('@/components/Home.vue') },
    {
        path: '/movie',
        component: () => import('@/components/Movie.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
