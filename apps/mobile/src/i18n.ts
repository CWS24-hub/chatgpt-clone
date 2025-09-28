import i18n from '@workspace/i18n';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

export async function applyLocale(lang: 'en' | 'fa' | 'ar') {
  const dir = lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';
  const shouldRTL = dir === 'rtl';
  
  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(shouldRTL);
    
    // Reload the app to apply RTL changes
    if (Updates.isEnabled) {
      await Updates.reloadAsync();
    }
  }
  
  // Change the language
  await i18n.changeLanguage(lang);
}

export default i18n;
