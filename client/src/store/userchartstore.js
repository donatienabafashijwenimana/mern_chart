import { create } from "zustand";
import { axiosinsitance } from "../lib/axiosinstanse";
import { socket } from "./useauthstore";

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
        const selected = get().selecteduser;
        if (!selected) return;
        set({ ismessageloading: true });
        try {
            const user_idsel = selected._id;
            const token = sessionStorage.getItem('token')
            const res = await axiosinsitance.get(`/message/getmessage/${user_idsel}`,{
            headers:{Authorization:`Bearer ${token}`}
           })
            set({ messages: res.data, ismessageloading: false });
        } catch (error) {
            console.log(error.response)
            set({ismessageloading:false})
        }finally{
            set({ismessageloading:false})
        }
    },
    setselecteduser :async (user)=>{
        set({ selecteduser: user });
        if (user) {
            // Clear unread count for the selected user when opening the chat
            set(state => ({
                number_messagetoeachuser: {
                    ...state.number_messagetoeachuser,
                    [user._id]: 0
                },
                statusmessagenumber: Math.max(0, state.statusmessagenumber - (state.number_messagetoeachuser[user._id] || 0))
            }));
        }
    },
    sendmessage:async (rec_id,Text,image)=>{
        try {
            const token = sessionStorage.getItem('token')
            const {messages}= get()
            const res =  await axiosinsitance.post(`/message/send/${rec_id}`,
                {Text,image},{
                headers:{Authorization: `Bearer ${token}`}}
            )
            set((state) => ({
                messages: [...state.messages, res.data],
                lastmessages: {
                    ...state.lastmessages,
                    [rec_id]: res.data,
                }
            }))
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
            const { selecteduser } = get();
            
            // Normalize sender ID from the message
            const senderId = newMessage.senderId || newMessage.sender;
            
            // Only update active message list if chat with sender is open
            if (selecteduser && selecteduser._id === senderId) {
                set((state) => ({ 
                    messages: [...state.messages, newMessage] 
                }));
                return; // Exit early so we don't increment unread counts
            }

            // If we are NOT in the chat, update unread counts and previews
            set((state) => ({
                lastmessages: {
                    ...state.lastmessages,
                    [senderId]: newMessage,
                },
                number_messagetoeachuser: {
                    ...state.number_messagetoeachuser,
                    [senderId]: (state.number_messagetoeachuser[senderId] || 0) + 1,
                },
                statusmessagenumber: state.statusmessagenumber + 1,
            }));
        };

        // Ensure we don't have multiple listeners active
        socket.off("receiveMessage");
        socket.on("receiveMessage", handleReceiveMessage);
        
        return () => socket.off("receiveMessage", handleReceiveMessage);
    },
}))
