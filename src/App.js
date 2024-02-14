import './App.css';
import Header from './components/Header/Header.js';
import Content from './components/Content/Content.js'; // Make sure this component can accept and use props
import { useState, useEffect } from 'react';
import GenericForm from './components/GenericForm/GenericForm.js';
import Prompt from './components/Prompt/Prompt.js';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [formAction, setFormAction] = useState(''); // State to determine form action (addTable or editDatabaseName)
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptQuestion, setPromptQuestion] = useState('');
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    // Attempt to load the saved state from local storage
    const savedState = localStorage.getItem('dbSchemaConstructorState');
    if (savedState) {
      const { databaseName: loadedDatabaseName, tables: loadedTables } = JSON.parse(savedState);
      setDatabaseName(loadedDatabaseName);
      setTables(loadedTables);
    }
    setFirstLoad(true);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (firstLoad) {
      if (tables.length > 0 || databaseName !== "") { // Consider more nuanced conditions based on your app's logic
        const appState = { databaseName, tables };
        localStorage.setItem('dbSchemaConstructorState', JSON.stringify(appState));
      } else {
        showEditDatabaseNameForm(); 
      }
    }
  }, [databaseName, tables, firstLoad]);

  function generateSqlQuery(databaseName, tables) {
    let sql = `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;\nUSE \`${databaseName}\`;\n\n`;
    tables.forEach(table => {
      sql += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
      const attributeDefinitions = [];
      const primaryKeyParts = [];
      const foreignKeys = [];
  
      table.attributes.forEach(attr => {
        // Construct the SQL line for each attribute
        let attrSql = `  \`${attr.name}\` ${attr.type}`;
        if (attr.length) {
          attrSql += `(${attr.length})`;
        }
        if (attr.constraints.notNull) {
          attrSql += ` NOT NULL`;
        }
        if (attr.constraints.unique) {
          attrSql += ` UNIQUE`;
        }
        if (attr.constraints.primaryKey) {
          primaryKeyParts.push(`\`${attr.name}\``);
        }
        if (attr.constraints.autoIncrement) {
          attrSql += ` AUTO_INCREMENT`;
        }
        if (attr.defaultValue) {
          attrSql += ` DEFAULT '${attr.defaultValue}'`;
        }
        if (attr.constraints.foreignKey && attr.constraints.foreignKey.reference) {
          foreignKeys.push(`  FOREIGN KEY (\`${attr.name}\`) REFERENCES ${attr.constraints.foreignKey.reference}`);
        }
        attributeDefinitions.push(attrSql);
      });
  
      // Concatenate primary key parts if any
      if (primaryKeyParts.length > 0) {
        attributeDefinitions.push(`  PRIMARY KEY (${primaryKeyParts.join(', ')})`);
      }
  
      // Concatenate all attribute definitions and foreign keys
      sql += [...attributeDefinitions, ...foreignKeys].join(",\n") + '\n';
  
      sql += `);\n\n`;
    });
    return sql;
  }  
  
  function downloadSqlQuery(sql) {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${databaseName}.sql`; // Use the database name in the filename
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  const randomColor = () => {
    const colors = ["Crimson", "MediumSeaGreen", "CornFlowerBlue", "DarkViolet", "Orange"];
    return colors[tables.length % colors.length];
  };

  const handleFormSubmit = (inputValue) => {
    if (formAction === 'addTable') {
      // Check if the table name already exists
      const nameExists = tables.some(table => table.name === inputValue);
      if (nameExists) {
        alert('A table with this name already exists.'); // Notify the user
      } else {
        // Proceed to add the new table if the name doesn't exist
        const newTable = {
          id: tables.length + 1,
          name: inputValue,
          color: randomColor(),
          positionX: ((tables.length)*20),
          positionY: ((tables.length)*20 + 50),
          attributes: [],
        };
        setTables([...tables, newTable]);
      }
    } else if (formAction === 'editDatabaseName') {
      setDatabaseName(inputValue);
    }
    setShowForm(false); // Close the form after submission or if the table name exists
  };

  // Function to show the form for adding a table
  const showAddTableForm = () => {
    setFormAction('addTable');
    setShowForm(true);
  };

  // Function to show the form for editing the database name
  const showEditDatabaseNameForm = () => {
    setFormAction('editDatabaseName');
    setShowForm(true);
  };

  const handleDeleteDatabase = () => {
    setPromptQuestion("Are you sure you want to delete the entire database?");
    setShowPrompt(true);
  };

  const handleConfirm = () => {
    localStorage.removeItem('dbSchemaConstructorState');
    setDatabaseName('');
    setTables([]);
    setShowPrompt(false);
    showEditDatabaseNameForm();
  };
  
  const handleCancel = () => {
    setShowPrompt(false);
  };

  const handleDownloadDatabase = () => {
    const sql = generateSqlQuery(databaseName, tables);
    downloadSqlQuery(sql);
  };

  const handleDeleteTable = (tableId) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    setTables(updatedTables);
  };

  const handleUpdateTable = (tableId, newName, newColor) => {
    setTables(prevTables => prevTables.map(table => 
      table.id === tableId ? { ...table, name: newName } : table
    ));
  };  

  const handleUpdatePosition = (tableId, newPositionX, newPositionY) => {
    setTables(prevTables => prevTables.map(table => 
      table.id === tableId ? { ...table, positionX: newPositionX, positionY: newPositionY } : table
    ));
  };  

  const onAddAttribute = (tableId, attributeDetails) => {
    setTables(currentTables => currentTables.map(table => {
      if (table.id === tableId) {
        // Check if the attribute name already exists in this table
        const attributeNameExists = table.attributes.some(attribute => 
          attribute.name.toLowerCase() === attributeDetails.name.toLowerCase()
        );
  
        if (attributeNameExists) {
          // Optionally alert the user or handle this case as needed
          alert("Attribute name already exists in this table. Please choose a different name.");
          return table; // Return the table unchanged if the attribute name exists
        }
  
        // If the attribute name does not exist, add the new attribute
        return {
          ...table,
          attributes: [...table.attributes, attributeDetails]
        };
      }
      return table; // Return all other tables unchanged
    }));
  };
  
  const onDeleteAttribute = (tableId, newAttributes) => {
    setTables(tables => tables.map(table => {
      if (table.id === tableId) {
        return { ...table, attributes: newAttributes };
      }
      return table;
    }));
  };  

  function handleSaveDatabase() {
    const databaseState = { databaseName, tables };
    const databaseStateStr = JSON.stringify(databaseState, null, 2); // Beautify the JSON string
    const blob = new Blob([databaseStateStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${databaseName}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleOpenDatabase = (event) => {
    const file = event.target.files[0];
    if (!file) {
        alert("No File.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        try {
            const databaseState = JSON.parse(content);
            if (databaseState.databaseName || databaseState.tables) {
              const adjustedTables = databaseState.tables.map(table => {
                let { positionX, positionY } = table;

                if (positionX > window.innerWidth - 400) {
                  positionX = window.innerWidth - 400;
                }
                if (positionY > window.innerHeight - 400) {
                  positionY = window.innerHeight - 400;
                }
                return { ...table, positionX, positionY };
              });
                setDatabaseName(databaseState.databaseName);
                setTables(adjustedTables);
                window.location.reload();
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            console.error("Error parsing the file:", error);
            alert("An error occurred while reading the file.");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <Header
        onAddTable={showAddTableForm} // Updated to show form
        onDeleteDatabase={handleDeleteDatabase}
        onEditDatabaseName={showEditDatabaseNameForm} // Updated to show form
        onDownloadDatabase={handleDownloadDatabase}
        databaseName={databaseName}
        onSaveDatabase={handleSaveDatabase}
        onOpenDatabase={handleOpenDatabase}
      />
      {showPrompt && (
        <Prompt
          question={promptQuestion}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {showForm && (
        <GenericForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          placeholder={formAction === 'addTable' ? "Enter table name:" : "Enter new database name:"}
          initialValue={formAction === 'editDatabaseName' ? databaseName : ""}
        />
      )}
      <Content
        tables={tables}
        allTableNames={tables.map(t => t.name)}
        onDeleteTable={handleDeleteTable} // Passing the new handler to Content
        onUpdateTable={handleUpdateTable}
        onAddAttribute={onAddAttribute}
        onDeleteAttribute={onDeleteAttribute}
        onUpdatePosition={handleUpdatePosition}
      />
    </div>
  );
}

export default App;
