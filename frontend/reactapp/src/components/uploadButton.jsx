import { useRef, useState } from 'react';
import {API_BASE} from '../utils/api'

function UploadButton() {
  const fileInputRef = useRef(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  function handleClick() {
    fileInputRef.current.click();
  }

  async function handleFilesChosen(e) {
    const files = Array.from(e.target.files);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('userFiles', file);
    });

    try {
      const response = await fetch(`${API_BASE}/uploadfile/`, {
        method: 'POST',
        headers: {
          'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
        },
        body: formData,
      });

    if (response.status === 401) {
        localStorage.removeItem('deviceToken');
        window.location.reload();
        return;
    }
      //throw goes to catch if triggered
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      
      const result = await response.json();
      setUploadResult(result);
      setShowPopup(true); // open the popup
    } catch (err) {
      setUploadResult({ Message: 'Upload failed', error: err.message });
      setShowPopup(true);
    }
  }

  return (
    <>
      <button className="uploadButton" onClick={handleClick}>
        Upload File
      </button>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFilesChosen}
      />

      {showPopup && uploadResult && (
        <div className="PopupOverlay" onClick={() => setShowPopup(false)}>
          <div className="PopupBox" onClick={(e) => e.stopPropagation()}>
            <h3>{uploadResult.Message}</h3>

            {uploadResult.Successfull_Uploads?.length > 0 && (
              <>
                <p>Successful uploads:</p>
                <ul>
                  {uploadResult.Successfull_Uploads.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </>
            )}

            {uploadResult.Failed_Uploads?.length > 0 && (
              <>
                <p>Failed files:</p>
                <ul>
                  {uploadResult.Failed_Uploads.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </>
            )}

            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadButton;