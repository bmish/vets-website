import React from 'react';
import { useTranslation, Translation } from 'react-i18next';
import { fixNamespacePrefix } from './fixNamespacePrefix';

function useLegacyTranslation(prop) {
  const { t, i18n } = useTranslation();

  if (typeof prop === 'string') return prop;

  if (i18n.exists(prop?.key)) {
    return t(prop.key);
  }

  if (prop?.fallback) {
    return prop.fallback;
  }

  return null;
}

export function translateSingleString(prop) {
  // console.log({ translateSingleStringProp: prop });

  if (typeof prop === 'string') return prop;

  if (prop?.key) {
    return (
      <Translation>
        {(t, { i18n }) => {
          if (i18n.exists(prop.key)) return t(prop.key);
          return prop?.fallback || '';
        }}
      </Translation>
    );
  }

  if (prop?.fallback) {
    return prop.fallback;
  }

  return null;
}

export { fixNamespacePrefix };

export default useLegacyTranslation;
