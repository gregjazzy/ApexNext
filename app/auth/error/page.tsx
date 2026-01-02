'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: "Il y a un problème de configuration du serveur.",
    AccessDenied: "Accès refusé. Vous n'avez pas la permission d'accéder à cette ressource.",
    Verification: "Le lien de vérification a expiré ou est invalide.",
    Default: "Une erreur s'est produite lors de l'authentification.",
  };

  const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
  );
}

