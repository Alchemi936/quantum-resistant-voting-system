#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
    use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::*;

#[derive(CandidType, Deserialize, Clone)]
struct Vote {
    voter_id: String,
    candidate_id: u32,
    encrypted_vote: String,
}

#[derive(CandidType, Deserialize, Clone)]
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
        let previous_block = BLOCKCHAIN.last().unwrap_or(&Block {
            index: 0,
            timestamp: 0,
            previous_hash: "0".to_string(),
            hash: "0".to_string(),
            data: Vote {
                voter_id: "".to_string(),
                candidate_id: 0,
                encrypted_vote: "".to_string(),
            },
        });

        let new_block = Block {
            index: previous_block.index + 1,
            timestamp: ic_cdk::api::time(),
            previous_hash: previous_block.hash.clone(),
            hash: calculate_hash(previous_block.index + 1, ic_cdk::api::time(), &previous_block.hash, &vote),
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
}
