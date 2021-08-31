import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';

// Currently does the similar logic as withAppointmentData.
// This will be updated in a future PR to use the low auth checks when the logic is implemented
const withLowAuthorization = WrappedComponent => props => {
  const { checkInData, router } = props;
  const { appointment } = checkInData;

  useEffect(
    () => {
      if (!appointment) {
        const session = getCurrentToken(window);
        if (session) {
          const { token } = session;
          goToNextPage(router, URLS.LANDING, { url: { id: token } });
        } else {
          goToNextPage(router, URLS.ERROR);
        }
      }
    },
    [appointment, router],
  );
  if (!appointment) {
    return <></>;
  }
  return (
    <>
      <WrappedComponent {...props} />
    </>
  );
};

const mapStateToProps = state => ({
  checkInData: state.checkInData,
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withLowAuthorization,
);
export default composedWrapper;
