'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@workspace/ui';
import { useTranslation } from 'react-i18next';

export default function SignInPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/app');
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/app' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('signin.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('signin.subtitle')}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button
            title={isLoading ? t('buttons.loading') : t('signin.signinWithGoogle')}
            onPress={handleGoogleSignIn}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#4285f4',
              paddingVertical: 12,
            }}
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('signin.noAccount')}{' '}
              <button
                className="font-medium text-primary hover:text-primary/80"
                onClick={() => router.push('/auth/signup')}
              >
                {t('signin.signup')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
