import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import te from '../i18n/te.json';
import ta from '../i18n/ta.json';
import mr from '../i18n/mr.json';

const translations = { en, hi, te, ta, mr };

export const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('agritech_lang') || 'en';
  });

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('agritech_lang', langCode);
    }
  };

  // Nested translation helper: t('dashboard.welcome')
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[currentLang] || translations.en;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let engFallback = translations.en;
        for (const k of keys) {
          if (engFallback && engFallback[k] !== undefined) {
            engFallback = engFallback[k];
          } else {
            return fallback || path;
          }
        }
        return engFallback || fallback || path;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
