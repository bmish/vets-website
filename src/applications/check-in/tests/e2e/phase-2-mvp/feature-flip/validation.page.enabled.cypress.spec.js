import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockSession from '../../../../api/local-mock-api/mocks/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/patient.check.in.response';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v1/sessions/*', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.basic'),
      );
    });
    cy.intercept('POST', '/check_in/v1/sessions', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.full'),
      );
    });
    cy.intercept('GET', '/check_in/v1/patient_check_ins/*', req => {
      req.reply(mockPatientCheckIns.createMockSuccessResponse({}, false));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      createFeatureToggles(true, true, false, true),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Validation page enabled', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    // validation page
    cy.get('h1').contains('Check in at VA');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[label="Your last name"]')
      .shadow()
      .find('input')
      .type('Smith');
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input')
      .type('4837');
    cy.get('[data-testid=check-in-button]').click();
    // update information page
    cy.get('legend > h2').contains('information');
  });
});
