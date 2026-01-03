'use client';

import { StrategyHub } from '@/components/StrategyHub';
import { SessionProvider } from 'next-auth/react';

export default function HubPage() {
  return (
    <SessionProvider>
      <StrategyHub />
    </SessionProvider>
  );
}

