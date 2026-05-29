import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function noselecteduser() {
  return (
    <div className='flex min-h-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-soft'>
      <div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FontAwesomeIcon icon={faMessage} className='text-2xl'/>
        </div>
        <span className="mt-4 block text-sm font-medium text-slate-600">Select a contact to start a conversation</span>
      </div>
    </div>
  )
}

export default noselecteduser
