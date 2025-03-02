import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateCharacter from './pages/CreateCharacter';
import ViewCharacter from './pages/ViewCharacter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCharacter />} />
        <Route path="/view/:id" element={<ViewCharacter />} />
      </Routes>
    </Router>
  );
}

export default App;
