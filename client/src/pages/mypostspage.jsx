import React, { useEffect } from 'react';
import { userpoststore } from '../store/poststore';
import { userauthstore } from '../store/useauthstore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTags, faClock } from '@fortawesome/free-solid-svg-icons';
import avatar from '../pic/avatar.png';

const Mypostspage = () => {
  const { userpost, getpost, deletepost } = userpoststore();
  const { authuser } = userauthstore();

  useEffect(() => {
    getpost();
  }, [getpost]);

  const myPosts = Array.isArray(userpost) 
    ? userpost.filter(post => (post.author?._id || post.author) === authuser?._id)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Manage My Posts</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
            {myPosts.length} total posts shared
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <FontAwesomeIcon icon={faTags} className="text-xl" />
        </div>
      </div>

      {myPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <FontAwesomeIcon icon={faTags} size="2x" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No posts yet</h2>
          <p className="mt-1 text-sm text-slate-500">Go to home to share what's on your mind!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {myPosts.map((post) => (
            <div key={post._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => deletepost(post._id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-500 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>
              </div>
              
              <div className="p-6">
                {post.content && (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {post.content}
                  </p>
                )}
                
                {post.postfile && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    {post.fileposttype?.startsWith("image") ? (
                      <img src={post.postfile} alt="" className="max-h-96 w-full object-contain" />
                    ) : (
                      <video src={post.postfile} controls className="max-h-96 w-full bg-black" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mypostspage;