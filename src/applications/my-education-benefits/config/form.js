import React from 'react';
// import _ from 'lodash/fp';

// Example of an imported schema:
// import fullSchema from '../22-1990-schema.json';
// eslint-disable-next-line no-unused-vars
import fullSchema from '../22-1990-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-1990-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import GetFormHelp from '../components/GetFormHelp';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
// import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';

// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import toursOfDutyUI from '../definitions/toursOfDuty';
import FullNameViewField from '../components/FullNameViewField';
import FullNameReviewField from '../components/FullNameReviewField';
import DateViewField from '../components/DateViewField';
import CustomReviewDOBField from '../components/CustomReviewDOBField';
import ServicePeriodAccordionView from '../components/ServicePeriodAccordionView';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import EmailViewField from '../components/EmailViewField';
import PhoneViewField from '../components/PhoneViewField';
import AccordionField from '../components/AccordionField';
import MailingAddressReviewField from '../components/MailingAddressReviewField';
import YesNoReviewField from '../components/YesNoReviewField';
import SelectedCheckboxesReviewField from '../components/SelectedCheckboxesReviewField';
import PhoneReviewField from '../components/PhoneReviewField';

import {
  activeDutyLabel,
  selectedReserveLabel,
  unsureDescription,
} from '../helpers';

// import { directDepositWarning } from '../helpers';

import MailingAddressViewField from '../components/MailingAddressViewField';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';

import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { validatePhone, validateEmail } from '../utils/validation';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  email,
  // bankAccount,
  toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  toursOfDutyCorrect: 'toursOfDutyCorrect',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  bankAccount: 'bankAccount',
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  address: 'address',
  email: 'email',
  phoneNumber: 'phoneNumber',
  mobilePhoneNumber: 'mobilePhoneNumber',
  benefitSelection: 'benefitSelection',
  benefitEffectiveDate: 'benefitEffectiveDate',
  incorrectServiceHistoryExplanation: 'incorrectServiceHistoryExplanation',
  contactMethodRdoBtnList: 'contactMethodRdoBtnList',
  notificationTypes: 'notificationTypes',
  hasDoDLoanPaymentPeriod: 'hasDoDLoanPaymentPeriod',
  activeDutyKicker: 'activeDutyKicker',
  selectedReserveKicker: 'selectedReserveKicker',
  federallySponsoredAcademy: 'federallySponsoredAcademy',
  seniorRotcCommission: 'seniorRotcCommission',
  loanPayment: 'loanPayment',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    mailingAddress: 'mailingAddress',
    preferredContactMethod: 'preferredContactMethod',
  },
  serviceHistory: 'serviceHistory',
  benefitSelection: 'benefitSelection',
  // directDeposit: 'directDeposit',
  additionalConsiderations: {
    activeDutyKicker: {
      name: 'activeDutyKicker',
      order: 1,
    },
    reserveKicker: {
      name: 'reserveKicker',
      order: 1,
    },
    militaryAcademy: {
      name: 'militaryAcademy',
      order: 2,
    },
    seniorRotc: {
      name: 'seniorRotc',
      order: 3,
    },
    loanPayment: {
      name: 'loanPayment',
      order: 4,
    },
  },
};

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function startPhoneEditValidation({ phone }) {
  if (!phone) {
    return true;
  }
  return validatePhone(phone);
}

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category) {
  return {
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
      startInEdit: formData => startPhoneEditValidation(formData),
      viewComponent: PhoneViewField,
    },
    phone: {
      ...phoneUI(`${titleCase(category)} phone number`),
      'ui:validations': [validatePhone],
    },
    isInternational: {
      'ui:title': 'This phone number is international',
      'ui:reviewField': YesNoReviewField,
    },
    'ui:objectViewField': PhoneReviewField,
  };
}

function phoneSchema() {
  return {
    type: 'object',
    required: ['phone'],
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
      isInternational: {
        type: 'boolean',
      },
    },
  };
}
function additionalConsiderationsQuestionTitle(benefitSelection, order) {
  const isUnsure = benefitSelection === 'UNSURE';
  const pageNumber = isUnsure ? order - 1 : order;
  const totalPages = isUnsure ? 3 : 4;

  return (
    <h3 className="meb-additional-considerations-title">
      {`Question ${pageNumber} of ${totalPages}`}
    </h3>
  );
}

