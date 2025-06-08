import React, { useState, useEffect, useRef } from 'react';
import '../styles/chatOllama.css';

export default function ChatOllama() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! This is Ollama. How can I help you today?' }
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat-ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.error || 'Something went wrong. Please try again.' }
        ]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.data }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Network error. Please try again.' }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="chat-container-ollama">
      <header className="chat-header-ollama">
        <button className="back-button" onClick={handleBack} aria-label="Go Back">
          ← Back
        </button>
        🤖 Ollama Chat
      </header>
      <div className="chat-messages" ref={containerRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          placeholder="Ask Ollama anything..."
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
