import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import {
  selectPatientFacilities,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(
    f => f.isCerner && f.usesCernerAppointments,
  );

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(
    f => f.isCerner && f.usesCernerAppointments,
  );
export const selectRegisteredCernerFacilityIds = state =>
  selectPatientFacilities(state)
    ?.filter(f => f.isCerner && f.usesCernerAppointments)
    .map(f => f.facilityId) || [];

export const selectIsRegisteredToSacramentoVA = state =>
  selectPatientFacilities(state)?.some(f => f.facilityId === '612');

export const selectFeatureApplication = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineScheduling);
export const selectFeatureCancel = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingCancel);
export const selectFeatureRequests = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingRequests);
export const selectFeatureCommunityCare = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingCommunityCare);
export const selectFeatureDirectScheduling = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingDirect);
export const selectFeatureExpressCareNewRequest = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingExpressCareNew);
// export const selectFeatureToggleLoading = state => toggleValues(state).loading;
export const selectFeatureToggleLoading = state => false;
// Use flat facility page for non Cerner patients
export const selectUseFlatFacilityPage = state => !selectIsCernerPatient(state);

const selectFeatureProviderSelection = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingProviderSelection);
export const selectUseProviderSelection = state =>
  selectFeatureProviderSelection(state) &&
  !!selectVAPResidentialAddress(state)?.addressLine1;

export const selectIsWelcomeModalDismissed = state =>
  state.announcements.dismissed.some(
    announcement => announcement === 'welcome-to-new-vaos',
  );

export const selectSystemIds = state =>
  selectPatientFacilities(state)?.map(f => f.facilityId) || null;

export const selectFeatureHomepageRefresh = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingHomepageRefresh);

export const selectFeatureFacilitySelectionV22 = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineFacilitySelectionV22);

export const selectFeatureUnenrolledVaccine = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingUnenrolledVaccine);

export const selectFeatureVAOSServiceRequests = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingVAOSServiceRequests);

export const selectFeatureVAOSServiceVAAppointments = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingVAOSServiceVAAppointments);

export const selectFeatureVAOSServiceCCAppointments = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingVAOSServiceCCAppointments);

export const selectFeatureVariantTesting = state =>
  toggleValues(FEATURE_FLAG_NAMES.vaOnlineSchedulingVariantTesting);
