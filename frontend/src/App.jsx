import React, { useState, useEffect } from 'react';
import { PosProvider, usePos } from './context/PosContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import Toast from './components/common/Toast';
import './styles/index.css';
import './styles/dashboard.css';
import './styles/landing.css';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user, showToast } = usePos();

  useEffect(() => {
    if (currentPage === 'dashboard' && !user) {
      showToast('Please log in with your staff account to access the POS Dashboard.', 'error');
      setCurrentPage('login');
    }
  }, [currentPage, user, showToast]);

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === 'about' && <AboutPage onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && user && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <RegisterPage onNavigate={setCurrentPage} />}
      {currentPage === 'contact' && <ContactPage onNavigate={setCurrentPage} />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <PosProvider>
      <MainApp />
    </PosProvider>
  );
}
