import { createContext, useState } from "react";
import moment from "moment-timezone";
import 'moment/locale/de';


// Translations
import { translationEN } from "../../assets/translations/translationEN";
import { translationDE } from "../../assets/translations/translationDE";

export const LangContext = createContext();

export const LANGS = {
  EN: "en",
  DE: "de",
};

export const LangProvider = (props) => {
  const [Lang, updateLang] = useState(LANGS.DE);
  const [Translations, updateTranslations] = useState(translationDE);

  const changeLang = (lang) => {
    moment.locale(lang);
    updateLang(lang);

    switch (lang) {
      case LANGS.DE:
        updateTranslations(translationDE);
        break;
      default:
        updateTranslations(translationEN);
        break;
    }
  };

  const t = (key) => {
    let schema = Translations;
    const keyList = key.split(".");

    const length = keyList.length;

    for (let i = 0; i < length; i++) {
      schema = schema[keyList[i]];
    }

    return schema;
  };




  return (
    <LangContext.Provider value={{ Lang, changeLang, t }}>
      {props.children}
    </LangContext.Provider>
  );
};
