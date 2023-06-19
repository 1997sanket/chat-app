import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faUser);

const userColors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
  ];

export const ChatWindow = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);



  useEffect(() => {
    const socket = new window.SockJS('/ws');
    const stomp = new window.Stomp.over(socket);

    stomp.connect({}, () => {
        setStompClient(stomp);
        setIsConnected(true);
    });

    return () => {
      if (stompClient != null) {
        stompClient.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      addUser(userName);
    }
  }, [isConnected, userName]);

  useEffect(() => {
    if (stompClient != null) {
      stompClient.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        
        if (receivedMessage.messageType === 'MESSAGE') {
            setMessages((prevMessages) => {
                // Check if the received message already exists in the messages state
                const isMessageExists = prevMessages.some(
                  (msg, index) =>
                    msg.sender === receivedMessage.sender &&
                    msg.content === receivedMessage.content &&
                    index === prevMessages.length - 1
                );
              
                if (!isMessageExists) {
                  return [...prevMessages, receivedMessage];
                }
              
                return prevMessages;
              });
              
        } else if (receivedMessage.messageType === 'JOINED') {
          setUsers((prevUsers) => {
            if (!prevUsers.includes(receivedMessage.sender)) {
              return [...prevUsers, receivedMessage.sender];
            }
            return prevUsers;
          });
        } else if (receivedMessage.messageType === 'LEFT') {
          setUsers((prevUsers) => prevUsers.filter((user) => user !== receivedMessage.sender));
        }
      });
    }
  }, [stompClient]);
  
  

  const sendMessage = (message) => {
    if (stompClient != null) {
      stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
    }
    else {
        console.log('WebSocket connection not established.');
      }
  };

  const addUser = (name) => {

    if (stompClient != null) {

      console.log('add user');
      const chatMessage = {
        sender: name,
        messageType: 'JOINED',
      };
      stompClient.send('/app/chat.addUser', {}, JSON.stringify(chatMessage));
    }
    else {
        console.log('WebSocket connection not established while addUser');
      }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    if (message !== '') {
      const chatMessage = {
        sender: userName,
        content: message,
        messageType: 'MESSAGE'
      };
      sendMessage(chatMessage);
      e.target.reset();
    }
  };


  const getUserIconColor = (user) => {
    const index = users.indexOf(user);
    if (index !== -1) {
      return userColors[index % userColors.length];
    }
    return undefined;
  };


  return (
<div className="container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chat Window</h1>

      <div className="users" style={{ marginBottom: '20px' }}>
        <h3>Joined Users:</h3>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {users
            .filter((user) => user !== userName)
            .map((user, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <FontAwesomeIcon
                  icon="user"
                  style={{ marginRight: '5px', color: getUserIconColor(user) }}
                />
                {user}
              </li>
            ))}
        </ul>
      </div>

      <div className="messages" style={{ marginBottom: '20px' }}>
        <h3>Messages:</h3>
        {messages.map((message, index) => (
          <div key={index} className="message" style={{ marginBottom: '20px' }}>
            <strong>
              <FontAwesomeIcon
                icon="user"
                style={{ marginRight: '5px', color: getUserIconColor(message.sender) }}
              />
              {message.sender}:
            </strong>
            {message.content}
          </div>
        ))}
      </div>

      <div className="form-container">
        <form onSubmit={handleSendMessage}>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="message"
              className="form-control"
              placeholder="Type your message..."
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

