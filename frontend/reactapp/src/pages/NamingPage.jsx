
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

    return (
        <div className="configPage pairingPage">
            <form className="fileBrowser pairForm" onSubmit={submitName}>
                <p>Input this device's name</p>
                <input
                    className="newFolderInput nameInput"
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    maxLength={40}
                    autoFocus
                />
 
                {error && <p className="error">{error}</p>}
 
                <div className="popupButtonRow">
                    <button
                        className="popupCancelButton"
                        type="button"
                        onClick={() => onNameSet('Unnamed device')}
                    >
                        Skip
                    </button>
                    <button className="popupConfirmButton" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}


export default NamingPage;