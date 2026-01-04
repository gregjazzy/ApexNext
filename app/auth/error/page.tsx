'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const t = useTranslations('common');

  const errorMessages: Record<string, string> = {
    Configuration: "Il y a un problème de configuration du serveur.",
    AccessDenied: "Accès refusé. Vous n'avez pas la permission d'accéder à cette ressource.",
    Verification: "Le lien de vérification a expiré ou est invalide.",
    Default: "Une erreur s'est produite lors de l'authentification.",
  };

  const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-slate-100">{t('appName')}</h1>
              <p className="text-xs text-slate-500">{t('version')}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="apex-card p-8">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>

            <h1 className="text-2xl font-serif text-slate-100 mb-2">
              Erreur d'authentification
            </h1>
            
            <p className="text-slate-400 mb-6">
              {errorMessage}
            </p>

            <Link
              href="/auth/signin"
              className="apex-button inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

