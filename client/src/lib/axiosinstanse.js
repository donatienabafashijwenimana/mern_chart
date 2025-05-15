import axios from 'axios'


export const axiosinsitance = axios.create({
    baseURL:'https://mern-chart-server-djog6nadd-donatiens-projects-b24a54cb.vercel.app/',
    withCredentials:true,
})