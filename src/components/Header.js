import { Tooltip } from 'react-tooltip'
import '../styles/Header.css';

function Header({ onAddTable, onDeleteDatabase, onEditDatabaseName, onDownloadDatabase, databaseName, onSaveDatabase, onModifyDatabases, onSignInWithGoogle, onSignOut, userId }) {
    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <i className="header-title-icon bi bi-database-fill"></i>
                    <span className='header-title-text'>{databaseName === "" ? "Untitled" : databaseName}</span>
                    <button aria-label='rename-schema' data-tooltip-id="rename-schema" className='header-button' onClick={onEditDatabaseName}><i className="bi bi-pencil-fill"></i></button>
                </div>
                <div className='header-buttons'>
                    <button aria-label='create-table' data-tooltip-id="create-table" className='header-button' onClick={onAddTable}><i className="bi bi-database-fill-add"></i></button>
                    <button aria-label='save-schema' data-tooltip-id="save-schema" className='header-button'  onClick={onSaveDatabase}><i className="bi bi-database-fill-down"></i></button>
                    <button aria-label='modify-schema' data-tooltip-id="modify-schemas" className='header-button'  onClick={onModifyDatabases}><i className="bi bi-database-fill-gear"></i></button>
                    <button aria-label='delete-schema' data-tooltip-id="delete-schema" className='header-button' onClick={onDeleteDatabase}><i className="bi bi-database-fill-x"></i></button>
                </div>            
                <div className='header-buttons'>
                    <button aria-label='download-schema' data-tooltip-id="download-schema" className='header-button' onClick={onDownloadDatabase}><i className="bi bi-filetype-sql"></i></button>
                    <a target="_blank" rel="noreferrer" href='https://github.com/ahmad-masud/Database-Schema-Constructor' aria-label='github' data-tooltip-id="github" className='header-button'><i className="bi bi-github"></i></a>
                    {!userId && <button aria-label='login' data-tooltip-id="login" onClick={onSignInWithGoogle} className='header-button'><i className="bi bi-box-arrow-in-right"></i></button>}
                    {userId && <button aria-label='logout' data-tooltip-id="logout" onClick={onSignOut} className='header-button'><i className="bi bi-box-arrow-right"></i></button>}
                </div>
            </div>
            <Tooltip id="rename-schema" place="bottom" variant="info" content="Rename Schema"/>
            <Tooltip id="create-table" place="bottom" variant="info" content="Create Table"/>
            <Tooltip id="save-schema" place="bottom" variant="info" content="Save Schema"/>
            <Tooltip id="modify-schemas" place="bottom" variant="info" content="Modify Cloud Schemas"/>
            <Tooltip id="download-schema" place="bottom" variant="info" content="Export as SQL Query"/>
            <Tooltip id="delete-schema" place="bottom" variant="info" content="Delete Schema"/>
            <Tooltip id="github" place="bottom" variant="info" content="Github Repo"/>
            <Tooltip id="login" place="bottom" variant="info" content="Login"/>
            <Tooltip id="logout" place="bottom" variant="info" content="Logout"/>
        </div>
    );
}

export default Header;
