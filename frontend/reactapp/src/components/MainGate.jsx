// components/MainGate.jsx
import { useState } from 'react';
import PairingPage from '../pages/PairingPage';
import Menu from '../pages/Menu';

function MainGate() {
    const [token, setToken] = useState(() => localStorage.getItem('deviceToken'));

    function handleTokenReceived(newToken) {
      localStorage.setItem('deviceToken', newToken);
      setToken(newToken);
    }

    if (!token) {
      return <PairingPage onTokenReceived={handleTokenReceived} />;
    }

    return <Menu />;
}

export default MainGate;