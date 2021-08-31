import moment from 'moment';
import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';

import { selectVAPResidentialAddress } from 'platform/user/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import {
  selectFeatureDirectScheduling,
  selectFeatureCommunityCare,
  selectSystemIds,
  selectFeatureHomepageRefresh,
  selectFeatureVAOSServiceRequests,
  selectFeatureVariantTesting,
  selectRegisteredCernerFacilityIds,
  selectFeatureFacilitiesServiceV2,
  selectFeatureVAOSServiceVAAppointments,
  selectFeatureCCIterations,
} from '../../redux/selectors';
import {
  getTypeOfCare,
  getNewAppointment,
  getFormData,
  getTypeOfCareFacilities,
  getCCEType,
} from './selectors';
import {
  getPreferences,
  updatePreferences,
  submitRequest,
  submitAppointment,
  sendRequestMessage,
  getCommunityCare,
} from '../../services/var';
import { createAppointment } from '../../services/appointment';
import {
  getLocation,
  getSiteIdFromFacilityId,
  getLocationsByTypeOfCareAndSiteIds,
  getCommunityProvidersByTypeOfCare,
  fetchParentLocations,
  fetchCommunityCareSupportedSites,
  isCernerLocation,
  isTypeOfCareSupported,
} from '../../services/location';
import { getSlots } from '../../services/slot';
import { getPreciseLocation } from '../../utils/address';
import {
  FACILITY_SORT_METHODS,
  FACILITY_TYPES,
  FLOW_TYPES,
  GA_PREFIX,
} from '../../utils/constants';
import { createPreferenceBody } from '../../utils/data';
import {
  transformFormToVARequest,
  transformFormToCCRequest,
  transformFormToAppointment,
} from './helpers/formSubmitTransformers';
import {
  transformFormToVAOSAppointment,
  transformFormToVAOSCCRequest,
  transformFormToVAOSVARequest,
} from './helpers/formSubmitTransformers.v2';
import {
  resetDataLayer,
  recordItemsRetrieved,
  recordEligibilityFailure,
} from '../../utils/events';
import {
  captureError,
  getErrorCodes,
  has400LevelError,
} from '../../utils/error';
import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';
import { fetchFlowEligibilityAndClinics } from '../../services/patient';

export const GA_FLOWS = {
  DIRECT: 'direct',
  VA_REQUEST: 'va-request',
  CC_REQUEST: 'cc-request',
};

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_RESET = 'newAppointment/FORM_RESET';
export const FORM_PAGE_CHANGE_STARTED =
  'newAppointment/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'newAppointment/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_UPDATE_FACILITY_TYPE =
  'newAppointment/FORM_UPDATE_FACILITY_TYPE';
export const FORM_PAGE_FACILITY_V2_OPEN =
  'newAppointment/FACILITY_PAGE_V2_OPEN';
export const FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_V2_OPEN_SUCCEEDED';
export const FORM_PAGE_FACILITY_V2_OPEN_FAILED =
  'newAppointment/FACILITY_PAGE_V2_OPEN_FAILED';
export const FORM_PAGE_FACILITY_SORT_METHOD_UPDATED =
  'newAppointment/FORM_PAGE_FACILITY_SORT_METHOD_UPDATED';
export const FORM_FETCH_FACILITY_DETAILS =
  'newAppointment/FORM_FETCH_FACILITY_DETAILS';
export const FORM_FETCH_FACILITY_DETAILS_SUCCEEDED =
  'newAppointment/FORM_FETCH_FACILITY_DETAILS_SUCCEEDED';
export const FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS =
  'newAppointment/FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS';
export const FORM_ELIGIBILITY_CHECKS = 'newAppointment/FORM_ELIGIBILITY_CHECKS';
export const FORM_ELIGIBILITY_CHECKS_SUCCEEDED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_SUCCEEDED';
export const FORM_ELIGIBILITY_CHECKS_FAILED =
  'newAppointment/FORM_ELIGIBILITY_CHECKS_FAILED';
export const FORM_CLINIC_PAGE_OPENED_SUCCEEDED =
  'newAppointment/FORM_CLINIC_PAGE_OPENED_SUCCEEDED';
export const START_DIRECT_SCHEDULE_FLOW =
  'newAppointment/START_DIRECT_SCHEDULE_FLOW';
