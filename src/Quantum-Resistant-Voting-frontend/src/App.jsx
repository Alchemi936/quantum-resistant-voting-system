import { useState, useEffect } from 'react';
import { Quantum_Resistant_Voting_backend } from 'declarations/Quantum-Resistant-Voting-backend';
import { initAuth, login, logout, getIdentity } from './auth';
import './index.scss';

function App() {
  const [voterId, setVoterId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [encryptedVote, setEncryptedVote] = useState('');
  const [blockchain, setBlockchain] = useState([]);
  const [isBlockchainValid, setIsBlockchainValid] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to handle authentication check

  useEffect(() => {
    const initialize = async () => {
      await initAuth();
      const identity = await getIdentity();
      setIsAuthenticated(identity !== null);
      setLoading(false); // Authentication check is complete

      if (identity) {
        // Fetch blockchain data only if authenticated
        Quantum_Resistant_Voting_backend.get_blockchain().then(setBlockchain);
        Quantum_Resistant_Voting_backend.is_blockchain_valid().then(setIsBlockchainValid);
      }
    };
    initialize();
  }, []);

  const handleVoteSubmit = async (event) => {
    event.preventDefault();
    const vote = { voter_id: voterId, candidate_id: candidateId, encrypted_vote: encryptedVote };
    await Quantum_Resistant_Voting_backend.cast_vote(vote);
    const updatedBlockchain = await Quantum_Resistant_Voting_backend.get_blockchain();
    setBlockchain(updatedBlockchain);
    const blockchainValidity = await Quantum_Resistant_Voting_backend.is_blockchain_valid();
    setIsBlockchainValid(blockchainValidity);
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading text while checking authentication
  }

  if (!isAuthenticated) {
    // If not authenticated, show login button
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quantum Resistant Voting</h1>
        <button onClick={login} className="bg-green-500 text-white p-2 rounded">
          Login with NFID
        </button>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quantum Resistant Voting</h1>
      <form onSubmit={handleVoteSubmit} className="mb-4">
        <label className="block mb-2">
          Voter ID:
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          Candidate ID:
          <input
            type="text"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          Encrypted Vote:
          <input
            type="text"
            value={encryptedVote}
            onChange={(e) => setEncryptedVote(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cast Vote
        </button>
      </form>
      <h2 className="text-xl font-bold mb-2">Blockchain</h2>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(blockchain, null, 2)}</pre>
      <h2 className="text-xl font-bold mb-2">Blockchain Validity</h2>
      <p>{isBlockchainValid ? 'The blockchain is valid.' : 'The blockchain is invalid!'}</p>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded mt-4">
        Logout
      </button>
    </main>
  );
}

export default App;
