import UploadButton from '../components/UploadButton';
import DownloadButton from '../components/DownloadButton';
import { useState } from 'react';
import FilePage from './FilePage'
import ConfigPage from './ConfigPage'

function Menu() {
  const [currPage, setCurrPage] = useState('Menu');

  function updateCurrPage(newPage) {
    setCurrPage(newPage);
  }

  if (currPage === 'File') {
    return <FilePage onBack={() => updateCurrPage('Menu')} />;
  }

  if (currPage === 'Config') {
    return <ConfigPage onBack={() => updateCurrPage('Menu')} />;
  }

  return (
    <div className = "menuPage">
      <button className = "fileButton" onClick={() => updateCurrPage('File')}>File</button>
      <button className = "configButton" onClick={() => updateCurrPage('Config')}>Config</button>
    </div>
  );
}

export default Menu;