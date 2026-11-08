
import { API_BASE } from "../utils/api";
import { useState } from "react";
function NamingPage({onNameSet}) {
    const [deviceName, setDeviceName] = useState('');
    const [error, setError] = useState(null);

    async function submitName(e) {
        e.preventDefault(); // stop the form from doing a full page reload
        if (!deviceName.trim()) { setError('Enter a name'); return; }
        setError(null);
        try {
        const response = await fetch(`${API_BASE}/setName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
            },
            body: JSON.stringify({"deviceName" : deviceName.trim()})
        });
        if (!response.ok) throw new Error('Could not set name');
        const data = await response.json();
        onNameSet(data.deviceName);
        } catch (err) {
        setError(err.message);
        }
    }

    return <div>
        <form onSubmit={submitName}>
            <p>Input this devices name</p>
            <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            maxLength={40}
            autoFocus
            />

            {error && <p className="error">{error}</p>}
            <button type="submit">Save</button>
        </form>

        <button type="button" onClick={() => onNameSet('Unnamed device')}>Skip</button>
    </div>
}

export default NamingPage;