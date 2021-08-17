import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { setOnThisPageText } from './utilities/helpers';
import { connect } from 'react-redux';

const I18Select = ({ languageList, languageCode, currentUrl }) => {
  useEffect(
    () => {
      setOnThisPageText(languageCode);
    },
    [languageCode],
  );

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {languageList.map((languageConfig, i) => {
          return (
            <span key={i}>
              <a
                className={`vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 ${
                  languageConfig.url === currentUrl
                    ? 'vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none'
                    : ''
                }`}
                onClick={_ => {
                  recordEvent({
                    event: 'nav-pipe-delimited-list-click',
                    'pipe-delimited-list-header': languageConfig.code,
                  });
                }}
                href={languageConfig.url}
                hrefLang={languageConfig.code}
                lang={languageConfig.code}
              >
                {languageConfig.label}{' '}
              </a>
              {i !== languageList.length - 1 && (
                <span
                  className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                    vads-u-height--20"
                >
                  |
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
};

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
});

export default connect(mapStateToProps)(I18Select);
