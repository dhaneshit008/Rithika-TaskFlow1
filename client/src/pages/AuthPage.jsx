import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 md:p-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-sky-600 to-blue-700 p-8 text-white lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">TaskFlow</p>
          <h1 className="mt-4 text-4xl font-semibold">Stay on top of every priority.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-sky-100">
            Plan your day clearly, track progress elegantly, and keep your workflow calm and focused.
          </p>
          <div className="mt-8 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <p className="text-sm font-medium">Why teams love it</p>
            <ul className="mt-3 space-y-2 text-sm text-sky-100">
              <li>• Fast task capture and updates</li>
              <li>• Clear dashboard insights</li>
              <li>• Clean mobile-friendly experience</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-600">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
              <h2 className="text-2xl font-semibold text-slate-900">{mode === 'login' ? 'Sign in to TaskFlow' : 'Join TaskFlow'}</h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-500 hover:text-sky-600"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Alex Morgan"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="At least 6 characters"
              />
            </div>
            {error && <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <Link to="#" className="font-semibold text-sky-600" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
