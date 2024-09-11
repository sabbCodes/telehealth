// import { db } from "@/app/components/firebase-config";
// import { addDoc, collection } from "@firebase/firestore";
// import {
//   ActionPostResponse,
//   ACTIONS_CORS_HEADERS,
//   createPostResponse,
//   ActionGetResponse,
//   ActionPostRequest,
//   createActionHeaders,
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

// const headers = {
//   ...createActionHeaders({
//     chainId: "devnet", // or "mainnet"
//     actionVersion: "2.2.1",
//   }),
//   'Content-Type': 'application/json',
// }

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
//           href: `/api/action?date={date}&time={time}&doctor={doctor}`,
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

//   return new Response(JSON.stringify(payload), { headers });
// };

// export const OPTIONS = async (req: Request) => {
//   return new Response(null, { headers });
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
// //     consultationFeeInSol = DOCTOR_SABB_FEE;
// //     doctorWalletAddress = DOCTOR_SABB_ADDRESS.toBase58();
// //   } else if (doctor === 'Dr. Abdallah') {
// //     consultationFeeInSol = DOCTOR_ABDALLAH_FEE;
// //     doctorWalletAddress = DOCTOR_ABDALLAH_ADDRESS.toBase58();
// //   } else {
// //     return new Response('Invalid doctor selected', {
// //       status: 400,
// //       headers: headers, // Use correct headers here
// //     });
// //   }

// //   const platformFeeInLamports = Math.round((consultationFeeInSol * 0.1) * LAMPORTS_PER_SOL);
// //   const doctorFeeInLamports = Math.round((consultationFeeInSol * 0.9) * LAMPORTS_PER_SOL);

// //   let accountPubKey: PublicKey;
// //   try {
// //     accountPubKey = new PublicKey(body.account);
// //   } catch (err) {
// //     console.error("error fetching pubkey", err);
// //     return new Response('Invalid "account" provided', {
// //       status: 400,
// //       headers: headers, // Use correct headers here
// //     });
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
// //     fields: {
// //       transaction,
// //       message: `Booking confirmed with ${doctor} for ${date} at ${time}. You can head to teleHealthSol to have your session!`,
// //     },
// //   });

// //   const bookingDetails = {
// //     userId: accountPubKey.toBase58(),
// //     doctorId: doctorWalletAddress,
// //     date: date,
// //     time: time,
// //     status: 'Booked',
// //   };

// //   await addDoc(collection(db, 'bookings'), bookingDetails);

// //   return new Response(JSON.stringify(payload), {
// //     headers: headers, // Use correct headers here
// //     status: 200
// //   });
// // };


// export const POST = async (req: Request) => {
//   const body: ActionPostRequest = await req.json();

//   const url = new URL(req.url);
//   const date = url.searchParams.get('date');
//   const time = url.searchParams.get('time');
//   const doctor = url.searchParams.get('doctor');

//   // Determine the consultation fee and doctor's wallet address
//   let consultationFeeInSol = 0;
//   let doctorWalletAddress = '';

//   if (doctor === 'Dr. Sabb') {
//     consultationFeeInSol = DOCTOR_SABB_FEE;
//     doctorWalletAddress = DOCTOR_SABB_ADDRESS.toBase58();
//   } else if (doctor === 'Dr. Abdallah') {
//     consultationFeeInSol = DOCTOR_ABDALLAH_FEE;
//     doctorWalletAddress = DOCTOR_ABDALLAH_ADDRESS.toBase58();
//   } else {
//     return new Response('Invalid doctor selected', {
//       status: 400,
//       headers: headers, // Use correct headers here
//     });
//   }

//   const platformFeeInLamports = Math.round((consultationFeeInSol * 0.1) * LAMPORTS_PER_SOL);
//   const doctorFeeInLamports = Math.round((consultationFeeInSol * 0.9) * LAMPORTS_PER_SOL);

//   let accountPubKey: PublicKey;
//   try {
//     accountPubKey = new PublicKey(body.account);
//   } catch (err) {
//     console.error("error fetching pubkey", err);
//     return new Response('Invalid "account" provided', {
//       status: 400,
//       headers: headers, // Use correct headers here
//     });
//   }

//   const connection = new Connection(clusterApiUrl("devnet"));
//   const { blockhash } = await connection.getLatestBlockhash();

//   const transaction = new Transaction({
//     recentBlockhash: blockhash,
//     feePayer: accountPubKey,
//   }).add(
//     SystemProgram.transfer({
//       fromPubkey: accountPubKey,
//       toPubkey: PLATFORM_ADDRESS,
//       lamports: platformFeeInLamports,
//     }),
//     SystemProgram.transfer({
//       fromPubkey: accountPubKey,
//       toPubkey: new PublicKey(doctorWalletAddress),
//       lamports: doctorFeeInLamports,
//     })
//   );

//   const payload: ActionPostResponse = await createPostResponse({
//     fields: {
//       transaction,
//       message: `Booking confirmed with ${doctor} for ${date} at ${time}. You can head to teleHealthSol to have your session!`,
//     },
//   });

//   const bookingDetails = {
//     userId: accountPubKey.toBase58(),
//     doctorId: doctorWalletAddress,
//     date: date,
//     time: time,
//     status: 'Booked',
//   };

//   await addDoc(collection(db, 'bookings'), bookingDetails);

//   return new Response(JSON.stringify(payload), {
//     headers: headers, // Use correct headers here
//     status: 200
//   });
// };











import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from '@solana/actions';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const headers = createActionHeaders({
  chainId: 'mainnet',
  actionVersion: '2.2.1',
});

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/donate-sol-chaining-inline?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Donate SOL to Alice',
      icon: 'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/',
      description:
        'Cybersecurity Enthusiast | Support my research with a donation.',
      label: 'Transfer', // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: 'Send SOL', // button text
            href: `${baseHref}&amount={amount}`, // this href will have a text input
            parameters: [
              {
                type: 'select',
                name: 'amount', // parameter name in the `href` above
                label: 'Donation Amount in SOL', // placeholder of the text input
                required: true,
                options: [
                  { label: '0.01', value: '0.01' },
                  { label: '1', value: '1' },
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                ],
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
    let message = 'An unknown error occurred';
    if (typeof err == 'string') message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async (req: Request) => {
  return new Response(null, { headers });
};

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
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl('mainnet-beta'),
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
        message: `Sent ${amount} SOL to Alice: ${toPubkey.toBase58()}`,
        links: {
          next: {
            type: 'inline',
            action: {
              type: 'action',
              icon: 'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/',
              label: 'Thank You!',
              title: 'Donate SOL to Alice',
              disabled: true,
              description:
                'Cybersecurity Enthusiast | Support my research with a donation.',
            },
          },
        },
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = 'An unknown error occurred';
    if (typeof err == 'string') message = err;
    return new Response(message, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = new PublicKey(
    'FWXHZxDocgchBjADAxSuyPCVhh6fNLT7DUggabAsuz1y',
  );
  let amount: number = 0.1;

  try {
    if (requestUrl.searchParams.get('to')) {
      toPubkey = new PublicKey(requestUrl.searchParams.get('to')!);
    }
  } catch (err) {
    throw 'Invalid input query parameter: to';
  }

  try {
    if (requestUrl.searchParams.get('amount')) {
      amount = parseFloat(requestUrl.searchParams.get('amount')!);
    }

    if (amount <= 0) throw 'amount is too small';
  } catch (err) {
    throw 'Invalid input query parameter: amount';
  }

  return {
    amount,
    toPubkey,
  };
}