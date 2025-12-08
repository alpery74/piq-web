import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await login(email, password);
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Unable to log in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <img src="/images/logo.svg" alt="PIQ Labs" className="w-12 h-12 rounded-lg mx-auto mb-3 shadow-sm" />
          <h1 className="text-2xl font-bold text-gray-900">Sign in to continue</h1>
          <p className="text-sm text-gray-600">Use your PIQ credentials to fetch your latest analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          {(formError || error) && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
              {formError || 'Login failed. Check your credentials and try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white font-semibold py-3 shadow-md hover:bg-primary-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500">
          Secure connection to PIQ Labs backend • Fintech-grade encryption
        </p>
      </div>
    </div>
  );
};

export default Login;
