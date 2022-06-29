import axios from 'axios'

const tmdb = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // tmdb
})

const omdb = axios.create({
    baseURL: import.meta.env.VITE_OMDB_URL, // omdb
})

export { tmdb, omdb }
