import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import avatar from '../pic/avatar.png';
import Header from '../components/header';

import { userauthstore } from "../store/useauthstore";
import { switchpagestore } from '../store/switchpagestore';

function Register() {
  const [showpass,setshowpass]=useState(false)
  const { setpage } = switchpagestore();
  const [form_data, setFormData] = useState({
    fullname: '',
    email:'',
    password: '',
    recoveryPin: ''
  });
  const {signup,isSignup}=userauthstore()

  const handlesubmit = (e)=>{
    e.preventDefault()
    signup(form_data)
  }
  
  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />
      <div className="flex pr-2 py-2 min-h-[calc(100vh-64px)]">
      {/* Aside Content (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 pr-12 py-12 text-white">
        <div className="max-w-md">
          <img src={avatar} alt="Logo" className="mb-8 h-20 w-auto brightness-0 invert" />
          <h1 className="text-5xl font-black tracking-tight">The world is better together.</h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-indigo-100">
            Create your account and start building your network. Share posts, send messages, and make every moment count in our vibrant community.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <form className="space-y-5" onSubmit={handlesubmit}>
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Start your journey here</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">Join the most vibrant clubhouse and connect with your world.</p>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-800">Email address</label>
              <input className="fun-input" type="email" id="email" value={form_data.email} autoComplete="email" onChange={(e) => setFormData({...form_data, email: e.target.value.toLocaleLowerCase()})}/>
            </div>
            
            <div>
              <label htmlFor="fullname" className="mb-2 block text-sm font-black text-slate-800">Username</label>
              <input className="fun-input" type="text" id="fullname" value={form_data.fullname} autoComplete="name" onChange={(e) => setFormData({...form_data, fullname: e.target.value.toLocaleLowerCase()})}/>
            </div>

            <div>
              <label htmlFor="recoveryPin" className="mb-2 block text-sm font-black text-slate-800">Secret Recovery Pin (4 digits)</label>
              <input className="fun-input" type="text" id="recoveryPin" maxLength="4" placeholder="e.g. 1234" value={form_data.recoveryPin} onChange={(e) => setFormData({...form_data, recoveryPin: e.target.value.replace(/\D/g, '')})}/>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-800">Password</label>
              <div className="relative">
                  <input className="fun-input pr-11" type={showpass ? 'text' :'password'} id="password" value={form_data.password} autoComplete="new-password" onChange={(e) => setFormData({...form_data, password: e.target.value})}/>
                  <FontAwesomeIcon className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-900' onClick={() => setshowpass(!showpass)} icon={showpass ? faEyeSlash : faEye} /> 
              </div>
            </div>

            <button className="fun-button-blue flex h-11 w-full items-center justify-center font-bold disabled:opacity-50" type="submit" disabled={isSignup}>
              {isSignup ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Create Account'}
            </button>

            <p className="text-center text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <button type="button" onClick={() => setpage('login')} className="font-black text-blue-600 hover:underline">Login</button>
            </p>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Register;
