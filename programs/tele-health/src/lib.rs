use anchor_lang::prelude::*;

declare_id!("H946v5ZdWCTBKb6Zyc6GXRmANSrKp1NaZFyT1QNC4UoL");

#[program]
pub mod tele_health {
    use super::*;

    pub fn enter_health_record(
        ctx: Context<CreateEntry>,
        patient_id: String,
        signs_n_symptoms: String,
        diagnosis: String,
        prescription: String,
    ) -> Result<()> {
        if signs_n_symptoms.chars().count() > 500 {
            return err!(EntryErrors::SNSTooLong);
        }

        if diagnosis.chars().count() > 500 {
            return err!(EntryErrors::DiagnosistTooLong);
        }

        if prescription.chars().count() > 500 {
            return err!(EntryErrors::PrescriptionTooLong);
        }

        let record_entry = &mut ctx.accounts.record_entry;

        let time = Clock::get().unwrap();

        record_entry.doctor = ctx.accounts.doctor.key();
        record_entry.patient_id = patient_id;
        record_entry.signs_n_symptoms = signs_n_symptoms;
        record_entry.diagnosis = diagnosis;
        record_entry.timestamp = time.unix_timestamp;
        record_entry.prescription = prescription;
        Ok(())
    }
}

#[error_code]
pub enum EntryErrors {
    #[msg("Signs ann symptoms should be less than 300 characters")]
    SNSTooLong,

    #[msg("Diagnosis shouldn't be more than 300 characters")]
    DiagnosistTooLong,

    #[msg("Prescription note too long")]
    PrescriptionTooLong,
}

#[account]
pub struct RecordDetailsEntry {
    pub doctor: Pubkey,
    pub patient_id: String,
    pub timestamp: i64,
    pub signs_n_symptoms: String,
    pub diagnosis: String,
    pub prescription: String,
}

#[derive(Accounts)]
pub struct CreateEntry<'a> {
  #[account(
    init,
    payer = doctor,
    space = RecordDetailsEntry::LEN
  )]
  pub record_entry: Account<'a, RecordDetailsEntry>,
  #[account(mut)]
  pub doctor: Signer<'a>,
  pub system_program: Program<'a, System>,
}

const DISCRIMINATOR: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const SIGNSNSYMPTOMS_LENGTH: usize = 500 * 4;
const DIAGNOSIS_LENGTH: usize = 500 * 4;
const PRESCRIPTION_LENGTH: usize = 500 * 4;
const STRING_PREFIX_LENGTH: usize = 4;

impl RecordDetailsEntry {
    const LEN: usize = DISCRIMINATOR +
        PUBKEY_LENGTH + TIMESTAMP_LENGTH +
        STRING_PREFIX_LENGTH + PUBKEY_LENGTH +
        STRING_PREFIX_LENGTH + SIGNSNSYMPTOMS_LENGTH +
        STRING_PREFIX_LENGTH + DIAGNOSIS_LENGTH +
        STRING_PREFIX_LENGTH + PRESCRIPTION_LENGTH;
}
