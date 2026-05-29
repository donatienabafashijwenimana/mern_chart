import React, { useEffect } from 'react';
import avatar from '../pic/avatar.png';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useFriendStore from '../store/friendshipstore';

function FriendCard({ image, name, detail, children }) {
    return (
        <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50">
            <img src={image || avatar} className="h-11 w-11 rounded-full border border-slate-200 object-cover" alt="Profile" />
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">{name}</div>
                <small className="mt-1 block text-xs text-slate-500">{detail}</small>
                <div className="mt-3 flex flex-wrap gap-2">{children}</div>
            </div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-lg border border-dashed border-sky-200 bg-sky-50 p-6 text-center">
            <FontAwesomeIcon icon={faUserFriends} className="text-xl text-sky-600" />
            <p className="mt-3 text-sm font-semibold text-slate-500">{text}</p>
        </div>
    );
}

function FriendColumn({ title, placeholder, children }) {
    return (
        <section className="fun-card min-h-[360px] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="fun-badge bg-emerald-50 text-xs uppercase tracking-wide text-emerald-700">{title}</h2>
            </div>
            <input
                type="search"
                className="fun-input mb-4"
                placeholder={placeholder}
            />
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function Friendspage() {
    const {
        user_suggest, officialfriends, requests, sendRequest, getSuggestions, acceptRequest,
        getRequest, rejectRequest, getofficialfriends
    } = useFriendStore();

    useEffect(() => {
        getSuggestions();
        getRequest();
        getofficialfriends();

        const interval = setInterval(() => {
            getSuggestions();
            getRequest();
            getofficialfriends();
        }, 1000);
        return () => clearInterval(interval);
    }, [getSuggestions, getofficialfriends, getRequest]);

    return (
        <div className="grid gap-5 p-4 lg:grid-cols-3">
            <FriendColumn title="Official Friends" placeholder="Search Friend">
                {officialfriends.length === 0 ? (
                    <EmptyState text="No official friends yet" />
                ) : (
                    [...officialfriends]
                        .sort((a, b) => b.mutualFriends - a.mutualFriends)
                        .map((friends) => (
                            <FriendCard
                                key={friends._id}
                                image={friends.requester?.profilepic}
                                name={friends.requester?.fullname || 'Unknown user'}
                                detail={`${friends.mutualFriends || 0} mutual friends`}
                            >
                                <button
                                    className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                    onClick={() => rejectRequest(friends._id)}
                                >
                                    Delete
                                </button>
                            </FriendCard>
                        ))
                )}
            </FriendColumn>

            <FriendColumn title="Friend Requests" placeholder="Search Requests">
                {requests.length === 0 ? (
                    <EmptyState text="No friend requests right now" />
                ) : (
                    [...requests]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((req) => (
                            <FriendCard
                                key={req._id}
                                image={req.requester?.profilepic}
                                name={req.requester?.fullname || 'Unknown user'}
                                detail={`${req.mutualFriends || 0} mutual friends`}
                            >
                                <button
                                    className="rounded-md border border-sky-500 bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-600"
                                    onClick={() => acceptRequest(req._id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    onClick={() => rejectRequest(req._id)}
                                >
                                    Reject
                                </button>
                            </FriendCard>
                        ))
                )}
            </FriendColumn>

            <FriendColumn title="People You May Know" placeholder="Search People">
                {[...user_suggest]
                    .sort((a, b) => b.mutualFriends - a.mutualFriends)
                    .map((friend) => (
                        <FriendCard
                            key={friend._id}
                            image={friend.profilepic}
                            name={friend.fullname}
                            detail={`${friend.mutualFriends || 0} mutual friends`}
                        >
                            {friend.hasPendingRequest ? (
                                <button className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700" onClick={() => sendRequest(friend._id)}>
                                    pending...
                                </button>
                            ) : (
                                <button className="rounded-md border border-sky-500 bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-600" onClick={() => sendRequest(friend._id)}>
                                    Request
                                </button>
                            )}
                        </FriendCard>
                    ))}
            </FriendColumn>
        </div>
    );
}

export default Friendspage;
