import axios from 'axios'

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1001';
export const axiosinsitance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
