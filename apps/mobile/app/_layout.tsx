import { Slot } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { I18nProvider } from '@workspace/i18n';

const prefix = Linking.createURL('/');

export default function RootLayout() {
  useEffect(() => {
    // Configure linking for deep links
    const subscription = Linking.addEventListener('url', async ({ url }) => {
      if (url.startsWith('myapp://billing/callback')) {
        // Handle billing callback
        console.log('Billing callback received:', url);
        // You can navigate to a success screen or refresh subscription status
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <I18nProvider>
      <Slot />
    </I18nProvider>
  );
}
