import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';
import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';

import { loginAppUrlRE } from 'applications/login/utilities/paths';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
};

export const externalRedirects = {
  myvahealth: environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov/'
    : 'https://staging-patientportal.myhealth.va.gov/',
  mhv: environment.isProduction()
    ? 'https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/'
    : 'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/',
};

export const ssoKeepAliveEndpoint = () => {
  const envPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
  return `https://${envPrefix}eauth.va.gov/keepalive`;
};

export function sessionTypeUrl({ type = '', queryParams = {} }) {
  // force v1 regardless of version
  const base = `${environment.API_URL}/v1/sessions`;
  const searchParams = new URLSearchParams(queryParams);

  const queryString =
    searchParams.toString() === '' ? '' : `?${searchParams.toString()}`;

  return `${base}/${type}/new${queryString}`;
}

export function setSentryLoginType(loginType) {
  Sentry.setTag('loginType', loginType);
}

export function clearSentryLoginType() {
  Sentry.setTag('loginType', undefined);
}

function redirectWithGAClientId(redirectUrl) {
  try {
    // eslint-disable-next-line no-undef
    const trackers = ga.getAll();

    // Tracking IDs for Staging and Prod
    const vagovTrackingIds = ['UA-50123418-16', 'UA-50123418-17'];

    const tracker = trackers.find(t => {
      const trackingId = t.get('trackingId');
      return vagovTrackingIds.includes(trackingId);
    });

    const clientId = tracker && tracker.get('clientId');

    window.location = clientId
      ? // eslint-disable-next-line camelcase
        appendQuery(redirectUrl, { client_id: clientId })
      : redirectUrl;
  } catch (e) {
    window.location = redirectUrl;
  }
}

export function standaloneRedirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const application = searchParams.get('application');
  const to = searchParams.get('to');
  let url = externalRedirects[application] || null;

  if (url && to) {
    const pathname = to.startsWith('/') ? to : `/${to}`;
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url = `${url}${pathname}`.replace('\r\n', ''); // Prevent CRLF injection.
  }
  return url;
}

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl = loginAppUrlRE.test(window.location.pathname)
    ? standaloneRedirect() || window.location.origin
    : window.location;
  sessionStorage.setItem(authnSettings.RETURN_URL, returnUrl);
  recordEvent({ event: clickedEvent });

  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(redirectUrl);
  } else {
    window.location = redirectUrl;
  }
}

export function login(
  policy,
  queryParams = {},
  clickedEvent = 'login-link-clicked-modal',
) {
  const url = sessionTypeUrl({ type: policy, queryParams });
  setLoginAttempted();
  return redirect(url, clickedEvent);
}

export function mfa() {
  return redirect(sessionTypeUrl({ type: 'mfa' }), 'multifactor-link-clicked');
}

export function verify() {
  return redirect(sessionTypeUrl({ type: 'verify' }), 'verify-link-clicked');
}

export function logout(clickedEvent = 'logout-link-clicked', queryParams = {}) {
  clearSentryLoginType();
  return redirect(sessionTypeUrl({ type: 'slo', queryParams }), clickedEvent);
}

export function signup() {
  return redirect(sessionTypeUrl({ type: 'signup' }), 'register-link-clicked');
}
