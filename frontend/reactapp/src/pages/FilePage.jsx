import UploadButton from '../components/UploadButton';
import DownloadButton from '../components/DownloadButton';
import { useState, useEffect } from 'react';
import FileBrowser from '../components/FileBrowser';
import { API_BASE } from "../utils/api";

function FilePage({onBack}) {
  const [currPage, setCurrPage] = useState("filePage")
  const [saveDir, setSaveDir] = useState(null)

  useEffect(() => {
    async function loadSaveDir() {
      const response = await fetch(`${API_BASE}/config/getPath`, {
        headers: { 'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken') },
      });
      if (response.status === 401) {
        localStorage.removeItem('deviceToken');
        window.location.reload();
        return;
      }
      if (!response.ok) return;
      const data = await response.json();
      setSaveDir(data.savePath);
    }
    loadSaveDir();
  }, [currPage]);

  if (currPage === "filePage") {
    return( 
      <div className="filePage">
        <button className="backButton" onClick={onBack}>Back to Main Menu</button>
        <button className="currDirHeader saveDirText" onClick={() => setCurrPage("saveDirPage")}>
          <span className="saveDirPath">Uploading to: {saveDir}</span>
          <span className="saveDirChange">Change Upload Directory</span>
        </button>
        <UploadButton/>
        <DownloadButton/>
      </div>
    )
  }

  else if (currPage === "saveDirPage") {
    return (    
    <div className="configPage">
    <button className="backButton" onClick={() => setCurrPage("filePage")}>Back to Files Page</button>
    <FileBrowser
        mode="saveDir"
        onCancel={() => setCurrPage("filePage")}
        onBack = {() => setCurrPage("filePage")}
        />
    </div>)
  }
  
  
}

export default FilePage;