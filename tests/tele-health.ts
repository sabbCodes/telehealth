// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { TeleHealth } from "../target/types/tele_health";
// import { assert } from "chai";

// describe("tele-health", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.TeleHealth as Program<TeleHealth>;

//   it('Can create a new record with details', async () => {
//     const doctorKeypair = anchor.web3.Keypair.generate();

//     await program.methods.enterHealthRecord
//       (
//       "AXisVZ9Aus6PVdnCNWSD6oHHMM16SF1Vs49aqtRVPvSy",
//       "Headache, body pain and fever",
//       "Acute malaria",
//       "Artemether forte, paracetamol and ibuprophen",
//     ).accounts({
//       recordEntry: doctorKeypair.publicKey,
//       doctor: program.provider.publicKey,
//       // systemProgram: anchor.web3.SystemProgram.programId,
//     })
//     .signers([doctorKeypair])
//     .rpc();

//     const recordAcct = await program.account.recordDetailsEntry.fetch(
//       doctorKeypair.publicKey
//     );

//     console.log(recordAcct);
//   });

//   // it('Can create a new record by a new doctor', async () => {
//   //   const newDoctor = anchor.web3.Keypair.generate();
//   //   const doctorKeypair = anchor.web3.Keypair.generate();
//   //   console.log("New doctor's keypair: ", doctorKeypair.publicKey.toBase58());

//   //   const sign = await program.provider.connection.requestAirdrop(
//   //     newDoctor.publicKey,
//   //     1000000000
//   //   );

//   //   const latestBlockHash = await program.provider.connection.getLatestBlockhash();

//   //   await program.provider.connection.confirmTransaction({
//   //     blockhash: latestBlockHash,
//   //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//   //     signature: sign
//   //   });

//   //   await program.methods.enterHealthRecord
//   //     (
//   //     "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42",
//   //     "RTA, laboured breathing, fracture of cervical vertebrae, damage to the spinal cord above C5",
//   //     "Damage to the phrenic nerve",
//   //     "No need, patient is eager to meet his Lord!!"
//   //   ).accounts({
//   //     recordEntry: doctorKeypair.publicKey,
//   //     doctor: newDoctor.publicKey,
//   //     // systemProgram: anchor.web3.SystemProgram.programId,
//   //   })
//   //   .signers([newDoctor, doctorKeypair])
//   //   .rpc();

//   //   const recordAcct = await program.account.recordDetailsEntry.fetch(
//   //     doctorKeypair.publicKey
//   //   );

//   //   console.log(recordAcct);

//   //   assert.equal(
//   //     recordAcct.author.toBase58(),
//   //     newDoctor.publicKey.toBase58()
//   //   );
//   //   assert.equal(
//   //     recordAcct.signsNSymptoms,
//   //     "RTA, laboured breathing, fracture of cervical vertebrae, damage to the spinal cord above C5"
//   //   );
//   //   assert.equal(recordAcct.diagnosis, "Damage to the phrenic nerve");
//   //   assert.equal(recordAcct.prescription, "No need, patient is eager to meet his Lord!!");
//   // });

//   it('Can create a new record with new user details', async () => {
//     const doctorKeypair = anchor.web3.Keypair.generate();

//     await program.methods.enterHealthRecord
//       (
//       "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42",
//       "Pain in scrotum",
//       "Inguinal hernia suspected",
//       "Correctional surgery",
//     ).accounts({
//       recordEntry: doctorKeypair.publicKey,
//       doctor: program.provider.publicKey,
//       // systemProgram: anchor.web3.SystemProgram.programId,
//     })
//     .signers([doctorKeypair])
//     .rpc();

//     const recordAcct = await program.account.recordDetailsEntry.fetch(
//       doctorKeypair.publicKey
//     );

//     console.log(recordAcct);
//   });
// });











// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { TeleHealth } from "../target/types/tele_health";
// import { assert } from "chai";

// describe("tele-health", () => {
//   // Configure the client to use the local cluster (or devnet if deployed there).
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);
//   const program = anchor.workspace.TeleHealth as Program<TeleHealth>;

//   it("Can create a new record with Akave CID", async () => {
//     // const doctorKeypair = anchor.web3.Keypair.generate();
//     const recordEntryKeypair = anchor.web3.Keypair.generate();

//     // Mock patient ID (a Solana pubkey) and Akave CID
//     const patientId = "AXisVZ9Aus6PVdnCNWSD6oHHMM16SF1Vs49aqtRVPvSy";
//     const akaveCid =
//       "bafybeibryss7wclbk6nudibrot4ezjne6t5lmhaquxadaq2cexyllzhm4a";

//     await program.methods
//       .enterHealthRecord(patientId, akaveCid)
//       .accounts({
//         recordEntry: recordEntryKeypair.publicKey,
//         doctor: provider.wallet.publicKey,
//         // systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([recordEntryKeypair])
//       .rpc();

//     const recordAcct = await program.account.recordDetailsEntry.fetch(
//       recordEntryKeypair.publicKey
//     );

//     console.log("Record account:", recordAcct);

//     assert.equal(
//       recordAcct.doctor.toBase58(),
//       provider.wallet.publicKey.toBase58()
//     );
//     assert.equal(recordAcct.patientId, patientId);
//     assert.equal(recordAcct.akaveCid, akaveCid);
//     assert.isTrue(recordAcct.timestamp instanceof anchor.BN);
//   });

