import axios from 'axios';

const $axios = axios.create({
    baseURL: import.meta.env.VITE_API_HOST
})

export { $axios };