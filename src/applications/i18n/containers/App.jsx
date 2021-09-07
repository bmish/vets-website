import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { removeInProgressForm } from 'platform/forms/save-in-progress/actions';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import '../languages';

const languageOptions = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' },
  tl: { nativeName: 'Tagalog' },
};

const App = props => {
  const { i18n } = useTranslation();

  const { location, children } = props;

  const handleLanguageChange = languageCode => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div>
      <div className="row vads-u-margin-y--2">
        <div className="usa-width-two-thirds medium-8 columns text-right">
          <div>
            {Object.keys(languageOptions).map((lng, i, items) => (
              <span key={lng}>
                <button
                  style={{
                    fontWeight: i18n.language === lng ? 'bold' : 'normal',
                  }}
                  onClick={() => handleLanguageChange(lng)}
                  className="va-button-link"
                >
                  {languageOptions[lng].nativeName}
                </button>
                {i !== items.length - 1 && (
                  <span
                    className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                    vads-u-height--20"
                  >
                    |
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    formId: state.form.formId,
    returnUrl: state.form.loadedData.metadata.returnUrl,
    lastSavedDate: state.form.lastSavedDate,
    expirationDate: state.form.expirationDate,
    migrations: state.form.migrations,
    prefillTransformer: state.form.prefillTransformer,
    user: state.user,
  };
}

const mapDispatchToProps = {
  removeInProgressForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);

export { App };
