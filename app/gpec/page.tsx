'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { EnterpriseTarget } from '@/components/EnterpriseTarget';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { ResetButton } from '@/components/ui/ResetButton';

export default function GPECPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';

  const { context } = useAuditStore();
  const [isClient, setIsClient] = useState(false);

  // Job Designer accessible en mode Reclassement OU (Leader + Pivot)
  const isJobDesignerAllowed = context.goal === 'reclassement' || 
    (context.goal === 'pivot' && context.persona === 'leader');

  useEffect(() => {
    setIsClient(true);
    // Vérifier que l'utilisateur a accès au Job Designer
    if (!isJobDesignerAllowed) {
      router.push('/hub');
    }
  }, [isJobDesignerAllowed, router]);

  if (!isClient || !isJobDesignerAllowed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
            {l === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif text-white">
                  {l === 'fr' ? 'Job Designer' : 'Job Designer'}
                </h1>
                <p className="text-xs text-slate-500">
                  {l === 'fr' ? 'Architecture des Postes de Demain' : 'Tomorrow\'s Position Architecture'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
          <EnterpriseTarget />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50 py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-xs text-slate-500">
          <p>APEX Job Designer • {l === 'fr' ? 'Concevez les postes résilients de demain' : 'Design tomorrow\'s resilient positions'}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            {l === 'fr' ? 'Mode Job Designer actif' : 'Job Designer Mode active'}
          </div>
        </div>
      </footer>
    </div>
  );
}

