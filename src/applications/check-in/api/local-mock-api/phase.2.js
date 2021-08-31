/* eslint-disable camelcase */

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const mockCheckIns = require('./mocks/check.in.response');
const mockValidates = require('./mocks/validate.responses');
const featureToggles = require('./mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: ['21-526EZ'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
          active_status: 'active',
          facilities: [
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
          ],
        },
      },
    },
    meta: { errors: null },
  },
  'GET /v0/feature_toggles': featureToggles.createFeatureToggles(
    true,
    true,
    false,
  ),

  'GET /check_in/v0/patient_check_ins/:id': (req, res) => {
    const { id } = req.params;
    return res.json(mockValidates.createMockSuccessResponse({ id }));
  },
  'POST /check_in/v0/patient_check_ins/': (_req, res) => {
    return res.json(mockCheckIns.createMockSuccessResponse({}));
  },
};

module.exports = delay(responses, 2000);
