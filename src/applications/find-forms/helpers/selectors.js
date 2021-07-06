// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const getFindFormsAppState = state => state.findVAFormsReducer;
export const applySearchUIUXEnhancements = state =>
  state.findFormsEnhancements || toggleValues(FEATURE_FLAG_NAMES.findFormsEnhancements);
export const applyLighthouseFormsSearchLogic = state =>
  toggleValues(FEATURE_FLAG_NAMES.useLighthouseFormsSearchLogic);
