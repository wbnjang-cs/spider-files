import UploadButton from '../components/UploadButton';
import DownloadButton from '../components/DownloadButton';

function FilePage({onBack}) {
  return (
    <div className="filePage">
      <button className="backButton" onClick={onBack}>Back to Main Menu</button>
      <UploadButton/>
      <DownloadButton/>
    </div>
  );
}

export default FilePage;