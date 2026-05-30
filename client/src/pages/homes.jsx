import React from 'react'
import Navbar from '../components/navbar'
import Chart from '../components/chartpage'
import Header from '../components/header'
import Dashboard from '../components/dashboard'
import Friendship from '../pages/friendspage'
import Mypostspage from '../pages/mypostspage'
import { switchpagestore } from '../store/switchpagestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Notificationpage from './notificationpage'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function home() {
  const { pages,ispagechanging,displaynotification } = switchpagestore()
  return (
    <div className='min-h-screen bg-slate-50'>
      <Header/>
      <Navbar/>
      {displaynotification && <Notificationpage/>}
      {ispagechanging ? <div className="flex h-[60vh] items-center justify-center text-blue-600"><FontAwesomeIcon icon={faSpinner} spin size="2x"/></div>:
        <>
          {pages==='chart' && <Chart/> }
          {pages==='home' && <Dashboard/>}
          {pages==='friend' && <Friendship/>}
          {pages==='myposts' && <Mypostspage/>}
        </>
      }
    </div>
  )
}

export default home
