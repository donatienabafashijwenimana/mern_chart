import { faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Header() {
  return (
    <div className='sticky top-0 z-40 flex h-11 items-center gap-3 border-b border-slate-200 bg-slate-950 px-4 text-white shadow-sm'>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-400 text-sm text-slate-950">
          <FontAwesomeIcon icon={faShare} className="text-sm" />
        </div>
        <span className="text-base font-bold tracking-wide">2Share</span>
        <span className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 sm:inline-flex">posts, chats, friends</span>
      </div>
    </div>
  )
}

export default Header
