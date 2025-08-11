import { PropsWithChildren } from 'react';

import { Toaster } from 'sonner';

import { StoreProvider } from '@/store';
import { TRPCReactProvider } from '@/trpc';

import { ThemeProvider } from './theme-provider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <TRPCReactProvider>
        <StoreProvider>{children}</StoreProvider>
      </TRPCReactProvider>
      <Toaster position="top-center" richColors duration={2000} />
    </ThemeProvider>
  );
}
