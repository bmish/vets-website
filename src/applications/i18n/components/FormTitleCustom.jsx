import React from 'react';
import { Translation } from 'react-i18next';

const FormTitleCustom = ({ formConfig: { namespace } }) => {
  return (
    <Translation ns={namespace}>
      {t => {
        return <>{t('title')}</>;
      }}
    </Translation>
  );
};

export default FormTitleCustom;
