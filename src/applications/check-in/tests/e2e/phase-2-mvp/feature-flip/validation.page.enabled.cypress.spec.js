import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v0/patient_check_ins//*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/check_in/v0/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      createFeatureToggles(true, true, false),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5746 - Happy path', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    // validation page
    cy.get('h1').contains('Check in at VA');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid=check-in-button]').click();
    // update information page
    cy.get('legend > h2').contains('information');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="no-button"]').click();
    // your appointment page
    cy.get('h1').contains('Your appointment');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    // confirmation page
    cy.get('va-alert > h1').contains('checked in');
    cy.injectAxe();
    cy.axeCheck();
  });
});