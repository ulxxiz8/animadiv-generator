import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Collections from './pages/Collections';
import MySets from './pages/MySets';
import About from './pages/About';
import GeneratorPage from './features/generator/GeneratorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout огортає всі маршрути */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="library" element={<Library />} />
          <Route path="collections" element={<Collections />} />
          <Route path="mysets" element={<MySets />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
