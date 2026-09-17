import React, { useState } from 'react';
import { PosProvider } from './context/PosContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import './styles/index.css';
import './styles/dashboard.css';
import './styles/landing.css';

/**
 * ============================================================================
 * LEARNING NOTE: APPLICATION ROOT & STATE PROVIDER
 * ============================================================================
 * In this file:
 * 1. `<PosProvider>` wraps all our pages so ANY page or modal can access the POS state.
 * 2. `currentPage` state controls which page is rendered on screen.
 *    By keeping it simple with a state variable, you don't even need heavy
 *    third-party router packages for this project, making it very easy to understand!
 * ============================================================================
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // default to dashboard or landing

  return (
    <PosProvider>
      {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <RegisterPage onNavigate={setCurrentPage} />}
      {currentPage === 'contact' && <ContactPage onNavigate={setCurrentPage} />}
    </PosProvider>
  );
}
