import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TeleHealth } from "../target/types/tele_health";
import { assert } from "chai";

describe("tele-health", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TeleHealth as Program<TeleHealth>;

  it('Can create a new record with details', async () => {
    const doctorKeypair = anchor.web3.Keypair.generate();

    await program.methods.enterHealthRecord
      (
      "AXisVZ9Aus6PVdnCNWSD6oHHMM16SF1Vs49aqtRVPvSy",
      "Headache, body pain and fever",
      "Acute malaria",
      "Artemether forte, paracetamol and ibuprophen",
    ).accounts({
      recordEntry: doctorKeypair.publicKey,
      doctor: program.provider.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([doctorKeypair])
    .rpc();

    const recordAcct = await program.account.recordDetailsEntry.fetch(
      doctorKeypair.publicKey
    );

    console.log(recordAcct);
  });

  // it('Can create a new record by a new doctor', async () => {
  //   const newDoctor = anchor.web3.Keypair.generate();
  //   const doctorKeypair = anchor.web3.Keypair.generate();
  //   console.log("New doctor's keypair: ", doctorKeypair.publicKey.toBase58());

  //   const sign = await program.provider.connection.requestAirdrop(
  //     newDoctor.publicKey,
  //     1000000000
  //   );

  //   const latestBlockHash = await program.provider.connection.getLatestBlockhash();

  //   await program.provider.connection.confirmTransaction({
  //     blockhash: latestBlockHash,
  //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //     signature: sign
  //   });

  //   await program.methods.enterHealthRecord
  //     (
  //     "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42",
  //     "RTA, laboured breathing, fracture of cervical vertebrae, damage to the spinal cord above C5",
  //     "Damage to the phrenic nerve",
  //     "No need, patient is eager to meet his Lord!!"
  //   ).accounts({
  //     recordEntry: doctorKeypair.publicKey,
  //     doctor: newDoctor.publicKey,
  //     // systemProgram: anchor.web3.SystemProgram.programId,
  //   })
  //   .signers([newDoctor, doctorKeypair])
  //   .rpc();

  //   const recordAcct = await program.account.recordDetailsEntry.fetch(
  //     doctorKeypair.publicKey
  //   );

  //   console.log(recordAcct);

  //   assert.equal(
  //     recordAcct.author.toBase58(),
  //     newDoctor.publicKey.toBase58()
  //   );
  //   assert.equal(
  //     recordAcct.signsNSymptoms,
  //     "RTA, laboured breathing, fracture of cervical vertebrae, damage to the spinal cord above C5"
  //   );
  //   assert.equal(recordAcct.diagnosis, "Damage to the phrenic nerve");
  //   assert.equal(recordAcct.prescription, "No need, patient is eager to meet his Lord!!");
  // });

  it('Can create a new record with new user details', async () => {
    const doctorKeypair = anchor.web3.Keypair.generate();

    await program.methods.enterHealthRecord
      (
      "Sab5y7LG3VefLz4E6DSCkxdmjG4pve3hcAb8NUPKn42",
      "Pain in scrotum",
      "Inguinal hernia suspected",
      "Correctional surgery",
    ).accounts({
      recordEntry: doctorKeypair.publicKey,
      doctor: program.provider.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([doctorKeypair])
    .rpc();

    const recordAcct = await program.account.recordDetailsEntry.fetch(
      doctorKeypair.publicKey
    );

    console.log(recordAcct);
  });
});
