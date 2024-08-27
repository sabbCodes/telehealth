"use client";

import Image from 'next/image';
import DocImg from '@/public/Frame 75.svg';
import ArrowLeft from '@/public/arrow-left.svg';
import VideoIcon from '@/public/video.svg';
import Attachment from '@/public/attachment.svg';
import CameraIcon from '@/public/camera.svg';
import MicrophoneIcon from '@/public/microphone-2.svg';
import SendIcon from '@/public/send.svg';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/components/firebase-config';
import PatientDetailsPopup from '@/app/components/PatientDetailsPopup';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor';
import idl from '@/app/components/libs/tele_health.json';
import type { TeleHealth } from '@/app/components/libs/tele_health';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';

interface PatientDetails {
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    allergies: string;
    medicalHistory: string;
    walletAddress: string;
}

interface MedicalRecord {
    doctorId: string;
    signsAndSymptoms: string;
    diagnosis: string;
    prescription: string;
    timestamp: number;
}

interface RecordDetailsEntry {
    doctor: PublicKey;
    patient_id: string;
    timestamp: number;
    signs_n_symptoms: string;
    diagnosis: string;
    prescription: string;
}

function useAnchorProvider() {
    const { connection } = useConnection();
    const wallet = useWallet();

    return new AnchorProvider(connection, wallet as any, {
        commitment: 'confirmed',
    });
}

function getRecordsProgram(provider: AnchorProvider): Program<TeleHealth> {
    return new Program(idl as unknown as TeleHealth, provider);
}

function Chat() {
    const wallet = useWallet();
    const provider = useAnchorProvider();
    const program = getRecordsProgram(provider);

    const { chatId } = useParams();
    const [message, setMessage] = useState('');
    const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const [signsAndSymptoms, setSignsAndSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            if (chatId) {
                try {
                    const doctorsRef = collection(db, 'users');
                    const q = query(doctorsRef, where("walletAddress", "==", chatId as string));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const patientDoc = querySnapshot.docs[0].data() as PatientDetails;
                        setPatientDetails(patientDoc);
                    } else {
                        console.error('Patient not found');
                    }
                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
            }
        };

        fetchPatientDetails();
    }, [chatId]);

    const recordsQuery = useQuery({
        queryKey: ['recordDetailsEntry', patientDetails?.walletAddress],
        queryFn: async () => {
            if (!patientDetails) throw new Error('No patient details available');

            const patientPublicKey = new PublicKey(patientDetails.walletAddress);

            const allRecords = await program.account.recordDetailsEntry.all();

            const filteredRecords = allRecords.filter(record =>
                record.account.patientId === patientPublicKey.toBase58()
            );

            return filteredRecords;
        },
        enabled: !!patientDetails,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleProfileClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleFetchRecords = async (): Promise<MedicalRecord[] | null> => {
        if (recordsQuery.isSuccess) {
            return recordsQuery.data.map(record => ({
                doctorId: record.account.doctor.toBase58(),
                signsAndSymptoms: record.account.signsNSymptoms,
                diagnosis: record.account.diagnosis,
                prescription: record.account.prescription,
                timestamp: record.account.timestamp.toNumber(),
            }));
        } else if (recordsQuery.isError) {
            console.error('Error fetching records:', recordsQuery.error);
            return null;
        }
        return null;
    };

    const createEntry = useMutation({
        mutationFn: async () => {
            if (!wallet.publicKey || !patientDetails?.walletAddress) {
                throw new Error('Missing wallet or patient details.');
            }

            const record = web3.Keypair.generate();

            await program.methods
                .enterHealthRecord(
                    patientDetails.walletAddress,
                    signsAndSymptoms,
                    diagnosis,
                    prescription
                )
                .accounts({
                    recordEntry: record.publicKey,
                    doctor: wallet.publicKey,
                    // systemProgram: web3.SystemProgram.programId,
                })
                .signers([record])
                .rpc();
        },
        onSuccess: (signature) => {
            toast.success('Record updated successfully');
            recordsQuery.refetch();
            setShowPopup(false);
            setSignsAndSymptoms('');
            setDiagnosis('');
            setPrescription('');
            setMessage('');
        },
        onError: (error) => {
            toast.error(`Failed to update record: ${error.message}`);
        },
    });

    const handleUpdateRecords = () => {
        createEntry.mutate();
    }

    return (
        <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
            <div className='flex mt-2 justify-between items-center'>
                <div className='flex gap-3 items-center'>
                    <Link href='/doctor/messages'>
                        <Image src={ArrowLeft} alt='back icon' />
                    </Link>
                    <div className='flex gap-2 cursor-pointer' onClick={handleProfileClick}>
                        <Image src={DocImg} alt='doctor profile image' className='w-10 h-10 rounded-full' />
                        <div className='leading-none flex flex-col justify-center'>
                            <p className='leading-none text-custom-black font-semibold text-base m-0'>{patientDetails?.firstName} {patientDetails?.lastName}</p>
                            <p className='leading-none text-xs text-dark-grey m-0 p-0'>Active now!</p>
                        </div>
                    </div>
                </div>
                <Image src={VideoIcon} alt='video call' className='w-6 h-6' />
            </div>
            {showPopup && (
                <PatientDetailsPopup
                    patientDetails={patientDetails}
                    onClose={handleClosePopup}
                    onFetchRecords={handleFetchRecords}
                    onUpdateRecords={handleUpdateRecords}
                    signsAndSymptoms={signsAndSymptoms}
                    setSignsAndSymptoms={setSignsAndSymptoms}
                    diagnosis={diagnosis}
                    setDiagnosis={setDiagnosis}
                    prescription={prescription}
                    setPrescription={setPrescription}
                    handleUpdateRecords={handleUpdateRecords}
                    loading={loading}
                />
            )}
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
            <ToastContainer />
        </main>
    );
}

export default Chat;
