// import { db } from "@/app/components/firebase-config";
// import { addDoc, collection } from "@firebase/firestore";
// import {
//   ActionPostResponse,
//   ACTIONS_CORS_HEADERS,
//   createPostResponse,
//   ActionGetResponse,
//   ActionPostRequest,
// } from "@solana/actions";
// import {
//   clusterApiUrl,
//   Connection,
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   SystemProgram,
//   Transaction,
// } from "@solana/web3.js";

// const PLATFORM_ADDRESS: PublicKey = new PublicKey(
//   "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42",
// );

// const DOCTOR_SABB_ADDRESS: PublicKey = new PublicKey(
//   "4K297jX1o9XN8zLhohkBEMVEEXVmssBLWNHpuRQuJBiA",
// );

// const DOCTOR_ABDALLAH_ADDRESS: PublicKey = new PublicKey(
//   "74bd3SEfw5hkLx8xLnx7NLvLjjTsK2tV6TKRZxEvB1GL",
// );

// const DOCTOR_SABB_FEE = 0.1;
// const DOCTOR_ABDALLAH_FEE = 0.2;

// // export const GET = async (req: Request) => {
// //   const reqURL = new URL(req.url);
// //   const iconUrl = new URL("/teleHealth.jpg", reqURL.origin);

// //   const payload: ActionGetResponse = {
// //     title: "Schedule a session with your favourite doctors from around the world - with just a single click!",
// //     icon: iconUrl.toString(),
// //     description: "Book a session with your favorite DOCTOR",
// //     label: "Book a session",
// //     links: {
// //       actions: [
// //         {
// //           href: req.url+'?date={date}&time={time}&doctor={doctor}',
// //           label: "Schedule meeting now!",
// //           parameters: [
// //             {
// //               type: "date",
// //               name: "date",
// //               label: "Session date",
// //               required: true
// //             },
// //             {
// //               type: "select",
// //               name: "time",
// //               options: [
// //                 {
// //                   value: "8 AM",
// //                   label: "8 AM"
// //                 },
// //                 {
// //                   value: "9 AM",
// //                   label: "9 AM"
// //                 },
// //                 {
// //                   value: "10 AM",
// //                   label: "10 AM"
// //                 },
// //                 {
// //                   value: "11 AM",
// //                   label: "11 AM"
// //                 },
// //                 {
// //                   value: "12 PM",
// //                   label: "12 PM"
// //                 }
// //               ],
// //               required: true
// //             },
// //             {
// //               type: "select",
// //               name: "doctor",
// //               options: [
// //                 {
// //                   value: "Dr. Abdallah",
// //                   label: "Dr. Abdallah"
// //                 },
// //                 {
// //                   value: "Dr. Sabb",
// //                   label: "Dr. Sabb"
// //                 }
// //               ],
// //               required: true
// //             }
// //           ]
// //         }
// //       ]
// //     },
// //     type: "action",
// //     error: {
// //       message: "Please use the wallet which you registered on teleHealthSol!"
// //     }
// //   };

// //   const headers = {
// //     ...ACTIONS_CORS_HEADERS,
// //     "X-Action-Version": "1",
// //     "X-Blockchain-Ids": "solana",
// //   }

// //   return new Response(JSON.stringify(payload), { headers });
// // };

// export const GET = async (req: Request) => {
//   const reqURL = new URL(req.url);
//   const iconUrl = new URL("/teleHealth.jpg", reqURL.origin);

//   const payload: ActionGetResponse = {
//     type: "action",
//     title: "Schedule a session with your favourite doctors from around the world - with just a single click!",
//     icon: iconUrl.toString(),
//     description: "Book a session with your favorite DOCTOR",
//     label: "Book a session",
//     links: {
//       actions: [
//         {
//           href: `${req.url}?date={date}&time={time}&doctor={doctor}`,
//           label: "Schedule meeting now!",
//           parameters: [
//             {
//               name: "date",
//               type: "date",
//               label: "Session date",
//               required: true
//             },
//             {
//               name: "time",
//               type: "select",
//               label: "Session time",
//               options: [
//                 { value: "8 AM", label: "8 AM" },
//                 { value: "9 AM", label: "9 AM" },
//                 { value: "10 AM", label: "10 AM" },
//                 { value: "11 AM", label: "11 AM" },
//                 { value: "12 PM", label: "12 PM" }
//               ],
//               required: true
//             },
//             {
//               name: "doctor",
//               type: "select",
//               label: "Choose doctor",
//               options: [
//                 { value: "Dr. Abdallah", label: "Dr. Abdallah" },
//                 { value: "Dr. Sabb", label: "Dr. Sabb" }
//               ],
//               required: true
//             }
//           ]
//         }
//       ]
//     }
//   };

