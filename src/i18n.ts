import { createI18n } from 'vue-i18n'
import zhHant from './locales/zh-Hant.json'
import zhHans from './locales/zh-Hans.json'
import ja from './locales/ja.json'
import th from './locales/th.json'
import en from './locales/en.json'
import de from './locales/de.json'

type MessageSchema = typeof zhHant

function detectLocale(): string {
  const lang = navigator.language
  if (lang.startsWith('zh-TW') || lang.startsWith('zh-HK') || lang === 'zh-Hant') return 'zh-Hant'
  if (lang.startsWith('zh')) return 'zh-Hans'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('th')) return 'th'
  if (lang.startsWith('de')) return 'de'
  return 'en'
}

export const i18n = createI18n<[MessageSchema], 'zh-Hant' | 'zh-Hans' | 'ja' | 'th' | 'en' | 'de'>({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh-Hant',
  messages: {
    'zh-Hant': zhHant,
    'zh-Hans': zhHans,
    ja,
    th,
    en,
    de
  },
})
