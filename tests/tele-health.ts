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





import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { TeleHealth } from "../target/types/tele_health"; // Adjust path to your program's IDL

describe("TeleHealth", () => {
  // Configure the client to use the local cluster
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TeleHealth as Program<TeleHealth>;
  const doctor = provider.wallet;

  // Helper function to generate a patient ID (random public key)
  const generatePatientId = () => new web3.Keypair().publicKey.toBase58();

  // Helper function to derive PDA
  const getRecordPda = async (patientId: string, doctor: PublicKey) => {
    return await PublicKey.findProgramAddress(
      [Buffer.from(patientId), doctor.toBuffer()],
      program.programId
    );
  };

  it("Creates a health record successfully", async () => {
    const patientId = generatePatientId();
    const akaveCid =
      "Qm1234567890abcdef1234567890abcdef1234567890abcdef12345678";

    const [recordPda, bump] = await getRecordPda(patientId, doctor.publicKey);

    await program.methods
      .enterHealthRecord(patientId, akaveCid)
      .accounts({
        recordEntry: recordPda,
        doctor: doctor.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch the account and verify its contents
    const recordAccount = await program.account.recordDetailsEntry.fetch(
      recordPda
    );

    assert.equal(recordAccount.doctor.toBase58(), doctor.publicKey.toBase58());
    assert.equal(recordAccount.patientId, patientId);
    assert.equal(recordAccount.akaveCid, akaveCid);
    assert.isNumber(recordAccount.timestamp);
  });

  it("Fails if patient_id is too long", async () => {
    const patientId = "A".repeat(45); // Exceeds 44 chars
    const akaveCid =
      "Qm1234567890abcdef1234567890abcdef1234567890abcdef12345678";

    const [recordPda] = await getRecordPda(patientId, doctor.publicKey);

    try {
      await program.methods
        .enterHealthRecord(patientId, akaveCid)
        .accounts({
          recordEntry: recordPda,
          doctor: doctor.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have failed with PatientIdTooLong error");
    } catch (err) {
      assert.include(
        err.toString(),
        "Patient ID should be a valid Solana public key (max 44 chars)"
      );
    }
  });

  it("Fails if akave_cid is too long", async () => {
    const patientId = generatePatientId();
    const akaveCid = "Qm" + "A".repeat(63); // Exceeds 64 chars

    const [recordPda] = await getRecordPda(patientId, doctor.publicKey);

    try {
      await program.methods
        .enterHealthRecord(patientId, akaveCid)
        .accounts({
          recordEntry: recordPda,
          doctor: doctor.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have failed with AkaveCidTooLong error");
    } catch (err) {
      assert.include(err.toString(), "Akave CID too long (max 64 chars)");
    }
  });

  it("Verifies PDA derivation", async () => {
    const patientId = generatePatientId();
    const akaveCid =
      "Qm1234567890abcdef1234567890abcdef1234567890abcdef12345678";

    const [recordPda, bump] = await getRecordPda(patientId, doctor.publicKey);

    await program.methods
      .enterHealthRecord(patientId, akaveCid)
      .accounts({
        recordEntry: recordPda,
        doctor: doctor.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    // Ensure the account exists at the derived PDA
    const accountInfo = await provider.connection.getAccountInfo(recordPda);
    assert.isNotNull(accountInfo, "Account should exist at the derived PDA");
    assert.equal(accountInfo.owner.toBase58(), program.programId.toBase58());
  });
});