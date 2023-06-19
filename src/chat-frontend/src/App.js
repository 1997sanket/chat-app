import React, { useState } from 'react';
import { CreateChat } from './components/CreateChat';
import { ChatWindow } from './components/ChatWindow';

const App = () => {
  const [userName, setUserName] = useState('');

  const handleUserNameSubmit = (name) => {
    setUserName(name);
  };

  return (
    <div className="container">
      {userName ? (
        <ChatWindow userName={userName} />
      ) : (
        <CreateChat addUser={handleUserNameSubmit} />
      )}
    </div>
  );
};

export default App;
