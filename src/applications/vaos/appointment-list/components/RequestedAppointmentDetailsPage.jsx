import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
  GA_PREFIX,
} from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './cards/pending/ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  getPatientTelecom,
  getVAAppointmentLocationId,
} from '../../services/appointment';
import { selectRequestedAppointmentDetails } from '../redux/selectors';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from './AppointmentsPage/PageLayout';
import FullWidthLayout from '../../components/FullWidthLayout';
import InfoAlert from '../../components/InfoAlert';
import {
  startAppointmentCancel,
  closeCancelAppointment,
  confirmCancelAppointment,
  fetchRequestDetails,
  startNewAppointmentFlow,
} from '../redux/actions';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import recordEvent from 'platform/monitoring/record-event';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

export default function RequestedAppointmentDetailsPage() {
  const queryParams = new URLSearchParams(useLocation().search);
  const showConfirmMsg = queryParams.get('confirmMsg');
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    appointmentDetailsStatus,
    facilityData,
    cancelInfo,
    appointment,
    message,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchRequestDetails(id));
  }, []);

  useEffect(
    () => {
      if (appointment) {
        const isCanceled = appointment.status === APPOINTMENT_STATUS.cancelled;
        const isCC = appointment.vaos.isCommunityCare;
        const typeOfCareText = lowerCase(
          appointment?.type?.coding?.[0]?.display,
        );

        const title = `${isCanceled ? 'Canceled' : 'Pending'} ${
          isCC ? 'Community care' : 'VA'
        } ${typeOfCareText} appointment`;

        document.title = title;
      }
      scrollAndFocus();
    },
    [appointment],
  );

  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
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
        <LoadingIndicator
          setFocus
          message="Loading your appointment request..."
        />
      </FullWidthLayout>
    );
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfVisit = appointment.requestVisitType;
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const isCCRequest =
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const provider = appointment.preferredCommunityCareProviders?.[0];
  const comment = message || appointment.comment;
  const apptDetails = comment
    ? `${appointment.reason}: ${comment}`
    : appointment.reason;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/requests/${id}`}>Request detail</Link>
      </Breadcrumbs>

      <h1>
        {canceled ? 'Canceled' : 'Pending'} {typeOfCareText} appointment
      </h1>
      {!showConfirmMsg &&
        !canceled && (
          <InfoAlert backgroundOnly status="info">
            The time and date of this appointment are still to be determined.
          </InfoAlert>
        )}
      {showConfirmMsg && (
        <InfoAlert backgroundOnly status={canceled ? 'error' : 'success'}>
          {canceled && 'This request has been canceled'}
          {!canceled && (
            <>
              <strong>Your appointment request has been submitted. </strong>
              We will review your request and contact you to schedule the first
              available appointment.
              <br />
              <div className=" vads-u-margin-top--1">
                <Link
                  to="/"
                  onClick={() => {
                    recordEvent({
                      event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
                    });
                  }}
                >
                  View your appointments
                </Link>
              </div>
              <div className=" vads-u-margin-top--1">
                <Link
                  to="/new-appointment"
                  onClick={() => {
                    recordEvent({
                      event: `${GA_PREFIX}-schedule-another-appointment-button-clicked`,
                    });
                    dispatch(startNewAppointmentFlow());
                  }}
                >
                  New appointment
                </Link>
              </div>
            </>
          )}
        </InfoAlert>
      )}
      {!isCCRequest && (
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          VA appointment
        </h2>
      )}

      {!!facility &&
        !isCC && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isHomepageRefresh
          />
        )}

      {isCCRequest ? (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred community care provider
          </h2>
          {!!provider && (
            <span>
              {provider.name ||
                (provider.providerName || provider.practiceName)}
            </span>
          )}
          {!provider && <span>No provider selected</span>}
        </>
      ) : (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred type of appointment
          </h2>
          {typeOfVisit}
        </>
      )}

      <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
        Preferred date and time
      </h2>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="usa-unstyled-list" role="list">
        {appointment.requestedPeriod.map((option, optionIndex) => (
          <li key={`${appointment.id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {option.start.includes('00:00:00') ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <div className="vaos-u-word-break--break-word">
        <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
          You shared these details about your concern
        </h2>
        {!isCCRequest && apptDetails}
        {isCCRequest && <>{comment || 'none'}</>}
      </div>
      <div>
        <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
          Your contact details
        </h2>
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Email:{' '}
        </h3>
        <span>{getPatientTelecom(appointment, 'email')}</span>
        <br />
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Phone number:{' '}
        </h3>
        <Telephone
          notClickable
          contact={getPatientTelecom(appointment, 'phone')}
        />
        <br />
        <ListBestTimeToCall
          timesToCall={appointment.preferredTimesForPhoneCall}
        />
      </div>
      <div className="vaos-u-word-break--break-word">
        {!canceled && (
          <>
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--3">
              <i
                aria-hidden="true"
                className="fas fa-times vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-right--1"
              />
              <button
                aria-label="Cancel request"
                className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
                onClick={() => dispatch(startAppointmentCancel(appointment))}
              >
                Cancel Request
              </button>
            </div>
          </>
        )}
      </div>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={() => dispatch(confirmCancelAppointment())}
        onClose={() => dispatch(closeCancelAppointment())}
      />
    </PageLayout>
  );
}
