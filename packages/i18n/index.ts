import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import 'dayjs/locale/ar';

// Import translation files
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enChat from './locales/en/chat.json';
import enBilling from './locales/en/billing.json';

import faCommon from './locales/fa/common.json';
import faAuth from './locales/fa/auth.json';
import faChat from './locales/fa/chat.json';
import faBilling from './locales/fa/billing.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arChat from './locales/ar/chat.json';
import arBilling from './locales/ar/billing.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    chat: enChat,
    billing: enBilling,
  },
  fa: {
    common: faCommon,
    auth: faAuth,
    chat: faChat,
    billing: faBilling,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    chat: arChat,
    billing: arBilling,
  },
};

export function getDirection(lang: string): 'rtl' | 'ltr' {
  return lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'chat', 'billing'],
    interpolation: {
      escapeValue: false,
    },
  });

// Configure dayjs for different locales
export function configureDayjs(lang: string) {
  if (lang === 'fa') {
    dayjs.locale('fa');
  } else if (lang === 'ar') {
    dayjs.locale('ar');
  } else {
    dayjs.locale('en');
  }
}

export { I18nProvider } from './I18nProvider';
export default i18n;
