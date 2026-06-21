import { Injectable, signal, computed, effect } from '@angular/core';
import enTranslations from '../i18n/en.json';
import arTranslations from '../i18n/ar.json';

export type Lang = 'en' | 'ar';

const translations: Record<Lang, Record<string, string>> = {
  en: enTranslations,
  ar: arTranslations
};

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  readonly currentLang = signal<Lang>('en');
  readonly isRtl = computed(() => this.currentLang() === 'ar');
  readonly dir = computed(() => this.isRtl() ? 'rtl' : 'ltr');

  constructor() {
    // Apply dir attribute to <html> element reactively
    effect(() => {
      const lang = this.currentLang();
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', this.isRtl() ? 'rtl' : 'ltr');
    });
  }

  t(key: string): string {
    const lang = this.currentLang();
    const entry = translations[lang] as Record<string, string>;
    if (!entry || !entry[key]) {
      // Fallback to English if key doesn't exist in current language
      return translations['en'][key] ?? key;
    }
    return entry[key];
  }

  toggleLang() {
    this.currentLang.update(l => l === 'en' ? 'ar' : 'en');
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
  }
}
