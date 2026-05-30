import React, { useRef, useEffect, useState, memo } from 'react';
import { userchartstore } from '../store/userchartstore';
import avatar from '../pic/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faExclamationTriangle, faImage, faMicrophone, faPaperclip, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Nomesage from './nomesage';

/**
 * Memoized individual message item to prevent unnecessary re-renders of the entire list
 * when a new message is received.
 */
const MessageItem = memo(({ mess, isIncoming, onImageLoad }) => {
    const time = mess.createdAt ? new Date(mess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
    
    return (
        <div className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}>
            <div className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-2.5 shadow-sm transition-all duration-200 ${
                isIncoming 
                ? 'rounded-2xl rounded-tl-none bg-white text-slate-700 border border-slate-100' 
                : 'rounded-2xl rounded-tr-none bg-sky-600 text-white'
            }`}>
                {mess.images && (
                    <div className="mb-2 overflow-hidden rounded-lg">
                        <img 
                            className="max-h-80 w-full object-cover transition-transform duration-300 hover:scale-[1.03]" 
                            src={mess.images} 
                            onLoad={onImageLoad}
                            alt="attachment" 
                        />
                    </div>
                )}
                {mess.text && (
                    <p className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">
                        {mess.text}
                    </p>
                )}
                <div className={`mt-1.5 flex items-center gap-1.5 ${isIncoming ? 'text-slate-400' : 'text-sky-100'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{time}</span>
                </div>
            </div>
        </div>
    );
});

/**
 * Isolated Input component to prevent parent re-renders on every keystroke.
 */
const MessageInput = ({ onSendMessage, isUploading }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return alert('Please choose a valid image.');
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !image) return;
        await onSendMessage(text, image);
        setText('');
        setImage(null);
    };

    return (
        <>
            {image && (
                <div className="relative border-t border-slate-100 bg-white p-3">
                    <img src={image} className="h-24 w-24 rounded-lg object-cover shadow-sm" alt="preview" />
                    <button onClick={() => setImage(null)} className="absolute left-24 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white transition hover:bg-rose-600">
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
                <div className="flex items-center gap-3 text-slate-400 px-1">
                    <label className="cursor-pointer transition hover:text-sky-600" htmlFor="input-image">
                        <FontAwesomeIcon icon={faImage} />
                        <input className="hidden" type="file" id="input-image" onChange={handleFileChange} />
                    </label>
                    <FontAwesomeIcon className="cursor-pointer transition hover:text-slate-600" icon={faPaperclip} />
                </div>
                <input
                    className="h-10 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    type="text"
                    value={text}
                    placeholder="Write a message..."
                    onChange={e => setText(e.target.value)}
                />
                <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition hover:scale-105 hover:bg-sky-600 disabled:opacity-50" disabled={isUploading}>
                    <FontAwesomeIcon icon={isUploading ? faSpinner : faPaperPlane} spin={isUploading} />
                </button>
            </form>
        </>
    );
};

const Messagecontent = () => {
    const {
        messages, selecteduser,
        getmessage, sendmessage, fetchstatusmessage, listenForMessages,
        isConnected, connectionError // Assuming these exist in your store
    } = userchartstore();

    const [isUploading, setIsUploading] = useState(false);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlesendmessage = async (text, image) => {
        setIsUploading(true);
        try { await sendmessage(selecteduser._id, text, image); }
        catch (error) { console.error(error); }
        finally { setIsUploading(false); }
    };

    useEffect(() => {
        if (selecteduser?._id) {
            getmessage();
        }
    }, [selecteduser?._id, getmessage]);

    useEffect(() => {
        fetchstatusmessage();
    }, [selecteduser, fetchstatusmessage]);

    useEffect(() => {
        return listenForMessages();
    }, [listenForMessages, selecteduser?._id]); // Re-subscribe if selected user changes

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fun-card flex min-h-0 flex-col overflow-hidden bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-emerald-50 px-4 py-3">
                <img className="h-10 w-10 rounded-full border border-slate-200 object-cover" src={selecteduser.profilepic || avatar} alt="avatar" />
                <div>
                    <span className="block text-sm font-bold text-slate-900">{selecteduser.fullname}</span>
                    <small className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> online</small>
                </div>
            </div>

            {!isConnected && (
                <div className="flex items-center justify-center gap-2 bg-amber-100 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {connectionError ? `Connection Error: ${connectionError}` : 'Reconnecting to chat...'}
                </div>
            )}

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
                {messages.length === 0 ? <Nomesage /> :
                    messages.map((mess, index) => {
                        return (
                            <MessageItem 
                                key={mess._id || `temp-${index}`} 
                                mess={mess} 
                                isIncoming={selecteduser._id === mess.senderId}
                                onImageLoad={scrollToBottom}
                            />
                        );
                    })}
                <div ref={messageEndRef} />
            </div>

            <MessageInput onSendMessage={handlesendmessage} isUploading={isUploading} />
        </div>
    );
};

export default Messagecontent;