export const START_REQUEST_APPOINTMENT_FLOW =
  'newAppointment/START_REQUEST_APPOINTMENT_FLOW';
export const FORM_CALENDAR_FETCH_SLOTS =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS';
export const FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED';
export const FORM_CALENDAR_FETCH_SLOTS_FAILED =
  'newAppointment/FORM_CALENDAR_FETCH_SLOTS_FAILED';
export const FORM_CALENDAR_DATA_CHANGED =
  'newAppointment/FORM_CALENDAR_DATA_CHANGED';
export const FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL =
  'newAppointment/FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL';
export const FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL =
  'newAppointment/FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL';
export const FORM_SHOW_ELIGIBILITY_MODAL =
  'newAppointment/FORM_SHOW_ELIGIBILITY_MODAL';
export const FORM_HIDE_ELIGIBILITY_MODAL =
  'newAppointment/FORM_HIDE_ELIGIBILITY_MODAL';
export const FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED';
export const FORM_REASON_FOR_APPOINTMENT_CHANGED =
  'newAppointment/FORM_REASON_FOR_APPOINTMENT_CHANGED';
export const FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED';
export const FORM_PAGE_COMMUNITY_CARE_PROVIDER_SELECTION_OPENED =
  'newAppointment/FORM_PAGE_COMMUNITY_CARE_PROVIDER_SELECTION_OPENED';
export const FORM_REQUEST_CURRENT_LOCATION =
  'newAppointment/FORM_REQUEST_CURRENT_LOCATION';
export const FORM_REQUEST_CURRENT_LOCATION_FAILED =
  'newAppointment/FORM_REQUEST_CURRENT_LOCATION_FAILED';
export const FORM_SUBMIT = 'newAppointment/FORM_SUBMIT';
export const FORM_SUBMIT_FAILED = 'newAppointment/FORM_SUBMIT_FAILED';
export const FORM_UPDATE_CC_ELIGIBILITY =
  'newAppointment/FORM_UPDATE_CC_ELIGIBILITY';
export const CLICKED_UPDATE_ADDRESS_BUTTON =
  'newAppointment/CLICKED_UPDATE_ADDRESS_BUTTON';
export const FORM_REQUESTED_PROVIDERS =
  'newAppointment/FORM_REQUESTED_PROVIDERS';
export const FORM_REQUESTED_PROVIDERS_SUCCEEDED =
  'newAppointment/FORM_REQUESTED_PROVIDERS_SUCCEEDED';
export const FORM_REQUESTED_PROVIDERS_FAILED =
  'newAppointment/FORM_REQUESTED_PROVIDERS_FAILED';
export const FORM_PAGE_CC_FACILITY_SORT_METHOD_UPDATED =
  'newAppointment/FORM_PAGE_CC_FACILITY_SORT_METHOD_UPDATED';

export function openFormPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
  };
}

export function clickUpdateAddressButton() {
  return {
    type: CLICKED_UPDATE_ADDRESS_BUTTON,
  };
}

export function updateFormData(page, uiSchema, data) {
  return {
    type: FORM_DATA_UPDATED,
    page,
    uiSchema,
    data,
  };
}

export function showPodiatryAppointmentUnavailableModal() {
  return {
    type: FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  };
}

export function hidePodiatryAppointmentUnavailableModal() {
  return {
    type: FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  };
}

export function updateFacilityType(facilityType) {
  return {
    type: FORM_UPDATE_FACILITY_TYPE,
    facilityType,
  };
}

export function startDirectScheduleFlow() {
  recordEvent({ event: 'vaos-direct-path-started' });

  return {
    type: START_DIRECT_SCHEDULE_FLOW,
  };
}

export function startRequestAppointmentFlow(isCommunityCare) {
  recordEvent({
    event: `vaos-${
      isCommunityCare ? 'community-care' : 'request'
    }-path-started`,
  });

  return {
    type: START_REQUEST_APPOINTMENT_FLOW,
  };
}

