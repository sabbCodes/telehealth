"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useWallet } from "@solana/wallet-adapter-react";
import DocImg from "@/public/Frame 75.svg";
import DateIcon from "@/public/story.svg";
import TimeIcon from "@/public/clock.svg";
import ArrowLeft from "@/public/arrow-left.svg";
import Add from "@/public/add.svg";
import Link from "next/link";
import { db } from "@/app/components/utils/firebase-config";
import { useRouter } from "next/navigation";
import DnaLoader from "@/app/components/DnaLoader";
import { toast } from "react-toastify";
import ReschedulePopup from "@/app/components/ReschedulePopup";

interface Booking {
  date: string;
  doctorId: string;
  time: string;
  userId: string;
  doctor?: Doctor | null;
  status: string;
  id: string;
}

interface Doctor {
  name: string;
  specialization: string;
  [key: string]: any;
}

interface User {
  walletAddress: string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

function Schedule() {
  const { publicKey } = useWallet();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Completed" | "Cancelled"
  >("Upcoming");
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) return;

    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("walletAddress", "==", publicKey.toString())
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as User;
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [publicKey]);

  useEffect(() => {
    if (!userData) return;

    const fetchBookingsWithDoctors = async () => {
      setLoading(true);
      try {
        const bookingsRef = collection(db, "bookings");
        let q;

        switch (activeTab) {
          case "Upcoming":
            q = query(
              bookingsRef,
              where("userId", "==", userData.walletAddress),
              where("status", "==", "Booked")
            );
            break;
          case "Completed":
            q = query(
              bookingsRef,
              where("userId", "==", userData.walletAddress),
              where("status", "==", "Completed")
            );
            break;
          case "Cancelled":
            q = query(
              bookingsRef,
              where("userId", "==", userData.walletAddress),
              where("status", "==", "Cancelled")
            );
            break;
          default:
            q = query(
              bookingsRef,
              where("userId", "==", userData.walletAddress)
            );
        }

        const querySnapshot = await getDocs(q);

        const bookingsData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const bookingData = {
              id: docSnapshot.id,
              ...docSnapshot.data(),
            } as Booking;

            const usersRef = collection(db, "users");
            const userQuery = query(
              usersRef,
              where("walletAddress", "==", bookingData.doctorId)
            );
            const userSnapshot = await getDocs(userQuery);

            let doctorData: Doctor | null = null;
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as Doctor;
              doctorData = {
                name: `Dr. ${userData.firstName} ${userData.lastName}`,
                specialization: userData.specialization,
              };
            }

            return { ...bookingData, doctor: doctorData };
          })
        );

        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsWithDoctors();
  }, [userData, activeTab]);

  const handleScheduleClick = (doctorId: string) => {
    router.push(`/patient/messages/${doctorId}`);
  };

  const handleCancel = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, { status: "Cancelled" });
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
        toast.success("Appointment cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        toast.error("Failed to cancel appointment.");
      }
    }
  };

  const handleReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReschedulePopup(true);
  };

  const handleRescheduleSubmit = (updatedBooking: {
    date: string;
    time: string;
  }) => {
    if (selectedBooking) {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, ...updatedBooking }
            : booking
        )
      );
      setShowReschedulePopup(false);
    }
  };

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col">
      <div className="mt-2 flex justify-between w-full">
        <div className="flex gap-3 items-center">
          <Link href="/patient/userHome">
            <Image src={ArrowLeft} alt="back icon" />
          </Link>
          <h1 className="font-jakarta font-semibold text-xl">Schedule</h1>
        </div>
        <Image src={Add} alt="add icon" />
      </div>
      <ul className="flex w-full justify-between my-2 h-11 items-center bg-custom-schedule rounded-full py-1 px-4">
        {["Upcoming", "Completed", "Cancelled"].map((tab) => (
          <li
            key={tab}
            className={`py-1 px-3 rounded-xl leading-none cursor-pointer ${
              activeTab === tab
                ? "bg-active-nav text-white"
                : "text-custom-grey"
            }`}
            onClick={() =>
              setActiveTab(tab as "Upcoming" | "Completed" | "Cancelled")
            }
          >
            {tab}
          </li>
        ))}
      </ul>

      <div className="pb-14">
        {loading ? (
          <DnaLoader />
        ) : bookings.length === 0 ? (
          <p>No {activeTab.toLowerCase()} appointments</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className={`w-full bg-custom-schedule rounded-xl p-3 mb-2 ${
                booking.status !== "Booked"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={
                booking.status === "Booked"
                  ? () => handleScheduleClick(booking.doctorId)
                  : undefined
              }
            >
              <div className="flex gap-2">
                <Image
                  src={DocImg}
                  alt="doctor profile image"
                  className="w-10 h-10"
                />
                <div className="leading-none">
                  <p className="text-custom-black font-semibold text-base m-0">
                    {booking.doctor?.name}
                  </p>
                  <p className="leading-none text-sm m-0 p-0">
                    {booking.doctor?.specialization}
                  </p>
                </div>
              </div>
              <div className="text-black text-xs flex justify-between items-center bg-schedule-col-inner mt-2 p-4 rounded-xl">
                <div className="flex items-center gap-1">
                  <Image src={DateIcon} alt="calendar icon" />
                  <p>{booking.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Image src={TimeIcon} alt="clock icon" />
                  <p>{booking.time}</p>
                </div>
              </div>
              <div className="w-full mt-2 flex justify-between h-10">
                <button
                  className="bg-none border-custom-blue border text-custom-blue h-full p-3 rounded-2xl flex items-center w-36 justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel(booking.id);
                  }}
                  disabled={booking.status !== "Booked"}
                >
                  Cancel
                </button>
                <button
                  className="bg-schedule-col text-white h-full p-3 rounded-2xl flex items-center w-36 justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReschedule(booking);
                  }}
                  disabled={booking.status !== "Booked"}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showReschedulePopup && selectedBooking && (
        <ReschedulePopup
          booking={selectedBooking}
          onClose={() => setShowReschedulePopup(false)}
          onReschedule={handleRescheduleSubmit}
        />
      )}
    </main>
  );
}

export default Schedule;