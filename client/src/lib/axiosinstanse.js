import axios from 'axios'

export const BASE_URL = 'http://localhost:1001';

export const axiosinsitance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
