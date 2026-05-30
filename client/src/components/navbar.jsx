import React, { useState } from 'react';
import { userauthstore } from '../store/useauthstore';
import { switchpagestore } from '../store/switchpagestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faUserFriends, faSignOutAlt, faTags, faBell } from '@fortawesome/free-solid-svg-icons';
import avatar from '../pic/avatar.png';

/**
 * Navbar component that provides navigation links and a user sub-menu.
 */
const Navbar = () => {
  const { authuser, logout } = userauthstore();
  const { setpage, pages } = switchpagestore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Only display navigation items if user is logged in
  if (!authuser) return null;

  return (
    <nav className="sticky top-16 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-1.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Main Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="group relative">
            <button 
              onClick={() => setpage('home')}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all ${pages === 'home' ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FontAwesomeIcon icon={faHome} />
            </button>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 z-50 shadow-lg">Home</span>
          </div>

          <div className="group relative">
            <button 
              onClick={() => setpage('chart')}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all ${pages === 'chart' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 z-50 shadow-lg">Messages</span>
          </div>

          <div className="group relative">
            <button 
              onClick={() => setpage('friend')}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all ${pages === 'friend' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FontAwesomeIcon icon={faUserFriends} />
            </button>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 z-50 shadow-lg">Friends</span>
          </div>

          <div className="group relative">
            <button 
              onClick={() => setpage('myposts')}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all ${pages === 'myposts' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FontAwesomeIcon icon={faTags} className={pages === 'myposts' ? "text-amber-700" : "text-amber-500"} />
            </button>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 z-50 shadow-lg">Posts</span>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-3 transition hover:bg-slate-100"
          >
            <img
              src={authuser?.profilepic || avatar}
              alt="profile"
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="hidden text-xs font-bold text-slate-700 sm:inline capitalize" >
              {authuser?.fullname?.split(' ')[0] || 'User'}
            </span>
            <span className={`text-[10px] text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {/* Sub-menu (Dropdown) */}
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-40">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-[10px]" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;