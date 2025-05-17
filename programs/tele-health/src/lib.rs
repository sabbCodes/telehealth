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
    if patient_id.chars().count() > 44 {
        return err!(EntryErrors::PatientIdTooLong);
    }

    if akave_cid.chars().count() > 64 {
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
#[derive(InitSpace)]
pub struct RecordDetailsEntry {
  pub doctor: Pubkey,
  #[max_len(44)]
  pub patient_id: String,
  pub timestamp: i64,
  #[max_len(64)]
  pub akave_cid: String,
}

#[derive(Accounts)]
#[instruction(patient_id: String)]
pub struct CreateEntry<'info> {
  #[account(
      init,
      payer = doctor,
      space = 8 + RecordDetailsEntry::INIT_SPACE,
      seeds = [patient_id.as_bytes(), doctor.key().as_ref()],
      bump,
  )]
  pub record_entry: Account<'info, RecordDetailsEntry>,
  #[account(mut)]
  pub doctor: Signer<'info>,
  pub system_program: Program<'info, System>,
}
