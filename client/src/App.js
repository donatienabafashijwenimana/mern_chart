import React, { useEffect } from "react";
import{BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom'


import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/homes'
import Setting from './pages/setting'
import Profile from './pages/profilepage'
import { userauthstore } from "./store/useauthstore";

function App() {
  const {authuser,checkAuth,ischeckingAuth}= userauthstore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  if (ischeckingAuth && !authuser) return( <div>loading....</div> )
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={authuser ? <Home/>: <Navigate to="/login"/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/setting" element={<Setting/>}/>
          <Route path="/profile" element={authuser ? <Profile/>: <Navigate to="/login"/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
