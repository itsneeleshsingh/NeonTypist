import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
        {/* Top Navbar */}
        <Navbar />

        {/* Core Route Viewports */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
