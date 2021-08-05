import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { SaveInProgressIntro } from '../../save-in-progress/SaveInProgressIntro';

describe('Schemaform <SaveInProgressIntro>', () => {
  const pageList = [
    {
      path: 'wrong-path',
    },
    {
      path: 'testing',
    },
  ];
  const fetchInProgressForm = () => {};
  const removeInProgressForm = () => {};
  const toggleLoginModal = () => {};

  const formConfig = {
    saveInProgress: {
      messages: {
        expired:
          'Your saved health care benefits application (10-10EZ) has expired. If you want to apply for health care benefits, please start a new application.',
      },
    },
  };

  it('should render in progress message', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 946684800,
              expiresAt: moment().unix() + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(
      tree
        .find('.usa-alert-heading')
        .last()
        .text(),
    ).to.include(moment.unix(946684800).format('MMMM D, YYYY [at] h:mm a'));

    expect(tree.find('.usa-alert').text()).to.contain(
      'Your application is in progress',
    );
    expect(tree.find('.usa-alert').text()).to.contain('will expire on');
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    expect(tree.find('withRouter(FormStartControls)').props().prefillAvailable)
      .to.be.false;
    expect(
      tree.find('withRouter(FormStartControls)').props().startPage,
    ).to.equal('testing');
    tree.unmount();
  });
  it('should render in progress message with header', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 946684800,
              expiresAt: moment().unix() + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        headingLevel={1}
      />,
    );

    expect(tree.find('.usa-alert-heading').text()).to.contain(
      'Your application is in progress',
    );
    tree.unmount();
  });
  it('should pass prefills available prop', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [VA_FORM_IDS.FORM_10_10EZ],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('withRouter(FormStartControls)').props().prefillAvailable)
      .to.be.true;
    tree.unmount();
  });
  it('should render sign in message', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.va-button-link').text()).to.contain(
      'Sign in to your account.',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render prefill Notification when prefill enabled and not signed in', () => {
    const prefillEnabled = true;
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        prefillEnabled={prefillEnabled}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain(
      'Save time—and save your work in progress—by signing in before starting your application',
    );
    expect(tree.find('.usa-button-primary').text()).to.contain(
      'Sign in to start your application',
    );
    expect(tree.find('.va-button-link').text()).to.contain(
      'Start your application without signing in',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render message if signed in with no saved form', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain(
      'You can save this application in progress',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
  });

  it('should render prefill notification if signed in with no saved form and prefill available', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [VA_FORM_IDS.FORM_10_10EZ],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain(
      'Note: Since you’re signed in to your account, we can prefill part of your application based on your account details. You can also save your application in progress and come back later to finish filling it out.',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
  });

  it('should over-ride the default retentionPeriod prop when one supplied', () => {
    const prefillEnabled = true;
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        prefillEnabled={prefillEnabled}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        retentionPeriod={'1 year'}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain('1 year');
    expect(tree.find('.usa-alert').text()).to.not.contain('60 days');
    tree.unmount();
  });

  it('should render loading indicator while profile is loading', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
        loading: true,
      },
      login: {
        currentlyLoggedIn: false,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render expired message if signed in with an expired form', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain(
      'Your application has expired',
    );
    expect(tree.find('.usa-alert').text()).to.contain(
      'Your saved health care benefits application (10-10EZ) has expired. If you want to apply for health care benefits, please start a new application.',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
  });
  it('should render sign in message from render prop', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };
    const renderSpy = sinon.stub().returns(<div>Render prop info</div>);

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        renderSignInMessage={renderSpy}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(renderSpy.called).to.be.true;
    expect(tree.text()).to.contain('Render prop info');
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render downtime notification', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };
    const renderSpy = sinon.stub().returns(<div>Render prop info</div>);

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        renderSignInMessage={renderSpy}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.true;
    tree.unmount();
  });

  it('should render a different heading level when passed in as a prop', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        headingLevel={1}
      />,
    );

    expect(tree.find('h1').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render downtime notification when logged in', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };
    const renderSpy = sinon.stub().returns(<div>Render prop info</div>);

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        isLoggedIn
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        renderSignInMessage={renderSpy}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.false;
    tree.unmount();
  });

  it('should not render get started button', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.schemaform-start-button').exists()).to.be.false;

    tree.unmount();
  });

  it('should properly hide non-authed start when desired', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.schemaform-start-button').exists()).to.be.false;

    tree.unmount();
  });
  it('should display an unauthStartText message', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={formConfig}
      />,
    );
    expect(tree.find('.usa-button-primary').text()).to.equal(
      'Custom message displayed to non-signed-in users',
    );
    tree.unmount();
  });

  it('should not render an inProgress message', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 946684800,
              expiresAt: moment().unix() + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const emptyMessageConfig = {
      saveInProgress: {
        messages: {
          inProgress: '',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={emptyMessageConfig}
      />,
    );
    expect(tree.find('.usa-alert-heading')).to.have.lengthOf(1);
    expect(tree.find('.usa-alert-heading').text()).to.not.contain(
      'Your application is in progress',
    );

    tree.unmount();
  });
});
