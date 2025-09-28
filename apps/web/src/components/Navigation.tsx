'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navigation() {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/app')}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
            >
              {t('app.name')}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/app')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('navigation.home')}
            </button>
            <button
              onClick={() => router.push('/app/chat')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('navigation.chat')}
            </button>
            <button
              onClick={() => router.push('/app/billing')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('navigation.billing')}
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            
            {session && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