function AdditionalConsiderationTemplate(
  page,
  formField,
  title,
  trigger,
  info,
) {
  let additionalInfo;
  if (trigger) {
    additionalInfo = {
      'view:note': {
        'ui:description': (
          <AdditionalInfo triggerText={trigger}>
            <p>{info}</p>
          </AdditionalInfo>
        ),
      },
    };
  }

  return {
    path: page.name,
    uiSchema: {
      'ui:title': data => {
        return additionalConsiderationsQuestionTitle(
          data.formData[formFields.benefitSelection],
          page.order,
        );
      },
      [formFields[formField]]: {
        'ui:title': title,
        'ui:widget': 'radio',
      },
      ...additionalInfo,
    },
    schema: {
      type: 'object',
      required: [formField],
      properties: {
        [formFields[formField]]: {
          type: 'string',
          enum: ['Yes', 'No'],
        },
        'view:note': {
          type: 'object',
          properties: {},
        },
      },
    },
  };
}

function givingUpBenefitSelected(formData) {
  return ['ACTIVE_DUTY', 'SELECTED_RESERVE'].includes(
    formData[formFields.benefitSelection],
  );
}

function notGivingUpBenefitSelected(formData) {
  return !givingUpBenefitSelected(formData);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'my-education-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1990-MEB',
  saveInProgress: {
    messages: {
      inProgress:
        'Your my education benefits application (22-1990) is in progress.',
      expired:
        'Your saved my education benefits application (22-1990) has expired. If you want to apply for my education benefits, please start a new application.',
      saved: 'Your my education benefits application has been saved.',
    },
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
  preSubmitInfo,
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant information',
      pages: {
        [formPages.applicantInformation]: {
          title: 'Applicant information',
          path: 'applicant/information',
          subTitle: 'Review your personal information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    Any updates you make here to your personal information will
                    only apply to your education benefits. To update your
                    personal information for all of the benefits across VA,{' '}
                    <a href="https://www.va.gov/profile">
                      please go to your profile page
                    </a>
                    .
                  </p>
                </>
              ),
            },
            [formFields.fullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': 'Your first name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a first name');
                    }
                  },
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:title': 'Your last name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a last name');
                    }
                  },
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:title': 'Your middle name',
              },
              'ui:objectViewField': FullNameReviewField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: FullNameViewField,
              },
            },
            'view:dateOfBirth': {
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                startInEdit: formData => {
                  const { dateOfBirth } = formData;

                  if (!dateOfBirth) {
                    return true;
                  }

                  const dateParts = dateOfBirth.split('-');
                  return !isValidCurrentOrPastDate(
                    dateParts[2],
                    dateParts[1],
                    dateParts[0],
                  );
                },
                viewComponent: DateViewField,
              },
              [formFields.dateOfBirth]: {
                ...currentOrPastDateUI('Date of birth'),
                'ui:reviewField': CustomReviewDOBField,
              },
            },
          },
          schema: {
            type: 'object',
            required: [formFields.fullName],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.fullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              'view:dateOfBirth': {
                type: 'object',
                required: [formFields.dateOfBirth],
                properties: {
                  [formFields.dateOfBirth]: date,
                },
              },
            },
          },
          initialData: {
            fullName: {
              first: 'Hector',
              middle: 'Oliver',
              last: 'Stanley',
              suffix: 'Jr.',
            },
            'view:dateOfBirth': {
              dateOfBirth: '1992-07-23',
            },
          },
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        [formPages.contactInformation.contactInformation]: {
          title: 'Email & phone',
          path: 'contact/information',
          initialData: {
            email: {
              email: 'hector.stanley@gmail.com',
              confirmEmail: 'hector.stanley@gmail.com',
            },
            mobilePhoneNumber: {
              phone: '123-456-7890',
              isInternational: true,
            },
            phoneNumber: {
              phone: '098-765-4321',
              isInternational: false,
            },
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your phone numbers and email address</h3>
                  <p>We’ll use this information to:</p>
                  <ul>
                    <li>
                      Get in touch with you if we have questions about your
                      application
                    </li>
                    <li>
                      Communicate important information about your benefits
                    </li>
                  </ul>
                  <p>
                    Any updates you make here to your contact information will
                    only apply to your education benefits. To update your
                    contact information for all of the benefits across VA,{' '}
                    <a href="#">please go to your profile page</a>.
                  </p>
                </>
              ),
            },
            [formFields.email]: {
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: EmailViewField,
              },
              email: {
                ...emailUI('Email address'),
                'ui:validations': [validateEmail],
              },
              confirmEmail: {
                ...emailUI('Confirm email address'),
                'ui:options': {
                  ...emailUI()['ui:options'],
                  hideOnReview: true,
                },
              },
              'ui:validations': [
                (errors, field) => {
                  if (field.email !== field.confirmEmail) {
                    errors.confirmEmail.addError(
                      'Sorry, your emails must match',
                    );
                  }
                },
              ],
            },
            [formFields.mobilePhoneNumber]: phoneUISchema('mobile'),
            [formFields.phoneNumber]: phoneUISchema('home'),
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.mobilePhoneNumber]: phoneSchema(),
              [formFields.phoneNumber]: phoneSchema(),
              [formFields.email]: {
                type: 'object',
                required: [formFields.email, 'confirmEmail'],
                properties: {
                  email,
                  confirmEmail: email,
                },
              },
            },
          },
        },
        [formPages.contactInformation.mailingAddress]: {
          title: 'Mailing address',
          path: 'contact/information/mailing/address',
          initialData: {
            'view:mailingAddress': {
              livesOnMilitaryBase: false,
              [formFields.address]: {
                street: '2222 Avon Street',
                street2: 'Apt 6',
                city: 'Arlington',
                state: 'VA',
                postalCode: '22205',
              },
            },
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your mailing address</h3>
                  <p>
                    We’ll send any important information about your application
                    to this address.
                  </p>
                  <p>
                    Any updates you make here to your mailing address will only
                    apply to your education benefits. To update your mailing
                    address for all of the benefits across VA, .
                    <a href="#">please go to your profile page</a>
                  </p>
                </>
              ),
            },
            'view:mailingAddress': {
              livesOnMilitaryBase: {
                'ui:title': (
                  <span id="LiveOnMilitaryBaseTooltip">
                    I live on a United States military base outside of the
                    country
                  </span>
                ),
                // TODO: Uncomment this once this PR is merged:
                // https://github.com/department-of-veterans-affairs/vets-website/pull/18437
                // 'ui:reviewField': YesNoReviewField,
              },
              livesOnMilitaryBaseInfo: {
                'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
              },
              [formFields.address]: {
                ...address.uiSchema(''),
                street: {
                  'ui:title': 'Street Address',
                  'ui:errorMessages': {
                    required: 'Please enter your full street address',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError(
                          'Please enter your full street address',
                        );
                      }
                    },
                  ],
                },
                city: {
                  'ui:title': 'City',
                  'ui:errorMessages': {
                    required: 'Please enter a valid city',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError('Please enter a valid city');
                      }
                    },
                  ],
                },
                state: {
                  'ui:title': 'State/Province/Region',
                  'ui:errorMessages': {
                    required: 'State is required',
                  },
                },
                postalCode: {
                  'ui:title': 'Postal Code (5-digit)',
                  'ui:errorMessages': {
                    required: 'Zip code must be 5 digits',
                  },
                },
              },
              'ui:objectViewField': MailingAddressReviewField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: MailingAddressViewField,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:mailingAddress': {
                type: 'object',
                properties: {
                  livesOnMilitaryBase: {
                    type: 'boolean',
                  },
                  livesOnMilitaryBaseInfo: {
                    type: 'object',
                    properties: {},
                  },
                  [formFields.address]: {
                    ...address.schema(fullSchema, true),
                  },
                },
              },
            },
          },
        },
        [formPages.contactInformation.preferredContactMethod]: {
          path: 'contact/preferences',
          title: 'Preferred contact method',
          uiSchema: {
            'ui:description': <h3>Select your preferred contact method</h3>,
            [formFields.contactMethodRdoBtnList]: {
              'ui:title':
                'How should we contact you if we have questions about your application?',
              'ui:widget': 'radio',
              'ui:options': {
                widgetProps: {
                  Email: { 'data-info': 'email' },
                  'Mobile phone': { 'data-info': 'mobile phone' },
                  'Home phone': { 'data-info': 'home phone' },
                  Mail: { 'data-info': 'mail' },
                },
                selectedProps: {
                  Email: { 'aria-describedby': 'email' },
                  'Mobile phone': { 'aria-describedby': 'mobilePhone' },
                  'Home phone': { 'aria-describedby': 'homePhone' },
                  Mail: { 'aria-describedby': 'mail' },
                },
              },
              // 'ui:validations': [validateBooleanGroup],
              'ui:errorMessages': {
                required: 'Please select at least one way we can contact you.',
              },
            },
            [formFields.notificationTypes]: {
              'ui:title':
                'How would you like to receive notifications about your education benefits?',
              canEmailNotify: {
                'ui:title': 'Email',
              },
              canTextNotify: {
                'ui:title': 'Text message',
              },
              'ui:validations': [validateBooleanGroup],
              'ui:errorMessages': {
                atLeastOne:
                  'Please select at least one way we can send you notifications.',
              },
              'ui:options': {
                showFieldLabel: true,
              },
              'ui:objectViewField': SelectedCheckboxesReviewField,
            },
            'view:note': {
              'ui:description': (
                <p>
                  <strong>Note</strong>: Notifications may include monthly
                  enrollment verification required to receive payment. For text
                  messages, messaging and data rates may apply. At this time, VA
                  is only able to send text messages about your education
                  benefits to US-based mobile phone numbers.
                </p>
              ),
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.contactMethodRdoBtnList,
              formFields.notificationTypes,
            ],
            properties: {
              [formFields.contactMethodRdoBtnList]: {
                type: 'string',
                enum: ['Email', 'Mobile phone', 'Home phone', 'Mail'],
              },
              [formFields.notificationTypes]: {
                type: 'object',
                properties: {
                  canEmailNotify: { type: 'boolean' },
                  canTextNotify: { type: 'boolean' },
                },
              },
              'view:note': {
                type: 'object',
                properties: {},
              },
            },
          },
          // initialData: {
          //   [formFields.contactMethodRdoBtnList]: 'Email',
          //   [formFields.notificationTypes]: {
          //     canEmailNotify: true,
          //     canTextNotify: true,
          //   },
          // },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service history',
      pages: {
        [formPages.serviceHistory]: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: {
            'view:subHeading': {
              'ui:description': <h3>Review your service history</h3>,
            },
            [formFields.toursOfDuty]: {
              ...toursOfDutyUI,
              'ui:field': AccordionField,
              'ui:title': 'Service history',
              'ui:options': {
                ...toursOfDutyUI['ui:options'],
                reviewTitle: <></>,
                setEditState: () => {
                  return true;
                },
                showSave: false,
                viewField: ServicePeriodAccordionView,
                viewComponent: ServicePeriodAccordionView,
                viewOnlyMode: true,
              },
              items: {
                ...toursOfDutyUI.items,
                'ui:objectViewField': ServicePeriodAccordionView,
              },
            },
            [formFields.toursOfDutyCorrect]: {
              'ui:title': 'This information is incorrect and/or incomplete',
              'ui:reviewField': YesNoReviewField,
            },
            [formFields.incorrectServiceHistoryExplanation]: {
              'ui:title':
                'Please explain what is incorrect and/or incomplete about your service history.',
              'ui:options': {
                expandUnder: [formFields.toursOfDutyCorrect],
                hideIf: formData => !formData[formFields.toursOfDutyCorrect],
              },
              'ui:widget': 'textarea',
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeading': {
                type: 'object',
                properties: {},
              },
              [formFields.toursOfDuty]: {
                ...toursOfDuty,
                title: '', // Hack to prevent console warning
              },
              [formFields.toursOfDutyCorrect]: {
                type: 'boolean',
              },
              [formFields.incorrectServiceHistoryExplanation]: {
                type: 'string',
                maxLength: 250,
              },
            },
          },
          initialData: {
            [formFields.toursOfDuty]: [
              {
                // applyPeriodToSelected: true,
                dateRange: {
                  from: '2011-08-01',
                  to: '2014-07-30',
                },
                exclusionPeriods: [
                  {
                    from: '2011-08-01',
                    to: '2011-09-14',
                  },
                  {
                    from: '2011-11-01',
                    to: '2011-12-14',
                  },
                ],
                separationReason: 'Expiration term of service',
                serviceBranch: 'Navy',
                serviceCharacter: 'Honorable',
                // serviceStatus: 'Active Duty',
                trainingPeriods: [
                  {
                    from: '2011-08-01',
                    to: '2011-09-14',
                  },
                  {
                    from: '2011-11-01',
                    to: '2011-12-14',
                  },
                ],
              },
              {
                // applyPeriodToSelected: true,
                dateRange: {
                  from: '2015-04-04',
                  to: '2017-10-12',
                },
                separationReason: 'Disability',
                serviceBranch: 'Navy',
                serviceCharacter: 'Honorable',
                // serviceStatus: 'Active Duty',
              },
            ],
          },
        },
      },
    },
    benefitSelection: {
      title: 'Benefit selection',
      pages: {
        [formPages.benefitSelect]: {
          path: 'benefit-selection',
          title: 'Benefit selection',
          subTitle: "You're applying for the Post-9/11 GI Bill®",
          instructions:
            'Currently, you can only apply for Post-9/11 Gi Bill (Chapter 33) benefits through this application/ If you would like to apply for other benefits, please visit out How to Apply page.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h3>You’re applying for the Post-9/11 GI BIll®</h3>
                    <p>
                      Currently, you can only apply for Post-9/11 GI Bill
                      (Chapter 33) benefits through this application. If you
                      would like to apply for other benefits, please visit our{' '}
                      <a href="#">How To Apply</a> page.
                    </p>
                  </div>
                  <h3>Give up one other benefit</h3>
                  <p>
                    Because you are applying for the Post-9/11 GI Bill, you have
                    to give up one other benefit you may be eligible for.
                  </p>
                  <p>
                    <strong>This decision is final</strong>, which means you
                    can’t change your mind after you submit this application.
                  </p>
                  <AdditionalInfo triggerText="Why do I have to give up a benefit?">
                    <p>
                      Per 38 USC 3327, If you are eligible for both the
                      Post-9/11 GI Bill and other education benefits, you must
                      give up one benefit you may be eligible for.
                    </p>
                  </AdditionalInfo>
                </>
              ),
            },
            [formFields.benefitSelection]: {
              'ui:title': 'Which benefit will you give up?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  ACTIVE_DUTY: activeDutyLabel,
                  SELECTED_RESERVE: selectedReserveLabel,
                  UNSURE: "I'm not sure and I need assistance",
                },
                widgetProps: {
                  ACTIVE_DUTY: { 'data-info': 'ACTIVE_DUTY' },
                  SELECTED_RESERVE: { 'data-info': 'SELECTED_RESERVE' },
                  UNSURE: { 'data-info': 'UNSURE' },
                },
                selectedProps: {
                  ACTIVE_DUTY: { 'aria-describedby': 'ACTIVE_DUTY' },
                  SELECTED_RESERVE: { 'aria-describedby': 'SELECTED_RESERVE' },
                  UNSURE: { 'aria-describedby': 'UNSURE' },
                },
              },
              'ui:errorMessages': {
                required: 'Please select an answer.',
              },
            },
            [formFields.benefitEffectiveDate]: {
              ...dateUI('Effective date'),
              'ui:options': {
                hideIf: notGivingUpBenefitSelected,
                expandUnder: [formFields.benefitSelection],
              },
              'ui:required': givingUpBenefitSelected,
            },
            'view:effectiveDateNotes': {
              'ui:description': (
                <ul>
                  <li>
                    We’ve set the date to one year ago to begin paying you
                    immediately
                  </li>
                  <li>
                    Select a future date if you don’t need to use your benefits
                    until then
                  </li>
                  <li>
                    If your classes started less than 2 years ago, enter the
                    date they began
                  </li>
                </ul>
              ),
              'ui:options': {
                hideIf: notGivingUpBenefitSelected,
                expandUnder: [formFields.benefitSelection],
              },
            },
            'view:unsureNote': {
              'ui:description': unsureDescription,
              'ui:options': {
                hideIf: formData =>
                  formData[formFields.benefitSelection] !== 'UNSURE',
                expandUnder: [formFields.benefitSelection],
              },
            },
          },
          schema: {
            type: 'object',
            required: [formFields.benefitSelection],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.benefitSelection]: {
                type: 'string',
                enum: ['ACTIVE_DUTY', 'SELECTED_RESERVE', 'UNSURE'],
              },
              [formFields.benefitEffectiveDate]: date,
              'view:effectiveDateNotes': {
                type: 'object',
                properties: {},
              },
              'view:unsureNote': {
                type: 'object',
                properties: {},
              },
            },
          },
          initialData: {
            benefitSelection: '',
          },
        },
        // [formPages.directDeposit]: {
        //   path: 'direct-deposit',
        //   title: 'Direct Deposit',
        //   uiSchema: {
        //     'ui:title': 'Direct deposit',
        //     [formFields.viewNoDirectDeposit]: {
        //       'ui:title': 'I don’t want to use direct deposit',
        //     },
        //     [formFields.bankAccount]: _.merge(bankAccountUI, {
        //       'ui:order': [
        //         formFields.accountType,
        //         formFields.accountNumber,
        //         formFields.routingNumber,
        //       ],
        //       'ui:options': {
        //         hideIf: formData => !hasDirectDeposit(formData),
        //       },
        //       [formFields.accountType]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.accountNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.routingNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //     }),
        //     [formFields.viewStopWarning]: {
        //       'ui:description': directDepositWarning,
        //       'ui:options': {
        //         hideIf: hasDirectDeposit,
        //       },
        //     },
        //   },
        //   schema: {
        //     type: 'object',
        //     properties: {
        //       [formFields.viewNoDirectDeposit]: {
        //         type: 'boolean',
        //       },
        //       [formFields.bankAccount]: bankAccount,
        //       [formFields.viewStopWarning]: {
        //         type: 'object',
        //         properties: {},
        //       },
        //     },
        //   },
        // },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional Considerations',
      pages: {
        [formPages.additionalConsiderations.activeDutyKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.activeDutyKicker,
            formFields.activeDutyKicker,
            'Do you qualify for an active duty kicker, sometimes called a College Fund?',
            'What is an active duty kicker?',
            'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
          ),
          depends: formData =>
            formData[formFields.benefitSelection] === 'ACTIVE_DUTY',
        },
        [formPages.additionalConsiderations.reserveKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.reserveKicker,
            formFields.selectedReserveKicker,
            'Do you qualify for a reserve kicker, sometimes called a College Fund?',
            'What is a reserve kicker?',
            'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
          ),
          depends: formData =>
            formData[formFields.benefitSelection] === 'SELECTED_RESERVE',
        },
        [formPages.additionalConsiderations.militaryAcademy.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.militaryAcademy,
            formFields.federallySponsoredAcademy,
            'Did you receive a commission from a federally-sponsored U.S. military service academy?',
          ),
        },
        [formPages.additionalConsiderations.seniorRotc.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.seniorRotc,
            formFields.seniorRotcCommission,
            'Were you commissioned as a result of Senior ROTC?',
            'What is Senior ROTC?',
            'The Senior Reserve Officer Training Corps (SROTC)—more commonly referred to as the Reserve Officer Training Corps (ROTC)—is an officer training and scholarship program for postsecondary students authorized under Chapter 103 of Title 10 of the United States Code.',
          ),
        },
        [formPages.additionalConsiderations.loanPayment.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.loanPayment,
            formFields.loanPayment,
            'Do you have a period of service that the Department of Defense counts towards an education loan payment?',
            'What does this mean?',
            "This is a Loan Repayment Program, which is a special incentive that certain military branches offer to qualified applicants. Under a Loan Repayment Program, the branch of service will repay part of an applicant's qualifying student loans.",
          ),
        },
      },
    },
  },
};

export default formConfig;
