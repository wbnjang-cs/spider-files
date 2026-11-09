import { useState, useEffect} from 'react';
import FileBrowser from '../components/FileBrowser';
import {API_BASE} from '../utils/api'
import DevicesPage from './DevicesPage';

function ConfigPage({ onBack }) {
    const [currPage, setCurrPage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (currPage === null) {
        return (
            <div className="configPage">
            <button className="backButton" onClick={onBack}>Back to Main Menu</button>
            <button className = "saveDirButton" onClick={() => setCurrPage("saveDir")}>Set Upload Directory</button>
            <button className = "saveDirButton" onClick={() => setCurrPage("getDevices")}>Get Current Paired Devices</button>

            </div>
        )
        
    }

    else if (currPage === "saveDir") {
        return (
        <div className="configPage">
        <button className="backButton" onClick={() => setCurrPage(null)}>Back to Config</button>
        <FileBrowser
            mode="saveDir"
            onCancel={() => setPickingDir(false)}
            onBack = {onBack}
            />
        </div>
        )

    }

    else if(currPage === "getDevices") {
        return (
            <DevicesPage onBack = {() => setCurrPage(null)}/>
        )
    }
}

export default ConfigPage;