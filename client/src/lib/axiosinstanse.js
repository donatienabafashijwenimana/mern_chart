import axios from 'axios'
export const axiosinsitance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://mern-chart.onrender.com',
    withCredentials:true,
})
