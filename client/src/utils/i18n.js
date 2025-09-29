import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';


i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        lng: "en",
        fallbackLng: "en",
        detection:{
            order: ['cookie','htmlTag','localStorage', 'sessionStorage', 'navigator','path', 'subdomain'],
            caches: ['cookie'],    // cache user language on cookies = بتثبت الموقع على اخر لغة اليوزر اختارها
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        interpolation: {
        escapeValue: false,
        },
        
    });

export default i18n;


// we will use {t} from useTranslation() to translate text in any page