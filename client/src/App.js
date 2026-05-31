import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { userauthstore } from './store/useauthstore';
import { switchpagestore } from './store/switchpagestore';

import Home from './pages/homes';
import Login from './pages/login'; // Import casing must match file: login.jsx
import Register from './pages/register'; // Import casing must match file: register.jsx
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AuthGate = () => {
  const { authuser, checkAuth, ischeckingAuth } = userauthstore();
  const { pages, ispagechanging } = switchpagestore();
  const location = useLocation();
  
  // Reactive check for reset path using React Router's location
  const isResetPath = location.pathname.startsWith('/reset-password/');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (ischeckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-blue-600">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (authuser) return <Home />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      {isResetPath ? (
        <ResetPassword />
      ) : ispagechanging ? (
        <div className="text-blue-600"><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
      ) : pages === 'forgot-password' ? (
        <ForgotPassword />
      ) : pages === 'register' ? (
        <Register />
      ) : (
        <Login />
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Central AuthGate manages the view transitions for all unauthenticated paths */}
        <Route path="/reset-password/:token" element={<AuthGate />} />
        <Route path="*" element={<AuthGate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;