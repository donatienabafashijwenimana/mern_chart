import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Nomesage() {
  return (
    <div className="flex h-full min-h-48 items-center justify-center text-center">
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-xl"/>
        </div>
        <span className="mt-3 block text-sm font-medium text-slate-500">No messages yet</span>
      </div>
    </div>
  )
}

export default Nomesage
