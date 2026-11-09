import { API_BASE } from "../utils/api";
import { useState, useEffect} from "react";

function DevicesPage({onBack}) {
    const [devices, setDevices] = useState([])
    const [selected, setSelected] = useState([]);

    function handleUnauthorized() {
            localStorage.removeItem("deviceToken");
            window.location.reload();
        }

    

    async function getDevices() {
        const response = await fetch(
                `${API_BASE}/devices/get`,
                {
                method: 'GET',
                headers: {
                    'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
                },
                }
            );

        if (response.status === 401) {
        localStorage.removeItem('deviceToken');
        window.location.reload();
        return;
        }
        if (!response.ok) return;
        
        const data = await response.json();
        setDevices(data)

    }
    
    useEffect(() => {
        getDevices();
    }, []);

    async function deleteDevices(ids) {
        const response = await fetch(`${API_BASE}/devices/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "TOKEN_FOR_VERIFICATION": localStorage.getItem("deviceToken"),
            },
            body: JSON.stringify({ ids }),
        });
        if (response.status === 401) return handleUnauthorized();
        setSelected([]);
        getDevices();
    }

    const allSelected = devices.length > 0 && selected.length === devices.length;

    function toggle(id) {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    return (
        <div className="configPage">
            <button className="backButton" onClick={() => onBack()}>
                Back to Config
            </button>
 
            <div className="fileBrowser">
                <div className="devicesTitleRow">
                    <div className="currDirHeader">Paired Devices</div>
                </div>
 
                <div className="returnRow devicesToolbar">
                    <label className="selectAllLabel">
                        <input
                            type="checkbox"
                            className="deviceCheckBox"
                            checked={allSelected}
                            onChange={() =>
                                setSelected(allSelected ? [] : devices.map((d) => d.id))
                            }
                        />
                        Select all
                    </label>
                    <button
                        className="returnButton"
                        disabled={selected.length === 0}
                        onClick={() => deleteDevices(selected)}
                    >
                        Delete selected ({selected.length})
                    </button>
                </div>
 
                <div className="fileList">
                    {devices.map((device) => (
                        <div className="deviceRow" key={device.id}>
                            <input
                                type="checkbox"
                                className="deviceCheckBox"
                                checked={selected.includes(device.id)}
                                onChange={() => toggle(device.id)}
                            />
                            <div className="deviceInfo">
                                <div className="deviceNameRow">
                                    <span className="deviceName">{device.deviceName}</span>
                                    {device.isCurrent && (
                                        <span className="currentBadge">This device</span>
                                    )}
                                </div>
                                <span className="deviceMeta">
                                    Paired {new Date(device.pairedTime * 1000).toLocaleString()}
                                </span>
                            </div>
                            <button
                                className="deleteButton"
                                onClick={() => deleteDevices([device.id])}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



export default DevicesPage