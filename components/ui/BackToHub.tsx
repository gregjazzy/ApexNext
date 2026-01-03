'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Save, ChevronLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

interface BackToHubProps {
  /**
   * Si true, affiche "Enregistrer et retourner au Hub"
   * Si false, affiche juste "Retour au Hub"
   */
  showSave?: boolean;
  
  /**
   * Callback optionnel exécuté avant la navigation
   * Utile pour sauvegarder des données
   */
  onBeforeNavigate?: () => void | Promise<void>;
  
  /**
   * Variante du bouton
   */
  variant?: 'default' | 'compact' | 'footer';
  
  /**
   * Classe CSS additionnelle
   */
  className?: string;
}

export function BackToHub({ 
  showSave = false, 
  onBeforeNavigate,
  variant = 'default',
  className = ''
}: BackToHubProps) {
  const router = useRouter();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';

  const handleClick = async () => {
    if (onBeforeNavigate) {
      await onBeforeNavigate();
    }
    router.push('/hub');
  };

  const labels = {
    saveAndBack: { fr: 'Enregistrer et retourner au Hub', en: 'Save and return to Hub' },
    back: { fr: 'Retour au Hub', en: 'Back to Hub' },
    hub: { fr: 'Hub', en: 'Hub' },
  };

  // Variante compacte (juste l'icône avec texte court)
  if (variant === 'compact') {
    return (
      <motion.button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-slate-800/50 hover:bg-slate-800 transition-colors
          text-slate-400 hover:text-slate-200
          ${className}
        `}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <ChevronLeft className="w-4 h-4" />
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">{labels.hub[l]}</span>
      </motion.button>
    );
  }

  // Variante footer (pour mettre dans le footer d'une page)
  if (variant === 'footer') {
    return (
      <motion.button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-indigo-500/10 border border-indigo-500/30
          text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300
          transition-all duration-300
          ${className}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium">
          {showSave ? labels.saveAndBack[l] : labels.back[l]}
        </span>
      </motion.button>
    );
  }

  // Variante par défaut
  return (
    <motion.button
      onClick={handleClick}
      className={`
        flex items-center gap-3 px-5 py-3 rounded-xl
        bg-slate-800/50 border border-slate-700/50
        hover:bg-slate-800 hover:border-slate-600
        text-slate-300 hover:text-white
        transition-all duration-300 group
        ${className}
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        {showSave ? (
          <Save className="w-5 h-5 text-indigo-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        )}
        <LayoutGrid className="w-5 h-5 text-indigo-400" />
      </div>
      <span className="font-medium">
        {showSave ? labels.saveAndBack[l] : labels.back[l]}
      </span>
    </motion.button>
  );
}

export default BackToHub;

