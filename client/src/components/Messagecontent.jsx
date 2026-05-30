import React, { useRef, useEffect, useState, memo, useCallback, useMemo } from 'react';
import { userchartstore } from '../store/userchartstore';
import avatar from '../pic/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClose, 
    faExclamationTriangle, 
    faImage, 
    faPaperPlane, 
    faSpinner, 
    faCircle 
} from '@fortawesome/free-solid-svg-icons';
import Nomesage from './nomesage';

/**
 * Memoized Message Component
 * Prevents re-rendering existing messages when new ones are added.
 */
const MessageBubble = memo(({ message, isIncoming, onImageLoad }) => {
    const time = useMemo(() => {
        return message.createdAt 
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : 'Just now';
    }, [message.createdAt]);
    
    return (
        <div className={`group flex flex-col ${isIncoming ? 'items-start' : 'items-end'} mb-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200`}>
            <div className={`relative max-w-[80%] sm:max-w-[65%] overflow-hidden shadow-sm ring-1 ring-black/5 ${
                isIncoming 
                ? 'rounded-2xl rounded-tl-none bg-white text-slate-800' 
                : 'rounded-2xl rounded-tr-none bg-sky-600 text-white'
            }`}>
                {message.images && (
                    <img 
                        src={message.images} 
                        onLoad={onImageLoad}
                        className="max-h-80 w-full object-cover"
                        alt="Sent attachment"
                    />
                )}
                <div className="px-3.5 py-2">
                        {message.text && (
                            <p className="whitespace-pre-wrap break-words text-[14.5px] leading-relaxed font-medium">
                                {message.text}
                            </p>
                        )}
                    <div className={`mt-1 flex items-center justify-end ${isIncoming ? 'text-slate-400' : 'text-sky-100/80'}`}>
                        <span className="text-[10px] font-bold tracking-tight">{time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * Optimized Chat Input
 * Local state prevents the entire message list from re-rendering while typing.
 */
const ChatInput = memo(({ onSend, disabled, onTypingStatusChange }) => {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !preview) return;
        
        const success = await onSend(text, preview);
        if (success) {
            setText('');
            setPreview(null);
            if (typingTimeoutRef.current && typeof onTypingStatusChange === 'function') {
                clearTimeout(typingTimeoutRef.current);
                onTypingStatusChange(false);
            }
        }
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
        if (typeof onTypingStatusChange === 'function') {
            onTypingStatusChange(true);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (typeof onTypingStatusChange === 'function') {
                onTypingStatusChange(false);
            }
        }, 2000);
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
            {preview && (
                <div className="mb-3 relative inline-block">
                    <img src={preview} className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" alt="Upload preview" />
                    <button 
                        onClick={clearImage}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-rose-500"
                    >
                        <FontAwesomeIcon icon={faClose} className="text-xs" />
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-50 transition-all">
                    <label className="cursor-pointer p-2 text-slate-400 hover:text-sky-500 transition-colors">
                        <FontAwesomeIcon icon={faImage} />
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImage} />
                    </label>
                    <textarea
                        rows="1"
                        value={text}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={disabled || (!text.trim() && !preview)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md transition-all hover:bg-sky-600 active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    <FontAwesomeIcon icon={disabled ? faSpinner : faPaperPlane} spin={disabled} />
                </button>
            </form>
        </div>
    );
});

const Messagecontent = () => {
    const {
        messages, selecteduser, getmessage, sendmessage, 
        fetchstatusmessage, listenForMessages, isConnected, connectionError,
        typingUser, sendTypingStatus, listenForTyping // Consuming new store actions
    } = userchartstore();

    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef(null);
    const lastMessageRef = useRef(null);

    // Optimized Scroll Logic
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior, block: 'end' });
        }
    }, []);

    const handleSend = useCallback(async (text, image) => {
        setIsSending(true);
        try {
            await sendmessage(selecteduser?._id, text, image);
            return true;
        } catch (err) {
            return false;
        } finally {
            setIsSending(false);
        }
    }, [selecteduser?._id, sendmessage]);

    useEffect(() => {
        if (!selecteduser?._id) return;
        getmessage();
        fetchstatusmessage();
        const cleanupMessages = typeof listenForMessages === 'function' ? listenForMessages() : null;
        const cleanupTyping = typeof listenForTyping === 'function' ? listenForTyping() : null;
        return () => {
            cleanupMessages && cleanupMessages();
            cleanupTyping && cleanupTyping();
        };
    }, [selecteduser?._id, getmessage, fetchstatusmessage, listenForMessages, listenForTyping]);

    // Handle auto-scroll when messages change
    useEffect(() => {
        const timer = setTimeout(() => scrollToBottom(messages.length <= 15 ? 'auto' : 'smooth'), 50);
        return () => clearTimeout(timer);
    }, [messages.length, scrollToBottom]);

    if (!selecteduser) return null;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-50" src={selecteduser.profilepic || avatar} alt="" />
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">{selecteduser.fullname}</h2>
                        <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">Active Now</p>
                    </div>
                </div>
            </div>

            {/* Connection Status Banner */}
            {!isConnected && (
                <div className="flex items-center justify-center gap-2 bg-amber-50 py-2 text-[10px] font-bold text-amber-700 transition-all">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="animate-pulse" />
                    {connectionError ? `OFFLINE: ${connectionError}` : 'CONNECTING TO SERVER...'}
                </div>
            )}

            {/* Message List Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <Nomesage />
                ) : (
                    messages.map((m, i) => (
                        <MessageBubble 
                            key={m._id || `msg-${i}`} 
                            message={m} 
                            isIncoming={m.senderId === selecteduser._id}
                            onImageLoad={() => scrollToBottom('smooth')}
                        />
                    ))
                )}

                {typingUser === selecteduser?._id && (
                    <div className="flex items-center gap-2 text-slate-400 animate-pulse pb-2">
                        <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                        </div>
                        <span className="text-[10px] font-bold uppercase italic tracking-widest">{selecteduser.fullname} is typing...</span>
                    </div>
                )}
                <div ref={lastMessageRef} className="h-px w-full" />
            </div>

            {/* Chat Input Component */}
            <ChatInput onSend={handleSend} disabled={isSending} onTypingStatusChange={sendTypingStatus} />
        </div>
    );
};

export default Messagecontent;
