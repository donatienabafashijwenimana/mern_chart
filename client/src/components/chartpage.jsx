import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { userchartstore } from '../store/userchartstore';
import { userauthstore } from '../store/useauthstore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faImage, faPaperPlane, faSpinner, faSearch, 
    faExclamationTriangle, faCircle, faClose, faChevronLeft 
} from '@fortawesome/free-solid-svg-icons';
import avatar from '../pic/avatar.png';
import Noselecteduser from './noselecteduser';
import Nomesage from './nomesage';

/**
 * Memoized individual message bubble.
 */
const MessageBubble = memo(({ m, isIncoming, onImageLoad }) => {
    const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
    return (
        <div className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'} mb-3 animate-in fade-in slide-in-from-bottom-1 duration-200`}>
            <div className={`relative max-w-[85%] sm:max-w-[70%] overflow-hidden shadow-sm ring-1 ring-black/5 ${
                isIncoming ? 'rounded-2xl rounded-tl-none bg-white text-slate-800' : 'rounded-2xl rounded-tr-none bg-sky-600 text-white'
            }`}>
                {m.images && <img src={m.images} onLoad={onImageLoad} className="max-h-72 w-full object-cover" alt="" />}
                <div className="px-3.5 py-2">
                    {m.text && <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap break-words">{m.text}</p>}
                    <div className={`mt-1 flex items-center justify-end ${isIncoming ? 'text-slate-400' : 'text-sky-100/80'}`}>
                        <span className="text-[9px] font-bold tracking-tighter uppercase">{time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * Modern Message Manager Page
 */
const Chartpage = () => {
    const { authuser } = userauthstore();
    const { 
        getusers, users, selecteduser, setselecteduser, lastmessages, 
        getlastmessage, number_messagetoeachuser, statusmessagetoeachuser,
        messages, getmessage, sendmessage, fetchstatusmessage, listenForMessages,
        isConnected, connectionError, typingUser, sendTypingStatus, listenForTyping
    } = userchartstore();

    const [search, setSearch] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // 1. Lifecycle: Initialize Data & Listeners
    useEffect(() => {
        getusers();
    }, [getusers]);

    useEffect(() => {
        if (users.length > 0) {
            users.forEach(u => {
                if (u._id !== authuser?._id) {
                    getlastmessage(u._id);
                    statusmessagetoeachuser(u._id);
                }
            });
        }
    }, [users, authuser?._id, getlastmessage, statusmessagetoeachuser]);

    useEffect(() => {
        if (!selecteduser?._id) return;
        getmessage();
        fetchstatusmessage();
        
        const cleanupMessages = typeof listenForMessages === 'function' ? listenForMessages() : null;
        const cleanupTyping = typeof listenForTyping === 'function' ? listenForTyping() : null;
        
        return () => {
            cleanupMessages?.();
            cleanupTyping?.();
        };
    }, [selecteduser?._id, getmessage, fetchstatusmessage, listenForMessages, listenForTyping]);

    // 2. Logic: Filtering and Sorting Contacts
    const conversationList = useMemo(() => {
        return users
            .filter(u => u._id !== authuser?._id)
            .filter(u => u.fullname.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const timeA = lastmessages[a._id]?.createdAt || 0;
                const timeB = lastmessages[b._id]?.createdAt || 0;
                return new Date(timeB) - new Date(timeA);
            });
    }, [users, authuser?._id, search, lastmessages]);

    // 3. Logic: Scrolling
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        messageEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => scrollToBottom(messages.length < 20 ? 'auto' : 'smooth'), 50);
            return () => clearTimeout(timer);
        }
    }, [messages.length, scrollToBottom]);

    // 4. Logic: Input Handlers
    const handleInputChange = (e) => {
        setText(e.target.value);
        if (typeof sendTypingStatus === 'function') sendTypingStatus(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (typeof sendTypingStatus === 'function') sendTypingStatus(false);
        }, 2000);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        setIsSending(true);
        try {
            await sendmessage(selecteduser._id, text, imagePreview);
            setText("");
            setImagePreview(null);
            if (typeof sendTypingStatus === 'function') sendTypingStatus(false);
        } finally {
            setIsSending(false);
        }
    };

    if (!authuser) return null;

    return (
        <div className="grid h-[calc(100vh-132px)] grid-cols-1 gap-4 pr-4 py-4 lg:grid-cols-[340px_minmax(0,1fr)] overflow-hidden">
            {/* SIDEBAR: Conversation Manager */}
            <aside className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all ${selecteduser ? 'hidden lg:flex' : 'flex'}`}>
                <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                    <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
                    <div className="relative mt-3">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="h-9 w-full rounded-xl border-none bg-slate-200/50 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-sky-500/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversationList.map(user => {
                        const lastMsg = lastmessages[user._id];
                        const isSelected = selecteduser?._id === user._id;
                        return (
                            <button 
                                key={user._id}
                                onClick={() => setselecteduser(user)}
                                className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all duration-200 ${isSelected ? 'bg-sky-50 ring-1 ring-sky-200' : 'hover:bg-slate-50'}`}
                            >
                                <div className="relative shrink-0">
                                    <img src={user.profilepic || avatar} className="h-11 w-11 rounded-full border border-slate-200 object-cover" alt="" />
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="truncate text-sm font-bold text-slate-900">{user.fullname}</span>
                                        {lastMsg?.createdAt && <span className="text-[10px] text-slate-400">{new Date(lastMsg.createdAt).toLocaleDateString()}</span>}
                                    </div>
                                    <p className={`truncate text-xs ${isSelected ? 'text-sky-700 font-medium' : 'text-slate-500'}`}>
                                        {lastMsg?.images && <FontAwesomeIcon icon={faImage} className="mr-1 opacity-70" />}
                                        {lastMsg?.images ? 'Image' : lastMsg?.text || 'No messages yet'}
                                    </p>
                                </div>
                                {number_messagetoeachuser?.[user._id] > 0 && (
                                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                        {number_messagetoeachuser[user._id]}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* CONTENT: Chat Area */}
            <main className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft ${!selecteduser ? 'hidden lg:flex' : 'flex'}`}>
                {!selecteduser ? <Noselecteduser /> : (
                    <>
                        {/* Header */}
                        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setselecteduser(null)} className="lg:hidden h-8 w-8 text-slate-400 hover:text-slate-900">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <div className="relative">
                                    <img src={selecteduser.profilepic || avatar} className="h-10 w-10 rounded-full border border-slate-200 object-cover" alt="" />
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{selecteduser.fullname}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Active Now</span>
                                </div>
                            </div>
                        </header>

                        

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6">
                            {messages.length === 0 ? <Nomesage /> : (
                                messages.map((m, i) => (
                                    <MessageBubble 
                                        key={m._id || `msg-${i}`} 
                                        m={m} 
                                        isIncoming={m.senderId === selecteduser._id} 
                                        onImageLoad={() => scrollToBottom()}
                                    />
                                ))
                            )}

                            {typingUser === selecteduser?._id && (
                                <div className="flex items-center gap-2 text-slate-400 pb-2">
                                    <div className="flex gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest italic">{selecteduser.fullname} is typing...</span>
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
                            {imagePreview && (
                                <div className="mb-3 relative inline-block">
                                    <img src={imagePreview} className="h-20 w-20 rounded-xl object-cover ring-2 ring-slate-100 shadow-md" alt="" />
                                    <button 
                                        onClick={() => setImagePreview(null)}
                                        className="absolute -right-2 -top-2 h-6 w-6 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faClose} className="text-xs" />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSend} className="flex items-center gap-3">
                                <label className="cursor-pointer text-slate-400 hover:text-sky-600 transition-colors p-2">
                                    <FontAwesomeIcon icon={faImage} size="lg" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const reader = new FileReader();
                                            reader.onload = () => setImagePreview(reader.result);
                                            if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
                                        }} 
                                    />
                                </label>
                                <input 
                                    type="text"
                                    value={text}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className="flex-1 h-11 bg-slate-100 rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-sky-500/10 focus:bg-white transition-all"
                                />
                                <button 
                                    type="submit" 
                                    disabled={isSending || (!text.trim() && !imagePreview)}
                                    className="h-11 w-11 flex items-center justify-center bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-100 transition-all hover:bg-sky-700 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    <FontAwesomeIcon icon={isSending ? faSpinner : faPaperPlane} spin={isSending} />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Chartpage;
