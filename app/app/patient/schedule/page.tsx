import Image from 'next/image';
import DocImg from '@/public/Frame 75.svg';
import DateIcon from '@/public/story.svg';
import TimeIcon from '@/public/clock.svg';
import HomeInactive from '@/public/homeInactive.svg';
import ScheduleActive from '@/public/storyActive.svg';
import MessagesInactive from '@/public/messages-inactive.svg';
import ProfileInactive from '@/public/profileInactive.svg';
import ArrowLeft from '@/public/arrow-left.svg';
import Add from '@/public/add.svg';
import Link from 'next/link';

function Schedule() {
    return (
        <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
            <div className='mt-2 flex justify-between w-full'>
                <div className='flex gap-3 items-center'>
                    <Link href='/userHome'>
                        <Image src={ArrowLeft} alt='back icon' />
                    </Link>
                    <h1 className='font-jakarta font-semibold text-xl'>Schedule</h1>
                </div>
                <Image src={Add} alt='add icon' />
            </div>
            <ul className='flex w-full justify-between my-2 h-11 items-center bg-custom-schedule rounded-full py-1 px-4'>
                <li className='py-1 px-3 bg-active-nav rounded-xl leading-none text-white'>Upcoming</li>
                <li>Completed</li>
                <li>Cancelled</li>
            </ul>
            <div className='pb-14'>
                <div className='w-full bg-custom-schedule rounded-xl p-3 mb-2'>
                    <div className='flex gap-2'>
                        <Image src={DocImg} alt='doctor profile image' className='w-10 h-10' />
                        <div className='leading-none'>
                            <p className='text-custom-black font-semibold text-base m-0'>Dr. Sarafa Abbas</p>
                            <p className='leading-none text-sm m-0 p-0'>Neurosurgeon</p>
                        </div>
                    </div>
                    <div className='text-black text-xs flex justify-between items-center bg-schedule-col-inner mt-2 p-4 rounded-xl'>
                        <div className='flex items-center gap-1'>
                            <Image src={DateIcon} alt='calendar icon' />
                            <p>Sunday, April 19</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Image src={TimeIcon} alt='clock icon' />
                            <p>8:00 AM - 9:00 AM</p>
                        </div>
                    </div>
                    <div className='w-full mt-2 flex justify-between h-10'>
                        <button className='bg-none border-custom-blue border text-custom-blue h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Cancel</button>
                        <button className='bg-schedule-col text-white h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Reschedule</button>
                    </div>
                </div>
                <div className='w-full bg-custom-schedule rounded-xl p-3 mb-2'>
                    <div className='flex gap-2'>
                        <Image src={DocImg} alt='doctor profile image' className='w-10 h-10' />
                        <div className='leading-none'>
                            <p className='text-custom-black font-semibold text-base m-0'>Dr. Sarafa Abbas</p>
                            <p className='leading-none text-sm m-0 p-0'>Neurosurgeon</p>
                        </div>
                    </div>
                    <div className='text-black text-xs flex justify-between items-center bg-schedule-col-inner mt-2 p-4 rounded-xl'>
                        <div className='flex items-center gap-1'>
                            <Image src={DateIcon} alt='calendar icon' />
                            <p>Sunday, April 19</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Image src={TimeIcon} alt='clock icon' />
                            <p>8:00 AM - 9:00 AM</p>
                        </div>
                    </div>
                    <div className='w-full mt-2 flex justify-between h-10'>
                        <button className='bg-none border-custom-blue border text-custom-blue h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Cancel</button>
                        <button className='bg-schedule-col text-white h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Reschedule</button>
                    </div>
                </div>
                <div className='w-full bg-custom-schedule rounded-xl p-3 mb-2'>
                    <div className='flex gap-2'>
                        <Image src={DocImg} alt='doctor profile image' className='w-10 h-10' />
                        <div className='leading-none'>
                            <p className='text-custom-black font-semibold text-base m-0'>Dr. Sarafa Abbas</p>
                            <p className='leading-none text-sm m-0 p-0'>Neurosurgeon</p>
                        </div>
                    </div>
                    <div className='text-black text-xs flex justify-between items-center bg-schedule-col-inner mt-2 p-4 rounded-xl'>
                        <div className='flex items-center gap-1'>
                            <Image src={DateIcon} alt='calendar icon' />
                            <p>Sunday, April 19</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Image src={TimeIcon} alt='clock icon' />
                            <p>8:00 AM - 9:00 AM</p>
                        </div>
                    </div>
                    <div className='w-full mt-2 flex justify-between h-10'>
                        <button className='bg-none border-custom-blue border text-custom-blue h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Cancel</button>
                        <button className='bg-schedule-col text-white h-full p-3 rounded-2xl flex items-center w-36 justify-center'>Reschedule</button>
                    </div>
                </div>
            </div>
            <footer className='flex items-center h-14 shadow-3xl w-screen m-0 absolute right-0 left-0 bottom-0 bg-white'>
                <nav className='w-full flex gap-14 justify-evenly items-center py-4 px-14'>
                    <Link href='/patient/userHome'>
                        <Image src={HomeInactive} alt='home icon' />
                    </Link>
                    <Link href='/patient/schedule'>
                        <Image src={ScheduleActive} alt='Schedule icon' />
                    </Link>
                    <Link href='/patient/messages'>
                        <Image src={MessagesInactive} alt='Messages icon' />
                    </Link>
                    <Link href='/patient/userProfile'>
                        <Image src={ProfileInactive} alt='Profile icon' />
                    </Link>
                </nav>
            </footer>
        </main>
    )
}

export default Schedule;