import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import Home from '@/src/pages/Home';
import Booking from '@/src/pages/Booking';
import Chat from '@/src/pages/Chat';
import Contact from '@/src/pages/Contact';
import Admin from '@/src/pages/Admin';
import MenuPage from '@/src/pages/Menu';
import FloatingChat from '@/src/components/FloatingChat';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, hash]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/adminjtc';

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-pink-100 selection:text-pink-600">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
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
      {!isAdmin && <FloatingChat />}
      {!isAdmin && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