//   const headers = {
//     ...ACTIONS_CORS_HEADERS,
//     "X-Action-Version": "1",
//     "X-Blockchain-Ids": "solana",
//   }

//   return new Response(JSON.stringify(payload), { headers });
// };

// // export const OPTIONS = async () => {
// //   return new Response(null, {
// //     headers: ACTIONS_CORS_HEADERS,
// //     status: 204
// //   });
// // };

// export const OPTIONS = async (req: Request) => {
//   return new Response(null, {
//     headers: {
//       ...ACTIONS_CORS_HEADERS,
//       "X-Action-Version": "1",
//       "X-Blockchain-Ids": "solana",
//     }
//   });
// };

// // export const POST = async (req: Request) => {
// //   const body: ActionPostRequest = await req.json();

// //   const url = new URL(req.url);
// //   const date = url.searchParams.get('date');
// //   const time = url.searchParams.get('time');
// //   const doctor = url.searchParams.get('doctor');

// //   // Determine the consultation fee and doctor’s wallet address
// //   let consultationFeeInSol = 0;
// //   let doctorWalletAddress = '';

// //   if (doctor === 'Dr. Sabb') {
// //       consultationFeeInSol = DOCTOR_SABB_FEE;
// //       doctorWalletAddress = DOCTOR_SABB_ADDRESS.toBase58();
// //   } else if (doctor === 'Dr. Abdallah') {
// //       consultationFeeInSol = DOCTOR_ABDALLAH_FEE;
// //       doctorWalletAddress = DOCTOR_ABDALLAH_ADDRESS.toBase58();
// //   } else {
// //       return new Response('Invalid doctor selected', {
// //           status: 400,
// //           headers: ACTIONS_CORS_HEADERS,
// //       });
// //   }

// //   const platformFeeInLamports = Math.round((consultationFeeInSol * 0.1) * LAMPORTS_PER_SOL);
// //   const doctorFeeInLamports = Math.round((consultationFeeInSol * 0.9) * LAMPORTS_PER_SOL);

// //   let accountPubKey: PublicKey;
// //   try {
// //       accountPubKey = new PublicKey(body.account);
// //   } catch (err) {
// //     console.error("error fetching pubkey", err);
// //       return new Response('Invalid "account" provided', {
// //           status: 400,
// //           headers: ACTIONS_CORS_HEADERS,
// //       });
// //   }

// //   const connection = new Connection(clusterApiUrl("devnet"));
// //   const { blockhash } = await connection.getLatestBlockhash();

// //   const transaction = new Transaction({
// //     recentBlockhash: blockhash,
// //     feePayer: accountPubKey,
// //   }).add(
// //     SystemProgram.transfer({
// //       fromPubkey: accountPubKey,
// //       toPubkey: PLATFORM_ADDRESS,
// //       lamports: platformFeeInLamports,
// //     }),
// //     SystemProgram.transfer({
// //       fromPubkey: accountPubKey,
// //       toPubkey: new PublicKey(doctorWalletAddress),
// //       lamports: doctorFeeInLamports,
// //     })
// //   );

// //   const payload: ActionPostResponse = await createPostResponse({
// //       fields: {
// //           transaction,
// //           message: `Booking confirmed with ${doctor} for ${date} at ${time}. You can head to teleHealthSol to have your session!`,
// //       },
// //   });

// //   const bookingDetails = {
// //     userId: accountPubKey.toBase58(),
// //     doctorId: doctorWalletAddress,
// //     date: date,
// //     time: time,
// //     status: 'Booked',
// //   };

// //   await addDoc(collection(db, 'bookings'), bookingDetails);

// //   const headers = {
// //     ...ACTIONS_CORS_HEADERS,
// //     "X-Action-Version": "1",
// //     "X-Blockchain-Ids": "solana",
// //   }

// //   return new Response(JSON.stringify(payload), {
// //     headers: headers,
// //     status: 200
// //   });
// // };



// export const POST = async (req: Request) => {
//   try {
//     const body: ActionPostRequest = await req.json();

//     const url = new URL(req.url);
//     const date = url.searchParams.get('date');
//     const time = url.searchParams.get('time');
//     const doctor = url.searchParams.get('doctor');

