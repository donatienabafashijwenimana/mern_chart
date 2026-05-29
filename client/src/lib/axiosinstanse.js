import axios from 'axios'


export const axiosinsitance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:1001',
    withCredentials:true,
})
