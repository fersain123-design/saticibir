import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Giriş başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Manavım Logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Satıcı Paneli</h1>
          <p className="text-text-secondary mt-2">Hesabınıza giriş yapın</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-primary hover:text-primary-600 font-medium">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
