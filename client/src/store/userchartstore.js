import { create } from "zustand";
import { axiosinsitance } from "../lib/axiosinstanse";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:1001/', {
    autoConnect: false,
})

export const userchartstore = create((set,get)=>({
    messages:[],
    users:[],
    selecteduser:null,
    isuserloading:false,
    ismessageloading:false,
    lastmessages:{},
    number_messagetoeachuser:{},
    statusmessagenumber:0,

    getusers: async()=>{
        set({isuserloading:true})
        try {
            const token= sessionStorage.getItem('token')
            const res = await axiosinsitance.get('/message/users',{
                headers:{Authorization:`Bearer ${token}`}
            })
            set({users:res.data})
        } catch (error) {
            console.log(error.response)
        }finally{
            set({isuserloading:false})
        }
    },
    getlastmessage: async (userid) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axiosinsitance.get(`/message/last/${userid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({ lastmessages: { ...state.lastmessages, [userid]: res.data } }));
        } catch (error) {
            console.log(error.response);
        }
    },
    getmessage:async()=>{
        set({messages: [] ,ismessageloading:true})
        try {
            const user_idsel= get().selecteduser._id
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.get(`/message/getmessage/${user_idsel}`,{
            headers:{Authorization:`Bearer ${token}`}
           })
            set({messages:res.data,ismessageloading:false})
        } catch (error) {
            console.log(error.response)
            set({ismessageloading:false})
        }finally{
            set({ismessageloading:false})
        }
    },
    setselecteduser :async (user)=>{
        set({ selecteduser: user});
    },
    sendmessage:async (rec_id,Text,image)=>{
        try {
            const token = sessionStorage.getItem('token')
            const {messages}= get()
            const res =  await axiosinsitance.post(`/message/send/${rec_id}`,
                {Text,image},{
                headers:{Authorization: `Bearer ${token}`}}
            )
            set({messages :[...messages,res.data]})
            socket.emit("sendMessage", { ...res.data, receiverId: rec_id });
        } catch (error) {
            alert(error.response.data)
            console.log(error.response.data)
        }
       
    },
    
    fetchstatusmessage :async()=>{
        try {
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.get(`/message/fetchstatusmessage/`,{
                headers:{Authorization:`Bearer ${token}`}
            })
            set({statusmessagenumber:res.data.unreadnumber})
        } catch (error) {
            console.log(error.response)
        }
    },
    statusmessagetoeachuser :async(userid)=>{
        try {
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.get(`/message/fetchstatusmessagetoeachuser/${userid}`,{
                headers:{Authorization:`Bearer ${token}`}
            })
            set(state => ({
                number_messagetoeachuser: {
                    ...state.number_messagetoeachuser,
                    [userid]: res.data.no_messagetoeachuser
                }
            }));
        } catch (error) {
            console.log(error)
        }
    },
    listenForMessages: () => {
        if (!socket.connected) socket.connect();
        try {
            const storedUser = JSON.parse(sessionStorage.getItem('authuser'));
            if (storedUser?._id) socket.emit('joinRoom', storedUser._id);
        } catch {
            // Ignore invalid session data; auth flow will refresh it.
        }
        const handleReceiveMessage = (newMessage) => {
            set((state) => ({ messages: [...state.messages, newMessage] }));
        };
        socket.off("receiveMessage", handleReceiveMessage);
        socket.on("receiveMessage", handleReceiveMessage);
        return () => socket.off("receiveMessage", handleReceiveMessage);
    },
}))
