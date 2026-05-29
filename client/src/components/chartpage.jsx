import React from "react";
import { userchartstore } from '../store/userchartstore'
import { userauthstore } from '../store/useauthstore'
import Sidebar from './sidebar'
import Noselecteduser from './noselecteduser'
import Messagecontent from './Messagecontent'



function Chartpage() {
  const {selecteduser } = userchartstore()
  const {authuser} = userauthstore()
  
  if(authuser){
    return (
      <div className='grid h-[calc(100vh-128px)] grid-cols-1 gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)]'>
        <Sidebar/>
        {selecteduser ? <Messagecontent/>:<Noselecteduser/>}
      </div>
    )
  }
}

export default Chartpage
