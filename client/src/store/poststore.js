import { create } from "zustand";
import { axiosinsitance } from "../lib/axiosinstanse";

const token = sessionStorage.getItem('token')
export const userpoststore = create((set,get)=>({
    userpost:[],
    ispostloading:false,
    postlikes:[],

    sendpost: async(posttext, filepost,fileposttype) => {
        set({ispostloading:true})
        try {
            
            const res = await axiosinsitance.post('/post/createpost', 
                {posttext,filepost,fileposttype},{
                headers:{Authorization:`Bearer ${token}`},
            })
            alert(res.data.message)
        } catch (error) {
            alert(error.response.data.message)
        }finally{
            set({ispostloading:false})
        }
    },
    getpost: async()=>{
        try {
            const res = await axiosinsitance.get('/post/getpost',{
                headers:{Authorization:`Bearer ${token}`}
            })
            set({userpost:res.data})
        } catch (error) {
            console.log(error.response.data.message)

        }
    },
    likepost: async(postid)=>{
        try {
            const res = await axiosinsitance.post('/post/likepost/',{postid},{
                headers:{Authorization:`Bearer ${token}`}
            })
            get().getpost()
            alert (res.data.message)
        } catch (error) {
            console.log(error.response.data.message)    
        }
    },
    dislikepost: async(postid)=>{
        try {
            const res = await axiosinsitance.post('/post/dislikepost/',{postid},{
                headers:{Authorization:`Bearer ${token}`}
            })
            alert (res.data.message)
            get().getpost()
        } catch (error) {
            console.log(error.response.data.message)    
        }
    },
    getlike: async(postid)=>{
        try {
            const res = await axiosinsitance.get(`/post/getlike/${postid}`,{
                headers:{Authorization:`Bearer ${token}`}
            })
            set({postlikes:res.data})
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

}))