import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/homePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <h1 className="home-title">Choose Your AI Chat Model</h1>
      <div className="card-container">
        <div className="card openai" onClick={() => navigate('/chat/openai')}>
          <h2>OpenAI</h2>
          <p>Powered by GPT-3.5 Turbo</p>
        </div>
        <div className="card ollama" onClick={() => navigate('/chat/ollama')}>
          <h2>Ollama</h2>
          <p>Runs locally with llama2</p>
        </div>
      </div>
    </div>
  );
}
