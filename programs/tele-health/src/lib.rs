use anchor_lang::prelude::*;

declare_id!("H946v5ZdWCTBKb6Zyc6GXRmANSrKp1NaZFyT1QNC4UoL");

#[program]
pub mod tele_health {
  use super::*;

  pub fn enter_health_record(
    ctx: Context<CreateEntry>,
    patient_id: String,
    akave_cid: String,
  ) -> Result<()> {
    if patient_id.chars().count() > 44 { // Pubkey base58 length
        return err!(EntryErrors::PatientIdTooLong);
    }

    if akave_cid.chars().count() > 64 { // CIDv1 max length ~59, buffer to 64
        return err!(EntryErrors::AkaveCidTooLong);
    }

    let record_entry = &mut ctx.accounts.record_entry;

    let time = Clock::get().unwrap();

    record_entry.doctor = ctx.accounts.doctor.key();
    record_entry.patient_id = patient_id;
    record_entry.timestamp = time.unix_timestamp;
    record_entry.akave_cid = akave_cid;
    Ok(())
  }
}

#[error_code]
pub enum EntryErrors {
  #[msg("Patient ID should be a valid Solana public key (max 44 chars)")]
  PatientIdTooLong,

  #[msg("Akave CID too long (max 64 chars)")]
  AkaveCidTooLong,
}

#[account]
pub struct RecordDetailsEntry {
  pub doctor: Pubkey,
  pub patient_id: String,   // Base58 pubkey (e.g., patient’s wallet)
  pub timestamp: i64,
  pub akave_cid: String,    // CID from Akave upload
}

#[derive(Accounts)]
pub struct CreateEntry<'info> {
  #[account(
      init,
      payer = doctor,
      space = RecordDetailsEntry::LEN
  )]
  pub record_entry: Account<'info, RecordDetailsEntry>,
  #[account(mut)]
  pub doctor: Signer<'info>,
  pub system_program: Program<'info, System>,
}

const DISCRIMINATOR: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_PREFIX_LENGTH: usize = 4;
const PATIENT_ID_LENGTH: usize = 44 * 4; // Base58 pubkey, UTF-8 encoded
const AKAVE_CID_LENGTH: usize = 64 * 4;  // CIDv1, UTF-8 encoded

impl RecordDetailsEntry {
  const LEN: usize = DISCRIMINATOR +
    PUBKEY_LENGTH +                    // doctor
    STRING_PREFIX_LENGTH + PATIENT_ID_LENGTH + // patient_id
    TIMESTAMP_LENGTH +                 // timestamp
    STRING_PREFIX_LENGTH + AKAVE_CID_LENGTH;  // akave_cid
}