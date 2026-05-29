import React, { useEffect } from 'react';
import { userauthstore } from '../store/useauthstore';
import avatar from '../pic/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome ,faBars, faEnvelope, faUserFriends, faUser} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { switchpagestore } from '../store/switchpagestore';
import { userchartstore } from '../store/userchartstore';
import useFriendStore from '../store/friendshipstore';

function Navbar() {
    const {setpage,setdisplaynotification} = switchpagestore()
    const {statusmessagenumber,fetchstatusmessage} = userchartstore()
    const {friendsuggestionnumber}=useFriendStore()
    const navigate = useNavigate()
    const location = useLocation()
    const { authuser } = userauthstore();
    const isProfilePage = location.pathname === '/profile';

    // Example numbers for icons
    const iconNumbers = {
        home: 3,
        message: statusmessagenumber,
        bell: friendsuggestionnumber,
    };
    useEffect(()=>{
        fetchstatusmessage();
        const interval = setInterval(fetchstatusmessage, 1000); // refresh every 30s
        return () => clearInterval(interval); // cleanup
        },[fetchstatusmessage]);

    const navButtonClass = "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition hover:-translate-y-0.5";
    const navIconClass = "text-[17px]";
    const goToPage = (page) => {
        setpage(page);
        if (location.pathname !== '/') navigate('/');
    };

    return (
        <div className="sticky top-0 z-30 mx-auto flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur md:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <img className={`h-10 w-10 cursor-pointer rounded-full border object-cover shadow-sm ${isProfilePage ? 'border-sky-400 ring-4 ring-sky-100' : 'border-slate-200'}`} src={authuser?.profilepic || avatar} alt="Profile" 
                onClick={e=>navigate('/profile')}/>
                <div className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900">{isProfilePage ? 'Profile settings' : authuser?.fullname}</span>
                    <small className={isProfilePage ? "mt-0.5 flex items-center gap-1 text-xs font-medium text-sky-600" : "mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600"}>
                        {isProfilePage ? <FontAwesomeIcon icon={faUser} className="text-[10px]" /> : <small className='h-2 w-2 rounded-full bg-emerald-500'/>}
                        {isProfilePage ? authuser?.fullname : 'online'}
                    </small>
                   
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative">
                    <button type="button" className={`${navButtonClass} bg-sky-50 text-sky-700 hover:bg-sky-100`} onClick={(e)=>goToPage('home')}>
                        <FontAwesomeIcon className={navIconClass} icon={faHome} />
                    </button>
                </div>
                <div className="relative">
                    <button type="button" className={`${navButtonClass} bg-rose-50 text-rose-700 hover:bg-rose-100`} onClick={(e)=>goToPage('chart')}>
                        <FontAwesomeIcon className={navIconClass} icon={faEnvelope} />
                    </button>
                    {iconNumbers.message>0 &&<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">{iconNumbers.message}</span>}
                </div>
                <div className="relative">
                    <button type="button" className={`${navButtonClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`} onClick={(e)=>goToPage('friend')}>
                        <FontAwesomeIcon className={navIconClass} icon={faUserFriends} />
                    </button>
                    {iconNumbers.bell > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">{iconNumbers.bell}</span>}
                </div>
                <div className="relative">
                    <button type="button" className={`${navButtonClass} bg-violet-50 text-violet-700 hover:bg-violet-100`} onClick={(e)=>setdisplaynotification(true)}>
                        <FontAwesomeIcon className={navIconClass} icon={faBell} />
                    </button>
                    {iconNumbers.bell > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">{iconNumbers.bell}</span>}
                </div>
                <div className="relative">
                    <button type="button" className={`${navButtonClass} ${isProfilePage ? 'bg-sky-100 text-sky-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`} onClick={() => navigate('/profile')}>
                        <FontAwesomeIcon className={navIconClass} icon={isProfilePage ? faUser : faBars} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
