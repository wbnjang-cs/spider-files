import {useState} from 'react';
import FileBrowser from './FileBrowser';

function DownloadButton() {
    const [uploading, setUploading] = useState(false);

    return <div > 

        {uploading ? 
        (<FileBrowser
            mode = "download"
            onBack = {setUploading}/>) : 
            (<button className = 'downloadButton'  onClick={() => setUploading(true)}> Download File</button>)}

    </div>
}

export default DownloadButton;