import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <Layout>
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                </Layout>
              }
            />
            <Route
              path="/legal"
              element={
                <Layout>
                  <Legal />
                </Layout>
              }
            />
            <Route
              path="/privacy"
              element={
                <Layout>
                  <Privacy />
                </Layout>
              }
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
