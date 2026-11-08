// components/MainGate.jsx
import { useState } from 'react';
import PairingPage from '../pages/PairingPage';
import Menu from '../pages/Menu';
import NamingPage from '../pages/NamingPage';

function MainGate() {
    const [token, setToken] = useState(() => localStorage.getItem('deviceToken'));
    const [deviceName, setDeviceName] = useState(() => localStorage.getItem('deviceName'))

    function handleTokenReceived(newToken) {
      localStorage.setItem('deviceToken', newToken);
      setToken(newToken);
      localStorage.removeItem('deviceName');
      setDeviceName(null);
    }

    function handleNameReceived(newName) {
      localStorage.setItem('deviceName', newName);
      setDeviceName(newName);
    }

    if (!token) {
      return <PairingPage onTokenReceived={handleTokenReceived} />;
    }
    else if(!deviceName) {
      return <NamingPage onNameSet={handleNameReceived}/>
    }

    return <Menu />;
}

export default MainGate;