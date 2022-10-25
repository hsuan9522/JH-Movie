import axios from 'axios'

const tmdb = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // tmdb
    params: {
        api_key: import.meta.env.VITE_API_KEY,
        language: 'zh-TW',
        t: new Date().getTime() // 有時候會出現 304 cache，加上時間戳記避掉
    },
})

const omdb = axios.create({
    baseURL: import.meta.env.VITE_OMDB_URL, // omdb
    params: {
        apikey: import.meta.env.VITE_OMDB_API_KEY,
        t: '',
    },
})

export { tmdb, omdb }
