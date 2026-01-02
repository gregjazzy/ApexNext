'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, Github, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function SignInPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/audit';
  const error = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await signIn('credentials', {
      email,
      password,
      callbackUrl,
    });
    
    setIsLoading(false);
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Compass className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-slate-100">
            {tCommon('appName')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{tCommon('version')}</p>
        </div>

        {/* Card */}
        <div className="apex-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-serif text-slate-100 mb-2">
              {t('welcomeBack')}
            </h2>
            <p className="text-sm text-slate-400">
              {t('welcomeMessage')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center"
            >
              {t('invalidCredentials')}
            </motion.div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              onClick={() => handleOAuthSignIn('github')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Github className="w-5 h-5" />
              {t('signInWithGitHub')}
            </motion.button>

            <motion.button
              onClick={() => handleOAuthSignIn('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('signInWithGoogle')}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="apex-divider" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-xs text-slate-500">
              {t('orContinueWith')}
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="apex-label flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="apex-input"
                required
              />
            </div>

            <div>
              <label className="apex-label flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="apex-input"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="apex-button w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('signInWithEmail')
              )}
            </motion.button>
          </form>

          {/* Demo hint */}
          <p className="mt-6 text-center text-xs text-slate-500">
            {t('demoCredentials')} <code className="text-blue-400">demo123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

