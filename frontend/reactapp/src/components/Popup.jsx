function Popup({ message, onBack }) {
    return (
        <div className="popupOverlay">
            <div className="popup">
                <p>{message}</p>
                <button onClick={onBack}>OK</button>
            </div>
        </div>
    );
}

export default Popup;