import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye,faSpinner } from '@fortawesome/free-solid-svg-icons';

import { userauthstore } from "../store/useauthstore";
import { switchpagestore } from '../store/switchpagestore';

function Login() {
  const [showpass,setshowpass]=useState(false)
  const [form_data, setFormData] = useState({
    username: '',
    password: '' 
  });
  const {login,islogin}=userauthstore()
  const {setpage} = switchpagestore()
  const handlesubmit = (e)=>{
    e.preventDefault()
    login(form_data)
  }
  return (
    <div className="min-h-screen px-4 py-10 text-slate-900">
      <form className="fun-card mx-auto mt-8 w-full max-w-md p-6 sm:p-8" onSubmit={handlesubmit}>
        <div className="mb-2 text-center text-4xl font-black tracking-tight">Welcome back</div>
        <p className="mb-6 text-center text-sm font-semibold text-slate-500">Enter the 2Share clubhouse.</p>
        <label htmlFor="username" className="mb-2 block text-sm font-black text-slate-800">username</label>
        <input className="fun-input mb-4" type='text' id="username" value={form_data.username} autoComplete="username" onChange={e=>setFormData({...form_data,username:e.target.value.toLowerCase()})}/>
        <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-800">password</label>
        <div className="relative mb-5">
            <input className="fun-input pr-11" type={showpass ? 'text' :'password'} id="password" value={form_data.password} autoComplete="current-password" onChange={(e) => setFormData({...form_data, password: e.target.value})}/>
            <FontAwesomeIcon className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-700 transition hover:text-slate-950' onClick={(e)=>{
                            showpass ? setshowpass(false):setshowpass(true)}}
                            icon={showpass ? faEyeSlash : faEye} /> 
        </div>
        <div className="mb-4 flex justify-end">
          <button 
            type="button" 
            onClick={() => setpage('forgot-password')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <button className="fun-button-blue flex h-11 w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70" type="submit" value="sign in" disabled={islogin}>{islogin ?<FontAwesomeIcon icon={faSpinner} spin/>: 'Sign in'}</button>
        <small className="mt-4 block text-center text-sm text-slate-500">
          I don't have an account 
          <button
            type="button"
            onClick={() => setpage('register')}
            className="ml-1 inline-block font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign up
          </button>
        </small>
      </form>
    </div>
  )
}

export default Login
