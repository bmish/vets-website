import ItemLoop from '../../../../components/ItemLoop';
import CardDetailsView from '../../../../components/CardDetailsView';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  'ui:description':
    'Tell us about your spouse’s other jobs in the past 2 years.',
  personalData: {
    employmentHistory: {
      'ui:options': {
        classNames: 'vads-u-margin-top--2',
      },
      spouse: {
        spousePreviousEmployment: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: CardDetailsView,
            doNotScroll: true,
            showSave: true,
            itemName: 'a job',
            keepInPageOnReview: true,
          },
          items: {
            'ui:options': {
              classNames: 'vads-u-margin-bottom--3',
            },
            type: {
              'ui:title': 'Type of work',
              'ui:options': {
                widgetClassNames: 'input-size-3',
              },
            },
            from: monthYearUI('Date your spouse started work at this job'),
            to: monthYearUI('Date your spouse stopped work at this job'),
            employerName: {
              'ui:title': 'Employer name',
              'ui:options': {
                classNames: 'vads-u-margin-top--3',
                widgetClassNames: 'input-size-6',
              },
            },
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            spouse: {
              type: 'object',
              properties: {
                spousePreviousEmployment: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['type', 'from', 'to'],
                    properties: {
                      type: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      from: {
                        type: 'string',
                      },
                      to: {
                        type: 'string',
                      },
                      employerName: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
