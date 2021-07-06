import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const facilitiesPpmsSuppressPharmacies = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilitiesPpmsSuppressPharmacies);

export const facilitiesPpmsSuppressCommunityCare = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilitiesPpmsSuppressCommunityCare);

export const facilityLocatorPredictiveLocationSearch = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilityLocatorPredictiveLocationSearch);

export const facilityLocatorLighthouseCovidVaccineQuery = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilityLocatorLighthouseCovidVaccineQuery);

export const facilityLocatorShowOperationalHoursSpecialInstructions = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilityLocatorShowOperationalHoursSpecialInstructions);

export const covidVaccineSchedulingFrontend = state =>
  toggleValues(FEATURE_FLAG_NAMES.covidVaccineSchedulingFrontend);

export const facilityLocatorRailsEngine = state =>
  toggleValues(FEATURE_FLAG_NAMES.facilityLocatorRailsEngine);
