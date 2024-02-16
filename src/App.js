import './App.css';
import Header from './components/Header/Header.js';
import Content from './components/Content/Content.js';
import { useState, useEffect } from 'react';
import GenericForm from './components/GenericForm/GenericForm.js';
import Prompt from './components/Prompt/Prompt.js';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [promptAction, setPromptAction] = useState('');
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('dbSchemaConstructorState');
    if (savedState) {
      const { databaseName: loadedDatabaseName, tables: loadedTables } = JSON.parse(savedState);
      setDatabaseName(loadedDatabaseName);
      setTables(loadedTables);
    }
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      if (tables.length > 0 || databaseName !== "") {
        const appState = { databaseName, tables };
        localStorage.setItem('dbSchemaConstructorState', JSON.stringify(appState));
      } else {
        showEditDatabaseNameForm(); 
      }
    }
  }, [databaseName, tables, firstLoad]);

  function generateSqlQuery(databaseName, tables) {
    let sql = `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;\nUSE \`${databaseName}\`;\n\n`;
    let foreignKeyStatements = [];
  
    tables.forEach(table => {
        sql += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
        const attributeDefinitions = [];
        const primaryKeyParts = [];
  
        table.attributes.forEach(attr => {
            let attrSql = `  \`${attr.name}\` ${attr.type}`;
            if (attr.length) {
                attrSql += `(${attr.length})`;
            }
            if (attr.values) {
                attrSql += ` ENUM(${attr.values.map(value => `'${value}'`).join(', ')})`;
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
            if (attr.comment) {
                attrSql += ` COMMENT '${attr.comment}'`;
            }
  
            attributeDefinitions.push(attrSql);
        });
  
        if (primaryKeyParts.length > 0) {
            attributeDefinitions.push(`  PRIMARY KEY (${primaryKeyParts.join(', ')})`);
        }
  
        sql += [...attributeDefinitions].join(",\n") + '\n);\n\n';
  
        // Prepare FOREIGN KEY statements for later
        table.attributes.forEach(attr => {
            if (attr.constraints.foreignKey && attr.constraints.foreignKey.table && attr.constraints.foreignKey.attribute) {
                const fkStatement = `ALTER TABLE \`${table.name}\` ADD CONSTRAINT fk_${table.name}_${attr.name} FOREIGN KEY (\`${attr.name}\`) REFERENCES \`${attr.constraints.foreignKey.table}\`(\`${attr.constraints.foreignKey.attribute}\`);\n`;
                foreignKeyStatements.push(fkStatement);
            }
        });
    });
  
    // Append all foreign key statements after table creation
    sql += foreignKeyStatements.join("\n");
  
    return sql;
  }  

  function downloadSqlQuery(sql) {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${databaseName}.sql`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  const randomColor = () => {
    const colors = ["red", "green", "blue", "purple"];
    return colors[tables.length % colors.length];
  };

  const handleFormSubmit = (inputValue) => {
    if (formAction === 'addTable') {
      const nameExists = tables.some(table => table.name.toLowerCase() === inputValue.toLowerCase());
      if (nameExists) {
        setShowForm(false);
        setPromptText("A table with this name already exists.");
        setPromptAction('alert');
        setShowPrompt(true);
      } else {
        const newTable = {
          id: tables.length + 1,
          name: inputValue,
          color: randomColor(),
          positionX: ((tables.length)*20),
          positionY: ((tables.length)*20 + 50),
          attributes: [{
            "name": "createdAt",
            "type": "TIMESTAMP",
            "length": "",
            "defaultValue": "",
            "values": "",
            "constraints": {
              "notNull": false,
              "unique": false,
              "primaryKey": false,
              "autoIncrement": true
            }
          }],
        };
        setTables([...tables, newTable]);
      }
    } else if (formAction === 'editDatabaseName') {
      setDatabaseName(inputValue);
    }
    setShowForm(false);
  };

  const showAddTableForm = () => {
    setFormAction('addTable');
    setShowForm(true);
  };

  const showEditDatabaseNameForm = () => {
    setFormAction('editDatabaseName');
    setShowForm(true);
  };

  const handleDeleteDatabase = () => {
    setPromptText("Are you sure you want to delete the entire database?");
    setPromptAction('deleteDatabase');
    setShowPrompt(true);
  };

  const handleConfirm = () => {
    if (promptAction === 'deleteDatabase') {
      localStorage.removeItem('dbSchemaConstructorState');
      setDatabaseName('');
      setTables([]);
      setShowPrompt(false);
      showEditDatabaseNameForm();
    } else if (promptAction === 'alert') {
      setShowPrompt(false);
    }
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
        const attributeNameExists = table.attributes.some(attribute => 
          attribute.name.toLowerCase() === attributeDetails.name.toLowerCase()
        );
  
        if (attributeNameExists) {
          setPromptText("Attribute name already exists in this table. Please choose a different name.");
          setPromptAction('alert');
          setShowPrompt(true);
          return table;
        }
  
        return {
          ...table,
          attributes: [...table.attributes, attributeDetails]
        };
      }
      return table;
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
    const databaseStateStr = JSON.stringify(databaseState, null, 2);
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
        setPromptText("No File.");
        setPromptAction('alert');
        setShowPrompt(true);
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
              setPromptText("Invalid file format.");
              setPromptAction('alert');
              setShowPrompt(true);
            }
        } catch (error) {
            console.error("Error parsing the file:", error);
            setPromptText("An error occurred while reading the file.");
            setPromptAction('alert');
            setShowPrompt(true);
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <Header
        onAddTable={showAddTableForm}
        onDeleteDatabase={handleDeleteDatabase}
        onEditDatabaseName={showEditDatabaseNameForm}
        onDownloadDatabase={handleDownloadDatabase}
        databaseName={databaseName}
        onSaveDatabase={handleSaveDatabase}
        onOpenDatabase={handleOpenDatabase}
      />
      {showPrompt && (
        <Prompt
          question={promptText}
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
        onDeleteTable={handleDeleteTable}
        onUpdateTable={handleUpdateTable}
        onAddAttribute={onAddAttribute}
        onDeleteAttribute={onDeleteAttribute}
        onUpdatePosition={handleUpdatePosition}
      />
    </div>
  );
}

export default App;
