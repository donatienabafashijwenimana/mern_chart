import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { userauthstore } from "../store/useauthstore";
import { switchpagestore } from '../store/switchpagestore';

function Register() {
  const [showpass,setshowpass]=useState(false)
  const { setpage } = switchpagestore();
  const [form_data, setFormData] = useState({
    fullname: '',
    email:'',
    password: '' 
  });
  const {signup,isSignup}=userauthstore()

  const handlesubmit = (e)=>{
    e.preventDefault()
    signup(form_data)
  }
  
  return (
    <div className="min-h-screen px-4 py-10 text-slate-900">
      <form className="fun-card mx-auto mt-8 w-full max-w-md p-6 sm:p-8" onSubmit={handlesubmit}>
        <div className="mb-2 text-center text-4xl font-black tracking-tight">Join 2Share</div>
        <p className="mb-6 text-center text-sm font-semibold text-slate-500">Make an account and start the chatter.</p>

       
        <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-800">email</label>
        <input className="fun-input mb-4" type="email" id="email" value={form_data.email} autoComplete="email" onChange={(e) => setFormData({...form_data, email: e.target.value.toLocaleLowerCase()})}/>
         
        <label htmlFor="fullname" className="mb-2 block text-sm font-black text-slate-800">username</label>
        <input className="fun-input mb-4" type="text" id="fullname" value={form_data.fullname} autoComplete="name" onChange={(e) => setFormData({...form_data, fullname: e.target.value.toLocaleLowerCase()})}/>
        
        <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-800">Password</label>
        <div className="relative mb-5">
            <input className="fun-input pr-11" type={showpass ? 'text' :'password'} id="password" value={form_data.password} autoComplete="new-password" onChange={(e) => setFormData({...form_data, password: e.target.value})}/>
            <FontAwesomeIcon className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-700 transition hover:text-slate-950' onClick={(e)=>{
                            showpass ? setshowpass(false):setshowpass(true)}}
                            icon={showpass ? faEyeSlash : faEye} /> 
        </div>

        <button className="fun-button-blue flex h-11 w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70" type="submit" value="Sign Up" disabled={isSignup}>{isSignup? <FontAwesomeIcon icon={faSpinner} spin/>:'Sign Up'}</button>
        <small className="mt-4 block text-center text-sm text-slate-500">
          I have an account 
          <button 
            type="button"
            onClick={() => setpage('login')}
            className="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </button>
        </small>
      </form>
    </div>
  );
}

export default Register;
