import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage} from '@fortawesome/free-solid-svg-icons';

import { userauthstore } from '../store/useauthstore';
import { userchartstore } from '../store/userchartstore';
import avatar from '../pic/avatar.png';

function Sidebar() {
    const { authuser } = userauthstore();
    const { getusers, users, selecteduser, setselecteduser,lastmessages,getlastmessage,number_messagetoeachuser,
        statusmessagetoeachuser} = userchartstore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        getusers();
    }, [getusers]);

     useEffect(()=>{
        users.forEach(user => {
            getlastmessage(user._id)
            statusmessagetoeachuser(user._id)
            
        });
     },[users,getlastmessage,statusmessagetoeachuser])
    return (
        <div className='fun-card flex min-h-0 flex-col bg-white'>
            <div className="border-b border-slate-100 bg-amber-50 p-4">
            <h3 className="text-base font-bold text-slate-900">Contacts</h3>
            <input
                className="fun-input mt-3"
                type="search"
                placeholder="Search Contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {users
                    .filter((Users) => Users._id !== authuser?._id)
                    .filter((Users) =>
                        Users.fullname.toLowerCase().includes(search.toLowerCase())
                    )
                    .sort((a, b) => {
                        const lastMsgA = lastmessages[a._id]?.createdAt || 0;
                        const lastMsgB = lastmessages[b._id]?.createdAt || 0;
                        return new Date(lastMsgB) - new Date(lastMsgA);
                    })
                    .map((Users) => (
                        
                        <div
                            key={Users._id}
                            className={selecteduser && selecteduser._id===Users._id
                                ? "relative flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3"
                                : "relative flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition hover:border-slate-200 hover:bg-amber-50" }
                            onClick={async() =>{ setselecteduser(Users)
                                     }}>

                            <img className="h-10 w-10 rounded-full border border-slate-200 object-cover" src={Users.profilepic || avatar} alt="Profile" />
                            <div className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-slate-900">{Users.fullname}</span>
                                <small className={lastmessages[Users._id] && lastmessages[Users._id].receiverId===authuser?._id ? 'mt-1 block truncate text-xs text-blue-600':'mt-1 block truncate text-xs text-slate-500'}>
                                    {lastmessages[Users._id] && lastmessages[Users._id].images && <FontAwesomeIcon icon={faImage}/>}
                                    {lastmessages[Users._id] && lastmessages[Users._id].images ? 'image' : lastmessages[Users._id] && lastmessages[Users._id].text}
                                </small>
                                
                            </div>
                            {number_messagetoeachuser && number_messagetoeachuser[Users._id] > 0 && <div className='fun-badge bg-rose-300'>{number_messagetoeachuser[Users._id]}</div>}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Sidebar;
