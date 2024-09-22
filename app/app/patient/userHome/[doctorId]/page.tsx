"use client";

import Image from 'next/image';
import DocImg from '@/public/Frame 75.svg';
import Heart from '@/public/heart.svg';
import HomeActive from '@/public/homeActive.svg';
import ScheduleInactive from '@/public/story.svg';
import MessagesInactive from '@/public/messages-inactive.svg';
import ProfileInactive from '@/public/profileInactive.svg';
import ArrowLeft from '@/public/arrow-left.svg';
import ArrowRight from '@/public/shape.svg';
import VideoIcon from '@/public/video.svg';
import ChatIcon from '@/public/messages-3.svg';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/app/components/firebase-config';
import { useParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';
import PopupWallet from '@/app/components/PopupWallet';

interface DoctorDetails {
    firstName: string;
    lastName: string;
    specialization: string;
    rating: number;
    reviewsCount: number;
    about: string;
    consultationFee: number;
    walletAddress: string;
}

function getWeekDays(startDate: Date) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push({
            day: format(date, 'EE').substring(0, 2),
            date: format(date, 'dd'),
        });
    }
    return dates;
}

function DocDetails() {
    const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [dates, setDates] = useState(getWeekDays(new Date()));
    const { doctorId } = useParams();
    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (doctorId) {
                try {
                    const doctorsRef = collection(db, 'users');
                    const q = query(doctorsRef, where("walletAddress", "==", doctorId as string));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const doctorDoc = querySnapshot.docs[0].data() as DoctorDetails;
                        setDoctorDetails(doctorDoc);
                    } else {
                        console.error('Doctor not found');
                    }
                } catch (error) {
                    console.error('Error fetching doctor details:', error);
                }
            }
        };

        fetchDoctorDetails();
    }, [doctorId]);

    const handleDateSelection = (date: string) => {
        setSelectedDate(date);
    };

    const handleTimeSelection = (time: string) => {
        setSelectedTime(time);
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time');
            return;
        }

        if (!wallet || !wallet.connected || !wallet.signTransaction) {
            alert('Please connect your wallet to proceed with the payment.');
            setShowPopup(true);
            return;
        }

        try {
            const doctorWalletAddress = doctorDetails?.walletAddress || '';
            const platformWalletAddress = 'Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42';
            const consultationFeeInSol = doctorDetails!.consultationFee;

            const platformFeeInLamports = Math.round((consultationFeeInSol * 0.1) * LAMPORTS_PER_SOL);
            const doctorFeeInLamports = Math.round((consultationFeeInSol * 0.9) * LAMPORTS_PER_SOL);


            const balance = await connection.getBalance(wallet.publicKey!);

            if (balance < consultationFeeInSol * LAMPORTS_PER_SOL) {
                alert('Insufficient balance to complete the transaction.');
                return;
            }

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey!,
                    toPubkey: new PublicKey(platformWalletAddress),
                    lamports: platformFeeInLamports,
                }),
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey!,
                    toPubkey: new PublicKey(doctorWalletAddress),
                    lamports: doctorFeeInLamports,
                })
            );

            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey!;

            const signedTransaction = await wallet.signTransaction(transaction);

            const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
                maxRetries: 3,
            });

            await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

            await saveBookingToDatabase();
            alert(`Session booked successfully! Signature: ${signature}`);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const fullDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${selectedDate}`;

    const saveBookingToDatabase = async () => {
        const bookingDetails = {
            userId: wallet.publicKey?.toString(),
            doctorId: doctorDetails?.walletAddress,
            date: fullDate,
            time: selectedTime,
            consultationFee: doctorDetails?.consultationFee,
            status: 'Booked',
        };

        try {
            await addDoc(collection(db, 'bookings'), bookingDetails);
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    };

    if (!doctorDetails) {
        return <p>Loading...</p>;
    }

    return (
        <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
            <div className='my-2 flex justify-center relative'>
                <Link href='/patient/userHome' className='absolute left-0 top-2'>
                    <Image src={ArrowLeft} alt='back icon' />
                </Link>
                <div className='flex flex-col items-center p-2'>
                    <Image src={DocImg} alt='doctor profile image' className='w-20 h-20' />
                    <h1 className='font-jakarta font-semibold text-xl'>Dr. {doctorDetails.firstName} {doctorDetails.lastName}</h1>
                    <p>{doctorDetails.specialization}</p>
                    <div className='flex gap-4'>
                        <div className='flex'>
                            <Image src={Heart} alt='heart icon' className='w-5 h-5' />
                            <p>{doctorDetails.rating}</p>
                        </div>
                        <p>{doctorDetails.reviewsCount} Review(s)</p>
                    </div>
                </div>
            </div>
            <article>
                <h2 className='font-jakarta font-semibold text-xl'>ABOUT DOCTOR</h2>
                <p className='leading-5'>Dr. {doctorDetails.firstName} {doctorDetails.lastName} {doctorDetails.about}... <span className='text-custom-blue hover-cursor'>Read more</span></p>
            </article>
            <article className='mt-2'>
                <h2 className='font-jakarta font-semibold text-xl'>SCHEDULE</h2>
                <div className='flex justify-between'>
                    {dates.map((date, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center border rounded-2xl text-sm py-2 gap-1 justify-between px-1 h-12 cursor-pointer ${
                                selectedDate === date.date ? 'bg-active-nav text-white border-none' : 'border-border-grey text-custom-grey'
                            }`}
                            onClick={() => handleDateSelection(date.date)}
                        >
                            <p className='leading-none'>{date.day}</p>
                            <p className='leading-none'>{date.date}</p>
                        </div>
                    ))}
                </div>
                <div className='mt-4 flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        {['8 AM', '9 AM', '10 AM', '11 AM'].map((time, index) => (
                            <div
                                key={index}
                                className={`flex justify-center items-center border rounded-3xl p-2 text-sm h-7 leading-none w-20 cursor-pointer ${
                                    selectedTime === time ? 'bg-active-nav text-white border-none' : 'border-dark-grey text-custom-grey'
                                }`}
                                onClick={() => handleTimeSelection(time)}
                            >
                                <p>{time}</p>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between'>
                        {['12 PM', '1 PM', '2 PM', '3 PM'].map((time, index) => (
                            <div
                                key={index}
                                className={`flex justify-center items-center border rounded-3xl p-2 text-sm h-7 leading-none w-20 cursor-pointer ${
                                    selectedTime === time ? 'bg-active-nav text-white border-none' : 'border-dark-grey text-custom-grey'
                                }`}
                                onClick={() => handleTimeSelection(time)}
                            >
                                <p>{time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
            <article className='mt-2'>
                <h2 className='font-jakarta font-semibold text-xl'>MODE OF CONSULTATION</h2>
                <div className='flex gap-3 justify-center mt-2'>
                    <div className='flex border border-custom-blue text-custom-blue items-center w-32 h-9 rounded-2xl justify-center gap-1'>
                        <p>Video</p>
                        <Image src={VideoIcon} alt='video icon' />
                    </div>
                    <div className='flex border border-custom-blue text-custom-blue items-center w-32 h-9 rounded-2xl justify-center gap-1'>
                        <p>Chat</p>
                        <Image src={ChatIcon} alt='chat icon' />
                    </div>
                </div>
            </article>
            <article className='mt-6 pb-16'>
                <h2 className='font-jakarta font-medium text-lg'>CONSULTATION FEE: {doctorDetails.consultationFee} Sol</h2>
                <button
                    onClick={handleBooking}
                    className='mt-2 w-full h-14 flex gap-2 text-xl font-medium outline-none bg-schedule-col rounded-lg justify-center items-center text-white'
                >
                    Book Consultation
                    <Image src={ArrowRight} alt='Arrow Right' />
                </button>
            </article>
            <footer className='flex items-center h-14 shadow-3xl w-screen m-0 absolute right-0 left-0 bottom-0 bg-white'>
                <nav className='w-full flex gap-14 justify-evenly items-center py-4 px-14'>
                    <Link href='/patient/userHome'>
                        <Image src={HomeActive} alt='home icon' />
                    </Link>
                    <Link href='/patient/schedule'>
                        <Image src={ScheduleInactive} alt='Schedule icon' />
                    </Link>
                    <Link href='/patient/messages'>
                        <Image src={MessagesInactive} alt='Messages icon' />
                    </Link>
                    <Link href='/patient/userProfile'>
                        <Image src={ProfileInactive} alt='Profile icon' />
                    </Link>
                </nav>
            </footer>
            {showPopup && <PopupWallet onClose={() => setShowPopup(false)} />}
        </main>
    );
}

export default DocDetails;
