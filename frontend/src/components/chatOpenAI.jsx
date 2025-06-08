import React, { useState, useEffect, useRef } from 'react';
import '../styles/chatOpenAI.css';

export default function ChatOpenAI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am OpenAI. How can I help you today?' }
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMsg = { sender: 'user', text: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput })
      });

      const data = await res.json();
      if (res.status === 429) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.error }]);
      } else if (!res.ok) {
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Oops! Something went wrong.' }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Network error. Try again.' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="back-button" onClick={handleBack} aria-label="Go Back">
          ← Back
        </button>
        OpenAI Chat
      </header>
      <div className="chat-messages" ref={containerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          rows="1"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
