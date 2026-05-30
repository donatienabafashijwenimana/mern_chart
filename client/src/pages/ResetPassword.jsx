import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/header';

const ResetPassword = () => {
    const { token } = useParams(); // Extracts the token from the URL
    const [password, setPassword] = useState('');
    const [showpass, setShowpass] = useState(false);
    const { resetPassword, isResettingPassword } = userauthstore();
    const { setpage } = switchpagestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await resetPassword(token, password);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <div className="px-4 py-10">
            <form className="fun-card mx-auto mt-8 w-full max-w-md p-6 sm:p-8" onSubmit={handleSubmit}>
                <div className="mb-2 text-center text-4xl font-black tracking-tight">New Password</div>
                <p className="mb-6 text-center text-sm font-semibold text-slate-500">Enter your new clubhouse password.</p>
                
                <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-800">New Password</label>
                <div className="relative mb-5">
                    <input 
                        className="fun-input pr-11" 
                        type={showpass ? 'text' : 'password'} 
                        id="password" 
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FontAwesomeIcon 
                        className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-700 transition hover:text-slate-950' 
                        onClick={() => setShowpass(!showpass)}
                        icon={showpass ? faEyeSlash : faEye} 
                    />
                </div>

                <button 
                    className="fun-button-blue flex h-11 w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70" 
                    type="submit" 
                    disabled={isResettingPassword}
                >
                    {isResettingPassword ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Reset Password'}
                </button>

                <button type="button" className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800" onClick={() => window.location.href = '/'}>Back to Login</button>
            </form>
            </div>
        </div>
    );
};

export default ResetPassword;