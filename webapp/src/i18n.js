// Based on: https://github.com/i18next/react-i18next/blob/master/example/v9.x.x/test-jest/src/i18n.js
import i18n from "i18next";
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from "react-i18next";

i18n
  .use(Backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    //resources,
    //lng: "en",
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    //keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
      //formatSeparator: ","
    },

    react: {
      wait: true
    }
  });

export default i18n;
