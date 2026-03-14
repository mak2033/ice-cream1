import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import Home from '@/src/pages/Home';
import Booking from '@/src/pages/Booking';
import Chat from '@/src/pages/Chat';
import Contact from '@/src/pages/Contact';
import Admin from '@/src/pages/Admin';
import MenuPage from '@/src/pages/Menu';
import FloatingChat from '@/src/components/FloatingChat';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-pink-100 selection:text-pink-600">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/adminjtc" element={<Admin />} />
          </Routes>
        </main>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}
