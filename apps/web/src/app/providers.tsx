'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@workspace/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <I18nProvider>
          {children}
        </I18nProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
