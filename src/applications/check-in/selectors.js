import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const checkInExperienceEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.checkInExperienceEnabled];

export const checkInExperienceLowRiskAuthenicationEnabled = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.checkInExperienceLowRiskAuthenicationEnabled
  ];

export const checkInExperienceMultipleAppointmentEnabled = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.checkInExperienceMultipleAppointmentEnabled
  ];

export const loadingFeatureFlags = state => state?.featureToggles?.loading;
