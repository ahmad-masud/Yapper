import { useState, useEffect } from 'react';
import { db } from '../config/firebase-config'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import '../styles/ModifyDatabasesForm.css';

function ModifyDatabasesForm({ userId, onSubmit, onCancel }) {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [action, setAction] = useState('');

  // Fetch databases from Firestore
  useEffect(() => {
    const fetchDatabases = async () => {
      if (!userId) return; // Ensure there's a user ID

      const databasesCollectionRef = collection(db, `users/${userId}/databases`);
      const querySnapshot = await getDocs(databasesCollectionRef);
      const loadedDatabases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDatabases(loadedDatabases);
    };

    fetchDatabases();
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(action, selectedDatabase); // Pass the selected database ID or object
    onCancel();
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              id="databaseSelect"
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              required
            >
              <option value="">Please select a database</option>
              {databases.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.databaseName} {/* Assuming each doc has a databaseName field */}
                </option>
              ))}
            </select>
          </div>
          <div className='form-buttons-container'>
            <button className="submit-button" onClick={() => setAction('load')} type="submit">Load</button>
            <button className="submit-button" onClick={() => setAction('delete')} type="submit">Delete</button>
            <button className="cancel-button" type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyDatabasesForm;
