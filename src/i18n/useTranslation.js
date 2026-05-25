import { useLanguage } from './LanguageContext';

export const useTranslation = () => {
  const { t, language, setLanguage, languages } = useLanguage();
  return { t, language, setLanguage, languages };
};
