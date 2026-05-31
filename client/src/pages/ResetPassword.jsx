import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { userauthstore } from '../store/useauthstore';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';

function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const fullname = searchParams.get('fullname');
  
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { resetPassword, isResettingPassword } = userauthstore();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(token, password);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-64px)]">
        <div className="mx-auto w-full max-sm:w-full max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Reset Password</h2>
              {fullname ? (
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Set a new password for <span className="text-blue-600 capitalize font-black">{fullname}</span>.
                </p>
              ) : (
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Please enter your new password below.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-800">New Password</label>
              <div className="relative">
                <input
                  className="fun-input pr-11"
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-900"
                  onClick={() => setShowPass(!showPass)}
                  icon={showPass ? faEyeSlash : faEye}
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-400">Must be at least 6 characters.</p>
            </div>

            <button
              className="fun-button-blue flex h-11 w-full items-center justify-center font-bold disabled:opacity-50"
              type="submit"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Update Password'}
            </button>

            <div className="flex flex-col space-y-2 pt-4">
               <a 
                href="/login" 
                className="text-center text-xs font-black text-slate-400 hover:text-blue-600 transition"
               >
                 Back to Login
               </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;