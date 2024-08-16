use serde::{Deserialize, Serialize};
use candid::CandidType;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Vote {
    pub voter_id: String,
    pub candidate_id: String,
    pub encrypted_vote: String,
}
