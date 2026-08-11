import { useState, useEffect} from 'react';
import FileBrowser from '../components/FileBrowser';
import {API_BASE} from '../utils/api'

function ConfigPage({ onBack }) {
    const [pickingDir, setPickingDir] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="configPage">
        <button className="backButton" onClick={onBack}>Back to Main Menu</button>

        {pickingDir ? (
            <FileBrowser
            mode="saveDir"
            onCancel={() => setPickingDir(false)}
            onBack = {onBack}
            />
        ) : (
            <button className = "saveDirButton" onClick={() => setPickingDir(true)}>Set Save Directory</button>
        )}
        </div>
    );
}

export default ConfigPage;