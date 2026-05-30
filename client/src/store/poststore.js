import { create } from "zustand";
import { axiosinsitance } from "../lib/axiosinstanse";

const getAuthHeader = () => ({
    Authorization: `Bearer ${sessionStorage.getItem('token')}`
})

export const userpoststore = create((set,get)=>({
    userpost:[],
    ispostloading:false,
    postlikes:[],

    sendpost: async(posttext, filepost,fileposttype) => {
        set({ispostloading:true})
        try {
            
            const res = await axiosinsitance.post('/post/createpost', 
                {posttext,filepost,fileposttype},{
                headers:getAuthHeader(),
            })
            alert(res.data.message);
            get().getpost();
        } catch (error) {
            alert(error.response.data.message)
        }finally{
            set({ispostloading:false})
        }
    },
    getpost: async()=>{
        try {
            const res = await axiosinsitance.get('/post/getpost',{
                headers:getAuthHeader()
            })
            set({userpost:res.data})
        } catch (error) {
            console.log(error.response.data.message)

        }
    },
    likepost: async (postid) => {
        try {
            const res = await axiosinsitance.post('/post/likepost', { postid }, {
                headers: getAuthHeader()
            });
            set((state) => ({
                userpost: state.userpost.map((p) => 
                    p._id === postid ? { ...p, ...res.data } : p
                )
            }));
        } catch (error) {
            console.error('Like action failed:', error.response?.data?.message);
        }
    },
    dislikepost: async (postid) => {
        try {
            const res = await axiosinsitance.post('/post/dislikepost', { postid }, {
                headers: getAuthHeader()
            });
            set((state) => ({
                userpost: state.userpost.map((p) => 
                    p._id === postid ? { ...p, ...res.data } : p
                )
            }));
        } catch (error) {
            console.error('Dislike action failed:', error.response?.data?.message);
        }
    },
    getlike: async(postid)=>{
        try {
            const res = await axiosinsitance.get(`/post/getlike/${postid}`,{
                headers:getAuthHeader()
            })
            set({postlikes:res.data})
        } catch (error) {
            console.log(error.response.data.message)
        }
    },
    deletepost: async (postid) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        try {
            const res = await axiosinsitance.delete(`/post/delete/${postid}`, {
                headers: getAuthHeader()
            });
            set((state) => ({
                userpost: state.userpost.filter((p) => p._id !== postid)
            }));
            alert(res.data.message);
        } catch (error) {
            console.error('Delete action failed:', error.response?.data?.message);
        }
    },

}))
