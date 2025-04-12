import React, { useState } from "react";
import Image from "next/image";
import DocImg from "@/public/Frame 75.svg";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "./utils/firebase-config";
import DnaLoader from "@/app/components/DnaLoader";
import { toast } from "react-toastify";

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

interface MedicalRecord {
  doctorId: string;
  signsAndSymptoms: string;
  diagnosis: string;
  prescription: string;
  timestamp: number;
  doctorDetails?: DoctorDetails | null;
  pulse?: number; // bpm
  bloodPressure?: string; // "120/80"
  temperature?: number; // °C
  respiratoryRate?: number; // breaths/min
  bloodSugar?: number; // mg/dL
  cholesterol?: number; // mg/dL
  durationDays?: number;
  patientReportedSymptoms?: string;
}

interface DoctorDetails {
  firstName: string;
  lastName: string;
  avatar: string;
}

interface PatientDetailsPopupProps {
  patientDetails: PatientDetails | null;
  onClose: () => void;
  onFetchRecords: () => Promise<MedicalRecord[] | null>;
  signsAndSymptoms: string;
  setSignsAndSymptoms: (value: string) => void;
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  prescription: string;
  setPrescription: (value: string) => void;
  handleUpdateRecords: () => void;
  loading: boolean;
  pulse?: number;
  setPulse: (value: number | undefined) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  temperature?: number;
  setTemperature: (value: number | undefined) => void;
  respiratoryRate?: number;
  setRespiratoryRate: (value: number | undefined) => void;
  bloodSugar?: number;
  setBloodSugar: (value: number | undefined) => void;
  cholesterol?: number;
  setCholesterol: (value: number | undefined) => void;
  durationDays?: number;
  setDurationDays: (value: number | undefined) => void;
  patientReportedSymptoms: string;
  setPatientReportedSymptoms: (value: string) => void;
}

