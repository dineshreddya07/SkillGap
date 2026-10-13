import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess = () => {} }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(name.trim() || null, email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-lux-surface rounded-panel border border-lux-border shadow-dropdown p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-lux-muted hover:text-lux-text hover:bg-lux-bg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pb-4 border-b border-lux-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center border border-lux-cobalt-border">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold tracking-tight text-lux-text">
              {mode === 'signup' ? 'Create SkillGap Account' : 'Sign in to SkillGap'}
            </h2>
          </div>
          <p className="text-2xs text-lux-secondary">
            {mode === 'signup'
              ? 'Save your evaluations, track skill roadmaps, and isolate your career history.'
              : 'Access your private resume analysis history and learning roadmaps.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-md bg-lux-bg p-0.5 border border-lux-border my-4">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
              mode === 'login'
                ? 'bg-lux-surface text-lux-text shadow-2xs font-semibold'
                : 'text-lux-secondary hover:text-lux-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
              mode === 'signup'
                ? 'bg-lux-surface text-lux-text shadow-2xs font-semibold'
                : 'text-lux-secondary hover:text-lux-text'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-md bg-lux-error-subtle border border-lux-error-border text-lux-error flex items-start gap-2 text-2xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-2xs font-semibold text-lux-secondary uppercase tracking-wider mb-1">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-lux-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-lux-border bg-lux-surface text-lux-text placeholder:text-lux-muted focus:border-lux-cobalt focus:ring-1 focus:ring-lux-cobalt transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-2xs font-semibold text-lux-secondary uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-lux-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-lux-border bg-lux-surface text-lux-text placeholder:text-lux-muted focus:border-lux-cobalt focus:ring-1 focus:ring-lux-cobalt transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-lux-secondary uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-lux-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-lux-border bg-lux-surface text-lux-text placeholder:text-lux-muted focus:border-lux-cobalt focus:ring-1 focus:ring-lux-cobalt transition-colors"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-2xs text-lux-muted mt-1">Must be at least 8 characters long</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-3 rounded-md text-xs font-medium text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{mode === 'signup' ? 'Creating Account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-lux-border text-center text-2xs text-lux-muted">
          <span>Your evaluations remain completely private to your account.</span>
        </div>
      </div>
    </div>
  );
}
