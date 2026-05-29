import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye,faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { userauthstore } from "../store/useauthstore";
import avatar from '../pic/avatar.png'

import Navbar from '../components/navbar'

function Profilepage() {
  const [selectedimage,setselectedimage]= useState(null)
  const [showpass,setshowpass]=useState(false)
  const [form_data, setFormData] = useState({
    fullname: '',
    email:'',
    password: '' 
  });
  const {updateprofile,isUpdatingprofile}=userauthstore()

  const handlesubmit = async(e)=>{
    e.preventDefault()
    updateprofile(form_data)
  }

  const {authuser}= userauthstore()

  const handleuploadimage = (e)=>{
    // e.preventDefault()
    const image= e.target.files[0]
    if (!image) return;
    const reader = new FileReader();
    reader.readAsDataURL(image)
    reader.onload = async()=>{
      const base64Image = reader.result;
      setselectedimage(base64Image)
      await updateprofile({profilepic:base64Image})
      
    }
    
  }
  
  
  return (
    <div className="min-h-screen px-4 py-6 text-slate-900">
      <Navbar/>
      <form className="fun-card mx-auto mt-6 w-full max-w-xl p-6 sm:p-8" onSubmit={handlesubmit}>
        <div className="mb-6 text-center text-2xl font-bold tracking-tight">Your Profile</div>
        <div className="mx-auto mb-4 flex w-fit flex-col items-center">
          <div className="relative">
          <img src={selectedimage || authuser?.profilepic || avatar} alt="profile" className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm"/>
          <label htmlFor="upload_image" className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white shadow-sm transition hover:bg-sky-600">
            <FontAwesomeIcon icon={faEdit} className='text-sm'/>
            <input type="file" name="profile_pic" id="upload_image" className='hidden'
              onChange={handleuploadimage}/>
          </label>
          </div>
        </div>
        <p className="mb-6 text-center text-sm text-slate-500">Tap the edit icon to change your profile picture</p>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">full name/username</label>
        <input className="fun-input mb-4" type="text" id="username" value={form_data.fullname || authuser?.fullname || ''}
        onChange={(e) => setFormData({...form_data, fullname: e.target.value})}/>
        
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">email</label>
        <input className="fun-input mb-4" type="email" id="email" value={form_data.email || authuser?.email || ''}
        onChange={(e) => setFormData({...form_data, email: e.target.value})}/>

        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
        <div className="relative mb-5">
            <input className="fun-input pr-11" type={showpass ? 'text' :'password'} id="password" autoComplete="new-password" onChange={(e) => setFormData({...form_data, password: e.target.value})}/>
            <FontAwesomeIcon className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 transition hover:text-slate-900' onClick={(e)=>{
                            showpass ? setshowpass(false):setshowpass(true)}}
                            icon={showpass ? faEyeSlash : faEye} /> 
        </div>
        
        <button className="fun-button-blue flex h-10 w-full items-center justify-center" type="submit" value="edit" disabled={isUpdatingprofile}>{isUpdatingprofile ? <FontAwesomeIcon icon={faSpinner} spin/> :'Save profile'}</button>
      </form>
    </div>
  );
}

export default Profilepage;
