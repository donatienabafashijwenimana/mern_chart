import React, { useState } from 'react';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isSendingResetEmail, forgotPasswordLink, resetPasswordUser } = userauthstore();
  const { setpage } = switchpagestore();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(email);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-64px)]">
        <div className="mx-auto w-full max-sm:w-full max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Forgot Password?</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Enter your email address and we'll provide your reset link.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-800">Email</label>
              <input
                className="fun-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>

            <button
              className="fun-button-blue flex h-11 w-full items-center justify-center font-bold disabled:opacity-50"
              type="submit"
              disabled={isSendingResetEmail}
            >
              {isSendingResetEmail ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Generate Reset Link'}
            </button>

            {forgotPasswordLink && (
              <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-bold text-blue-900">
                  Reset link for <span className="capitalize">{resetPasswordUser}</span>:
                </p>
                <a
                  href={forgotPasswordLink}
                  className="mt-2 block text-xs font-medium text-blue-600 underline break-all hover:text-blue-800"
                >
                  {forgotPasswordLink}
                </a>
                <p className="mt-2 text-[10px] text-blue-400 italic">
                  Note: In a production environment, this link would be sent via email.
                </p>
              </div>
            )}

            <p className="text-center text-sm font-medium text-slate-500">
              Remembered?{" "}
              <button type="button" onClick={() => setpage('login')} className="font-black text-blue-600 hover:underline">Sign in</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;