"use client"

import Image from 'next/image';
import UserDp from '@/public/userdp.svg';
import SearchIcon from '@/public/search.svg';
import DocImg from '@/public/Frame 75.svg';
import Heart from '@/public/heart.svg';
import VidIcon from '@/public/Frame 55.svg';
import ChatIcon from '@/public/Frame 56.svg';
import DateIcon from '@/public/story.svg';
import TimeIcon from '@/public/clock.svg';
import HomeInactive from '@/public/homeInactive.svg';
import ScheduleInactive from '@/public/story.svg';
import MessagesInactive from '@/public/messages-inactive.svg';
import ProfileActive from '@/public/profileActive.svg';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


function Home() {
    return (
        <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col">
            <div>
                <div>
                    <Image
                        src={UserDp}
                        alt="Profile Picture"
                        className="rounded-full border"
                    />
                    <h1>Profile</h1>
                </div>
                <div>
                    <div>
                        <Image
                            src={UserDp}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className="rounded-full border"
                        />
                        <p>$100</p>
                        <button>Edit Profile</button>
                    </div>
                </div>
            </div>
            <footer className='w-full sm:max-w-lg sm:mx-auto fixed bottom-0 left-0 right-0 shadow-3xl bg-white'>
                <nav className='w-full flex gap-14 justify-evenly items-center py-4 px-14'>
                    <Link href='/patient/userHome'>
                        <Image src={HomeInactive} alt='home icon' />
                    </Link>
                    <Link href='/patient/schedule'>
                        <Image src={ScheduleInactive} alt='Schedule icon' />
                    </Link>
                    <Link href='/patient/messages'>
                        <Image src={MessagesInactive} alt='Messages icon' />
                    </Link>
                    <Link href='/patient/userProfile'>
                        <Image src={ProfileActive} alt='Profile icon' />
                    </Link>
                </nav>
            </footer>
        </main>
    );
}

export default Home;