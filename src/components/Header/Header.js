import { useRef } from 'react';
import './Header.css';

function Header({ onAddTable, onDeleteDatabase, onEditDatabaseName, onDownloadDatabase, databaseName, onSaveDatabase, onOpenDatabase }) {
    const fileInputRef = useRef();

    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <i className="header-title-logo fa-solid fa-database"></i>
                    <span className='header-title-text'>{databaseName}</span>
                    <button title="Rename Schema" className='header-button' onClick={onEditDatabaseName}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
                <div className='header-buttons'>
                    <button title="Create Table" className='header-button' onClick={onAddTable}><i className="fa-solid fa-plus"></i></button>
                    <button title="Save Schema" className='header-button'  onClick={onSaveDatabase}><i className="fa-solid fa-floppy-disk"></i></button>
                    <input type="file" onChange={onOpenDatabase} style={{ display: 'none' }} ref={fileInputRef} />
                    <button title="Open Schema" className='header-button'  onClick={() => fileInputRef.current.click()}><i className="fa-solid fa-folder-open"></i></button>
                    <button title="Download Schema" className='header-button' onClick={onDownloadDatabase}><i className="fa-solid fa-download"></i></button>
                    <button title="Delete Schema" className='header-button' onClick={onDeleteDatabase}><i className="fa-solid fa-trash-can"></i></button>
                </div>                
            </div>
        </div>
    );
}

export default Header;
