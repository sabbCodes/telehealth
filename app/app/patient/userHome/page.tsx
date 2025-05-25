"use client";

import Image from "next/image";
import UserDp from "@/public/userdp.svg";
import SearchIcon from "@/public/search.svg";
import DocImg from "@/public/Frame 75.svg";
import Heart from "@/public/heart.svg";
import VidIcon from "@/public/Frame 55.svg";
import ChatIcon from "@/public/Frame 56.svg";
import DateIcon from "@/public/story.svg";
import TimeIcon from "@/public/clock.svg";
import HomeActive from "@/public/homeActive.svg";
import ScheduleInactive from "@/public/story.svg";
import MessagesInactive from "@/public/messages-inactive.svg";
import ProfileInactive from "@/public/profileInactive.svg";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/components/utils/firebase-config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import DnaLoader from "@/app/components/DnaLoader";
import { userHasWallet } from "@civic/auth-web3";
import { useUser } from "@civic/auth-web3/react";
import { useWallet } from "@civic/auth-web3/react";

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  allergies: string;
  medicalHistory: string;
  password: string;
  walletAddress: string;
  avatar: string;
}

interface Doctor {
  firstName: string;
  lastName: string;
  specialization: string;
  rating?: number;
  walletAddress: string;
  avatar: string;
}

function Home() {
  // const [userData, setUserData] = useState<UserData | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // const user = auth.currentUser;
  const router = useRouter();
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const { user } = useUser();
  const { address } = useWallet({ type: "solana" });

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/patient/userHome/${doctorId}`);
  };

  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     if (user) {
    //       const userDocRef = doc(db, "users", user.uid);
    //       const userDoc = await getDoc(userDocRef);
    //       if (userDoc.exists()) {
    //         setUserData(userDoc.data() as UserData);
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    const fetchDoctors = async () => {
      try {
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor"),
          limit(4)
        );
        const doctorDocs = await getDocs(doctorsQuery);
        const doctorsList = doctorDocs.docs.map((doc) => doc.data() as Doctor);
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const createUserWallet = async () => {
      const userContext = await useUser();

      if (!user || userHasWallet(userContext)) return;

      try {
        if (userContext.user && !userHasWallet(userContext)) {
          await userContext.createWallet();
        }
        console.log("Embedded wallet created successfully");
      } catch (err) {
        console.error("Failed to create wallet:", err);
      }
    };

    if (address){
      setUserWallet(address);
      console.log("User wallet address:", address);
    }

    createUserWallet();
    // fetchUserData();
    fetchDoctors();
  }, [user]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col">
      <div className="w-full mt-3">
        <div className="h-16 w-full flex justify-between items-center">
          <div>
            <h1 className="text-custom-black font-jakarta font-semibold text-2xl">
              Good day,{" "}
              {/* <span className="capitalize">{userData?.firstName}</span> */}
              <span className="capitalize">
                {user?.name ? user.name.split(" ")[0] : "User"}
              </span>
            </h1>
            <p className="text-sm text-custom-blue">
              Patient ID:{" "}
              {/* {userData?.walletAddress
                ? formatWalletAddress(userData.walletAddress)
                : "N/A"} */}
              {userWallet ? formatWalletAddress(userWallet) : "N/A"}
            </p>
          </div>
          <img
            src={user?.picture ? user?.picture : UserDp}
            // src={userData?.avatar ? userData.avatar : UserDp}
            alt="user profile"
            className="h-16 w-16 shadow-neutral-500 rounded-lg object-cover"
          />
        </div>
        <div className="relative">
          <Image
            src={SearchIcon}
            alt="search icon"
            className="absolute top-10 left-4"
          />
          <input
            type="text"
            placeholder="Search by name, specialty"
            className="w-full border border-border-grey my-6 h-12 py-3 pl-9 rounded-2xl"
          />
        </div>
      </div>
      <div>
        <div className="w-full flex justify-between items-center">
          <h2 className="text-custom-black font-jakarta font-semibold text-xl">
            Doctors' List
          </h2>
          <Link
            href="/patient/userHome/alldoctors"
            className="text-custom-blue text-base"
          >
            View All
          </Link>
        </div>
        {doctors.map((doctor, index) => (
          <div
            key={index}
            onClick={() => handleDoctorClick(doctor.walletAddress)}
            className="flex justify-between items-center h-14 bg-doc-bg rounded-lg p-2 mb-2 cursor-pointer"
          >
            <div className="flex gap-2">
              <img
                src={doctor.avatar || DocImg}
                alt="doctor profile image"
                className="w-10 h-10 shadow-neutral-500 rounded-md object-cover"
              />
              <div className="leading-none">
                <p className="text-custom-black font-jakarta font-semibold text-base m-0">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p className="leading-none text-sm m-0 p-0">
                  {doctor.specialization}
                </p>
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <Image src={Heart} alt="heart icon" className="w-5 h-5" />
              <p>{doctor.rating || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-custom-black font-jakarta font-semibold text-xl">
            Upcoming Schedule
          </h2>
          <Link
            className="text-custom-blue text-base"
            href="./patient/schedule"
          >
            View All
          </Link>
        </div>
        <div>
          <div className="w-full bg-schedule-col rounded-lg text-white p-4 my-2 z-1">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Image
                  src={DocImg}
                  alt="doctor profile image"
                  className="w-10 h-10"
                />
                <div className="leading-none">
                  <p className="font-semibold font-jakarta text-base m-0">
                    Dr. Sarafa Abbas
                  </p>
                  <p className="leading-none text-sm m-0 p-0">Neurosurgeon</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Image src={VidIcon} alt="video icon" />
                <Image src={ChatIcon} alt="chat icon" />
              </div>
            </div>
            <div className="text-black text-xs flex justify-between items-center bg-schedule-col-inner mt-2 p-4 rounded-xl">
              <div className="flex items-center gap-1">
                <Image src={DateIcon} alt="calendar icon" />
                <p>Sunday, April 19</p>
              </div>
              <div className="flex items-center gap-1">
                <Image src={TimeIcon} alt="clock icon" />
                <p>8:00 AM - 9:00 AM</p>
              </div>
            </div>
          </div>
          <div className="w-11/12 h-11 -z-10 bg-card-layer2 m-auto relative bottom-9 rounded-lg"></div>
          <div className="w-10/12 h-11 -z-20 bg-card-layer3 m-auto relative bottom-16 rounded-lg"></div>
        </div>
      </div>
      <footer className="w-full sm:max-w-lg sm:mx-auto fixed bottom-0 left-0 right-0 shadow-3xl bg-white">
        <nav className="w-full flex gap-14 justify-evenly items-center py-4 px-14">
          <Link href="/patient/userHome">
            <Image src={HomeActive} alt="home icon" />
          </Link>
          <Link href="/patient/schedule">
            <Image src={ScheduleInactive} alt="Schedule icon" />
          </Link>
          <Link href="/patient/messages">
            <Image src={MessagesInactive} alt="Messages icon" />
          </Link>
          <Link href="/patient/userProfile">
            <Image src={ProfileInactive} alt="Profile icon" />
          </Link>
        </nav>
      </footer>
    </main>
  );
}

export default Home;
