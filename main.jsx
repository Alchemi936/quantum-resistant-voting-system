import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import React, { useState } from 'react';
const App = () => {
  const [username, setUsername] = useState('');
  const [vote, setVote] = useState('');
  const [result, setResult] = useState(null);

  const registerUser = async () => {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(username),
    });
    const data = await response.json();
    console.log('User registered:', data);
  };

  const castVote = async () => {
    const response = await fetch('/cast_vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voter_id: username, candidate_id: vote }),
    });
    const data = await response.json();
    console.log('Vote cast:', data);
  };

  const fetchResults = async () => {
    const response = await fetch('/tally_votes');
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Quantum-Resistant Voting System</h1>
      <div>
        <h2>Register</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button onClick={registerUser}>Register</button>
      </div>
      <div>
        <h2>Vote</h2>
        <input
          type="text"
          value={vote}
          onChange={(e) => setVote(e.target.value)}
          placeholder="Candidate ID"
        />
        <button onClick={castVote}>Cast Vote</button>
      </div>
      <div>
        <h2>Results</h2>
        <button onClick={fetchResults}>Fetch Results</button>
        {result && <div>{JSON.stringify(result)}</div>}
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
