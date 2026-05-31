import React, { useState } from 'react';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/header';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const { forgotPassword, isSendingResetEmail, forgotPasswordLink } = userauthstore();
    const { setpage } = switchpagestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) setIsEmailSent(true);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900">
            <Header />
            <div className="px-4 py-10">
            {isEmailSent && forgotPasswordLink ? (
                <div className="mx-auto mt-8 w-full max-w-md space-y-4">
                    <div className="fun-card p-6 text-center sm:p-8">
                        <div className="mb-2 text-xl font-black text-slate-900">Reset link ready</div>
                        <p className="text-sm font-medium text-slate-500">
                            Your email provider is not sending yet, so use the link below to reset your password.
                        </p>
                        <a
                            className="mt-4 block break-all text-sm font-bold text-blue-700 underline"
                            href={forgotPasswordLink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {forgotPasswordLink}
                        </a>
                        <p className="mt-2 text-xs text-slate-500">
                            This link expires in 15 minutes.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="fun-button-blue w-full h-11 font-bold"
                        onClick={() => setpage('login')}
                    >
                        Back to Login
                    </button>
                </div>
            ) : isEmailSent ? (
                <div className="fun-card mx-auto mt-8 w-full max-w-md p-6 text-center sm:p-8">
                    <div className="mb-4 text-3xl font-black text-slate-900">Check your email</div>
                    <p className="mb-4 text-sm font-medium text-slate-500">
                        We've sent a password reset link to <br/>
                        <span className="text-slate-900 font-bold lowercase">{email}</span>
                    </p>
                    <button
                        type="button"
                        className="fun-button-blue w-full h-11 font-bold"
                        onClick={() => setpage('login')}
                    >
                        Back to Login
                    </button>
                </div>
            ) : (
                <form className="fun-card mx-auto mt-8 w-full max-w-md p-6 sm:p-8" onSubmit={handleSubmit}>
                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Reset Password</h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                            <input className="fun-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    
                    <button 
                        className="fun-button-blue mt-8 flex h-11 w-full items-center justify-center font-bold disabled:opacity-70" 
                        type="submit" 
                        disabled={isSendingResetEmail}
                    >
                        {isSendingResetEmail ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Send Reset Link'}
                    </button>
                    
                    <button type="button" className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-950 transition-colors" onClick={() => setpage('login')}>Back to Login</button>
                </form>
            )}
            </div>
        </div>
    );
};

export default ForgotPassword;