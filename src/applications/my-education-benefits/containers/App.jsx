import React from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// import { setData } from 'platform/forms-system/src/js/actions';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="#">Education and training</a>
        <a href="#">Apply for education benefits</a>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

const mapStateToProps = state => {
  const fullName = state.user.profile.userFullName || {};
  // const contactInfo = fetchContactInfo(state);
  return {
    data: {
      data: state.form?.data,
      'view:fullName': { fullName: { fullName } },
      // formData: {
      //   'view:fullName': { fullName: { first: 'Dennis' } },
      //   fullName: { first: 'DENNIS' },
      //   first: 'dennis',
      //   dateOfBirth: '1988-07-31',
      // },
      fullName: { first: 'DENNIS K' },
      first: 'dennis k',
      dateOfBirth: '1988-07-01',
      // fullFormData: state.form.data || {},
      fullFormData: {
        'view:fullName': { fullName: { first: 'DK 1' } },
        fullName: { first: 'DK 2' },
        first: 'DK 3',
        dateOfBirth: '1988-07-02',
      },
      // formData: state.form?.data || {},
      formData: {
        'view:fullName': { fullName: { first: 'dk' } },
        fullName: { first: 'dk 2' },
        first: 'dk 3',
        dateOfBirth: '1988-07-03',
      },
    },
  };
};

// const mapDispatchToProps = {
//   setFormData: setData,
// };

export default connect(
  mapStateToProps,
  () => {},
)(App);
