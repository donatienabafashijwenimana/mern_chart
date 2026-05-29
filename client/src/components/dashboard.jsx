import React ,{useEffect} from 'react'
import avatar from '../pic/avatar.png'
import avatar1 from '../pic/bb.png'
import avatar2 from '../pic/aa.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faComment, faEnvelope, faHome,
          faShare, faTags, faThumbsDown, faThumbsUp, faUserFriends} from '@fortawesome/free-solid-svg-icons'
import { switchpagestore } from '../store/switchpagestore'
import {userauthstore} from '../store/useauthstore'
import Createpost from './createpost'
import { userpoststore } from '../store/poststore'
import useFriendStore from '../store/friendshipstore'
function Dashboard() {
  const{setpage}=switchpagestore()
  const{authuser}= userauthstore()
  const {userpost,likepost,dislikepost} = userpoststore()
  const { user_suggest,requests,sendRequest, getSuggestions, acceptRequest,
          getRequest,rejectRequest,officialfriendnumber,getofficialfriends } = useFriendStore()

  useEffect(() => {
    getSuggestions()
    getRequest()
    getofficialfriends()

    const interval = setInterval(() => {
      getSuggestions()
      getRequest()
      getofficialfriends()
    }, 1000);

    return () => clearInterval(interval);
  }, [getSuggestions,getofficialfriends,getRequest]);
  return (
    <div className='grid min-h-[calc(100vh-108px)] grid-cols-1 gap-5 px-4 py-5 text-slate-900 lg:grid-cols-[260px_minmax(0,1fr)_300px] xl:px-6'>
      <div className="space-y-4">
        <div className="fun-panel p-3">
        <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700" onClick={()=>setpage('home')}>
          <FontAwesomeIcon icon={faHome}/>
          <span>Home</span>
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"  onClick={()=>setpage('chart')}>
          <FontAwesomeIcon icon={faEnvelope}/>
          <span>Message</span>
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700" onClick={()=>setpage('friend')}>
          <FontAwesomeIcon icon={faUserFriends}/>
          <span>Friends</span>
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700">
          <FontAwesomeIcon icon={faTags}/>
          <span>Post</span>
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700">
          <FontAwesomeIcon icon={faBell}/>
          <span>Notification</span>
        </div>
        </div>
        <div className="fun-card bg-emerald-50 p-5 text-center">
          <img src={authuser && authuser.profilepic ? authuser.profilepic : avatar1} className="mx-auto h-16 w-16 rounded-full border border-emerald-200 object-cover shadow-sm" alt=''/>
          <h3 className="mt-3 text-sm font-bold text-slate-900">{authuser?.fullname}</h3>
          <h3 className="mt-1 break-words text-xs font-medium text-slate-500">{authuser?.email}</h3>
          
          <div className="fun-badge mt-4 bg-white">
            <span><strong>{officialfriendnumber}</strong> Friends</span>
          </div>

          <div className="mt-4">
            <button className="fun-button-blue h-9 w-full text-xs">View Profile</button>
          </div>
        </div>
        <Createpost/>
      </div>
      <div className="min-w-0 space-y-5">
        <div className="fun-card overflow-hidden bg-white">
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="fun-badge bg-rose-50 text-rose-700">Welcome back</p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{authuser?.fullname || 'Friend'}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Catch posts, messages, and friends in one bright workspace.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3">
                <div className="text-lg font-bold text-sky-700">{Array.isArray(userpost) ? userpost.length : 0}</div>
                <div className="text-xs font-semibold text-sky-600">Posts</div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="text-lg font-bold text-emerald-700">{officialfriendnumber}</div>
                <div className="text-xs font-semibold text-emerald-600">Friends</div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400" />
        </div>
        <div className="fun-panel flex gap-3 overflow-x-auto bg-white p-4">
          <img className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" src={avatar}  alt=""/>
          <img className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" src={avatar1} alt=""/>
          <img className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" src={avatar2} alt=""/>
          <img className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" src={avatar1} alt=""/>
        </div>
        
        {Array.isArray(userpost) && userpost.map((post, index) => {
          const author = post.author || {};
          const likedby = Array.isArray(post.likedby) ? post.likedby : [];
          const dislikedby = Array.isArray(post.dislikedby) ? post.dislikedby : [];

          return (
          
        <div key={post._id || index} className="fun-card overflow-hidden bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-amber-50 px-4 py-3">
            <img src={author.profilepic || avatar} alt="profile" className='h-10 w-10 rounded-full border border-slate-200 object-cover'/>
            <span className='text-sm font-bold text-slate-900'>{author.fullname || 'Unknown user'}</span>
          </div>
          <div className="space-y-4 p-4">
            {post.content && <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.content}</div>}
            
            {post.postfile && <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
              {post.fileposttype?.startsWith('image') && <img src={post.postfile } alt="" className='max-h-[520px] w-full object-contain'/>}
              {post.fileposttype?.startsWith('video') && <video controls className='max-h-[520px] w-full bg-black'>
                <source src={post.postfile } alt=""/>
              </video>}
            </div>}
          </div>
          <div className="grid grid-cols-4 border-t border-slate-100 text-sm text-slate-600">
            <div className="flex items-center justify-center gap-2 py-3"><FontAwesomeIcon className='text-slate-500' icon={faShare}/>10</div>
            <div className="flex items-center justify-center gap-2 py-3"><FontAwesomeIcon className='text-slate-500' icon={faComment}/>10</div>
            <div className="flex items-center justify-center gap-2 py-3">
              <FontAwesomeIcon onClick={()=>likepost(post._id)}
              className={likedby.includes(authuser?._id) ? 'cursor-pointer text-blue-600'
                                                             :'cursor-pointer text-slate-500 transition hover:text-blue-600'}
              icon={faThumbsUp}/>{likedby.length}
            </div>
            <div className="flex items-center justify-center gap-2 py-3">
              <FontAwesomeIcon onClick={()=>dislikepost(post._id)}
              className={dislikedby.includes(authuser?._id) ? 'cursor-pointer text-rose-600'
                                                             :'cursor-pointer text-slate-500 transition hover:text-rose-600'}
              icon={faThumbsDown}/>{dislikedby.length}
            </div>
          </div>
          
        </div>
        )})}
      </div>
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-sm font-semibold text-slate-900">
            Friend Requests
          </div>
          {requests.length === 0 ? (
              <div className="rounded-md bg-slate-50 p-4 text-center text-sm text-slate-500">
                <FontAwesomeIcon icon={faUserFriends} className="mb-2 text-lg text-slate-400" />
                <p>No friend Requests</p>
              </div>
            ) : (
              [...requests]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0,3).map((req) => (
                <div key={req._id} className="mb-3 flex gap-3 rounded-lg border border-slate-100 p-3 last:mb-0">
                  <img 
                    src={req.requester.profilepic || avatar} 
                    className="h-11 w-11 rounded-full object-cover" 
                    alt="Profile"/>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">{req.requester.fullname}</div> 
                    <small className="mt-1 block text-xs text-slate-500">
                      {req.mutualFriends || 0} mutual friends 
                    </small>
                    <div className="mt-3 flex gap-2">
                      <button 
                        className="h-8 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                          onClick={() => acceptRequest(req._id)}>Accept</button>
                      <button 
                        className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-200" 
                        onClick={() => rejectRequest(req._id)}>Reject</button>
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-3 text-sm font-semibold text-slate-900">
          People You May know
          </div>
          {user_suggest
          .sort((a,b)=> b.mutualFriends - a.mutualFriends)
          .slice(0,3)
          .map((friend) => (
          <div key={friend._id} className="mb-3 flex gap-3 rounded-lg border border-slate-100 p-3 last:mb-0">
            <img src={friend.profilepic || avatar} className="h-11 w-11 rounded-full object-cover" alt=''/>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900">{friend.fullname}</div>
              <small className="mt-1 block text-xs text-slate-500">{friend.mutualFriends || 0} mutual friends</small>
              <div className="mt-3">
                {friend.hasPendingRequest ?
                <button className="h-8 rounded-md bg-amber-100 px-3 text-xs font-semibold text-amber-700" onClick={() => sendRequest(friend._id)}>pending...</button>:
                <button className="h-8 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700" onClick={() => sendRequest(friend._id)}>Request</button>
                }
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard
