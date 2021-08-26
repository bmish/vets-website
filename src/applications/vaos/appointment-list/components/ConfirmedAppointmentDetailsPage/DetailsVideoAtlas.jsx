import React from 'react';
import { Link } from 'react-router-dom';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AppointmentDateTime from '../AppointmentDateTime';
import PageLayout from '../AppointmentsPage/PageLayout';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DetailsCalendarLink from './CalendarLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import AtlasLocation from '../cards/confirmed/AtlasLocation';
import VideoVisitProvider from './VideoVisitProvider';
import NoCancelAlert from './NoCancelAlert';
import VideoInstructions from './VideoInstructions';

export default function DetailsVideoAtlas({ appointment, facilityData }) {
  const { providers } = appointment.videoData;
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/va/${appointment.id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      <StatusAlert appointment={appointment} facility={facility} />

      <TypeHeader isVideo>VA Video Connect at an ATLAS location</TypeHeader>

      {!isPastAppointment && (
        <span>
          You must join this video meeting from the ATLAS (non-VA) location
          listed below.
        </span>
      )}
      {isPastAppointment && <span>Video conference</span>}

      <div className="vads-u-margin-top--2">
        <AtlasLocation
          appointment={appointment}
          isPast={appointment.vaos.isPastAppointment}
        />
      </div>

      {providers?.length > 0 && (
        <div className="vads-u-margin-top--2">
          <VideoVisitProvider
            providers={providers}
            isPast={appointment.vaos.isPastAppointment}
          />
        </div>
      )}

      <VideoInstructions appointment={appointment} />

      {!canceled &&
        !isPastAppointment && (
          <DetailsCalendarLink appointment={appointment} facility={facility} />
        )}
      {!canceled && <PrintLink />}
      {!appointment.vaos.isPastAppointment && (
        <NoCancelAlert facility={facility} />
      )}
    </PageLayout>
  );
}
