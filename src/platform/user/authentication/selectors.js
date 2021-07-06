import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { selectProfile } from 'platform/user/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const ssoe = state => state.ssoe || toggleValues(FEATURE_FLAG_NAMES.ssoe);

export const ssoeInbound = state =>
  toggleValues(FEATURE_FLAG_NAMES.ssoeInbound);

export const ssoeEbenefitsLinks = state =>
  value = toggleValues(FEATURE_FLAG_NAMES.ssoeEbenefitsLinks);
  return state.store(value) || {}


export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;
