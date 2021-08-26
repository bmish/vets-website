import React from 'react';
import FacilityPhone from '../../../components/FacilityPhone';
import InfoAlert from '../../../components/InfoAlert';
import { getFacilityPhone } from '../../../services/location';

export function NoCancelAlert({ facility }) {
  const name = facility?.name;
  const facilityPhone = getFacilityPhone(facility);

  return (
    <InfoAlert
      status="info"
      className="vads-u-display--block"
      headline="Need to make changes?"
      backgroundOnly
    >
      {!facility &&
        'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.'}
      {!!facility &&
        'Contact this facility if you need to reschedule or cancel your appointment.'}
      <br />
      {!!facility && (
        <span className="vads-u-display--block vads-u-margin-top--2">
          {name}
          {facilityPhone && (
            <>
              <br />
              <FacilityPhone contact={facilityPhone} level={3} />
            </>
          )}
        </span>
      )}
    </InfoAlert>
  );
}
