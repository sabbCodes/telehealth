"use client";

import Image from "next/image";
import DocImg from "@/public/Frame 75.svg";
import ArrowLeft from "@/public/arrow-left.svg";
import VideoIcon from "@/public/video.svg";
import Attachment from "@/public/attachment.svg";
import CameraIcon from "@/public/camera.svg";
import MicrophoneIcon from "@/public/microphone-2.svg";
import SendIcon from "@/public/send.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { database, db } from "@/app/components/utils/firebase-config";
import PatientDetailsPopup from "@/app/components/PatientDetailsPopup";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import idl from "@/app/components/utils/tele_health.json";
import type { TeleHealth } from "@/app/components/utils/tele_health";
import { useWallet, useConnection, AnchorWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, push, onValue, off } from "firebase/database";
import PopupWallet from "@/app/components/PopupWallet";
import { useRouter } from "next/navigation";
import { uploadFile, downloadFile, listFiles } from "@/app/components/utils/akave-api";
import AIAssistantPopup from "@/app/components/AIAssistantPopup";

interface PatientDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  allergies: string;
  medicalHistory: string;
  walletAddress: string;
  gender: string;
  tribe: string;
  religion: string;
  occupation: string;
  marritalStatus: string;
  address: string;
  avatar: string;
}

interface DoctorDetails {
  avatar: string;
}

