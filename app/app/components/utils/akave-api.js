import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Update if hosted elsewhere

async function apiRequest(method, endpoint, data = null) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function createBucket(bucketName) {
  return apiRequest("POST", "/buckets", { bucketName });
}

export async function uploadFile(bucketName, fileName, fileContent) {
  await ensureBucket(bucketName);
  const form = new FormData();
  const blob = new Blob([JSON.stringify(fileContent)], {
    type: "application/json",
  });
  form.append("file", blob, fileName);

  const response = await axios.post(
    `${API_BASE_URL}/buckets/${bucketName}/files`,
    form
  );
  return response.data; // { success: true, data: { RootCID: "..." } }
}

export async function downloadFile(bucketName, fileName) {
  const response = await axios.get(
    `${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`,
    {
      responseType: "json",
    }
  );
  return response.data;
}

export async function listFiles(bucketName) {
  const response = await axios.get(
    `${API_BASE_URL}/buckets/${bucketName}/files`
  );
  return response.data.data; // Array of {Name, RootCID, ...}
}

export async function ensureBucket(bucketName) {
  try {
    const response = await axios.get(`${API_BASE_URL}/buckets`);
    const buckets = response.data.data || [];
    const bucketExists = buckets.some((b) => b.Name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return;
    }
    await axios.post(`${API_BASE_URL}/buckets`, { bucketName });
    console.log(`Bucket ${bucketName} created`);
  } catch (error) {
    console.error(
      "Failed to ensure bucket:",
      error.response?.data || error.message
    );
    throw error; // Let the app handle it, but it won’t hit this now
  }
}























// import React, { useState } from "react";
// import Image from "next/image";
// import DocImg from "@/public/Frame 75.svg";
// import { collection, getDocs, query, where } from "@firebase/firestore";
// import { db } from "./utils/firebase-config";
// import { useWallet } from "@solana/wallet-adapter-react";

// interface PatientDetails {
//   firstName: string;
//   lastName: string;
//   dateOfBirth: number;
//   allergies: string;
//   medicalHistory: string;
//   walletAddress: string;
// }

// interface MedicalRecord {
//   doctorId: string;
//   signsAndSymptoms: string;
//   diagnosis: string;
//   prescription: string;
//   timestamp: number;
//   doctorDetails?: DoctorDetails | null;
// }

// interface DoctorDetails {
//   firstName: string;
//   lastName: string;
// }

// // interface PatientDetailsPopupProps {
// //     patientDetails: PatientDetails | null;
// //     onClose: () => void;
// //     onFetchRecords: () => Promise<MedicalRecord[] | null>;
// //     onUpdateRecords: () => void;
// // }

// interface PatientDetailsPopupProps {
//   patientDetails: PatientDetails | null;
//   onClose: () => void;
//   onFetchRecords: () => Promise<MedicalRecord[] | null>;
//   onUpdateRecords: () => void;
//   signsAndSymptoms: string;
//   setSignsAndSymptoms: (value: string) => void;
//   diagnosis: string;
//   setDiagnosis: (value: string) => void;
//   prescription: string;
//   setPrescription: (value: string) => void;
//   handleUpdateRecords: () => void;
//   loading: boolean;
// }

// const PatientDetailsPopup: React.FC<PatientDetailsPopupProps> = ({
//   patientDetails,
//   onClose,
//   onFetchRecords,
//   onUpdateRecords,
//   signsAndSymptoms,
//   setSignsAndSymptoms,
//   diagnosis,
//   setDiagnosis,
//   prescription,
//   setPrescription,
//   handleUpdateRecords,
//   loading,
// }) => {
//   const [records, setRecords] = useState<MedicalRecord[] | null>(null);
//   // const [componentloading, setComponentLoading] = useState<boolean>(false);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);

//   // const fetchRecords = async () => {
//   //   // setLoading(true);
//   //   try {
//   //     const fetchedRecords = await onFetchRecords();
//   //     if (fetchedRecords) {
//   //       const recordsWithDoctorDetails = await Promise.all(
//   //         fetchedRecords.map(async (record) => {
//   //           const doctorDetails = await fetchDoctorDetails(record.doctorId);
//   //           return { ...record, doctorDetails };
//   //         })
//   //       );
//   //       setRecords(recordsWithDoctorDetails);
//   //     } else {
//   //       console.error(
//   //         "No records found or error occurred while fetching records."
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching records:", error);
//   //   } finally {
//   //     // setLoading(false);
//   //   }
//   // };

