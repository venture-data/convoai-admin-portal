'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({ children }) => {
  return (
    <SessionProvider
      refetchOnWindowFocus={true}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
