import React, { useState } from 'react';

export const CreateChat = ({ addUser }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(name);
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Join Chat</h1>
    
    <form onSubmit={handleSubmit}>
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label style={{ marginBottom: '10px' }}>Name:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div className="button-container">
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Join Chat
        </button>
      </div>
    </form>
  </div>
  
  );
};
