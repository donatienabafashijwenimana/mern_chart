
import {create} from 'zustand'
import { axiosinsitance } from '../lib/axiosinstanse'
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:1001', {
    autoConnect: false,
});

const getStoredUser = () => {
    try {
        const storedUser = sessionStorage.getItem('authuser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        sessionStorage.removeItem('authuser');
        return null;
    }
};

export const userauthstore = create((set,get) => ({
    authuser: getStoredUser(),
    isSignup: false,
    islogin: false,
    isUpdatingprofile: false,
    ischeckingAuth: true,
    socket:null,

    checkAuth: async () => {
        try {
            const token = sessionStorage.getItem('token')
            if(!token) {
                set({ authuser: null });
                return;
            }

            const res = await axiosinsitance.get('/auth/check',{
                headers:{Authorization:`Bearer ${token}`},
            });
            set({ authuser: res.data });
            sessionStorage.setItem('authuser', JSON.stringify(res.data));
            get().connectsocket()
        } catch (error) {
            console.log('error in checking auth', error);
            set({ authuser: null });
            sessionStorage.removeItem('authuser');
            sessionStorage.removeItem('token');
        } finally {
            set({ ischeckingAuth: false });
        }
    },

    signup: async(data)=>{
        set({isSignup:true})
        try {
            
            const res = await axiosinsitance.post('auth/register',data)
            set({authuser:res.data.user_data})
            alert(res.data.message)

            const {user_data ,token} = res.data
            sessionStorage.setItem('authuser',JSON.stringify(user_data))
            sessionStorage.setItem('token',token)
            get().connectsocket()
            window.location.href='/profile'
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed')
            console.log(error)
        } finally {
            set({isSignup:false})
        }
    },
    login : async(data)=>{
        set({islogin:true})
        try {
            const res = await axiosinsitance.post('auth/login',data)
            set({authuser:res.data.user_data})
            const {user_data ,token} = res.data
            sessionStorage.setItem('authuser',JSON.stringify(user_data))
            sessionStorage.setItem('token',token)
            alert(res.data.message)
            get().connectsocket()
            window.location.href='/'
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed')
            console.log(error)
        } finally {
            set({islogin:false})
        }
    },

    updateprofile: async(data)=>{
        set({isUpdatingprofile:true})
        try {
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.put('auth/updateprofile',data, {
                headers:{Authorization:`Bearer ${token}`}
            })
            set({authuser:res.data.user_data})
            sessionStorage.setItem('authuser', JSON.stringify(res.data.user_data))
        } catch (error) {
            console.log(error)
        }    finally{
            set({isUpdatingprofile:false})
        }
    },

    connectsocket:()=>{
        const user = get().authuser;
        if (!user?._id) return;
        if (!socket.connected) socket.connect();
        socket.emit('joinRoom',user._id)
    },
    
    disconnectsocket:()=>{
        if (socket.connected) socket.disconnect();
    }
}));
