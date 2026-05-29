import React from 'react'
import { userauthstore } from '../store/useauthstore'
import Navbar from '../components/navbar'
import Chart from '../components/chartpage'
import Header from '../components/header'
import Dashboard from '../components/dashboard'
import Friendship from '../pages/friendspage'
import { switchpagestore } from '../store/switchpagestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Notificationpage from './notificationpage'


function home() {
  const { pages,ispagechanging,displaynotification } = switchpagestore()
  const { authuser }= userauthstore()
     if(authuser) { 
        return (
          <div className='min-h-screen bg-slate-50'>
          <Header/>
          <Navbar/>
          {displaynotification && <Notificationpage/>}
          {ispagechanging ? <div><FontAwesomeIcon/></div>:
            <>
              {pages==='chart' && <Chart/> }
              {pages==='home' && <Dashboard/>}
              {pages==='friend' && <Friendship/>}
            </>
          }
          
          </div>
        )
     }
}

export default home
