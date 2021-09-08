// import fullSchema from 'vets-json-schema/dist/00-0000-schema.json';

import manifest from '../manifest.json';

import FormTitleCustom from '../components/FormTitleCustom';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import Vet1 from '../containers/Vet1';
import Vet1Review from '../containers/Vet1Review';

import PageTwo from '../containers/PageTwo';
import Page2Review from '../containers/Page2Review';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  namespace: 'i18n',
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
  title: FormTitleCustom,
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'chapter1.title',
      pages: {
        page1: {
          path: 'vet1',
          CustomPage: Vet1,
          CustomPageReview: Vet1Review,
          schema: {
            type: 'object',
            properties: {},
          },
          uiSchema: {},
        },
        page2: {
          path: 'second-page',
          title: 'Testing bypass with I18next',
          CustomPage: PageTwo,
          CustomPageReview: Page2Review,
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
