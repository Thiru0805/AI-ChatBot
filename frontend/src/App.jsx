import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage';
import ChatOpenAI from './components/chatOpenAI';
import ChatOllama from './components/chatOllama';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/openai" element={<ChatOpenAI />} />
        <Route path="/chat/ollama" element={<ChatOllama />} />
      </Routes>
    </Router>
  );
}

export default App;