export function fetchFacilityDetails(facilityId) {
  let facilityDetails;

  return async (dispatch, getState) => {
    dispatch({
      type: FORM_FETCH_FACILITY_DETAILS,
    });
    const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
      getState(),
    );

    try {
      facilityDetails = await getLocation({
        facilityId,
        useV2: featureFacilitiesServiceV2,
      });
    } catch (error) {
      facilityDetails = null;
      captureError(error);
    }

    dispatch({
      type: FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
      facilityDetails,
      facilityId,
    });
  };
}

export function checkEligibility({ location, showModal }) {
  return async (dispatch, getState) => {
    const state = getState();
    const directSchedulingEnabled = selectFeatureDirectScheduling(state);
    const typeOfCare = getTypeOfCare(getState().newAppointment.data);
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      state,
    );

    dispatch({
      type: FORM_ELIGIBILITY_CHECKS,
    });

    try {
      const loadingStartTime = Date.now();

      const {
        eligibility,
        clinics,
        pastAppointments,
      } = await fetchFlowEligibilityAndClinics({
        location,
        typeOfCare,
        directSchedulingEnabled,
        useV2: featureVAOSServiceVAAppointments,
      });

      if (showModal) {
        recordEvent({
          event: 'loading-indicator-displayed',
          'loading-indicator-display-time': Date.now() - loadingStartTime,
        });
      }

      dispatch({
        type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
        typeOfCare,
        location,
        eligibility,
        pastAppointments,
        clinics,
        facilityId: location.id,
        showModal,
      });

      return eligibility;
    } catch (e) {
      captureError(e, false, 'facility page');
      dispatch({
        type: FORM_ELIGIBILITY_CHECKS_FAILED,
      });
    }
    return null;
  };
}

export function openFacilityPageV2(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    try {
      const initialState = getState();
      const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
        initialState,
      );
      const newAppointment = initialState.newAppointment;
      const typeOfCare = getTypeOfCare(newAppointment.data);
      const typeOfCareId = typeOfCare?.id;
      if (typeOfCareId) {
        const siteIds = selectSystemIds(initialState);
        const cernerSiteIds = selectRegisteredCernerFacilityIds(initialState);
        let typeOfCareFacilities = getTypeOfCareFacilities(initialState);
        let siteId = null;
        let facilityId = newAppointment.data.vaFacility;

        dispatch({
          type: FORM_PAGE_FACILITY_V2_OPEN,
        });

        // Fetch facilities that support this type of care
        if (!typeOfCareFacilities) {
          typeOfCareFacilities = await getLocationsByTypeOfCareAndSiteIds({
            siteIds,
            useV2: featureFacilitiesServiceV2,
          });
        }

        recordItemsRetrieved(
          'available_facilities',
          typeOfCareFacilities?.length,
        );

        dispatch({
          type: FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED,
          facilities: typeOfCareFacilities || [],
          typeOfCareId,
          schema,
          uiSchema,
          cernerSiteIds,
          address: selectVAPResidentialAddress(initialState),
        });

        // If we have an already selected location or only have a single location
        // fetch eligbility data immediately
        const supportedFacilities = typeOfCareFacilities.filter(facility =>
          isTypeOfCareSupported(facility, typeOfCareId, cernerSiteIds),
        );
        const eligibilityDataNeeded =
          (!!facilityId || supportedFacilities?.length === 1) &&
          !isCernerLocation(
            facilityId || supportedFacilities[0].id,
            cernerSiteIds,
          );

        if (!typeOfCareFacilities.length) {
          recordEligibilityFailure(
            'supported-facilities',
            typeOfCare.name,
            siteIds[0],
          );
        }

        if (eligibilityDataNeeded && !facilityId) {
          facilityId = supportedFacilities[0].id;
        }

        const eligibilityChecks =
          newAppointment.eligibility[`${facilityId}_${typeOfCareId}`] || null;

        if (eligibilityDataNeeded && !eligibilityChecks) {
          const location = supportedFacilities.find(f => f.id === facilityId);

          if (!siteId) {
            siteId = getSiteIdFromFacilityId(location.id);
          }

          dispatch(checkEligibility({ location, siteId }));
        }
      }
    } catch (e) {
      captureError(e, false, 'facility page');
      dispatch({
        type: FORM_PAGE_FACILITY_V2_OPEN_FAILED,
      });
    }
  };
}

