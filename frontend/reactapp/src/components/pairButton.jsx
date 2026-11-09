import {API_BASE} from '../utils/api'

function PairButton({ onPaired }) {
  async function startPairing() {
    try {
      const response = await fetch(`${API_BASE}/pair/start/`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start pairing');
      onPaired(); // tell the parent "pairing has started, show the code input"
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button className="uploadButton" onClick={startPairing}>Pair Device</button>
  );
}

export default PairButton;