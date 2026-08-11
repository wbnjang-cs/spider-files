import { useState, useRef, useEffect} from 'react';

function Popup({ message, onBack }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        buttonRef.current?.focus();
    }, []);

    return (
        <div className="popupOverlay">
            <div className="popup">
                <p>{message}</p>
                <button ref={buttonRef} onClick={onBack}>OK</button>
            </div>
        </div>
    );
}

function usePopup(onBack = null) {
    const [message, setMessage] = useState(null);

    function showPopup(msg) {
        setMessage(msg);
    }

    function handleBack() {
        setMessage(null);
        if (onBack) onBack();
    }

    const popupElement = message && (
        <Popup message={message} onBack={handleBack} />
    );

    return [showPopup, popupElement];
}

export default usePopup;