//   it("Can create a record with a new doctor", async () => {
//     const newDoctor = anchor.web3.Keypair.generate();
//     const recordEntryKeypair = anchor.web3.Keypair.generate();

//     // Airdrop SOL to new doctor for fees
//     const airdropSig = await provider.connection.requestAirdrop(
//       newDoctor.publicKey,
//       1_000_000_000 // 1 SOL
//     );
//     const latestBlockHash = await provider.connection.getLatestBlockhash();
//     await provider.connection.confirmTransaction({
//       blockhash: latestBlockHash.blockhash,
//       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//       signature: airdropSig,
//     });

//     const patientId = "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42";
//     const akaveCid = "bafybeidexamplecidfornewdoctorrecord1234567890abcdefghi";

//     await program.methods
//       .enterHealthRecord(patientId, akaveCid)
//       .accounts({
//         recordEntry: recordEntryKeypair.publicKey,
//         doctor: newDoctor.publicKey,
//         // systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([newDoctor, recordEntryKeypair])
//       .rpc();

//     const recordAcct = await program.account.recordDetailsEntry.fetch(
//       recordEntryKeypair.publicKey
//     );

//     console.log("Record account (new doctor):", recordAcct);

//     assert.equal(recordAcct.doctor.toBase58(), newDoctor.publicKey.toBase58());
//     assert.equal(recordAcct.patientId, patientId);
//     assert.equal(recordAcct.akaveCid, akaveCid);
//     assert.isTrue(recordAcct.timestamp instanceof anchor.BN);
//   });

//   it("Fails if patient ID is too long", async () => {
//     // const doctorKeypair = anchor.web3.Keypair.generate();
//     const recordEntryKeypair = anchor.web3.Keypair.generate();

//     const patientId = "A".repeat(45); // Exceeds 44 chars
//     const akaveCid = "bafybeishortcid";

//     try {
//       await program.methods
//         .enterHealthRecord(patientId, akaveCid)
//         .accounts({
//           recordEntry: recordEntryKeypair.publicKey,
//           doctor: provider.wallet.publicKey,
//           // systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .signers([recordEntryKeypair])
//         .rpc();
//       assert.fail("Expected transaction to fail due to long patient ID");
//     } catch (error) {
//       assert.include(error.message, "PatientIdTooLong");
//     }
//   });

//   it("Fails if Akave CID is too long", async () => {
//     // const doctorKeypair = anchor.web3.Keypair.generate();
//     const recordEntryKeypair = anchor.web3.Keypair.generate();

//     const patientId = "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42";
//     const akaveCid = "bafybei" + "x".repeat(60); // Exceeds 64 chars

//     try {
//       await program.methods
//         .enterHealthRecord(patientId, akaveCid)
//         .accounts({
//           recordEntry: recordEntryKeypair.publicKey,
//           doctor: provider.wallet.publicKey,
//           // systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .signers([recordEntryKeypair])
//         .rpc();
//       assert.fail("Expected transaction to fail due to long Akave CID");
//     } catch (error) {
//       assert.include(error.message, "AkaveCidTooLong");
//     }
//   });
// });



  // const createEntry = useMutation({
  //   mutationFn: async () => {
  //     if (!wallet.publicKey || !patientDetails?.walletAddress) {
  //       setShowConnectWallet(true);
  //       throw new Error("Missing wallet or patient details.");
  //     }

  //     const record = web3.Keypair.generate();

  //     await program.methods
  //       .enterHealthRecord(
  //         patientDetails.walletAddress,
  //         signsAndSymptoms,
  //         diagnosis,
  //         prescription
  //       )
  //       .accounts({
  //         recordEntry: record.publicKey,
  //         doctor: wallet.publicKey,
  //         // systemProgram: web3.SystemProgram.programId,
  //       })
  //       .signers([record])
  //       .rpc();
  //   },
  //   onSuccess: (signature) => {
  //     toast.success("Record updated successfully");
  //     recordsQuery.refetch();
  //     setShowPopup(false);
  //     setSignsAndSymptoms("");
  //     setDiagnosis("");
  //     setPrescription("");
  //     setMessage("");
  //   },
  //   onError: (error) => {
  //     toast.error(`Failed to update record: ${error.message}`);
  //   },
  // });



  // const recordsQuery = useQuery({
  //   queryKey: ["recordDetailsEntry", patientDetails?.walletAddress],
  //   queryFn: async () => {
  //     if (!patientDetails) {
  //       throw new Error("No patient details available");
  //     }

  //     const patientPublicKey = new PublicKey(patientDetails.walletAddress);

  //     const allRecords = await program.account.recordDetailsEntry.all();

  //     const filteredRecords = allRecords.filter(
  //       (record) => record.account.patientId === patientPublicKey.toBase58()
  //     );

  //     return filteredRecords;
  //   },
  //   enabled: !!patientDetails,
  // });


  // const handleUpdateRecords = () => {
  //   createEntry.mutate();
  // };

  // interface MedicalRecord {
  //   doctorId: string;
  //   signsAndSymptoms: string;
  //   diagnosis: string;
  //   prescription: string;
  //   timestamp: number;
  // }