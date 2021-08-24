import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { useTranslation } from 'react-i18next';
import '../languages';

export default function App({ location, children }) {
  const { i18n } = useTranslation();
  return (
    <div>
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns text-right">
          <p className="text-right">Change language</p>
          <div>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="va-button-link"
            >
              english
            </button>
            {' | '}
            <button
              onClick={() => i18n.changeLanguage('es')}
              className="va-button-link"
            >
              espanol
            </button>
            {' | '}
            <button
              onClick={() => i18n.changeLanguage('tl')}
              className="va-button-link"
            >
              tagalog
            </button>
          </div>
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}
