"use client";

// import { UserButton } from "@civic/auth-web3/react";
import { useUser } from "@civic/auth-web3/react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Logo from "@/public/logo.svg";
import DocsNPatient from "@/public/docsnpatient.svg";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useWallet } from "@solana/wallet-adapter-react";

function ConnectWallet() {
  const { signIn } = useUser();
  // const { connected } = useWallet();
  const router = useRouter();
  // const [isConfirmed, setIsConfirmed] = useState(false);
  // const [message, setMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   if (connected && isConfirmed) {
  //     setMessage("Wallet set successfully. Redirecting...");

  //     const timer = setTimeout(() => {
  //       router.push("/connected");
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [connected, isConfirmed, router]);

  // const handleConfirm = () => {
  //   setIsConfirmed(true);
  // };

  const handleSignIn = useCallback(() => {
    console.log("Starting sign-in process");
    signIn()
      .then(() => {
        toast.success("Sign-in completed successfully, please wait!");
        router.push("/patient/userHome");
      })
      .catch((error: any) => {
        console.error("Sign-in failed:", error);
      });
  }, [signIn]);

  return (
    <main className="w-11/12 max-w-lg mx-auto font-urbanist min-h-screen flex flex-col pt-10 mb-0">
      <Image src={Logo} alt="logo" className="w-4/12 h-38 mx-auto" />
      <div className="flex flex-col justify-center align-center w-full">
        <h1 className="font-jakarta font-bold mt-10 text-custom-blue text-xl text-center">
          Health Care Brought Closer
        </h1>
        <p className="text-custom-grey text-base text-center p-2">
          Schedule appointments with doctors, Book online consultations, Request
          drug delivery services - just with one click!
        </p>
      </div>
      <Image
        src={DocsNPatient}
        alt="Docs and a Patient"
        className="w-8/12 mt-16 mb-18 mx-auto"
      />
      <div className="w-full flex flex-col justify-center items-center mt-4">
        {/* <WalletMultiButton
          style={{
            backgroundColor: "#3772FF",
            color: "#F9F9F9",
            padding: "15px 32px",
            fontSize: "18px",
            borderRadius: "16px",
            border: "none",
            width: "350px",
            height: "54px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        />
        {connected && (
          <>
            <p
              className={`my-2 leading-none text-sm text-center ${
                isConfirmed ? "text-green-600" : "text-custom-blue"
              }`}
            >
              {message ||
                "You'll always use this wallet for your account, confirm?"}
            </p>
            {!isConfirmed && (
              <button
                onClick={handleConfirm}
                className="bg-white text-lg outline-0 text-custom-blue border flex justify-center items-center border-custom-blue font-semibold h-14 rounded-2xl p-0 w-[350px]"
              >
                Confirm Wallet Connection
              </button>
            )}
          </>
        )} */}
        <button
          style={{
            backgroundColor: "#3772FF",
            color: "#F9F9F9",
            padding: "15px 32px",
            fontSize: "18px",
            borderRadius: "16px",
            border: "none",
            width: "350px",
            height: "54px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
            outline: "none",
            cursor: "pointer",
          }}
          onClick={handleSignIn}
        >
          Sign In
        </button>
      </div>
      <ToastContainer />
    </main>
  );
}

export default ConnectWallet;
