import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import localStorage from 'platform/utilities/storage/localStorage';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import Form526Entry, { serviceRequired, idRequired } from '../../Form526EZApp';
import reducers from '../../reducers';
import {
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../../actions';
import { WIZARD_STATUS } from '../../constants';
import formConfig from '../../config/form';

const fakeSipsIntro = user => {
  const { profile, login } = user;
  if (!login.currentlyLoggedIn) {
    return 'Log in to continue';
  }
  if (!profile.verified) {
    return 'Need to be verified';
  }
  // 'Not authorized' shouldn't be seen (an alert will show instead)
  return profile.services.length ? 'Start the form' : 'Not authorized';
};

describe('Form 526EZ Entry Page', () => {
  let gaData;
  const getLastEvent = (index = -1) => gaData[gaData.length + index];
  const testPage = ({
    verified = false,
    currentlyLoggedIn = true,
    services = [],
    savedForms = [],
    mvi = '',
    show526Wizard = true,
    dob = '2000-01-01',
  } = {}) => {
    const initialState = {
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
      },
      user: {
        login: {
          currentlyLoggedIn,
        },
        profile: {
          verified,
          services,
          loading: false,
          status: '',
          dob,
        },
      },
      currentLocation: {
        pathname: '/introduction',
        search: '',
      },
      mvi: {
        addPersonState: mvi,
      },
      featureToggles: {
        show526Wizard,
      },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    window.dataLayer = [];
    gaData = global.window.dataLayer;
    return mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
          showWizard={initialState.showWizard}
          router={[]}
          savedForms={savedForms}
        >
          <main>
            <h1>{fakeSipsIntro(initialState.user)}</h1>
          </main>
        </Form526Entry>
      </Provider>,
    );
  };

  beforeEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });

  // Not logged in
  it('should render content when not logged in', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    expect(tree.find('RoutedSavableApp')).to.have.lengthOf(1);
    expect(tree.find('main').text()).to.contain('Log in');
    tree.unmount();
  });

  // Logged in & verified, but missing ID
  it('should render Missing ID page', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: [],
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('va-alert')).to.have.lengthOf(1);
    expect(tree.find('va-alert').text()).to.contain('BIRLS ID');
    const recordedEvent = getLastEvent();
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['error-key']).to.include('birls_id');
    tree.unmount();
  });

  // Logged in & verified, but missing 526 services
  it('should render Missing services page', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      // only include 'EVSS_CLAIMS' service
      services: [idRequired[0]],
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('va-alert')).to.have.lengthOf(1);
    expect(tree.find('va-alert').text()).to.contain('need some information');
    const recordedEvent = getLastEvent();
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['error-key']).to.include('missing_526');
    tree.unmount();
  });

  // Logged in & verified, but missing DOB
  it('should render Missing DOB aler', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      // only include 'EVSS_CLAIMS' service
      services: [idRequired[0]],
      dob: '',
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('va-alert')).to.have.lengthOf(1);
    expect(tree.find('va-alert').text()).to.contain('your date of birth');
    const recordedEvent = getLastEvent();
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['error-key']).to.include('missing_dob');
    tree.unmount();
  });

  // Logged in & verified & has services
  it('should render form app content', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: serviceRequired,
    });
    expect(tree.find('main')).to.have.lengthOf(1);
    expect(tree.find('h1').text()).to.contain('Start the form');
    tree.unmount();
  });

  // Logged in & not verified (has services to allow proceeding)
  it('should render verify your identity page', () => {
    localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: false,
      services: serviceRequired,
    });
    localStorage.removeItem('hasSession');
    expect(tree.find('main')).to.have.lengthOf(1);
    expect(tree.find('h1').text()).to.contain('Need to be verified');

    tree.unmount();
  });

  // Logged in but has add-person service (missing BIRLS or participant ID)
  it('should render add-person loader', () => {
    localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_INITIATED,
    });
    localStorage.removeItem('hasSession');

    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('LoadingIndicator')).to.have.lengthOf(1);
    expect(tree.find('LoadingIndicator').text()).to.contain('additional work');
    tree.unmount();
  });

  // Logged in, has add-person service (missing BIRLS or participant ID), but
  // succeeded in adding id
  it('should render intro page after successful add person', () => {
    localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person', ...serviceRequired],
      mvi: MVI_ADD_SUCCEEDED,
    });
    localStorage.removeItem('hasSession');
    expect(tree.find('main')).to.have.lengthOf(1);
    expect(tree.find('h1').text()).to.contain('Start the form');
    tree.unmount();
  });

  // Logged in & failed add person call
  it('should render Missing services page after failed add person call', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_FAILED,
    });
    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('va-alert')).to.have.lengthOf(1);
    expect(tree.find('va-alert p').text()).to.contain(
      'We need more information',
    );
    const recordedEvent = getLastEvent();
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['error-key']).to.include(
      'missing_526_or_original_claims_service',
    );
    tree.unmount();
  });

  // Wizard
  it('should not redirect to the wizard when not logged in', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should redirect to the wizard when logged in', () => {
    localStorage.setItem('hasSession', true);
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: true,
    });
    expect(tree.find('h1').text()).to.contain('restart the app');
    tree.unmount();
  });
  it('should not redirect to the wizard there is a saved form', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
      show526Wizard: false,
      savedForms: [formConfig.formId],
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should redirect to the wizard when restarting', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
      show526Wizard: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should render loading indicator when feature is undefined', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const initialState = {
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: { metadata: {} },
      },
      user: {
        login: { currentlyLoggedIn: false },
        profile: { verified: false, services: [], loading: false, status: '' },
      },
      currentLocation: { pathname: '/introduction', search: '' },
      mvi: { addPersonState: '' },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    window.dataLayer = [];
    gaData = global.window.dataLayer;
    const tree = mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
          router={[]}
        >
          <main>
            <h1>{fakeSipsIntro(initialState.user)}</h1>
          </main>
        </Form526Entry>
      </Provider>,
    );
    expect(tree.find('LoadingIndicator')).to.have.lengthOf(1);
    expect(tree.find('WizardContainer')).to.have.lengthOf(0);
    tree.unmount();
  });
});
