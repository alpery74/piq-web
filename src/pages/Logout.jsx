import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    localStorage.removeItem('analysisRunId');
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  return null;
};

export default Logout;
