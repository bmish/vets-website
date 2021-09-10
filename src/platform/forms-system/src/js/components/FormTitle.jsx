import React from 'react';
import useTranslate from '../utilities/localization';

export default function FormTitle({ title, subTitle }) {
  const subTitleElement = (
    <div className="schemaform-subtitle">{useTranslate(subTitle)}</div>
  );

  return (
    <div className="schemaform-title">
      <h1>{useTranslate(title)}</h1>
      {subTitle && subTitleElement}
    </div>
  );
}