const PatientDetailsPopup: React.FC<PatientDetailsPopupProps> = ({
  patientDetails,
  onClose,
  onFetchRecords,
  signsAndSymptoms,
  setSignsAndSymptoms,
  diagnosis,
  setDiagnosis,
  prescription,
  setPrescription,
  handleUpdateRecords,
  loading,
  pulse,
  setPulse,
  bloodPressure,
  setBloodPressure,
  temperature,
  setTemperature,
  respiratoryRate,
  setRespiratoryRate,
  bloodSugar,
  setBloodSugar,
  cholesterol,
  setCholesterol,
  durationDays,
  setDurationDays,
  patientReportedSymptoms,
  setPatientReportedSymptoms,
}) => {
  const [records, setRecords] = useState<MedicalRecord[] | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [medLoading, setMedLoading] = useState(false);

  const fetchRecords = async () => {
    setMedLoading(true);
    try {
      const fetchedRecords = await onFetchRecords();
      if (fetchedRecords) {
        const recordsWithDoctorDetails = await Promise.all(
          fetchedRecords.map(async (record) => {
            const doctorDetails = await fetchDoctorDetails(record.doctorId);
            return { ...record, doctorDetails };
          })
        );
        setRecords(recordsWithDoctorDetails);
      } else {
        console.error(
          "No records found or error occurred while fetching records."
        );
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setMedLoading(false);
    }
  };

  const fetchDoctorDetails = async (
    doctorId: string
  ): Promise<DoctorDetails | null> => {
    try {
      const doctorsRef = collection(db, "users");
      const q = query(doctorsRef, where("walletAddress", "==", doctorId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as DoctorDetails;
      } else {
        console.error("Doctor not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      return null;
    }
  };

  if (!patientDetails) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 w-full flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-end items-center mt-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-red-500 text-2xl z-10"
          >
            &times;
          </button>
        </div>
        {records ? (
          <div className="w-full">
            <div className="flex mb-4 h-16 items-center gap-2">
              <img
                src={patientDetails.avatar || DocImg}
                alt="patient profile image"
                className="w-16 h-full rounded-lg"
              />
              <div>
                <h2 className="font-semibold text-base">
                  {patientDetails.firstName}'s Medical Records
                </h2>
                <p className="text-sm text-gray-500 leading-none">
                  Last updated:{" "}
                  {new Date(records[0]?.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4 w-full">
              {records.map((record, index) => (
                <div key={index}>
                  <div className="flex mb-4 h-16 items-center gap-2">
                    <img
                      src={record.doctorDetails?.avatar || DocImg}
                      alt="doctor profile image"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-md">
                        Dr. {record.doctorDetails?.firstName}{" "}
                        {record.doctorDetails?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Updated: {new Date(record.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p>
                    <strong>Signs & Symptoms:</strong> {record.signsAndSymptoms}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {record.diagnosis}
                  </p>
                  <p>
                    <strong>Prescription:</strong> {record.prescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : showUpdateForm ? (
          <div>
            {loading ? (
              <div className="flex flex-col justify-center items-center h-40">
                <DnaLoader />
                <p className="text-gray-700 italic">Please wait, do not close this page...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Update Medical Record
                </h3>
                <form>
                  <input
                    type="text"
                    value={signsAndSymptoms}
                    onChange={(e) => setSignsAndSymptoms(e.target.value)}
                    placeholder="Signs/Symptoms"
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Diagnosis"
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="Prescription"
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={pulse || ""}
                    onChange={(e) =>
                      setPulse(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Pulse (bpm)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={bloodPressure || ""}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="Blood Pressure (e.g., 120/80)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={temperature || ""}
                    onChange={(e) =>
                      setTemperature(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Temperature (°C)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={respiratoryRate || ""}
                    onChange={(e) =>
                      setRespiratoryRate(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Respiratory Rate (breaths/min)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={bloodSugar || ""}
                    onChange={(e) =>
                      setBloodSugar(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Blood Sugar (mg/dL)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={cholesterol || ""}
                    onChange={(e) =>
                      setCholesterol(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Cholesterol (mg/dL)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={durationDays || ""}
                    onChange={(e) =>
                      setDurationDays(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Duration (days)"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={patientReportedSymptoms || ""}
                    onChange={(e) => setPatientReportedSymptoms(e.target.value)}
                    placeholder="Patient Reported Symptoms"
                    className="w-full mb-4 p-2 border rounded"
                  />
                </form>
                <button
                  onClick={handleUpdateRecords}
                  className={`bg-custom-blue text-lg outline-none text-white font-semibold mt-12 h-14 rounded-2xl w-full ${
                    loading ? "opacity-50 cursor-progress" : ""
                  }`}
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex mt-1 w-full h-20 gap-4 mb-4 items-center">
              <img
                src={patientDetails.avatar || DocImg}
                alt="patient profile image"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex flex-col justify-between h-full">
                <button
                  onClick={fetchRecords}
                  className="bg-custom-blue outline-none text-white px-4 py-2 h-9 text-sm rounded"
                >
                  {medLoading ? "One Moment..." : "Get Medical Record"}
                </button>
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="bg-white outline-none text-custom-blue border border-custom-blue text-sm px-4 py-2 h-9 rounded"
                >
                  Update Medical Record
                </button>
              </div>
            </div>
            <p>
              <strong>Name:</strong> {patientDetails.firstName}{" "}
              {patientDetails.lastName}
            </p>
            <p>
              <strong>Age:</strong>{" "}
              {new Date().getFullYear() -
                new Date(patientDetails.dateOfBirth || "").getFullYear()}{" "}
              years old
            </p>
            <p>
              <strong>Sex:</strong> {patientDetails.gender}
            </p>
            <p>
              <strong>Tribe:</strong> {patientDetails.tribe}
            </p>
            <p>
              <strong>Religion:</strong> {patientDetails.religion}
            </p>
            <p>
              <strong>Occupation:</strong> {patientDetails.occupation}
            </p>
            <p>
              <strong>Marrital Status:</strong> {patientDetails.marritalStatus}
            </p>
            <p>
              <strong>Address:</strong> {patientDetails.address}
            </p>
            <p>
              <strong>Allergies:</strong> {patientDetails.allergies}
            </p>
            <p className="mb-4">
              <strong>Underlying Conditions:</strong>{" "}
              {patientDetails.medicalHistory}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPopup;

//Tingling sensation on LL Occlussion of popliteal artery Heparin
