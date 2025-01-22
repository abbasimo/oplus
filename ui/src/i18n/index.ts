import { initReactI18next } from 'react-i18next';
import { SecureLocalStorage } from '@remate/core';
import i18n from 'i18next';

import en from './resources/en';
import fa from './resources/fa';

/**
 * resources is an object that contains all the translations for the different languages.
 */
const resources = {
	en: {
		translation: en
	},
	fa: {
		translation: fa
	}
};

/**
 * i18n is initialized with the resources object and the language to use.
 * The keySeparator option is set to false because we do not use keys in form messages.welcome.
 * The interpolation option is set to false because we do not use interpolation in form messages.welcome.
 */
i18n.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: SecureLocalStorage.getItem<string | null>('app_lang') ?? 'fa',

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;
