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

  const handleOpenSearch = () => setSearchOpen(true);
  const handleCloseSearch = () => setSearchOpen(false);
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings}>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </Layout>
          }
        />
        <Route
          path="/legal"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings}>
              <Legal />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout onOpenSearch={handleOpenSearch} onOpenSettings={handleOpenSettings}>
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
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
