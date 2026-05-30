import React, { useRef, useEffect, useState } from 'react';
import { userchartstore } from '../store/userchartstore';
import avatar from '../pic/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faImage, faMicrophone, faPaperclip, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Nomesage from './nomesage';

const Messagecontent = () => {
    const {
        messages, selecteduser,
        getmessage, sendmessage, fetchstatusmessage, listenForMessages
    } = userchartstore();

    const [messagetext, setmessagetext] = useState('');
    const [image, setimage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const messageEndRef = useRef(null);
    const messageContainerRef = useRef(null);

    const handlesendmessage = async (e) => {
        e.preventDefault();
        if ((messagetext && messagetext.length > 0) || image) {
            setIsUploading(true);
            try {
                await sendmessage(selecteduser._id, messagetext, image);
                setmessagetext('');
                setimage(null);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsUploading(false);
            }
        }
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
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleimagechange = async (e) => {
        const Image = e.target.files[0];
        if (!Image || !Image.type.startsWith('image/')) {
            alert('Please choose a valid image.');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(Image);
        reader.onload = () => {
            setimage(reader.result);
        };
    };

    const removeimagesend = () => {
        setimage(null);
    };

    return (
        <div className="fun-card flex min-h-0 flex-col overflow-hidden bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-emerald-50 px-4 py-3">
                <img className="h-10 w-10 rounded-full border border-slate-200 object-cover" src={selecteduser.profilepic || avatar} alt="avatar" />
                <div>
                    <span className="block text-sm font-bold text-slate-900">{selecteduser.fullname}</span>
                    <small className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> online</small>
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6" ref={messageContainerRef}>
                {messages.length === 0 ? <Nomesage /> :
                    messages.map((mess, index) => {
                        const isIncoming = selecteduser._id === mess.senderId;
                        const time = mess.createdAt ? new Date(mess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

                        return (
                            <div key={mess._id || index} className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}>
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
                    })}
                <div ref={messageEndRef} />
            </div>

            {image && (
                <div className="relative border-t border-slate-100 bg-white p-3">
                    <img src={image} className="h-24 w-24 rounded-lg object-cover" alt="preview" />
                    <FontAwesomeIcon icon={faClose} className="absolute left-24 top-2 h-4 w-4 cursor-pointer rounded-full bg-slate-900 p-1 text-white" onClick={removeimagesend} />
                </div>
            )}

            <form onSubmit={handlesendmessage} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-lg">☺</span>
                    <FontAwesomeIcon className="cursor-pointer transition hover:text-blue-600" icon={faPaperclip} />
                    <label className="cursor-pointer transition hover:text-blue-600" htmlFor="input-image">
                        <FontAwesomeIcon icon={faImage} />
                        <input className="hidden" type="file" id="input-image" onChange={handleimagechange} />
                    </label>
                    <FontAwesomeIcon className="cursor-pointer transition hover:text-blue-600" icon={faMicrophone} />
                </div>
                <input
                    className="h-10 min-w-0 flex-1 rounded-full border border-slate-300 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-sky-50 focus:ring-2 focus:ring-sky-100"
                    type="text"
                    id="message-input"
                    value={messagetext}
                    placeholder="Type Message...."
                    onChange={e => setmessagetext(e.target.value)}
                />
                <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-600 disabled:opacity-70" disabled={isUploading}>
                    {isUploading ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="send-icon" />
                    ) : (
                        <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
                    )}
                </button>
            </form>
        </div>
    );
};

export default Messagecontent;
