import './AttributeForm.css';
import { useState } from 'react';

function AttributeForm({ tables, thisTable, onCancel, onSubmit }) {
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('INT');
  const [attributeLength, setAttributeLength] = useState('');
  const [attributeDefaultValue, setAttributeDefaultValue] = useState('');
  const [attributeNotNull, setAttributeNotNull] = useState(false);
  const [attributeUnique, setAttributeUnique] = useState(false);
  const [attributePrimaryKey, setAttributePrimaryKey] = useState(false);
  const [attributeAutoIncrement, setAttributeAutoIncrement] = useState(false);
  const [foreignKeyTable, setForeignKeyTable] = useState('');
  const [foreignKeyAttribute, setForeignKeyAttribute] = useState('');
  const [isForeignKey, setIsForeignKey] = useState(false);
  const [attributeValues, setAttributeValues] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: attributeName,
      type: attributeType,
      length: attributeLength,
      defaultValue: attributeDefaultValue,
      values: attributeValues,
      constraints: {
        notNull: attributeNotNull,
        unique: attributeUnique,
        primaryKey: attributePrimaryKey,
        autoIncrement: attributeAutoIncrement,
        foreignKey: (foreignKeyTable && foreignKeyAttribute) ? { table: foreignKeyTable, attribute: foreignKeyAttribute } : undefined,
      },
    });

    resetForm();
  };

  const handleChangeForeignKey = (e) => {
    const [selectedTable, selectedAttribute] = e.target.value.split(',');
    setForeignKeyTable(selectedTable);
    setForeignKeyAttribute(selectedAttribute);
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
    setForeignKeyTable('');
    setForeignKeyAttribute('');
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
                  required
                >
                  <option value="INTEGER">INTEGER</option>
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
                  disabled={!['CHAR', 'VARCHAR', 'BINARY', 'VARBINARY', 'DECIMAL'].includes(attributeType)}
                  required={['CHAR', 'VARCHAR', 'BINARY', 'VARBINARY'].includes(attributeType)}
                  type="number"
                  placeholder="Length"
                  value={attributeLength}
                  min="1" step="1"
                  onChange={(e) => setAttributeLength(e.target.value)}
                />
                <input
                  disabled={!['ENUM', 'SET'].includes(attributeType)}
                  required={['ENUM', 'SET'].includes(attributeType)}
                  type="text"
                  placeholder="SET/ENUM Values (comma separated)"
                  value={attributeValues}
                  onChange={(e) => setAttributeValues(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Default Value"
                  value={attributeDefaultValue}
                  onChange={(e) => setAttributeDefaultValue(e.target.value)}
                />
                <select
                  disabled={!isForeignKey}
                  value={foreignKeyTable && foreignKeyAttribute ? [foreignKeyTable, foreignKeyAttribute].join(',') : ''}
                  onChange={handleChangeForeignKey}
                >
                  <option value="">None</option>
                  {tables.filter(table => table.name !== thisTable.name) // Compare by name or another identifier
                    .flatMap(table => 
                      table.attributes
                        .filter(attribute => attribute.constraints.primaryKey)
                        .map(attribute => (
                          <option key={`${table.name}-${attribute.name}`} value={`${table.name},${attribute.name}`}>
                            {`${table.name}, ${attribute.name}`}
                          </option>
                        ))
                    )
                  }
                </select>
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
                    disabled={thisTable && thisTable.attributes.some(attr => attr.constraints.primaryKey)}
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
                <label>
                  <input
                    type="checkbox"
                    checked={isForeignKey}
                    onChange={(e) => setIsForeignKey(e.target.checked)}
                  /> Foreign Key
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
