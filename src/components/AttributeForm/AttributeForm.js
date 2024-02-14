import './AttributeForm.css';
import { useState } from 'react';

function AttributeForm({ onCancel, onSubmit }) {
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('INT');
  const [attributeLength, setAttributeLength] = useState('');
  const [attributeDefaultValue, setAttributeDefaultValue] = useState('');
  const [attributeNotNull, setAttributeNotNull] = useState(false);
  const [attributeUnique, setAttributeUnique] = useState(false);
  const [attributePrimaryKey, setAttributePrimaryKey] = useState(false);
  const [attributeAutoIncrement, setAttributeAutoIncrement] = useState(false);
  const [foreignKeyReference, setForeignKeyReference] = useState(''); // State for foreign key reference

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: attributeName,
      type: attributeType,
      length: attributeLength,
      defaultValue: attributeDefaultValue,
      constraints: {
        notNull: attributeNotNull,
        unique: attributeUnique,
        primaryKey: attributePrimaryKey,
        autoIncrement: attributeAutoIncrement,
        foreignKey: foreignKeyReference ? { reference: foreignKeyReference } : undefined, // Include foreign key info if provided
      },
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setAttributeName('');
    setAttributeType('INT');
    setAttributeLength('');
    setAttributeDefaultValue('');
    setAttributeNotNull(false);
    setAttributeUnique(false);
    setAttributePrimaryKey(false);
    setAttributeAutoIncrement(false);
    setForeignKeyReference('');
  };

  return (
    <div className="form-overlay">
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  required
                />
                <select
                  value={attributeType}
                  onChange={(e) => setAttributeType(e.target.value)}
                  required>
                  <option value="INTEGER">INT</option>
                  <option value="SMALLINT">SMALLINT</option>
                  <option value="BIGINT">BIGINT</option>
                  <option value="DECIMAL">DECIMAL</option>
                  <option value="FLOAT">FLOAT</option>
                  <option value="DOUBLE">DOUBLE</option>
                  <option value="CHAR">CHAR</option>
                  <option value="VARCHAR">VARCHAR</option>
                  <option value="TEXT">TEXT</option>
                  <option value="ENUM">ENUM</option>
                  <option value="SET">SET</option>
                  <option value="DATE">DATE</option>
                  <option value="TIME">TIME</option>
                  <option value="DATETIME">DATETIME</option>
                  <option value="TIMESTAMP">TIMESTAMP</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="BINARY">BINARY</option>
                  <option value="VARBINARY">VARBINARY</option>
                  <option value="BLOB">BLOB</option>
                  <option value="GEOMETRY">GEOMETRY</option>
                  <option value="POINT">POINT</option>
                  <option value="LINESTRING">LINESTRING</option>
                  <option value="POLYGON">POLYGON</option>
                </select>
                <input
                  type="text"
                  placeholder="Length"
                  value={attributeLength}
                  onChange={(e) => setAttributeLength(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Default Value"
                  value={attributeDefaultValue}
                  onChange={(e) => setAttributeDefaultValue(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Foreign Key Reference (Leave blank if not a foreign key)"
                  value={foreignKeyReference}
                  onChange={(e) => setForeignKeyReference(e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={attributeNotNull}
                    onChange={(e) => setAttributeNotNull(e.target.checked)}
                  /> Not Null
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={attributeUnique}
                    onChange={(e) => setAttributeUnique(e.target.checked)}
                  /> Unique
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={attributePrimaryKey}
                    onChange={(e) => setAttributePrimaryKey(e.target.checked)}
                  /> Primary Key
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={attributeAutoIncrement}
                    onChange={(e) => setAttributeAutoIncrement(e.target.checked)}
                  /> Auto Increment
                </label>
                <div className='form-buttons-container'>
                  <button className="submit-button" type="submit">Submit</button>
                  <button className="cancel-button" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default AttributeForm;
