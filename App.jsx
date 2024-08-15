import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as voting_idl } from "../../declarations/quantum_voting";

const agent = new HttpAgent();
const voting_canister = Actor.createActor(voting_idl, { agent, canisterId: "your-canister-id" });

async function castVote(voteData) {
    const response = await voting_canister.cast_vote(voteData);
    console.log(response);
}

async function getBlockchain() {
    const blockchain = await voting_canister.get_blockchain();
    console.log(blockchain);

}
