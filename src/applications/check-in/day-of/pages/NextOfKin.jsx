import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackButton from '../components/BackButton';
import BackToHome from '../components/BackToHome';
import { focusElement } from 'platform/utilities/ui';
import Footer from '../components/Footer';
import { seeStaffMessageUpdated } from '../actions';
import NextOfKinDisplay from '../../components/pages/nextOfKin/NextOfKinDisplay';

const NextOfKin = props => {
  const {
    nextOfKin,
    isLoading,
    isDemographicsPageEnabled,
    isUpdatePageEnabled,
    router,
    updateSeeStaffMessage,
  } = props;

  const seeStaffMessage =
    'Our staff can help you update your next of kin information.';

  useEffect(() => {
    focusElement('h1');
  }, []);

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-next-of-kin-information',
      });
      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isUpdatePageEnabled, router],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-next-of-kin-information',
      });
      updateSeeStaffMessage(seeStaffMessage);
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router, updateSeeStaffMessage],
  );

  if (isLoading) {
    return (
      <va-loading-indicator message="Loading your appointments for today" />
    );
  } else if (!nextOfKin) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <>
        {(isUpdatePageEnabled || isDemographicsPageEnabled) && (
          <BackButton router={router} />
        )}
        <NextOfKinDisplay
          nextOfKin={nextOfKin}
          yesAction={yesClick}
          noAction={noClick}
          Footer={Footer}
        />
        <BackToHome />
      </>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateSeeStaffMessage: seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
  };
};

NextOfKin.propTypes = {
  nextOfKin: PropTypes.object,
  isLoading: PropTypes.bool,
  isDemographicsPageEnabled: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
  updateSeeStaffMessage: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(NextOfKin);
