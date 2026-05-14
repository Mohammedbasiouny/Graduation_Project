import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)

  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    supportedLngs: ['ar', 'en'],

    lng:
      localStorage.getItem(import.meta.env.VITE_I18N_LANGUAGE_STORAGE_KEY || "i18nextLng") ||
      document.documentElement.lang ||
      import.meta.env.VITE_DEFAULT_LANG || "ar",

    fallbackLng: import.meta.env.VITE_DEFAULT_LANG || "ar",

    showSupportNotice: false,
    
    preload: ['en', 'ar'],

    ns: [
      'common', 'buttons', 'validations', 'fields', 'header', 'footer', 'auth', 'errors', 'messages', 'sidebar',
      'application-dates', 'educational-certificates', 'manage-universities', 'manage-colleges', 'manage-departments',
      'egypt', 'governorates', 'educational-departments', 'police-stations', 'cities', 'routes', 'portal', 'application-steps',
      'medical-report-inputs', 'home', 'application-guide', 'buildings', 'rooms', 'track-application', 'manage-students-files',
      'manage-student-applications', 'account', 'permissions', 'restaurant', 'meals', 'meals-schedule', 'settings', 
      'manage-acceptance', 'manage-attendance', 'calendar', 'manage-residents', 'system-logs',
    ],

    defaultNS: 'common',

    fallbackNS: ['common'],

    debug: false,

    returnObjects: true,

    backend: {
      loadPath: import.meta.env.VITE_I18N_BACKEND_LOAD_PATH || "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false
    },
    
  });

export default i18n