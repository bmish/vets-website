import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import moment from '../../lib/moment-tz';

import { FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { fetchConfirmedAppointmentDetails } from '../redux/actions';
import AppointmentDateTime from './cards/confirmed/AppointmentDateTime';
import AddToCalendar from '../../components/AddToCalendar';
import FacilityAddress from '../../components/FacilityAddress';
import PageLayout from './AppointmentsPage/PageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { selectCommunityCareDetailsInfo } from '../redux/selectors';
import FullWidthLayout from '../../components/FullWidthLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import { getCalendarData } from '../../services/appointment';

export default function CommunityCareAppointmentDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { appointment, appointmentDetailsStatus } = useSelector(state =>
    selectCommunityCareDetailsInfo(state, id),
  );
  const appointmentDate = moment.parseZone(appointment?.start);

  useEffect(() => {
    dispatch(fetchConfirmedAppointmentDetails(id, 'cc'));
  }, []);

  useEffect(
    () => {
      if (appointment && appointmentDate) {
        document.title = `Community care appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}`;
        scrollAndFocus();
      }
    },
    [appointment, appointmentDate],
  );

  useEffect(
    () => {
      if (
        appointmentDetailsStatus === FETCH_STATUS.failed ||
        (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
      ) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <LoadingIndicator setFocus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const header = 'Community care';
  const { providerName, practiceName } =
    appointment.communityCareProvider || {};
  const calendarData = getCalendarData({
    facility: appointment.communityCareProvider,
    appointment,
  });
  const isPastAppointment = appointment.vaos.isPastAppointment;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/cc/${id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={appointment.location.vistaId}
        />
      </h1>

      {isPastAppointment && (
        <AlertBox
          status={ALERT_TYPE.WARNING}
          className="vads-u-display--block"
          backgroundOnly
        >
          This appointment occurred in the past.
        </AlertBox>
      )}

      <h2
        className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
        data-cy="community-care-appointment-details-header"
      >
        <span>
          <strong>{header}</strong>
        </span>
      </h2>

      {(!!providerName || !!practiceName) && (
        <>
          {providerName || practiceName}
          <br />
        </>
      )}
      <FacilityAddress
        facility={appointment.communityCareProvider}
        showDirectionsLink={!!appointment.communityCareProvider.address}
        level={2}
      />

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        {!!appointment.comment && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Special instructions
            </h2>
            <div>{appointment.comment}</div>
          </div>
        )}
      </div>

      {!isPastAppointment && (
        <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
          <i
            aria-hidden="true"
            className="far fa-calendar vads-u-margin-right--1 vads-u-color--link-default"
          />
          <AddToCalendar
            summary={calendarData.summary}
            description={{
              text: calendarData.text,
              phone: calendarData.phone,
              additionalText: calendarData.additionalText,
            }}
            location={calendarData.location}
            duration={appointment.minutesDuration}
            startDateTime={moment.parseZone(appointment.start)}
          />
        </div>
      )}

      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i
          aria-hidden="true"
          className="fas fa-print vads-u-margin-right--1 vads-u-color--link-default"
        />
        <button className="va-button-link" onClick={() => window.print()}>
          Print
        </button>
      </div>

      {!isPastAppointment && (
        <AlertBox
          status={ALERT_TYPE.INFO}
          className="vads-u-display--block"
          headline="Need to make changes?"
          backgroundOnly
        >
          Contact this provider if you need to reschedule or cancel your
          appointment.
        </AlertBox>
      )}
    </PageLayout>
  );
}
