'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Dynamic import to avoid SSR issues with Zustand persist
const AuditFlow = dynamic(
  () => import('@/components/AuditFlow').then((mod) => mod.AuditFlow),
  { 
    ssr: false,
    loading: () => <AuditLoading />
  }
);

function AuditLoading() {
  const t = useTranslations('common');
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto animate-pulse">
          <Compass className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-xl text-slate-100">{t('appName')}</h2>
          <p className="text-sm text-slate-500">{t('loading')}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/audit');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <AuditLoading />;
  }

  return <AuditFlow />;
}