//     // Determine the consultation fee and doctor’s wallet address
//     let consultationFeeInSol = 0;
//     let doctorWalletAddress = '';

//     if (doctor === 'Dr. Sabb') {
//         consultationFeeInSol = DOCTOR_SABB_FEE;
//         doctorWalletAddress = DOCTOR_SABB_ADDRESS.toBase58();
//     } else if (doctor === 'Dr. Abdallah') {
//         consultationFeeInSol = DOCTOR_ABDALLAH_FEE;
//         doctorWalletAddress = DOCTOR_ABDALLAH_ADDRESS.toBase58();
//     } else {
//         return new Response('Invalid doctor selected', {
//             status: 400,
//             headers: ACTIONS_CORS_HEADERS,
//         });
//     }

//     const platformFeeInLamports = Math.round((consultationFeeInSol * 0.1) * LAMPORTS_PER_SOL);
//     const doctorFeeInLamports = Math.round((consultationFeeInSol * 0.9) * LAMPORTS_PER_SOL);

//     let accountPubKey: PublicKey;
//     try {
//         accountPubKey = new PublicKey(body.account);
//     } catch (err) {
//       console.error("error fetching pubkey", err);
//         return new Response('Invalid "account" provided', {
//             status: 400,
//             headers: ACTIONS_CORS_HEADERS,
//         });
//     }

//     const connection = new Connection(clusterApiUrl("devnet"));
//     const { blockhash } = await connection.getLatestBlockhash();

//     const transaction = new Transaction({
//       recentBlockhash: blockhash,
//       feePayer: accountPubKey,
//     }).add(
//       SystemProgram.transfer({
//         fromPubkey: accountPubKey,
//         toPubkey: PLATFORM_ADDRESS,
//         lamports: platformFeeInLamports,
//       }),
//       SystemProgram.transfer({
//         fromPubkey: accountPubKey,
//         toPubkey: new PublicKey(doctorWalletAddress),
//         lamports: doctorFeeInLamports,
//       })
//     );

//     const payload: ActionPostResponse = await createPostResponse({
//       fields: {
//         transaction, // Your transaction logic here
//         message: `Booking confirmed with ${doctor} for ${date} at ${time}. You can head to teleHealthSol to have your session!`,
//       },
//     });

//     const bookingDetails = {
//       userId: accountPubKey.toBase58(),
//       doctorId: doctorWalletAddress,
//       date: date,
//       time: time,
//       status: 'Booked',
//     };
  
//     await addDoc(collection(db, 'bookings'), bookingDetails);

//     const headers = {
//       ...ACTIONS_CORS_HEADERS,
//       "X-Action-Version": "1",
//       "X-Blockchain-Ids": "solana",
//     };

//     return new Response(JSON.stringify(payload), { 
//       headers: headers,
//       status: 200
//     });
//   } catch (error) {
//     console.error('Error in POST function:', error);
    
//     const errorHeaders = {
//       ...ACTIONS_CORS_HEADERS,
//       "X-Action-Version": "1",
//       "X-Blockchain-Ids": "solana",
//     };

//     return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
//       headers: errorHeaders,
//       status: 500
//     });
//   }
// };




/**
 * Solana Actions Example
 */

import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
// import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

const DEFAULT_SOL_ADDRESS: PublicKey = new PublicKey("Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42");
const DEFAULT_SOL_AMOUNT: number = 1.2;

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/transfer-sol?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "Actions Example - Transfer Native SOL",
      icon: new URL("/solana_devs.jpg", requestUrl.origin).toString(),
      description: "Transfer SOL to another Solana wallet",
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: "Send 1 SOL", // button text
            href: `${baseHref}&amount=${"1"}`,
          },
          {
            label: "Send 5 SOL", // button text
            href: `${baseHref}&amount=${"5"}`,
          },
          {
            label: "Send 10 SOL", // button text
            href: `${baseHref}&amount=${"10"}`,
          },
          {
            label: "Send SOL", // button text
            href: `${baseHref}&amount={amount}`, // this href will have a text input
            parameters: [
              {
                name: "amount", // parameter name in the `href` above
                label: "Enter the amount of SOL to send", // placeholder of the text input
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0, // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: toPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    // versioned transactions are also supported
    // const transaction = new VersionedTransaction(
    //   new TransactionMessage({
    //     payerKey: account,
    //     recentBlockhash: blockhash,
    //     instructions: [transferSolInstruction],
    //   }).compileToV0Message(),
    //   // note: you can also use `compileToLegacyMessage`
    // );

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    toPubkey,
  };
}