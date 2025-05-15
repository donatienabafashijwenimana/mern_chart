import axios from 'axios'


export const axiosinsitance = axios.create({
    baseURL:'https://mern-chart-5o1y.vercel.app/',
    withCredentials:true,
})