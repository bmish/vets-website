export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = payload => {
  const data = { appointments: [{ ...payload }] };

  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    payload: {
      ...data,
    },
  };
};

export const receivedMultipleAppointmentDetails = payload => {
  const data = { appointments: [...payload] };

  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    payload: {
      ...data,
    },
  };
};

export const APPOINTMENT_WAS_CHECKED_INTO = 'APPOINTMENT_WAS_CHECKED_INTO';

export const appointmentWAsCheckedInto = appointment => {
  return {
    type: APPOINTMENT_WAS_CHECKED_INTO,
    payload: { appointment },
  };
};

export const RECEIVED_DEMOGRAPHICS_DATA = 'RECEIVED_DEMOGRAPHICS_DATA';

export const receivedDemographicsData = demographics => {
  return {
    type: RECEIVED_DEMOGRAPHICS_DATA,
    payload: { demographics },
  };
};

export const TRIGGER_REFRESH = 'TRIGGER_REFRESH';

export const triggerRefresh = (shouldRefresh = true) => {
  return {
    type: TRIGGER_REFRESH,
    payload: {
      context: { shouldRefresh },
    },
  };
};

export const PERMISSIONS_UPDATED = 'PERMISSIONS_UPDATED';

export const permissionsUpdated = (data, scope) => {
  const { permissions } = data;
  return {
    type: PERMISSIONS_UPDATED,
    payload: { permissions, scope },
  };
};

export const TOKEN_WAS_VALIDATED = 'TOKEN_WAS_VALIDATED';

export const tokenWasValidated = (payload, token, scope) => {
  const data = payload ? { appointments: [{ ...payload }] } : {};
  return {
    type: TOKEN_WAS_VALIDATED,
    payload: {
      context: { token, scope },
      ...data,
    },
  };
};
