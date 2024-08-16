mod vote;

use serde::{Deserialize, Serialize};
use candid::CandidType;
use ic_cdk_macros::*;
use sha2::*;
use vote::Vote;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
struct Block {
    index: u64,
    timestamp: u128,
    previous_hash: String,
    hash: String,
    data: Vote,
}

static mut BLOCKCHAIN: Vec<Block> = Vec::new();

#[update]
fn cast_vote(vote: Vote) -> String {
    unsafe {
        let default_previous_hash = "0".to_string();
        let default_hash = "0".to_string();
        let default_voter_id = "".to_string();
        let default_candidate_id = "".to_string();
        let default_encrypted_vote = "".to_string();

        // Create a default block
        let default_block = Block {
            index: 0,
            timestamp: 0,
            previous_hash: default_previous_hash,
            hash: default_hash,
            data: Vote {
                voter_id: default_voter_id,
                candidate_id: default_candidate_id,
                encrypted_vote: default_encrypted_vote,
            },
        };

        // Use a reference to the default block
        let previous_block = BLOCKCHAIN.last().unwrap_or(&default_block);

        let current_time = ic_cdk::api::time() as u128;

        let new_hash = calculate_hash(
            previous_block.index + 1,
            current_time,
            &previous_block.hash,
            &vote,
        );

        let new_block = Block {
            index: previous_block.index + 1,
            timestamp: current_time,
            previous_hash: previous_block.hash.clone(),
            hash: new_hash,
            data: vote,
        };

        BLOCKCHAIN.push(new_block.clone());
        format!("Vote recorded in block: {:?}", new_block)
    }
}

#[query]
fn get_blockchain() -> Vec<Block> {
    unsafe { BLOCKCHAIN.clone() }
}

fn calculate_hash(index: u64, timestamp: u128, previous_hash: &str, vote: &Vote) -> String {
    let mut hasher = sha2::Sha256::new();
    hasher.update(index.to_string());
    hasher.update(timestamp.to_string());
    hasher.update(previous_hash);
    hasher.update(format!("{:?}", vote));
    format!("{:x}", hasher.finalize())
}

#[query]
fn is_blockchain_valid() -> bool {
    unsafe {
        for i in 1..BLOCKCHAIN.len() {
            let current_block = &BLOCKCHAIN[i];
            let previous_block = &BLOCKCHAIN[i - 1];

            if current_block.hash != calculate_hash(
                current_block.index,
                current_block.timestamp,
                &current_block.previous_hash,
                &current_block.data,
            ) {
                return false;
            }

            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }
}
