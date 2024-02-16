import './Table.css';
import AttributeForm from '../AttributeForm/AttributeForm.js';
import { useState, useEffect, useCallback , useRef } from 'react';
import GenericForm from '../GenericForm/GenericForm.js';
import Prompt from '../Prompt/Prompt.js';

function Table({ tables, table, onAddAttribute, onDeleteTable, onUpdateTable, allTableNames, onDeleteAttribute, color, positionX, positionY, onUpdatePosition }) {
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: positionX , y: positionY });
  const [relPosition, setRelPosition] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [promptAction, setPromptAction] = useState('');
  const tableRef = useRef(null);
  
  const handleUpdatePosition = useCallback((newX, newY) => {
    onUpdatePosition(table.id, newX, newY);
  }, [table.id, onUpdatePosition]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setRelPosition({
      x: e.pageX - position.x,
      y: e.pageY - position.y,
    });
    e.preventDefault();
  };

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);  

  const getTableDimensions = () => {
    if (tableRef.current) {
      const dimensions = tableRef.current.getBoundingClientRect();
      return { width: dimensions.width, height: dimensions.height };
    }
    return { width: 0, height: 0 };
  };

  const onMouseMove = useCallback((e) => {
    if (!isDragging) {
      return;
    }
    const { width: tableWidth, height: tableHeight } = getTableDimensions();

    const newX = e.pageX - relPosition.x;
    const newY = e.pageY - relPosition.y;

    const constrainedX = Math.min(Math.max(newX, 0), window.innerWidth - tableWidth);
    const constrainedY = Math.min(Math.max(newY, 50), window.innerHeight - tableHeight);

    setPosition({
      x: constrainedX,
      y: constrainedY,
    });

    handleUpdatePosition(position.x, position.y);
  }, [isDragging, relPosition, position, handleUpdatePosition]); 

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const handleEditTableDetails = () => {
    setIsEditFormVisible(true);
  };  

  const handleDelete = () => {
    onDeleteTable(table.id);
  };

  const handleUpdateName = (newName) => {
    const isDuplicate = allTableNames.some(name => name.toLowerCase() === newName.toLowerCase() && name !== table.name);
    if (!isDuplicate) {
      onUpdateTable(table.id, newName);
      setIsEditFormVisible(false);
    } else {
      setPromptText("Table name already exists. Please choose a different name.");
      setPromptAction('alert');
      setShowPrompt(true);
    }
  };

  const handleDeleteAttribute = (attributeIndex) => {
    const updatedAttributes = table.attributes.filter((_, index) => index !== attributeIndex);
    onDeleteAttribute(table.id, updatedAttributes);
  };

  const handleConfirm = () => {
    if (promptAction === 'alert') {
      setShowPrompt(false);
    }
  };
  
  const handleCancel = () => {
    setShowPrompt(false);
  };
  
  return (
    <div>
      {showPrompt && (
        <Prompt
          question={promptText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {isEditFormVisible && (
        <GenericForm
          placeholder="Enter new table name"
          initialValue={table.name}
          onSubmit={handleUpdateName}
          onCancel={() => setIsEditFormVisible(false)}
        />
      )}
      {isAttributeFormVisible && (
        <AttributeForm
          tables={tables}
          thisTable={table}
          onCancel={() => setIsAttributeFormVisible(false)}
          onSubmit={(attributeDetails) => {
            onAddAttribute(table.id, attributeDetails);
            setIsAttributeFormVisible(false);
          }}
        />
      )}
      <div 
        style= {window.innerWidth >= 600 ? { left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' } : {}}
        onMouseDown={onMouseDown}
        className="table-container"
        ref={tableRef}
      >
        <div className="table-header" style={{background: color}}>
          <h2 className='table-name'>{table.name}</h2>
          <div className='tabler-header-buttons'>
            <button aria-label='add attribute' className='table-header-button' onClick={() => setIsAttributeFormVisible(true)}><i className="fa-solid fa-plus"></i></button>
            <button aria-label='edit table' className='table-header-button' onClick={handleEditTableDetails}><i className="fa-solid fa-pen-to-square"></i></button>
            <button aria-label='delete table' className='table-header-button' onClick={handleDelete}><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <ul className='attribute-list'>
        {table.attributes.map((attribute, index) => {
          return (
            <li id={`${table.name}-${attribute.name}`}className='attribute' key={index}>    
              <div>{attribute.name} <sub className="italic">{`(${attribute.type.toLowerCase()})`}</sub></div>
              <div className='attribute-left'>
                {attribute.constraints.foreignKey && <i className="fa-solid fa-share-nodes"></i>}
                {attribute.constraints.primaryKey && <i className="fa-solid fa-key"></i>}
                <button aria-label='delete attribute' onClick={() => handleDeleteAttribute(index)} className="attribute-action-button"><i className="fa-solid fa-xmark"></i></button>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}

export default Table;
