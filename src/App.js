import './styles/App.css';
import Header from './components/Header.js';
import Content from './components/Content.js';
import { useState, useEffect } from 'react';
import GenericForm from './components/GenericForm.js';
import Prompt from './components/Prompt.js';
import generateSqlQuery from './utils/generateSqlQuery.js';
import downloadSqlQuery from './utils/downloadSqlQuery.js';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [promptAction, setPromptAction] = useState('');
  const [firstLoad, setFirstLoad] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const savedState = localStorage.getItem('dbSchemaConstructorState');
    if (savedState) {
      const { databaseName: loadedDatabaseName, tables: loadedTables, connections: loadedConnections } = JSON.parse(savedState);
      setDatabaseName(loadedDatabaseName);
      setTables(loadedTables);
      setConnections(loadedConnections);
    }
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      if (tables.length > 0 || databaseName !== "" || connections.length > 0) {
        const appState = { databaseName, tables, connections };
        localStorage.setItem('dbSchemaConstructorState', JSON.stringify(appState));
      } else {
        showEditDatabaseNameForm(); 
      }
    }
  }, [databaseName, tables, connections, firstLoad]);
  
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
              "autoIncrement": true,
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

        if (attributeDetails.constraints.foreignKey) {
          const sourceId = `${table.name}-${attributeDetails.name}`;
          const targetId = `${attributeDetails.constraints.foreignKey.table}-${attributeDetails.constraints.foreignKey.attribute}`;
          const newConnection = { source: sourceId, target: targetId };
          setConnections(connections => [...connections, newConnection]);
        }
  
        return {
          ...table,
          attributes: [...table.attributes, attributeDetails]
        };
      }
      return table;
    }));
  };
  
  const onDeleteAttribute = (tableId, attributeIndex) => {
    setTables(tables => tables.map(table => {
      if (table.id === tableId) {

        if (table.attributes[attributeIndex].constraints.foreignKey) {
          const sourceId = `${table.name}-${table.attributes[attributeIndex].name}`;
          const updatedConnections = connections.filter(connection => 
            connection.source !== sourceId
          );
          setConnections(updatedConnections);
        } else if (table.attributes[attributeIndex].constraints.primaryKey) {
          const targetId = `${table.name}-${table.attributes[attributeIndex].name}`;
          const updatedConnections = connections.filter(connection => 
            connection.target !== targetId
          );
          setConnections(updatedConnections);
        }

        const updatedAttributes = table.attributes.filter((_, index) => index !== attributeIndex);
        return { ...table, attributes: updatedAttributes };
      }
      return table;
    }));
  };  

  function handleSaveDatabase() {
    const databaseState = { databaseName, tables, connections };
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
            if (databaseState.databaseName || databaseState.tables || databaseState.connections) {
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
                setConnections(databaseState.connections);
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
        connections={connections}
      />
    </div>
  );
}

export default App;
