import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye,faSpinner } from '@fortawesome/free-solid-svg-icons';
import avatar from '../pic/avatar.png';
import Header from '../components/header';

import { userauthstore } from "../store/useauthstore";
import { switchpagestore } from '../store/switchpagestore';

function Login() {
  const [showpass,setshowpass]=useState(false)
  const [form_data, setFormData] = useState({
    email: '',
    password: ''
  });
  const {login,islogin}=userauthstore()
  const {setpage} = switchpagestore()
  const handlesubmit = (e)=>{
    e.preventDefault()
    login(form_data)
  }
  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />
      <div className="flex justify-between w-full pr-2 py-2 min-h-[calc(100vh-64px)]">
      {/* Aside Content (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-sky-500 to-blue-700 pr-12 py-12 text-white">
        <div className="max-w-md">
          <img src={avatar} alt="Logo" className="mb-8 h-20 w-auto brightness-0 invert" />
          <h1 className="text-5xl font-black tracking-tight">Connecting hearts and minds.</h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-sky-100">
            Sign in to see what your friends are sharing today. Your digital clubhouse is just one click away. Rejoin the bright workspace where connections happen.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <form className="space-y-6" onSubmit={handlesubmit}>
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Great to see you again</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">Please enter your details to access your account.</p>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-800">Email</label>
              <input className="fun-input" type='text' id="email" value={form_data.email} autoComplete="username" onChange={e=>setFormData({...form_data,email:e.target.value.toLowerCase()})}/>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-black text-slate-800">Password</label>
                <button type="button" onClick={() => setpage('forgot-password')} className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</button>
              </div>
              <div className="relative">
                  <input className="fun-input pr-11" type={showpass ? 'text' :'password'} id="password" value={form_data.password} autoComplete="current-password" onChange={(e) => setFormData({...form_data, password: e.target.value})}/>
                  <FontAwesomeIcon className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-900' onClick={() => setshowpass(!showpass)} icon={showpass ? faEyeSlash : faEye} /> 
              </div>
            </div>

            <button className="fun-button-blue flex h-11 w-full items-center justify-center font-bold disabled:opacity-50" type="submit" disabled={islogin}>
              {islogin ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Sign in'}
            </button>

            <p className="text-center text-sm font-medium text-slate-500">
              Don't have an account?{" "}
              <button type="button" onClick={() => setpage('register')} className="font-black text-blue-600 hover:underline">Sign up</button>
            </p>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Login
