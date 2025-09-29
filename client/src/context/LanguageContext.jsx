import React, { createContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import i18n from '../utils/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { t } = useTranslation();

    const lng = cookies.get('i18next') || 'en';

    // إعداد اتجاه النص عند بدء التطبيق
    window.document.dir = i18n.dir(lng);

    useEffect(() => {
        window.document.dir = i18n.dir(); // تحديث اتجاه النص عند تغيير اللغة
    }, [i18n.language]);

    return (
        <LanguageContext.Provider value={{ t, lng }}>
            {children}
        </LanguageContext.Provider>
    );
};
