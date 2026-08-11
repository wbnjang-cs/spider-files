import { useState } from 'react';
import { API_BASE } from '../utils/api'
import Popup from './Popup';
import usePopup from '../hooks/usePopup';

function MakeNewDirButton({ currDir, onDirCreated }) {
    const [showInput, setShowInput] = useState(false);
    const [newDir, setNewDir] = useState('');
    const [showPopup, popup] = usePopup();

    async function makeDir() {
        try {
            const response = await fetch(`${API_BASE}/config/createsubdirectory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
                },
                body: JSON.stringify({ currDir: currDir, newDir: newDir }),
            });

            if (!response.ok) {
                throw new Error(`Create directory failed: ${response.status}`);
            }

            const data = await response.json();
            setShowInput(false);
            setNewDir('');
            onDirCreated();
            showPopup(data.Message);

        } catch (err) {
            console.error('Failed to create directory:', err);
        }
    }

    return (
        <div>
            <button className="MakeNewDirButton" onClick={() => setShowInput(true)}>
                New Folder
            </button>

            {showInput && (
                <div className="popupOverlay" onClick={() => setShowInput(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h3>New Folder</h3>
                        <input
                            type="text"
                            className="newFolderInput"
                            value={newDir}
                            onChange={(e) => setNewDir(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    makeDir();
                                }
                            }}
                            placeholder="New folder name"
                            autoFocus
                        />
                        <div className="popupButtonRow">
                            <button className="popupConfirmButton" onClick={makeDir}>Create</button>
                            <button className="popupCancelButton" onClick={() => { setShowInput(false); setNewDir(''); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {popup}
        </div>
    );
}

export default MakeNewDirButton;