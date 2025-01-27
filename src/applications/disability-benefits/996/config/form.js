import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
import submitForm from './submitForm';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import ReviewDescription from '../components/ReviewDescription';
import {
  EditPhone,
  EditEmail,
  EditAddress,
} from '../components/EditContactInfo';

// Pages
import veteranInformation from '../pages/veteranInformation';
import contactInfo from '../pages/contactInformation';
import homeless from '../pages/homeless';
import contestedIssuesPage from '../pages/contestedIssues';
import additionalIssuesIntro from '../pages/additionalIssuesIntro';
import additionalIssues from '../pages/additionalIssues';
import areaOfDisagreementFollowUp from '../pages/areaOfDisagreement';
import optIn from '../pages/optIn';
import issueSummary from '../pages/issueSummary';
import sameOffice from '../pages/sameOffice';
import informalConference from '../pages/informalConference';
import informalConferenceRep from '../pages/informalConferenceRep';
import informalConferenceRepV2 from '../pages/informalConferenceRepV2';
import informalConferenceTimes from '../pages/informalConferenceTimes';
import informalConferenceTime from '../pages/informalConferenceTimeV2';

import { errorMessages, WIZARD_STATUS } from '../constants';
import {
  apiVersion1,
  apiVersion2,
  appStateSelector,
  showAddIssueQuestion,
  showAddIssuesPage,
  getIssueName,
} from '../utils/helpers';
// import initialData from '../tests/schema/initialData';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: 'higher_level_reviews',
  submit: submitForm,
  trackingPrefix: 'decision-reviews-va20-0996-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile,
      services.bgs,
      services.mvi,
      services.appeals,
    ],
  },

  formId: VA_FORM_IDS.FORM_20_0996,
  wizardStorageKey: WIZARD_STATUS,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Higher-Level Review application (20-0996) is in progress.',
      expired:
        'Your saved Higher-Level Review application (20-0996) has expired. If you want to apply for Higher-Level Review, please start a new application.',
      saved: 'Your Higher-Level Review application has been saved.',
    },
    // return restart destination url
    restartFormCallback: () => '/', // introduction page
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,

  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },

  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },

  title: 'Request a Higher-Level Review',
  subTitle: 'VA Form 20-0996 (Higher-Level Review)',
  defaultDefinitions: {},
  preSubmitInfo,
  chapters: {
    infoPages: {
      title: 'Veteran information',
      reviewDescription: ReviewDescription,
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        homeless: {
          title: 'Homelessness question',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
          depends: apiVersion2,
        },
        confirmContactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
        editMobilePhone: {
          title: 'Edit mobile phone',
          path: 'edit-mobile-phone',
          CustomPage: EditPhone,
          CustomPageReview: EditPhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editEmailAddress: {
          title: 'Edit email address',
          path: 'edit-email-address',
          CustomPage: EditEmail,
          CustomPageReview: EditEmail,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editMailingAddress: {
          title: 'Edit mailing address',
          path: 'edit-mailing-address',
          CustomPage: EditAddress,
          CustomPageReview: EditAddress,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
    conditions: {
      title: 'Issues eligible for review',
      pages: {
        contestedIssues: {
          title: ' ',
          path: 'eligible-issues',
          uiSchema: contestedIssuesPage.uiSchema,
          schema: contestedIssuesPage.schema,
          // initialData,
        },
        additionalIssuesIntro: {
          title: 'Additional issues for review',
          path: 'additional-issues-intro',
          depends: formData =>
            showAddIssueQuestion(formData) && apiVersion2(formData),
          uiSchema: additionalIssuesIntro.uiSchema,
          schema: additionalIssuesIntro.schema,
          appStateSelector,
        },
        additionalIssues: {
          title: 'Add issues for review',
          path: 'additional-issues',
          depends: formData =>
            showAddIssuesPage(formData) && apiVersion2(formData),
          uiSchema: additionalIssues.uiSchema,
          schema: additionalIssues.schema,
          appStateSelector,
        },
        areaOfDisagreementFollowUp: {
          title: getIssueName,
          path: 'area-of-disagreement/:index',
          depends: apiVersion2,
          showPagePerItem: true,
          arrayPath: 'areaOfDisagreement',
          uiSchema: areaOfDisagreementFollowUp.uiSchema,
          schema: areaOfDisagreementFollowUp.schema,
          appStateSelector,
        },
        optIn: {
          title: 'Opt in',
          path: 'opt-in',
          uiSchema: optIn.uiSchema,
          schema: optIn.schema,
          depends: apiVersion2,
          initialData: {
            socOptIn: false,
          },
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
          depends: apiVersion2,
        },
      },
    },
    sameOffice: {
      title: 'Office of review',
      pages: {
        sameOffice: {
          title: ' ',
          path: 'office-of-review',
          uiSchema: sameOffice.uiSchema,
          schema: sameOffice.schema,
          depends: apiVersion1,
        },
      },
    },
    informalConference: {
      title: 'Request an informal conference',
      pages: {
        requestConference: {
          path: 'informal-conference',
          title: 'Request an informal conference',
          uiSchema: informalConference.uiSchema,
          schema: informalConference.schema,
        },
        representativeInfo: {
          path: 'informal-conference/representative-information',
          title: 'Representative’s information',
          depends: formData =>
            formData?.informalConference === 'rep' && apiVersion1(formData),
          uiSchema: informalConferenceRep.uiSchema,
          schema: informalConferenceRep.schema,
        },
        representativeInfoV2: {
          // changing path from v1, but this shouldn't matter since the
          // migration code returns the Veteran to the contact info page
          path: 'informal-conference/representative-info',
          title: 'Representative’s information',
          depends: formData =>
            formData?.informalConference === 'rep' && apiVersion2(formData),
          uiSchema: informalConferenceRepV2.uiSchema,
          schema: informalConferenceRepV2.schema,
        },
        availability: {
          path: 'informal-conference/availability',
          title: 'Scheduling availability',
          depends: formData =>
            formData?.informalConference !== 'no' && apiVersion1(formData),
          uiSchema: informalConferenceTimes.uiSchema,
          schema: informalConferenceTimes.schema,
        },
        conferenceTime: {
          path: 'informal-conference/conference-availability',
          title: 'Scheduling availability',
          depends: formData =>
            formData?.informalConference !== 'no' && apiVersion2(formData),
          uiSchema: informalConferenceTime.uiSchema,
          schema: informalConferenceTime.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
