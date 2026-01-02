'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Zustand persist
const AuditFlow = dynamic(
  () => import('@/components/AuditFlow').then((mod) => mod.AuditFlow),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-xl text-slate-100">APEX Next</h2>
            <p className="text-sm text-slate-500">Chargement du diagnostic...</p>
          </div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  return <AuditFlow />;
}

