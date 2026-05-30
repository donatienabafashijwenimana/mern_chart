import React, { useEffect } from "react";
import avatar from "../pic/avatar.png";
import avatar1 from "../pic/bb.png";
import avatar2 from "../pic/aa.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComment,
  faEnvelope,
  faHome,
  faShare,
  faTags,
  faThumbsDown,
  faThumbsUp,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { switchpagestore } from "../store/switchpagestore";
import { userauthstore } from "../store/useauthstore";
import Createpost from "./createpost";
import { userpoststore } from "../store/poststore";
import useFriendStore from "../store/friendshipstore";
function Dashboard() {
  const { setpage } = switchpagestore();
  const { authuser } = userauthstore();
  const { userpost, likepost, dislikepost, getpost } = userpoststore();
  const {
    user_suggest,
    requests,
    sendRequest,
    getSuggestions,
    acceptRequest,
    getRequest,
    rejectRequest,
    officialfriendnumber,
    getofficialfriends,
  } = useFriendStore();

  useEffect(() => {
    getpost();
    getSuggestions();
    getRequest();
    getofficialfriends();
  }, [getSuggestions, getofficialfriends, getRequest, getpost]);
  return (
    <div className="grid min-h-[calc(100vh-108px)] grid-cols-1 gap-5 px-4 py-5 text-slate-900 lg:grid-cols-[260px_minmax(0,1fr)_300px] xl:px-6">
      <div className="space-y-4">
        
        <div className="fun-card bg-emerald-50 p-5 text-center">
          <img
            src={
              authuser && authuser.profilepic ? authuser.profilepic : avatar1
            }
            className="mx-auto h-16 w-16 rounded-full border border-emerald-200 object-cover shadow-sm"
            alt=""
          />
          <h3 className="mt-3 text-sm font-bold text-slate-900">
            {authuser?.fullname}
          </h3>
          <h3 className="mt-1 break-words text-xs font-medium text-slate-500">
            {authuser?.email}
          </h3>

          <div className="fun-badge mt-4 bg-white">
            <span>
              <strong>{officialfriendnumber}</strong> Friends
            </span>
          </div>

          <div className="mt-4">
            <button className="fun-button-blue h-9 w-full text-xs">
              View Profile
            </button>
          </div>
        </div>
        <Createpost />
      </div>
      <div className="min-w-0 space-y-5">
        <div className="fun-card overflow-hidden bg-white">
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {authuser?.fullname || "Friend"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Catch posts, messages, and friends in one bright workspace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3">
                <div className="text-lg font-bold text-sky-700">
                  {Array.isArray(userpost) ? userpost.filter(post => (post.author?._id || post.author) === authuser?._id).length : 0}
                </div>
                <div className="text-xs font-semibold text-sky-600">Posts</div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="text-lg font-bold text-emerald-700">
                  {officialfriendnumber}
                </div>
                <div className="text-xs font-semibold text-emerald-600">
                  Friends
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400" />
        </div>
        <div className="fun-panel flex gap-3 overflow-x-auto bg-white p-4">
          <img
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
            src={avatar}
            alt=""
          />
          <img
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
            src={avatar1}
            alt=""
          />
          <img
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
            src={avatar2}
            alt=""
          />
          <img
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
            src={avatar1}
            alt=""
          />
        </div>

        {Array.isArray(userpost) &&
          userpost.map((post, index) => {
            const author = post.author || {};
            const likedby = Array.isArray(post.likedby) ? post.likedby : [];
            const dislikedby = Array.isArray(post.dislikedby)
              ? post.dislikedby
              : [];

            return (
              <div
                key={post._id || index}
                className="fun-card overflow-hidden bg-white"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 bg-amber-50 px-4 py-3">
                  <img
                    src={author.profilepic || avatar}
                    alt="profile"
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    {author.fullname || "Unknown user"}
                  </span>
                </div>
                <div className="space-y-4 p-4">
                  {post.content && (
                    <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {post.content}
                    </div>
                  )}

                  {post.postfile && (
                    <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      {post.fileposttype?.startsWith("image") && (
                        <img
                          src={post.postfile}
                          alt=""
                          className="max-h-[520px] w-full object-contain"
                        />
                      )}
                      {post.fileposttype?.startsWith("video") && (
                        <video
                          key={post.postfile}
                          src={post.postfile}
                          controls
                          className="max-h-[520px] w-full bg-black"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex border-t border-slate-100 text-sm text-slate-600">
                  <button 
                    onClick={() => likepost(post._id)}
                    className="flex flex-1 items-center justify-center gap-2 py-3 transition hover:bg-slate-50 active:scale-95"
                  >
                    <FontAwesomeIcon
                      className={likedby.some(u => (u._id || u) === authuser?._id) ? "text-blue-600" : "text-slate-400"}
                      icon={faThumbsUp}
                    />
                    <span className={likedby.some(u => (u._id || u) === authuser?._id) ? "font-bold text-blue-600" : ""}>
                      {likedby.length}
                    </span>
                  </button>
                  <div className="w-px bg-slate-100 my-2" />
                  <button 
                    onClick={() => dislikepost(post._id)}
                    className="flex flex-1 items-center justify-center gap-2 py-3 transition hover:bg-slate-50 active:scale-95"
                  >
                    <FontAwesomeIcon
                      className={dislikedby.some(u => (u._id || u) === authuser?._id) ? "text-rose-600" : "text-slate-400"}
                      icon={faThumbsDown}
                    />
                    <span className={dislikedby.some(u => (u._id || u) === authuser?._id) ? "font-bold text-rose-600" : ""}>
                      {dislikedby.length}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className="hidden space-y-4 lg:block">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-sm font-semibold text-slate-900">
            Friend Requests
          </div>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
              <FontAwesomeIcon icon={faUserFriends} className="text-xl opacity-20" />
              <p className="text-xs font-medium">No friend Requests</p>
            </div>
          ) : (
            [...requests]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((req) => (
                <div
                  key={req._id}
                  className="mb-3 flex gap-3 rounded-lg border border-slate-100 p-3 last:mb-0"
                >
                  <img
                    src={req.requester.profilepic || avatar}
                    className="h-11 w-11 rounded-full object-cover"
                    alt="Profile"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {req.requester.fullname}
                    </div>
                    <small className="mt-1 block text-xs text-slate-500">
                      {req.mutualFriends || 0} mutual friends
                    </small>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="h-8 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                        onClick={() => acceptRequest(req._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                        onClick={() => rejectRequest(req._id)}
                      >
                        Reject
                      </button>
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
            .sort((a, b) => b.mutualFriends - a.mutualFriends)
            .slice(0, 3)
            .map((friend) => (
              <div
                key={friend._id}
                className="mb-3 flex gap-3 rounded-lg border border-slate-100 p-3 last:mb-0"
              >
                <img
                  src={friend.profilepic || avatar}
                  className="h-11 w-11 rounded-full object-cover"
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {friend.fullname}
                  </div>
                  <small className="mt-1 block text-xs text-slate-500">
                    {friend.mutualFriends || 0} mutual friends
                  </small>
                  <div className="mt-3">
                    {friend.hasPendingRequest ? (
                      <button
                        className="h-8 rounded-md bg-amber-100 px-3 text-xs font-semibold text-amber-700"
                        onClick={() => sendRequest(friend._id)}
                      >
                        pending...
                      </button>
                    ) : (
                      <button
                        className="h-8 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                        onClick={() => sendRequest(friend._id)}
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
