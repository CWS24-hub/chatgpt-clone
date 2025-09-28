'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workspace/ui';
import { getSubscriptionStatus } from '@workspace/core';

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation('chat');
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch subscription status
      fetch('/api/billing/status')
        .then(res => res.json())
        .then(data => setSubscriptionStatus(data))
        .catch(console.error);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('buttons.loading')}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('newChat')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('startNewChat')}
            </p>
          </div>

          {subscriptionStatus && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Subscription Status
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Status: {subscriptionStatus.status}
                {subscriptionStatus.daysLeft > 0 && ` (${subscriptionStatus.daysLeft} days left)`}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              title={t('newChat')}
              onPress={() => router.push('/app/chat')}
              variant="primary"
              size="large"
              style={{ width: '100%' }}
            />
            
            <Button
              title={t('chatHistory')}
              onPress={() => router.push('/app/history')}
              variant="outline"
              size="large"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
