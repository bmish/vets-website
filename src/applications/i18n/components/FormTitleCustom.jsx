import React from 'react';
import { Translation } from 'react-i18next';

const FormTitleCustom = () => {
  return (
    <Translation>
      {t => {
        return <>{t('i18n:title')}</>;
      }}
    </Translation>
  );
};

export default FormTitleCustom;
