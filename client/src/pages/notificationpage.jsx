import { faBell, faTrash, faCheckDouble, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import avatar from '../pic/avatar.png';

function Notificationpage() {
  // Mock notifications for demonstration
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', text: 'damour liked your status', time: '2 mins ago', read: false },
    { id: 2, type: 'friend', text: 'Alex sent you a friend request', time: '1 hour ago', read: true },
    { id: 3, type: 'comment', text: 'Sarah commented on your post', time: '5 hours ago', read: false },
  ]);

  const clearAll = () => setNotifications([]);
  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const deleteOne = (id) => setNotifications(notifications.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wider">
            Manage your recent activity • {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="text-sky-500" />
            Mark all read
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
          >
            <FontAwesomeIcon icon={faTrash} />
            Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-300">
            <FontAwesomeIcon icon={faBell} size="2x" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">All caught up!</h2>
          <p className="mt-1 text-sm text-slate-500">You've seen all your recent notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all hover:shadow-md ${n.read ? 'bg-white' : 'bg-violet-50/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-violet-100 text-violet-600'}`}>
                  <FontAwesomeIcon icon={faBell} className="text-sm" />
                </div>
                <div>
                  <p className={`text-sm ${n.read ? 'text-slate-600' : 'font-bold text-slate-900'}`}>{n.text}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <FontAwesomeIcon icon={faClock} />
                    {n.time}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteOne(n.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
              >
                <FontAwesomeIcon icon={faTrash} className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notificationpage