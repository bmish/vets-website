// import fullSchema from 'vets-json-schema/dist/00-0000-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PageTwo from '../containers/PageTwo';
import page2Review from '../containers/Page2Review';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formFields = {
  firstName: 'firstName',
  pageTwoData: 'pageTwoData',
  pageTwoDataB: 'pageTwoDataB',
  lastName: 'lastName',
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'i18n-0000-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '00-0000',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your i18n form poc app application (00-0000) is in progress.',
    //   expired: 'Your saved i18n form poc app application (00-0000) has expired. If you want to apply for i18n form poc app, please start a new application.',
    //   saved: 'Your i18n form poc app application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for i18n form poc app.',
    noAuth:
      'Please sign in again to continue your application for i18n form poc app.',
  },
  title: 'i18n',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'first-name',
          title: 'Personal Information - Page 1',
          uiSchema: {
            [formFields.firstName]: {
              'ui:title': 'First Name',
            },
          },
          schema: {
            required: [formFields.firstName],
            type: 'object',
            properties: {
              [formFields.firstName]: {
                type: 'string',
              },
            },
          },
        },
        page2: {
          path: 'second-page',
          title: 'Testing bypass with I18next',
          CustomPage: PageTwo,
          CustomPageReview: page2Review,
          schema: {
            type: 'object',
            properties: {},
          },
          uiSchema: {},
        },
      },
    },
  },
};

export default formConfig;
