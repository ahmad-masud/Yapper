import './Prompt.css';

function Prompt({ question, onConfirm, onCancel }) {
  return (
    <div className="prompt-overlay">
      <div className="prompt-container">
        <p className="prompt-question">{question}</p>
        <div className="prompt-actions">
          <button className="prompt-button confirm" onClick={onConfirm}>OK</button>
          <button className="prompt-button cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Prompt;
