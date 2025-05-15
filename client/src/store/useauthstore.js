
import {create} from 'zustand'
import { axiosinsitance } from '../lib/axiosinstanse'
import { io } from 'socket.io-client';
const socket = io('https://mern-chart-server-djog6nadd-donatiens-projects-b24a54cb.vercel.app/')
export const userauthstore = create((set,get) => ({
    authuser: sessionStorage.getItem('authuser')||null,
    isSignup: false,
    islogin: false,
    isUpdatingprofile: false,
    isChackingAuth: true,
    socket:null,

    checkAuth: async () => {
        try {
            const token = sessionStorage.getItem('token')
            if(!token) return console.log('no token')

            const res = await axiosinsitance.get('/auth/check',{
                headers:{Authorization:`Bearer ${token}`},
            });
            set({ authuser: res.data });
            get().connectsocket()
        } catch (error) {
            console.log('error in checking auth', error);
            set({ authuser: null });
        } finally {
            set({ ischackingAuth: false });
        }
    },

    signup: async(data)=>{
        try {
            
            const res = await axiosinsitance.post('auth/register',data)
            set({authuser:res.data})
            alert(res.data.message)

            const {user_data ,token} = res.data
            sessionStorage.setItem('authuser',user_data)
            sessionStorage.setItem('token',token)
            window.location.href='/profile'
        } catch (error) {
            alert(error.response.data.message)
            console.log(error)
        }
    },
    login : async(data)=>{
        try {
            const res = await axiosinsitance.post('auth/login',data)
            set({authuser:res.data})
            const {user_data ,token} = res.data
            sessionStorage.setItem('authuser',user_data)
            sessionStorage.setItem('token',token)
            alert(res.data.message)
            window.location.href='/'

            get().connectsocket()
        } catch (error) {
            alert(error.response.data.message)
            console.log(error)
        }
    },

    updateprofile: async(data)=>{
        set({isUpdatingprofile:true})
        try {
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.put('auth/updateprofile',data, {
                headers:{Authorization:`Bearer ${token}`}
            })
            set({authdata:res.data})
        } catch (error) {
            console.log(error)
        }    finally{
            set({isUpdatingprofile:false})
        }
    },

    connectsocket:()=>{
        socket.emit('joinRoom',get().authuser._id)
    },
    
    disconnectsocket:()=>{}
}));