import { useState } from 'react';
import { API_BASE } from '../utils/api';
import Popup from './Popup'
import usePopup from '../hooks/usePopup';

function SetSaveDirButton({path, onBack}) {
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [submitting, setSubmitting] = useState(false);
    const [showPopup, popup] = usePopup(onBack);

    async function handleSetSavePath() {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/config/setPath`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
                    },
                    body: JSON.stringify({ savePathName: path }),
            });

            if (!response.ok) {
                throw new Error(`Set path failed: ${response.status}`);
            }

            showPopup(`Save directory updated to ${path}.`);



        } catch (err) {
            console.error('Failed to set save path:', err);
            showPopup('Failed to set save directory.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <button  className="selectFolderButton"  onClick={handleSetSavePath} disabled={submitting}>
                {submitting ? 'Setting...' : 'Select Current Directory'}
            </button>

            {popup}
        </div>
    );
}


export default SetSaveDirButton;