
import {create} from 'zustand'
import { axiosinsitance, BASE_URL } from '../lib/axiosinstanse'
import { io } from 'socket.io-client';
export const socket = io(BASE_URL, {
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
    isSendingResetEmail: false,
    isResettingPassword: false,
    forgotPasswordLink: null,
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
            if (error.code === 'ERR_NETWORK') {
                alert('Cannot connect to the server. Please ensure the backend is running on port 1001.');
            } else {
                alert(error.response?.data?.message || 'Login failed');
            }
            console.error('Login Error:', error);
        } finally {
            set({islogin:false})
        }
    },

    logout: async () => {
        try {
            await axiosinsitance.post('auth/logout');
            set({ authuser: null });
            sessionStorage.removeItem('authuser');
            sessionStorage.removeItem('token');
            get().disconnectsocket();
            window.location.href = '/login';
        } catch (error) {
            console.log('error in logout', error);
            alert(error.response?.data?.message || 'Logout failed');
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

    forgotPassword: async (email) => {
        set({ isSendingResetEmail: true, forgotPasswordLink: null });
        try {
            const res = await axiosinsitance.post('auth/forgot-password', { email });
            const link = res.data.resetLink || null;
            set({ forgotPasswordLink: link });
            alert(link ? `Reset link: ${link}` : res.data.message);
            return true;
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send reset link');
            return false;
        } finally {
            set({ isSendingResetEmail: false });
        }
    },

    resetPassword: async (token, password) => {
        set({ isResettingPassword: true });
        try {
            const res = await axiosinsitance.post(`auth/reset-password/${token}`, { password });
            alert(res.data.message);
            window.location.href = '/login';
            return true;
        } catch (error) {
            alert(error.response?.data?.message || 'Password reset failed');
            return false;
        } finally {
            set({ isResettingPassword: false });
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
