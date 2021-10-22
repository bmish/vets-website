import { ELIGIBILITY } from './eligibility';

/**
 * @typedef {Object} Appointment
 * @property {string} facility
 * @property {string} clinicPhoneNumber
 * @property {string} clinicFriendlyName
 * @property {string} clinicName
 * @property {string} appointmentIen,
 * @property {Date} startTime,
 * @property {string} eligibility,
 * @property {string} facilityId,
 * @property {Date} checkInWindowStart,
 * @property {Date} checkInWindowEnd,
 * @property {string} checkedInTime,
 */

/**
 * @param {Array<Appointment>} appointments
 * @param {Appointment} currentAppointment
 */
const hasMoreAppointmentsToCheckInto = (appointments, currentAppointment) => {
  return (
    appointments
      .filter(f => f.appointmentIen !== currentAppointment?.appointmentIen)
      .filter(f => f.eligibility === ELIGIBILITY.ELIGIBLE).length > 0
  );
};

/**
 * @param {Array<Appointment>} appointments
 */
const sortAppointmentsByStartTime = appointments => {
  return appointments
    ? [
        ...appointments.sort((first, second) => {
          const f = new Date(first.startTime);
          const s = new Date(second.startTime);
          return new Date(f) - new Date(s);
        }),
      ]
    : [];
};
export { hasMoreAppointmentsToCheckInto, sortAppointmentsByStartTime };
