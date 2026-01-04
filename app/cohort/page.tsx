'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Users, Zap } from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { CohortDashboard } from '@/components/CohortDashboard';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { ResetButton } from '@/components/ui/ResetButton';
import { BackToHub } from '@/components/ui/BackToHub';

export default function CohortPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { context } = useAuditStore();
  const [isClient, setIsClient] = useState(false);

  // Cohorte accessible pour Leader en mode Augmentation ou Pivot (pas reclassement = Job Designer)
  const isLeader = context.persona === 'leader';
  const isCohortMode = isLeader && (context.goal === 'augmentation' || context.goal === 'pivot');
  const isPSEMode = context.goal === 'pivot';

  useEffect(() => {
    setIsClient(true);
    // Vérifier que l'utilisateur est en mode cohorte (Leader + Augmentation ou Pivot)
    if (!isCohortMode) {
      router.push('/hub');
    }
  }, [isCohortMode, router]);

  if (!isClient || !isCohortMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
            {l === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Configuration dynamique selon le mode
  const pageConfig = isPSEMode 
    ? {
        title: { fr: 'Cohorte PSE', en: 'PSE Cohort' },
        subtitle: { fr: 'Suivi des diagnostics Pivot', en: 'Pivot Diagnostic Tracking' },
        icon: Shield,
        color: 'emerald',
        footer: { fr: 'Gestion du Plan de Sauvegarde', en: 'Restructuring Plan Management' },
        badge: { fr: 'Mode PSE actif', en: 'PSE Mode active' },
      }
    : {
        title: { fr: 'Cohorte Efficience', en: 'Efficiency Cohort' },
        subtitle: { fr: 'Suivi des diagnostics Augmentation', en: 'Augmentation Diagnostic Tracking' },
        icon: Zap,
        color: 'blue',
        footer: { fr: 'Gestion de l\'efficience opérationnelle', en: 'Operational Efficiency Management' },
        badge: { fr: 'Mode Efficience actif', en: 'Efficiency Mode active' },
      };

  const IconComponent = pageConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: isPSEMode
              ? `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`
              : `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPSEMode 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500'
              }`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif text-white">
                  {pageConfig.title[l]}
                </h1>
                <p className="text-xs text-slate-500">
                  {pageConfig.subtitle[l]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <BackToHub variant="secondary" />
              <ResetButton />
              <LanguageSwitcher />
              {session?.user && (
                <UserMenu user={session.user} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <CohortDashboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50 py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-xs text-slate-500">
          <p>APEX Cohort Manager • {pageConfig.footer[l]}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isPSEMode ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            {pageConfig.badge[l]}
          </div>
        </div>
      </footer>
    </div>
  );
}

