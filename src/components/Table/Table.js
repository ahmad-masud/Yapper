import './Table.css'; // Ensure you have a CSS file for styling
import AttributeForm from '../AttributeForm/AttributeForm.js'; // Adjust the import path as needed
import { useState, useEffect, useCallback } from 'react';
import GenericForm from '../GenericForm/GenericForm.js'; // Adjust the path as needed

function Table({ table, onAddAttribute, onDeleteTable, onUpdateTable, allTableNames, onDeleteAttribute, color, positionX, positionY, onUpdatePosition }) {
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: positionX , y: positionY });
  const [relPosition, setRelPosition] = useState(null); // Relative position to the cursor

  const handleUpdatePosition = useCallback((newX, newY) => {
    onUpdatePosition(table.id, newX, newY);
  }, [table.id, onUpdatePosition]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setRelPosition({
      x: e.pageX - position.x,
      y: e.pageY - position.y,
    });
    e.preventDefault(); // Prevent default drag behavior
  };

  // Memoize onMouseUp to prevent it from changing on every render
  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      handleUpdatePosition(position.x, position.y); // Update the position only once, when the drag ends
    }
  }, [isDragging, position, handleUpdatePosition]);  

  // Memoize onMouseMove similarly
  const onMouseMove = useCallback((e) => {
    if (!isDragging) {
      return;
    }
    // Update position logic...
    setPosition({
      x: e.pageX - relPosition.x,
      y: e.pageY - relPosition.y,
    });
  }, [isDragging, relPosition]); // Ensure all variables used in the function are listed in the dependency array

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const handleEditTableDetails = () => {
    setIsEditFormVisible(true); // Show the form instead of using prompt
  };  

  const handleDelete = () => {
    onDeleteTable(table.id);
  };

  const handleUpdateName = (newName) => {
    const isDuplicate = allTableNames.some(name => name.toLowerCase() === newName.toLowerCase() && name !== table.name);
    if (!isDuplicate) {
      onUpdateTable(table.id, newName);
      setIsEditFormVisible(false); // Hide form after successful update
    } else {
      alert("Table name already exists. Please choose a different name.");
    }
  };

  const handleDeleteAttribute = (attributeIndex) => {
    // Create a new array without the attribute to be deleted
    const updatedAttributes = table.attributes.filter((_, index) => index !== attributeIndex);
    // Update the table's attributes list with this new array
    onDeleteAttribute(table.id, updatedAttributes);
  };
  

  return (
    <div>
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
            // Check if the new attribute is a primary key and if another primary key already exists
            const primaryKeyAlreadyExists = table.attributes.some(attr => attr.constraints.primaryKey);

            if (attributeDetails.constraints.primaryKey && primaryKeyAlreadyExists) {
              alert("A primary key already exists. Only one primary key is allowed per table.");
            } else if (attributeDetails.constraints.foreignKey) {
              // Ensure the foreign key reference is to an existing table and not its own table
              const foreignTableExists = allTableNames.includes(attributeDetails.constraints.foreignKey.reference);
              const isNotSelfReference = attributeDetails.constraints.foreignKey.reference !== table.name;

              if (!foreignTableExists) {
                alert("The foreign key must reference an existing table.");
              } else if (!isNotSelfReference) {
                alert("The foreign key cannot reference its own table.");
              } else {
                // If no primary key conflict and foreign key is valid, proceed to add the new attribute
                onAddAttribute(table.id, attributeDetails);
              }
            } else {
              // If no primary key conflict and no foreign key or valid foreign key, proceed to add the new attribute
              onAddAttribute(table.id, attributeDetails);
            }
            setIsAttributeFormVisible(false); // Close modal upon form submission
          }}
        />
      )}
      <div 
        style= {window.innerWidth >= 600 ? { left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' } : {}}
        onMouseDown={onMouseDown}
        className="table-container"
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
          // Construct a string with constraints
          let constraints = [];
          if (attribute.constraints.notNull) constraints.push("NOT NULL");
          if (attribute.constraints.unique) constraints.push("UNIQUE");
          if (attribute.constraints.primaryKey) constraints.push("PRIMARY KEY");
          if (attribute.constraints.autoIncrement) constraints.push("AUTO_INCREMENT");
          // Check for foreign key constraint and add to constraints list
          if (attribute.constraints.foreignKey && attribute.constraints.foreignKey.reference) {
            constraints.push(`FOREIGN KEY (${attribute.constraints.foreignKey.reference})`);
          }

          // Join the constraints with commas and enclose in brackets if there are any
          const constraintsStr = constraints.length > 0 ? ` (${constraints.join(", ")})` : "";

          return (
            <li className='attribute' key={index}> 
              {attribute.name}<span className="unfocus">{`(${attribute.type}${attribute.length ? `(${attribute.length})` : ''})${constraintsStr}`}</span>
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
