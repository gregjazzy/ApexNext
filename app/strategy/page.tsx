'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Dynamic import to avoid SSR issues with Zustand persist
const StrategyFlow = dynamic(
  () => import('@/components/StrategyFlow').then((mod) => mod.StrategyFlow),
  { 
    ssr: false,
    loading: () => <StrategyLoading />
  }
);

function StrategyLoading() {
  const t = useTranslations('common');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto animate-pulse">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-xl text-slate-100">APEX Strategy</h2>
          <p className="text-sm text-slate-500">{t('loading')}</p>
        </div>
      </div>
    </div>
  );
}

export default function StrategyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/strategy');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <StrategyLoading />;
  }

  return <StrategyFlow />;
}

