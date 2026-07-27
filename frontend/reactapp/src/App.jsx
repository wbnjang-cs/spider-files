//npm run dev

export default MainPage;
import { useRef, useState } from 'react';

function UploadButton() {
  const fileInputRef = useRef(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      const response = await fetch('http://127.0.0.1:8000/uploadfile/', {
        method: 'POST',
        headers: {
          'ID_FOR_VERIFICATION': '23337377-e648-48a7-967d-ba07198a41e0',
        },
        body: formData,
      });
      //throw goes to catch if triggered
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const result = await response.json();
      setUploadResult(result);
      setShowModal(true); // open the popup
    } catch (err) {
      setUploadResult({ Message: 'Upload failed', error: err.message });
      setShowModal(true);
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

      {showModal && uploadResult && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
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

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

function DownloadButton() {
  return (
    <button className="downloadButton">
      DownLoad File
    </button>



  );
}

function MainPage() {
  return (
    <div className="mainPage">
      <UploadButton/>
      <DownloadButton/>

    </div>
  );
}

