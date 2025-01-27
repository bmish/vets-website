// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const getFindFormsAppState = state => state.findVAFormsReducer;
export const showPDFModal = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagOne];
export const applyFeatureFlagTwo = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagTwo];
export const applyFeatureFlagThree = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagThree];
