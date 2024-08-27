"use client"

import Image from 'next/image';
import DocImg from '@/public/Frame 75.svg';
import ArrowLeft from '@/public/arrow-left.svg';
import VideoIcon from '@/public/video.svg';
import Attachment from '@/public/attachment.svg';
import CameraIcon from '@/public/camera.svg';
import MicrophoneIcon from '@/public/microphone-2.svg';
import SendIcon from '@/public/send.svg';
import Link from 'next/link';
import { useState } from 'react';

function Chat() {
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
            <div className='flex mt-2 justify-between items-center'>
                <div className='flex gap-3 items-center'>
                    <Link href='/messages'>
                        <Image src={ArrowLeft} alt='back icon' />
                    </Link>
                    <div className='flex gap-2'>
                        <Image src={DocImg} alt='doctor profile image' className='w-10 h-10 rounded-full' />
                        <div className='leading-none flex flex-col justify-center'>
                            <p className='leading-none text-custom-black font-semibold text-base m-0'>Dr. Adam Hawa</p>
                            <p className='leading-none text-xs text-dark-grey m-0 p-0'>Active now!</p>
                        </div>
                    </div>
                </div>
                <Image src={VideoIcon} alt='video call' className='w-6 h-6' />
            </div>
            <div>
                <h3 className='text-center bg-doc-bg w-14 h-6 flex justify-center items-center p-2 text-sm mx-auto mt-2 rounded-lg'>Today</h3>
                <div className='ml-auto flex flex-col justify-center items-end'>
                    <p className='bg-chat-blue py-2 px-4 text-white rounded-lg rounded-br-none'>Hello! Dr. Hawa</p>
                    <p className='text-xs text-dark-grey'>04:39 AM</p>
                </div>
                <div className='flex flex-col mr-auto items-start'>
                    <p className='mb-1 bg-doc-bg py-2 px-4 text-black rounded-lg rounded-bl-none'>Hello, Tao</p>
                    <p className='mb-1 bg-doc-bg py-2 px-4 text-black rounded-lg rounded-bl-none'>How do you do today?</p>
                    <p className='text-xs text-dark-grey'>04:39AM</p>
                </div>
            </div>
            <div className='fixed bottom-0 left-0 w-full bg-white py-2 px-4 flex items-center justify-between z-10'>
                <Image src={Attachment} alt='select a file' className='mr-0' />
                <input
                    type='text'
                    value={message}
                    onChange={handleChange}
                    placeholder='Write a message'
                    className='flex-1 py-2 px-3 rounded-xl bg-doc-bg text-base mx-2 outline-0'
                />
                <div className='flex items-center'>
                    {message === '' ? (
                        <>
                            <Image src={CameraIcon} alt='send picture' className='mr-2' />
                            <Image src={MicrophoneIcon} alt='record audio' />
                        </>
                    ) : (
                        <Image src={SendIcon} alt='send message' className='w-6 h-6' />
                    )}
                </div>
            </div>
        </main>
    );
}

export default Chat;
