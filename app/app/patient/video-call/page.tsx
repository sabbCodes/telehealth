// "use client";

// import React, { useEffect, useState, useRef, Suspense } from 'react';
// import { collection, onSnapshot, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '@/app/components/firebase-config';
// import './videocall.css';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useWallet } from '@solana/wallet-adapter-react';
// import PopupWallet from '@/app/components/PopupWallet';
// import Image from 'next/image';
// import CallIcon from '@/public/call.svg';

// const servers = {
//   iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }],
//   iceCandidatePoolSize: 10,
// };

// function VideoCallComponent() {
//   const wallet = useWallet();
//   const [showConnectWallet, setShowConnectWallet] = useState(false);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [pc, setPc] = useState<RTCPeerConnection | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const webcamVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const searchParams = useSearchParams();
//   const receiverId = searchParams.get('receiverId');
//   const router = useRouter();

//   useEffect(() => {
//     if (wallet.connected && wallet.publicKey) {
//       setUserId(wallet.publicKey.toString());
//     } else {
//       setShowConnectWallet(true);
//     }
//   }, [wallet.connected, wallet.publicKey]);

//   useEffect(() => {
//     const newPc = new RTCPeerConnection(servers);
//     setPc(newPc);

//     newPc.ontrack = (event) => {
//       const remoteStream = new MediaStream();
//       event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
//       setRemoteStream(remoteStream);
//     };

//     return () => {
//       newPc.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (localStream && webcamVideoRef.current) {
//       webcamVideoRef.current.srcObject = localStream;
//     }
//     if (remoteStream && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [localStream, remoteStream]);

//   useEffect(() => {
//     if (pc && userId && receiverId) {
//       startWebcam().then(() => {
//         if (userId < receiverId) {
//           createCall();
//         } else {
//           listenForIncomingCall();
//         }
//       });
//     }
//   }, [pc, userId, receiverId]);

//   const startWebcam = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     setLocalStream(stream);
//     stream.getTracks().forEach(track => pc?.addTrack(track, stream));
//   };

//   const createCall = async () => {
//     if (!pc || !userId) {
//       // console.error("RTCPeerConnection or userId is not initialized");
//       return;
//     }

//     try {
//       const callDoc = await addDoc(collection(db, 'calls'), {
//         callerId: userId,
//         receiverId: receiverId,
//         status: 'creating'
//       });

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           addDoc(collection(callDoc, 'offerCandidates'), event.candidate.toJSON());
//         }
//       };

//       const offerDescription = await pc.createOffer();
//       await pc.setLocalDescription(offerDescription);

//       const offer = {
//         type: offerDescription.type,
//         sdp: offerDescription.sdp,
//       };

//       await updateDoc(callDoc, { offer, status: 'offering' });
//       // console.log("Call created successfully", JSON.stringify(offer, null, 2));

//       onSnapshot(callDoc, (snapshot) => {
//         const data = snapshot.data();
//         if (!pc.currentRemoteDescription && data?.answer) {
//           // console.log("Received answer:", JSON.stringify(data.answer, null, 2));
//           const answerDescription = new RTCSessionDescription(data.answer);
//           pc.setRemoteDescription(answerDescription)
//             .catch(error => console.error("Error setting remote description:", error));
//         }
//       });

//       onSnapshot(collection(callDoc, 'answerCandidates'), (snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//           if (change.type === 'added') {
//             const candidate = new RTCIceCandidate(change.doc.data());
//             pc.addIceCandidate(candidate)
//               .catch(error => console.error("Error adding ICE candidate:", error));
//           }
//         });
//       });
//     } catch (error) {
//       console.error("Error in createCall:", error);
//     }
//   };

//   const listenForIncomingCall = async () => {
//     if (!pc || !userId) return;

//     const q = query(
//       collection(db, 'calls'),
//       where('receiverId', '==', userId),
//       where('callerId', '==', receiverId),
//       where('status', '==', 'offering')
//     );

//     onSnapshot(q, (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === 'added') {
//           answerCall(change.doc);
//         }
//       });
//     });
//   };

//   const answerCall = async (callDoc: any) => {
//     if (!pc) {
//       console.error("RTCPeerConnection is not initialized");
//       return;
//     }

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         addDoc(collection(callDoc.ref, 'answerCandidates'), event.candidate.toJSON());
//       }
//     };

//     try {
//       const callData = callDoc.data();
//       // console.log("Call data retrieved:", JSON.stringify(callData, null, 2));

//       if (!callData || !callData.offer) {
//         console.error("Invalid call data or missing offer:", JSON.stringify(callData, null, 2));
//         return;
//       }

//       const offerDescription = callData.offer;
//       // console.log("Offer description:", JSON.stringify(offerDescription, null, 2));

//       if (!offerDescription || !offerDescription.type || !offerDescription.sdp) {
//         console.error("Invalid offer description:", JSON.stringify(offerDescription, null, 2));
//         return;
//       }

//       await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
//       // console.log("Remote description set successfully");

//       const answerDescription = await pc.createAnswer();
//       await pc.setLocalDescription(answerDescription);

//       const answer = {
//         type: answerDescription.type,
//         sdp: answerDescription.sdp,
//       };

//       await updateDoc(callDoc.ref, { answer, status: 'answered' });
//       // console.log("Call answered successfully", JSON.stringify(answer, null, 2));

