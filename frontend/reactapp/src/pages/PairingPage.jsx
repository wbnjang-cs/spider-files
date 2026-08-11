import { useState } from 'react';
import PairButton from '../components/PairButton';
import {API_BASE} from '../utils/api'

function PairingPage({ onTokenReceived }) {
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  async function submitCode(e) {
    e.preventDefault(); // stop the form from doing a full page reload
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/pair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error('Invalid or expired code');
      const data = await response.json();
      onTokenReceived(data.token); // pass the token up to whoever's tracking paired state
    } catch (err) {
      setError(err.message);
      setCode('');
    }
  }

  return (
    <div className="pairingPage">
      {!awaitingCode ? (
        <PairButton onPaired={() => setAwaitingCode(true)} />
      ) : (
        <form onSubmit={submitCode}>
          <p>Enter the code shown on the server screen:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PairingPage;