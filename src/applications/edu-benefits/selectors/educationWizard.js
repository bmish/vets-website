// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const showEduBenefits1990EWizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits1990EWizard);

export const showEduBenefits1995Wizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits1995Wizard);

export const showEduBenefits1990Wizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits1990Wizard);

export const showEduBenefits0994Wizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits0994Wizard);

export const showEduBenefits5490Wizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits5490Wizard);

export const showEduBenefits1990NWizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits1990NWizard);

export const showEduBenefits5495Wizard = state =>
  toggleValues(FEATURE_FLAG_NAMES.showEduBenefits5495Wizard);