interface CryptoKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
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
  const [message, setMessage] = useState<string>("");
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [showPopup, setShowPopup] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [signsAndSymptoms, setSignsAndSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [pulse, setPulse] = useState<number | undefined>();
  const [bloodPressure, setBloodPressure] = useState<string | undefined>();
  const [temperature, setTemperature] = useState<number | undefined>();
  const [respiratoryRate, setRespiratoryRate] = useState<number | undefined>();
  const [bloodSugar, setBloodSugar] = useState<number | undefined>();
  const [cholesterol, setCholesterol] = useState<number | undefined>();
  const [durationDays, setDurationDays] = useState<number | undefined>();
  const [patientReportedSymptoms, setPatientReportedSymptoms] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<any[]>([]);
  const [chatKeyPair, setChatKeyPair] = useState<CryptoKeyPair | null>(null);
  const [otherPublicKey, setOtherPublicKey] = useState<string | null>(null);
  const chatRef = ref(database, "chats/doctor-patient-chat");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [publicKeyStoredInDb, setPublicKeyStoredInDb] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(
    null
  );

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setUserId(wallet.publicKey.toString());
    } else {
      setShowConnectWallet(true);
    }
  }, [wallet]);

  // 1. Key Generation
  const generateKeyPair = async (): Promise<CryptoKeyPair> => {
    return await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  };

  // 2. Key Exchange
  const exportPublicKey = async (keyPair: CryptoKeyPair): Promise<string> => {
    const exportedKey = await crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const exportedKeyArray = Array.from(new Uint8Array(exportedKey));
    return btoa(String.fromCharCode.apply(null, exportedKeyArray));
  };

  // // Function to import the public key from base64 string
  const importPublicKey = async (base64Key: string): Promise<CryptoKey> => {
    const publicKeyBuffer = Uint8Array.from(atob(base64Key), (c) =>
      c.charCodeAt(0)
    );
    return await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  };

  // 3. Encryption
  const encryptMessage = async (
    message: string,
    publicKey: CryptoKey
  ): Promise<string> => {
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encodedMessage
    );
    const encryptedDataArray = Array.from(new Uint8Array(encryptedData));
    return btoa(String.fromCharCode.apply(null, encryptedDataArray));
  };

  // 4. Decryption
  const decryptMessage = async (
    encryptedMessage: string,
    privateKey: CryptoKey
  ): Promise<string> => {
    try {
      const binaryString = atob(encryptedMessage);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        bytes
      );
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      return ""; // or handle the error as appropriate for your application
    }
  };

  // Utility functions to store and retrieve keys from local storage
  const storeKey = (keyName: string, key: string) => {
    localStorage.setItem(keyName, key);
  };

  const retrieveKey = (keyName: string): string | null => {
    return localStorage.getItem(keyName);
  };

  // 1. Key Generation and Storage
  const generateAndStoreKeyPair = async (): Promise<CryptoKeyPair> => {
    const keyPair = await generateKeyPair();

    // Export keys
    const publicKey = await exportPublicKey(keyPair);
    const privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );
    const privateKeyArray = Array.from(new Uint8Array(privateKey));
    const privateKeyBase64 = btoa(
      String.fromCharCode.apply(null, privateKeyArray)
    );

    // Store keys in local storage
    storeKey("rsa-public-key", publicKey);
    storeKey("rsa-private-key", privateKeyBase64);

    return keyPair;
  };

  // 2. Importing the Private Key
  const importPrivateKey = async (base64Key: string): Promise<CryptoKey> => {
    const privateKeyBuffer = Uint8Array.from(atob(base64Key), (c) =>
      c.charCodeAt(0)
    );
    return await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );
  };

  useEffect(() => {
    const initKeyPair = async () => {
      let publicKey = retrieveKey("rsa-public-key");
      let privateKeyBase64 = retrieveKey("rsa-private-key");
      let keyPair: CryptoKeyPair;

      if (publicKey && privateKeyBase64) {
        const privateKey = await importPrivateKey(privateKeyBase64);
        keyPair = { publicKey: await importPublicKey(publicKey), privateKey };
      } else {
        keyPair = await generateAndStoreKeyPair();
        publicKey = retrieveKey("rsa-public-key")!;
      }

      setChatKeyPair(keyPair);
      setPublicKey(publicKey);

      if (!userId) {
        console.error("No userId available yet, waiting for wallet...");
        return;
      }

      // Check if public key already exists in Firebase
      const q = query(
        collection(db, "publicKeys"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Only add if it doesn’t exist
        await addDoc(collection(db, "publicKeys"), {
          userId: userId,
          publicKey,
        });
        console.log(`Stored public key for userId: ${userId}`);
      } else {
        console.log(`Public key already exists for userId: ${userId}`);
      }
      setPublicKeyStoredInDb(true); // Set this regardless to prevent re-checks

      const fetchOtherPublicKey = async () => {
        const q = query(
          collection(db, "publicKeys"),
          where("userId", "==", chatId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const otherUserPublicKey = querySnapshot.docs[0].data().publicKey;
          setOtherPublicKey(otherUserPublicKey);
        } else {
          console.log("No public key found for chatId, retrying...");
          setTimeout(fetchOtherPublicKey, 2000);
        }
      };

      fetchOtherPublicKey();
    };

    initKeyPair().catch((err) => console.error("initKeyPair failed:", err));
  }, [chatId, userId || wallet.connected]);

  const formatTimestamp = (timestamp: number): string => {
    if (typeof timestamp !== "number" || isNaN(timestamp)) {
      console.error("Invalid timestamp:", timestamp);
      return "Invalid Time";
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.error("Invalid date object:", date);
      return "Invalid Time";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    });
  };

  const handleSend = async () => {
    if (!otherPublicKey || !message.trim() || !chatKeyPair) {
      console.log("Cannot send: missing data");
      return;
    }

    try {
      const importedPublicKey = await importPublicKey(otherPublicKey);
      const encryptedMessage = await encryptMessage(message, importedPublicKey);
      const timestamp = Date.now();

      const messageRef = push(chatRef, {
        sender: publicKey,
        recipient: otherPublicKey,
        message: encryptedMessage,
        timestamp,
      });

      // Add the sent message directly to decryptedMessages in plaintext
      setDecryptedMessages((prevMessages) => {
        const newMessage = {
          key: messageRef.key, // Use Firebase key for uniqueness
          content: message, // Plaintext for sender
          sender: publicKey,
          recipient: otherPublicKey,
          timestamp,
          formattedTime: formatTimestamp(timestamp),
        };
        return [...prevMessages, newMessage].sort(
          (a, b) => a.timestamp - b.timestamp
        );
      });

      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    interface Message {
      key: string;
      content: string;
      sender: string;
      recipient: string;
      timestamp: number;
      formattedTime: string;
    }

    interface FirebaseMessage {
      recipient: string;
      sender: string;
      message: string;
      timestamp: number;
    }

    const handleNewMessages = async (snapshot: any) => {
      const messages: Record<string, FirebaseMessage> | null = snapshot.val();
      if (!messages || !chatKeyPair || !publicKey) return;

      const newMessages = await Promise.all(
        Object.entries(messages).map(
          async ([key, msg]: [string, FirebaseMessage]) => {
            if (msg.recipient !== publicKey && msg.sender !== publicKey) {
              return null;
            }

            if (msg.sender === publicKey) {
              // Skip sent messages; they’re already added in handleSend
              return null;
            }

            try {
              const decryptedContent = await decryptMessage(
                msg.message,
                chatKeyPair.privateKey
              );
              return {
                key,
                content: decryptedContent,
                sender: msg.sender,
                recipient: msg.recipient,
                timestamp: msg.timestamp,
                formattedTime: formatTimestamp(msg.timestamp),
              } as Message;
            } catch (error) {
              console.error("Decryption failed:", error, msg);
              return null;
            }
          }
        )
      );

      const filteredMessages = newMessages.filter(
        (msg): msg is Message => msg !== null
      );
      if (filteredMessages.length > 0) {
        setDecryptedMessages((prevMessages) => {
          const allMessages = [...prevMessages, ...filteredMessages];
          const uniqueMessages = Array.from(
            new Map(allMessages.map((msg) => [msg.key, msg])).values()
          );
          return uniqueMessages.sort((a, b) => a.timestamp - b.timestamp);
        });
      }
    };

    onValue(chatRef, handleNewMessages);
    return () => off(chatRef, "value", handleNewMessages);
  }, [chatRef, chatKeyPair, publicKey]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (chatId) {
        try {
          const doctorsRef = collection(db, "users");
          const q = query(
            doctorsRef,
            where("walletAddress", "==", chatId as string)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const patientDoc = querySnapshot.docs[0].data() as PatientDetails;
            setPatientDetails(patientDoc);
          } else {
            console.error("Patient not found");
          }
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      }
    };

    fetchPatientDetails();
  }, [chatId]);

  // Fetch records from Akave
  const recordsQuery = useQuery({
    queryKey: ["recordDetailsEntry", patientDetails?.walletAddress],
    queryFn: async () => {
      if (!patientDetails?.walletAddress)
        throw new Error("No patient details available");

      // Solana setup
      const patientPublicKey = new PublicKey(patientDetails.walletAddress);

      const allRecords = await program.account.recordDetailsEntry.all();

      const filteredRecords = allRecords.filter(
        (record) => record.account.patientId === patientPublicKey.toBase58()
      );

      // Get CIDs and fetch from Akave
      const bucketName = "telehealthsol-records";
      const akaveRecords = await Promise.all(
        filteredRecords.map(async (filteredRecord) => {
          const cid = filteredRecord.account.akaveCid;
          const files = await listFiles(bucketName);
          const file = files.find((f: { RootCID: string; }) => f.RootCID === cid);
          if (!file) return null;
          const content = await downloadFile(bucketName, file.Name);
          return { ...content, cid, pda: filteredRecord.publicKey.toBase58() };
        })
      );

      return akaveRecords.filter(Boolean); // Remove nulls
    },
    enabled: !!patientDetails?.walletAddress,
  });

  const handleFetchRecords = async () => {
    if (recordsQuery.isSuccess) {
      console.log("Records fetched successfully:", recordsQuery.data);
      return recordsQuery.data.map((record: { doctorId: any; signsAndSymptoms: any; diagnosis: any; prescription: any; timestamp: any; cid: any; pda: any; }) => ({
        doctorId: record.doctorId,
        signsAndSymptoms: record.signsAndSymptoms,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        timestamp: record.timestamp,
        cid: record.cid,
        pda: record.pda,
      }));
    } else if (recordsQuery.isError) {
      console.error("Error fetching records:", recordsQuery.error);
      return null;
    }
    return null;
  };

  const createEntry = useMutation({
    mutationFn: async () => {
      setLoading(true);
      if (!wallet.publicKey || !patientDetails?.walletAddress) {
        setShowConnectWallet(true);
        throw new Error("Missing wallet or patient details.");
      }

      if (!signsAndSymptoms || !diagnosis || !prescription) {
        throw new Error("Please fill in all fields.");
        toast.error("Please fill in at least  fields.");
      }

      const record = {
        doctorId: wallet.publicKey.toBase58(),
        patientId: patientDetails.walletAddress,
        signsAndSymptoms,
        diagnosis,
        prescription,
        timestamp: Date.now(),
      };

      // Upload to Akave
      const bucketName = "telehealthsol-records";
      const fileName = `${patientDetails.walletAddress}-${record.timestamp}.json`;
      const akaveResult = await uploadFile(bucketName, fileName, record);
      const cid = akaveResult.data.RootCID;

      // Solana setup
      const healthRecord = web3.Keypair.generate();

      // Save to Solana
      await program.methods
        .enterHealthRecord(patientDetails.walletAddress, cid)
        .accounts({
          recordEntry: healthRecord.publicKey,
          doctor: wallet.publicKey,
          // systemProgram: web3.SystemProgram.programId,
        })
        .signers([healthRecord])
        .rpc();

      return { cid, pda: healthRecord.publicKey.toBase58() };
    },
    onSuccess: ({ cid, pda }: { cid: string; pda: string }) => {
      toast.success("Record saved to Akave and Solana successfully");
      console.log(`CID: ${cid}, PDA: ${pda}`);
      recordsQuery.refetch();
      setLoading(false);
      setShowPopup(false);
      setSignsAndSymptoms("");
      setDiagnosis("");
      setPrescription("");
    },
    onError: (error: { message: any; }) => {
      toast.error(`Failed to save record: ${error.message}`);
      setLoading(false);
    },
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

  const handleUpdateRecords = () => {
    createEntry.mutate();
  };

  const handleVideoCallClick = () => {
    if (chatId) {
      router.push(`/doctor/video-call?receiverId=${chatId}`);
    } else {
      setShowConnectWallet(true);
      console.error("User ID is not available");
    }
  };

  useEffect(() => {
      const fetchDoctorDetails = async () => {
        if (userId) {
          try {
            const doctorsRef = collection(db, "users");
            const q = query(
              doctorsRef,
              where("walletAddress", "==", userId as string)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const doctorDoc = querySnapshot.docs[0].data() as DoctorDetails;
              setDoctorDetails(doctorDoc);
            } else {
              console.error("doctortDoc not found");
            }
          } catch (error) {
            console.error("Error fetching doctor's details:", error);
          }
        }
      };

      fetchDoctorDetails();
    }, [chatId]);

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col relative">
      <div className="flex mt-2 justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link href="/doctor/messages">
            <Image src={ArrowLeft} alt="back icon" />
          </Link>
          <div
            className="flex gap-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src={patientDetails?.avatar || DocImg}
              alt="doctor profile image"
              className="w-10 h-10 rounded-full"
            />
            <div className="leading-none flex flex-col justify-center">
              <p className="leading-none text-custom-black font-semibold text-base m-0">
                {patientDetails?.firstName} {patientDetails?.lastName}
              </p>
              <p className="leading-none text-xs text-dark-grey m-0 p-0">
                Active now!
              </p>
            </div>
          </div>
        </div>
        <Image
          src={VideoIcon}
          onClick={handleVideoCallClick}
          alt="video call"
          className="w-6 h-6"
        />
      </div>
      {showPopup && (
        <PatientDetailsPopup
          patientDetails={patientDetails}
          onClose={handleClosePopup}
          onFetchRecords={handleFetchRecords}
          signsAndSymptoms={signsAndSymptoms}
          setSignsAndSymptoms={setSignsAndSymptoms}
          diagnosis={diagnosis}
          setDiagnosis={setDiagnosis}
          prescription={prescription}
          setPrescription={setPrescription}
          handleUpdateRecords={handleUpdateRecords}
          loading={loading}
          pulse={pulse}
          setPulse={setPulse}
          bloodPressure={bloodPressure || ""}
          setBloodPressure={setBloodPressure}
          temperature={temperature}
          setTemperature={setTemperature}
          respiratoryRate={respiratoryRate}
          setRespiratoryRate={setRespiratoryRate}
          bloodSugar={bloodSugar}
          setBloodSugar={setBloodSugar}
          cholesterol={cholesterol}
          setCholesterol={setCholesterol}
          durationDays={durationDays}
          setDurationDays={setDurationDays}
          patientReportedSymptoms={patientReportedSymptoms || ""}
          setPatientReportedSymptoms={setPatientReportedSymptoms}
        />
      )}
      <div className="pb-12">
        <p className="text-sm text-center italic mt-1 text-gray-500">
          Messages are end-to-end encrypted
        </p>
        <h3 className="text-center bg-doc-bg w-14 h-6 flex justify-center items-center p-2 text-sm mx-auto mt-2 rounded-lg">
          Today
        </h3>
        {decryptedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col my-1 ${
              msg.sender === publicKey?.toString()
                ? "ml-auto items-end"
                : "mr-auto items-start"
            }`}
          >
            <p
              className={`${
                msg.sender === publicKey?.toString()
                  ? "bg-chat-blue text-white rounded-br-none"
                  : "bg-doc-bg text-black rounded-bl-none"
              } py-2 px-4 rounded-lg`}
            >
              {msg.content}
            </p>
            <p className="text-xs text-dark-grey">{msg.formattedTime}</p>
          </div>
        ))}
      </div>
      <button
        className="absolute right-0 bottom-20 bg-custom-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-30"
        onClick={() => setShowAIAssistant(true)}
      >
        <span className="sr-only">Ask AI</span>
        {/* 🤖 */}
        🧠
      </button>
      <div className="fixed bottom-0 right-0 sm:max-w-lg sm:mx-auto left-0 w-full bg-white py-2 px-4 flex items-center justify-between z-10">
        <Image src={Attachment} alt="select a file" className="mr-0" />
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Write a message"
          className="flex-1 py-2 px-3 rounded-xl bg-doc-bg text-base mx-2 outline-0"
        />
        <div className="flex items-center">
          {message === "" ? (
            <>
              <Image src={CameraIcon} alt="send picture" className="mr-2" />
              <Image src={MicrophoneIcon} alt="record audio" />
            </>
          ) : (
            <Image
              src={SendIcon}
              onClick={handleSend}
              alt="send message"
              className="w-6 h-6 cursor-pointer"
            />
          )}
        </div>
      </div>
      {showAIAssistant && (
        <AIAssistantPopup onClose={() => setShowAIAssistant(false)} userAvatar={doctorDetails?.avatar || ""} />
      )}
      {showConnectWallet && (
        <PopupWallet onClose={() => setShowConnectWallet(false)} />
      )}
    </main>
  );
}

export default Chat;
