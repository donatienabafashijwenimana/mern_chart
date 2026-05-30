import React, { useState } from 'react';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, isSendingResetEmail } = userauthstore();
    const { setpage } = switchpagestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) {
            setpage('login'); // Send user back to login after success
        }
    };

    return (
        <div className="min-h-screen px-4 py-10 text-slate-900">
            <form className="fun-card mx-auto mt-8 w-full max-w-md p-6 sm:p-8" onSubmit={handleSubmit}>
                <div className="mb-2 text-center text-4xl font-black tracking-tight">Forgot Password</div>
                <p className="mb-6 text-center text-sm font-semibold text-slate-500">Enter your email and we'll send a reset link.</p>
                
                <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-800">Email Address</label>
                <input 
                    className="fun-input mb-6"
                    type="email"
                    id="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <button className="fun-button-blue mb-4 flex h-11 w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSendingResetEmail}>
                    {isSendingResetEmail ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Send Reset Link'}
                </button>
                
                <button type="button" className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800" onClick={() => setpage('login')}>Back to Login</button>
            </form>
        </div>
    );
};

export default ForgotPassword;