export function updateCCProviderSortMethod(sortMethod, selectedFacility = {}) {
  return async (dispatch, getState) => {
    let location = null;
    const { currentLocation } = getNewAppointment(getState());
    const action = {
      type: FORM_PAGE_CC_FACILITY_SORT_METHOD_UPDATED,
      sortMethod,
    };

    if (
      sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation &&
      Object.keys(currentLocation).length === 0
    ) {
      dispatch({
        type: FORM_REQUEST_CURRENT_LOCATION,
      });
      recordEvent({
        event: `${GA_PREFIX}-request-current-location-clicked`,
      });
      try {
        location = await getPreciseLocation();
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-allowed`,
        });
        dispatch({
          ...action,
          location,
        });
      } catch (e) {
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-blocked`,
        });
        captureError(e, true, 'community care preferences page');
        dispatch({
          type: FORM_REQUEST_CURRENT_LOCATION_FAILED,
        });
      }
    } else if (sortMethod === FACILITY_SORT_METHODS.distanceFromFacility) {
      dispatch({ ...action, location: selectedFacility });
    } else {
      dispatch(action);
    }
  };
}

export function updateFacilitySortMethod(sortMethod, uiSchema) {
  return async (dispatch, getState) => {
    let location = null;
    const facilities = getTypeOfCareFacilities(getState());
    const cernerSiteIds = selectRegisteredCernerFacilityIds(getState());
    const variantTestEnabled = selectFeatureVariantTesting(getState());
    const calculatedDistanceFromCurrentLocation = facilities.some(
      f => !!f.legacyVAR?.distanceFromCurrentLocation,
    );

    const action = {
      type: FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
      sortMethod,
      uiSchema,
      cernerSiteIds,
    };

    if (
      sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation &&
      !calculatedDistanceFromCurrentLocation
    ) {
      dispatch({
        type: FORM_REQUEST_CURRENT_LOCATION,
      });
      recordEvent({
        event: `${GA_PREFIX}-request-current-location-clicked`,
      });
      try {
        location = await getPreciseLocation();
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-allowed`,
        });
        dispatch({
          ...action,
          location,
        });
      } catch (e) {
        recordEvent({
          event: `${GA_PREFIX}-request-current-location-blocked`,
        });
        captureError(e, true, 'facility page');
        if (variantTestEnabled) {
          dispatch({
            type: FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
            sortMethod,
            uiSchema,
            cernerSiteIds,
          });
        }
        dispatch({
          type: FORM_REQUEST_CURRENT_LOCATION_FAILED,
        });
      }
    } else {
      dispatch(action);
    }
  };
}

export function showEligibilityModal() {
  return {
    type: FORM_SHOW_ELIGIBILITY_MODAL,
  };
}

export function hideEligibilityModal() {
  return {
    type: FORM_HIDE_ELIGIBILITY_MODAL,
  };
}

export function openReasonForAppointment(page, uiSchema, schema) {
  return {
    type: FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function updateReasonForAppointmentData(page, uiSchema, data) {
  return {
    type: FORM_REASON_FOR_APPOINTMENT_CHANGED,
    page,
    uiSchema,
    data,
  };
}

export function openClinicPage(page, uiSchema, schema) {
  return {
    type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
    page,
    uiSchema,
    schema,
  };
}

export function getAppointmentSlots(startDate, endDate, forceFetch = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const siteId = getSiteIdFromFacilityId(getFormData(state).vaFacility);
    const newAppointment = getNewAppointment(state);
    const { data } = newAppointment;

    const startDateMonth = moment(startDate).format('YYYY-MM');
    const endDateMonth = moment(endDate).format('YYYY-MM');
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      state,
    );

    let fetchedAppointmentSlotMonths = [];
    let fetchedStartMonth = false;
    let fetchedEndMonth = false;
    let availableSlots = [];

    if (!forceFetch) {
      fetchedAppointmentSlotMonths = [
        ...newAppointment.fetchedAppointmentSlotMonths,
      ];

      fetchedStartMonth = fetchedAppointmentSlotMonths.includes(startDateMonth);
      fetchedEndMonth = fetchedAppointmentSlotMonths.includes(endDateMonth);
      availableSlots = newAppointment.availableSlots || [];
    }

    if (!fetchedStartMonth || !fetchedEndMonth) {
      let mappedSlots = [];
      dispatch({ type: FORM_CALENDAR_FETCH_SLOTS });

      try {
        const startDateString = !fetchedStartMonth
          ? startDate
          : moment(endDate)
              .startOf('month')
              .format('YYYY-MM-DD');
        const endDateString = !fetchedEndMonth
          ? endDate
          : moment(startDate)
              .endOf('month')
              .format('YYYY-MM-DD');

        const fetchedSlots = await getSlots({
          siteId,
          typeOfCareId: data?.typeOfCareId,
          clinicId: data.clinicId,
          startDate: startDateString,
          endDate: endDateString,
          useV2: featureVAOSServiceVAAppointments,
        });
        const tomorrow = moment()
          .add(1, 'day')
          .startOf('day');

        mappedSlots = fetchedSlots.filter(slot =>
          moment(slot.start).isAfter(tomorrow),
        );

        // Keep track of which months we've fetched already so we don't
        // make duplicate calls
        if (!fetchedStartMonth) {
          fetchedAppointmentSlotMonths.push(startDateMonth);
        }

        if (!fetchedEndMonth) {
          fetchedAppointmentSlotMonths.push(endDateMonth);
        }

        const sortedSlots = [...availableSlots, ...mappedSlots].sort((a, b) =>
          a.start.localeCompare(b.start),
        );

        dispatch({
          type: FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
          availableSlots: sortedSlots,
          fetchedAppointmentSlotMonths: fetchedAppointmentSlotMonths.sort(),
        });
      } catch (e) {
        captureError(e);
        dispatch({
          type: FORM_CALENDAR_FETCH_SLOTS_FAILED,
        });
      }
    }
  };
}

export function onCalendarChange(selectedDates) {
  return {
    type: FORM_CALENDAR_DATA_CHANGED,
    selectedDates,
  };
}

export function openCommunityCarePreferencesPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function openCommunityCareProviderSelectionPage(page, uiSchema, schema) {
  return (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_COMMUNITY_CARE_PROVIDER_SELECTION_OPENED,
      page,
      uiSchema,
      schema,
      featureCCIteration: selectFeatureCCIterations(getState()),
      residentialAddress: selectVAPResidentialAddress(getState()),
    });
  };
}

export function checkCommunityCareEligibility() {
  return async (dispatch, getState) => {
    const state = getState();
    const communityCareEnabled = selectFeatureCommunityCare(state);
    const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(state);

    if (!communityCareEnabled) {
      return false;
    }

    try {
      // Check if user registered systems support community care...
      const siteIds = selectSystemIds(state);
      const parentFacilities = await fetchParentLocations({
        siteIds,
        useV2: featureFacilitiesServiceV2,
      });
      const ccEnabledSystems = await fetchCommunityCareSupportedSites({
        locations: parentFacilities,
        useV2: featureFacilitiesServiceV2,
      });

      dispatch({
        type: FORM_VA_SYSTEM_UPDATE_CC_ENABLED_SYSTEMS,
        ccEnabledSystems,
        parentFacilities,
      });

      // Reroute to VA facility page if none of the user's registered systems support community care.
      if (ccEnabledSystems.length) {
        const response = await getCommunityCare(getCCEType(state));

        dispatch({
          type: FORM_UPDATE_CC_ELIGIBILITY,
          isEligible: response.eligible,
        });

        if (response.eligible) {
          recordEvent({
            event: `${GA_PREFIX}-cc-eligible-yes`,
          });
        }

        return response.eligible;
      }
    } catch (e) {
      captureError(e, false, null, {
        facilities: state.user?.profile?.facilities,
      });
      Sentry.captureMessage(
        'Community Care eligibility check failed with errors',
      );
    }

    return false;
  };
}

async function buildPreferencesDataAndUpdate(email) {
  const preferenceData = await getPreferences();
  const preferenceBody = createPreferenceBody(preferenceData, email);
  return updatePreferences(preferenceBody);
}

export function submitAppointmentOrRequest(history) {
  return async (dispatch, getState) => {
    const state = getState();
    const isFeatureHomepageRefresh = selectFeatureHomepageRefresh(state);
    const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(state);
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      state,
    );
    const newAppointment = getNewAppointment(state);
    const data = newAppointment?.data;
    const typeOfCare = getTypeOfCare(getFormData(state))?.name;

    dispatch({
      type: FORM_SUBMIT,
    });

    let additionalEventData = {
      'health-TypeOfCare': typeOfCare,
      'health-ReasonForAppointment': data?.reasonForAppointment,
    };

    if (newAppointment.flowType === FLOW_TYPES.DIRECT) {
      const flow = GA_FLOWS.DIRECT;
      recordEvent({
        event: `${GA_PREFIX}-direct-submission`,
        flow,
        ...additionalEventData,
      });

      try {
        let appointment = null;
        if (featureVAOSServiceVAAppointments) {
          appointment = await createAppointment({
            appointment: transformFormToVAOSAppointment(getState()),
          });
        } else {
          const appointmentBody = transformFormToAppointment(getState());
          await submitAppointment(appointmentBody);

          try {
            await buildPreferencesDataAndUpdate(data.email);
          } catch (error) {
            // These are ancillary updates, the request went through if the first submit
            // succeeded
            captureError(error);
          }
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        recordEvent({
          event: `${GA_PREFIX}-direct-submission-successful`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();

        if (featureVAOSServiceVAAppointments) {
          history.push(`/va/${appointment.id}?confirmMsg=true`);
        } else {
          history.push('/new-appointment/confirmation');
        }
      } catch (error) {
        const extraData = {
          vaFacility: data?.vaFacility,
          clinicId: data?.clinicId,
        };
        captureError(error, true, 'Direct submission failure', extraData);
        dispatch({
          type: FORM_SUBMIT_FAILED,
          isVaos400Error: has400LevelError(error),
        });

        dispatch(fetchFacilityDetails(newAppointment.data.vaFacility));

        recordEvent({
          event: `${GA_PREFIX}-direct-submission-failed`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
      }
    } else {
      const isCommunityCare =
        newAppointment.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
      const eventType = isCommunityCare ? 'community-care' : 'request';
      const flow = isCommunityCare ? GA_FLOWS.CC_REQUEST : GA_FLOWS.VA_REQUEST;
      let requestBody;
      if (isCommunityCare) {
        additionalEventData = {
          ...additionalEventData,
          'vaos-community-care-preferred-language': data.preferredLanguage,
          'vaos-number-of-preferred-providers':
            data.hasCommunityCareProvider ||
            data.communityCareProvider?.identifier
              ? 1
              : 0,
        };
      }

      additionalEventData = {
        ...additionalEventData,
        'vaos-preferred-combination': Object.entries(data.bestTimeToCall || {})
          .filter(item => item[1])
          .map(item => item[0])
          .sort()
          .join('-')
          .toLowerCase(),
      };

      recordEvent({
        event: `${GA_PREFIX}-${eventType}-submission`,
        flow,
        ...additionalEventData,
      });

      try {
        let requestData;
        if (featureVAOSServiceRequests && isCommunityCare) {
          requestBody = transformFormToVAOSCCRequest(getState());
          requestData = await createAppointment({ appointment: requestBody });
        } else if (featureVAOSServiceRequests) {
          requestBody = transformFormToVAOSVARequest(getState());
          requestData = await createAppointment({ appointment: requestBody });
        } else if (isCommunityCare) {
          requestBody = transformFormToCCRequest(getState());
          requestData = await submitRequest('cc', requestBody);
        } else {
          requestBody = transformFormToVARequest(getState());
          requestData = await submitRequest('va', requestBody);
        }

        if (!featureVAOSServiceRequests) {
          try {
            const requestMessage = data.reasonAdditionalInfo;
            if (requestMessage) {
              await sendRequestMessage(requestData.id, requestMessage);
            }
            await buildPreferencesDataAndUpdate(data.email);
          } catch (error) {
            // These are ancillary updates, the request went through if the first submit
            // succeeded
            captureError(error, false, 'Request message failure', {
              messageLength: newAppointment?.data?.reasonAdditionalInfo?.length,
              hasLineBreak: newAppointment?.data?.reasonAdditionalInfo?.includes(
                '\r\n',
              ),
              hasNewLine: newAppointment?.data?.reasonAdditionalInfo?.includes(
                '\n',
              ),
            });
          }
        }

        dispatch({
          type: FORM_SUBMIT_SUCCEEDED,
        });

        recordEvent({
          event: `${GA_PREFIX}-${eventType}-submission-successful`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
        if (isFeatureHomepageRefresh) {
          history.push(`/requests/${requestData.id}?confirmMsg=true`);
        } else {
          history.push('/new-appointment/confirmation');
        }
      } catch (error) {
        let extraData = null;
        if (requestBody) {
          extraData = {
            vaParent: data?.vaParent,
            vaFacility: data?.vaFacility,
            chosenTypeOfCare: data?.typeOfCareId,
            facility: requestBody.facility,
            typeOfCareId: requestBody.typeOfCareId,
            cityState: requestBody.cityState,
          };
        }
        captureError(error, true, 'Request submission failure', extraData);
        dispatch({
          type: FORM_SUBMIT_FAILED,
          isVaos400Error: getErrorCodes(error).includes('VAOS_400'),
        });

        // Remove parse function when converting this call to FHIR service
        dispatch(
          fetchFacilityDetails(
            isCommunityCare
              ? newAppointment.data.communityCareSystemId
              : newAppointment.data.vaFacility,
          ),
        );

        recordEvent({
          event: `${GA_PREFIX}-${eventType}-submission-failed`,
          flow,
          ...additionalEventData,
        });
        resetDataLayer();
      }
    }
  };
}

export function requestProvidersList(address) {
  return async (dispatch, getState) => {
    try {
      const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
        getState(),
      );
      let location = address;
      const newAppointment = getState().newAppointment;
      const communityCareProviders = newAppointment.communityCareProviders;
      const sortMethod = newAppointment.ccProviderPageSortMethod;
      let selectedCCFacility = newAppointment.selectedCCFacility;
      const typeOfCare = getTypeOfCare(newAppointment.data);
      let ccProviderCacheKey = `${sortMethod}_${typeOfCare.ccId}`;
      if (sortMethod === FACILITY_SORT_METHODS.distanceFromFacility) {
        ccProviderCacheKey = `${sortMethod}_${selectedCCFacility.id}_${
          typeOfCare.ccId
        }`;
      }
      let typeOfCareProviders = communityCareProviders[ccProviderCacheKey];

      dispatch({
        type: FORM_REQUESTED_PROVIDERS,
      });

      if (!featureFacilitiesServiceV2 && !address) {
        try {
          selectedCCFacility = await getLocation({
            facilityId: selectedCCFacility.id,
          });
          location = selectedCCFacility.position;
        } catch (error) {
          location = null;
          captureError(error);
        }
      }

      if (!typeOfCareProviders) {
        typeOfCareProviders = await getCommunityProvidersByTypeOfCare({
          address: location,
          typeOfCare,
        });
      }

      dispatch({
        type: FORM_REQUESTED_PROVIDERS_SUCCEEDED,
        typeOfCareProviders,
        address: location,
        selectedCCFacility,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: FORM_REQUESTED_PROVIDERS_FAILED,
      });
    }
  };
}

export function requestAppointmentDateChoice(history) {
  return dispatch => {
    dispatch(startRequestAppointmentFlow());
    history.replace('/new-appointment/request-date');
  };
}

export function routeToPageInFlow(flow, history, current, action, data) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
      pageKey: current,
      data,
    });

    let nextPage;
    let nextStateKey;

    if (action === 'next') {
      const nextAction = flow[current][action];
      if (typeof nextAction === 'string') {
        nextPage = flow[nextAction];
        nextStateKey = nextAction;
      } else {
        nextStateKey = await nextAction(getState(), dispatch);
        nextPage = flow[nextStateKey];
      }
    } else {
      const state = getState();
      const previousPage = state.newAppointment.previousPages[current];
      nextPage = flow[previousPage];
    }

    if (nextPage?.url) {
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
        pageKey: current,
        pageKeyNext: nextStateKey,
        direction: action,
      });
      history.push(nextPage.url);
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToNextAppointmentPage(history, current, data) {
  return routeToPageInFlow(newAppointmentFlow, history, current, 'next', data);
}

export function routeToPreviousAppointmentPage(history, current, data) {
  return routeToPageInFlow(
    newAppointmentFlow,
    history,
    current,
    'previous',
    data,
  );
}
