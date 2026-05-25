/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'animadiv-language';
const DEFAULT_LANGUAGE = 'ua';
const SUPPORTED_LANGUAGES = ['en', 'ua'];

const LanguageContext = createContext(null);

const getNestedValue = (source, key) =>
  String(key)
    .split('.')
    .reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), source);

const interpolate = (value, params = {}) =>
  typeof value === 'string'
    ? value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        params[name] === undefined || params[name] === null ? '' : String(params[name])
      )
    : value;

const normalizeLanguage = (value) =>
  SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'ua' ? 'uk' : 'en';
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(normalizeLanguage(nextLanguage));
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      const currentValue = getNestedValue(translations[language], key);
      const fallbackValue = getNestedValue(translations[DEFAULT_LANGUAGE], key);
      const value = currentValue ?? fallbackValue ?? params.defaultValue ?? key;
      return interpolate(value, params);
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
