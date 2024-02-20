import React, { useState } from 'react';
import '../styles/GenericForm.css';

function GenericForm({ onSubmit, onCancel, placeholder, initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
    onCancel();
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <div className='form-buttons-container'>
            <button className="submit-button" type="submit">Submit</button>
            <button className="cancel-button" type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenericForm;
