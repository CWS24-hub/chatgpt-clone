'use client';

import { useEffect } from 'react';
import i18n from './index';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return <>{children}</>;
}
