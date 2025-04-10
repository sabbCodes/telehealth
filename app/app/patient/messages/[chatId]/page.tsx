"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, push, onValue, off } from "firebase/database";
import DocImg from "@/public/Frame 75.svg";
import ArrowLeft from "@/public/arrow-left.svg";
import VideoIcon from "@/public/video.svg";
import Attachment from "@/public/attachment.svg";
import CameraIcon from "@/public/camera.svg";
import MicrophoneIcon from "@/public/microphone-2.svg";
import SendIcon from "@/public/send.svg";
import { database, db } from "@/app/components/utils/firebase-config";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import { useWallet } from "@solana/wallet-adapter-react";
import PopupWallet from "@/app/components/PopupWallet";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface CryptoKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

interface DoctorDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  allergies: string;
  medicalHistory: string;
  walletAddress: string;
  avatar: string;
}

function Chat() {
  const wallet = useWallet();
  const [message, setMessage] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState<any[]>([]);
  const [chatKeyPair, setChatKeyPair] = useState<CryptoKeyPair | null>(null);
  const [otherPublicKey, setOtherPublicKey] = useState<string | null>(null);
  const [publicKeyStoredInDb, setPublicKeyStoredInDb] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(
    null
  );
  const { chatId } = useParams();
  const router = useRouter();
  const chatRef = ref(database, "chats/doctor-patient-chat");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setUserId(wallet.publicKey.toString());
    } else {
      setShowConnectWallet(true);
    }
  }, [wallet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const [publicKey, setPublicKey] = useState<string | null>(null);

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

  // Function to import the public key from base64 string
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
  }, [chatId, userId]);

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
      Object.entries(messages).map(async ([key, msg]: [string, FirebaseMessage]) => {
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
      })
      );

      const filteredMessages = newMessages.filter((msg): msg is Message => msg !== null);
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
    const fetchDoctorDetails = async () => {
      if (chatId) {
        try {
          const doctorsRef = collection(db, "users");
          const q = query(
            doctorsRef,
            where("walletAddress", "==", chatId as string)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const patientDoc = querySnapshot.docs[0].data() as DoctorDetails;
            setDoctorDetails(patientDoc);
          } else {
            console.error("Patient not found");
          }
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      }
    };

    fetchDoctorDetails();
  }, [chatId]);

  const handleVideoCallClick = () => {
    if (chatId) {
      router.push(`/patient/video-call?receiverId=${chatId}`);
    } else {
      setShowConnectWallet(true);
      console.error("User ID is not available");
    }
  };

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen box-border">
      <div className="flex mt-2 justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link href="/patient/messages">
            <Image src={ArrowLeft} alt="back icon" />
          </Link>
          <div className="flex gap-2">
            <Image
              src={doctorDetails?.avatar || DocImg}
              alt="doctor profile image"
              className="w-10 h-10 rounded-full"
            />
            <div className="leading-none flex flex-col justify-center">
              <p className="leading-none text-custom-black font-semibold text-base m-0">
                Dr. {doctorDetails?.firstName} {doctorDetails?.lastName}
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
      <div>
        <p className="text-sm text-center italic mt-1 text-gray-500">
          Messages are end-to-end encrypted
        </p>
        <h3 className="text-center bg-doc-bg w-14 h-6 flex justify-center items-center p-2 text-sm mx-auto mt-2 rounded-lg">
          Today
        </h3>
        {decryptedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col  w-3/4 ${
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
              } py-2 px-4 max-w-full rounded-lg`}
            >
              {msg.content}
            </p>
            <p className="text-xs text-dark-grey">{msg.formattedTime}</p>
          </div>
        ))}
      </div>
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
              alt="send message"
              className="w-6 h-6 cursor-pointer"
              onClick={handleSend}
            />
          )}
        </div>
      </div>
      {showConnectWallet && (
        <PopupWallet onClose={() => setShowConnectWallet(false)} />
      )}
    </main>
  );
}

export default Chat;
