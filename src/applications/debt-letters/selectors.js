import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectShowDebtLetters = state =>
  toggleValues(FEATURE_FLAG_NAMES.debtLettersShowLetters);
