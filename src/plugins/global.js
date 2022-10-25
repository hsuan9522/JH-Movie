import { tmdb, omdb } from './axios'
import { getCountryTag } from './common'

export const global = {
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
    $getCountryTag: getCountryTag,
}