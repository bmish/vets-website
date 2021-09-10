/**
 * Module for localization and translation
 * @module platform/localization
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nextPlugin } from 'translation-check';

import en from './glossary/en.json';
import es from './glossary/es.json';
import tl from './glossary/tl.json';

const resources = {
  en: {
    glossary: en,
  },
  es: {
    glossary: es,
  },
  tl: {
    glossary: tl,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(i18nextPlugin)
  .init({
    resources,
    defaultNS: 'glossary',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
