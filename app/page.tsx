'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');

  // Redirect to audit if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/audit');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto animate-pulse">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-slate-100">{t('appName')}</h1>
              <p className="text-xs text-slate-500">{t('version')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/auth/signin"
              className="apex-button flex items-center gap-2"
            >
              {tAuth('signIn')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20"
            >
              <Compass className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl font-bold text-slate-100 mb-6"
            >
              {t('appName')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10"
            >
              {t('tagline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-medium text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-xl shadow-blue-500/20 transition-all"
              >
                Commencer le diagnostic
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 py-16"
          >
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Audit de Résilience",
                description: "Évaluez la vulnérabilité de vos tâches face à l'automatisation IA",
                color: "blue",
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Signature des Talents",
                description: "Identifiez vos 5 talents majeurs qui font votre force unique",
                color: "amber",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Trajectoire Optimale",
                description: "Construisez votre chemin vers une carrière augmentée par l'IA",
                color: "emerald",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="apex-card p-8 text-center"
              >
                <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${
                  feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  feature.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-medium text-slate-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            {t('appName')} • {t('tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}
