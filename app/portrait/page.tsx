'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { useAuditStore } from '@/lib/store';
import PortraitMutation from '@/components/PortraitMutation';

function PortraitPageContent() {
  const router = useRouter();
  const { context, tasks, getSelectedTalents, generateStrategy } = useAuditStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Vérifier que le diagnostic est complété
    const selectedTalents = getSelectedTalents();
    const hasDiagnostic = tasks.length > 0 && selectedTalents.length === 5 && context.persona && context.goal;
    
    if (!hasDiagnostic) {
      router.push('/audit');
    }
  }, [isClient, tasks, context, getSelectedTalents, router]);

  const handleComplete = () => {
    // Régénérer la stratégie avec les nouvelles données
    generateStrategy();
    // Retourner au Hub
    router.push('/hub');
  };

  const handleBack = () => {
    router.push('/hub');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Chargement...</p>
      </div>
    );
  }

  return (
    <PortraitMutation 
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

export default function PortraitPage() {
  return (
    <SessionProvider>
      <PortraitPageContent />
    </SessionProvider>
  );
}

