import './Table.css';
import AttributeForm from '../AttributeForm/AttributeForm.js';
import { useState, useEffect, useCallback , useRef } from 'react';
import GenericForm from '../GenericForm/GenericForm.js';
import Prompt from '../Prompt/Prompt.js';

function Table({ table, onAddAttribute, onDeleteTable, onUpdateTable, allTableNames, onDeleteAttribute, color, positionX, positionY, onUpdatePosition }) {
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
      handleUpdatePosition(position.x, position.y);
    }
  }, [isDragging, position, handleUpdatePosition]);  

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
  }, [isDragging, relPosition]); 

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
          onCancel={() => setIsAttributeFormVisible(false)}
          onSubmit={(attributeDetails) => {
            const primaryKeyAlreadyExists = table.attributes.some(attr => attr.constraints.primaryKey);

            const typesRequiringLength = ['CHAR', 'VARCHAR', 'BINARY', 'VARBINARY'];
            const doesTypeRequireLength = typesRequiringLength.includes(attributeDetails.type);
            const isLengthProvided = attributeDetails.length > 0;

            if (!doesTypeRequireLength && isLengthProvided) {
              setIsAttributeFormVisible(false);
              setPromptText("This attribute type does not require a length.");
              setPromptAction('alert');
              setShowPrompt(true);
              return;
            } else if (doesTypeRequireLength && !isLengthProvided) {
              setIsAttributeFormVisible(false);
              setPromptText("This attribute type requires a length.");
              setPromptAction('alert');
              setShowPrompt(true);
              return;
            }

            if (attributeDetails.constraints.primaryKey && primaryKeyAlreadyExists) {
              setPromptText("A primary key already exists. Only one primary key is allowed per table.");
              setPromptAction('alert');
              setShowPrompt(true);
            } else if (attributeDetails.constraints.foreignKey) {
              const foreignTableExists = allTableNames.includes(attributeDetails.constraints.foreignKey.reference);
              const isNotSelfReference = attributeDetails.constraints.foreignKey.reference !== table.name;

              if (!foreignTableExists) {
                setPromptText("The foreign key must reference an existing table.");
                setPromptAction('alert');
                setShowPrompt(true);
              } else if (!isNotSelfReference) {
                setPromptText("The foreign key cannot reference its own table.");
                setPromptAction('alert');
                setShowPrompt(true);
              } else {
                onAddAttribute(table.id, attributeDetails);
              }
            } else {
              onAddAttribute(table.id, attributeDetails);
            }
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
          let constraints = [];
          if (attribute.constraints.notNull) constraints.push("NOT NULL");
          if (attribute.constraints.unique) constraints.push("UNIQUE");
          if (attribute.constraints.primaryKey) constraints.push("PRIMARY KEY");
          if (attribute.constraints.autoIncrement) constraints.push("AUTO_INCREMENT");
          if (attribute.constraints.foreignKey && attribute.constraints.foreignKey.reference) {
            constraints.push(`FOREIGN KEY (${attribute.constraints.foreignKey.reference})`);
          }
          
          const constraintsStr = constraints.length > 0 ? ` (${constraints.join(", ")})` : "";

          return (
            <li className='attribute' key={index}> 
              <div>{attribute.name} <span className="unfocus">{`(${attribute.type}${attribute.length ? `(${attribute.length})` : ''})${constraintsStr}`}</span></div>
              <button aria-label='delete attribute' onClick={() => handleDeleteAttribute(index)} className="attribute-action-button"><i className="fa-solid fa-xmark"></i></button>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}

export default Table;