//   const fetchRecords = async () => {
//     try {
//       const fetchedRecords = await onFetchRecords();
//       setRecords(fetchedRecords);
//     } catch (error) {
//       console.error("Error fetching records:", error);
//     }
//   };

//   const fetchDoctorDetails = async (
//     doctorId: string
//   ): Promise<DoctorDetails | null> => {
//     try {
//       const doctorsRef = collection(db, "users");
//       const q = query(doctorsRef, where("walletAddress", "==", doctorId));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         return querySnapshot.docs[0].data() as DoctorDetails;
//       } else {
//         console.error("Doctor not found");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching doctor details:", error);
//       return null;
//     }
//   };

//   if (!patientDetails) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//       <div className="bg-white p-4 rounded-lg shadow-lg w-80">
//         <div className="flex justify-end items-center mt-0">
//           <button onClick={onClose} className="text-red-500">
//             &times;
//           </button>
//         </div>
//         {records ? (
//           <div>
//             <div className="flex mb-4 h-16 items-center gap-2">
//               <Image
//                 src={DocImg}
//                 alt="patient profile image"
//                 className="w-16 h-full rounded-lg"
//               />
//               <div>
//                 <h2 className="font-semibold text-base">
//                   {patientDetails.firstName}'s Medical Records
//                 </h2>
//                 <p className="text-sm text-gray-500 leading-none">
//                   Last updated:{" "}
//                   {new Date(records[0]?.timestamp * 1000).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {records.map((record, index) => (
//                 <div key={index}>
//                   <div className="flex mb-4 h-16 items-center gap-2">
//                     <Image
//                       src={DocImg}
//                       alt="doctor profile image"
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-md">
//                         Dr. {record.doctorDetails?.firstName}{" "}
//                         {record.doctorDetails?.lastName}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Updated:{" "}
//                         {new Date(record.timestamp * 1000).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                   <p>
//                     <strong>Signs & Symptoms:</strong> {record.signsAndSymptoms}
//                   </p>
//                   <p>
//                     <strong>Diagnosis:</strong> {record.diagnosis}
//                   </p>
//                   <p>
//                     <strong>Prescription:</strong> {record.prescription}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : showUpdateForm ? (
//           <div>
//             <h3 className="text-lg font-semibold mb-4">
//               Update Medical Record
//             </h3>
//             <input
//               type="text"
//               value={signsAndSymptoms}
//               onChange={(e) => setSignsAndSymptoms(e.target.value)}
//               placeholder="Signs and Symptoms"
//               className="w-full mb-2 p-2 border rounded"
//             />
//             <input
//               type="text"
//               value={diagnosis}
//               onChange={(e) => setDiagnosis(e.target.value)}
//               placeholder="Diagnosis"
//               className="w-full mb-2 p-2 border rounded"
//             />
//             <input
//               type="text"
//               value={prescription}
//               onChange={(e) => setPrescription(e.target.value)}
//               placeholder="Prescription"
//               className="w-full mb-4 p-2 border rounded"
//             />
//             <button
//               onClick={handleUpdateRecords}
//               className="bg-custom-blue text-white w-full py-2 rounded"
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Submit"}
//             </button>
//           </div>
//         ) : (
//           <div>
//             <div className="flex mt-1 w-full h-20 gap-2 mb-4 items-center">
//               <Image
//                 src={DocImg}
//                 alt="patient profile image"
//                 className="w-16 h-16 rounded-lg"
//               />
//               <div className="flex flex-col justify-between h-full">
//                 <button
//                   onClick={fetchRecords}
//                   className="bg-custom-blue text-white px-4 py-2 h-9 text-sm rounded"
//                 >
//                   Get Medical Record
//                 </button>
//                 <button
//                   onClick={() => setShowUpdateForm(true)}
//                   className="bg-white text-custom-blue border border-custom-blue text-sm px-4 py-2 h-9 rounded"
//                 >
//                   Update Medical Record
//                 </button>
//               </div>
//             </div>
//             <p>
//               <strong>Name:</strong> {patientDetails.firstName}{" "}
//               {patientDetails.lastName}
//             </p>
//             <p>
//               <strong>Age:</strong>{" "}
//               {new Date().getFullYear() -
//                 new Date(patientDetails.dateOfBirth || "").getFullYear()}{" "}
//               years old
//             </p>
//             <p>
//               <strong>Allergies:</strong> {patientDetails.allergies}
//             </p>
//             <p className="mb-4">
//               <strong>Underlying Conditions:</strong>{" "}
//               {patientDetails.medicalHistory}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientDetailsPopup;