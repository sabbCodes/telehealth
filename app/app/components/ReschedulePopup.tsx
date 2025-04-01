"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/components/utils/firebase-config";
import { toast } from "react-toastify";

interface ReschedulePopupProps {
  booking: {
    id: string;
    date: string;
    time: string;
    doctorId: string;
  };
  onClose: () => void;
  onReschedule: (updatedBooking: { date: string; time: string }) => void;
}

function ReschedulePopup({
  booking,
  onClose,
  onReschedule,
}: ReschedulePopupProps) {
  const [newDate, setNewDate] = useState(booking.date.split("-")[2]); // Day only (e.g., "15")
  const [newTime, setNewTime] = useState(booking.time);
  const [dates] = useState(getWeekDays(new Date()));

  function getWeekDays(startDate: Date) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        day: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .substring(0, 2),
        date: date.getDate().toString(),
      });
    }
    return dates;
  }

  const handleReschedule = async () => {
    if (
      !window.confirm("Are you sure you want to reschedule this appointment?")
    )
      return;

    const fullDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${newDate}`;
    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { date: fullDate, time: newTime });
      onReschedule({ date: fullDate, time: newTime });
      toast.success("Appointment rescheduled successfully!");
      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Failed to reschedule appointment.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="font-jakarta font-semibold text-xl mb-4">
          Reschedule Appointment
        </h2>
        <div className="mb-4">
          <h3 className="font-semibold">Select Date</h3>
          <div className="flex justify-between mt-2">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`flex flex-col items-center border rounded-2xl text-sm py-2 gap-1 px-1 h-12 cursor-pointer ${
                  newDate === date.date
                    ? "bg-active-nav text-white border-none"
                    : "border-border-grey text-custom-grey"
                }`}
                onClick={() => setNewDate(date.date)}
              >
                <p className="leading-none">{date.day}</p>
                <p className="leading-none">{date.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Select Time</h3>
          <div className="flex gap-2 mt-2 justify-between">
            {[
              "8 AM",
              "9 AM",
              "10 AM",
              "11 AM",
            ].map((time, index) => (
              <div
                key={index}
                className={`flex justify-center items-center border rounded-3xl p-2 text-sm h-7 leading-none w-20 cursor-pointer ${
                  newTime === time
                    ? "bg-active-nav text-white border-none"
                    : "border-dark-grey text-custom-grey"
                }`}
                onClick={() => setNewTime(time)}
              >
                <p>{time}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2 justify-between">
            {[
              "12 PM",
              "1 PM",
              "2 PM",
              "3 PM",
            ].map((time, index) => (
              <div
                key={index}
                className={`flex justify-center items-center border rounded-3xl p-2 text-sm h-7 leading-none w-20 cursor-pointer ${
                  newTime === time
                    ? "bg-active-nav text-white border-none"
                    : "border-dark-grey text-custom-grey"
                }`}
                onClick={() => setNewTime(time)}
              >
                <p>{time}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-none border-custom-blue border text-custom-blue p-2 rounded-2xl"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-schedule-col text-white p-2 rounded-2xl"
            onClick={handleReschedule}
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReschedulePopup;
