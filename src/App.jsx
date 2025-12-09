import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import CommandPalette from './components/common/CommandPalette';
import SettingsModal from './components/common/SettingsModal';
import OnboardingWizard, { useOnboarding, OnboardingProvider } from './components/common/OnboardingWizard';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Wrapper component to manage global modals
const AppContent = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toast = useToast();
  const onboarding = useOnboarding();

  const handleOpenSearch = () => setSearchOpen(true);
  const handleCloseSearch = () => setSearchOpen(false);
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);
  const handleStartTour = () => onboarding.startTour();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings} onStartTour={handleStartTour}>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </Layout>
          }
        />
        <Route
          path="/legal"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings} onStartTour={handleStartTour}>
              <Legal />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings} onStartTour={handleStartTour}>
              <Privacy />
            </Layout>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>

      {/* Global Command Palette */}
      <CommandPalette isOpen={searchOpen} onClose={handleCloseSearch} />

      {/* Global Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={handleCloseSettings} />

      {/* Global Onboarding Wizard */}
      <OnboardingWizard
        isOpen={onboarding.isOpen}
        onClose={onboarding.endTour}
        onComplete={() => {
          toast.success('Welcome!', "You're all set to explore your portfolio");
        }}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <OnboardingProvider>
          <Router>
            <AppContent />
          </Router>
        </OnboardingProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
