'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workspace/ui';

export default function BillingLockedPage() {
  const { t } = useTranslation('billing');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: 'basic-monthly' }),
      });
      
      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('locked.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('locked.subtitle')}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              {t('locked.daysLeft', { count: 0 })}
            </p>
          </div>
          
          <Button
            title={isLoading ? t('buttons.loading') : t('locked.renewNow')}
            onPress={handleSubscribe}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('locked.contactSupport')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