//       onSnapshot(collection(callDoc.ref, 'offerCandidates'), (snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//           if (change.type === 'added') {
//             const candidate = new RTCIceCandidate(change.doc.data());
//             pc.addIceCandidate(candidate)
//               .catch(error => console.error("Error adding ICE candidate:", error));
//           }
//         });
//       });
//     } catch (error) {
//       console.error("Error in answerCall:", error);
//     }
//   };

//   const hangup = () => {
//     // Close peer connection
//     if (pc) {
//       pc.onicecandidate = null;
//       pc.ontrack = null;
//       pc.close();
//       setPc(null);
//     }

//     // Stop all tracks on local stream
//     if (localStream) {
//       localStream.getTracks().forEach(track => {
//         track.stop();
//       });
//       setLocalStream(null);
//     }

//     // Stop all tracks on remote stream
//     if (remoteStream) {
//       remoteStream.getTracks().forEach(track => {
//         track.stop();
//       });
//       setRemoteStream(null);
//     }

//     // Reset video elements
//     if (webcamVideoRef.current) {
//       webcamVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     router.push(`/patient/messages/${receiverId}`);
//   };

//   return (
//     <div className="video-call-container">
//       <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline></video>
//       <video ref={webcamVideoRef} className="local-video" autoPlay playsInline muted></video>
//       <div className="controls">
//         <div className='rounded-full bg-red-600 w-12 h-12 flex justify-center items-center outline-none' onClick={hangup}>
//           <Image src={CallIcon} alt="hang up call" />
//         </div>
//       </div>
//       {showConnectWallet && (
//         <PopupWallet onClose={() => setShowConnectWallet(false)} />
//       )}
//     </div>
//   );
// }

// export default function VideoCall() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <VideoCallComponent />
//     </Suspense>
//   );
// }



"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/components/firebase-config';
import './videocall.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import PopupWallet from '@/app/components/PopupWallet';
import Image from 'next/image';
import CallIcon from '@/public/call.svg';

const servers = {
  iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }],
  iceCandidatePoolSize: 10,
};

function VideoCallComponent() {
  const wallet = useWallet();
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const searchParams = useSearchParams();
  const receiverId = searchParams.get('receiverId');
  const router = useRouter();

  // Generate session ID based on userId and receiverId
  const generateSessionId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('_');
  };

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setUserId(wallet.publicKey.toString());
    } else {
      setShowConnectWallet(true);
    }
  }, [wallet.connected, wallet.publicKey]);

  useEffect(() => {
    const newPc = new RTCPeerConnection(servers);
    setPc(newPc);

    newPc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
      setRemoteStream(remoteStream);
    };

    return () => {
      newPc.close();
    };
  }, []);

  useEffect(() => {
    if (localStream && webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (pc && userId && receiverId) {
      startWebcam().then(() => {
        const sessionId = generateSessionId(userId, receiverId);
        if (userId < receiverId) {
          createCall(sessionId);
        } else {
          listenForIncomingCall(sessionId);
        }
      });
    }
  }, [pc, userId, receiverId]);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    stream.getTracks().forEach(track => pc?.addTrack(track, stream));
  };

  const createCall = async (sessionId: string) => {
    if (!pc || !userId) {
      return;
    }

    try {
      const callDoc = await addDoc(collection(db, 'calls'), {
        sessionId: sessionId,
        callerId: userId,
        receiverId: receiverId,
        status: 'creating',
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(collection(callDoc, 'offerCandidates'), event.candidate.toJSON());
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        type: offerDescription.type,
        sdp: offerDescription.sdp,
      };

      await updateDoc(callDoc, { offer, status: 'offering' });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription)
            .catch(error => console.error("Error setting remote description:", error));
        }
      });

      onSnapshot(collection(callDoc, 'answerCandidates'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate)
              .catch(error => console.error("Error adding ICE candidate:", error));
          }
        });
      });
    } catch (error) {
      console.error("Error in createCall:", error);
    }
  };

  const listenForIncomingCall = async (sessionId: string) => {
    if (!pc || !userId) return;

    const q = query(
      collection(db, 'calls'),
      where('sessionId', '==', sessionId),
      where('status', '==', 'offering')
    );

    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          answerCall(change.doc);
        }
      });
    });
  };

  const answerCall = async (callDoc: any) => {
    if (!pc) return;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(collection(callDoc.ref, 'answerCandidates'), event.candidate.toJSON());
      }
    };

    try {
      const callData = callDoc.data();
      const offerDescription = callData.offer;

      if (!offerDescription || !offerDescription.type || !offerDescription.sdp) {
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc.ref, { answer, status: 'answered' });

      onSnapshot(collection(callDoc.ref, 'offerCandidates'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate)
              .catch(error => console.error("Error adding ICE candidate:", error));
          }
        });
      });
    } catch (error) {
      console.error("Error in answerCall:", error);
    }
  };

  const hangup = () => {
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.close();
      setPc(null);
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }

    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    router.push(`/patient/messages/${receiverId}`);
  };

  return (
    <div className="video-call-container">
      <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline></video>
      <video ref={webcamVideoRef} className="local-video" autoPlay playsInline muted></video>
      <div className="controls">
        <div className='rounded-full bg-red-600 w-12 h-12 flex justify-center items-center outline-none' onClick={hangup}>
          <Image src={CallIcon} alt="hang up call" />
        </div>
      </div>
      {showConnectWallet && (
        <PopupWallet onClose={() => setShowConnectWallet(false)} />
      )}
    </div>
  );
}

export default function VideoCall() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoCallComponent />
    </Suspense>
  );
}
