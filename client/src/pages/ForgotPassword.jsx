import React, { useState } from 'react';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope, faShieldAlt, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/header';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [recoveryPin, setRecoveryPin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [method, setMethod] = useState('email'); // 'email' or 'pin'

    const { forgotPassword, isSendingResetEmail, resetWithPin, isResettingPassword } = userauthstore();
    const { setpage } = switchpagestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (method === 'email') {
            const success = await forgotPassword(email);
            if (success) setIsEmailSent(true);
            else alert("Could not send email. Try the Recovery Pin method.");
        } else {
            if (typeof resetWithPin !== 'function') {
                alert("The 'Reset with Pin' feature is not yet implemented in your authentication store.");
                return;
            }

            const success = await resetWithPin({ email, recoveryPin, newPassword });
            if (success) {
                alert("Password reset successful!");
                setpage('login');
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900">
            <Header />
            <div className="px-4 py-10">
            {isEmailSent ? (
                <div className="fun-card mx-auto mt-8 w-full max-w-md p-6 text-center sm:p-8">
                    <div className="mb-4 text-3xl font-black text-slate-900">Check your email</div>
                    <p className="mb-6 text-sm font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
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
                    <div className="mb-6 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1">
                        <button 
                            type="button" 
                            onClick={() => setMethod('email')}
                            className={`flex flex-1 items-center justify-center gap-2 py-2 text-xs font-bold transition-all ${method === 'email' ? 'rounded-lg bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <FontAwesomeIcon icon={faEnvelope} /> Email Link
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setMethod('pin')}
                            className={`flex flex-1 items-center justify-center gap-2 py-2 text-xs font-bold transition-all ${method === 'pin' ? 'rounded-lg bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <FontAwesomeIcon icon={faShieldAlt} /> Recovery Pin
                        </button>
                    </div>

                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Reset Password</h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            {method === 'email' ? "We'll send a link to your registered email." : "Use your 4-digit secret pin to reset instantly."}
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                            <input className="fun-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        {method === 'pin' && (
                            <>
                                <div>
                                    <label htmlFor="pin" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">4-Digit Recovery Pin</label>
                                    <input className="fun-input" type="text" maxLength="4" placeholder="Enter secret pin" value={recoveryPin} onChange={(e) => setRecoveryPin(e.target.value.replace(/\D/g, ''))} required />
                                </div>
                                <div>
                                    <label htmlFor="newPass" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                                        <input className="fun-input pl-9 pr-11" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                        <FontAwesomeIcon 
                                            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-900 text-xs' 
                                            onClick={() => setShowPassword(!showPassword)} 
                                            icon={showPassword ? faEyeSlash : faEye} 
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    <button 
                        className="fun-button-blue mt-8 flex h-11 w-full items-center justify-center font-bold disabled:opacity-70" 
                        type="submit" 
                        disabled={method === 'email' ? isSendingResetEmail : isResettingPassword}
                    >
                        { (isSendingResetEmail || isResettingPassword) ? <FontAwesomeIcon icon={faSpinner} spin/> : (method === 'email' ? 'Send Reset Link' : 'Reset Password Now') }
                    </button>
                    
                    <button type="button" className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-950 transition-colors" onClick={() => setpage('login')}>Back to Login</button>
                </form>
            )}
            </div>
        </div>
    );
};

export default ForgotPassword;