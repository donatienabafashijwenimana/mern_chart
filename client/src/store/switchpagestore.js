import { create } from "zustand";

export const switchpagestore = create((set,get) =>({
    pages:'home',
    ispagechanging:false,
    displaynotification:false,
    setpage: async(page_)=>{
       set({ispagechanging:true, pages: page_})
       try {
          // Logic for analytics or logging could go here
       } catch (error) {
        console.log(error)
       }finally{
        
        setTimeout(() => {
             set({ispagechanging:false})
        }, 500);
       }
    },
    setdisplaynotification: (displaynotification)=>{
        set({displaynotification:displaynotification})
      //   console.log
    }
}))