import { useState, useEffect } from 'react';
import {API_BASE} from '../utils/api'
import SetSaveDirButton from './setSaveDirButton'
import MakeNewDirButton from './MakeNewDirButton';
import FolderIcon from '../assets/folderIcon.svg';
import FileIcon from '../assets/fileIcon.svg';
import usePopup from '../hooks/usePopup'; 

function FileBrowser({ mode, onCancel, onBack }) {
    const includeFiles = mode === 'download';
    const [currDir, setCurrDir] = useState('Root');
    const [children, setChildren] = useState([]);
    const [parentPath, setParentPath] = useState(null);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingSelected, setViewingSelected] = useState(false);
    const [showPopup, popup] = usePopup(onBack);
    
    useEffect(() => {
        fetchDir(currDir);
    }, [currDir]);

    //Call backend with current Dir, get new children and parents
    async function fetchDir(dir) {
        const queryPath = dir === 'Root' ? '' : dir;

        try {
        const response = await fetch(
            `${API_BASE}/browse?path=${encodeURIComponent(queryPath)}&includeFiles=${includeFiles}`,
            {
            method: 'GET',
            headers: {
                'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
            },
            }
        );

        if (!response.ok) {
            throw new Error(`Browse failed: ${response.status}`);
        }

        const data = await response.json();
        setChildren(data.child_directories);
        setParentPath(data.parent_path);
        } catch (err) {
        console.error('Failed to fetch directory:', err);
        }
    }

    function goDown(childPath) {
        setCurrDir(childPath);
    }

    function goUp() {
        if (parentPath !== null) {
        setCurrDir(parentPath);
        }
    }

    function goToRoot() {
        setCurrDir('Root');
    }

    function toggleSelect(entry) {
        setSelected(prev =>
            prev.some(e => e.path === entry.path)
                ? prev.filter(e => e.path !== entry.path)
                : [...prev, entry]
        );
    }

    function isSelected(path) {
        return selected.some(e => e.path === path);
    }   
 
    function handleClick(entry) {
        if (entry.is_dir) {
            goDown(entry.path);
        } else {
            toggleSelect(entry);
        }
    }

    async function onSelect(selected) {
        try {
            const response = await fetch(`${API_BASE}/download/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'TOKEN_FOR_VERIFICATION': localStorage.getItem('deviceToken'),
                },
                body: JSON.stringify({ files: selected.map(entry => entry.path) }),
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = "download.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            showPopup(
                <>
                    Download completed
                    <ul>
                        {selected.map(entry => (
                            <li key={entry.path}>{entry.name}</li>
                        ))}
                    </ul>
                </>
            );
        } catch (err) {
            console.error('Failed to download files:', err);
        }
    }

    const filesToShow = viewingSelected
        ? selected
        : children.filter(entry => entry.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fileBrowser">

            <div className="currDirRow">
                <div className="currDirSpacer" aria-hidden="true"></div>
                <p className="currDirHeader">Current Directory: {currDir}</p>
                {mode === 'saveDir' && currDir !== 'Root' ? (
                    <MakeNewDirButton currDir={currDir} onDirCreated={() => fetchDir(currDir)} />
                ) : (
                    <div className="currDirSpacer" aria-hidden="true"></div>
                )}
            </div>

            {mode === 'saveDir' && currDir !== 'Root' && (
                <div className="saveDirRow"> 
                    <SetSaveDirButton path = {currDir} onBack = {onBack}/>
                </div>

            )}

            <div className="returnRow">
                {currDir !== 'Root' && (
                    <button className="returnButton" onClick={goToRoot} disabled={currDir === 'Root'}>
                        Return to Root Directory
                    </button>
                )}
                {parentPath !== null && parentPath !== '' && (
                    <button className="returnButton" onClick={goUp}>
                        ← Return to {parentPath}
                    </button>
                )}
            </div>

            <input
                type="text"
                className="searchBar"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className = 'fileList'>
                {filesToShow.map(entry => (
                    <div key={entry.path} className='fileEntry'>
                    {mode === 'download' && (
                        <input
                            className='selectCheckBox'
                            type="checkbox"
                            checked={isSelected(entry.path)}
                            onChange={() => toggleSelect(entry)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    <button 
                        className={mode === 'download' && entry.is_dir ? 'folderIcon' : 'fileIcon'}
                        onClick={() => handleClick(entry)}
                        disabled={mode === 'download' && entry.is_dir && isSelected(entry.path)}
                        >
                            <img src={entry.is_dir ? FolderIcon : FileIcon} alt="" />
                            <span title={entry.name}>{entry.name}</span>
                        </button>
                    </div>
                ))}
            </div>
            


            {mode === 'download' && (
                
                <div className="returnRow">
                    <button className="returnButton" onClick={() => setViewingSelected(v => !v)}>
                        {viewingSelected ? 'Back to Browsing' : `View Selected (${selected.length})`}
                    </button>

                    <button className="returnButton" onClick={() => onSelect(selected)} disabled={selected.length === 0}>
                        Download Selected ({selected.length})
                    </button>
                </div>
            )}

            {popup}
        </div>
    );
    }

    export default FileBrowser;