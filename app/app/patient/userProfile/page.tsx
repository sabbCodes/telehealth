"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/components/utils/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UserDp from "@/public/userdp.svg";
import ArrowLeft from "@/public/arrow-left.svg";
import HomeInactive from "@/public/homeInactive.svg";
import ScheduleInactive from "@/public/story.svg";
import MessagesInactive from "@/public/messages-inactive.svg";
import ProfileActive from "@/public/profileActive.svg";
import Link from "next/link";
import { toast } from "react-toastify";
import DnaLoader from "@/app/components/DnaLoader";
import { useUser } from "@civic/auth-web3/react";
import { useWallet } from "@civic/auth-web3/react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

function Profile() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    walletAddress: "",
    avatar: "",
  });
  // const [userWallet, setUserWallet] = useState<string | null>(null);
  // const { user } = useUser();
  // const { address } = useWallet({ type: "solana" });

  // const useConnection = () => {
  //   const [connection, setConnection] = useState<Connection | null>(null);

  //   useEffect(() => {
  //     const con = new Connection(clusterApiUrl("devnet"));
  //     setConnection(con);
  //   }, []);

  //   return { connection };
  // };

  // const useBalance = () => {
  //   const [balance, setBalance] = useState<number>();
  //   // The Solana Wallet Adapter hooks
  //   const { connection } = useConnection();
  //   const { address } = useWallet({ type: "solana" });

  //   const publicKey = address ? new PublicKey(address) : null;

  //   if (connection && publicKey) {
  //     connection.getBalance(publicKey).then(setBalance);
  //   }

  //   return balance;
  // };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            dateOfBirth: data.dateOfBirth || "",
            gender: data.gender || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            walletAddress: data.walletAddress || "",
            avatar: data.avatar || "",
          });
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize formData with Civic user data
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/");
  //     return;
  //   }

  //   setUserWallet(address || null);

  //   setFormData({
  //     firstName: user?.name || "",
  //     dateOfBirth: "1989-09-30",
  //     gender: "",
  //     phoneNumber: user.id,
  //     email: user.email || "",
  //     walletAddress: userWallet || "",
  //     avatar: user.picture || UserDp.src,
  //   });
  //   setLoading(false);
  // }, [user]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, formData);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Error updating profile. Try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.walletAddress);
    toast.success("Wallet address copied!");
  };

  // const balance = useBalance();

  if (loading) return <DnaLoader />;

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col">
      <div>
        <div className="flex mt-5">
          <Image src={ArrowLeft} alt="Back" onClick={() => router.back()} />
          <h1 className="font-bold text-center block mx-auto">Profile</h1>
        </div>

        <div className="flex justify-between items-center p-2 mt-16">
          <label className="cursor-pointer">
            {editMode ? (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            ) : null}
            <img
              src={formData.avatar || UserDp}
              alt="Profile Picture"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </label>
          <p className="text-sm font-medium">
            Balance:{" "}
            <strong>
              {/* {balance !== null && balance !== undefined
                ? `${balance / 1e9} SOL`
                : "Loading..."} */}
              0 Sol
            </strong>
          </p>
          {editMode ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 outline-none rounded-md text-white w-[87px] p-2 text-sm font-medium"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-custom-blue outline-none rounded-md text-white w-[87px] p-2 text-sm font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-6 w-full">
          {[
            {
              label: "Name",
              value: `${formData.firstName}`,
              name: ["firstName", "lastName"],
            },
            {
              label: "D.O.B",
              value: formData.dateOfBirth,
              name: "dateOfBirth",
              type: "date",
            },
            { label: "Gender", value: formData.gender, name: "gender" },
            {
              label: "Phone",
              value: formData.phoneNumber,
              name: "phoneNumber",
            },
            { label: "Email", value: formData.email, name: "email" },
            {
              label: "Wallet Address",
              value: formData.walletAddress,
              name: "walletAddress",
            },
          ].map((field, i) => (
            <div key={i} className="p-2 border-b border-grey-200">
              <p className="text-xs text-gray-400 font-normal">{field.label}</p>
              {field.label === "Wallet Address" ? (
                <p
                  onClick={copyToClipboard}
                  className="text-sm font-normal cursor-pointer text-blue-500"
                >
                  {field.value}
                </p>
              ) : field.label === "Email" ? (
                <p className="text-sm font-normal">{field.value}</p>
              ) : editMode ? (
                Array.isArray(field.name) ? (
                  <div className="flex gap-2">
                    {field.name.map((n, idx) => (
                      <input
                        key={idx}
                        type="text"
                        name={n}
                        value={(formData as any)[n]}
                        onChange={handleInputChange}
                        className="w-full text-sm font-normal bg-transparent outline-none"
                      />
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name as string}
                    value={(formData as any)[field.name as string]}
                    onChange={handleInputChange}
                    className="w-full text-sm font-normal bg-transparent outline-none"
                  />
                )
              ) : (
                <p className="text-sm font-normal">{field.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="w-full sm:max-w-lg sm:mx-auto fixed bottom-0 left-0 right-0 shadow-3xl bg-white">
        <nav className="w-full flex gap-14 justify-evenly items-center py-4 px-14">
          <Link href="/patient/userHome">
            <Image src={HomeInactive} alt="home icon" />
          </Link>
          <Link href="/patient/schedule">
            <Image src={ScheduleInactive} alt="Schedule icon" />
          </Link>
          <Link href="/patient/messages">
            <Image src={MessagesInactive} alt="Messages icon" />
          </Link>
          <Link href="/patient/userProfile">
            <Image src={ProfileActive} alt="Profile icon" />
          </Link>
        </nav>
      </footer>
    </main>
  );
}

export default Profile;
