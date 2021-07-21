import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import recordEvent from '~/platform/monitoring/record-event';

const IdentityNotVerified = ({
  alertHeadline,
  alertContent = (
    <p>
      We need to make sure you’re you — and not someone pretending to be you —
      before we give you access to your personal and health-related information.
      This helps to keep your information safe and prevent fraud and identity
      theft.
    </p>
  ),
  additionalInfoClickHandler = null,
  level = 3,
}) => {
  const content = (
    <>
      {alertContent}
      <p>
        <strong>This one-time process takes about 5-10 minutes.</strong>
      </p>
      <a
        className="login-gov"
        href="https://localhost:3000/v1/sessions/login_ial2/new"
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
      >
        <img
          aria-hidden="true"
          role="presentation"
          alt="Login.gov"
          src="/img/signin/login-gov-logo-rev.svg"
        />
        <strong> Verify your identity</strong>
      </a>
      <a
        className="usa-button-primary va-button-primary"
        href="/verify"
        onClick={() => recordEvent({ event: 'verify-link-clicked' })}
      >
        <img
          aria-hidden="true"
          role="presentation"
          style={{ height: '1em' }}
          alt="ID.me"
          src="/img/signin/idme-icon-white.svg"
        />
        <strong> Verify your identity</strong>
      </a>
    </>
  );

  return (
    <>
      <AlertBox
        headline={alertHeadline}
        content={content}
        status="warning"
        level={level}
      />
      <div
        className="account-security-content vads-u-margin--2p5"
        onClick={additionalInfoClickHandler}
      >
        <AdditionalInfo triggerText="How will VA.gov verify my identity?">
          <p>
            We use ID.me, our Veteran-owned technology partner that provides the
            strongest identity verification system available to prevent fraud
            and identity theft.
          </p>
          <span>
            <strong>To verify your identity, you’ll need both of these:</strong>
            <ul>
              <li>
                A smartphone (or a landline or mobile phone and a computer with
                an Internet connection),
                <br />
                <strong>and</strong>
              </li>
              <li>Your Social Security number</li>
            </ul>
          </span>
          <span>
            <strong>You’ll also need one of these:</strong>
            <ul>
              <li>
                A digital image of your driver’s license or passport, <br />
                <strong>or</strong>
              </li>
              <li>
                The ability to answer certain questions based on private and
                public data (like your credit report or mortgage history) to
                prove you’re you
              </li>
            </ul>
          </span>
        </AdditionalInfo>
      </div>
    </>
  );
};

export default IdentityNotVerified;
