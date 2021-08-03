import _ from 'lodash/fp';

// Example of an imported schema:
// eslint-disable-next-line no-unused-vars
import fullSchema from '../22-1990-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-1990-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import GetFormHelp from '../components/GetFormHelp';
import FormFooter from 'platform/forms/components/FormFooter';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

// eslint-disable-next-line no-unused-vars

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

// eslint-disable-next-line no-unused-vars
import * as address from 'platform/forms-system/src/js/definitions/address';
import ReviewBoxField from 'platform/forms-system/src/js/components/ReviewBoxField';
// import fullSchema from 'vets-json-schema/dist/22-1990-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// import { directDepositWarning } from '../helpers';
// import toursOfDutyUI from '../definitions/toursOfDuty';
import FullNameViewField from '../components/FullNameViewField';
import DateViewField from '../components/DateViewField';
import CustomReviewDOBField from '../containers/CustomReviewDOBField';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import EmailViewField from '../components/EmailViewField';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  bankAccount,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  bankAccount: 'bankAccount',
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  address: 'address',
  email: 'email',
  altEmail: 'altEmail',
  phoneNumber: 'phoneNumber',
};

function hasDirectDeposit(formData) {
  return formData[formFields.viewNoDirectDeposit] !== true;
}

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  serviceHistory: 'serviceHistory',
  contactInformation: 'contactInformation',
  directDeposit: 'directDeposit',
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'my-education-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1990',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your my education benefits application (22-1990) is in progress.',
    //   expired: 'Your saved my education benefits application (22-1990) has expired. If you want to apply for my education benefits, please start a new application.',
    //   saved: 'Your my education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for my education benefits.',
    noAuth:
      'Please sign in again to continue your application for my education benefits.',
  },
  title: 'Apply for VA education benefits',
  subTitle: 'Form 22-1990',
  defaultDefinitions: {
    fullName,
    // ssn,
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        [formPages.applicantInformation]: {
          path: 'applicant/information',
          title: 'Applicant Information',
          subTitle:
            'Please review your personal information and edit it if anything is incorrect.',
          uiSchema: {
            [formFields.fullName]: Object.assign({}, fullNameUI, {
              first: Object.assign({}, fullNameUI.first, {
                'ui:title': 'Your first name',
              }),
              last: Object.assign({}, fullNameUI.last, {
                'ui:title': 'Your last name',
              }),
              middle: Object.assign({}, fullNameUI.middle, {
                'ui:title': 'Your middle name',
              }),
              'ui:title': 'Your full name',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: FullNameViewField,
              },
            }),
            [formFields.dateOfBirth]: {
              ...currentOrPastDateUI('Date of birth'),
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                hideErrors: true,
                noWrapperContent: true,
                showFieldLabel: false,
                startInEdit: formData => {
                  if (!formData) {
                    return true;
                  }

                  const dateParts = formData.split('-');
                  return !isValidCurrentOrPastDate(
                    dateParts[2],
                    dateParts[1],
                    dateParts[0],
                  );
                },
                viewComponent: DateViewField,
              },
              'ui:reviewField': CustomReviewDOBField,
            },
          },
          schema: {
            type: 'object',
            required: [formFields.fullName, formFields.dateOfBirth],
            properties: {
              [formFields.fullName]: fullName,
              [formFields.dateOfBirth]: date,
            },
          },
          initialData: {
            fullName: {
              first: 'Hector',
              middle: 'Oliver',
              last: 'Stanley',
              suffix: 'Jr.',
            },
            dateOfBirth: '1992-07-23',
          },
        },
      },
    },
    // serviceHistoryChapter: {
    //   title: 'Service History',
    //   pages: {
    //     [formPages.serviceHistory]: {
    //       path: 'service-history',
    //       title: 'Service History',
    //       uiSchema: {
    //         [formFields.toursOfDuty]: toursOfDutyUI,
    //       },
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           [formFields.toursOfDuty]: toursOfDuty,
    //         },
    //       },
    //     },
    //   },
    // },
    additionalInformationChapter: {
      title: 'Contact Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [formFields.email]: {
              'ui:title': 'Your email address',
              'ui:field': ReviewBoxField,
              'ui:options': {
                viewComponent: EmailViewField,
              },
            },
            [formFields.altEmail]: {
              'ui:title': 'Secondary email',
            },
            [formFields.phoneNumber]: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.altEmail]: {
                type: 'string',
                format: 'email',
              },
              [formFields.phoneNumber]: usaPhone,
            },
          },
        },
        [formPages.directDeposit]: {
          path: 'direct-deposit',
          title: 'Direct Deposit',
          uiSchema: {
            'ui:title': 'Direct deposit',
            [formFields.viewNoDirectDeposit]: {
              'ui:title': 'I don’t want to use direct deposit',
            },
            [formFields.bankAccount]: _.merge(bankAccountUI, {
              'ui:order': [
                formFields.accountType,
                formFields.accountNumber,
                formFields.routingNumber,
              ],
              'ui:options': {
                hideIf: formData => !hasDirectDeposit(formData),
              },
              [formFields.accountType]: {
                'ui:required': hasDirectDeposit,
              },
              [formFields.accountNumber]: {
                'ui:required': hasDirectDeposit,
              },
              [formFields.routingNumber]: {
                'ui:required': hasDirectDeposit,
              },
            }),
            // [formFields.viewStopWarning]: {
            //   'ui:description': directDepositWarning,
            //   'ui:options': {
            //     hideIf: hasDirectDeposit,
            //   },
            // },
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.viewNoDirectDeposit]: {
                type: 'boolean',
              },
              [formFields.bankAccount]: bankAccount,
              [formFields.viewStopWarning]: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
